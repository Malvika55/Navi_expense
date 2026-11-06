import { Transaction, MonthlySummary } from '../types';
import { formatINR } from './formatters';

export function exportTransactionsToCSV(transactions: Transaction[], filename: string = 'navipulse_transactions.csv'): void {
  const headers = [
    'Transaction ID',
    'Date',
    'Time',
    'Title / Merchant',
    'Type',
    'Category',
    'Amount (₹)',
    'Payment Method',
    'Bank / Account',
    'Reference ID',
    'Status',
    'Notes',
  ];

  const escapeCSV = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const stringVal = String(val).replace(/"/g, '""');
    return `"${stringVal}"`;
  };

  const rows = transactions.map((tx) => [
    escapeCSV(tx.id),
    escapeCSV(tx.date),
    escapeCSV(tx.time),
    escapeCSV(tx.title),
    escapeCSV(tx.type.toUpperCase()),
    escapeCSV(tx.category_name || tx.category_id),
    escapeCSV(tx.amount),
    escapeCSV(tx.payment_method),
    escapeCSV(tx.bank_name || 'N/A'),
    escapeCSV(tx.reference_id || 'N/A'),
    escapeCSV(tx.status),
    escapeCSV(tx.notes || ''),
  ]);

  const csvContent = [headers.map((h) => `"${h}"`).join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportMonthlyReportSummary(
  summary: MonthlySummary,
  transactions: Transaction[],
  monthLabel: string
): void {
  const totalExpense = summary.totalExpense;
  const totalIncome = summary.totalIncome;
  const netSavings = summary.netSavings;
  const savingsRate = summary.savingsRate;

  let reportText = `===========================================================\n`;
  reportText += `       NAVIPULSE FINANCIAL REPORT - ${monthLabel.toUpperCase()}\n`;
  reportText += `===========================================================\n\n`;
  reportText += `1. FINANCIAL OVERVIEW\n`;
  reportText += `-----------------------------------------------------------\n`;
  reportText += `Total Income Received:  ${formatINR(totalIncome)}\n`;
  reportText += `Total Expenses Spent:   ${formatINR(totalExpense)}\n`;
  reportText += `Net Savings:            ${formatINR(netSavings)}\n`;
  reportText += `Savings Rate:           ${savingsRate.toFixed(1)}%\n`;
  reportText += `Daily Average Spending: ${formatINR(summary.dailyAverage)}\n`;
  if (summary.topCategory) {
    reportText += `Highest Spending Area:  ${summary.topCategory.name} (${formatINR(summary.topCategory.amount)} - ${summary.topCategory.percentage.toFixed(1)}%)\n`;
  }
  reportText += `\n`;

  reportText += `2. TRANSACTIONS SUMMARY (${transactions.length} total entries)\n`;
  reportText += `-----------------------------------------------------------\n`;
  transactions.forEach((tx, idx) => {
    const sign = tx.type === 'income' ? '+' : '-';
    reportText += `${idx + 1}. [${tx.date} ${tx.time}] ${tx.title.padEnd(25)} ${sign}${formatINR(tx.amount).padStart(12)} (${tx.category_name || tx.category_id}) - ${tx.payment_method}\n`;
  });

  reportText += `\n===========================================================\n`;
  reportText += `Generated automatically by NaviPulse on ${new Date().toLocaleString('en-IN')}\n`;

  downloadFile(reportText, `navipulse_monthly_report_${monthLabel.replace(/\s+/g, '_')}.txt`, 'text/plain;charset=utf-8;');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

