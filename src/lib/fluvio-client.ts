export interface MarketData {
    market: string;
    symbol: string;
    price: number;
    volume: number;
    timestamp: string;
  }
  
  // Callback function type for consumers
  type ConsumerCallback = (data: MarketData) => void;
  

  const MARKETS = ["NASDAQ", "NYSE", "LSE", "TSE", "HKEX"];
  const SYMBOLS = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "XLM"];
  

  class FluvioConsumer {
    private topic: string;
    private interval: NodeJS.Timeout | null = null;
    private callbacks: ConsumerCallback[] = [];
    private isActive = false;
  
    constructor(topic: string) {
      this.topic = topic;
      console.log(`FluvioConsumer: Created for topic ${topic}`);
    }
  
    // Register a callback to receive market data
    onMessage(callback: ConsumerCallback) {
      this.callbacks.push(callback);
      return this;
    }
  
    // Start streaming data
    stream() {
      if (this.isActive) return this;
      
      this.isActive = true;
      console.log(`FluvioConsumer: Starting stream for ${this.topic}`);
      
      // Generate random market data at intervals
      this.interval = setInterval(() => {
        if (!this.isActive) return;
        
       
        const data: MarketData = {
          market: MARKETS[Math.floor(Math.random() * MARKETS.length)],
          symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          price: 100.0 + (Math.random() * 100.0),
          volume: Math.floor(Math.random() * 10000),
          timestamp: new Date().toISOString()
        };
        
        // Apply filtering for processed market data (similar to SmartModule in the Rust example)
        if (this.topic === "processed-market-data") {
          // Only process significant moves
          if (data.price <= 150.0 && data.volume <= 5000) {
            return;
          }
        }
        
        // Send data to all registered callbacks
        this.callbacks.forEach(callback => callback(data));
        
      }, this.topic === "market-data" ? 100 : 500); // Raw data more frequent than processed
      
      return this;
    }
  
    // Stop streaming
    close() {
      console.log(`FluvioConsumer: Closing stream for ${this.topic}`);
      this.isActive = false;
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  }
  
  // Create a consumer for a topic
  export function createFluvioConsumer(topic: string) {
    return new FluvioConsumer(topic);
  }
  
  // Create a producer for a topic (simulated, doesn't actually produce data)
  export function createFluvioProducer(topic: string) {
    return {
      send: (data: MarketData) => {
        console.log(`FluvioProducer: Sending data to ${topic}`, data);
        return Promise.resolve({ offset: Math.floor(Math.random() * 1000) });
      }
    };
  }
  