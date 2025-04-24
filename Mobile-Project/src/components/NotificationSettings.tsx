
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NotificationPreferences } from '@/types/stellar';
import { toast } from '@/components/ui/sonner';

const NOTIFICATION_PREFS_KEY = 'stellar_notification_preferences';

export const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    transactionSuccess: true,
    transactionFailed: true,
    networkStatusChange: true,
    lowBalance: false,
    balanceThreshold: '10'
  });

  useEffect(() => {
    // Load saved preferences from localStorage
    try {
      const savedPrefs = localStorage.getItem(NOTIFICATION_PREFS_KEY);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    }
  }, []);

  const savePreferences = () => {
    try {
      localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(preferences));
      toast.success('Notification preferences saved');
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="transaction-success" className="flex-1">
            Transaction successful
          </Label>
          <Switch
            id="transaction-success"
            checked={preferences.transactionSuccess}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, transactionSuccess: checked }))
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="transaction-failed" className="flex-1">
            Transaction failed
          </Label>
          <Switch
            id="transaction-failed"
            checked={preferences.transactionFailed}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, transactionFailed: checked }))
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="network-status" className="flex-1">
            Network status changes
          </Label>
          <Switch
            id="network-status"
            checked={preferences.networkStatusChange}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, networkStatusChange: checked }))
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="low-balance" className="flex-1">
            Low balance warning
          </Label>
          <Switch
            id="low-balance"
            checked={preferences.lowBalance}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, lowBalance: checked }))
            }
          />
        </div>
        
        {preferences.lowBalance && (
          <div className="flex items-center gap-2">
            <Label htmlFor="balance-threshold" className="flex-shrink-0">
              Threshold (XLM):
            </Label>
            <Input
              id="balance-threshold"
              type="number"
              min="0"
              step="0.1"
              value={preferences.balanceThreshold}
              onChange={(e) => 
                setPreferences(prev => ({ 
                  ...prev, 
                  balanceThreshold: e.target.value 
                }))
              }
              className="w-24"
            />
          </div>
        )}
        
        <Button 
          onClick={savePreferences} 
          className="w-full mt-4"
        >
          Save Notification Settings
        </Button>
      </CardContent>
    </Card>
  );
};
