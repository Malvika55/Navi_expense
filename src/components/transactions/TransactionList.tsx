import React, { useState, useMemo } from 'react';
import { ReceiptText, Plus, Download, Sparkles } from 'lucide-react';
import { Transaction } from '../../types';
import { useExpenses } from '../../context/ExpenseContext';
import { TransactionFilterBar, FilterState } from './TransactionFilterBar';
import { TransactionGroup } from './TransactionGroup';
import { TransactionDetailsModal } from './TransactionDetailsModal';
import { AddEditTransactionModal } from './AddEditTransactionModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { exportTransactionsToCSV } from '../../lib/exportUtils';

interface TransactionListProps {
  onOpenAddModal: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ onOpenAddModal }) => {
  const { transactions, deleteTransaction, selectedMonth } = useExpenses();

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    typeFilter: 'all',
    categoryFilter: 'all',
    paymentMethodFilter: 'all',
    sortBy: 'newest',
    dateRange: 'this-month',
  });

  // Modal states
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [txToEdit, setTxToEdit] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      typeFilter: 'all',
      categoryFilter: 'all',
      paymentMethodFilter: 'all',
      sortBy: 'newest',
      dateRange: 'this-month',
    });
  };

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(query);
        const matchesCat = (tx.category_name || '').toLowerCase().includes(query);
        const matchesNotes = (tx.notes || '').toLowerCase().includes(query);
        const matchesRef = (tx.reference_id || '').toLowerCase().includes(query);
        const matchesBank = (tx.bank_name || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesCat && !matchesNotes && !matchesRef && !matchesBank) {
          return false;
        }
      }

      // 2. Type Filter
      if (filters.typeFilter !== 'all' && tx.type !== filters.typeFilter) {
        return false;
      }

      // 3. Category Filter
      if (filters.categoryFilter !== 'all' && tx.category_id !== filters.categoryFilter) {
        return false;
      }

      // 4. Payment Method Filter
      if (
        filters.paymentMethodFilter !== 'all' &&
        tx.payment_method !== filters.paymentMethodFilter
      ) {
        return false;
      }

      // 5. Date Range Filter
      if (filters.dateRange === 'this-month') {
        if (!tx.date.startsWith(selectedMonth)) return false;
      } else if (filters.dateRange === 'last-7-days') {
        const txDate = new Date(tx.date).getTime();
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (txDate < sevenDaysAgo) return false;
      } else if (filters.dateRange === 'last-30-days') {
        const txDate = new Date(tx.date).getTime();
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        if (txDate < thirtyDaysAgo) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime();
      }
      if (filters.sortBy === 'oldest') {
        return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
      }
      if (filters.sortBy === 'highest') {
        return b.amount - a.amount;
      }
      if (filters.sortBy === 'lowest') {
        return a.amount - b.amount;
      }
      return 0;
    });
  }, [transactions, filters, selectedMonth]);

  // Group by Date: "YYYY-MM-DD"
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach((tx) => {
      if (!groups[tx.date]) {
        groups[tx.date] = [];
      }
      groups[tx.date].push(tx);
    });
    return groups;
  }, [filteredTransactions]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedTransactions).sort((a, b) => {
      if (filters.sortBy === 'oldest') {
        return new Date(a).getTime() - new Date(b).getTime();
      }
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }, [groupedTransactions, filters.sortBy]);

  const handleEditClick = (tx: Transaction) => {
    setSelectedTx(null);
    setTxToEdit(tx);
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      await deleteTransaction(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar with Export action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Transaction History
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Navi-inspired UPI passbook & personal logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportTransactionsToCSV(filteredTransactions)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1825] border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
            title="Export filtered transactions to CSV"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/30 transition-all"
          >
            <Plus size={15} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <TransactionFilterBar
        filters={filters}
        onChangeFilters={setFilters}
        onResetFilters={handleResetFilters}
        totalFilteredCount={filteredTransactions.length}
      />

      {/* Transactions List */}
      {sortedDates.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1825] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-navi-card text-center my-6">
          <div className="w-14 h-14 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-3">
            <ReceiptText size={26} />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            No transactions found
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-1 mb-5">
            {transactions.length === 0
              ? 'You have not added any transactions yet. Record your first payment or income!'
              : 'No transactions match the selected filters or search keyword.'}
          </p>
          <div className="flex items-center justify-center gap-2">
            {transactions.length > 0 && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/30 transition-all flex items-center gap-1.5"
            >
              <Sparkles size={14} />
              <span>Record New Transaction</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDates.map((dateKey) => (
            <TransactionGroup
              key={dateKey}
              date={dateKey}
              transactions={groupedTransactions[dateKey]}
              onSelectTransaction={(tx) => setSelectedTx(tx)}
            />
          ))}
        </div>
      )}

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTx}
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        onEdit={handleEditClick}
        onDelete={(id) => setDeleteConfirmId(id)}
      />

      {/* Add / Edit Transaction Modal */}
      <AddEditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setTxToEdit(null);
        }}
        transactionToEdit={txToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction record? This will update your balances and budget metrics."
        confirmText="Yes, Delete"
        cancelText="Keep"
        isDestructive={true}
      />
    </div>
  );
};

