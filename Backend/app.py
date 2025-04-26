import os
from flask import Flask, request, jsonify, send_file
from datetime import datetime
from stellar_sdk import Keypair, Server, TransactionBuilder, Network, Asset, exceptions
import firebase_admin
from firebase_admin import credentials, firestore
import requests
from flask_cors import CORS
from dotenv import load_dotenv
from bitcoinlib.wallets import Wallet
from eth_account import Account
from util_wallet import calculate_crypto_amounts, get_crypto_data, keep_payment, calculate_inr_balances, get_stellar_balance
import uuid
import segno
import io

load_dotenv()

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))
firebase_admin.initialize_app(cred)
db = firestore.client()
admin_rec_acc = os.getenv('ADMIN_RECEIVER_KEY')

server = Server(horizon_url="https://horizon-testnet.stellar.org")
network_passphrase = Network.TESTNET_NETWORK_PASSPHRASE

def is_valid_stellar_address(address):
    return address.startswith('G') and len(address) == 56

@app.route('/balance', methods=['POST'])
def get_wallet_balances():
    data = request.get_json()
    wallet_addresses = data.get('wallet_addresses')

    if not wallet_addresses:
        return jsonify({'error': 'Missing wallet_addresses'}), 400

    result = calculate_inr_balances(wallet_addresses)
    return jsonify({'balances': result})

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
        if len(user_query) > 0:
            return jsonify({'error': 'Email already registered'}), 409

        amount_data = calculate_crypto_amounts()
        print(amount_data)
        keypairs = {}
        wallet_addresses = {}
        wallet_secrets = {}

        for currency in ['btc', 'eth', 'sol']:
            keypair = Keypair.random()
            keypairs[currency] = keypair
            amount = float(amount_data[currency]['amount'])
            keep_payment(keypair.secret, admin_rec_acc, amount)  # Assuming synchronous
            wallet_addresses[currency] = str(keypair.public_key)  # Adjust based on your keypair structure
            wallet_secrets[currency] = str(keypair.secret)

        wallet_data = {
            'name': name,
            'email': email,
            'password': password,
            'wallet_addresses': wallet_addresses,
            'wallet_secrets': wallet_secrets,
            'created_at': firestore.SERVER_TIMESTAMP
        }
        wallet_dataq = {
            'name': name,
            'email': email,
            'password': password,
            'wallet_addresses': wallet_addresses,
            'wallet_secrets': wallet_secrets
        }

        # Add document to Firestore
        doc_ref, _ = db.collection('wallets').add(wallet_data)
        
        # Retrieve the newly created document
        # new_doc = doc_ref.get()
        wallet = wallet_dataq

        # Convert Firestore timestamp to ISO format
        if 'created_at' in wallet and wallet['created_at'] is not None:
            wallet['created_at'] = wallet['created_at'].isoformat()

        return jsonify(wallet), 201

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

        if password != user_data['password']:
            return jsonify({'error': 'Invalid password'}), 401

        # For example, assume balance is required only for BTC
        btc_address = user_data['wallet_addresses'].get('btc')
        account = server.accounts().account_id(btc_address).call()
        balance = account['balances'][0]['balance']

        return jsonify({
            'name': user_data['name'],
            'email': user_data['email'],
            'wallet_addresses': user_data.get('wallet_addresses'),
            'wallet_secrets': user_data.get('wallet_secrets'),
            'balance': balance,
            'password': password  # Consider omitting this from the response
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
    print(data)

    sender_email = data.get('sender_email')
    password = data.get('password')
    destination_email = data.get('destination_email')
    wallet_type = data.get('wallet_type')  # e.g., 'btc', 'eth', 'sol'
    amount = str(data.get('amount'))
    asset_code = data.get('asset_code', 'XLM')
    asset_issuer = data.get('asset_issuer', None)

    # Validate required fields
    if not sender_email or not password or not destination_email or not amount or not wallet_type:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Fetch sender wallet details
        sender_query = db.collection('wallets').where('email', '==', sender_email).get()
        if not sender_query:
            return jsonify({'error': 'Sender wallet not found'}), 404
        sender_data = sender_query[0].to_dict()

        # Validate password
        if sender_data['password'] != password:
            return jsonify({'error': 'Invalid password'}), 401

        sender = sender_data['wallet_addresses'][wallet_type]
        source_secret = sender_data['wallet_secrets'][wallet_type]

        # Fetch destination wallet details
        destination_query = db.collection('wallets').where('email', '==', destination_email).get()
        if not destination_query:
            return jsonify({'error': 'Destination wallet not found'}), 404
        destination_data = destination_query[0].to_dict()
        destination = destination_data['wallet_addresses'][wallet_type]

        # Prepare source account
        source_keypair = Keypair.from_secret(source_secret)
        source_account = server.load_account(sender)

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
            .append_payment_op(destination=destination, amount=amount, asset=asset)
            .set_timeout(30)
            .build()
        )

        transaction.sign(source_keypair)
        response = server.submit_transaction(transaction)

        # Log transaction (optional)
        db.collection('transactions').add({
            'source': sender,
            'destination': destination,
            'source_email': sender_email,
            'destination_email': destination_email,
            'wallet_type': wallet_type,
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
        print(e)
        return jsonify({'error': str(e)}), 500


@app.route('/generate-qr', methods=['POST'])
def generate_qr():
    data = request.get_json()
    if not data or 'address' not in data:
        return jsonify({"error": "Missing 'address' in request body"}), 400

    address = data['address']
    if not is_valid_stellar_address(address):
        return jsonify({"error": "Invalid Stellar address"}), 400

    try:
        stellar_uri = f"stellar:{address}?network=testnet"
        qr = segno.make(stellar_uri, error='h')

        img_io = io.BytesIO()
        qr.save(img_io, kind='png', scale=10, dark="#0B0D2B", light="#FFFFFF", border=2)
        img_io.seek(0)
        return send_file(img_io, mimetype='image/png')
    
    except Exception as e:
        return jsonify({"error": f"QR generation failed: {str(e)}"}), 500

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
   