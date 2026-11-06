import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { HomeView } from './components/home/HomeView';
import { TransactionList } from './components/transactions/TransactionList';
import { MoneyManagerDashboard } from './components/moneyManager/MoneyManagerDashboard';
import { SettingsView } from './components/settings/SettingsView';
import { AddEditTransactionModal } from './components/transactions/AddEditTransactionModal';
import { AuthModal } from './components/auth/AuthModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { SupabaseConfigModal } from './components/auth/SupabaseConfigModal';
import { PrintableStatementModal } from './components/common/PrintableStatementModal';
import { TransactionType } from './types';
import { useAuth } from './context/AuthContext';
import { Smartphone, Monitor } from 'lucide-react';

export const App: React.FC = () => {
  const { user, isConfigured } = useAuth();

  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<TransactionType>('expense');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);

  // Allow guest exploration only if explicitly chosen
  const [guestModeActive, setGuestModeActive] = useState(false);

  // Desktop view toggle: Phone Mockup Frame vs Wide Dashboard View
  const [usePhoneFrame, setUsePhoneFrame] = useState(false);

  const handleOpenAddModalWithType = (type: TransactionType) => {
    setAddModalType(type);
    setIsAddModalOpen(true);
  };

  // If user is not logged in and not explicitly exploring as guest, show the clean Auth Gateway
  if (!user && !guestModeActive) {
    return (
      <>
        <AuthScreen
          onOpenConfig={() => setIsConfigModalOpen(true)}
          onContinueAsGuest={() => setGuestModeActive(true)}
        />
        <SupabaseConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          onSaved={() => {}}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7fa] dark:bg-[#100e18] flex flex-col items-center justify-start text-[#12111a] dark:text-[#f3f0ff] transition-colors">
      {/* Desktop Device Frame Switcher Banner (visible on wide screens) */}
      <div className="hidden lg:flex w-full items-center justify-end px-6 py-1.5 bg-gray-200/60 dark:bg-[#161424] text-[11px] font-medium text-gray-600 dark:text-gray-400 gap-3 border-b border-gray-300/40 dark:border-white/5">
        <span>Desktop Display Mode:</span>
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 p-0.5 rounded-lg border border-gray-300/60 dark:border-gray-700">
          <button
            onClick={() => setUsePhoneFrame(false)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold transition-all ${
              !usePhoneFrame
                ? 'bg-brand-600 text-white shadow-2xs'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Monitor size={12} />
            <span>Responsive Layout</span>
          </button>
          <button
            onClick={() => setUsePhoneFrame(true)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold transition-all ${
              usePhoneFrame
                ? 'bg-brand-600 text-white shadow-2xs'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Smartphone size={12} />
            <span>Navi Mobile Frame</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          usePhoneFrame
            ? 'max-w-[420px] my-4 rounded-[42px] overflow-hidden shadow-2xl ring-8 ring-gray-900/10 dark:ring-white/10 bg-white dark:bg-[#13111c] border border-gray-200 dark:border-white/10 min-h-[840px] flex flex-col relative'
            : 'max-w-5xl min-h-screen flex flex-col relative'
        }`}
      >
        {/* Top Header */}
        <Header
          onOpenSettings={() => setCurrentTab('settings')}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-5 pb-24 overflow-y-auto">
          {currentTab === 'home' && (
            <HomeView
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenAddModalWithType={handleOpenAddModalWithType}
            />
          )}

          {currentTab === 'transactions' && (
            <TransactionList
              onOpenAddModal={() => {
                setAddModalType('expense');
                setIsAddModalOpen(true);
              }}
            />
          )}

          {currentTab === 'money-manager' && <MoneyManagerDashboard />}

          {currentTab === 'settings' && (
            <SettingsView
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onOpenConfig={() => setIsConfigModalOpen(true)}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onOpenAddModal={() => {
            setAddModalType('expense');
            setIsAddModalOpen(true);
          }}
        />
      </div>

      {/* Add / Edit Transaction Global Modal */}
      <AddEditTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType={addModalType}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onOpenConfig={() => setIsConfigModalOpen(true)}
      />

      {/* Supabase Config Modal */}
      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSaved={() => {}}
      />

      {/* Monthly Printable Statement Modal */}
      <PrintableStatementModal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
      />
    </div>
  );
};
export default App;
