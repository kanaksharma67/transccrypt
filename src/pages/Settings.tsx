import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Shield, Key, Wallet, Globe, Moon, Sun, ChevronRight, LogOut } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import SamuraiMask from './SamuraiMask';

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false,
    marketing: false
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    biometric: false,
    deviceHistory: true
  });

  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('INR');
  const [soundVolume, setSoundVolume] = useState([50]);
  const [hapticStrength, setHapticStrength] = useState([75]);

  // State for modals and notifications
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showWalletsModal, setShowWalletsModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notificationToast, setNotificationToast] = useState<{message: string, type: string} | null>(null);

  // Handle theme change
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  // Handle notification toggle with toast
  const handleNotificationToggle = (type: 'email' | 'push', checked: boolean) => {
    const newNotifications = {...notifications, [type]: checked};
    setNotifications(newNotifications);
    
    // Show toast notification
    setNotificationToast({
      message: `${type === 'email' ? 'Email' : 'Push'} notifications ${checked ? 'enabled' : 'disabled'}`,
      type: checked ? 'success' : 'warning'
    });

    // Save to localStorage
    localStorage.setItem('notifications', JSON.stringify(newNotifications));

    // Hide toast after 3 seconds
    setTimeout(() => {
      setNotificationToast(null);
    }, 3000);
  };

  // Load saved notifications on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setNotificationToast({
        message: "Passwords don't match!",
        type: 'error'
      });
      return;
    }
    // Here you would typically call your API to change password
    setNotificationToast({
      message: 'Password changed successfully!',
      type: 'success'
    });
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    setTimeout(() => {
      setNotificationToast(null);
    }, 3000);
  };

  // Mock function to connect wallet
  const connectWallet = () => {
    setNotificationToast({
      message: 'Wallet connected successfully!',
      type: 'success'
    });
    setShowWalletsModal(false);
    
    setTimeout(() => {
      setNotificationToast(null);
    }, 3000);
  };

  // Get color based on value for the sliders
  const getSliderColor = (value: number) => {
    if (value < 30) return 'from-blue-500 to-blue-400';
    if (value < 60) return 'from-green-500 to-green-400';
    if (value < 80) return 'from-yellow-500 to-yellow-400';
    return 'from-red-500 to-red-400';
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-14">
      {/* Notification Toast */}
      <AnimatePresence>
        {notificationToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg z-50 ${
              notificationToast.type === 'success' ? 'bg-green-500/90 text-white' :
              notificationToast.type === 'warning' ? 'bg-yellow-500/90 text-gray-900' :
              'bg-red-500/90 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bell size={18} />
              <span>{notificationToast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700"
                >
                  Change Password
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Wallets Modal */}
      {showWalletsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold mb-4">Connect Wallet</h3>
            <div className="space-y-3">
              <button
                onClick={connectWallet}
                className="w-full flex items-center gap-3 p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600"
              >
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3ymr3UNKopfI0NmUY95Dr-0589vG-91KuAA&s" alt="MetaMask" className="w-6 h-6" />
                <span>MetaMask</span>
              </button>
              <button
                onClick={connectWallet}
                className="w-full flex items-center gap-3 p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600"
              >
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAUpkrZvGNGglwLFW9FkIy9xQkczJAS5gTdA&s" alt="WalletConnect" className="w-6 h-6" />
                <span>WalletConnect</span>
              </button>
              <button
                onClick={connectWallet}
                className="w-full flex items-center gap-3 p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600"
              >
                <img src="https://altcoinsbox.com/wp-content/uploads/2022/12/coinbase-logo.png" alt="Coinbase" className="w-6 h-6" />
                <span>Coinbase Wallet</span>
              </button>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowWalletsModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900 to-gray-800/50 z-10" >
      <SamuraiMask/>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Security Settings */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Shield className="text-purple-400" size={24} />
            </div>
            <h2 className="text-xl font-semibold">Security</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400">Add an extra layer of security</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.twoFactor}
                  onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Biometric Login</h3>
                <p className="text-sm text-gray-400">Use fingerprint or face recognition</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.biometric}
                  onChange={(e) => setSecurity({ ...security, biometric: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Key size={20} className="text-gray-400" />
                <span>Change Password</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>

            <button 
              onClick={() => setShowWalletsModal(true)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Wallet size={20} className="text-gray-400" />
                <span>Connected Wallets</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Bell className="text-blue-400" size={24} />
            </div>
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-400">Receive payment updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => handleNotificationToggle('email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-400">Get instant updates on your device</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => handleNotificationToggle('push', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Globe className="text-green-400" size={24} />
            </div>
            <h2 className="text-xl font-semibold">Preferences</h2>
          </div>

          <div className="space-y-6">
           
            <div>
              <h3 className="font-medium mb-4">Language</h3>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            <div>
              <h3 className="font-medium mb-4">Currency</h3>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Sound Volume</h3>
                <span className="text-sm text-gray-400">{soundVolume}%</span>
              </div>
              <div className="relative">
                <div className={`absolute h-1.5 rounded-full bg-gradient-to-r ${getSliderColor(soundVolume[0])}`} 
                     style={{ width: `${soundVolume[0]}%` }} />
                <Slider
                  value={soundVolume}
                  onValueChange={setSoundVolume}
                  max={100}
                  step={1}
                  className="relative my-4"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Haptic Feedback</h3>
                <span className="text-sm text-gray-400">{hapticStrength}%</span>
              </div>
              <div className="relative">
                <div className={`absolute h-1.5 rounded-full bg-gradient-to-r ${getSliderColor(hapticStrength[0])}`} 
                     style={{ width: `${hapticStrength[0]}%` }} />
                <Slider
                  value={hapticStrength}
                  onValueChange={setHapticStrength}
                  max={100}
                  step={1}
                  className="relative my-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-red-800 rounded-lg hover:bg-red-600 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;