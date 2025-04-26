from stellar_sdk import Server, Keypair, TransactionBuilder, Network, Asset, exceptions
import requests
server = Server(horizon_url="https://horizon.stellar.org")


def get_stellar_balance(public_key):
    try:
        account = server.accounts().account_id(public_key).call()
        for balance in account['balances']:
            if balance['asset_type'] == 'native':
                return float(balance['balance'])
        return 0.0
    except Exception as e:
        print(f"Balance error ({public_key}):", e)
        return 0.0

def get_crypto_data():
    url = 'https://api.coingecko.com/api/v3/simple/price'
    params = {
        'ids': 'bitcoin,ethereum,solana',
        'vs_currencies': 'inr',
        'include_24hr_change': 'true'
    }
    response = requests.get(url, params=params)
    data = response.json()
    return {
        'BTC': {
            'price_inr': data['bitcoin']['inr'],
            'change_24h': data['bitcoin']['inr_24h_change']
        },
        'ETH': {
            'price_inr': data['ethereum']['inr'],
            'change_24h': data['ethereum']['inr_24h_change']
        },
        'SOL': {
            'price_inr': data['solana']['inr'],
            'change_24h': data['solana']['inr_24h_change']
        }
    }

def calculate_inr_balances(wallet_addresses):
    crypto_data = get_crypto_data()
    balances_inr = {}
    for coin, address in wallet_addresses.items():
        balance = get_stellar_balance(address)
        price_inr = crypto_data[coin.upper()]['price_inr']
        balances_inr[coin.upper()] = {
            'balance': round(balance, 6),
            'price_inr': round(price_inr, 2),
            'inr_value': round(balance * price_inr, 2),
            'change_24h': round(crypto_data[coin.upper()]['change_24h'], 2)
        }
    return balances_inr

def calculate_crypto_amounts(total_inr=10000):
    crypto_data = get_crypto_data()

    num_coins = len(crypto_data)
    per_coin_inr = total_inr / num_coins

    amounts = {}
    for coin, data in crypto_data.items():
        amount = per_coin_inr / data['price_inr']
        amounts[coin.lower()] = {
            'amount': round(amount, 8),
            'price_inr': data['price_inr'],
            'change_24h': round(data['change_24h'], 2),
            'inr_equivalent': round(per_coin_inr, 2)
        }
    return amounts

def wait_for_account_activation(public_key, retries=5, delay=2):
    import time
    for _ in range(retries):
        try:
            server.load_account(public_key)
            return True
        except exceptions.NotFoundError:
            time.sleep(delay)
    raise Exception(f"Account {public_key} was not activated after waiting.")

def keep_payment(sender_secret_key, receiver_public_key, retain_amount):
    from stellar_sdk import Server, Keypair, TransactionBuilder, Network, Asset, exceptions
    import requests
    import time

    # Convert retain_amount to float
    retain_amount = float(retain_amount)

    server = Server("https://horizon-testnet.stellar.org")
    network_passphrase = Network.TESTNET_NETWORK_PASSPHRASE

    sender_keypair = Keypair.from_secret(sender_secret_key)
    sender_public_key = sender_keypair.public_key

    # Define the wait_for_account_activation function
    def wait_for_account_activation(server, account_id, max_attempts=10, delay=1):
        """Wait for an account to be activated on the network"""
        for attempt in range(max_attempts):
            try:
                server.load_account(account_id)
                return True  # Account found
            except exceptions.NotFoundError:
                time.sleep(delay)  # Wait before trying again
        raise Exception(f"Account {account_id} not activated after {max_attempts} attempts")

    # Ensure sender account exists
    try:
        server.load_account(sender_public_key)
    except exceptions.NotFoundError:
        response = requests.get(f"https://friendbot.stellar.org/?addr={sender_public_key}")
        if response.status_code != 200:
            raise Exception(f"Friendbot failed to fund the sender account: {response.text}")
        wait_for_account_activation(server, sender_public_key)

    # Ensure receiver account exists
    try:
        server.load_account(receiver_public_key)
    except exceptions.NotFoundError:
        response = requests.get(f"https://friendbot.stellar.org/?addr={receiver_public_key}")
        if response.status_code != 200:
            raise Exception(f"Friendbot failed to fund the receiver account: {response.text}")
        wait_for_account_activation(server, receiver_public_key)

    # Get sender account details and balance
    sender_account_data = server.accounts().account_id(sender_public_key).call()
    subentry_count = int(sender_account_data.get('subentry_count', 0))  # Ensure integer type

    xlm_balance = next(
        float(b['balance']) for b in sender_account_data['balances'] if b['asset_type'] == 'native'
    )

    # Calculate minimum reserve and transferable amount
    base_reserve = 0.5
    min_balance = base_reserve * (2 + subentry_count)
    transfer_amount = round(xlm_balance - retain_amount - min_balance, 7)

    if transfer_amount <= 0:
        raise Exception("Insufficient balance to retain the specified amount and meet minimum reserve requirements.")

    # Build and send the transaction
    sender_account = server.load_account(account_id=sender_public_key)

    transaction = (
        TransactionBuilder(
            source_account=sender_account,
            network_passphrase=network_passphrase,
            base_fee=100
        )
        .add_text_memo("Stellar Payment")
        .append_payment_op(destination=receiver_public_key, amount=str(transfer_amount), asset=Asset.native())
        .set_timeout(30)
        .build()
    )

    transaction.sign(sender_keypair)
    response = server.submit_transaction(transaction)
    return response


# print(calculate_crypto_amounts(10000))