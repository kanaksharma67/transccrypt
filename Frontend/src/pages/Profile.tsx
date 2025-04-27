import React, { useState, useRef, useEffect } from "react";
import { Camera, Edit2, Shield, Crown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile, updateEmail } from "firebase/auth";
import { auth } from "@/firebase/firebaseconfig";
import ProfileStatsGraph from "./ProfileStatsGraph";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "Anonymous User",
        email: user.email || "",
        phone: user.phoneNumber || "",
        location: "India",
        bio: "Crypto enthusiast and tech lover",
      });
      setProfileImage(
        user.photoURL ||
          "https://www.shutterstock.com/image-illustration/bitcoin-crown-cryptocurrency-king-concept-600nw-2087743720.jpg"
      );
    }
  }, [user]);

  const handleSave = async () => {
    try {
      if (user) {
        await updateProfile(user, {
          displayName: profileData.name,
          photoURL: profileImage,
        });

        if (profileData.email !== user.email) {
          await updateEmail(user, profileData.email);
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please sign in to view your profile
          </h2>
          <p className="text-gray-400">
            You need to be authenticated to access this page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-14">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 p-1">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              {isEditing && (
                <>
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-purple-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-600"
                  >
                    <Camera size={16} className="text-white" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{profileData.name}</h1>
                )}
                <button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                >
                  {isEditing ? (
                    <span className="text-green-400">Save</span>
                  ) : (
                    <Edit2 size={16} />
                  )}
                </button>
              </div>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white w-full"
                />
              ) : (
                <p className="text-gray-400">{profileData.email}</p>
              )}
              <div className="flex gap-4 mt-4">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                  <Crown size={16} className="inline mr-1" />
                  Pro Member
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  <Shield size={16} className="inline mr-1" />
                  {user.emailVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Beautiful Animated Stats Graph */}
        <ProfileStatsGraph />

        {/* Recent Transactions */}
        {/* <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            Recent Transactions
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Transaction #{index + 1}</h3>
                    <p className="text-sm text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-400">+0.05 ETH</p>
                  <p className="text-sm text-gray-400">$125.00</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Achievements */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Crown className="text-purple-500" size={20} />
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Early Adopter', description: 'Joined during beta phase', progress: 100 },
              { title: 'Transaction Master', description: '100+ transactions completed', progress: 75 },
              { title: 'Crypto Whale', description: 'Held over 10 ETH', progress: 30 },
              { title: 'Community Leader', description: 'Referred 5 friends', progress: 60 },
              { title: 'Power User', description: 'Used all platform features', progress: 90 },
              { title: 'Diamond Hands', description: 'Held assets for 1 year', progress: 45 },
            ].map((achievement, index) => (
              <div key={index} className="bg-gray-700/30 rounded-xl p-4">
                <h3 className="font-medium mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-purple-500 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-400 mt-1">{achievement.progress}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield className="text-purple-500" size={20} />
            Account Settings
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400">Add an extra layer of security</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-400">Get updates about your transactions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
              <div>
                <h3 className="font-medium">Public Profile</h3>
                <p className="text-sm text-gray-400">Make your profile visible to others</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;