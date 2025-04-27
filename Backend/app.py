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
from util_wallet import calculate_crypto_amounts, get_crypto_data, keep_payment, calculate_inr_balances, get_stellar_balance, send_payment_and_show_balances, get_exchange_rate, get_crypto_price_in_inr
import uuid
from concurrent.futures import ThreadPoolExecutor
import segno
import io
import uuid
import requests

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

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Stellar Wallet API!"})

@app.route('/live-rates', methods=['POST'])
def convert_crypto():
    try:
        data = request.get_json()
        amount = data.get('amount')
        crypto_symbol = data.get('crypto_symbol').upper()
        target_currency = data.get('target_currency').upper()

        if crypto_symbol not in ['BTC', 'ETH', 'SOL']:
            return jsonify({'error': 'Invalid crypto symbol'}), 400

        if target_currency not in ['INR', 'USD']:
            return jsonify({'error': 'Invalid target currency'}), 400

        crypto_data = get_crypto_data()
        crypto_inr_price = crypto_data[crypto_symbol]['price_inr']

        if target_currency == 'INR':
            converted_price = amount * crypto_inr_price
        else:
            # Convert crypto INR price to USD
            inr_to_usd_rate = get_exchange_rate('INR', 'USD')
            crypto_usd_price = crypto_inr_price * inr_to_usd_rate
            converted_price = amount * crypto_usd_price

        # Also prepare prices for 1 BTC, 1 ETH, 1 SOL
        prices = {}
        for symbol in ['BTC', 'ETH', 'SOL']:
            price_inr = crypto_data[symbol]['price_inr']
            if target_currency == 'INR':
                price = price_inr
            else:
                price = price_inr * inr_to_usd_rate
            prices[symbol] = price

        response = {
            'converted_value': round(converted_price, 2),
            'prices_for_1_unit': {
                'BTC': round(prices['BTC'], 2),
                'ETH': round(prices['ETH'], 2),
                'SOL': round(prices['SOL'], 2)
            }
        }

        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/convert', methods=['POST'])
def convert_crypto_to_currency():
    try:
        data = request.get_json()
        sender_email = data.get('sender_email')
        password = data.get('password')
        crypto_symbol = data.get('crypto_symbol').upper()
        amount_crypto = float(data.get('amount'))
        target_currency = data.get('target_currency').upper()

        # Validate input
        if not all([sender_email, password, crypto_symbol, amount_crypto, target_currency]):
            return jsonify({"error": "Missing required parameters"}), 400

        # Fetch user wallet
        user_query = db.collection('wallets').where('email', '==', sender_email).limit(1).stream()
        user_doc = next(user_query, None)
        if not user_doc:
            return jsonify({"error": "User not found"}), 404

        user_data = user_doc.to_dict()

        if user_data.get('password') != password:
            return jsonify({"error": "Incorrect password"}), 401

        wallet_secrets = user_data.get('wallet_secrets', {})

        # Step 1: Get crypto price in INR
        crypto_data = get_crypto_data()
        if crypto_symbol not in crypto_data:
            return jsonify({"error": f"Unsupported crypto symbol: {crypto_symbol}"}), 400

        crypto_inr_price = crypto_data[crypto_symbol]['price_inr']

        # Step 2: Calculate INR value of crypto
        amount_in_inr = amount_crypto * crypto_inr_price

        # Step 3: Convert INR to target currency (if needed)
        if target_currency == 'INR':
            final_amount = amount_in_inr
        else:
            exchange_rate = get_exchange_rate('INR', target_currency)
            if not exchange_rate:
                return jsonify({"error": f"Unable to fetch exchange rate INR -> {target_currency}"}), 500
            final_amount = amount_in_inr * exchange_rate

        # Step 4: Apply 2.5% fee
        fee_percentage = 2.5
        net_amount = final_amount * (1 - fee_percentage / 100)

        # Step 5: Perform crypto transfer to admin
        sender_secret = wallet_secrets.get(crypto_symbol.lower())
        if not sender_secret:
            return jsonify({"error": f"{crypto_symbol} wallet not configured for user"}), 400

        transaction_hash = send_payment_and_show_balances(
            sender_secret,
            admin_rec_acc,
            amount_crypto
        )

        if not transaction_hash:
            return jsonify({"error": "Crypto transfer failed"}), 500

        # Step 6: Update user's INR balance
        user_doc_ref = db.collection('wallets').document(user_doc.id)
        user_snapshot = user_doc_ref.get()
        current_balance = user_snapshot.to_dict().get('inr_balance', 0)

        updated_balance = current_balance + net_amount
        user_doc_ref.update({'inr_balance': updated_balance})

        # Step 7: Save transaction to Firestore
        transaction_record = {
            "email": sender_email,
            "crypto_symbol": crypto_symbol,
            "amount_crypto": amount_crypto,
            "value_in_inr": amount_in_inr,
            "final_value": final_amount,
            "net_value_after_fee": net_amount,
            "target_currency": target_currency,
            "transaction_type": "convert",
            "transaction_hash": transaction_hash,
            "fee_percentage": fee_percentage,
            "timestamp": firestore.SERVER_TIMESTAMP
        }
        db.collection('transactions').add(transaction_record)

        return jsonify({
            "message": "Conversion successful",
            "crypto_amount": amount_crypto,
            "crypto_symbol": crypto_symbol,
            "net_value_after_fee": net_amount,
            "target_currency": target_currency,
            "transaction_hash": transaction_hash
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/balance', methods=['POST'])
def balance():
    data = request.get_json()
    wallet_addresses = data.get('wallet_addresses', {})
    btc_address = wallet_addresses.get('btc')
    eth_address = wallet_addresses.get('eth')
    sol_address = wallet_addresses.get('sol')
    inr_address = wallet_addresses.get('inr', None)  # New

    # Fetch balances from Stellar testnet
    def get_stellar_balance(address):
        url = f'https://horizon-testnet.stellar.org/accounts/{address}'
        response = requests.get(url)
        if response.status_code != 200:
            return 0.0
        account_data = response.json()
        balances = account_data.get('balances', [])
        for balance in balances:
            if balance.get('asset_type') == 'native':
                return float(balance.get('balance', 0.0))
        return 0.0

    btc_balance = get_stellar_balance(btc_address)
    eth_balance = get_stellar_balance(eth_address)
    sol_balance = get_stellar_balance(sol_address)

    # Fetch crypto price and 24h change
    crypto_data = get_crypto_data()

    # Handle INR balance (default 10000 if missing)
    inr_balance = next((doc.to_dict().get('inr_balance') for doc in db.collection('wallets').where('wallet_addresses.btc', '==', btc_address).stream()), None)
    if inr_balance is None:
        inr_balance = 10000.0
    else:
        inr_balance = float(inr_balance)

    # Handle USD balance (default 10000 if missing)

    result = {
        'BTC': {
            'balance': btc_balance,
            'price_inr': crypto_data['BTC']['price_inr'],
            'change_24h': round(crypto_data['BTC']['change_24h'], 2),
            'inr_value': round(btc_balance * crypto_data['BTC']['price_inr'], 2)
        },
        'ETH': {
            'balance': eth_balance,
            'price_inr': crypto_data['ETH']['price_inr'],
            'change_24h': round(crypto_data['ETH']['change_24h'], 2),
            'inr_value': round(eth_balance * crypto_data['ETH']['price_inr'], 2)
        },
        'SOL': {
            'balance': sol_balance,
            'price_inr': crypto_data['SOL']['price_inr'],
            'change_24h': round(crypto_data['SOL']['change_24h'], 2),
            'inr_value': round(sol_balance * crypto_data['SOL']['price_inr'], 2)
        },
        'INR': {
            'balance': round(inr_balance, 2),
            'price_inr': 1,  # 1 INR == 1 INR
            'change_24h': 0,  # No fluctuation
            'inr_value': round(inr_balance, 2)
        }
    }

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
        amounts = calculate_crypto_amounts()
        # Check if email already exists
        user_query = db.collection('wallets').where('email', '==', email).get()
        if user_query:
            return jsonify({'error': 'Email already registered'}), 409

        wallet_addresses = {}
        wallet_secrets = {}

        def create_single_wallet(currency, amounts, admin_rec_acc):
            keypair = Keypair.random()
            public_key = keypair.public_key
            secret = keypair.secret

            # Fund the account using Friendbot
            response = requests.get(f'https://horizon-testnet.stellar.org/friendbot?addr={public_key}')
            if response.status_code != 200:
                raise Exception(f'Failed to fund {currency} wallet: {response.text}')

            # After funding, transfer back
            send_payment_and_show_balances(secret, admin_rec_acc, round(9500 - amounts[currency]['amount'],7))

            return currency, public_key, secret

        with ThreadPoolExecutor() as executor:
            futures = []
            for currency in ['btc', 'eth', 'sol']:
                futures.append(executor.submit(create_single_wallet, currency, amounts, admin_rec_acc))

            for future in futures:
                currency, public_key, secret = future.result()
                wallet_addresses[currency] = public_key
                wallet_secrets[currency] = secret

        # Create a simple INR wallet
        wallet_addresses['inr'] = f"inr_wallet_for_{email}"
        wallet_secrets['inr'] = None  # No secret needed for INR wallet

        wallet_data = {
            'name': name,
            'email': email,
            'password': password,
            'wallet_addresses': wallet_addresses,
            'wallet_secrets': wallet_secrets,
            'created_at': firestore.SERVER_TIMESTAMP
        }

        # Add document to Firestore
        db.collection('wallets').add(wallet_data)

        return jsonify({'message': 'Wallet created successfully', 'wallet_addresses': wallet_addresses}), 201

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

        wallet_addresses = user_data.get('wallet_addresses', {})
        wallet_secrets = user_data.get('wallet_secrets', {})

        # Ensure INR wallet is present
        if 'inr' not in wallet_addresses:
            wallet_addresses['inr'] = f"inr_wallet_for_{email}"
            wallet_secrets['inr'] = None

        return jsonify({
            'name': user_data['name'],
            'email': user_data['email'],
            'wallet_addresses': wallet_addresses,
            'wallet_secrets': wallet_secrets,
            'password': password  # Included as per your current setup
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/send', methods=['POST'])
def send_payment():
    try:
        # Parse request body
        data = request.get_json()
        print(data)
        sender_email = data.get('sender_email')
        password = data.get('password')
        destination_email = data.get('destination_email')
        amount = data.get('amount')
        wallet_type = data.get('wallet_type')

        # Validate input
        if not all([sender_email, password, destination_email, amount, wallet_type]):
            return jsonify({"error": "Missing required parameters"}), 400

        # Query sender wallet info by email
        sender_query = db.collection('wallets').where('email', '==', sender_email).limit(1).stream()
        sender_doc = next(sender_query, None)
        if not sender_doc:
            return jsonify({"error": "Sender not found"}), 404

        sender_data = sender_doc.to_dict()

        # Password check
        if sender_data.get('password') != password:
            return jsonify({"error": "Incorrect password"}), 401

        # Get sender's wallet secret (for crypto wallets)
        sender_wallet_secret = sender_data.get('wallet_secrets', {}).get(wallet_type)
        if wallet_type not in ['inr'] and not sender_wallet_secret:
            return jsonify({"error": f"Sender does not have a {wallet_type} wallet"}), 404

        # Query receiver wallet info by email
        receiver_query = db.collection('wallets').where('email', '==', destination_email).limit(1).stream()
        receiver_doc = next(receiver_query, None)
        if not receiver_doc:
            return jsonify({"error": "Receiver not found"}), 404

        receiver_data = receiver_doc.to_dict()

        # Get receiver's wallet address
        receiver_wallet_address = receiver_data.get('wallet_addresses', {}).get(wallet_type)
        if not receiver_wallet_address:
            return jsonify({"error": f"Receiver does not have a {wallet_type} wallet"}), 404

        if wallet_type in ['inr']:
            # For INR and USD, simulate transaction
            transaction_response = str(uuid.uuid4())
        else:
            # Blockchain payment
            transaction_response = send_payment_and_show_balances(
                sender_wallet_secret,
                receiver_wallet_address,
                amount
            )
            if not transaction_response:
                return jsonify({"error": "Transaction failed"}), 500

        # Save transaction to 'transactions' collection for sender (sent)
        sender_transaction = {
            "email": sender_email,
            "destination_email": destination_email,
            "amount": amount,
            "wallet_type": wallet_type,
            "transaction_type": "sent",
            "transaction_hash": transaction_response,
            "timestamp": firestore.SERVER_TIMESTAMP
        }
        db.collection('transactions').add(sender_transaction)

        # Save transaction to 'transactions' collection for receiver (received)
        receiver_transaction = {
            "email": destination_email,
            "source_email": sender_email,
            "amount": amount,
            "wallet_type": wallet_type,
            "transaction_type": "received",
            "transaction_hash": transaction_response,
            "timestamp": firestore.SERVER_TIMESTAMP
        }
        db.collection('transactions').add(receiver_transaction)

        # Success response
        return jsonify({
            "message": "Transaction successful",
            "transaction_hash": transaction_response
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
       
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
def get_transactions():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Authenticate user by querying the 'wallets' collection
    wallets_ref = db.collection('wallets')
    query = wallets_ref.where('email', '==', email).where('password', '==', password).limit(1)
    results = query.stream()
    user_doc = next(results, None)

    if not user_doc:
        return jsonify({"error": "Invalid credentials"}), 401

    # Retrieve transactions associated with the authenticated user
    transactions_ref = db.collection('transactions').where('email', '==', email)
    docs = transactions_ref.stream()

    transactions = []

    def safe_float(value, default=0.0):
        try:
            return float(value)
        except (ValueError, TypeError):
            return default

    for idx, doc in enumerate(docs, start=1):
        record = doc.to_dict()

        tx_type = record.get('transaction_type', 'unknown')

        if tx_type == 'sent':
            name = record.get('destination_email', 'Unknown Recipient')
            raw_amount = record.get('amount', 0)
            amount = -abs(safe_float(raw_amount))
        elif tx_type == 'received':
            name = record.get('source_email', 'Unknown Sender')
            raw_amount = record.get('amount', 0)
            amount = abs(safe_float(raw_amount))
        elif tx_type == 'convert':
            source = record.get('crypto_symbol', '')
            target = record.get('target_currency', '')
            name = f"{source} to {target}"
            raw_net_value = record.get('net_value_after_fee', 0)
            amount = abs(safe_float(raw_net_value))
        else:
            name = "Unknown"
            amount = 0

        # Format the timestamp
        timestamp = record.get('timestamp')
        if timestamp:
            if isinstance(timestamp, datetime):
                date = timestamp.strftime('%Y-%m-%d')
            else:
                date = timestamp.to_datetime().strftime('%Y-%m-%d')
        else:
            date = 'Unknown'

        transactions.append({
            "id": idx,
            "type": tx_type,
            "name": name,
            "date": date,
            "amount": amount,
            "status": "completed"  # Assuming all are completed
        })

    return jsonify({"transactions": transactions})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
   