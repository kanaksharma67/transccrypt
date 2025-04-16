import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
      isMetaMask?: boolean;
    };
  }
}



interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [walletStatus, setWalletStatus] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  

  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const connectWallet = async () => {
    setIsLoading(true);
    setWalletStatus('Connecting...');

    try {
      if (!window.ethereum?.isMetaMask) {
        throw new Error('MetaMask not installed');
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned');
      }

      const account = accounts[0];
      setWalletStatus(`Connected: ${formatAddress(account)}`);
    } catch (error) {
      console.error('Wallet connection error:', error);
      setWalletStatus(
        error instanceof Error 
          ? error.message 
          : 'Failed to connect wallet'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login logic
        console.log('Logging in with:', email, password);
        // Add your actual authentication logic here
      } else {
        // Signup logic
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        console.log('Signing up with:', email, password);
        // Add your actual registration logic here
      }
    } catch (error) {
      if (error instanceof Error) {
        setWalletStatus(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-navy-900 w-full max-w-md rounded-lg shadow-xl overflow-hidden"
          >
            <div className="relative p-6 bg-slate-800">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal">
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-center mb-6 text-purple-400">
                {isLogin ? 'Login' : 'Create Account'}
              </h2>

              <div className="flex mb-6 bg-navy-950 rounded-lg p-1">
                <button
                  type="button"
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    isLogin ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-purple-300'
                  }`}
                  onClick={() => setIsLogin(true)}
                  disabled={isLoading}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    !isLogin ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-purple-300'
                  }`}
                  onClick={() => setIsLogin(false)}
                  disabled={isLoading}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-navy-950 border border-blue-900 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    aria-label="Email address"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-navy-950 border border-blue-900 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    aria-label="Password"
                    minLength={6}
                  />
                </div>

                {!isLogin && (
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full bg-navy-950 border border-blue-900 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      aria-label="Confirm password"
                      minLength={6}
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="text-center">
                    <button
                      type="button"
                      className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                      onClick={() => alert('Password reset functionality')}
                      disabled={isLoading}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center justify-center">
                      Processing...
                    </span>
                  ) : (
                    isLogin ? 'Login' : 'Sign Up'
                  )}
                </button>

                <div className="relative flex items-center my-4">
                  <div className="flex-grow border-t border-blue-900"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                  <div className="flex-grow border-t border-blue-900"></div>
                </div>

                <button
                  type="button"
                  onClick={connectWallet}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </button>

                {walletStatus && (
                  <p className={`text-center text-sm mt-2 ${
                    walletStatus.includes('Connected') 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {walletStatus}
                  </p>
                )}

                <div className="text-center text-sm text-gray-400">
                  {isLogin ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                        disabled={isLoading}
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                        disabled={isLoading}
                      >
                        Login
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
