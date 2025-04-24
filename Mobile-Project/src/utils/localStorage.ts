
import { PendingTransaction } from '@/types/stellar';

const PENDING_TRANSACTIONS_KEY = 'stellar_pending_transactions';
const ACCOUNT_PUBLIC_KEY = 'stellar_account_public_key';
const PRIVATE_KEYS_KEY = 'stellar_encrypted_private_keys';

export const savePendingTransaction = (transaction: PendingTransaction): void => {
  try {
    const existingTransactions = getPendingTransactions();
    localStorage.setItem(
      PENDING_TRANSACTIONS_KEY,
      JSON.stringify([...existingTransactions, transaction])
    );
  } catch (error) {
    console.error('Failed to save pending transaction:', error);
  }
};

export const getPendingTransactions = (): PendingTransaction[] => {
  try {
    const transactions = localStorage.getItem(PENDING_TRANSACTIONS_KEY);
    return transactions ? JSON.parse(transactions) : [];
  } catch (error) {
    console.error('Failed to retrieve pending transactions:', error);
    return [];
  }
};

export const updateTransactionStatus = (
  id: string, 
  status: 'pending' | 'completed' | 'failed',
  txHash?: string,
  errorMessage?: string
): void => {
  try {
    const transactions = getPendingTransactions();
    const updatedTransactions = transactions.map(tx => 
      tx.id === id ? { 
        ...tx, 
        status, 
        txHash, 
        errorMessage,
        completedAt: status === 'completed' ? Date.now() : undefined 
      } : tx
    );
    
    localStorage.setItem(PENDING_TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
  } catch (error) {
    console.error('Failed to update transaction status:', error);
  }
};

export const saveAccountPublicKey = (publicKey: string): void => {
  localStorage.setItem(ACCOUNT_PUBLIC_KEY, publicKey);
};

export const getAccountPublicKey = (): string | null => {
  return localStorage.getItem(ACCOUNT_PUBLIC_KEY);
};

// For secure storage of private keys (encrypted)
// In a real app, you would use a more secure method than localStorage
// and add encryption/decryption with a user-provided password
export const saveEncryptedPrivateKey = (publicKey: string, encryptedPrivateKey: string): void => {
  try {
    const existingKeys = getEncryptedPrivateKeys();
    localStorage.setItem(
      PRIVATE_KEYS_KEY,
      JSON.stringify({
        ...existingKeys,
        [publicKey]: encryptedPrivateKey
      })
    );
  } catch (error) {
    console.error('Failed to save encrypted private key:', error);
  }
};

export const getEncryptedPrivateKeys = (): Record<string, string> => {
  try {
    const keys = localStorage.getItem(PRIVATE_KEYS_KEY);
    return keys ? JSON.parse(keys) : {};
  } catch (error) {
    console.error('Failed to retrieve encrypted private keys:', error);
    return {};
  }
};
