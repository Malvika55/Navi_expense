import React, { useState } from 'react';
import { ChevronRight, ReceiptText, Sparkles } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { NavTab } from '../common/BottomNav';
import { BalanceCard } from './BalanceCard';
import { QuickActions } from './QuickActions';
import { MonthlySpendingSummary } from './MonthlySpendingSummary';
import { MiniBreakdownChart } from './MiniBreakdownChart';
import { SmartInsightsBanner } from './SmartInsightsBanner';
import { TransactionItem } from '../transactions/TransactionItem';
import { TransactionDetailsModal } from '../transactions/TransactionDetailsModal';
import { AddEditTransactionModal } from '../transactions/AddEditTransactionModal';
import { Transaction, TransactionType } from '../../types';
import { Modal } from '../common/Modal';
import { formatINR } from '../../lib/formatters';

interface HomeViewProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenAddModalWithType: (type: TransactionType) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateTab,
  onOpenAddModalWithType,
}) => {
  const { transactions, overallBudget, setBudget, selectedMonth } = useExpenses();

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isAdjustBudgetOpen, setIsAdjustBudgetOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(overallBudget?.amount || 65000));

  // Recent 4 transactions
  const recentTransactions = transactions.slice(0, 4);

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) {
      await setBudget({
        category_id: null,
        amount: val,
        month: selectedMonth,
      });
      setIsAdjustBudgetOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Navi Sleek Balance Card */}
      <BalanceCard />

      {/* 2. Quick Action Buttons */}
      <QuickActions
        onOpenAddExpense={() => onOpenAddModalWithType('expense')}
        onOpenAddIncome={() => onOpenAddModalWithType('income')}
        onNavigateTab={onNavigateTab}
      />

      {/* 3. Smart Algorithmic Financial Insights */}
      <SmartInsightsBanner />

      {/* 4. Monthly Spending & Budget Meter */}
      <MonthlySpendingSummary onOpenBudgetModal={() => setIsAdjustBudgetOpen(true)} />

      {/* 5. Mini Expense Breakdown Chart */}
      <MiniBreakdownChart onViewAllCategories={() => onNavigateTab('money-manager')} />

      {/* 6. Recent Transactions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              UPI Activity
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('transactions')}
            className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 hover:underline"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="bg-white dark:bg-[#1a1825] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-navi-card text-center text-xs text-gray-400">
            No transactions yet. Click "+ Add Expense" or "+ Add Income" above!
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1a1825] rounded-3xl border border-gray-100 dark:border-white/5 shadow-navi-card overflow-hidden">
            {recentTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onClick={() => setSelectedTx(tx)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Transaction Details Modal when clicking recent transaction */}
      <TransactionDetailsModal
        transaction={selectedTx}
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        onEdit={() => {
          setSelectedTx(null);
          onNavigateTab('transactions');
        }}
        onDelete={() => {
          setSelectedTx(null);
          onNavigateTab('transactions');
        }}
      />

      {/* Adjust Monthly Budget Modal */}
      <Modal
        isOpen={isAdjustBudgetOpen}
        onClose={() => setIsAdjustBudgetOpen(false)}
        title="Adjust Monthly Budget Target"
        maxWidth="sm"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Monthly Limit (INR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
                ₹
              </span>
              <input
                type="number"
                step="500"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-base font-extrabold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdjustBudgetOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/30"
            >
              Save Target
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

