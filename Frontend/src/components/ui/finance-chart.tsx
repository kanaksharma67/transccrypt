/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartProps {
  symbol: string;
}

export function FinanceChart({ symbol = "XLM/USD" }: ChartProps) {
  const [timeframe, setTimeframe] = useState("1D");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    
    // Simulate fetching chart data
    setTimeout(() => {
      // Generate data based on timeframe
      const now = new Date();
      const points = timeframe === "1H" ? 60 : timeframe === "1D" ? 24 : timeframe === "1W" ? 7 : 30;
      const interval = timeframe === "1H" ? 60000 : timeframe === "1D" ? 3600000 : timeframe === "1W" ? 86400000 : 86400000;
      const startPrice = symbol === "XLM/USD" ? 0.1247 : symbol === "BTC/USD" ? 42567.89 : 2341.56;
      const volatility = symbol === "XLM/USD" ? 0.0005 : symbol === "BTC/USD" ? 300 : 30;
      
      const generatePrice = (prevPrice: number) => {
        return prevPrice + (Math.random() * volatility * 2 - volatility);
      };
      
      const chartData = [];
      let currentPrice = startPrice;
      
      for (let i = points; i >= 0; i--) {
        currentPrice = generatePrice(currentPrice);
        const timestamp = new Date(now.getTime() - i * interval);
        
        chartData.push({
          timestamp: timeframe === "1H" 
            ? timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : timeframe === "1D"
              ? `${timestamp.getHours()}:00`
              : timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' }),
          price: currentPrice,
          volume: Math.floor(Math.random() * 1000000)
        });
      }
      
      setData(chartData);
      setLoading(false);
    }, 500);
  }, [timeframe, symbol]);
  
  const currentPrice = data.length > 0 ? data[data.length - 1].price : 0;
  const prevPrice = data.length > 0 ? data[0].price : 0;
  const priceChange = currentPrice - prevPrice;
  const percentChange = prevPrice !== 0 ? (priceChange / prevPrice) * 100 : 0;
  const isPriceUp = priceChange >= 0;

  // Format price based on value
  const formatCurrency = (value: number) => {
    if (value < 1) return value.toFixed(4);
    if (value < 10) return value.toFixed(3);
    if (value < 1000) return value.toFixed(2);
    return value.toFixed(0);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">{symbol} Chart</h3>
          <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
            <TabsList className="bg-slate-700/50">
              <TabsTrigger value="1H">1H</TabsTrigger>
              <TabsTrigger value="1D">1D</TabsTrigger>
              <TabsTrigger value="1W">1W</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex items-baseline space-x-2 mb-4">
          <span className="text-2xl font-bold text-white">
            ${formatCurrency(currentPrice)}
          </span>
          <span className={`flex items-center text-sm ${isPriceUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPriceUp ? '+' : ''}{formatCurrency(priceChange)} ({percentChange.toFixed(2)}%)
          </span>
        </div>
        
        {loading ? (
          <div className="h-[300px] flex items-center justify-center text-slate-400">
            Loading chart data...
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 5,
                  right: 5,
                  left: 0,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPriceUp ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isPriceUp ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#9ca3af" 
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    borderColor: '#374151',
                    color: '#e5e7eb'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isPriceUp ? "#10b981" : "#ef4444"} 
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}
