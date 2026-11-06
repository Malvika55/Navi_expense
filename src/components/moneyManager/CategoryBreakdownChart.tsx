import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useExpenses } from '../../context/ExpenseContext';
import { formatINR } from '../../lib/formatters';
import { CategoryIcon } from '../common/CategoryIcon';

export const CategoryBreakdownChart: React.FC = () => {
  const { categoryBudgets, currentMonthSummary } = useExpenses();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalSpent = currentMonthSummary.totalExpense;

  // Filter only categories with spending
  const data = categoryBudgets
    .filter((c) => c.spentAmount > 0)
    .sort((a, b) => b.spentAmount - a.spentAmount)
    .map((c) => ({
      id: c.id,
      name: c.name,
      value: c.spentAmount,
      color: c.color,
      icon: c.icon,
      percentage: totalSpent > 0 ? (c.spentAmount / totalSpent) * 100 : 0,
    }));

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1a1825] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-navi-card text-center text-xs text-gray-400">
        No expense data recorded for this month to generate category breakdown.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a1825] rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-navi-card transition-all">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          Category Spending Breakdown
        </h3>
        <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
          Total: {formatINR(totalSpent)}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
        {/* Donut Chart */}
        <div className="w-full sm:w-1/2 h-56 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={entry.color}
                    stroke="transparent"
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                  />
                ))}
              </Pie>
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(val: any) => [formatINR(Number(val)), 'Spent']}
                contentStyle={{
                  backgroundColor: '#1a1825',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text in Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] font-medium text-gray-400">Top Outflow</span>
            <span className="text-sm font-extrabold text-gray-900 dark:text-white max-w-[90px] text-center truncate">
              {data[0]?.name}
            </span>
          </div>
        </div>

        {/* Legend & Breakdown List */}
        <div className="w-full sm:w-1/2 space-y-2 max-h-56 overflow-y-auto pr-1">
          {data.map((item, idx) => (
            <div
              key={item.id}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                activeIndex === idx
                  ? 'bg-gray-100 dark:bg-gray-800 scale-[1.02]'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {item.name}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {formatINR(item.value)}
                </span>
                <span className="text-[11px] font-medium text-gray-400 w-9 text-right">
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

