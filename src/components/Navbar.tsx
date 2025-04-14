import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Home, History, Users, RefreshCw, User, Settings } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="flex items-center justify-between mb-8">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-purple-600 rounded-full p-2">
          <span className="text-xl">Σ</span>
        </div>
        <span className="text-xl font-semibold">TransCrypt</span>
      </Link>
      
      <div className="flex items-center gap-8">
        <Link to="/" className={`flex items-center gap-2 ${isActive('/dashboard') ? 'text-purple-500' : 'text-gray-400'}`}>
          <LayoutGrid size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/home" className={`flex items-center gap-2 ${isActive('/') ? 'text-purple-500' : 'text-gray-400'}`}>
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link to="/history" className={`flex items-center gap-2 ${isActive('/history') ? 'text-purple-500' : 'text-gray-400'}`}>
          <History size={20} />
          <span>History</span>
        </Link>
        <Link to="/split-bill" className={`flex items-center gap-2 ${isActive('/split-bill') ? 'text-purple-500' : 'text-gray-400'}`}>
          <Users size={20} />
          <span>Split Bill</span>
        </Link>
        <Link to="/convert" className={`flex items-center gap-2 ${isActive('/convert') ? 'text-purple-500' : 'text-gray-400'}`}>
          <RefreshCw size={20} />
          <span>Convert</span>
        </Link>
        <Link to="/profile" className={`flex items-center gap-2 ${isActive('/profile') ? 'text-purple-500' : 'text-gray-400'}`}>
          <User size={20} />
          <span>Profile</span>
        </Link>
        <button className="text-gray-400 hover:text-white">
          <Settings size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;