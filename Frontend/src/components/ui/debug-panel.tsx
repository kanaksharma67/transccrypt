
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal } from "lucide-react";

export function DebugPanel() {
  const [logs, setLogs] = useState<{message: string, timestamp: Date}[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Override console.log
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = function(...args) {
      originalLog.apply(console, args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      setLogs(prev => [{message, timestamp: new Date()}, ...prev.slice(0, 49)]);
    };

    console.error = function(...args) {
      originalError.apply(console, args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      setLogs(prev => [{message: `ERROR: ${message}`, timestamp: new Date()}, ...prev.slice(0, 49)]);
    };

    console.warn = function(...args) {
      originalWarn.apply(console, args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      setLogs(prev => [{message: `WARNING: ${message}`, timestamp: new Date()}, ...prev.slice(0, 49)]);
    };

    // Log initial message
    console.log("Debug panel initialized");
    
    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + 
           date.getMilliseconds().toString().padStart(3, '0');
  };

  if (!isVisible) {
    return (
      <button 
        className="fixed bottom-4 right-4 bg-slate-800 text-white p-2 rounded-full shadow-lg z-50"
        onClick={() => setIsVisible(true)}
      >
        <Terminal className="w-5 h-5" />
      </button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[600px] max-h-[400px] overflow-hidden bg-slate-800/90 border-slate-700 backdrop-blur-sm z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white flex items-center">
            <Terminal className="h-5 w-5 mr-2 text-sky-400" />
            Debug Console
          </h3>
          <div className="flex items-center gap-2">
            <Badge className="bg-sky-500">
              {logs.length} Logs
            </Badge>
            <button 
              className="text-slate-400 hover:text-white"
              onClick={() => setLogs([])}
            >
              Clear
            </button>
            <button 
              className="text-slate-400 hover:text-white"
              onClick={() => setIsVisible(false)}
            >
              Minimize
            </button>
          </div>
        </div>
        
        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 font-mono text-xs bg-slate-900/70 p-2 rounded">
          {logs.length === 0 ? (
            <div className="text-slate-400 text-center py-4">No logs yet</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex">
                <span className="text-slate-500 mr-2">[{formatTime(log.timestamp)}]</span>
                <span className={`${log.message.startsWith('ERROR:') ? 'text-red-400' : 
                  log.message.startsWith('WARNING:') ? 'text-amber-400' : 'text-slate-200'}`}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
