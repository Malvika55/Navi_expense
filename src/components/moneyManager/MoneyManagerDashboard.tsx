import React, { useState } from 'react';
import {
  PieChart,
  Target,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  Percent,
} from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { formatINR } from '../../lib/formatters';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';
import { IncomeVsExpenseChart } from './IncomeVsExpenseChart';
import { SpendingTrendsChart } from './SpendingTrendsChart';
import { BudgetManager } from './BudgetManager';
import { CategoryManager } from './CategoryManager';
import { FinancialInsightsList } from './FinancialInsightsList';

type SubTab = 'analytics' | 'budgets' | 'categories' | 'insights';

export const MoneyManagerDashboard: React.FC = () => {
  const { currentMonthSummary, overallBudget } = useExpenses();
  const [activeTab, setActiveTab] = useState<SubTab>('analytics');

  const totalIncome = currentMonthSummary.totalIncome;
  const totalExpense = currentMonthSummary.totalExpense;
  const remainingBalance = totalIncome - totalExpense;
  const monthlySavings = Math.max(0, remainingBalance);

  const budgetLimit = overallBudget?.amount || 65000;
  const budgetUsage = Math.round((totalExpense / budgetLimit) * 100);

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Money Manager
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Complete personal financial health & budgeting hub
        </p>
      </div>

      {/* 5 Key Metric Cards from Requirements */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {/* Metric 1: Total Income */}
        <div className="bg-white dark:bg-[#1a1825] rounded-2xl p-3.5 border border-gray-100 dark:border-white/5 shadow-navi-card transition-all">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">
            <ArrowUpRight size={14} className="text-emerald-500" />
            <span>Total Income</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatINR(totalIncome)}
          </div>
        </div>

        {/* Metric 2: Total Expenses */}
        <div className="bg-white dark:bg-[#1a1825] rounded-2xl p-3.5 border border-gray-100 dark:border-white/5 shadow-navi-card transition-all">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">
            <ArrowDownRight size={14} className="text-rose-500" />
            <span>Total Expenses</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-rose-600 dark:text-rose-400">
            {formatINR(totalExpense)}
          </div>
        </div>

        {/* Metric 3: Remaining Balance */}
        <div className="bg-white dark:bg-[#1a1825] rounded-2xl p-3.5 border border-gray-100 dark:border-white/5 shadow-navi-card transition-all">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">
            <Wallet size={14} className="text-brand-500" />
            <span>Remaining Balance</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
            {formatINR(remainingBalance)}
          </div>
        </div>

        {/* Metric 4: Monthly Savings */}
        <div className="bg-white dark:bg-[#1a1825] rounded-2xl p-3.5 border border-gray-100 dark:border-white/5 shadow-navi-card transition-all">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">
            <PiggyBank size={14} className="text-indigo-500" />
            <span>Monthly Savings</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
            {formatINR(monthlySavings)}
          </div>
        </div>

        {/* Metric 5: Monthly Budget Usage */}
        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-[#1a1825] rounded-2xl p-3.5 border border-gray-100 dark:border-white/5 shadow-navi-card transition-all">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">
            <Percent size={14} className="text-amber-500" />
            <span>Budget Usage</span>
          </div>
          <div
            className={`text-base sm:text-lg font-extrabold ${
              budgetUsage > 100
                ? 'text-rose-600 dark:text-rose-400'
                : budgetUsage > 80
                ? 'text-amber-500'
                : 'text-brand-600 dark:text-brand-400'
            }`}
          >
            {budgetUsage}%
          </div>
        </div>
      </div>

      {/* Segmented SubTabs */}
      <div className="flex items-center p-1 rounded-2xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60 overflow-x-auto no-scrollbar gap-1">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-white dark:bg-[#1a1825] text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <PieChart size={15} />
          <span>Analytics & Charts</span>
        </button>

        <button
          onClick={() => setActiveTab('budgets')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === 'budgets'
              ? 'bg-white dark:bg-[#1a1825] text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Target size={15} />
          <span>Budget Limits</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === 'categories'
              ? 'bg-white dark:bg-[#1a1825] text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Layers size={15} />
          <span>Categories</span>
        </button>

        <button
          onClick={() => setActiveTab('insights')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === 'insights'
              ? 'bg-white dark:bg-[#1a1825] text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Sparkles size={15} />
          <span>Insights</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'analytics' && (
        <div className="space-y-5">
          <CategoryBreakdownChart />
          <IncomeVsExpenseChart />
          <SpendingTrendsChart />
        </div>
      )}

      {activeTab === 'budgets' && <BudgetManager />}

      {activeTab === 'categories' && <CategoryManager />}

      {activeTab === 'insights' && <FinancialInsightsList />}
    </div>
  );
};

