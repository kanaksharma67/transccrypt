import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import History from './pages/History';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
<<<<<<< HEAD
          <Route path="/dashboard" element={<Dashboard/>} />

=======
          <Route path="/dashbaord" element={<Dashboard />} />
>>>>>>> 79724eb4476248a1fdeb2c331c271e06deda13d8
          <Route path="/history" element={<History />} />
          <Route path="/make-payment" element={<Payment />} />
          
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;