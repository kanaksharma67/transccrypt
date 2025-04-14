import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Payment = () => {
  const [amount, setAmount] = useState('0.00');
  const [memo, setMemo] = useState('');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold">Make Payment</h1>
      </div>

      <div className="bg-[#1a2235] rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-gray-400 mb-2">Recipient Wallet Address</label>
          <input
            type="text"
            placeholder="Enter wallet address or search contacts"
            className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 pl-8 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Currency</label>
            <select className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white">
              <option>USD - ₹</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">
            Memo (Optional)
            <span className="ml-1 text-gray-500">ⓘ</span>
          </label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="What's this payment for?"
            className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white h-32 resize-none"
          />
        </div>

        <div className="flex justify-between items-center text-gray-400 border-t border-gray-700 pt-4">
          <span>Network Fee</span>
          <span>₹0.25</span>
        </div>

        <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Payment;