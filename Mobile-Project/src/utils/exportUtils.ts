import { PendingTransaction } from '@/types/stellar';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

export const exportTransactionsToCSV = (transactions: PendingTransaction[]): void => {
  // Create CSV header
  const csvHeader = ['Transaction ID', 'Date', 'Destination Address', 'Amount (XLM)', 'Memo', 'Status'];
  
  // Create CSV rows
  const csvRows = transactions.map(tx => {
    const date = new Date(tx.timestamp);
    const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');
    
    return [
      tx.id,
      formattedDate,
      tx.destination,
      tx.amount,
      tx.memo || '',
      tx.status
    ];
  });
  
  // Combine header and rows
  const csvContent = [
    csvHeader.join(','),
    ...csvRows.map(row => row.join(','))
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const filename = `stellar-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  saveAs(blob, filename);
};

export const exportTransactionsToJSON = (transactions: PendingTransaction[]): void => {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
  const filename = `stellar-transactions-${format(new Date(), 'yyyy-MM-dd')}.json`;
  saveAs(blob, filename);
};

export const exportTransactionsToPDF = async (transactions: PendingTransaction[]): Promise<void> => {
  try {
    // Since we need to dynamically import jspdf and jspdf-autotable,
    // we'll provide a simpler implementation here
    alert('PDF export functionality requires additional setup with jsPDF. CSV and JSON exports are available now.');
  } catch (error) {
    console.error('Failed to export transactions to PDF:', error);
  }
};
