import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from '@/firebase/firebaseconfig';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
      isMetaMask?: boolean;
    };
    coinbaseWalletExtension?: {
      request: (args: { method: string }) => Promise<string[]>;
    };
  }
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  name: string;
  email: string;
  password: string;
  balance: number;
  wallet_addresses: {
    btc: string;
    eth: string;
    sol: string;
  };
  wallet_secrets: {
    btc: string;
    eth: string;
    sol: string;
  };
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [walletStatus, setWalletStatus] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [faceCaptureStatus, setFaceCaptureStatus] = useState('');
  const { login } = useAuth();

  const navigate = useNavigate();

  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const connectMetaMask = async () => {
    setIsLoading(true);
    setWalletStatus('Connecting MetaMask...');
    setAuthError('');

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
      setWalletStatus(`Connected with MetaMask: ${formatAddress(account)}`);
    } catch (error) {
      console.error('MetaMask connection error:', error);
      setWalletStatus(
        error instanceof Error 
          ? error.message 
          : 'Failed to connect MetaMask'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const connectCoinbase = async () => {
    setIsLoading(true);
    setWalletStatus('Connecting Coinbase Wallet...');
    setAuthError('');

    try {
      if (!window.coinbaseWalletExtension) {
        throw new Error('Coinbase Wallet extension not detected');
      }

      const accounts = await window.coinbaseWalletExtension.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned');
      }

      const account = accounts[0];
      setWalletStatus(`Connected with Coinbase: ${formatAddress(account)}`);
    } catch (error) {
      console.error('Coinbase Wallet connection error:', error);
      setWalletStatus(
        error instanceof Error 
          ? error.message 
          : 'Failed to connect Coinbase Wallet'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceRecognition = () => {
    setIsLoading(true);
    setFaceCaptureStatus('Initializing face recognition...');
    
    // Simulate face recognition process
    setTimeout(() => {
      setFaceCaptureStatus('Face recognized successfully!');
      setIsLoading(false);
      
      // In a real app, you would integrate with a face recognition API here
      // and handle the actual recognition process
    }, 2000);
  };

  const handleFaceCapture = () => {
    setIsLoading(true);
    setFaceCaptureStatus('Preparing camera for face capture...');
    
    // Simulate face capture process
    setTimeout(() => {
      setFaceCaptureStatus('Face captured successfully!');
      setIsLoading(false);
      
      // In a real app, you would integrate with a camera API here
      // and handle the actual face capture process
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    setWalletStatus('');

    try {
      const endpoint = isLogin ? '/access' : '/create_wallet';
      const payload = isLogin
        ? { email, password }
        : { name: email.split('@')[0], email, password };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const res = await response.json();
      
      console.log('Response data:', res); // Log the response data for debugging
      login(res); 

      if (!response.ok) {
        const errorMsg = res.error || 'Authentication failed';
        setAuthError(errorMsg);
        return;
      }

      setUser(res);
      onClose();
    } catch (error: any) {
      console.error('Authentication error:', error);
      setAuthError(error.message || 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setAuthError('Please enter your email first');
      return;
    }

    setIsLoading(true);
    setAuthError('');
    setResetSent(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setAuthError('Password reset link sent to your email. Check your inbox (and spam folder).');
    } catch (error: any) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to send reset email';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address';
      }
      
      setAuthError(errorMessage);
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
                  onClick={() => {
                    setIsLogin(true);
                    setAuthError('');
                    setWalletStatus('');
                    setResetSent(false);
                    setFaceCaptureStatus('');
                  }}
                  disabled={isLoading}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    !isLogin ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-purple-300'
                  }`}
                  onClick={() => {
                    setIsLogin(false);
                    setAuthError('');
                    setWalletStatus('');
                    setResetSent(false);
                    setFaceCaptureStatus('');
                  }}
                  disabled={isLoading}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {authError && (
                  <div className={`p-3 rounded-md text-sm ${
                    resetSent 
                      ? 'bg-green-900/50 text-green-300' 
                      : 'bg-red-900/50 text-red-300'
                  }`}>
                    {authError}
                  </div>
                )}

                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-gray-800 border border-blue-900 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors focus:bg-gray-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    aria-label="Email address"
                  />
                </div>
                
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full bg-gray-800 border border-blue-900 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors focus:bg-gray-700 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    aria-label="Password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <span className="text-xs">Hide</span>
                    ) : (
                      <span className="text-xs">Show</span>
                    )}
                  </button>
                </div>

                {!isLogin && (
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="w-full bg-gray-800 border border-blue-900 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors focus:bg-gray-700 pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      aria-label="Confirm password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <span className="text-xs">Hide</span>
                      ) : (
                        <span className="text-xs">Show</span>
                      )}
                    </button>
                  </div>
                )}

                {isLogin && (
                  <div className="text-center">
                    <button
                      type="button"
                      className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                      onClick={handleForgotPassword}
                      disabled={isLoading || resetSent}
                    >
                      {resetSent ? 'Reset email sent' : 'Forgot password?'}
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

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={connectMetaMask}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    <img 
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAABNVBMVEX/jV3///9mGADjSAf/XBbn6/bAxM3/kGDiQwD0dUXoTApQAAD6WBP+ilj/Xxf/7ur/fD//VQBfFAD/gk7UQgZpAAC2s7pYAADHv8O/vcPl5u9WEADVcEf/WAteAAD/TADhNwB1Jg5hCQD/+Pb/czvuVhT/Zij/e0b/ay//lmRuHAP/y73/QwC2PQ7cTRJ8Igb/rY/l9f//29BEAADRwL//1MX/o4n/vKfx6uj/49uZMAmIKQjPSRGmNgvj1tP/tJnwZTHjRiDfHwDnZURuJx2qioWxmZr8k3aRa2p+SUb/gl7GsK39ckl5PTWPW1J/OiqecWlrMC9kHx++npeGWFfSWDJmNDf/oXy6SSLGXzqjQSHoek2OOR6xVDKhSzHsfF7tq6Dxn47uj3+bV0nwv7zlVDrrfm07jNmCAAATDElEQVR4nNWdjVvaSLfAQ4w3UUnYhL6X90oDSBBRFJWKgiJSXUtr3W673fv27bUt4LX9//+EO/kgTJL5Jtres8+zz64QOD/Ox8ycM5NIGUje/r72rN7O/P+QnKqtla4jf5Lg/3lVkF/0y6PekyolJrkLW7Pk0msH/iMM41yXZLnYLzdOck+sGq84zdvy0o4lV98M4D/DMIM3VRlI3y7fnDiZX1g6I9Ns7VtAV+st/HcY5shjkXf6immPOk+sILvkjhtlZfPMZZFLr+BXYBgQMq5YgMYuN45/UV87uTFtI2ABQdOFXoJguu9LckDTMhTbvG0+uaJ06d0ophKyyNU/4KCBYAa/+24GaKxNQwHWufnV8ppzXDYVRTFmLMA0R9DLEMzR2uwdsiVvgmsUc/eX8jWnaZZdtYz9Yqhp4RWUquYwzseCDNMY7nXlbPNXwXF6N7u2i5I9m7PIpfdQ0Mxhuu9KMkTjxo1nnFH7l0jTvQvT9MyyeQqxyFULChoIpmrJMM2+T6OYxvHPD53cya3nYS5LRE25AAXNHGawFnmTbJ0FNCCv/ewxtOnmMJ/lPMoiF67nus1hrgtynMaPG9c4Nz8zTedGddP2NUmwyKU386CZw/xZkrE0ipkd/zTjXIQoirEXZwE0CBhnLfE2uXga0ihm+eSnoHQa5RkKYCkmlVybB00Ic4SAidAo5Vrnya3TG81RAAtKx9L7JMz7eMgkaUzzifNa7qReVigscnUnCbNTRb1TLp4bcxrlSZc6TtMfJWcsfYSPeX4WBs0Mpouk9miyEA2Yrz1VXmsf+6PkTPrJ2PelEK5pZjBvkV7mihWxDUjTo6eoEuQOamUlwoLTTy69i8O8SyTmuURpbLNx8OiJoHlr2zCK0d/BGQbQxGE+VPEw1l6ERrHt2uOuQ3OSHfEwxWgRWOZBE8AM/sK/F8TNnhIVe/fmERPB8a4Z+76WTGCRCx+jMB8JXubRZGMfb+4+Ul5zOsZu7LsMMss8aAKY91UiTNI2irK79QhLHacNj5JsLLL8wYFhnL8pMHKxb8RpHqGE0ztolONfQ44XT/46gmGOSPHviWUlaexyLd0pgVt4SbLs01jk6jUMc017u7uQTtJ4S53UUNqzRQsvi1x9DcO8Jse/T7ODoAFfn1IJB1q0RFjO6CxyNVjTeDBdasjgaUDofEphDD1BoUAFMjLMh6M5DD1kSDRKud5cEKd9u4tAcVkwk8uYBK0ND4Yyysxp9lsoGHcMXaSE0/NLewiWUzYWufQ6hPFaGaw0SNsoZfGlTu4kmY45WWatDRdm8DcrDJ7GLt8KTQmcpoo2i2IYzCxy9fe3M5gj1ms8mk00DViHCix12iMDjQJYzplZZq0NF+YVdi2DpFnF0ChmnbOD6BzUUDksYGHJYyGMVz0DMN1ExYxCg7MNWBvULzhYOjUbgwKEiyUIGgAz+IM5ZGg0IHTMdo5R8omZPszC4WOulN4GMHwsgOYUTwNmOL+xiYHOYZ5kUQUyonhrGom0/MdJkUBj11SJRdQ83sUUbha/HyhluuiKGY1mYRgdD4MowtLE6wcCmI0q96WAJr70nIm5xQYjSTgYY8/ih/H6gVKilcFKgxtu8owwKp5FRCG3HyhlPvJ7GYnG1BkNs41h6dMWyWhx+4ESsWJGEuscSWOyetk28nIDX+yj0QAYR5DFpUFpY7PCqI0U7SJ7rQ1JLGR8mkQBylWHGaaGWFiSCpcUKVxnJMGQCWiSrlJfBIZlwY+T0p8Z6Y/qAjBygsZuMMNsxWczTMULvBS6C8EgaFjHTHcKYKbKIq91F3IzBI3NPGZKeqw4vikeL664brZAAvBoYqVOm3XMBGKmyeJONSVHZDYDS5TGzDOzqHACMLILsriNDSm5mYFXrGdwn5ADBrrM2FwsXvzNDaJzMxhmBy5ysM5mAEwdYmEq9pGk8NGdm3X/rC5KA5VsDGYWMAUI/Sy+u0dASt4SwFnYz2CaOodlwlGTvUCGZ3nnLc4yR8KzM4gmWHraDQ7LbM1gFreL52V+QaOaBg0/TLBwNlJgCQsanKUmDM2OD1Njh5H8KUAqLGGpSaCigRBLzvJNAACMt+Vy8XiRoSJgKn7melqWE8YtaaTDIsthrZm9C0AU62yTZ8wEYihZvsIlTqAuQOZVNY1PdIuDXDB6PStWvEhIcPTE75yl4mceDZdlGnvCi+SoVP09Gh6Mw9KgZZG1c50jZqT/LqTEEhyjCVrn1VQ+tHjaYp8AABkKlfuSUv07A8EM2Dq0ZLGsPe4E0NpPI5lFNzVkmHrnZPGmNLyp2VDOUzDOX4MIzMJ+5q6fDZEZgNFfdCUDQiYTgTki7jdjQAn22gtMNI3s6aIL5usoTObDQiw7e8GuVLvOATNbAhh9xr0LGInvBMy8XyA5W6dQGYBjPRMuzozN8wUGnKqcicGIL55BEoM6TzYHDLTYzvZ3hI0Tetl8k7aoZYrRbQ7M7RkAA5eaOLZjxOVFLwEj0Ax0ZS3WpuGoaMaLgP0XQq5W/UcmAYM82ECTaGHGT2fCtWYjK1SimXsZdH6G388sGdF1XqQLYOwJJOnCAAHD7WfWft9AdL8WaTYZLe41dPVP1MkmTj+zrHPkBif2nibqamOT1zjoM2fd8AAtixTlfhbd02TuNiNb52DuyTeCok8DOjx+Bib7CmbjGeNUE7upARinyG6cyOFm9HFgirjjJHZn0+LbTYwW+wgKe1nkoDZrc6N4RtgIpNS32WAQLc25cc5ZjYM7qN1lK9JY8jnGwwJhtAyqcx7SsLado/edgG9u8JYFJjxYixPG2ZlK/hQwvWGZe5ZgL4veQ4NepLF2zlFjSwSGLZ1RYIDx9xiW1FXsPTS61CJN8Qw5TkZhmNKZqlM+xhtBaZETvVFD7L4zZBiwNCZF/gyGKZ2peeoHgcnaHiWtEe47QykGFvfRu+fjwjTVVLdYPkppkRcGVcIdgbqvX6zh5RQ95Cd/UCaYGttnGXsFgkr/GuBhnIO8jhc2FKAAS1UT6s6SxSaptN3Dw/RGuooV7DbEhDClM3YYvEqq1MTDNIlDBDMMQzpTdXYYwsfoF3iYE2JxlRmGIZ2peVanJcN8yuFgcsfpWIYhnalb6cBst3EwbTUdGIaVM2Myo8FIehMH0yGX8Nlh6LMzaHfGQjD5C8zczLlICcZgSGcpweifemiY3CfyL5omDHMyo3V89DYapk1pFDHD0NOZmk8LJt9EwzQpMMwsDDDMyYxqmYMcCsY5oMRt7PuzeKHmZnWLcDUfDDyjmcPkKApEYYxVggxp6Uwdki43OGCkfBsF09vigDFWl/CibVIzwFAjXB+hocKcoIqA5LlMFIbIwgCjE2GWVrPsMPonFMyI5hsQDJEFyAoZRs23iDAwDbUZn88lYZzfKBdBMDQWjQpD+QCIhgqz1UnCdGghE8JkaSxL2pACs0I2DExDt8xFEuaYurfCYGUBMGSXZYAJaagwup6Eoe8TMVhZljTaFhpy/Edo6BtYfsvFYXJUL/NhWFiWtCVyOqMkswgNHSZ/EoehzWUCGCYWIBQYSjKDaegw+qc4DGXGHMAkWLRnEQn/TExnqh5eH7088UuB4ZNhn9RvMRiHeoW3ozL+bat9qwjJWQhzS4TJzwyzeg5fXjxN0rDAhDOaAKbDApP0sVgDcr8fvIOczubJ7Fm0H2udJ12NBeYiCnPB0Ieoa1rM1ePN1FAZSjqraTPDxqvZMRrwjVmG7XhqFIYhZKT8yrC1BAMlGsPWWRA12iaxqhkms+RG4HMYZKk1HK6wtHtyMExvm+ESVZX0FQCk+UCriCa3FfoZMZ3NktmzjUQp3DqdkbSGKwBEZWr2NGGYJvNOBACU94FQ23gDVSgw+iz2UMf+rVPw2avDlbwLwqiWfgDDsITMHMidQmz1d14UqgmcnZmfkUq0+szLkntlrMJa4d9bef9nY5bZMsDf18wSMjEiVb37/D/yWmxncnEvgCHs1Qwz87OYYYprhf2vdyqzQeYwwdrZg2mzhAyCZ3v77usXy6rON8Ba+7N0RrhuK4CZ3/TDAlLdACDb3CC+nMxhyNV/kgAe9fnXLxsbckBUfBakM8I1s2QWgFTljY0vX5/r4KNE1QiCxjulQSllksU1kHT3+dsXD2iWAjT876P6yWy1XwQg1s6Xb1+fi5vEl6Ab4MLQSpl0cf387vlnYKLq2jNaOlN9w2j7az4Ie9bCiq52ZjDtBT8q0BGodPf8+bc9jZzO1Fky+/Y8FRBP9JMZDMP0n1E8IB8Gu3IOkhl4Q0ogrugHwTGtxUImIeqSRobxk5nGdTiFJn43QGKcy7BLoOwqTtftoQ+b5neCiWPHh6FV/7nF/+Vxr257yYw8eeMXb+0spRkygQyJ2qqr9DUCv3jdACnjkNuy/OJHODadeZlZW0n3O8HH9lyYXMoskm8aDdOkCTJzyl7mB42UaVPrstziLou1IXp7o+q/mPov6HYDpEy6idkVNb8JFN5Ew3jJjFaMFhB9lAMw5Oa/mHgKY2BAMqOsqsVkC8Dk0vcy4EogKipohVXiiLqAbDUzEmUng5i49Vd0bvYLgOl7GQia44x0QNiVRRbCB7tLFvTP77ZmKKO/qD66I62ICim5ghSASWfqFjAMyctUXVShzZw0rmhiYhD7BsA0LSTMkDzIqPmGoD5aJSc1L5fERDFq+JzkpQDkC0ONFP7ubgdBfSpjkM2EYdztS/gVGFgIoF4Fa2b8HFOVauBTBfW5BNksc1sRhrHxW37csRH5Ihhm8L9A3V4ApgdgJuIwhLPM7mwTkYBVfRM3z3FveObtNRJTpzJ2ZwC9RWAUG7dTTkXmZhBLmoSxTC04HSgIM/FmzUwNRhyM62pomBU0jIaes6l6uJ1OSBut0vbWM1Mx08z3a6Czmqq1EDBDTPhv1cPtbGIwVz1/pbkojNJA5q0hIp2BPyLNUoP2sghpU5n692rqifkZBKPUET83SAHJv+otlO/pkVNOYjBNvwaQuxcyjRIR1LpyM5HOQDJLWms7dvpERBntqh0UAR9SgLHriSSlbiWsoK4klphq4iSdiDKV+9m9mjpCfqbEaJJtYR0BEzdWMFAubJlJWDj/IWIaJS52fOapJ5qramKujTgTIMLyPSycZ4SSc0KJZI7W42slKR/BUyXU+SYBXSo/wpZGpsm2l4UKY0ezmtcViMpd5HUdeVZTAEabzjtnuXE6MGA6UIPygPp5Iy7foAWqmk+EiyCM9rIJdZtFkjNKDyCNkEb97HYGLfAv8I/l/4f1LXxVrRnoPewCMFc5CGayxG8aDEx45Gz7OeoUe+GzGrgg2ixiMOPIDo3v6cEEp05V/QWCRZbXvnqvEk428bMsTSJ7ZwSCBquMYjd0Sb3D3V3gxWcwbSad0uSHeRnZO5OZpgmjmEb+bgN7krdwpzdwT2oRg7mK7mpqv+SmwdrFNBvj6f9WcSyy9WE6urUxzwMSgalMojCZlGDMcrkxmjwMDgmPgau+WV4fPExXTAwPN8xlLwbDn5yRJLXpw2B9GQjhHmOl60P3HYOHyQ3gSfobryLaUiYG0+GuOCVIdm+nPognb7B+Vvhn8JZ1YKCRmXikDq8ilfs4TOaS188iYbK7ezuZgwA5xD/VogC/b3n9YVzejTx2khfmMnnjqTGvn81AbDvbGD0sHx5GdDzE3sOi9C72zsPDwbSWtc3ZA5w49dAqmQQM9wrNs4iZvb2ZDpaj6vm/OG6cKbxNvhvwTG5u66YpUASsjJIwOV4YQFK/GU0GhwgSVz/cjRLW1tHvP1w/Ob5pAB5OPS6bSZjMHU/QaJVKfQwyV9y7IOUwd4Gu/o67wrXPw2RUq1S4NNEQh4EyJ8ym0SqXL0eTDtK75oK5wVDhmnQVsE/74f47B09ljDqmxVimBSTDaacHfg6nS2JZXi78AyWFI+JF60ATp9eZXlUu2fQJh/8ITO6K+mto2uVla9LLzX6LLtr9A3n7n0ghXbPeDT7ayeUm48tLBgNVkEcbHXI7wG1NVa5iT2YkGuef/4GS/yLArMceytkca5XEnv2YWmPkCdpMGwvjNtlefh+jnmdKwOGFWe8mPz7Tvr96qRGAYC+DYXpoPwMW0b6P73GPaHawvsYJ08U9K7U3HXtAaOUwB7UdRMUJuFZrfD9pJ76BwTg8MOvLxMe+9k6mP4aoFKeNMfcDSLQDAMnLH9Mm/RmZzjJKQw6YeLAgJNecIFJ25R53F602XKYFJMP7hzbjo1hR1mGG6TpsT+N12g8gZVfgn1yDQyZ6d5NwUQMGk5Y/mDCLIwyDinvst+Tak5vLy1kA+cV/JIzfq3UHk+G0x/hrQRLXkg2GwcPiQM6JO6S6PJUf+LtoNd2kUbkSfaS0s84Nw48SSGf0EgRQUJZFwuR+fB/xP+EXEocTRpjFlfb06io6YERgMr1Fn1rurK8zw6wvhILSV8K8TVgcVpjFURKSOkwmMxt0iDDr2AF/AXkEmNkMhwDzKCiPAxPkNTwMckqZgjwOjLfUwcI8jlmA/B93A/12zKozAQAAAABJRU5ErkJggg==" 
                      alt="MetaMask" 
                      className="w-5 h-5 mr-2"
                    />
                    MetaMask
                  </button>
                  <button
                    type="button"
                    onClick={connectCoinbase}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    <img 
                      src="https://coinbase.com/favicon.ico" 
                      alt="Coinbase" 
                      className="w-5 h-5 mr-2"
                    />
                    Coinbase
                  </button>
                </div>

                {walletStatus && (
                  <p className={`text-center text-sm mt-2 ${
                    walletStatus.includes('Connected') 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {walletStatus}
                  </p>
                )}

                {/* Face recognition/capture button */}
                {isLogin ? (
                  <>
                    <button
                      type="button"
                      onClick={handleFaceRecognition}
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      <span className="mr-2">👤</span>
                      Face Recognition Login
                    </button>
                    {faceCaptureStatus && (
                      <p className={`text-center text-sm ${
                        faceCaptureStatus.includes('successfully') 
                          ? 'text-green-400' 
                          : 'text-blue-400'
                      }`}>
                        {faceCaptureStatus}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleFaceCapture}
                      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      <span className="mr-2">📷</span>
                      Capture Face for Verification
                    </button>
                    {faceCaptureStatus && (
                      <p className={`text-center text-sm ${
                        faceCaptureStatus.includes('successfully') 
                          ? 'text-green-400' 
                          : 'text-blue-400'
                      }`}>
                        {faceCaptureStatus}
                      </p>
                    )}
                  </>
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