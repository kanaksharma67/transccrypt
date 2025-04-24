export interface StellarAccount {
  publicKey: string;
  balance: string;
  isLoading: boolean;
  error: string | null;
  name?: string; 
  isActive?: boolean;
  hasStoredKey?: boolean; // Indicates if we have a stored private key
}

export interface PendingTransaction {
  id: string;
  destination: string;
  amount: string;
  memo?: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  source?: string;
  qrFormat?: string;
  rawData?: string;
  txHash?: string; // Stellar transaction hash (for blockchain verification)
  completedAt?: number; // When the transaction was completed
  errorMessage?: string; // Error message if transaction failed
}

export interface NetworkStatus {
  isOnline: boolean;
  lastChecked: number;
}

export interface QRCodeData {
  destination: string;
  amount?: string;
  memo?: string;
  format: 'plain' | 'uri' | 'json' | 'unknown';
  rawData: string;
  isValid: boolean;
}

export type StellarQRFormat = 'plain' | 'uri' | 'json' | 'unknown';

export interface NotificationPreferences {
  transactionSuccess: boolean;
  transactionFailed: boolean;
  networkStatusChange: boolean;
  lowBalance: boolean;
  balanceThreshold: string;
}

export interface BlockchainTransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}
