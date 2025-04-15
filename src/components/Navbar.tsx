import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Home, History, Users, RefreshCw, CreditCard, User, Settings, LogIn } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { AuthModal } from '@/pages/AuthModel';// Import your AuthModal component

const Navbar = () => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-purple-600 rounded-full p-2">
              <span className="text-xl">Σ</span>
            </div>
            <span className="mt-2 text-4xl font-bold  block text-white">
              <span className="text-sky-400">Trans</span>
              <span className="text-emerald-400">Crypt</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`flex items-center gap-2 ${isActive('/') ? 'text-purple-500' : 'text-gray-400 hover:text-white'}`}
            >
              <LayoutGrid size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/home" 
              className={`flex items-center gap-2 ${isActive('/home') ? 'text-purple-500' : 'text-gray-400 hover:text-white'}`}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link 
              to="/history" 
              className={`flex items-center gap-2 ${isActive('/history') ? 'text-purple-500' : 'text-gray-400 hover:text-white'}`}
            >
              <History size={20} />
              <span>History</span>
            </Link>
            <Link 
              to="/make-payment" 
              className={`flex items-center gap-2 ${isActive('/make-payment') ? 'text-purple-500' : 'text-gray-400 hover:text-white'}`}
            >
              <CreditCard size={20} />
              <span>Payments</span>
            </Link>
            <Link 
              to="/split-bill" 
              className={`flex items-center gap-2 ${isActive('/split-bill') ? 'text-purple-500' : 'text-gray-400 hover:text-white'}`}
            >
              <Users size={20} />
              <span>Split Bill</span>
            </Link>
            <Link 
              to="/convert" 
              className={`flex items-center gap-2 ${isActive('/convert') ? 'text-purple-500' : 'text-gray-400 hover:text-white'}`}
            >
              <RefreshCw size={20} />
              <span>Convert</span>
            </Link>
            
            {/* Settings Link */}
            <Link 
              to="/settings" 
              className={`flex items-center gap-2 ${isActive('/settings') ? 'text-purple-500' : 'text-gray-400 hover:text-white'}`}
            >
              <Settings size={20} />
              <span className="hidden md:inline">Settings</span>
            </Link>
            
            {/* Login Button - Added this new button */}
            <button
              onClick={toggleAuthModal}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <LogIn size={20} />
              <span className="hidden md:inline">Login</span>
            </button>
            
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-gray-400 hover:text-white">Profile</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 mt-2">
                <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
                  <Link to="/profile" className="flex items-center w-full gap-2">
                    <User size={16} />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
                  <Link to="/settings" className="flex items-center w-full gap-2">
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 text-red-400">
                  <button className="flex items-center w-full gap-2">
                    <span>Sign Out</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={toggleAuthModal}
      />
    </>
  );
};

export default Navbar;
