import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, LogIn, UserPlus, LogOut, ShieldCheck, Sparkles, Settings } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConfig: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onOpenConfig }) => {
  const { user, profile, isConfigured, isDemoMode, signInWithEmail, signUpWithEmail, signOut } =
    useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);

    if (mode === 'signin') {
      const { error: err } = await signInWithEmail(email.trim(), password);
      if (err) {
        setError(err.message);
      } else {
        setSuccess('Signed in successfully!');
        setTimeout(onClose, 800);
      }
    } else {
      if (!fullName.trim()) {
        setError('Please provide your full name.');
        setLoading(false);
        return;
      }
      const { error: err } = await signUpWithEmail(email.trim(), password, fullName.trim());
      if (err) {
        setError(err.message);
      } else {
        setSuccess('Account created successfully! You are now logged in.');
        setTimeout(onClose, 800);
      }
    }

    setLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Account & Cloud Storage' : mode === 'signin' ? 'Sign In to NaviPulse' : 'Create Account'}
      subtitle="Supabase PostgreSQL Auth with Row Level Security"
      maxWidth="sm"
    >
      {user ? (
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center ring-4 ring-emerald-50 dark:ring-emerald-950/30">
            <ShieldCheck size={32} />
          </div>

          <div>
            <h4 className="text-base font-extrabold text-gray-900 dark:text-white">
              {profile?.full_name || 'Active User'}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cloud Synced (PostgreSQL RLS Active)</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-xs mx-auto">
            Your expense tracking data is synced automatically to Supabase. You can log in on
            any device to view and manage your financial records.
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm shadow-brand-500/30 transition-all"
            >
              Continue Tracking
            </button>
            <button
              onClick={() => {
                signOut();
                onClose();
              }}
              className="w-full py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isConfigured && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start justify-between gap-2">
              <div>
                <p className="font-bold">Currently in Demo Mode</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                  Transactions persist locally. To enable multi-device sync, connect your Supabase project.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenConfig();
                }}
                className="shrink-0 text-[11px] font-extrabold text-brand-600 dark:text-brand-400 hover:underline pt-0.5"
              >
                Configure
              </button>
            </div>
          )}

          {/* Tab: Sign In vs Sign Up */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError('');
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-white dark:bg-[#1a1825] text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-[#1a1825] text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Malvika Sharma"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="p-2.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-center">
              {success}
            </div>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 hover:from-brand-800 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              {loading ? (
                <span>Processing...</span>
              ) : mode === 'signin' ? (
                <>
                  <LogIn size={15} />
                  <span>Sign In</span>
                </>
              ) : (
                <>
                  <UserPlus size={15} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenConfig();
              }}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
            >
              <Settings size={12} />
              <span>Set Custom Supabase Cloud Keys</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

