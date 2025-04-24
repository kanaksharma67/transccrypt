
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StellarAccount } from '@/types/stellar';
import { loadAccount } from '@/utils/stellarOperations';
import { AccountManager } from './AccountManager';
import { getActiveAccount } from '@/utils/accountStorage';
import { toast } from '@/components/ui/sonner';

export const AccountInfo = () => {
  const [account, setAccount] = useState<StellarAccount>({
    publicKey: '',
    balance: '0',
    isLoading: false,
    error: null
  });

  // Load account data initially if we have a saved active account
  useEffect(() => {
    const savedAccount = getActiveAccount();
    if (savedAccount) {
      setAccount(prev => ({ 
        ...prev, 
        ...savedAccount,
        isLoading: true 
      }));
      loadAccountData(savedAccount.publicKey);
    }
  }, []);

  // Function to load account data
  const loadAccountData = async (publicKey: string) => {
    if (!publicKey) return;
    
    try {
      const accountData = await loadAccount(publicKey);
      setAccount(prev => ({
        ...prev,
        ...accountData,
        name: prev.name
      }));
      
      // Check if balance is below threshold for notification
      try {
        const prefsJson = localStorage.getItem('stellar_notification_preferences');
        const prefs = prefsJson ? JSON.parse(prefsJson) : null;
        
        if (prefs?.lowBalance && accountData.balance) {
          const balance = parseFloat(accountData.balance);
          const threshold = parseFloat(prefs.balanceThreshold);
          
          if (!isNaN(balance) && !isNaN(threshold) && balance < threshold) {
            toast.warning('Low balance alert', {
              description: `Your balance (${balance} XLM) is below the threshold (${threshold} XLM)`,
              duration: 8000
            });
          }
        }
      } catch (error) {
        console.error('Failed to check low balance notification:', error);
      }
    } catch (error) {
      setAccount(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load account'
      }));
    }
  };

  const refreshAccount = () => {
    if (account.publicKey) {
      setAccount(prev => ({ ...prev, isLoading: true }));
      loadAccountData(account.publicKey);
    }
  };
  
  const handleAccountChange = (newAccount: StellarAccount) => {
    setAccount(prev => ({ 
      ...prev, 
      ...newAccount,
      isLoading: true 
    }));
    
    if (newAccount.publicKey) {
      loadAccountData(newAccount.publicKey);
    }
  };

  return (
    <div className="space-y-4">
      <AccountManager onAccountChange={handleAccountChange} />
      
      <Card className="w-full">
        <CardContent className="pt-6">
          {account.publicKey ? (
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">Account ID</p>
                <p className="text-xs break-all bg-gray-50 p-2 rounded">
                  {account.publicKey}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Balance</p>
                <p className="text-2xl font-bold">
                  {account.isLoading ? 'Loading...' : `${account.balance} XLM`}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="mb-4">No account connected</p>
              <p className="text-sm text-gray-500">Add an account using the account manager above</p>
            </div>
          )}
          {account.error && (
            <p className="text-red-500 text-sm mt-2">{account.error}</p>
          )}
        </CardContent>
        {account.publicKey && (
          <CardFooter className="justify-between">
            <Button 
              variant="outline"
              onClick={refreshAccount}
              disabled={account.isLoading}
            >
              Refresh Balance
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
