
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Users, ArrowRight } from 'lucide-react';
import { Badge } from "./badge"

export type Transaction = {
  id: string;
  type: 'sent' | 'received' | 'converted' | 'split';
  title: string;
  description?: string;
  amount: number;
  currency: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
};

type TransactionListProps = {
  transactions: Transaction[];
  showViewAll?: boolean;
};

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions,
  showViewAll = true
}) => {
  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'sent':
        return <ArrowUpRight className="text-crypto-error" />;
      case 'received':
        return <ArrowDownLeft className="text-crypto-success" />;
      case 'converted':
        return <RefreshCw className="text-crypto-secondary" />;
      case 'split':
        return <Users className="text-crypto-primary" />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-crypto-success/20 text-crypto-success';
      case 'pending':
        return 'bg-crypto-warning/20 text-crypto-warning';
      case 'failed':
        return 'bg-crypto-error/20 text-crypto-error';
    }
  };

  return (
    <div className="glass-card p-5 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold">Recent Transactions</h3>
        {showViewAll && (
          <motion.button 
            className="text-sm text-crypto-text-secondary flex items-center space-x-1"
            whileHover={{ x: 3 }}
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </motion.button>
        )}
      </div>
      
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-6 text-crypto-text-secondary">
            No transactions yet
          </div>
        ) : (
          transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-xl bg-crypto-card/60"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ x: 3 }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-muted">
                  {getIcon(transaction.type)}
                </div>
                <div>
                  <div className="text-sm font-medium">{transaction.title}</div>
                  <div className="text-xs text-crypto-text-secondary">
                    {transaction.date.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm ${
                  transaction.type === 'sent' ? 'text-crypto-error' : 
                  transaction.type === 'received' ? 'text-crypto-success' : ''
                }`}>
                  {transaction.type === 'sent' ? '-' : 
                   transaction.type === 'received' ? '+' : ''}
                  {transaction.currency}{transaction.amount.toLocaleString()}
                </div>
                <Badge 
                  variant="outline"
                  className={`text-[10px] ${getStatusColor(transaction.status)}`}
                >
                  {transaction.status}
                </Badge>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;
