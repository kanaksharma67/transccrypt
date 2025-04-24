import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StellarAccount } from '@/types/stellar';

interface AccountDialogProps {
  open: boolean;
  isEditing: boolean;
  newAccountKey: string;
  newAccountName: string;
  onChangeAccountKey: (key: string) => void;
  onChangeAccountName: (name: string) => void;
  onClose: () => void;
  onSubmit: (e?: React.MouseEvent | React.TouchEvent) => void;
}

export const AccountDialog: React.FC<AccountDialogProps> = ({
  open,
  isEditing,
  newAccountKey,
  newAccountName,
  onChangeAccountKey,
  onChangeAccountName,
  onClose,
  onSubmit,
}) => (
  <Dialog open={open} onOpenChange={onClose} modal={true}>
    <DialogContent 
      aria-describedby="account-dialog-desc"
      className="w-[95vw] max-w-md mx-auto rounded-lg"
    >
      <DialogHeader>
        <DialogTitle>
          {isEditing ? 'Edit Account' : 'Add New Account'}
        </DialogTitle>
        <DialogDescription id="account-dialog-desc">
          {isEditing ? 'Update your account details' : 'Enter your Stellar account details'}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        {!isEditing && (
          <div className="space-y-2">
            <Label htmlFor="publicKey">Stellar Public Key</Label>
            <Input
              id="publicKey"
              placeholder="G..."
              value={newAccountKey}
              onChange={(e) => onChangeAccountKey(e.target.value)}
              className="w-full"
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="name">Account Name (Optional)</Label>
          <Input
            id="name"
            placeholder="My Stellar Account"
            value={newAccountName}
            onChange={(e) => onChangeAccountName(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {isEditing ? 'Update' : 'Add'} Account
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);