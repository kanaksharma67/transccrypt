
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNetworkStatus } from '@/utils/networkStatus';
import { parseQRCodeData } from '@/utils/stellarOperations';
import { savePendingTransaction } from '@/utils/localStorage';
import { PendingTransaction } from '@/types/stellar';
import { QrCode } from 'lucide-react';

// We'll mock the QR scanner component since the actual scanner won't work in the preview
export const QRScanner = () => {
  const { isOnline } = useNetworkStatus();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{
    destination: string;
    amount?: string;
    memo?: string;
  } | null>(null);
  
  const startScanner = () => {
    setScanning(true);
    setTimeout(() => {
      const mockQRData = 'GBDUXW4E5JBW7UNYMJW4HLCN2T7CARRRIRSOAUHDIWVEHLLHP4PNGL4I';
      const parsedData = parseQRCodeData(mockQRData);
      setResult(parsedData);
      setScanning(false);
    }, 3000);
  };
  
  const handleTransaction = () => {
    if (!result?.destination) return;
    const amount = prompt("Enter amount to send (XLM):", result.amount || "1");
    if (!amount) return;
    const pendingTx: PendingTransaction = {
      id: Date.now().toString(),
      destination: result.destination,
      amount,
      memo: result.memo,
      timestamp: Date.now(),
      status: 'pending'
    };
    savePendingTransaction(pendingTx);
    setResult(null);
    alert(
      isOnline
        ? "Transaction will be processed right away!"
        : "Transaction saved and will be processed when you're back online."
    );
  };
  
  const resetScanner = () => {
    setResult(null);
    setScanning(false);
  };

  // --- Responsive card width and stacking for mobile
  // min-w-[95vw] for mobile, max-w-md for desktop etc
  return (
    <Card className="w-full max-w-md mx-auto md:my-8 my-2 shadow-lg rounded-2xl overflow-hidden border transition-all duration-200 bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-bold text-center text-primary">Scan QR Code</CardTitle>
      </CardHeader>
      <CardContent>
        {scanning ? (
          <div className="h-64 md:h-64 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
            <div className="text-center">
              <QrCode className="w-16 h-16 mx-auto mb-4 animate-pulse text-primary" />
              <p>Scanning QR Code...</p>
              <p className="text-xs mt-2 text-gray-600 dark:text-gray-300">
                Position the QR code within the frame
              </p>
            </div>
          </div>
        ) : result ? (
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium">Destination Account</p>
              <p className="text-xs break-all bg-gray-50 dark:bg-gray-700 p-2 rounded">
                {result.destination}
              </p>
            </div>
            {result.amount && (
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-lg">{result.amount} XLM</p>
              </div>
            )}
            {result.memo && (
              <div>
                <p className="text-sm font-medium">Memo</p>
                <p className="text-sm">{result.memo}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-56 md:h-64 bg-gray-50 dark:bg-gray-800 rounded flex items-center justify-center">
            <div className="text-center">
              <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-300">Tap the button below to scan a QR code</p>
              <p className="text-xs mt-2 text-gray-400">
                {isOnline 
                  ? "You're online - transactions will process immediately"
                  : "You're offline - transactions will be saved for later"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 md:flex-row md:justify-center justify-between items-center px-2 py-3">
        {result ? (
          <div className="flex flex-col gap-2 w-full md:flex-row md:w-auto">
            <Button onClick={handleTransaction} className="rounded-lg w-full md:w-auto bg-gradient-to-r from-[#D3E4FD] to-[#E5DEFF] text-primary font-bold shadow-sm">Send Transaction</Button>
            <Button variant="outline" onClick={resetScanner} className="rounded-lg w-full md:w-auto">Cancel</Button>
          </div>
        ) : (
          <Button onClick={startScanner} disabled={scanning} className="rounded-lg w-full bg-gradient-to-r from-[#E5DEFF] to-[#D3E4FD] text-primary font-bold">
            Scan QR Code
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
