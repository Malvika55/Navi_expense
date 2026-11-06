import React, { useState } from 'react';
import {
  Target,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { formatINR } from '../../lib/formatters';
import { Modal } from '../common/Modal';
import { CategoryIcon } from '../common/CategoryIcon';
import { Category } from '../../types';

export const BudgetManager: React.FC = () => {
  const {
    categoryBudgets,
    overallBudget,
    currentMonthSummary,
    selectedMonth,
    setBudget,
    deleteBudget,
    categories,
  } = useExpenses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState<string>('overall'); // 'overall' or category_id
  const [amountInput, setAmountInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const totalSpent = currentMonthSummary.totalExpense;
  const overallLimit = overallBudget?.amount || 65000;
  const overallUsage = Math.round((totalSpent / overallLimit) * 100);

  const handleOpenModal = (catId: string = 'overall', currentAmt?: number) => {
    setSelectedCatId(catId);
    setAmountInput(currentAmt ? String(currentAmt) : catId === 'overall' ? String(overallLimit) : '5000');
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amountInput);
    if (!amountInput || isNaN(val) || val <= 0) {
      setError('Please enter a valid budget amount.');
      return;
    }

    if (selectedCatId === 'overall') {
      await setBudget({
        category_id: null,
        amount: val,
        month: selectedMonth,
      });
    } else {
      const cat = categories.find((c) => c.id === selectedCatId);
      await setBudget({
        category_id: selectedCatId,
        category_name: cat?.name || '',
        amount: val,
        month: selectedMonth,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Overall Budget Card */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-950 text-white rounded-3xl p-5 shadow-xl border border-brand-500/20 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-brand-300">
              <Target size={20} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-200">
                Overall Monthly Limit
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {formatINR(overallLimit)}
              </h3>
            </div>
          </div>

          <button
            onClick={() => handleOpenModal('overall', overallLimit)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/10 transition-colors"
          >
            <Edit2 size={13} />
            <span>Edit Limit</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-brand-100">
              Spent: {formatINR(totalSpent)}
            </span>
            <span
              className={
                overallUsage > 100
                  ? 'text-rose-300 font-bold'
                  : overallUsage > 80
                  ? 'text-amber-300 font-bold'
                  : 'text-emerald-300 font-bold'
              }
            >
              {overallUsage}% Used
            </span>
          </div>

          <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallUsage > 100
                  ? 'bg-rose-500'
                  : overallUsage > 80
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, overallUsage)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-brand-200 mt-3 pt-2.5 border-t border-white/10">
          <span>Remaining: {formatINR(Math.max(0, overallLimit - totalSpent))}</span>
          <span>{overallUsage > 100 ? 'Exceeded Budget' : 'Safe Zone'}</span>
        </div>
      </div>

      {/* Category Budgets Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Category Budgets
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Track category limits & avoid overspending
          </p>
        </div>

        <button
          onClick={() => handleOpenModal('', 5000)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/30 transition-all"
        >
          <Plus size={14} />
          <span>Set Category Budget</span>
        </button>
      </div>

      {/* Category Budgets List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categoryBudgets.map((cat) => {
          const hasBudget = Boolean(cat.budgetAmount && cat.budgetAmount > 0);
          const pct = Math.round(cat.percentage);
          const isWarning = pct >= 80 && pct < 100;
          const isOver = pct >= 100;

          return (
            <div
              key={cat.id}
              className="bg-white dark:bg-[#1a1825] rounded-2xl p-4 border border-gray-100 dark:border-white/5 shadow-navi-card transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    <CategoryIcon iconName={cat.icon} size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      {cat.name}
                    </h4>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      Spent: {formatINR(cat.spentAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {hasBudget ? (
                    <button
                      onClick={() => handleOpenModal(cat.id, cat.budgetAmount)}
                      className="p-1.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Edit Category Budget"
                    >
                      <Edit2 size={13} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenModal(cat.id, 5000)}
                      className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline px-1 py-0.5"
                    >
                      Set Limit
                    </button>
                  )}
                </div>
              </div>

              {hasBudget ? (
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                    <span className="text-gray-500 dark:text-gray-400">
                      Limit: {formatINR(cat.budgetAmount!)}
                    </span>
                    <span
                      className={`font-bold ${
                        isOver
                          ? 'text-rose-600 dark:text-rose-400'
                          : isWarning
                          ? 'text-amber-500'
                          : 'text-brand-600 dark:text-brand-400'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-brand-600'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  {isOver && (
                    <div className="flex items-center gap-1 text-[10.5px] font-semibold text-rose-500 mt-1.5">
                      <AlertTriangle size={12} />
                      <span>Exceeded by {formatINR(cat.spentAmount - cat.budgetAmount!)}</span>
                    </div>
                  )}
                  {isWarning && (
                    <div className="flex items-center gap-1 text-[10.5px] font-semibold text-amber-500 mt-1.5">
                      <AlertTriangle size={12} />
                      <span>Approaching monthly limit</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[11px] text-gray-400 italic pt-1">
                  No specific monthly budget set.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Set / Edit Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCatId === 'overall' ? 'Set Total Monthly Budget' : 'Set Category Budget'}
        maxWidth="sm"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Select Target
            </label>
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="overall">Overall Total Monthly Budget</option>
              {categories
                .filter((c) => c.type === 'expense')
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Budget Amount (INR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
                ₹
              </span>
              <input
                type="number"
                min="100"
                step="100"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="5000"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-base font-extrabold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs font-semibold text-rose-500 text-center">{error}</div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/30"
            >
              Save Budget
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

