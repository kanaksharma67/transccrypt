
import { StellarAccount } from '@/types/stellar';
import { accountKeysMap } from '@/contexts/SecureTransactionContext';

const ACCOUNTS_STORAGE_KEY = 'stellar_accounts';
const ACTIVE_ACCOUNT_KEY = 'stellar_active_account';

export const getAllAccounts = (): StellarAccount[] => {
  try {
    const accountsJson = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return accountsJson ? JSON.parse(accountsJson) : [];
  } catch (error) {
    console.error('Failed to retrieve accounts:', error);
    return [];
  }
};

export const saveAccounts = (accounts: StellarAccount[]): void => {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.error('Failed to save accounts:', error);
  }
};

export const addAccount = (account: StellarAccount): void => {
  const accounts = getAllAccounts();
  // Check for duplicates
  if (!accounts.some(acc => acc.publicKey === account.publicKey)) {
    saveAccounts([...accounts, account]);
  }
};

export const removeAccount = (publicKey: string): void => {
  const accounts = getAllAccounts();
  saveAccounts(accounts.filter(account => account.publicKey !== publicKey));
  
  // If we removed the active account, clear it
  const active = getActiveAccount();
  if (active?.publicKey === publicKey) {
    localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
  }
  
  // Remove the private key if it exists
  if (publicKey in accountKeysMap) {
    delete accountKeysMap[publicKey];
  }
};

export const updateAccount = (updated: StellarAccount): void => {
  const accounts = getAllAccounts();
  const updatedAccounts = accounts.map(account => 
    account.publicKey === updated.publicKey ? updated : account
  );
  saveAccounts(updatedAccounts);
  
  // Update active account if necessary
  const active = getActiveAccount();
  if (active?.publicKey === updated.publicKey) {
    setActiveAccount(updated);
  }
};

export const getActiveAccount = (): StellarAccount | null => {
  try {
    const activeJson = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
    return activeJson ? JSON.parse(activeJson) : null;
  } catch (error) {
    console.error('Failed to retrieve active account:', error);
    return null;
  }
};

export const setActiveAccount = (account: StellarAccount): void => {
  try {
    localStorage.setItem(ACTIVE_ACCOUNT_KEY, JSON.stringify(account));
  } catch (error) {
    console.error('Failed to set active account:', error);
  }
};

// Store private key directly in the accountKeysMap
export const storePrivateKey = (publicKey: string, privateKey: string): boolean => {
  try {
    // Store the private key directly
    accountKeysMap[publicKey] = privateKey;
    
    // Update the account object to indicate that a private key is stored
    const accounts = getAllAccounts();
    const updatedAccounts = accounts.map(account => 
      account.publicKey === publicKey 
        ? { ...account, hasStoredKey: true } 
        : account
    );
    saveAccounts(updatedAccounts);
    
    return true;
  } catch (error) {
    console.error('Failed to store private key:', error);
    return false;
  }
};

// Retrieve private key directly from accountKeysMap
export const retrievePrivateKey = (publicKey: string): string | null => {
  return accountKeysMap[publicKey] || null;
};

// Check if a private key exists for an account
export const hasStoredPrivateKey = (publicKey: string): boolean => {
  return publicKey in accountKeysMap;
};
