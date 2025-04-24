import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const PaymentPage = () => {
  const { user } = useAuth();
  const [receiverEmail, setReceiverEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [walletType, setWalletType] = useState('btc');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d{0,7}$/;
    if (regex.test(value)) {
      setAmount(value);
    }
  };

  const handleSendPayment = async () => {
    if (!receiverEmail || !amount || isNaN(Number(amount))) {
      setStatusMessage("Please fill out all fields correctly.");
      return;
    }

    setIsLoading(true);
    setStatusMessage("Processing Payment...");

    const payload = {
      sender_email: user.email,
      password: user.password,
      destination_email: receiverEmail,
      amount: amount,
      wallet_type: walletType,
    };

    try {
      const response = await fetch('http://localhost:5000/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Payment successful:', data);
        setStatusMessage("Payment Done");
      } else {
        setStatusMessage("Payment failed. Please try again.");
        console.error('Payment failed:', response.statusText);
      }
    } catch (error) {
      setStatusMessage("An error occurred during payment.");
      console.error('Error sending payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-8">Send Payment</h1>
      <div className="bg-gray-800/50 backdrop-blur-lg shadow-xl border border-gray-700/30 rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-gray-400 mb-2">Wallet Type</label>
          <select
            value={walletType}
            onChange={(e) => setWalletType(e.target.value)}
            className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white"
          >
            <option value="btc">Bitcoin</option>
            <option value="eth">Ethereum</option>
            <option value="sol">Solana</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Receiver Email</label>
          <input
            type="email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            placeholder="Receiver's email"
            className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Amount</label>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Amount to send"
            className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white"
          />
          <p className="text-sm text-gray-500 mt-1">Up to 7 decimal places allowed</p>
        </div>

        <button
          onClick={handleSendPayment}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Send Payment'}
        </button>

        {statusMessage && (
          <div className="text-center text-sm text-gray-300 mt-2">{statusMessage}</div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
