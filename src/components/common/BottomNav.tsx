import React from 'react';
import { Home, ReceiptText, PieChart, Settings, Plus } from 'lucide-react';

export type NavTab = 'home' | 'transactions' | 'money-manager' | 'settings';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAddModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddModal,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#151320]/95 backdrop-blur-lg border-t border-gray-100 dark:border-white/5 py-1.5 px-2 sm:px-3 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Tab 1: Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
            currentTab === 'home'
              ? 'text-brand-600 dark:text-brand-400 font-bold scale-105'
              : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 font-medium'
          }`}
        >
          <div className="relative">
            <Home size={21} strokeWidth={currentTab === 'home' ? 2.4 : 1.8} />
            {currentTab === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-600 dark:bg-brand-400 rounded-full" />
            )}
          </div>
          <span className="text-[11px] mt-1">Home</span>
        </button>

        {/* Tab 2: Transactions */}
        <button
          onClick={() => onSelectTab('transactions')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
            currentTab === 'transactions'
              ? 'text-brand-600 dark:text-brand-400 font-bold scale-105'
              : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 font-medium'
          }`}
        >
          <div className="relative">
            <ReceiptText size={21} strokeWidth={currentTab === 'transactions' ? 2.4 : 1.8} />
            {currentTab === 'transactions' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-600 dark:bg-brand-400 rounded-full" />
            )}
          </div>
          <span className="text-[11px] mt-1">Transactions</span>
        </button>

        {/* Center: Floating Add Button */}
        <div className="-mt-6">
          <button
            onClick={onOpenAddModal}
            aria-label="Add Transaction"
            className="w-13 h-13 p-3 rounded-full bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 text-white shadow-lg shadow-brand-500/35 hover:shadow-brand-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center ring-4 ring-[#f7f7fa] dark:ring-[#100e18]"
          >
            <Plus size={26} strokeWidth={2.8} />
          </button>
        </div>

        {/* Tab 3: Money Manager */}
        <button
          onClick={() => onSelectTab('money-manager')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
            currentTab === 'money-manager'
              ? 'text-brand-600 dark:text-brand-400 font-bold scale-105'
              : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 font-medium'
          }`}
        >
          <div className="relative">
            <PieChart size={21} strokeWidth={currentTab === 'money-manager' ? 2.4 : 1.8} />
            {currentTab === 'money-manager' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-600 dark:bg-brand-400 rounded-full" />
            )}
          </div>
          <span className="text-[11px] mt-1">Manager</span>
        </button>

        {/* Tab 4: Settings / Profile */}
        <button
          onClick={() => onSelectTab('settings')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
            currentTab === 'settings'
              ? 'text-brand-600 dark:text-brand-400 font-bold scale-105'
              : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 font-medium'
          }`}
        >
          <div className="relative">
            <Settings size={21} strokeWidth={currentTab === 'settings' ? 2.4 : 1.8} />
            {currentTab === 'settings' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-600 dark:bg-brand-400 rounded-full" />
            )}
          </div>
          <span className="text-[11px] mt-1">Settings</span>
        </button>
      </div>
    </nav>
  );
};
