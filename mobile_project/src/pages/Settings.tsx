import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationSettings } from '@/components/NotificationSettings';
import { TransactionExport } from '@/components/TransactionExport';
import { NetworkStatus } from '@/components/NetworkStatus';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <NetworkStatus />
        </div>
        
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="export">Export Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="export">
            <TransactionExport />
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Stellar Offline Transfer</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              This application allows you to scan Stellar QR codes and process transactions
              even when offline. Transactions will be stored locally and processed when you're
              back online.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Version 2.0.0 • Built with Stellar SDK
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
