import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useExpenses } from '../../context/ExpenseContext';
import { formatINR } from '../../lib/formatters';

export const SpendingTrendsChart: React.FC = () => {
  const { transactions, selectedMonth } = useExpenses();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly'>('daily');

  const chartData = useMemo(() => {
    const monthExpenses = transactions.filter(
      (t) => t.type === 'expense' && t.date.startsWith(selectedMonth)
    );

    if (timeframe === 'daily') {
      // Days in month
      const [year, month] = selectedMonth.split('-').map(Number);
      const daysInMonth = new Date(year, month, 0).getDate();

      const dayMap: Record<number, number> = {};
      for (let d = 1; d <= daysInMonth; d++) {
        dayMap[d] = 0;
      }

      monthExpenses.forEach((tx) => {
        const day = parseInt(tx.date.split('-')[2], 10);
        if (dayMap[day] !== undefined) {
          dayMap[day] += tx.amount;
        }
      });

      return Object.entries(dayMap).map(([day, amount]) => ({
        label: `${day}`,
        amount,
      }));
    } else {
      // Weekly aggregation
      const weekMap: Record<string, number> = {
        'Week 1 (1-7)': 0,
        'Week 2 (8-14)': 0,
        'Week 3 (15-21)': 0,
        'Week 4 (22-28)': 0,
        'Week 5 (29+)': 0,
      };

      monthExpenses.forEach((tx) => {
        const day = parseInt(tx.date.split('-')[2], 10);
        if (day <= 7) weekMap['Week 1 (1-7)'] += tx.amount;
        else if (day <= 14) weekMap['Week 2 (8-14)'] += tx.amount;
        else if (day <= 21) weekMap['Week 3 (15-21)'] += tx.amount;
        else if (day <= 28) weekMap['Week 4 (22-28)'] += tx.amount;
        else weekMap['Week 5 (29+)'] += tx.amount;
      });

      return Object.entries(weekMap).map(([week, amount]) => ({
        label: week,
        amount,
      }));
    }
  }, [transactions, selectedMonth, timeframe]);

  return (
    <div className="bg-white dark:bg-[#1a1825] rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-navi-card my-5 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Spending Velocity & Trends
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {timeframe === 'daily' ? 'Day-by-day expense curve' : 'Weekly aggregated expenses'}
          </p>
        </div>

        <div className="flex items-center p-0.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 text-xs">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              timeframe === 'daily'
                ? 'bg-white dark:bg-[#1a1825] text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              timeframe === 'weekly'
                ? 'bg-white dark:bg-[#1a1825] text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6339F5" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6339F5" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.15)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#888' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#888' }}
              tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
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
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#6339F5"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#spendingGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

