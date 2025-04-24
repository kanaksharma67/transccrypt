import React, { useState } from 'react';

const PaymentPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [amount, setAmount] = useState('');

  const handleSendPayment = async () => {
    const payload = {
      password: password,
      sender_email: email,
      destination_email: receiverEmail,
      amount: amount,
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
      } else {
        console.error('Payment failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending payment:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-8">Send Payment</h1>
      <div className="bg-gray-800/50 backdrop-blur-lg shadow-xl border border-gray-700/30 rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-gray-400 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white"
          />
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
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount to send"
            className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white"
          />
        </div>
        <button
          onClick={handleSendPayment}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Send Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
