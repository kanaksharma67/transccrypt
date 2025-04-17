import React, { useState } from 'react';
import { ArrowLeft, QrCode, X } from 'lucide-react';
import { Link } from 'react-router-dom';
// import { QrReader } from 'react-qr-reader';

const Payment = () => {
  const [amount, setAmount] = useState('0.00');
  const [memo, setMemo] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleScan = (result: any) => {
    if (result) {
      setWalletAddress(result?.text);
      setShowScanner(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-14">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold">Make Payment</h1>
      </div>

      {showScanner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-lg relative">
            <button 
              onClick={() => setShowScanner(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-white">Scan QR Code</h2>
            <div className="overflow-hidden rounded-lg">
              {/* <QrReader
                onResult={handleScan}
                constraints={{ facingMode: 'environment' }}
                className="w-full"
              /> */}
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800/50 backdrop-blur-lg shadow-xl border border-gray-700/30 animate-slide-up rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-gray-400 mb-2">Recipient Wallet Address</label>
          <div className="relative">
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter wallet address or search contacts"
              className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 pr-12 text-white transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={() => setShowScanner(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <QrCode size={20} />
            </button>
          </div>
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
                className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 pl-8 text-white transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Currency</label>
            <select className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option>USD - ₹</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">
            Memo (Optional)
            <span className="ml-1 text-gray-500 cursor-help" title="Add a note about this payment">ⓘ</span>
          </label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="What's this payment for?"
            className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white h-32 resize-none transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-between items-center text-gray-400 border-t border-gray-700 pt-4">
          <span>Network Fee</span>
          <span>₹0.25</span>
        </div>

        <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800">
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Payment;