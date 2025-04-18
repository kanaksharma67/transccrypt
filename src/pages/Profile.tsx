import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Edit2, Shield, Bell, Key, Wallet, Globe, Moon, Sun, ChevronRight, LogOut } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    location: 'New York, USA',
    bio: 'Crypto enthusiast and tech lover'
  });

  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleSave = () => {
    setIsEditing(false);
    // Add API call to save profile data
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-14">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80"
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-purple-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={16} className="text-white" />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-2xl font-bold">{profileData.name}</h1>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </div>
              <p className="text-gray-400">{profileData.email}</p>
              <div className="flex gap-4 mt-4">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                  Pro Member
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">Profile Details</h2>
          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 h-24"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <p>{profileData.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <p>{profileData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                <p>{profileData.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                <p>{profileData.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                <p>{profileData.bio}</p>
              </div>
            </div>
          )}
        </div>

        {/* Activity & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'Sent payment', amount: '₹250.00', time: '2 hours ago' },
                { action: 'Updated profile', amount: null, time: '1 day ago' },
                { action: 'Split bill', amount: '₹1,250.00', time: '3 days ago' }
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-400">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-purple-400">{activity.amount}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Account Stats</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Total Transactions</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="font-medium">98%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[98%] bg-gradient-to-r from-green-500 to-emerald-500"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Response Time</span>
                  <span className="font-medium">Fast</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
