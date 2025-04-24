
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2 } from 'lucide-react';
import { StellarAccount } from '@/types/stellar';

interface AccountEditMenuProps {
  activeAccount: StellarAccount;
  onEdit: (account: StellarAccount) => void;
  onDelete: (account: StellarAccount) => void;
}

export const AccountEditMenu: React.FC<AccountEditMenuProps> = ({
  activeAccount,
  onEdit,
  onDelete,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => onEdit(activeAccount)}>
        <Edit className="h-4 w-4 mr-2" />
        Rename
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-destructive focus:text-destructive"
        onClick={() => onDelete(activeAccount)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Remove
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
