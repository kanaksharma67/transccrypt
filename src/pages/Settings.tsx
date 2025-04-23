import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Shield, Key, Wallet, Globe, Moon, Sun, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const { user } = useAuth();
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
  const [soundVolume, setSoundVolume] = useState(50);
  const [hapticStrength, setHapticStrength] = useState(75);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showWalletsModal, setShowWalletsModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  const handleNotificationToggle = (type: 'email' | 'push', checked: boolean) => {
    const newNotifications = {...notifications, [type]: checked};
    setNotifications(newNotifications);
    
    toast({
      title: 'Notification Settings Updated',
      description: `${type === 'email' ? 'Email' : 'Push'} notifications ${checked ? 'enabled' : 'disabled'}`,
    });

    localStorage.setItem('notifications', JSON.stringify(newNotifications));
  };

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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match!",
        variant: 'destructive'
      });
      return;
    }
    toast({
      title: "Success",
      description: "Password changed successfully!",
    });
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const connectWallet = () => {
    toast({
      title: "Success",
      description: "Wallet connected successfully!",
    });
    setShowWalletsModal(false);
  };

  const getSliderColor = (value: number) => {
    if (value < 30) return 'from-blue-500 to-blue-400';
    if (value < 70) return 'from-green-500 to-green-400';
    return 'from-purple-500 to-purple-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Settings</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
        </div>

        {/* Security Section */}
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
              <Switch
                checked={security.twoFactor}
                onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Biometric Login</h3>
                <p className="text-sm text-gray-400">Use fingerprint or face recognition</p>
              </div>
              <Switch
                checked={security.biometric}
                onCheckedChange={(checked) => setSecurity({ ...security, biometric: checked })}
              />
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
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => handleNotificationToggle('email', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-400">Get instant updates on your device</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => handleNotificationToggle('push', checked)}
              />
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
                <div className={`absolute h-1.5 rounded-full bg-gradient-to-r ${getSliderColor(soundVolume)}`} 
                     style={{ width: `${soundVolume}%` }} />
                <input
                  type="range"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(parseInt(e.target.value))}
                  max={100}
                  step={1}
                  className="relative w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Haptic Feedback</h3>
                <span className="text-sm text-gray-400">{hapticStrength}%</span>
              </div>
              <div className="relative">
                <div className={`absolute h-1.5 rounded-full bg-gradient-to-r ${getSliderColor(hapticStrength)}`} 
                     style={{ width: `${hapticStrength}%` }} />
                <input
                  type="range"
                  value={hapticStrength}
                  onChange={(e) => setHapticStrength(parseInt(e.target.value))}
                  max={100}
                  step={1}
                  className="relative w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

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
                <img src="https://cryptologos.cc/logos/metamask-logo.png" alt="MetaMask" className="w-6 h-6" />
                <span>MetaMask</span>
              </button>
              <button
                onClick={connectWallet}
                className="w-full flex items-center gap-3 p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600"
              >
                <img src="https://cryptologos.cc/logos/walletconnect-logo.png" alt="WalletConnect" className="w-6 h-6" />
                <span>WalletConnect</span>
              </button>
              <button
                onClick={connectWallet}
                className="w-full flex items-center gap-3 p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600"
              >
                <img src="https://cryptologos.cc/logos/coinbase-wallet-logo.png" alt="Coinbase" className="w-6 h-6" />
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
    </div>
  );
};

export default Settings;