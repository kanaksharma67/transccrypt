import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import History from './pages/History';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import SplitBill from './pages/SplitBill';

function App() {
  return (
    // <Router>
    //   <Layout>
    //     <Routes>
    //       <Route path="/" element={<Home />} />
    //       <Route path="/dashbaord" element={<Dashboard />} />
    //       <Route path="/history" element={<History />} />
    //       <Route path="/make-payment" element={<Payment />} />
          
    //     </Routes>
    //   </Layout>
    // </Router>
       <SplitBill/>

  );
}

export default App;