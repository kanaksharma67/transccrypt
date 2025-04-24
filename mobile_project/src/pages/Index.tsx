import { useEffect, useState } from 'react';
import { AccountInfo } from '@/components/AccountInfo';
import { AdvancedQRScanner } from '@/components/AdvancedQRScanner';
import { TransactionsList } from '@/components/TransactionsList';
import { NetworkStatus } from '@/components/NetworkStatus';
import { useNetworkStatus } from '@/utils/networkStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const Index = () => {
  const { isOnline } = useNetworkStatus();
  const [activeTab, setActiveTab] = useState<string>("account");
  
  useEffect(() => {
    console.log(`Tab changed to: ${activeTab}`);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 touch-manipulation">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Stellar Wallet</h1>
          <div className="flex items-center gap-2">
            <NetworkStatus />
            <Link 
              to="/settings" 
              className="inline-flex items-center justify-center rounded-md w-12 h-12 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground touch-manipulation"
            >
              <Settings className="h-6 w-6" />
              <span className="sr-only">Settings</span>
            </Link>
          </div>
        </div>
        
        <Tabs 
          value={activeTab} 
          defaultValue="account" 
          className="w-full" 
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid w-full grid-cols-3 h-14">
            <TabsTrigger 
              value="account"
              className="text-sm md:text-base py-3"
            >
              Account
            </TabsTrigger>
            <TabsTrigger 
              value="scan"
              className="text-sm md:text-base py-3"
            >
              Scan QR
            </TabsTrigger>
            <TabsTrigger 
              value="transactions"
              className="text-sm md:text-base py-3"
            >
              Transactions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>View your Stellar account details</CardDescription>
              </CardHeader>
              <CardContent>
                <AccountInfo />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="scan">
            <AdvancedQRScanner />
          </TabsContent>
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View your recent transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionsList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;