
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { createFluvioConsumer, MarketData } from "@/lib/fluvio-client";
import { toast } from "sonner";

interface MarketEvent {
  id: string;
  market: string;
  symbol: string;
  event: string;
  severity: "info" | "warning" | "alert";
  timestamp: Date;
}

export function MarketEventsFeed() {
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const fluvioConsumer = useRef<ReturnType<typeof createFluvioConsumer> | null>(null);

  useEffect(() => {
    const connectToFluvio = () => {
      console.log("MarketEventsFeed: Connecting to Fluvio");
      
      try {
        fluvioConsumer.current = createFluvioConsumer("processed-market-data")
          .onMessage((data: MarketData) => {
            // Convert market data into notable events
            if (data.price > 150 || data.volume > 5000) {
              const event: MarketEvent = {
                id: Math.random().toString(36).substring(2, 9),
                market: data.market,
                symbol: data.symbol,
                event: data.volume > 5000 
                  ? `Large volume detected: ${data.volume} shares` 
                  : `Price spike detected: $${data.price.toFixed(2)}`,
                severity: data.volume > 7000 || data.price > 180 ? "alert" : "warning",
                timestamp: new Date(data.timestamp)
              };
              
              setEvents(prev => [event, ...prev.slice(0, 9)]);
            }
          })
          .stream();
          
        setIsConnected(true);
        toast.success("Connected to Fluvio market events");
      } catch (error) {
        console.error("MarketEventsFeed: Failed to connect", error);
        toast.error("Failed to connect to market events");
      }
    };
    
    connectToFluvio();
    
    return () => {
      if (fluvioConsumer.current) {
        fluvioConsumer.current.close();
      }
    };
  }, []);
  
  return (
    <Card className="h-full bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-400" />
            Market Events
          </h3>
          <div>
            {isConnected ? (
              <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-0">
                Fluvio Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-500/20 text-red-400 border-0">
                Disconnected
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          {events.length > 0 ? (
            events.map((event) => (
              <div 
                key={event.id} 
                className={`p-3 rounded-lg border ${
                  event.severity === "alert" 
                    ? "bg-red-500/10 border-red-500/30" 
                    : event.severity === "warning"
                      ? "bg-amber-500/10 border-amber-500/30"
                      : "bg-blue-500/10 border-blue-500/30"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">
                        {event.symbol}
                      </span>
                      <Badge 
                        className={
                          event.severity === "alert" 
                            ? "bg-red-500" 
                            : event.severity === "warning"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                        }
                      >
                        {event.severity}
                      </Badge>
                    </div>
                    <p className="mt-1 text-slate-300">
                      {event.event}
                    </p>
                    <div className="mt-1 text-xs text-slate-400">
                      Market: {event.market}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {event.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400">
              {isConnected 
                ? "Waiting for significant market events..." 
                : "Connecting to market events feed..."
              }
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
