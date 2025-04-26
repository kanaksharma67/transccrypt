import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const QRPage = () => {
  const { user } = useAuth();
  const [qrImages, setQrImages] = useState({
    btc: null,
    eth: null,
    sol: null,
  });
  const [loading, setLoading] = useState(true);

  const generateQR = async (label: string, address: string) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/generate-qr',
        { address },
        { responseType: 'blob' }
      );
      const imageURL = URL.createObjectURL(response.data);
      return imageURL;
    } catch (error) {
      console.error(`Error generating ${label} QR:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchQRCodes = async () => {
      setLoading(true);
      const btcQR = await generateQR('btc', user.wallet_addresses.btc);
      const ethQR = await generateQR('eth', user.wallet_addresses.eth);
      const solQR = await generateQR('sol', user.wallet_addresses.sol);
      setQrImages({ btc: btcQR, eth: ethQR, sol: solQR });
      setLoading(false);
    };

    if (user?.wallet_addresses) {
      fetchQRCodes();
    }
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-8">Send Payment</h1>
      <div className="bg-gray-800/50 backdrop-blur-lg shadow-xl border border-gray-700/30 rounded-lg p-6 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-white">Generating QR codes...</span>
          </div>
        ) : (
          <div className="flex justify-between gap-4">
            {['btc', 'eth', 'sol'].map((key) => (
              <img
                key={key}
                src={qrImages[key]}
                alt={`${key.toUpperCase()} QR`}
                className="rounded-lg w-48 h-48 object-contain border border-gray-700"
              />
            ))}
          </div>
        )}
        <button
          disabled
          className="w-full bg-gray-600 text-white py-3 rounded-lg cursor-not-allowed opacity-50"
        >
          Send Payment
        </button>
      </div>
    </div>
  );
  
};

export default QRPage;
