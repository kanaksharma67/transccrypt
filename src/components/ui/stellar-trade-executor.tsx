import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, RefreshCw, TrendingUp, Shield } from "lucide-react";
import stellarTrader, { TradeResult } from "@/lib/stellar-client";
import { toast } from "sonner";

export function StellarTradeExecutor() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("XLM");
  const [orderType, setOrderType] = useState("market");
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastTrade, setLastTrade] = useState<TradeResult | null>(null);
  const [stellarStatus, setStellarStatus] = useState<"disconnected" | "connected">("disconnected");
  
  const currencies = [
    { value: "XLM", label: "Stellar (XLM)" },
    { value: "USD", label: "US Dollar (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "JPY", label: "Japanese Yen (JPY)" },
    { value: "GBP", label: "British Pound (GBP)" },
    { value: "BTC", label: "Bitcoin (BTC)" },
    { value: "ETH", label: "Ethereum (ETH)" },
  ];

  // Connect to Stellar on component load
  useEffect(() => {
    // In a real app, we would request secret key from user
    // For demo, we'll use a dummy test account 
    const connectToStellar = async () => {
      // Demo secret key for testnet (never use this in production!)
      const demoSecretKey = "SDNLMIQFH3FX4XX2JMHIYGDCMZL5GE6GWHWNQSRLB7Y4M34I6KCHEVHE";
      
      try {
        const connected = await stellarTrader.connect(demoSecretKey);
        if (connected) {
          setStellarStatus("connected");
          toast.success("Connected to Stellar network");
        }
      } catch (error) {
        console.error("Failed to connect to Stellar network:", error);
        toast.error("Failed to connect to Stellar network");
      }
    };
    
    connectToStellar();
  }, []);

  const handleExecuteTrade = async () => {
    if (!amount || isNaN(Number(amount))) return;
    
    setIsExecuting(true);
    
    try {
      // Execute trade using the Stellar SDK wrapper
      const result = await stellarTrader.executeTrade({
        assetCode: toCurrency,
        amount: Number(amount),
        action: fromCurrency === "USD" ? "buy" : "sell"
      });
      
      setLastTrade(result);
      toast.success("Trade executed successfully");
      setAmount("");
    } catch (error) {
      console.error("Trade execution failed:", error);
      toast.error("Trade execution failed");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-emerald-400" />
            Stellar Trade Executor
          </h3>
          <div>
            {stellarStatus === "connected" ? (
              <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                Stellar Connected
              </span>
            ) : (
              <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
                Stellar Disconnected
              </span>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400">Order Type</label>
            <div className="flex space-x-2 mt-1">
              <Button 
                size="sm"
                variant={orderType === "market" ? "default" : "outline"}
                className={orderType === "market" ? "bg-sky-500 hover:bg-sky-600" : "border-slate-600 text-slate-300"}
                onClick={() => setOrderType("market")}
              >
                Market
              </Button>
              <Button 
                size="sm"
                variant={orderType === "limit" ? "default" : "outline"}
                className={orderType === "limit" ? "bg-purple-500 hover:bg-purple-600" : "border-slate-600 text-slate-300"}
                onClick={() => setOrderType("limit")}
              >
                Limit
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="text-sm text-slate-400 mb-1 block">From</label>
              <Select 
                value={fromCurrency}
                onValueChange={(value) => setFromCurrency(value)}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {currencies.map((currency) => (
                    <SelectItem 
                      key={currency.value} 
                      value={currency.value}
                      className="text-white hover:bg-slate-700"
                    >
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end pb-2">
              <ArrowRight className="h-5 w-5 text-slate-400" />
            </div>
            
            <div className="flex-1">
              <label className="text-sm text-slate-400 mb-1 block">To</label>
              <Select 
                value={toCurrency}
                onValueChange={(value) => setToCurrency(value)}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {currencies.map((currency) => (
                    <SelectItem 
                      key={currency.value} 
                      value={currency.value}
                      className="text-white hover:bg-slate-700"
                    >
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Amount</label>
            <Input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
          
          <Button 
            onClick={handleExecuteTrade}
            disabled={!amount || isNaN(Number(amount)) || isExecuting}
            className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
          >
            {isExecuting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Execute Trade</>
            )}
          </Button>
        </div>
        
        {lastTrade && (
          <div className="mt-4 p-3 rounded-lg bg-slate-700/50 border border-slate-600">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-300">Last Trade</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 py-1 px-2 rounded-full">
                {lastTrade.status}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">
                {lastTrade.amount} {lastTrade.fromAsset}
              </span>
              <span className="flex items-center text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                Rate: {lastTrade.rate.toFixed(6)}
              </span>
            </div>
            
            <div className="mt-1 text-sm text-white">
              Received: {(lastTrade.amount * lastTrade.rate).toFixed(6)} {lastTrade.toAsset}
            </div>
            
            <div className="mt-2 text-xs text-slate-400 truncate">
              Tx: {lastTrade.hash}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
