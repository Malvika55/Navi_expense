import React from 'react';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
import { TransactionType, PaymentMethod } from '../../types';
import { useExpenses } from '../../context/ExpenseContext';

export interface FilterState {
  searchQuery: string;
  typeFilter: 'all' | TransactionType;
  categoryFilter: string; // 'all' or category_id
  paymentMethodFilter: string; // 'all' or PaymentMethod
  sortBy: 'newest' | 'oldest' | 'highest' | 'lowest';
  dateRange: 'all' | 'this-month' | 'last-7-days' | 'last-30-days';
}

interface TransactionFilterBarProps {
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export const TransactionFilterBar: React.FC<TransactionFilterBarProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  totalFilteredCount,
}) => {
  const { categories } = useExpenses();

  const isFiltered =
    filters.searchQuery !== '' ||
    filters.typeFilter !== 'all' ||
    filters.categoryFilter !== 'all' ||
    filters.paymentMethodFilter !== 'all' ||
    filters.dateRange !== 'this-month' ||
    filters.sortBy !== 'newest';

  const paymentMethods: PaymentMethod[] = [
    'UPI',
    'Bank Transfer',
    'Debit Card',
    'Credit Card',
    'Cash',
    'Net Banking',
    'Other',
  ];

  return (
    <div className="bg-white dark:bg-[#1a1825] rounded-3xl p-4 border border-gray-100 dark:border-white/5 shadow-navi-card mb-5 space-y-3 transition-all">
      {/* Search Input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
          placeholder="Search by merchant, note, or reference ID..."
          className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onChangeFilters({ ...filters, searchQuery: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Type Filter Pills & Clear */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-0.5 no-scrollbar">
        <div className="flex items-center gap-1.5">
          {(['all', 'expense', 'income'] as const).map((type) => {
            const isActive = filters.typeFilter === type;
            const labels = { all: 'All', expense: 'Expenses', income: 'Income' };
            return (
              <button
                key={type}
                onClick={() => onChangeFilters({ ...filters, typeFilter: type })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700'
                }`}
              >
                {labels[type]}
              </button>
            );
          })}
        </div>

        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
          >
            <X size={13} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Dropdown Filters row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {/* Category Filter */}
        <div className="relative">
          <select
            value={filters.categoryFilter}
            onChange={(e) => onChangeFilters({ ...filters, categoryFilter: e.target.value })}
            className="w-full text-xs font-medium py-2 px-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500 appearance-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Filter
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Payment Method Filter */}
        <div className="relative">
          <select
            value={filters.paymentMethodFilter}
            onChange={(e) =>
              onChangeFilters({ ...filters, paymentMethodFilter: e.target.value })
            }
            className="w-full text-xs font-medium py-2 px-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500 appearance-none"
          >
            <option value="all">All Payment Modes</option>
            {paymentMethods.map((pm) => (
              <option key={pm} value={pm}>
                {pm}
              </option>
            ))}
          </select>
          <Filter
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Date Range Filter */}
        <div className="relative">
          <select
            value={filters.dateRange}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dateRange: e.target.value as any,
              })
            }
            className="w-full text-xs font-medium py-2 px-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500 appearance-none"
          >
            <option value="this-month">This Month</option>
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="all">All Time History</option>
          </select>
          <Filter
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Sort By Filter */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sortBy: e.target.value as any,
              })
            }
            className="w-full text-xs font-medium py-2 px-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500 appearance-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
          <ArrowUpDown
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Results Count Footer */}
      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-800/60 font-medium">
        <span>Showing {totalFilteredCount} matching transactions</span>
        <span>Manual Tracking Mode</span>
      </div>
    </div>
  );
};

