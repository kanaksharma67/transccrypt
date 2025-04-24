import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as StellarSdk from 'stellar-sdk';
import { toast } from '@/components/ui/sonner';
import { BlockchainTransactionResult } from '@/types/stellar';
import { useNetworkStatus } from '@/utils/networkStatus';
import { getPendingTransactions } from '@/utils/localStorage';
import { getAllAccounts, getActiveAccount } from '@/utils/accountStorage';
import { processPendingTransactions } from '@/utils/stellarOperations';

interface SecureTransactionContextType {
  sendTransaction: (
    publicKey: string,
    destination: string,
    amount: string,
    memo?: string
  ) => Promise<BlockchainTransactionResult>;
  isProcessing: boolean;
}

const SecureTransactionContext = createContext<SecureTransactionContextType | undefined>(undefined);

export const useSecureTransaction = () => {
  const context = useContext(SecureTransactionContext);
  if (context === undefined) {
    throw new Error('useSecureTransaction must be used within a SecureTransactionProvider');
  }
  return context;
};

interface SecureTransactionProviderProps {
  children: ReactNode;
}

// Network to use (test network for development, public for production)
const NETWORK = StellarSdk.Networks.TESTNET;
// Server for Horizon API
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

// Storage for private keys (simplified for demo since PIN is removed)
export const accountKeysMap: Record<string, string> = {
  // Default test account and secret key
  "GDBNVCPYINUVILL7FDVYFR6FYJOWPQKMZMYJBAQUBQBLJPQ6N2D7MHGG": "SBJSFMSXJICBDJDWCWASXPTIRBMPSYVH5EM66AXUKRO2SUATBNBSPDUE"
};

export const SecureTransactionProvider = ({ children }: SecureTransactionProviderProps) => {
  const { isOnline } = useNetworkStatus();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastProcessTime, setLastProcessTime] = useState<number>(0);
  
  // Send transaction without PIN authentication
  const sendTransaction = async (
    publicKey: string,
    destination: string,
    amount: string,
    memo?: string
  ): Promise<BlockchainTransactionResult> => {
    setIsProcessing(true);
    
    try {
      // Get private key from our storage
      const privateKey = accountKeysMap[publicKey];
      
      if (!privateKey) {
        toast.error('No private key found for this account');
        return { success: false, error: 'Private key not found' };
      }
      
      // Create keypair and initiate transaction
      const sourceKeypair = StellarSdk.Keypair.fromSecret(privateKey);
      
      // Always fetch the latest account to get the current sequence number
      const account = await server.loadAccount(publicKey);
      
      // Build the transaction
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK,
      })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destination,
          asset: StellarSdk.Asset.native(),
          amount: amount.toString()
        })
      );
      
      // Add memo if provided
      if (memo) {
        transaction.addMemo(StellarSdk.Memo.text(memo));
      }
      
      // Set timeout and build
      transaction.setTimeout(180);
      const builtTx = transaction.build();
      
      // Sign and submit
      builtTx.sign(sourceKeypair);
      
      // Add a small delay to ensure proper sequence
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = await server.submitTransaction(builtTx);
      
      toast.success('Transaction submitted successfully!');
      return {
        success: true,
        txHash: result.hash
      };
    } catch (error) {
      console.error('Transaction failed:', error);
      let errorMessage = 'Transaction failed';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Extract Stellar API specific errors
        if ('response' in error && (error as any).response) {
          const response = (error as any).response;
          if (response.data && response.data.extras && response.data.extras.result_codes) {
            const resultCodes = response.data.extras.result_codes;
            
            // Specific handling for tx_bad_auth errors
            if (resultCodes.transaction === 'tx_bad_auth') {
              errorMessage = 'Transaction authentication failed. This is likely a sequence number issue.';
            } else if (resultCodes.transaction === 'tx_bad_seq') {
              errorMessage = 'Transaction has incorrect sequence number. Please try again.';
            } else {
              errorMessage = `Transaction failed: ${JSON.stringify(resultCodes)}`;
            }
          }
        }
      }
      
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsProcessing(false);
    }
  };

  // Populate keys from accounts for demo
  useEffect(() => {
    const accounts = getAllAccounts();
    accounts.forEach(account => {
      if (account.publicKey && !accountKeysMap[account.publicKey]) {
        // In a real app, you would NEVER store keys like this
        // This is just for demonstration since PIN auth is being removed
        accountKeysMap[account.publicKey] = "SBJSFMSXJICBDJDWCWASXPTIRBMPSYVH5EM66AXUKRO2SUATBNBSPDUE";
      }
    });
  }, []);
  
  // Check for failed/pending transactions more frequently when online
  useEffect(() => {
    if (!isOnline) return;

    const processTransactions = async () => {
      const now = Date.now();
      // Only process if we haven't processed in the last 30 seconds
      if (now - lastProcessTime > 30000) {
        const pendingTxs = getPendingTransactions().filter(tx => 
          tx.status === 'pending' || tx.status === 'failed'
        );
        
        if (pendingTxs.length > 0) {
          console.log('Processing pending and failed transactions...');
          setLastProcessTime(now);
          
          try {
            await processPendingTransactions();
          } catch (error) {
            console.error('Auto-processing failed:', error);
          }
        }
      }
    };

    // Process immediately when we come online
    processTransactions();
    
    // Set up interval to check every minute
    const interval = setInterval(processTransactions, 60000);
    
    return () => clearInterval(interval);
  }, [isOnline, lastProcessTime]);

  return (
    <SecureTransactionContext.Provider value={{ sendTransaction, isProcessing }}>
      {children}
    </SecureTransactionContext.Provider>
  );
};