import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlusCircle, Check, ChevronDown } from 'lucide-react';
import { StellarAccount } from '@/types/stellar';

interface AccountDropdownProps {
  accounts: StellarAccount[];
  activeAccount: StellarAccount | null;
  onSetActiveAccount: (account: StellarAccount) => void;
  onAddAccount: () => void;
}

export const AccountDropdown: React.FC<AccountDropdownProps> = ({
  accounts,
  activeAccount,
  onSetActiveAccount,
  onAddAccount,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button 
        variant="outline" 
        className="w-full justify-between min-h-[44px] text-left"
      >
        <span className="truncate max-w-[180px]">
          {activeAccount?.name || 'No Account Selected'}
        </span>
        <ChevronDown className="h-4 w-4 ml-2 opacity-50 flex-shrink-0" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent 
      align="end" 
      className="w-[200px] max-h-[300px] overflow-y-auto"
    >
      {accounts.map((account) => (
        <DropdownMenuItem
          key={account.publicKey}
          className="flex items-center justify-between py-3 cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            onSetActiveAccount(account);
          }}
        >
          <span className="truncate">{account.name || account.publicKey.substring(0, 10) + '...'}</span>
          {activeAccount?.publicKey === account.publicKey && (
            <Check className="h-4 w-4 ml-2 flex-shrink-0" />
          )}
        </DropdownMenuItem>
      ))}
      {accounts.length === 0 && (
        <DropdownMenuItem disabled className="py-3">
          No accounts added
        </DropdownMenuItem>
      )}
      <DropdownMenuItem
        className="border-t mt-1 pt-3 text-center justify-center text-primary cursor-pointer"
        onSelect={(e) => {
          e.preventDefault();
          onAddAccount();
        }}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add New Account
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);