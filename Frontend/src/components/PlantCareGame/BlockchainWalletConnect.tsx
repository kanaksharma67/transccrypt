import React, { useState } from 'react';
import { Link } from 'lucide-react';

interface BlockchainWalletConnectProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

const BlockchainWalletConnect: React.FC<BlockchainWalletConnectProps> = ({
  isOpen,
  onClose,
  onConnect,
}) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConnect = () => {
    if (!walletAddress) {
      setError('Please enter a wallet address');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate blockchain connection
    setTimeout(() => {
      setIsLoading(false);
      onConnect(walletAddress);
      onClose();
    }, 1500);
  };

  const handleDemoConnect = () => {
    setIsLoading(true);
    setError('');

    // Generate a fake stellar wallet address
    const demoAddress = 'GBXC4ADLXTJABQ7TIZR6GVS4J5LXZJGPO335BHWD3HIZHLDT6TBKJXNG';
    
    setTimeout(() => {
      setIsLoading(false);
      onConnect(demoAddress);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            Connect your wallet to track achievements on Monad blockchain and earn Stellar tokens.
          </p>
          
          <div className="space-y-2">
            <label className="block text-gray-300 text-sm font-medium">
              Stellar Wallet Address
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your Stellar wallet address"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
          
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
          >
            {isLoading ? (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : (
              <Link className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
          
          <button
            onClick={handleDemoConnect}
            disabled={isLoading}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
          >
            Use Demo Wallet
          </button>
          
          <div className="pt-2 text-xs text-gray-400">
            <p>
              By connecting a wallet, you agree to the terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainWalletConnect;
