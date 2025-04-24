
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getPendingTransactions } from '@/utils/localStorage';
import { processPendingTransactions } from '@/utils/stellarOperations';
import { toast } from '@/components/ui/sonner';
import { getActiveAccount } from '@/utils/accountStorage';

interface ProcessPendingTransactionsProps {
  pendingCount: number;
  onComplete: () => void;
}

export const ProcessPendingTransactions = ({ 
  pendingCount, 
  onComplete 
}: ProcessPendingTransactionsProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Delay showing the dialog to prevent UI conflicts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDialog(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleProcessNow = async () => {
    const activeAccount = getActiveAccount();
    if (!activeAccount) {
      toast.error("No active account selected");
      setShowDialog(false);
      onComplete();
      return;
    }
    
    setIsProcessing(true);
    try {
      await processPendingTransactions();
      toast.success("Successfully processed pending transactions");
    } catch (error) {
      console.error("Failed to process transactions:", error);
      toast.error("Failed to process transactions");
    } finally {
      setIsProcessing(false);
      setShowDialog(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    setShowDialog(false);
    onComplete();
  };

  return (
    <Dialog open={showDialog} onOpenChange={(open) => {
      setShowDialog(open);
      if (!open) onComplete();
    }}>
      <DialogContent className="sm:max-w-md" aria-describedby="pending-tx-desc">
        <DialogHeader>
          <DialogTitle>Pending Transactions</DialogTitle>
          <DialogDescription id="pending-tx-desc">
            You have {pendingCount} pending transaction{pendingCount !== 1 ? 's' : ''} that can now be processed.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Would you like to process these transactions now?
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleSkip} disabled={isProcessing}>
            Skip for now
          </Button>
          <Button onClick={handleProcessNow} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Process now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};