import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function DashboardHeader() {
  return (
    <section className="container py-10">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="mb-6 bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
              Your Offline Payment Solution
              <span className="mt-2 block text-white">
                <span className="text-emerald-400">Trans</span>
                <span className="text-white">Crypt</span>
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300">
              Powered by <span className="text-emerald-400">Fluvio</span> for real-time market event tracking and <span className="text-sky-400">Stellar</span> blockchain for executing secure international trades.
            </p>
            <div className="mb-16 flex flex-wrap justify-center gap-4">
              <Button
                className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-500 px-8 py-6 text-lg font-medium text-white hover:from-sky-500 hover:to-blue-600"
              >
                Start Trading <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="rounded-lg border border-slate-700 px-8 py-6 text-lg font-medium text-white hover:bg-slate-800 hover:text-white"
              >
                Learn More
              </Button>
            </div>
          </>
        }
      >
        <div className="mx-auto max-w-11xl overflow-hidden rounded-xl bg-slate-900 backdrop-blur-sm">
          <div className="relative p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-sm font-medium text-slate-400">International Finance Dashboard</div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm md:col-span-2">
                <div className="mb-2 text-sm text-slate-400">Stellar (XLM)</div>
                <div className="text-3xl font-bold text-white">$0.1247 USD</div>
                <div className="mt-2 flex items-center text-sm text-emerald-400">
                  <ArrowRight className="mr-1 h-3 w-3 rotate-45" />
                  +3.8% in 24h
                </div>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm">
                <div className="mb-2 text-sm text-slate-400">Fluvio Status</div>
                <div className="flex items-center text-lg font-medium text-emerald-400">
                  <div className="mr-2 h-2 w-2 rounded-full bg-emerald-400"></div>
                  Active
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-slate-800/50 p-4 backdrop-blur-sm">
              <div className="mb-4 text-sm font-medium text-slate-400">Market Overview</div>
              <div className="space-y-3">
                {[
                  { name: "Bitcoin (BTC)", price: "$42,567.89", change: "+2.4%", color: "text-emerald-400" },
                  { name: "Ethereum (ETH)", price: "$2,341.56", change: "-1.2%", color: "text-red-400" },
                  { name: "Ripple (XRP)", price: "$0.5423", change: "+0.8%", color: "text-emerald-400" },
                  { name: "Cardano (ADA)", price: "$0.3812", change: "-0.5%", color: "text-red-400" },
                ].map((crypto, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-slate-700/50 p-3 hover:bg-slate-700/70 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600">
                        <span className="text-xs font-bold text-white">
                          {crypto.name.split(" ")[1].replace("(", "").replace(")", "")}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{crypto.name}</div>
                        <div className="text-xs text-slate-400">Updated just now</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-medium text-white">{crypto.price}</div>
                      <div className={`text-xs ${crypto.color}`}>{crypto.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}