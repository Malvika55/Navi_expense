import React, { useState } from 'react';
import {
  User,
  Shield,
  Cloud,
  CloudOff,
  Download,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  Moon,
  Sun,
  Check,
  Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useExpenses } from '../../context/ExpenseContext';
import { useTheme } from '../../context/ThemeContext';
import { exportTransactionsToCSV, exportMonthlyReportSummary } from '../../lib/exportUtils';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface SettingsViewProps {
  onOpenAuth: () => void;
  onOpenConfig: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenAuth, onOpenConfig }) => {
  const { user, profile, updateProfile, isConfigured } = useAuth();
  const { transactions, currentMonthSummary, selectedMonth, resetToSampleData } = useExpenses();
  const { theme, toggleTheme } = useTheme();

  // Profile Form
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [upiId, setUpiId] = useState(profile?.upi_id || '');
  const [phone, setPhone] = useState(profile?.phone_number || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      full_name: fullName.trim(),
      upi_id: upiId.trim(),
      phone_number: phone.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportCSV = () => {
    exportTransactionsToCSV(transactions);
  };

  const handleExportReport = () => {
    exportMonthlyReportSummary(currentMonthSummary, transactions, selectedMonth);
  };

  const handleResetConfirm = () => {
    resetToSampleData();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Settings & Profile
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Account identity, cloud storage & export preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-[#1a1825] rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-navi-card transition-all">
        <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/30"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-extrabold text-xl flex items-center justify-center">
                {fullName ? fullName.charAt(0).toUpperCase() : <User size={24} />}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#1a1825]" />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
              {profile?.full_name || 'Personal Account'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user ? user.email : 'Local Demo User (Offline)'}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
                {profile?.upi_id || 'user@oknavi'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSaveProfile} className="space-y-3.5 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                UPI ID Handle
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="name@okaxis"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check size={14} /> Profile Saved
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/30 transition-all"
            >
              <Save size={13} />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Cloud Storage & Supabase Sync Card */}
      <div className="bg-white dark:bg-[#1a1825] rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-navi-card transition-all">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                user
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400'
              }`}
            >
              {user ? <Cloud size={20} /> : <CloudOff size={20} />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Supabase PostgreSQL Cloud Database
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user
                  ? `Logged in as ${user.email} (RLS Active)`
                  : isConfigured
                  ? 'Supabase configured - Sign In to sync'
                  : 'Running locally with offline fallback'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenConfig}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Configure
            </button>
            <button
              onClick={onOpenAuth}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                user
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400'
                  : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-500/30'
              }`}
            >
              {user ? 'Account' : 'Sign In'}
            </button>
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
          <strong>Security Note:</strong> All transactions are protected by PostgreSQL Row
          Level Security (RLS) policies. Only your authenticated user ID can read or mutate
          your financial records.
        </div>
      </div>

      {/* Export & Data Management */}
      <div className="bg-white dark:bg-[#1a1825] rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-navi-card transition-all">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
          Export Financial Reports
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Download and backup your expense history for taxes or spreadsheets
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 dark:border-gray-700/80 hover:border-brand-500/50 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  Export to CSV
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Spreadsheet format ({transactions.length} rows)
                </p>
              </div>
            </div>
            <Download size={16} className="text-gray-400 group-hover:text-brand-600" />
          </button>

          <button
            onClick={handleExportReport}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 dark:border-gray-700/80 hover:border-brand-500/50 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  Monthly Summary Report
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Formatted summary for {selectedMonth}
                </p>
              </div>
            </div>
            <Download size={16} className="text-gray-400 group-hover:text-brand-600" />
          </button>
        </div>
      </div>

      {/* Preferences & Reset */}
      <div className="bg-white dark:bg-[#1a1825] rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-navi-card transition-all">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          App Preferences & Data Reset
        </h3>

        <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
          {/* Dark Mode */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Dark Theme</p>
                <p className="text-[11px] text-gray-400">
                  {theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                theme === 'dark' ? 'bg-brand-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reset to Sample Data */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2.5">
              <RotateCcw size={16} className="text-amber-500" />
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Restore Sample Data</p>
                <p className="text-[11px] text-gray-400">
                  Reload 15 realistic Navi UPI transactions & budgets
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400 font-bold hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* About & Disclaimer */}
      <div className="p-4 rounded-3xl bg-gray-100/70 dark:bg-gray-800/40 border border-gray-200/50 dark:border-white/5 text-[11px] text-gray-500 dark:text-gray-400 space-y-1 text-center">
        <p className="font-bold text-gray-700 dark:text-gray-300">
          Navi Plus Personal Expense Tracker & Money Manager v1.0.0
        </p>
        <p>
          Inspired by the modern, minimalist user experience of the Navi UPI app. Built
          strictly for personal financial budgeting and manual transaction bookkeeping.
        </p>
        <p className="text-[10px] text-gray-400 pt-1">
          Designed with React, TypeScript, Tailwind CSS, Recharts & Supabase.
        </p>
      </div>

      {/* Reset Confirmation */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetConfirm}
        title="Reset to Sample Dataset"
        message="This will reset your transactions and budgets to the realistic Navi sample dataset. Any manual changes made in this session will be replaced."
        confirmText="Reset Data"
        isDestructive={false}
      />
    </div>
  );
};
