import React, { useState } from 'react';
import { Eye, EyeOff, ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useExpenses } from '../../context/ExpenseContext';
import { formatINR } from '../../lib/formatters';

export const BalanceCard: React.FC = () => {
  const { profile } = useAuth();
  const { currentMonthSummary } = useExpenses();
  const [showBalance, setShowBalance] = useState(true);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const netBalance = currentMonthSummary.totalIncome - currentMonthSummary.totalExpense;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-800 text-white shadow-xl shadow-brand-600/20 p-5 sm:p-6 transition-all">
      {/* Decorative SVG background elements */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top row: Greeting & Show/Hide Eye toggle */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-brand-100/80 text-xs font-medium tracking-wide uppercase">
            {getGreeting()}
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-0.5">
            {profile?.full_name || 'Friend'}
          </h2>
        </div>

        <button
          onClick={() => setShowBalance(!showBalance)}
          aria-label={showBalance ? 'Hide Balance' : 'Show Balance'}
          className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/90 transition-all border border-white/10"
        >
          {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>

      {/* Center: Total Net Balance */}
      <div className="relative z-10 my-4 sm:my-5">
        <div className="flex items-center gap-1.5 text-xs text-brand-100/90 font-medium">
          <Wallet size={14} className="text-brand-200" />
          <span>Current Month Net Balance</span>
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
          {showBalance ? formatINR(netBalance, true) : '₹ ••••••••'}
        </div>
      </div>

      {/* Bottom row: Inflow vs Outflow cards */}
      <div className="relative z-10 grid grid-cols-2 gap-2.5 pt-3 border-t border-white/15">
        {/* Total Income */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-300">
            <ArrowUpRight size={13} className="text-emerald-300" />
            <span>Monthly Income</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white mt-0.5">
            {showBalance ? formatINR(currentMonthSummary.totalIncome) : '••••'}
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-1 text-[11px] font-medium text-rose-200">
            <ArrowDownRight size={13} className="text-rose-200" />
            <span>Monthly Spending</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white mt-0.5">
            {showBalance ? formatINR(currentMonthSummary.totalExpense) : '••••'}
          </div>
        </div>
      </div>
    </div>
  );
};

