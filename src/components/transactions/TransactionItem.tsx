import React from 'react';
import { CheckCircle2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Transaction } from '../../types';
import { formatINR, formatTime12h, getInitials } from '../../lib/formatters';
import { CategoryIcon } from '../common/CategoryIcon';
import { useExpenses } from '../../context/ExpenseContext';

interface TransactionItemProps {
  transaction: Transaction;
  onClick: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onClick }) => {
  const { categories } = useExpenses();

  const isIncome = transaction.type === 'income';
  const category = categories.find((c) => c.id === transaction.category_id);

  // Avatar background based on type or category
  const avatarBg = isIncome
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
    : 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400';

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="group flex items-center justify-between p-3.5 sm:p-4 hover:bg-gray-50/80 dark:hover:bg-white/[0.03] active:bg-gray-100/60 transition-colors cursor-pointer border-b border-gray-100/70 dark:border-white/5 last:border-b-0"
    >
      {/* Left side: Avatar & info */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
        <div className="relative shrink-0">
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-sm sm:text-base transition-transform group-hover:scale-105 ${avatarBg}`}
          >
            {category?.icon ? (
              <CategoryIcon iconName={category.icon} size={20} />
            ) : (
              <span>{getInitials(transaction.title)}</span>
            )}
          </div>

          {/* Type Mini Badge at corner */}
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white ring-2 ring-white dark:ring-[#1a1825] ${
              isIncome ? 'bg-navi-green' : 'bg-brand-600'
            }`}
          >
            {isIncome ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}
          </div>
        </div>

        <div className="min-w-0">
          <h4 className="text-sm sm:text-[15px] font-bold text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {transaction.title}
          </h4>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            <span>{formatTime12h(transaction.time)}</span>
            <span>•</span>
            <span className="truncate max-w-[120px] sm:max-w-[180px]">
              {transaction.category_name || category?.name || 'General'}
            </span>
            <span className="hidden xs:inline">•</span>
            <span className="hidden xs:inline text-[11px] font-medium px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              {transaction.payment_method}
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Amount & Status */}
      <div className="flex flex-col items-end shrink-0 pl-3">
        <div
          className={`text-sm sm:text-base font-extrabold tracking-tight ${
            isIncome
              ? 'text-navi-green dark:text-emerald-400'
              : 'text-gray-900 dark:text-white'
          }`}
        >
          {isIncome ? `+ ${formatINR(transaction.amount)}` : `- ${formatINR(transaction.amount)}`}
        </div>

        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
          <CheckCircle2 size={12} className="text-emerald-500" />
          <span className="hidden xs:inline">Successful</span>
        </div>
      </div>
    </div>
  );
};

