
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, RefreshCcw, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

interface Currency {
  id: string;
  name: string;
  symbol: string;
  flag: string;
  currentPrice: number;
}

const FIAT_CURRENCIES: Currency[] = [
  {
    id: "usd",
    name: "US Dollar",
    symbol: "USD",
    flag: "🇺🇸",
    currentPrice: 1
  },
  {
    id: "eur",
    name: "Euro",
    symbol: "EUR",
    flag: "🇪🇺",
    currentPrice: 0.92
  },
  {
    id: "gbp",
    name: "British Pound",
    symbol: "GBP",
    flag: "🇬🇧",
    currentPrice: 0.78
  },
  {
    id: "jpy",
    name: "Japanese Yen",
    symbol: "JPY",
    flag: "🇯🇵",
    currentPrice: 151.83
  },
  {
    id: "cad",
    name: "Canadian Dollar",
    symbol: "CAD",
    flag: "🇨🇦",
    currentPrice: 1.38
  },
  {
    id: "aud",
    name: "Australian Dollar",
    symbol: "AUD",
    flag: "🇦🇺",
    currentPrice: 1.52
  },
  {
    id: "inr",
    name: "Indian Rupee",
    symbol: "INR",
    flag: "🇮🇳",
    currentPrice: 83.31
  },
  {
    id: "cny",
    name: "Chinese Yuan",
    symbol: "CNY",
    flag: "🇨🇳",
    currentPrice: 7.23
  }
];

const CRYPTO_CURRENCIES: Currency[] = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    flag: "₿",
    currentPrice: 0.000015 // in terms of USD
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    flag: "Ξ",
    currentPrice: 0.00028 // in terms of USD
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    flag: "◎",
    currentPrice: 0.0068 // in terms of USD
  },
  {
    id: "bnb",
    name: "Binance Coin",
    symbol: "BNB",
    flag: "BNB",
    currentPrice: 0.002 // in terms of USD
  },
  {
    id: "doge",
    name: "Dogecoin",
    symbol: "DOGE",
    flag: "Ð",
    currentPrice: 7.61 // in terms of USD
  }
];

const Convert = () => {
  // Changed initial fromCurrency to "btc" as we'll only show crypto options
  const [fromCurrency, setFromCurrency] = useState<string>("btc");
  const [toCurrency, setToCurrency] = useState<string>("usd");
  const [fromAmount, setFromAmount] = useState<string>("1");
  const [toAmount, setToAmount] = useState<string>("0");
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [fee, setFee] = useState<number>(2.5);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [showExtraRates, setShowExtraRates] = useState<boolean>(false);
  
  // Calculate exchange rate between currencies
  useEffect(() => {
    // Find the selected crypto currency
    const from = CRYPTO_CURRENCIES.find(c => c.id === fromCurrency);
    // Find the selected fiat currency
    const to = FIAT_CURRENCIES.find(c => c.id === toCurrency);
    
    if (from && to) {
      // For crypto, we calculate based on USD conversion rates
      const cryptoToUsd = 1 / from.currentPrice; // How many USD per 1 crypto
      const usdToTarget = to.currentPrice / FIAT_CURRENCIES[0].currentPrice; // How many target currency per 1 USD
      const rate = cryptoToUsd * usdToTarget;
      
      setExchangeRate(rate);
      
      // Calculate conversion
      const amount = parseFloat(fromAmount) || 0;
      const converted = amount * rate;
      setToAmount(converted.toFixed(4));
    }
  }, [fromCurrency, toCurrency, fromAmount]);

  // Handle form submission
  const handleConvert = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error("Please enter a valid amount to convert");
      return;
    }

    setIsConverting(true);
    
    // Simulate API call
    setTimeout(() => {
      const from = CRYPTO_CURRENCIES.find(c => c.id === fromCurrency);
      const to = FIAT_CURRENCIES.find(c => c.id === toCurrency);
      
      toast.success(`Successfully converted ₹{fromAmount} ₹{from?.symbol} to ₹{toAmount} ₹{to?.symbol}`);
      setIsConverting(false);
    }, 1200);
  };

  // Switch currencies is no longer needed since we only allow crypto -> fiat
  // Removed the handleSwitch function and related UI elements

  return (
    <div className="min-h-screen  text-white mt-14">
      <Navbar/>
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h2 className="text-3xl font-bold mb-8 animate-fade-in">Crypto to Fiat Converter</h2>

        {/* Main converter card */}
        
        {/* <div className="bg-[#1A1F2C] border border-gray-800 rounded-xl p-6 mb-8 shadow-lg animate-scale-in">
         */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6  shadow-xl border border-gray-700/30 animate-slide-up mb-6">

          {/* From Currency - Only Crypto Options */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">From (Cryptocurrency)</label>
            <div className="flex space-x-2">
              <div className="w-2/5">
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="bg-[#222222] border-gray-700 text-white hover:border-purple-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#222222] border-gray-700 text-white">
                    {CRYPTO_CURRENCIES.map((currency) => (
                      <SelectItem key={currency.id} value={currency.id}>
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center text-lg mr-2">
                            {currency.flag}
                          </div>
                          {currency.name} ({currency.symbol})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-3/5">
                <Input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="bg-[#222222] border-gray-700 text-white hover:border-purple-500 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Arrow indicator instead of switch button */}
          <div className="flex justify-center my-4">
            <div className="p-2 bg-gray-800 rounded-full">
              <ArrowDown className="text-purple-400" />
            </div>
          </div>

          {/* To Currency - Only Fiat Options */}
          <div className="mb-8">
            <label className="block text-sm text-gray-400 mb-2">To (Fiat Currency)</label>
            <div className="flex space-x-2">
              <div className="w-2/5">
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="bg-[#222222] border-gray-700 text-white hover:border-purple-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#222222] border-gray-700 text-white">
                    {FIAT_CURRENCIES.map((currency) => (
                      <SelectItem key={currency.id} value={currency.id}>
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center text-lg mr-2">
                            {currency.flag}
                          </div>
                          {currency.name} ({currency.symbol})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-3/5">
                <Input
                  type="text"
                  value={toAmount}
                  readOnly
                  className="bg-[#222222] border-gray-700 text-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Exchange info */}
          <div className="flex justify-between text-sm mb-6">
            <div className="text-gray-400">Exchange Rate</div>
            <div className="text-white">
              {exchangeRate > 0 ? (
                <>
                  1 {CRYPTO_CURRENCIES.find(c => c.id === fromCurrency)?.symbol} = {exchangeRate.toFixed(6)} {FIAT_CURRENCIES.find(c => c.id === toCurrency)?.symbol}
                </>
              ) : (
                "-"
              )}
            </div>
          </div>
          
          <div className="flex justify-between text-sm mb-8">
            <div className="text-gray-400">Fee</div>
            <div className="text-white">{fee}%</div>
          </div>

          {/* Convert button */}
          <Button 
            onClick={handleConvert} 
            disabled={isConverting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/20"
          >
            {isConverting ? (
              <div className="flex items-center justify-center">
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </div>
            ) : (
              "Convert Now"
            )}
          </Button>
        </div>

        {/* Live Exchange Rates */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6  shadow-xl border border-gray-700/30 animate-slide-up mb-5" style={{animationDelay: "200ms"}}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Crypto Exchange Rates</h3>
            <button 
              onClick={() => setShowExtraRates(!showExtraRates)}
              className="text-purple-400 text-sm flex items-center hover:text-purple-300 transition-colors"
            >
              <RefreshCcw className="w-3 h-3 mr-1" /> Refresh
            </button>
          </div>

          <div className="space-y-4">
            {CRYPTO_CURRENCIES.map((currency) => (
              <div key={currency.id} className="flex items-center justify-between p-3  rounded-lg hover:bg-gray-800 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full  flex items-center justify-center text-xl mr-3">
                    {currency.flag}
                  </div>
                  <div>
                    <div className="font-medium">{currency.name}</div>
                    <div className="text-xs text-gray-400">{currency.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">1 {currency.symbol} = {(1/currency.currentPrice).toFixed(2)} USD</div>
                  <div className={cn("text-xs", Math.random() > 0.5 ? "text-green-500" : "text-red-500")}>
                    {Math.random() > 0.5 ? "+" : "-"}{(Math.random() * 3).toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Extra features that appear when "Show Extra Rates" is clicked */}
          {showExtraRates && (
            <div className="mt-4 pt-4 border-t border-gray-700 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#222222] p-4 rounded-lg">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    <h4 className="font-medium">Market Insight</h4>
                  </div>
                  <div className="mt-2 text-sm text-gray-300">
                    BTC is <span className="text-green-400 font-medium">up 2.3%</span> in the last 24 hours
                  </div>
                </div>
                <div className="bg-[#222222] p-4 rounded-lg">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    <h4 className="font-medium">Fee Info</h4>
                  </div>
                  <div className="mt-2 text-sm text-gray-300">
                    Best rates: <span className="text-yellow-400 font-medium">1.5%</span> (Crypto transfer)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Recent Transactions - Extra Feature */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6  shadow-xl border border-gray-700/30 animate-slide-up" style={{animationDelay: "400ms"}}>
          <h3 className="text-xl font-semibold mb-6">Recent Transactions</h3>
          <div className="space-y-3">
            {[
              { from: "BTC", to: "USD", amount: "0.015", date: new Date(Date.now() - 1 * 3600000) },
              { from: "ETH", to: "EUR", amount: "0.35", date: new Date(Date.now() - 24 * 3600000) },
              { from: "SOL", to: "GBP", amount: "2.5", date: new Date(Date.now() - 72 * 3600000) }
            ].map((transaction, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-gray-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-900/30 text-purple-400 rounded-full flex items-center justify-center text-sm mr-3">
                    ⟷
                  </div>
                  <div>
                    <div className="font-medium">
                      {transaction.from} to {transaction.to}
                    </div>
                    <div className="text-xs text-gray-400">
                      {transaction.date.toLocaleTimeString()} · {transaction.date.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {transaction.amount} {transaction.from}
                  </div>
                  <div className="text-xs text-green-500">Completed</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Convert;