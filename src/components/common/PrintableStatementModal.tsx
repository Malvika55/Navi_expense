import React from 'react';
import { Printer, X } from 'lucide-react';
import { Modal } from './Modal';
import { useExpenses } from '../../context/ExpenseContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../lib/formatters';

interface PrintableStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableStatementModal: React.FC<PrintableStatementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { transactions, currentMonthSummary, selectedMonth } = useExpenses();
  const { profile } = useAuth();

  if (!isOpen) return null;

  const [year, month] = selectedMonth.split('-').map(Number);
  const monthDate = new Date(year, month - 1, 1);
  const monthName = monthDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const monthTransactions = transactions
    .filter((t) => t.date.startsWith(selectedMonth))
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Monthly Account Statement"
      subtitle={`Official Passbook Statement for ${monthName}`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-semibold text-gray-500">
            {monthTransactions.length} transaction records
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/30 transition-all"
          >
            <Printer size={14} />
            <span>Print / Save as PDF</span>
          </button>
        </div>

        <div
          id="printable-statement"
          className="bg-white dark:bg-[#12111a] text-gray-900 dark:text-gray-100 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs shadow-inner"
        >
          <div className="flex items-start justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand-600 text-white font-extrabold flex items-center justify-center text-sm">
                  N
                </div>
                <h2 className="text-lg font-extrabold tracking-tight">NaviPulse Financial</h2>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">Personal Expense & Passbook Statement</p>
            </div>

            <div className="text-right">
              <span className="font-bold text-gray-800 dark:text-gray-200 uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
                Verified Statement
              </span>
              <p className="text-[10px] text-gray-400 mt-1">Generated: {new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-b border-gray-100 dark:border-gray-800 text-[11px]">
            <div>
              <span className="text-gray-400 block">Account Holder</span>
              <strong className="text-gray-800 dark:text-gray-200 font-bold">
                {profile?.full_name || 'Personal User'}
              </strong>
            </div>
            <div>
              <span className="text-gray-400 block">UPI Handle</span>
              <span className="font-mono text-gray-700 dark:text-gray-300 font-semibold">
                {profile?.upi_id || 'user@navipulse'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block">Statement Period</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{monthName}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 my-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
            <div>
              <span className="text-gray-500 text-[10px] font-medium block">Total Income (Inflow)</span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatINR(currentMonthSummary.totalIncome)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] font-medium block">Total Expense (Outflow)</span>
              <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">
                {formatINR(currentMonthSummary.totalExpense)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] font-medium block">Net Balance</span>
              <span className="text-sm font-extrabold text-brand-600 dark:text-brand-400">
                {formatINR(currentMonthSummary.totalIncome - currentMonthSummary.totalExpense)}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-400 uppercase text-[9.5px]">
                  <th className="py-2 px-1">Date</th>
                  <th className="py-2 px-1">Transaction Details</th>
                  <th className="py-2 px-1">Category</th>
                  <th className="py-2 px-1">Mode</th>
                  <th className="py-2 px-1 text-right">Debit (₹)</th>
                  <th className="py-2 px-1 text-right">Credit (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {monthTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="py-2 px-1 font-mono text-gray-500 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-2 px-1 font-semibold text-gray-800 dark:text-gray-200">
                      <div>{tx.title}</div>
                      {tx.notes && <div className="text-[10px] text-gray-400 italic">{tx.notes}</div>}
                    </td>
                    <td className="py-2 px-1 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {tx.category_name || tx.category_id}
                    </td>
                    <td className="py-2 px-1 text-gray-500 whitespace-nowrap">
                      {tx.payment_method}
                    </td>
                    <td className="py-2 px-1 text-right font-bold text-gray-800 dark:text-gray-200">
                      {tx.type === 'expense' ? formatINR(tx.amount) : '-'}
                    </td>
                    <td className="py-2 px-1 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {tx.type === 'income' ? `+${formatINR(tx.amount)}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-3 border-t border-gray-200 dark:border-gray-700 text-[10px] text-gray-400 text-center">
            This statement was generated for personal money management via NaviPulse Expense Tracker.
          </div>
        </div>
      </div>
    </Modal>
  );
};

