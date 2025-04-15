import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import History from './pages/History';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import SplitBill from './pages/SplitBill';
import Convert from './pages/Convert';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/make-payment" element={<Payment />} />
          <Route path="/split-bill" element={<SplitBill />} />
          <Route path="/convert" element={<Convert />} />
          
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;