import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useExpenses } from '../../context/ExpenseContext';
import { formatINR } from '../../lib/formatters';

export const IncomeVsExpenseChart: React.FC = () => {
  const { transactions } = useExpenses();
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

  const chartData = useMemo(() => {
    if (viewMode === 'monthly') {
      // Last 6 months
      const months: string[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
      }

      return months.map((monthKey) => {
        const [y, m] = monthKey.split('-').map(Number);
        const label = new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'short' });

        const monthTxs = transactions.filter((t) => t.date.startsWith(monthKey));
        const income = monthTxs
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = monthTxs
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          label,
          fullMonth: monthKey,
          income,
          expense,
          savings: Math.max(0, income - expense),
        };
      });
    } else {
      // Yearly view: By Year (last 3 years)
      const currentYear = new Date().getFullYear();
      const years = [currentYear - 2, currentYear - 1, currentYear];

      return years.map((yr) => {
        const yrStr = String(yr);
        const yrTxs = transactions.filter((t) => t.date.startsWith(yrStr));
        const income = yrTxs
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = yrTxs
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          label: yrStr,
          fullMonth: yrStr,
          income,
          expense,
          savings: Math.max(0, income - expense),
        };
      });
    }
  }, [transactions, viewMode]);

  return (
    <div className="bg-white dark:bg-[#1a1825] rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-navi-card my-5 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Income vs Spending
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Compare monthly inflows against outflows
          </p>
        </div>

        {/* View Switcher: Monthly vs Yearly */}
        <div className="flex items-center p-0.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 text-xs">
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              viewMode === 'monthly'
                ? 'bg-white dark:bg-[#1a1825] text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode('yearly')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              viewMode === 'yearly'
                ? 'bg-white dark:bg-[#1a1825] text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.15)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#888' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#888' }}
              tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(val: any, name: any) => [
                formatINR(Number(val)),
                name === 'income' ? 'Total Income' : 'Total Expense',
              ]}
              contentStyle={{
                backgroundColor: '#1a1825',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
            />
            <Bar dataKey="income" name="Income" fill="#00B368" radius={[6, 6, 0, 0]} maxBarSize={32} />
            <Bar dataKey="expense" name="Expense" fill="#6339F5" radius={[6, 6, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

