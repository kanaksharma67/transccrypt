
import { useEffect, useState } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [lastChecked, setLastChecked] = useState<number>(Date.now());

  useEffect(() => {
    const updateStatus = () => {
      setIsOnline(navigator.onLine);
      setLastChecked(Date.now());
    };

    const handleOnline = () => {
      setIsOnline(true);
      setLastChecked(Date.now());
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setLastChecked(Date.now());
    };

    // Check status every minute
    const interval = setInterval(updateStatus, 60000);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return { isOnline, lastChecked };
};
