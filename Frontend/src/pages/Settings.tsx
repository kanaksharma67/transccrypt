import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Key, Wallet, Globe, Moon, Sun, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const CyberpunkFace = () => {
  const faceRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);
  const mouthRef = useRef<HTMLDivElement>(null);
  const [faceSize, setFaceSize] = useState(100);
  const [glowIntensity, setGlowIntensity] = useState(80);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update face size and eye tracking
  useEffect(() => {
    if (!faceRef.current || !leftPupilRef.current || !rightPupilRef.current) return;

    // Update face size
    const baseSize = faceSize;
    faceRef.current.style.width = `${baseSize}px`;
    faceRef.current.style.height = `${baseSize * 1.3}px`;

    // Update eye sizes
    const eyeSize = baseSize * 0.25;
    const eyes = faceRef.current.querySelectorAll('.eye');
    eyes.forEach(eye => {
      (eye as HTMLElement).style.width = `${eyeSize}px`;
      (eye as HTMLElement).style.height = `${eyeSize}px`;
    });

    // Update pupil sizes
    const pupilSize = eyeSize * 0.5;
    leftPupilRef.current.style.width = `${pupilSize}px`;
    leftPupilRef.current.style.height = `${pupilSize}px`;
    rightPupilRef.current.style.width = `${pupilSize}px`;
    rightPupilRef.current.style.height = `${pupilSize}px`;

    // Position elements
    const eyeArea = faceRef.current.querySelector('.eye-area') as HTMLElement;
    const mouthArea = faceRef.current.querySelector('.mouth-area') as HTMLElement;
    if (eyeArea && mouthArea) {
      eyeArea.style.top = `${baseSize * 0.3}px`;
      mouthArea.style.bottom = `${baseSize * 0.2}px`;
      mouthArea.style.width = `${baseSize * 0.5}px`;
    }

    // Update eye tracking
    updateEyeTracking();
  }, [faceSize, mousePosition]);

  // Update glow effects
  useEffect(() => {
    if (!faceRef.current) return;

    const intensity = glowIntensity / 100;
    faceRef.current.style.boxShadow = `
      inset 0 0 ${30 * intensity}px rgba(110, 0, 255, 0.3),
      0 0 ${50 * intensity}px rgba(110, 0, 255, 0.5),
      0 0 ${100 * intensity}px rgba(0, 208, 255, 0.3)`;

    const eyes = faceRef.current.querySelectorAll('.eye');
    eyes.forEach(eye => {
      (eye as HTMLElement).style.boxShadow = `
        inset 0 0 ${20 * intensity}px rgba(110, 0, 255, 0.5),
        0 0 ${30 * intensity}px rgba(110, 0, 255, 0.7)`;
    });

    const pupils = faceRef.current.querySelectorAll('.pupil');
    pupils.forEach(pupil => {
      (pupil as HTMLElement).style.boxShadow = `
        0 0 ${20 * intensity}px #00d0ff,
        inset 0 0 ${10 * intensity}px rgba(0, 208, 255, 0.5)`;
    });
  }, [glowIntensity]);

  const updateEyeTracking = () => {
    if (!leftPupilRef.current || !rightPupilRef.current || !faceRef.current) return;

    const faceRect = faceRef.current.getBoundingClientRect();
    const faceCenterX = faceRect.left + faceRect.width / 2;
    const faceCenterY = faceRect.top + faceRect.height / 2;

    // Update mouth based on distance
    const dx = mousePosition.x - faceCenterX;
    const dy = mousePosition.y - faceCenterY;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), faceRect.width * 0.5);

    if (mouthRef.current) {
      const mouthOpen = Math.min(distance / 100, 0.5);
      mouthRef.current.style.height = `${15 + mouthOpen * 10}%`;
      mouthRef.current.style.borderRadius = `0 0 ${50 - mouthOpen * 20}% ${50 - mouthOpen * 20}% / 0 0 ${100 - mouthOpen * 40}% ${100 - mouthOpen * 40}%`;
    }

    // Update both eyes
    [leftPupilRef.current, rightPupilRef.current].forEach((pupil, index) => {
      const eye = pupil.parentElement;
      if (!eye) return;

      const eyeRect = eye.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;

      const eyeDx = mousePosition.x - eyeCenterX;
      const eyeDy = mousePosition.y - eyeCenterY;
      const eyeDistance = Math.min(Math.sqrt(eyeDx * eyeDx + eyeDy * eyeDy), eyeRect.width * 0.3);
      const angle = Math.atan2(eyeDy, eyeDx);

      pupil.style.transform = `translate(calc(-50% + ${Math.cos(angle) * eyeDistance / 2}px), calc(-50% + ${Math.sin(angle) * eyeDistance / 2}px))`;
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center mt-12 mb-8">
      <div className="mb-4 flex gap-4">
        <div className="control-group">
          <label htmlFor="sizeControl" className="text-xs uppercase tracking-wider mb-1 text-gray-400">
            Face Size
          </label>
          <input
            type="range"
            id="sizeControl"
            min="50"
            max="200"
            value={faceSize}
            onChange={(e) => setFaceSize(parseInt(e.target.value))}
            className="w-32 h-1 bg-gray-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400"
          />
        </div>
        <div className="control-group">
          <label htmlFor="glowControl" className="text-xs uppercase tracking-wider mb-1 text-gray-400">
            Glow Intensity
          </label>
          <input
            type="range"
            id="glowControl"
            min="0"
            max="100"
            value={glowIntensity}
            onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
            className="w-32 h-1 bg-gray-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400"
          />
        </div>
      </div>

      <div className="face-container">
        <div 
          ref={faceRef}
          className="face bg-[#1a1a2e] border-2 border-[#6e00ff] rounded-[50%_50%_45%_45%_/_60%_60%_40%_40%] relative transition-all"
          style={{
            boxShadow: `
              inset 0 0 30px rgba(110, 0, 255, 0.3),
              0 0 50px rgba(110, 0, 255, 0.5),
              0 0 100px rgba(0, 208, 255, 0.3)`
          }}
        >
          <div className="absolute inset-0 rounded-inherit shadow-[inset_0_0_50px_rgba(0,208,255,0.2)] pointer-events-none" />
          
          <svg className="circuit-lines absolute inset-0 w-full h-full stroke-[rgba(0,208,255,0.2)] stroke-[1px] fill-none pointer-events-none">
            <path d="M20,20 L80,20 L80,80 L20,80 Z" />
            <path d="M30,30 L70,30 L70,70 L30,70 Z" />
            <path d="M40,40 L60,40 L60,60 L40,60 Z" />
            <circle cx="50" cy="50" r="10" />
            <line x1="50" y1="20" x2="50" y2="80" />
            <line x1="20" y1="50" x2="80" y2="50" />
          </svg>
          
          <div className="hud-elements absolute inset-0 pointer-events-none overflow-hidden">
            <div className="hud-line horizontal absolute w-full h-[1px] left-0 bg-[rgba(0,208,255,0.1)]" style={{ top: '30%' }} />
            <div className="hud-line horizontal absolute w-full h-[1px] left-0 bg-[rgba(0,208,255,0.1)]" style={{ top: '70%' }} />
            <div className="hud-line vertical absolute w-[1px] h-full top-0 bg-[rgba(0,208,255,0.1)]" style={{ left: '30%' }} />
            <div className="hud-line vertical absolute w-[1px] h-full top-0 bg-[rgba(0,208,255,0.1)]" style={{ left: '70%' }} />
            <div className="hud-text absolute text-xs text-[#00d0ff] [text-shadow:0_0_5px_#00d0ff]" style={{ top: '10%', left: '10%' }}>SYNTH-OS v3.2.7</div>
            <div className="hud-text absolute text-xs text-[#00d0ff] [text-shadow:0_0_5px_#00d0ff] text-right" style={{ top: '10%', right: '10%' }}>STATUS: ACTIVE</div>
            <div className="hud-text absolute text-xs text-[#00d0ff] [text-shadow:0_0_5px_#00d0ff]" style={{ bottom: '10%', left: '10%' }}>NEURAL INPUT: 87%</div>
            <div className="hud-text absolute text-xs text-[#00d0ff] [text-shadow:0_0_5px_#00d0ff] text-right" style={{ bottom: '10%', right: '10%' }}>MOTOR FUNC: 100%</div>
          </div>

          <div className="eye-area absolute w-full h-[30%] flex justify-around" style={{ top: '30%' }}>
            <div 
              className="eye bg-black rounded-full border-2 border-[#6e00ff] overflow-hidden relative"
              style={{
                boxShadow: `
                  inset 0 0 20px rgba(110, 0, 255, 0.5),
                  0 0 30px rgba(110, 0, 255, 0.7)`
              }}
            >
              <div className="eye-inner absolute inset-0 bg-[radial-gradient(circle_at_center,#120030_0%,#000_70%)] rounded-full" />
              <div 
                ref={leftPupilRef}
                className="pupil absolute bg-[radial-gradient(circle_at_30%_30%,#00d0ff_0%,#000_70%)] rounded-full transition-transform"
                style={{
                  boxShadow: `
                    0 0 20px #00d0ff,
                    inset 0 0 10px rgba(0, 208, 255, 0.5)`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
              <div 
                className="eye-grid absolute inset-0 rounded-full"
                style={{
                  background: `
                    linear-gradient(rgba(0, 208, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 208, 255, 0.1) 1px, transparent 1px)`,
                  backgroundSize: '10px 10px'
                }}
              />
            </div>
            <div 
              className="eye bg-black rounded-full border-2 border-[#6e00ff] overflow-hidden relative"
              style={{
                boxShadow: `
                  inset 0 0 20px rgba(110, 0, 255, 0.5),
                  0 0 30px rgba(110, 0, 255, 0.7)`
              }}
            >
              <div className="eye-inner absolute inset-0 bg-[radial-gradient(circle_at_center,#120030_0%,#000_70%)] rounded-full" />
              <div 
                ref={rightPupilRef}
                className="pupil absolute bg-[radial-gradient(circle_at_30%_30%,#00d0ff_0%,#000_70%)] rounded-full transition-transform"
                style={{
                  boxShadow: `
                    0 0 20px #00d0ff,
                    inset 0 0 10px rgba(0, 208, 255, 0.5)`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
              <div 
                className="eye-grid absolute inset-0 rounded-full"
                style={{
                  background: `
                    linear-gradient(rgba(0, 208, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 208, 255, 0.1) 1px, transparent 1px)`,
                  backgroundSize: '10px 10px'
                }}
              />
            </div>
          </div>

          <div 
            className="mouth-area absolute w-[50%] h-[15%] left-1/2 -translate-x-1/2 flex justify-center"
            style={{ bottom: '20%' }}
          >
            <div 
              ref={mouthRef}
              className="mouth w-full h-[15%] bg-black border-2 border-t-0 border-[#6e00ff] rounded-[0_0_50%_50%_/_0_0_100%_100%] relative overflow-hidden transition-all"
              style={{
                boxShadow: `
                  inset 0 -10px 20px rgba(110, 0, 255, 0.5),
                  0 0 20px rgba(110, 0, 255, 0.5)`
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-[#6e00ff] opacity-30" />
              <div className="teeth absolute inset-0 w-full h-full flex justify-around">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="tooth w-[8%] h-[40%] bg-white rounded-[0_0_3px_3px] shadow-[0_0_5px_#00d0ff]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="status-text text-xs text-[#00d0ff] [text-shadow:0_0_5px_#00d0ff] text-center mt-2">
        SYNTHETIC ENTITY TRACKING: ENABLED | INPUT SOURCE: OPTICAL SENSORS
      </div>
    </div>
  );
};

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
    window.location.reload();

    navigate('/');
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
    <div className="min-h-screen bg-gradient-to-b mt-16 text-white py-12 px-4 sm:px-6 lg:px-8">
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
        <CyberpunkFace/>

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

        {/* Cyberpunk Face Component */}
        <CyberpunkFace />

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