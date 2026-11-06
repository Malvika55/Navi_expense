import React from 'react';
import { Transaction } from '../../types';
import { formatGroupDate, formatINR } from '../../lib/formatters';
import { TransactionItem } from './TransactionItem';

interface TransactionGroupProps {
  date: string; // YYYY-MM-DD
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
}

export const TransactionGroup: React.FC<TransactionGroupProps> = ({
  date,
  transactions,
  onSelectTransaction,
}) => {
  // Calculate daily totals
  const dailySpent = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const dailyReceived = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="mb-4 last:mb-0">
      {/* Date Header */}
      <div className="sticky top-[57px] z-10 bg-[#f7f7fa]/95 dark:bg-[#100e18]/95 backdrop-blur-md py-2 px-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {formatGroupDate(date)}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            ({transactions.length})
          </span>
        </div>

        {/* Daily Net indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          {dailyReceived > 0 && (
            <span className="text-emerald-600 dark:text-emerald-400">
              +{formatINR(dailyReceived)}
            </span>
          )}
          {dailySpent > 0 && (
            <span className="text-gray-500 dark:text-gray-400">
              Spent: {formatINR(dailySpent)}
            </span>
          )}
        </div>
      </div>

      {/* Transactions Container */}
      <div className="bg-white dark:bg-[#1a1825] rounded-3xl border border-gray-100 dark:border-white/5 shadow-navi-card overflow-hidden">
        {transactions.map((tx) => (
          <TransactionItem
            key={tx.id}
            transaction={tx}
            onClick={() => onSelectTransaction(tx)}
          />
        ))}
      </div>
    </div>
  );
};

