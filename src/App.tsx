import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import History from './pages/History';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import SplitBill from './pages/SplitBill';
import Convert from './pages/Convert';
import { AuthModal } from './pages/AuthModel'; // Fixed typo in import (AuthModel -> AuthModal)

import PetCare from './pages/Games';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const toggleAuthModal = () => {
    setIsAuthModalOpen(prev => !prev);
  };

  return (
    <Router>
      <Layout>
        {/* AuthModal can be rendered outside Routes since it's a modal */}
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={toggleAuthModal}
        />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/make-payment" element={<Payment />} />
          <Route path="/split-bill" element={<SplitBill />} />
          <Route path="/convert" element={<Convert />} />
         
          <Route path="/games" element={<PetCare />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
