import React from 'react';
import { Target, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { formatINR } from '../../lib/formatters';

interface MonthlySpendingSummaryProps {
  onOpenBudgetModal: () => void;
}

export const MonthlySpendingSummary: React.FC<MonthlySpendingSummaryProps> = ({
  onOpenBudgetModal,
}) => {
  const { currentMonthSummary, overallBudget } = useExpenses();

  const totalSpent = currentMonthSummary.totalExpense;
  const budgetLimit = overallBudget?.amount || 65000;
  const percentage = Math.min(100, Math.round((totalSpent / budgetLimit) * 100));
  const remainingBudget = Math.max(0, budgetLimit - totalSpent);
  const isOverBudget = totalSpent > budgetLimit;

  // Progress bar color based on percentage
  const getProgressColor = () => {
    if (percentage > 90) return 'bg-rose-500';
    if (percentage > 70) return 'bg-amber-500';
    return 'bg-gradient-to-r from-brand-600 to-indigo-500';
  };

  return (
    <div className="bg-white dark:bg-[#1a1825] rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-navi-card transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <Target size={17} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Monthly Budget Tracker
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Target: {formatINR(budgetLimit)}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenBudgetModal}
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 hover:underline"
        >
          Adjust
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-gray-700 dark:text-gray-300">
            {formatINR(totalSpent)}{' '}
            <span className="font-normal text-gray-400">spent</span>
          </span>
          <span
            className={
              isOverBudget
                ? 'text-rose-600 dark:text-rose-400 font-bold'
                : 'text-brand-600 dark:text-brand-400 font-bold'
            }
          >
            {percentage}%
          </span>
        </div>

        <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Footer Info Pill */}
      <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          {isOverBudget ? (
            <AlertCircle size={14} className="text-rose-500" />
          ) : (
            <Sparkles size={14} className="text-emerald-500" />
          )}
          <span>
            {isOverBudget ? (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                Exceeded budget by {formatINR(totalSpent - budgetLimit)}
              </span>
            ) : (
              <span>
                <strong className="text-gray-900 dark:text-white font-bold">
                  {formatINR(remainingBudget)}
                </strong>{' '}
                left to spend
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
          <TrendingUp size={12} />
          <span>Avg {formatINR(currentMonthSummary.dailyAverage)}/day</span>
        </div>
      </div>
    </div>
  );
};

