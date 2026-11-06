import React from 'react';
import { PieChart, ChevronRight } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { formatINR } from '../../lib/formatters';
import { CategoryIcon } from '../common/CategoryIcon';

interface MiniBreakdownChartProps {
  onViewAllCategories: () => void;
}

export const MiniBreakdownChart: React.FC<MiniBreakdownChartProps> = ({
  onViewAllCategories,
}) => {
  const { categoryBudgets, currentMonthSummary } = useExpenses();

  // Sort categories by spent amount descending
  const topCategories = [...categoryBudgets]
    .filter((cat) => cat.spentAmount > 0)
    .sort((a, b) => b.spentAmount - a.spentAmount)
    .slice(0, 4);

  const totalSpent = currentMonthSummary.totalExpense;

  return (
    <div className="bg-white dark:bg-[#1a1825] rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-navi-card my-5 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <PieChart size={17} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Spending Breakdown
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Top spending categories
            </p>
          </div>
        </div>

        <button
          onClick={onViewAllCategories}
          className="flex items-center gap-0.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 hover:underline"
        >
          <span>View All</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {topCategories.length === 0 ? (
        <div className="py-6 text-center text-xs text-gray-400">
          No expenses recorded for this month yet.
        </div>
      ) : (
        <div className="space-y-3">
          {topCategories.map((cat) => {
            const pct = totalSpent > 0 ? (cat.spentAmount / totalSpent) * 100 : 0;
            return (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      <CategoryIcon iconName={cat.icon} size={13} className="text-white" />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {cat.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {formatINR(cat.spentAmount)}
                    </span>
                    <span className="text-[11px] font-medium text-gray-400 w-9 text-right">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Mini progress bar */}
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

