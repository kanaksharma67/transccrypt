import * as StellarSdk from 'stellar-sdk';
import { PendingTransaction, QRCodeData } from '@/types/stellar';
import { getPendingTransactions, updateTransactionStatus, savePendingTransaction } from './localStorage';
import { toast } from '@/components/ui/sonner';
import { getActiveAccount } from './accountStorage';
import { accountKeysMap } from '@/contexts/SecureTransactionContext';

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const NETWORK = StellarSdk.Networks.TESTNET;

const MAX_RETRY_COUNT = 5;
const INITIAL_RETRY_DELAY = 2000;

export const loadAccount = async (publicKey: string): Promise<any> => {
  try {
    const account = await server.loadAccount(publicKey);
    const balance = account.balances
      .filter(balance => balance.asset_type === 'native')
      .map(balance => balance.balance)[0] || '0';

    return {
      publicKey,
      balance,
      isLoading: false,
      error: null
    };
  } catch (error) {
    console.error('Failed to load account:', error);
    return {
      publicKey,
      balance: '0',
      isLoading: false,
      error: 'Failed to load account details'
    };
  }
};

export const sendPayment = async (
  sourcePublicKey: string,
  destinationKey: string,
  amount: string,
  memo?: string
): Promise<{ success: boolean; txHash?: string; error?: string }> => {
  try {
    if (sourcePublicKey === destinationKey) {
      return {
        success: false,
        error: 'Cannot send payment to yourself'
      };
    }
    
    const sourceSecretKey = accountKeysMap[sourcePublicKey];
    
    if (!sourceSecretKey) {
      return {
        success: false,
        error: 'No secret key found for this account'
      };
    }
    
    const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
    
    const account = await server.loadAccount(sourcePublicKey);
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK,
    });
    
    transaction.addOperation(
      StellarSdk.Operation.payment({
        destination: destinationKey,
        asset: StellarSdk.Asset.native(),
        amount: amount.toString()
      })
    );
    
    if (memo) {
      transaction.addMemo(StellarSdk.Memo.text(memo));
    }
    
    transaction.setTimeout(180);
    
    const builtTx = transaction.build();
    builtTx.sign(sourceKeypair);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = await server.submitTransaction(builtTx);
    
    console.log("Transaction successful! Hash:", result.hash);
    return {
      success: true,
      txHash: result.hash
    };
  } catch (error) {
    console.error('Payment failed:', error);
    let errorMessage = 'Transaction failed';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if ('response' in error && (error as any).response) {
        const response = (error as any).response;
        if (response.data && response.data.extras && response.data.extras.result_codes) {
          const resultCodes = response.data.extras.result_codes;
          
          if (resultCodes.transaction === 'tx_bad_seq') {
            errorMessage = 'Bad sequence number. Try again.';
          } else if (resultCodes.transaction === 'tx_bad_auth') {
            errorMessage = 'Authentication failed. The signing key may be incorrect.';
          } else if (resultCodes.transaction === 'tx_failed') {
            errorMessage = 'Transaction failed: ' + (resultCodes.operations?.join(', ') || 'unknown reason');
          } else {
            errorMessage = `Transaction failed: ${JSON.stringify(resultCodes)}`;
          }
        }
      }
    }
    
    if (errorMessage.includes('400') && sourcePublicKey === destinationKey) {
      errorMessage = 'Error: Cannot send payment to yourself. Destination must be different from source account.';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

export const processPendingTransactions = async (): Promise<void> => {
  const pendingTransactions = getPendingTransactions().filter(tx => 
    tx.status === 'pending' || tx.status === 'failed'
  );
  
  if (!pendingTransactions.length) {
    console.log("No transactions to process");
    return;
  }
  
  let processed = 0;
  let failed = 0;
  
  for (const transaction of pendingTransactions) {
    try {
      const sourceAccount = transaction.source || getActiveAccount()?.publicKey;
      
      if (!sourceAccount) {
        console.error('No source account found for transaction', transaction.id);
        updateTransactionStatus(transaction.id, 'failed', undefined, 'No source account found');
        failed++;
        continue;
      }
      
      console.log(`Processing transaction ${transaction.id} for source: ${sourceAccount}`);
      
      let retryCount = 0;
      let success = false;
      
      while (!success && retryCount < MAX_RETRY_COUNT) {
        try {
          if (retryCount > 0) {
            const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount - 1);
            console.log(`Retry attempt ${retryCount + 1} for transaction ${transaction.id}, waiting ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          const result = await sendPayment(
            sourceAccount,
            transaction.destination,
            transaction.amount,
            transaction.memo
          );
          
          if (result.success) {
            updateTransactionStatus(transaction.id, 'completed', result.txHash);
            processed++;
            success = true;
            console.log(`Successfully processed transaction ${transaction.id}`);
          } else {
            if (result.error?.includes('Cannot send payment to yourself') ||
                result.error?.includes('No secret key found')) {
              updateTransactionStatus(transaction.id, 'failed', undefined, result.error);
              failed++;
              break;
            }
            
            retryCount++;
            if (retryCount >= MAX_RETRY_COUNT) {
              updateTransactionStatus(transaction.id, 'failed', undefined, 
                `Failed after ${MAX_RETRY_COUNT} attempts: ${result.error}`);
              failed++;
            }
          }
        } catch (error) {
          retryCount++;
          if (retryCount >= MAX_RETRY_COUNT) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            updateTransactionStatus(transaction.id, 'failed', undefined, 
              `Failed after ${MAX_RETRY_COUNT} attempts: ${errorMessage}`);
            failed++;
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Error processing transaction ${transaction.id}:`, error);
      updateTransactionStatus(transaction.id, 'failed', undefined, errorMessage);
      failed++;
    }
  }
  
  if (processed > 0) {
    toast.success(`Processed ${processed} transactions successfully`);
  }
  if (failed > 0) {
    toast.error(`Failed to process ${failed} transactions after multiple retries`);
  }
};

export const verifyTransaction = async (txHash: string): Promise<any> => {
  try {
    const transaction = await server.transactions().transaction(txHash).call();
    return {
      verified: true,
      transaction
    };
  } catch (error) {
    console.error('Failed to verify transaction:', error);
    return {
      verified: false,
      error: 'Could not verify transaction on the blockchain'
    };
  }
};

export const validateStellarAddress = (address: string): boolean => {
  try {
    const keypair = StellarSdk.Keypair.fromPublicKey(address);
    return !!keypair;
  } catch (error) {
    return false;
  }
};

export const parseQRCodeData = (data: string): QRCodeData => {
  let result: QRCodeData = {
    destination: '',
    amount: undefined,
    memo: undefined,
    format: 'unknown',
    rawData: data,
    isValid: false
  };
  
  if (data.startsWith('G') && data.length >= 56) {
    result = {
      ...result,
      destination: data,
      format: 'plain',
      isValid: validateStellarAddress(data),
    };
    return result;
  }
  
  try {
    if (data.startsWith('stellar:')) {
      const uri = new URL(data);
      const destination = uri.pathname || uri.hostname;
      const amount = uri.searchParams.get('amount') || undefined;
      const memo = uri.searchParams.get('memo') || undefined;
      
      const cleanDestination = destination.replace('stellar:', '');
      
      result = {
        destination: cleanDestination,
        amount,
        memo,
        format: 'uri',
        rawData: data,
        isValid: validateStellarAddress(cleanDestination),
      };
      return result;
    }
    
    const jsonData = JSON.parse(data);
    const destination = jsonData.destination || jsonData.address || '';
    
    result = {
      destination,
      amount: jsonData.amount?.toString(),
      memo: jsonData.memo?.toString(),
      format: 'json',
      rawData: data,
      isValid: validateStellarAddress(destination),
    };
    return result;
  } catch (e) {
    return {
      destination: data,
      format: 'unknown',
      rawData: data,
      isValid: false,
    };
  }
};

export const generateKeypair = (): { publicKey: string; secretKey: string } => {
  const keypair = StellarSdk.Keypair.random();
  accountKeysMap[keypair.publicKey()] = keypair.secret();
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret()
  };
};

export const fundTestnetAccount = async (publicKey: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
    );
    const responseJSON = await response.json();
    console.log("SUCCESS! You have a funded Testnet account:", responseJSON);
    return true;
  } catch (error) {
    console.error("Error funding testnet account:", error);
    return false;
  }
};

export const createPendingTransaction = (
  sourceAccount: string,
  destination: string,
  amount: string,
  memo?: string,
  qrFormat?: string,
  rawData?: string
): PendingTransaction => {
  const transaction: PendingTransaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    source: sourceAccount,
    destination: destination,
    amount: amount,
    memo: memo,
    timestamp: Date.now(),
    status: 'pending',
  };
  
  if (qrFormat) {
    transaction.qrFormat = qrFormat;
  }
  
  if (rawData) {
    transaction.rawData = rawData;
  }
  
  console.log("Creating pending transaction with source:", sourceAccount);
  
  savePendingTransaction(transaction);
  
  return transaction;
};

export const storeSecretKey = (publicKey: string, secretKey: string): void => {
  accountKeysMap[publicKey] = secretKey;
};