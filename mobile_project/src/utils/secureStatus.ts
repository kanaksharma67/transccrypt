/**
 * Secure storage utility using IndexedDB with encryption
 * Provides a more secure alternative to localStorage for storing sensitive data
 */
import * as CryptoJS from 'crypto-js';

const DB_NAME = 'stellar_secure_storage';
const DB_VERSION = 1;
const STORE_NAME = 'encrypted_keys';
const PIN_HASH_KEY = 'pin_hash';

// Initialize the database
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject('Failed to open database');
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Store encrypted data in IndexedDB
export const secureStore = async (key: string, value: string, pin: string): Promise<boolean> => {
  try {
    const db = await initDB();
    const encryptedValue = CryptoJS.AES.encrypt(value, pin).toString();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.put({
        id: key,
        value: encryptedValue,
        timestamp: Date.now()
      });
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(false);
    });
  } catch (error) {
    console.error('Failed to store encrypted data:', error);
    return false;
  }
};

// Retrieve and decrypt data from IndexedDB
export const secureRetrieve = async (key: string, pin: string): Promise<string | null> => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      
      request.onsuccess = () => {
        if (request.result) {
          try {
            const decryptedBytes = CryptoJS.AES.decrypt(request.result.value, pin);
            const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
            
            if (decryptedValue) {
              resolve(decryptedValue);
            } else {
              // This likely means the PIN is incorrect
              resolve(null);
            }
          } catch (error) {
            // Decryption failed (wrong PIN)
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => reject(null);
    });
  } catch (error) {
    console.error('Failed to retrieve encrypted data:', error);
    return null;
  }
};

// Remove data from IndexedDB
export const secureRemove = async (key: string): Promise<boolean> => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(false);
    });
  } catch (error) {
    console.error('Failed to remove encrypted data:', error);
    return false;
  }
};

// Set up PIN for secure operations
export const setupPIN = async (pin: string): Promise<boolean> => {
  try {
    // Use a stronger hash for PIN storage
    const pinHash = CryptoJS.SHA256(pin).toString();
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.put({
        id: PIN_HASH_KEY,
        value: pinHash,
        timestamp: Date.now()
      });
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(false);
    });
  } catch (error) {
    console.error('Failed to set up PIN:', error);
    return false;
  }
};

// Verify PIN for secure operations
export const verifyPIN = async (pin: string): Promise<boolean> => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(PIN_HASH_KEY);
      
      request.onsuccess = () => {
        if (request.result) {
          const storedHash = request.result.value;
          const providedHash = CryptoJS.SHA256(pin).toString();
          resolve(storedHash === providedHash);
        } else {
          // No PIN has been set up yet
          resolve(false);
        }
      };
      
      request.onerror = () => reject(false);
    });
  } catch (error) {
    console.error('Failed to verify PIN:', error);
    return false;
  }
};

// Check if PIN has been set up
export const isPINSetup = async (): Promise<boolean> => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(PIN_HASH_KEY);
      
      request.onsuccess = () => {
        resolve(!!request.result);
      };
      
      request.onerror = () => reject(false);
    });
  } catch (error) {
    console.error('Failed to check PIN setup:', error);
    return false;
  }
};

// Get all stored keys
export const getAllSecureKeys = async (): Promise<string[]> => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const keys = request.result
          .filter(item => item.id !== PIN_HASH_KEY)
          .map(item => item.id);
        resolve(keys);
      };
      
      request.onerror = () => reject([]);
    });
  } catch (error) {
    console.error('Failed to get all secure keys:', error);
    return [];
  }
};