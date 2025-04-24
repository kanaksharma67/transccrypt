import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNetworkStatus } from '@/utils/networkStatus';
import { parseQRCodeData, validateStellarAddress } from '@/utils/stellarOperations';
import { savePendingTransaction } from '@/utils/localStorage';
import { PendingTransaction, QRCodeData } from '@/types/stellar';
import { QrCode, Check, AlertTriangle, Info, Camera, FlipHorizontal, CameraOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserQRCodeReader } from '@zxing/browser';

interface DebugTransactionLog {
  id: string;
  timestamp: number;
  isOffline: boolean;
  data: any;
}

export const AdvancedQRScanner = () => {
  const { isOnline } = useNetworkStatus();
  const [scanning, setScanning] = useState(false);
  const [continuous, setContinuous] = useState(false);
  const [result, setResult] = useState<QRCodeData | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [customMemo, setCustomMemo] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastRawData, setLastRawData] = useState<string | null>(null);
  const [debugSavedTx, setDebugSavedTx] = useState<DebugTransactionLog | null>(null);
  const [debugLogList, setDebugLogList] = useState<DebugTransactionLog[]>([]);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [reader, setReader] = useState<BrowserQRCodeReader | null>(null);

  useEffect(() => {
    const initializeReader = async () => {
      try {
        const newReader = new BrowserQRCodeReader();
        let devices = await BrowserQRCodeReader.listVideoInputDevices();
        
        // Filter out non-camera devices
        devices = devices.filter(device => device.kind === 'videoinput');
        
        // On mobile, prefer back camera
        const backCamera = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        
        const initialDeviceIndex = backCamera ? devices.indexOf(backCamera) : 0;
        
        setReader(newReader);
        setDevices(devices);
        setCurrentDeviceIndex(initialDeviceIndex);

        // Request camera permissions explicitly
        try {
          await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          });
        } catch (permissionError) {
          console.error('Camera permission error:', permissionError);
          setCameraError('Please grant camera permission to scan QR codes');
        }
      } catch (error) {
        console.error('Failed to initialize QR reader:', error);
        setCameraError('Failed to initialize camera. Please check permissions.');
      }
    };

    initializeReader();

    return () => {
      if (reader) {
        reader.stopStreams();
      }
    };
  }, []);

  const handleScan = useCallback(
    async (deviceId?: string) => {
      if (!reader) return;

      try {
        setScanning(true);
        setCameraError(null);

        const selectedDeviceId = deviceId || devices[currentDeviceIndex]?.deviceId;
        if (!selectedDeviceId) {
          throw new Error('No camera device selected');
        }

        // Configure video constraints for better mobile performance
        const constraints = {
          deviceId: selectedDeviceId,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        };

        const controls = await reader.decodeFromVideoDevice(
          selectedDeviceId,
          'qr-video',
          (result) => {
            if (result) {
              const codeData = result.getText();
              if (codeData && codeData !== lastRawData) {
                setLastRawData(codeData);
                const parsedData = parseQRCodeData(codeData);
                setResult(parsedData);

                // Vibrate on successful scan (mobile only)
                if ('vibrate' in navigator) {
                  navigator.vibrate(200);
                }

                if (parsedData.isValid) {
                  toast.success(`Successfully scanned ${parsedData.format} format QR code`);
                } else {
                  toast.error("Invalid QR code format detected");
                }

                if (!continuous) {
                  setScanning(false);
                  reader.stopStreams();
                }
              }
            }
          }
        );
      } catch (error) {
        console.error('Camera error:', error);
        setCameraError('Unable to access camera. Please check your browser permissions.');
        setScanning(false);
      }
    },
    [continuous, lastRawData, reader, devices, currentDeviceIndex]
  );

  const switchCamera = async () => {
    if (!reader) return;
    
    reader.stopStreams();
    const nextIndex = (currentDeviceIndex + 1) % devices.length;
    setCurrentDeviceIndex(nextIndex);
    await handleScan(devices[nextIndex].deviceId);
  };

  const handleTransaction = () => {
    if (!result?.destination) return;

    if (!validateStellarAddress(result.destination)) {
      toast.error("Invalid Stellar address");
      return;
    }

    const amount = customAmount || result.amount || '1';
    const memo = customMemo || result.memo;

    const pendingTx: PendingTransaction = {
      id: Date.now().toString(),
      destination: result.destination,
      amount,
      memo,
      timestamp: Date.now(),
      status: 'pending',
      qrFormat: result.format,
      rawData: result.rawData
    };

    savePendingTransaction(pendingTx);

    const txLog = {
      id: pendingTx.id,
      timestamp: pendingTx.timestamp,
      isOffline: !isOnline,
      data: { ...pendingTx }
    };
    setDebugSavedTx(txLog);
    setDebugLogList((logs) => [txLog, ...logs].slice(0, 5));

    setResult(null);
    setCustomAmount('');
    setCustomMemo('');
    setLastRawData(null);

    toast.success(
      isOnline
        ? 'Transaction will be processed right away!'
        : 'Transaction saved and will be processed when you\'re back online.',
      {
        duration: 5000
      }
    );
  };

  const resetScanner = () => {
    if (reader) {
      reader.stopStreams();
    }
    setResult(null);
    setScanning(false);
    setContinuous(false);
    setCustomAmount('');
    setCustomMemo('');
    setCameraError(null);
    setLastRawData(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            QR Scanner
          </CardTitle>
          <Badge variant={continuous ? "default" : "outline"} className="bg-gradient-to-r from-purple-500 to-blue-500">
            {continuous ? "Continuous" : "Single Scan"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {scanning ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {cameraError ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <p className="text-red-500">{cameraError}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="h-64 rounded-lg overflow-hidden relative">
                    <video
                      id="qr-video"
                      className="w-full h-full object-cover rounded-lg"
                      playsInline
                      muted
                      autoPlay
                    />
                    {devices.length > 1 && (
                      <Button
                        onClick={switchCamera}
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full bg-white/80 dark:bg-black/80"
                      >
                        <FlipHorizontal className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-end pointer-events-none">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 dark:bg-black/80 px-4 py-2 rounded-full mb-4 text-sm font-medium"
                      >
                        Point the camera at a Stellar QR code
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-2">
                {result.isValid ? (
                  <Check className="h-5 w-5 text-green-500 mt-1" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
                )}
                <div>
                  <p className="text-sm font-medium flex items-center gap-1">
                    QR Format:
                    <Badge variant="outline" className="capitalize">
                      {result.format}
                    </Badge>
                    {!result.isValid && (
                      <Badge variant="destructive">Invalid</Badge>
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
                <div>
                  <p className="text-sm font-medium">Destination Account</p>
                  <p className="text-xs break-all bg-white/50 dark:bg-gray-900/50 p-2 rounded">
                    {result.destination}
                  </p>
                  {!validateStellarAddress(result.destination) && (
                    <p className="text-xs text-red-500 mt-1">
                      ⚠️ This doesn't appear to be a valid Stellar address
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <p className="text-sm font-medium">Amount (XLM)</p>
                    <Input
                      type="text"
                      placeholder={result.amount || "Enter amount"}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="mt-1 bg-white/80 dark:bg-gray-900/80"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Memo (Optional)</p>
                    <Input
                      type="text"
                      placeholder={result.memo || "Enter memo"}
                      value={customMemo}
                      onChange={(e) => setCustomMemo(e.target.value)}
                      className="mt-1 bg-white/80 dark:bg-gray-900/80"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-64 bg-white/30 dark:bg-gray-800/30 rounded-lg flex items-center justify-center"
            >
              <div className="text-center">
                <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-300">Tap the button below to scan a QR code</p>
                <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                  {isOnline
                    ? "You're online - transactions will process immediately"
                    : "You're offline - transactions will be saved for later"}
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setContinuous(!continuous);
                      if (!continuous && !scanning) {
                        handleScan();
                      }
                    }}
                    className={continuous ? "bg-primary/10" : ""}
                  >
                    {continuous ? "Disable" : "Enable"} Continuous Mode
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5">
          <h3 className="text-xs mb-1 text-gray-500 font-semibold flex items-center gap-1">
            <Info className="w-3 h-3" />
            Recent transaction save logs
          </h3>
          {debugLogList.length === 0 ? (
            <div className="text-[11px] text-gray-400 bg-white/30 dark:bg-gray-800/30 py-2 px-3 rounded">
              No QR-captured transactions saved in this session yet.
            </div>
          ) : (
            <ul className="space-y-1">
              {debugLogList.map((log, idx) => (
                <motion.li
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/30 dark:bg-gray-800/30 rounded px-2 py-1 text-xs flex flex-col border border-gray-200 dark:border-gray-700"
                >
                  <span className="flex gap-2 items-center">
                    <span className="text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <Badge variant={log.isOffline ? "destructive" : "secondary"} className="ml-1">
                      {log.isOffline ? 'Offline' : 'Online'}
                    </Badge>
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Saved: <b>{log.data.amount} XLM</b> to <span className="font-mono">{log.data.destination.slice(0, 8)}...</span>
                    <span className="ml-2 text-gray-400">TX ID {log.id.slice(-5)}</span>
                  </span>
                  <span className="text-gray-400">
                    Status: <b>{log.data.status}</b> | QR: <i>{log.data.qrFormat}</i>
                  </span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        {result ? (
          <div className="space-x-2">
            <Button
              onClick={handleTransaction}
              disabled={!result.isValid}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Send Transaction
            </Button>
            <Button variant="outline" onClick={resetScanner}>Cancel</Button>
          </div>
        ) : (
          <Button
            onClick={() => handleScan()}
            disabled={scanning}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Camera className="mr-1 w-4 h-4" />
            Scan QR Code
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};