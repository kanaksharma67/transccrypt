import { FinanceChart } from "@/components/ui/finance-chart";
import { StellarTradeExecutor } from "@/components/ui/stellar-trade-executor";
import { StellarWalletConnect } from "@/components/ui/stellar-wallet-connect";
import { WebSocketMarketFeed } from "@/components/ui/websocket-market-feed";
import { MarketEventsFeed } from "@/components/ui/market-events-feed";
import { Card } from "@/components/ui/card";

export function MarketCharts() {
  return (
    <section className="container py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FinanceChart symbol="XLM/USD" />
        </div>
        <div className="space-y-6">
          <StellarWalletConnect />
          <StellarTradeExecutor />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <WebSocketMarketFeed />
            <MarketEventsFeed />
          </div>
        </div>
        
        <div>
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
            <div className="p-4">
              <h3 className="text-lg font-medium text-white mb-4">Market Watch</h3>
              
              <div className="space-y-3">
                {[
                  { pair: "XLM/USD", price: "0.1247", change: "+3.8%", isUp: true },
                  { pair: "USD/EUR", price: "0.9124", change: "-0.4%", isUp: false },
                  { pair: "USD/JPY", price: "152.35", change: "+0.2%", isUp: true },
                  { pair: "USD/GBP", price: "0.7814", change: "-0.5%", isUp: false },
                  { pair: "BTC/USD", price: "42,567.89", change: "+2.4%", isUp: true },
                  { pair: "ETH/USD", price: "2,341.56", change: "-1.2%", isUp: false },
                ].map((market, i) => (
                  <div 
                    key={i}
                    className="flex justify-between items-center p-3 rounded-lg bg-slate-700/50 border border-slate-600/50"
                  >
                    <span className="font-medium text-white">{market.pair}</span>
                    <div className="text-right">
                      <div className="text-white">{market.price}</div>
                      <div className={market.isUp ? "text-emerald-400 text-sm" : "text-red-400 text-sm"}>
                        {market.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button 
                  className="w-full border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
                >
                  View All Markets
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
