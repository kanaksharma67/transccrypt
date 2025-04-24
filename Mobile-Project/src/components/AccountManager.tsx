import React, { useState, useEffect, useCallback } from 'react';
import { StellarAccount } from '@/types/stellar';
import { toast } from '@/components/ui/sonner';
import { getAllAccounts, saveAccounts, getActiveAccount, setActiveAccount } from '@/utils/accountStorage';
import { AccountDropdown } from './AccountDropdown';
import { AccountEditMenu } from './AccountEditMenu';
import { AccountDialog } from './AccountDialog';

export const AccountManager = ({ onAccountChange }: { onAccountChange: (account: StellarAccount) => void }) => {
  const [accounts, setAccounts] = useState<StellarAccount[]>([]);
  const [open, setOpen] = useState(false);
  const [newAccountKey, setNewAccountKey] = useState('');
  const [newAccountName, setNewAccountName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingAccount, setEditingAccount] = useState<StellarAccount | null>(null);
  const [activeAccount, setActiveAccountState] = useState<StellarAccount | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadAccounts = useCallback(() => {
    const storedAccounts = getAllAccounts();
    setAccounts(storedAccounts);

    const current = getActiveAccount();
    if (current) {
      setActiveAccountState(current);
      onAccountChange(current);
    } else if (storedAccounts.length > 0) {
      handleSetActiveAccount(storedAccounts[0]);
    }
  }, [onAccountChange]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleAddAccount = async (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);

      if (!newAccountKey.startsWith('G') || newAccountKey.length < 56) {
        toast.error('Invalid Stellar public key format');
        return;
      }
      
      if (accounts.some(acc => acc.publicKey === newAccountKey)) {
        toast.error('This account is already in your wallet');
        return;
      }

      const newAccount: StellarAccount = {
        publicKey: newAccountKey,
        balance: '0',
        isLoading: true,
        error: null,
        name: newAccountName || `Account ${accounts.length + 1}`,
        isActive: accounts.length === 0
      };

      const updatedAccounts = [...accounts, newAccount];
      await saveAccounts(updatedAccounts);
      setAccounts(updatedAccounts);

      if (accounts.length === 0) {
        handleSetActiveAccount(newAccount);
      }

      setNewAccountKey('');
      setNewAccountName('');
      setOpen(false);

      toast.success('Account added successfully');
      
      // Refresh accounts list
      loadAccounts();
    } catch (error) {
      console.error('Error adding account:', error);
      toast.error('Failed to add account');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateAccount = async (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isProcessing || !editingAccount) return;

    try {
      setIsProcessing(true);

      const updatedAccounts = accounts.map(acc =>
        acc.publicKey === editingAccount.publicKey
          ? { ...acc, name: newAccountName || acc.name }
          : acc
      );

      await saveAccounts(updatedAccounts);
      setAccounts(updatedAccounts);

      if (activeAccount && activeAccount.publicKey === editingAccount.publicKey) {
        const updatedActive = updatedAccounts.find(acc => acc.publicKey === editingAccount.publicKey);
        if (updatedActive) {
          handleSetActiveAccount(updatedActive);
        }
      }

      setIsEditing(false);
      setEditingAccount(null);
      setNewAccountName('');
      setOpen(false);

      toast.success('Account updated successfully');
      
      // Refresh accounts list
      loadAccounts();
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Failed to update account');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAccount = async (account: StellarAccount) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const updatedAccounts = accounts.filter(acc => acc.publicKey !== account.publicKey);
      await saveAccounts(updatedAccounts);
      setAccounts(updatedAccounts);

      if (activeAccount && activeAccount.publicKey === account.publicKey) {
        if (updatedAccounts.length > 0) {
          handleSetActiveAccount(updatedAccounts[0]);
        } else {
          setActiveAccountState(null);
          onAccountChange({
            publicKey: '',
            balance: '0',
            isLoading: false,
            error: null
          });
        }
      }

      toast.success('Account removed successfully');
      
      // Refresh accounts list
      loadAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetActiveAccount = useCallback((account: StellarAccount) => {
    setActiveAccount(account);
    setActiveAccountState(account);
    onAccountChange(account);
    toast.info(`Switched to ${account.name || 'account'}`);
  }, [onAccountChange]);

  const startEditing = (account: StellarAccount) => {
    setIsEditing(true);
    setEditingAccount(account);
    setNewAccountName(account.name || '');
    setOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <AccountDropdown
          accounts={accounts}
          activeAccount={activeAccount}
          onSetActiveAccount={handleSetActiveAccount}
          onAddAccount={() => {
            setIsEditing(false);
            setOpen(true);
          }}
        />
        {activeAccount && (
          <AccountEditMenu
            activeAccount={activeAccount}
            onEdit={startEditing}
            onDelete={handleDeleteAccount}
          />
        )}
      </div>
      <AccountDialog
        open={open}
        isEditing={isEditing}
        newAccountKey={newAccountKey}
        newAccountName={newAccountName}
        onChangeAccountKey={setNewAccountKey}
        onChangeAccountName={setNewAccountName}
        onClose={() => {
          setOpen(false);
          setNewAccountKey('');
          setNewAccountName('');
          setIsEditing(false);
          setEditingAccount(null);
        }}
        onSubmit={isEditing ? handleUpdateAccount : handleAddAccount}
      />
    </>
  );
};