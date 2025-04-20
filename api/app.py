import os
from flask import Flask, request, jsonify
from datetime import datetime
from stellar_sdk import Keypair, Server, TransactionBuilder, Network, Asset, exceptions
import firebase_admin
from firebase_admin import credentials, firestore
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Flask setup
app = Flask(__name__)

# Firebase setup
cred = credentials.Certificate(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))
firebase_admin.initialize_app(cred)
db = firestore.client()

# Stellar setup
server = Server(horizon_url="https://horizon-testnet.stellar.org")
network_passphrase = Network.TESTNET_NETWORK_PASSPHRASE

@app.route('/create_wallet', methods=['GET'])
def create_wallet():
    try:
        keypair = Keypair.random()
        public_key = keypair.public_key
        secret = keypair.secret

        # Fund using Friendbot
        response = requests.get(f"https://friendbot.stellar.org/?addr={public_key}")
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fund account with Friendbot'}), 500

        # Get balance
        account = server.accounts().account_id(public_key).call()
        balance = account['balances'][0]['balance']  # usually XLM balance

        # Save to Firebase
        db.collection('wallets').add({
            'public_key': public_key,
            'secret': secret,
            'balance': balance,
            'created_at': firestore.SERVER_TIMESTAMP
        })

        return jsonify({'public_key': public_key, 'secret': secret})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/balance', methods=['POST'])
def get_balance():
    data = request.get_json()
    public_key = data.get('public_key')

    if not public_key:
        return jsonify({'error': 'Public key is required'}), 400

    try:
        account = server.accounts().account_id(public_key).call()
        balances = account.get('balances', [])
        return jsonify({'balances': balances})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/send', methods=['POST'])
def send_payment():
    data = request.get_json()
    source_secret = data.get('source_secret')
    destination = data.get('destination')
    amount = data.get('amount')
    asset_code = data.get('asset_code', 'XLM')
    asset_issuer = data.get('asset_issuer')

    if not source_secret or not destination or not amount:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        source_keypair = Keypair.from_secret(source_secret)
        source_public = source_keypair.public_key
        source_account = server.load_account(source_public)

        if asset_code == 'XLM':
            asset = Asset.native()
        else:
            if not asset_issuer:
                return jsonify({'error': 'Asset issuer required for non-native assets'}), 400
            asset = Asset(code=asset_code, issuer=asset_issuer)

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

        # Save transaction to Firestore
        db.collection('transactions').add({
            'source': source_public,
            'destination': destination,
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

@app.route('/request_transaction', methods=['POST'])
def request_transaction():
    data = request.get_json()
    to_address = data.get('to')
    amount = data.get('amount')

    if not to_address or not amount:
        return jsonify({'error': 'Missing "to" or "amount" in request'}), 400

    request_entry = {
        'to': to_address,
        'amount': amount,
        'status': 'pending',
        'timestamp': firestore.SERVER_TIMESTAMP
    }

    doc_ref = db.collection('transaction_requests').add(request_entry)
    return jsonify({'status': 'request_received', 'request_id': doc_ref[1].id})

@app.route('/pending_transactions', methods=['GET'])
def pending_transactions():
    try:
        docs = db.collection('transaction_requests').where('status', '==', 'pending').stream()
        pending = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return jsonify({'pending_transactions': pending})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update_transaction_status', methods=['POST'])
def update_transaction_status():
    data = request.get_json()
    request_id = data.get('request_id')
    new_status = data.get('status')

    if not request_id or not new_status:
        return jsonify({'error': 'Missing "request_id" or "status" in request'}), 400

    try:
        db.collection('transaction_requests').document(request_id).update({'status': new_status})
        return jsonify({'status': 'updated'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/transactions', methods=['GET'])
def list_transactions():
    try:
        txs = db.collection('transactions').order_by('timestamp', direction=firestore.Query.DESCENDING).stream()
        transactions = [{'id': tx.id, **tx.to_dict()} for tx in txs]
        return jsonify({'transactions': transactions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
