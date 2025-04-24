/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Cloud, CloudOff } from "lucide-react";
import { toast } from "sonner";
import { PriceChangeIndicator } from "@/components/ui/price-change-indicator";
import { VolumeIndicator } from "@/components/ui/volume-indicator";
import { Progress } from "@/components/ui/progress";
import { createFluvioConsumer, MarketData } from "@/lib/fluvio-client";

interface MarketTick {
  s: string;  // symbol
  p: string;  // price
  t: number;  // timestamp
  v?: number;  // volume (optional)
  c?: number;  // 24h change percentage (optional)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const USE_FLUVIO = true;

const TRADING_PAIRS = [
  'btcusdt',
  'ethusdt',
  'xrpusdt',
  'dogeusdt',
  'bnbusdt',
  'adausdt'
];

const THROTTLE_INTERVAL = 500; // Update every 500ms

export function WebSocketMarketFeed() {
  const [ticks, setTicks] = useState<MarketTick[]>([]);
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [updateRate, setUpdateRate] = useState(0);
  const [connectionStrength, setConnectionStrength] = useState(0);
  const fluvioConsumerRef = useRef<ReturnType<typeof createFluvioConsumer> | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 2000;
  const lastUpdateTime = useRef<number>(Date.now());
  const updateCount = useRef(0);
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);
  const pendingTicks = useRef<MarketTick[]>([]);

  useEffect(() => {
    console.log("FluvioMarketFeed: Setting up update rate calculation");
    const interval = setInterval(() => {
      const now = Date.now();
      const rate = Math.round((updateCount.current / ((now - lastUpdateTime.current) / 1000)) * 10) / 10;
      setUpdateRate(rate);
      console.log(`FluvioMarketFeed: Current update rate: ${rate}/s, Updates in last period: ${updateCount.current}`);
      updateCount.current = 0;
      lastUpdateTime.current = now;
    }, 1000);

    return () => {
      clearInterval(interval);
      console.log("FluvioMarketFeed: Cleared update rate interval");
    };
  }, []);

  const processPendingTicks = () => {
    if (pendingTicks.current.length > 0) {
      console.log(`FluvioMarketFeed: Processing ${pendingTicks.current.length} pending ticks`);
      setTicks(prev => [...pendingTicks.current, ...prev.slice(0, 10 - pendingTicks.current.length)]);
      pendingTicks.current = [];
    }
  };

  const connectFluvio = () => {
    setStatus("connecting");
    setConnectionStrength(30); // Initial connection strength
    
    try {
      fluvioConsumerRef.current = createFluvioConsumer("processed-market-data")
        .onMessage((data: MarketData) => {
          const newTick: MarketTick = {
            s: `${data.symbol}/${data.market}`,
            p: data.price.toString(),
            t: new Date(data.timestamp).getTime(),
            v: data.volume,
            c: Math.random() > 0.5 ? 3.8 : -2.1
          };
          
          updateCount.current++;
          pendingTicks.current = [newTick, ...pendingTicks.current];
          
          // Simulate connection strength changes
          setConnectionStrength(prev => 
            Math.min(100, Math.max(60, prev + (Math.random() > 0.5 ? 5 : -3)))
          );
          
          if (!throttleTimeout.current) {
            throttleTimeout.current = setTimeout(() => {
              processPendingTicks();
              throttleTimeout.current = null;
            }, THROTTLE_INTERVAL);
          }
        })
        .stream();
      
      setStatus("connected");
      setConnectionStrength(80);
      toast.success("Connected to Fluvio stream");
      
    } catch (error) {
      console.error('Fluvio connection error:', error);
      setConnectionStrength(0);
      toast.error("Failed to connect to Fluvio stream");
      setStatus("disconnected");
      
      if (reconnectAttempts.current < maxReconnectAttempts) {
        toast.warning(`Reconnecting to Fluvio... (${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);
        setTimeout(connectFluvio, reconnectDelay);
        reconnectAttempts.current += 1;
      }
    }
  };

  useEffect(() => {
    connectFluvio();
    
    return () => {
      if (fluvioConsumerRef.current) {
        fluvioConsumerRef.current.close();
      }
      
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
  }, []);

  return (
    <Card className="h-full bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white flex items-center">
            <Cloud 
              className={`h-5 w-5 mr-2 ${
                status === "connected" 
                  ? "text-emerald-400 animate-pulse" 
                  : "text-red-400"
              }`}
            />
            Fluvio Market Feed
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {status === "connected" ? (
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400">{updateRate}/s</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CloudOff className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-red-400">Offline</span>
                </div>
              )}
            </div>
            <Badge 
              className={`transition-colors duration-300 ${
                status === "connected" 
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                  : status === "connecting"
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
              }`}
            >
              {status === "connected" ? "Fluvio Live" : status === "connecting" ? "Connecting..." : "Disconnected"}
            </Badge>
          </div>
        </div>

        {status === "connected" && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Connection Strength</span>
              <span>{connectionStrength}%</span>
            </div>
            <Progress 
              value={connectionStrength} 
              className="h-1 bg-slate-700"
              indicatorClassName={`${
                connectionStrength > 70 
                  ? "bg-emerald-500" 
                  : connectionStrength > 30 
                    ? "bg-amber-500" 
                    : "bg-red-500"
              }`}
            />
          </div>
        )}

        <div className="space-y-3">
          {ticks.map((tick, i) => (
            <div 
              key={i}
              className="p-3 rounded-lg bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700/70 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{tick.s}</span>
                    <PriceChangeIndicator value={tick.c} />
                  </div>
                  <div className="flex items-center mt-1 space-x-3">
                    <p className="text-sm text-slate-300">
                      ${parseFloat(tick.p).toFixed(2)}
                    </p>
                    <VolumeIndicator value={tick.v} />
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(tick.t).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {ticks.length === 0 && status === "connected" && (
            <div className="text-center text-slate-400 py-8">
              Waiting for market data...
            </div>
          )}
          
          {status === "connecting" && (
            <div className="text-center text-slate-400 py-8">
              Connecting to market feed...
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
