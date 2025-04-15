import React, { useState } from 'react';
import { Search, Calendar, Filter, ArrowUpDown } from 'lucide-react';

const History = () => {
  const allTransactions = [
    { id: 1, type: 'sent', name: 'Alex Williams', date: '4/8/2025', amount: -250, status: 'completed' },
    { id: 2, type: 'received', name: 'John Smith', date: '4/7/2025', amount: 125.5, status: 'completed' },
    { id: 3, type: 'converted', name: 'BTC to ETH', date: '4/5/2025', amount: 540.75, status: 'completed' },
    { id: 4, type: 'split', name: 'Dinner with friends', date: '4/3/2025', amount: 42.3, status: 'pending' },
    { id: 5, type: 'sent', name: 'Sarah Johnson', date: '4/1/2025', amount: -75, status: 'completed' },
    { id: 6, type: 'converted', name: 'BTC to ETH', date: '4/5/2025', amount: 540.75, status: 'completed' },
    { id: 7, type: 'converted', name: 'BTC to ETH', date: '4/5/2025', amount: 540.75, status: 'completed' },

  ];

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = allTransactions.filter(tx => {
    if (activeFilter === 'all') return true;
    return tx.type === activeFilter;
  }).filter(tx => {
    if (!searchTerm) return true;
    return tx.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 mt-14">Transaction History</h1>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search transactions"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a2235] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white"
          />
        </div>
        <button className="p-2 bg-[#1a2235] rounded-lg text-gray-400 hover:text-white">
          <Calendar size={20} />
        </button>
        <button className="p-2 bg-[#1a2235] rounded-lg text-gray-400 hover:text-white">
          <Filter size={20} />
        </button>
        <button className="p-2 bg-[#1a2235] rounded-lg text-gray-400 hover:text-white">
          <ArrowUpDown size={20} />
        </button>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg  p-6  shadow-xl border border-gray-700/30 animate-slide-up rounded-lg overflow-hidden">
        <div className="flex gap-4 p-4 border-b border-gray-700">
          {['all', 'sent', 'received', 'converted', 'split'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full ₹{
                activeFilter === filter
                  ? 'bg-[#0f1629] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-4">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-4 border-b border-gray-700 last:border-0">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ₹{
                  tx.type === 'sent' ? 'bg-red-500/20 text-red-500' :
                  tx.type === 'received' ? 'bg-green-500/20 text-green-500' :
                  tx.type === 'converted' ? 'bg-blue-500/20 text-blue-500' :
                  'bg-purple-500/20 text-purple-500'
                }`}>
                  {tx.type[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{tx.name}</div>
                  <div className="text-sm text-gray-400">{tx.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={tx.amount < 0 ? 'text-red-400' : 'text-green-400'}>
                  {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount)}
                </div>
                <div className={`text-sm ₹{tx.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {tx.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;