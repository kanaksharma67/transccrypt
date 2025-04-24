
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPendingTransactions } from '@/utils/localStorage';
import { exportTransactionsToCSV, exportTransactionsToJSON } from '@/utils/exportUtils';
import { Label } from '@/components/ui/label';
import { DownloadIcon } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export const TransactionExport = () => {
  const [format, setFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');

  const handleExport = () => {
    try {
      // Get all transactions
      let transactions = getPendingTransactions();
      
      // Filter by date range if needed
      if (dateRange !== 'all') {
        const now = new Date();
        const cutoff = new Date();
        
        switch (dateRange) {
          case 'today':
            cutoff.setHours(0, 0, 0, 0);
            break;
          case 'week':
            cutoff.setDate(cutoff.getDate() - 7);
            break;
          case 'month':
            cutoff.setMonth(cutoff.getMonth() - 1);
            break;
          case 'year':
            cutoff.setFullYear(cutoff.getFullYear() - 1);
            break;
        }
        
        transactions = transactions.filter(tx => tx.timestamp >= cutoff.getTime());
      }
      
      if (transactions.length === 0) {
        toast.warning('No transactions to export for the selected period');
        return;
      }
      
      // Export in the selected format
      if (format === 'csv') {
        exportTransactionsToCSV(transactions);
        toast.success(`Exported ${transactions.length} transactions to CSV`);
      } else if (format === 'json') {
        exportTransactionsToJSON(transactions);
        toast.success(`Exported ${transactions.length} transactions to JSON`);
      }
    } catch (error) {
      console.error('Failed to export transactions:', error);
      toast.error('Failed to export transactions');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="format">Export Format</Label>
          <Select 
            value={format} 
            onValueChange={setFormat}
          >
            <SelectTrigger id="format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV (Excel, Google Sheets)</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date-range">Date Range</Label>
          <Select 
            value={dateRange} 
            onValueChange={setDateRange}
          >
            <SelectTrigger id="date-range">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleExport} 
          className="w-full mt-4"
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export Transactions
        </Button>
      </CardContent>
    </Card>
  );
};
