import React from 'react';
import { ArrowDownLeft, ArrowUpRight, ReceiptText, PieChart } from 'lucide-react';
import { NavTab } from '../common/BottomNav';

interface QuickActionsProps {
  onOpenAddExpense: () => void;
  onOpenAddIncome: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenAddExpense,
  onOpenAddIncome,
  onNavigateTab,
}) => {
  const actions = [
    {
      id: 'add-expense',
      label: 'Add Expense',
      icon: ArrowDownLeft,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/30',
      onClick: onOpenAddExpense,
    },
    {
      id: 'add-income',
      label: 'Add Income',
      icon: ArrowUpRight,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30',
      onClick: onOpenAddIncome,
    },
    {
      id: 'view-tx',
      label: 'Transactions',
      icon: ReceiptText,
      color: 'text-brand-600 dark:text-brand-400',
      bgColor: 'bg-brand-50 dark:bg-brand-950/40 border-brand-100 dark:border-brand-900/30',
      onClick: () => onNavigateTab('transactions'),
    },
    {
      id: 'view-mgr',
      label: 'Money Manager',
      icon: PieChart,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/30',
      onClick: () => onNavigateTab('money-manager'),
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-4 my-5">
      {actions.map((act) => {
        const IconComponent = act.icon;
        return (
          <button
            key={act.id}
            onClick={act.onClick}
            className="flex flex-col items-center group focus:outline-none transition-transform active:scale-95"
          >
            <div
              className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center p-3 border shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-0.5 ${act.bgColor}`}
            >
              <IconComponent size={24} className={`${act.color}`} strokeWidth={2.2} />
            </div>
            <span className="text-[11.5px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 mt-2 text-center line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400">
              {act.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

