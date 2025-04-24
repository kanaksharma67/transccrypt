
import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type SpendingChartProps = {
  data: Array<{
    name: string;
    amount: number;
  }>;
  period: 'weekly' | 'monthly';
  onChangePeriod: (period: 'weekly' | 'monthly') => void;
};

const SpendingChart: React.FC<SpendingChartProps> = ({ 
  data,
  period,
  onChangePeriod
}) => {
  return (
    <motion.div
      className="glass-card p-5 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold">Spending Trend</h3>
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          <button 
            className={`px-3 py-1 text-xs rounded-md ${
              period === 'weekly' ? 'bg-primary text-white' : 'text-crypto-text-secondary'
            }`}
            onClick={() => onChangePeriod('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`px-3 py-1 text-xs rounded-md ${
              period === 'monthly' ? 'bg-primary text-white' : 'text-crypto-text-secondary'
            }`}
            onClick={() => onChangePeriod('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#B2BEC3', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              hide={true}
              domain={['dataMin - 100', 'dataMax + 100']} 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1F2C',
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
              labelStyle={{ color: '#B2BEC3' }}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#6C5CE7" 
              fillOpacity={1}
              fill="url(#colorAmount)" 
              strokeWidth={2}
              activeDot={{ r: 6, fill: '#6C5CE7', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SpendingChart;
