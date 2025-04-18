import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Key, Wallet, Globe, Moon, Sun, ChevronRight, LogOut } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const Settings = () => {
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

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-14">
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

            <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Key size={20} className="text-gray-400" />
                <span>Change Password</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
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
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
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
                  onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
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
              <h3 className="font-medium mb-4">Theme</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border ${
                    theme === 'light'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <Sun size={20} />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <Moon size={20} />
                  <span>Dark</span>
                </button>
              </div>
            </div>

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
              <h3 className="font-medium mb-4">Sound Volume</h3>
              <Slider
                value={soundVolume}
                onValueChange={setSoundVolume}
                max={100}
                step={1}
                className="my-4"
              />
            </div>

            <div>
              <h3 className="font-medium mb-4">Haptic Feedback</h3>
              <Slider
                value={hapticStrength}
                onValueChange={setHapticStrength}
                max={100}
                step={1}
                className="my-4"
              />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
