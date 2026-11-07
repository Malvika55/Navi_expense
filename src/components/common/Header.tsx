import React from 'react';
import {
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Cloud,
  CloudOff,
  User as UserIcon,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useExpenses } from '../../context/ExpenseContext';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenAuth }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, isDemoMode, isConfigured } = useAuth();
  const { selectedMonth, setSelectedMonth } = useExpenses();

  // Month navigation helpers
  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1);
    setSelectedMonth(
      `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`
    );
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const nextDate = new Date(year, month, 1);
    setSelectedMonth(
      `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`
    );
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#13111c]/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-5xl mx-auto w-full flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center shadow-md shadow-brand-500/25">
            <span className="text-white font-extrabold text-lg tracking-tighter">N</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-navi-green rounded-full ring-2 ring-white dark:ring-[#13111c]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-gray-900 dark:text-white">
                Navi<span className="text-brand-600 dark:text-brand-400"> Plus</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
                PRO
              </span>
            </div>
            <p className="text-[10.5px] text-gray-500 dark:text-gray-400 font-medium -mt-0.5 hidden xs:block">
              Personal Expense Tracker
            </p>
          </div>
        </div>

        {/* Center: Month Selector */}
        <div className="order-3 sm:order-none relative flex items-center bg-gray-100/80 dark:bg-gray-800/80 rounded-full p-0.5 border border-gray-200/60 dark:border-gray-700/60 text-xs w-full sm:w-auto justify-center">
          <button
            onClick={handlePrevMonth}
            aria-label="Previous Month"
            className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>

          <label className="flex items-center gap-1.5 px-2.5 py-1 font-semibold text-gray-800 dark:text-gray-100 hover:text-brand-600 transition-colors cursor-pointer">
            <Calendar size={13} className="text-brand-600 dark:text-brand-400" />
            <span className="sr-only">Select month</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              aria-label="Select month to view"
              className="bg-transparent border-0 p-0 text-xs font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-0 cursor-pointer"
            />
          </label>

          <button
            onClick={handleNextMonth}
            aria-label="Next Month"
            className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight size={15} />
          </button>

        </div>

        {/* Right Action Icons: Cloud status, Dark Mode, Profile */}
        <div className="flex items-center gap-1.5">
          {/* Cloud sync indicator */}
          <button
            onClick={onOpenAuth}
            title={
              user
                ? `Connected to Supabase (${user.email})`
                : isConfigured
                ? 'Supabase configured - click to Sign In'
                : 'Demo / Local Mode - Click to connect Supabase'
            }
            className={`p-2 rounded-full transition-colors text-xs flex items-center gap-1 ${
              user
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {user ? <Cloud size={16} /> : <CloudOff size={16} />}
            <span className="hidden md:inline font-semibold text-[11px]">
              {user ? 'Cloud Sync' : 'Demo'}
            </span>
          </button>

          {/* Dark mode button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* User Profile Avatar / Settings */}
          <button
            onClick={onOpenSettings}
            className="relative flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-brand-500/30 transition-all"
            aria-label="Open Settings and Profile"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'Profile'}
                className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center border border-brand-200 dark:border-brand-800">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <UserIcon size={15} />}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
