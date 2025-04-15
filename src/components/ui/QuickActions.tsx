
import React from 'react';
import { motion } from 'framer-motion';
import { Send, Inbox, Users, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();
  
  const actions = [
    { icon: Send, label: 'Send', color: 'primary', path: '/make-payment' },
    { icon: Inbox, label: 'Receive', color: 'secondary', path: '/receive' },
    { icon: RefreshCw, label: 'Convert', color: 'accent', path: '/convert' },
    { icon: Users, label: 'Split', color: 'primary', path: '/split-bill' },
  ];

  return (
    <motion.div 
      className="grid grid-cols-4 gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          onClick={() => navigate(action.path)}
          className={`flex flex-col items-center justify-center p-3 rounded-xl glass-card 
            ${action.color === 'primary' ? 'neon-border' : 
              action.color === 'secondary' ? 'neon-border-blue' : 'neon-border-green'} 
            button-highlight`}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
        >
          <div className={`p-2 rounded-full mb-2
            ${action.color === 'primary' ? 'bg-primary/20 text-primary' : 
              action.color === 'secondary' ? 'bg-secondary/20 text-secondary' : 
              'bg-accent/20 text-accent'}`}>
            <action.icon size={20} strokeWidth={2} />
          </div>
          <span className="text-xs font-medium">{action.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default QuickActions;
