import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#0f1629] text-white relative overflow-hidden">
      {/* Purple glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto p-4">
        <Navbar/>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;