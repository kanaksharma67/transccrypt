import os
from flask import Flask, request, jsonify
from datetime import datetime
from stellar_sdk import Keypair, Server, TransactionBuilder, Network, Asset, exceptions
import firebase_admin
from firebase_admin import credentials, firestore
import requests
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))
firebase_admin.initialize_app(cred)
db = firestore.client()

server = Server(horizon_url="https://horizon-testnet.stellar.org")
network_passphrase = Network.TESTNET_NETWORK_PASSPHRASE

@app.route('/create_wallet', methods=['POST'])
def create_wallet():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required'}), 400

    try:
        # Check if email already exists
        user_query = db.collection('wallets').where('email', '==', email).get()
        if user_query:
            return jsonify({'error': 'Email already registered'}), 409

        # Create wallet
        keypair = Keypair.random()
        public_key = keypair.public_key
        secret = keypair.secret

        # Fund using Friendbot
        response = requests.get(f"https://friendbot.stellar.org/?addr={public_key}")
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fund account with Friendbot'}), 500

        # Get balance
        account = server.accounts().account_id(public_key).call()
        balance = account['balances'][0]['balance']

        # Save to Firebase
        db.collection('wallets').add({
            'name': name,
            'email': email,
            'password': password,
            'public_key': public_key,
            'secret': secret,
            'balance': balance,
            'created_at': firestore.SERVER_TIMESTAMP
        })

        return jsonify({
            'name': name,
            'email': email,
            'public_key': public_key,
            'secret': secret,
            'balance': balance
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/access', methods=['POST'])
def access_wallet():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    try:
        user_query = db.collection('wallets').where('email', '==', email).get()
        if not user_query:
            return jsonify({'error': 'Wallet not found'}), 404

        user_data = user_query[0].to_dict()

        # Compare plain text password directly if no hashing
        if password != user_data['password']:
            return jsonify({'error': 'Invalid password'}), 401

        # Get updated balance from Stellar
        account = server.accounts().account_id(user_data['public_key']).call()
        balance = account['balances'][0]['balance']

        return jsonify({
            'name': user_data['name'],
            'email': user_data['email'],
            'public_key': user_data['public_key'],
            'secret': user_data['secret'],
            'balance': balance
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/balance', methods=['POST'])
def get_balance():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    try:
        # Lookup wallet by email
        wallet_query = db.collection('wallets').where('email', '==', email).get()
        if not wallet_query:
            return jsonify({'error': 'Wallet not found for this email'}), 404

        wallet = wallet_query[0].to_dict()
        public_key = wallet['public_key']

        # Get balance from Stellar
        account = server.accounts().account_id(public_key).call()
        balances = account.get('balances', [])

        return jsonify({'email': email, 'balances': balances})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/send', methods=['POST'])
def send_payment():
    data = request.get_json()
    sender_email = data.get('sender_email')
    password = data.get('password')
    destination_email = data.get('destination_email')
    amount = data.get('amount')
    asset_code = data.get('asset_code', 'XLM')
    asset_issuer = data.get('asset_issuer')

    if not sender_email or not password or not destination_email or not amount:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Get sender wallet
        sender_query = db.collection('wallets').where('email', '==', sender_email).where('password', '==', password).get()
        if not sender_query:
            return jsonify({'error': 'Invalid email or password'}), 404

        sender_wallet = sender_query[0].to_dict()
        source_secret = sender_wallet['secret']
        source_keypair = Keypair.from_secret(source_secret)
        source_public = source_keypair.public_key
        source_account = server.load_account(source_public)

        # Get destination wallet
        destination_query = db.collection('wallets').where('email', '==', destination_email).get()
        if not destination_query:
            return jsonify({'error': 'Destination wallet not found'}), 404

        destination_wallet = destination_query[0].to_dict()
        destination_public = destination_wallet['public_key']

        # Set asset
        if asset_code == 'XLM':
            asset = Asset.native()
        else:
            if not asset_issuer:
                return jsonify({'error': 'Asset issuer required for non-native assets'}), 400
            asset = Asset(code=asset_code, issuer=asset_issuer)

        # Build and sign transaction
        transaction = (
            TransactionBuilder(
                source_account=source_account,
                network_passphrase=network_passphrase,
                base_fee=100
            )
            .append_payment_op(destination=destination_public, amount=amount, asset=asset)
            .set_timeout(30)
            .build()
        )

        transaction.sign(source_keypair)
        response = server.submit_transaction(transaction)

        # Log transaction
        db.collection('transactions').add({
            'source_email': sender_email,
            'destination_email': destination_email,
            'source': source_public,
            'destination': destination_public,
            'amount': amount,
            'asset_code': asset_code,
            'asset_issuer': asset_issuer,
            'timestamp': firestore.SERVER_TIMESTAMP,
            'response': response
        })

        return jsonify({'status': 'success', 'response': response})

    except exceptions.BadResponseError as e:
        return jsonify({'error': e.response['extras']['result_codes']}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/transactions', methods=['POST'])
def list_transactions():
    try:
        data = request.get_json()
        email = data.get('email')

        query = db.collection('transactions').order_by('timestamp', direction=firestore.Query.DESCENDING)

        if email:
            query = query.where('source_email', '==', email)

        txs = query.stream()
        transactions = [{'id': tx.id, **tx.to_dict()} for tx in txs]
        return jsonify({'transactions': transactions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
