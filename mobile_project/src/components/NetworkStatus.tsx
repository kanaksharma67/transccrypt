
import { useNetworkStatus } from '@/utils/networkStatus';
import { Wifi, WifiOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/sonner';

export const NetworkStatus = ({ showTimestamp = true }: { showTimestamp?: boolean }) => {
  const { isOnline, lastChecked } = useNetworkStatus();
  const [prevStatus, setPrevStatus] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Only notify on network status change after initial load
    if (prevStatus !== null && prevStatus !== isOnline) {
      // Check notification preferences
      try {
        const prefsJson = localStorage.getItem('stellar_notification_preferences');
        const prefs = prefsJson ? JSON.parse(prefsJson) : { networkStatusChange: true };
        
        if (prefs.networkStatusChange) {
          if (isOnline) {
            toast.success('Network connection restored', {
              description: 'Processing any pending transactions...',
              duration: 5000
            });
          } else {
            toast.warning('Network connection lost', {
              description: 'Transactions will be saved offline',
              duration: 5000
            });
          }
        }
      } catch (error) {
        console.error('Failed to check notification preferences:', error);
      }
    }
    
    setPrevStatus(isOnline);
  }, [isOnline, prevStatus]);
  
  const lastCheckedText = showTimestamp && lastChecked ? 
    `Last checked: ${formatDistanceToNow(lastChecked, { addSuffix: true })}` : 
    '';

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
      isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Offline</span>
        </>
      )}
      {lastCheckedText && (
        <span className="text-xs opacity-75">
          {lastCheckedText}
        </span>
      )}
    </div>
  );
};
