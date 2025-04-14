
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentButton = () => {
  const navigate = useNavigate();
  
  return (
    <motion.button
      onClick={() => navigate('/make-payment')}
      className="w-full relative overflow-hidden py-4 px-6 rounded-xl bg-primary text-white font-medium flex items-center justify-center space-x-2 button-highlight shadow-neon"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <span>Make Payment</span>
      <ArrowRight size={18} />
      <div className="absolute top-0 left-0 h-full w-1/4">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
    </motion.button>
  );
};

export default PaymentButton;
