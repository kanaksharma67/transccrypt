import React, { useState, useRef, useEffect } from "react";
import { Camera, Edit2, Shield, Crown } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Ensure the context exists in your project
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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.displayName || "Anonymous User",
        email: user.email || "",
        phone: user.phoneNumber || "",
        location: "New York, USA",
        bio: "Crypto enthusiast and tech lover",
      });
      setProfileImage(
        user.photoURL ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80"
      );
    }
  }, [user]);

  const handleSave = async () => {
    try {
      if (user) {
        await updateProfile(auth.currentUser, {
          displayName: profileData.name,
          photoURL: profileImage,
        });

        if (profileData.email !== user.email) {
          await updateEmail(auth.currentUser, profileData.email);
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
        <div
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 relative overflow-hidden"
        >
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

        {/* ...rest of your profile sections/components if any */}
      </div>
    </div>
  );
};

export default Profile;