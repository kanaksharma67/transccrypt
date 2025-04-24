import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import PlantCareGame from './components/PlantCareGame/PlantCareGame';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const toggleAuthModal = () => {
    setIsAuthModalOpen(prev => !prev);
  };

  return (
    <Layout>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={toggleAuthModal}
      />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/make-payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/stellar-payments" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/split" element={<ProtectedRoute><SplitBill /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path='/convert' element={<ProtectedRoute><Convert /></ProtectedRoute>} />
        <Route path="/split-bill" element={<ProtectedRoute><SplitBill /></ProtectedRoute>} />
        <Route path="/pet-care" element={<ProtectedRoute><PetCare /></ProtectedRoute>} />
        <Route path="/plant-care" element={<ProtectedRoute><PlantCareGame /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
