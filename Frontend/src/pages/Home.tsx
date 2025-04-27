import React, { useEffect, useState } from 'react';
import { Send, ReceiptIcon, RefreshCw, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import SpendingChart from '@/components/ui/SpendingChart';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import Payment from './Payment';
import PaymentButton from '@/components/ui/PaymentButton';
import TransactionList, { Transaction } from '@/components/ui/TransactionList';
import QuickActions from '@/components/ui/QuickActions';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const Home = () => {
  const { user } = useAuth();
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(true); // <-- New loading state
  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true); // <-- Start loading
        const res = await axios.post('https://transcryptbackend.vercel.app/balance', {
          wallet_addresses: user?.wallet_addresses,
        });
        setBalances(res.data.balances);
      } catch (err) {
        console.error('Failed to fetch balances', err);
      } finally {
        setLoading(false); // <-- End loading
      }
    };

    if (user?.wallet_addresses) {
      fetchBalances();
    }
  }, [user]);

  const displayData = balances
    ? Object.entries(balances).map(([key, value]) => {
      const coinNameMap = {
        BTC: { name: 'Bitcoin', color: 'bg-purple-600', icon: '₿' },
        ETH: { name: 'Ethereum', color: 'bg-teal-600', icon: 'Ξ' },
        SOL: { name: 'Solana', color: 'bg-green-600', icon: '◎' },
        INR: { name: 'Indian Rupee', color: 'bg-yellow-500', icon: '₹' }
      };

      const coin = coinNameMap[key] || { name: key, color: 'bg-gray-600' };
      return {
        name: coin.name,
        amount: `${value.balance} ${key}`,
        value: `₹${value.inr_value.toLocaleString()}`,
        change: `${value.change_24h > 0 ? '+' : ''}${value.change_24h}%`,
        color: coin.color,
        inr_value: value.inr_value,
        change_24h: value.change_24h,
      };
    })
    : [];

  // 🧮 Calculate total balance and today's total change
  const totalBalance = displayData.reduce((sum, asset) => sum + asset.inr_value, 0);
  const todayChange = displayData.length
    ? displayData.reduce((sum, asset) => sum + (asset.inr_value * asset.change_24h / 100), 0)
    : 0;
  const todayChangePercent = totalBalance !== 0 ? (todayChange / totalBalance) * 100 : 0;

  const formattedTotalBalance = `₹${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  const formattedChange = `${todayChangePercent > 0 ? '+' : ''}${todayChangePercent.toFixed(2)}%`;

  return (
    <div className="space-y-6 mt-16">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-400">Track your crypto assets and transactions</p>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg shadow-xl border border-gray-700/30 animate-slide-up rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-gray-400 mb-2">Total Balance</h2>

          {loading ? (
            <div className="text-lg text-gray-400">Processing wallet balance...</div>
          ) : (
            <>
              <div className="text-4xl font-bold">{formattedTotalBalance}</div>
              <div className={todayChangePercent >= 0 ? "text-green-400 text-sm mt-1" : "text-red-400 text-sm mt-1"}>
                {formattedChange} today
              </div>
            </>
          )}
        </div>

        {!loading && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Your Assets</h3>
              <Link to="/assets" className="text-purple-500 text-sm">See All</Link>
            </div>

            <div className="space-y-4">
              {displayData.map((asset) => (
                <div key={asset.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${asset.color} w-8 h-8 rounded-full flex items-center justify-center`}>
                      {asset.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold">{asset.name}</div>
                      <div className="text-gray-400 text-sm">{asset.amount}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{asset.value}</div>
                    <div className={asset.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                      {asset.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Link to="/send" className="bg-[#1a2235] p-6 rounded-lg text-center hover:bg-[#232b3d] transition">
          <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Send className="text-purple-500" size={24} />
          </div>
          <div>Send</div>
        </Link>
        <Link to="/receive" className="bg-[#1a2235] p-6 rounded-lg text-center hover:bg-[#232b3d] transition">
          <div className="bg-teal-600/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ReceiptIcon className="text-teal-500" size={24} />
          </div>
          <div>Receive</div>
        </Link>
        <Link to="/convert" className="bg-[#1a2235] p-6 rounded-lg text-center hover:bg-[#232b3d] transition">
          <div className="bg-teal-600/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
            <RefreshCw className="text-teal-500" size={24} />
          </div>
          <div>Convert</div>
        </Link>
        <Link to="/split-bill" className="bg-[#1a2235] p-6 rounded-lg text-center hover:bg-[#232b3d] transition">
          <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="text-purple-500" size={24} />
          </div>
          <div>Split</div>
        </Link>
      </div>
      {/* <QuickActions/> */}
      <PaymentButton />

      {/* <TransactionList  transactions={recentTransactions} /> */}


      {/* <div className="bg-[#1a2235] rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold">Spending Trend</h3>
          <div className="flex gap-2">
            <button className="px-4 py-1 bg-purple-500 rounded-full text-sm">Weekly</button>
            <button className="px-4 py-1 text-gray-400 hover:text-white">Monthly</button>
          </div>
        </div>
        <div className="h-[200px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div> */}

      {/* <SpendingChart
        data={chartData}
        period={chartPeriod}
        onChangePeriod={setChartPeriod}
      /> */}
    </div>
  );
};

export default Home;