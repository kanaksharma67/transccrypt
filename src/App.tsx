import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import History from './pages/History';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import SplitBill from './pages/SplitBill';
import { AuthModal } from './pages/AuthModel';
import PetCare from './pages/Games';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Convert from './pages/Convert';
import PaymentPage from './pages/PaymentPage';
// import  {PlantCareGame}  from './components/PlantCareGame/PlantCareGame';
import PlantCareGame from './components/PlantCareGame/PlantCareGame'; // Importing the PlantCareGame component

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const toggleAuthModal = () => {
    setIsAuthModalOpen(prev => !prev);
  };

  return (
    <Router>
      <Layout>
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={toggleAuthModal}
        />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/make-payment" element={<Payment />} />
          <Route path="/stellar-payments" element={<PaymentPage />} />
          <Route path="/split" element={<SplitBill />} />
          {/* <Route path="/games" element={<PetCare />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path='/convert' element={<Convert />} />
          <Route path="/split-bill" element={<SplitBill />} />
          <Route path="/convert" element={<Convert />} />
         <Route path="/pet-care" element={<PetCare />} />
          <Route path="/plant-care" element={<PlantCareGame/>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
