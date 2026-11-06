import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User as UserIcon,
  LogIn,
  UserPlus,
  ShieldCheck,
  Settings,
  Sparkles,
  ArrowRight,
  Database,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AuthScreenProps {
  onOpenConfig: () => void;
  onContinueAsGuest?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onOpenConfig, onContinueAsGuest }) => {
  const { signInWithEmail, signUpWithEmail, isConfigured } = useAuth();
  const { success, error: toastError } = useToast();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isConfigured) {
      setErrorMsg('Please configure your Supabase URL and Anon Key first by tapping "Configure Supabase".');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    setLoading(true);

    if (mode === 'signin') {
      const { error } = await signInWithEmail(email.trim(), password);
      if (error) {
        setErrorMsg(error.message);
        toastError('Sign in failed', error.message);
      } else {
        success('Welcome back!', 'Signed in successfully with your Supabase account.');
      }
    } else {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        setLoading(false);
        return;
      }
      const { error } = await signUpWithEmail(email.trim(), password, fullName.trim());
      if (error) {
        setErrorMsg(error.message);
        toastError('Registration failed', error.message);
      } else {
        success('Account created!', 'You are now logged in with your private database.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f7fa] dark:bg-[#100e18] flex flex-col justify-center items-center p-4 selection:bg-brand-600 selection:text-white">
      <div className="w-full max-w-md bg-white dark:bg-[#1a1825] rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-white/5 transition-all">
        {/* Brand Icon & Welcome */}
        <div className="text-center mb-6">
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 mx-auto flex items-center justify-center shadow-lg shadow-brand-500/30 mb-3">
            <span className="text-white font-extrabold text-2xl tracking-tighter">N</span>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-navi-green rounded-full ring-2 ring-white dark:ring-[#1a1825]" />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Navi<span className="text-brand-600 dark:text-brand-400">Pulse</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Personal Expense Tracker & UPI Money Manager
          </p>
        </div>

        {/* Supabase Connection Alert */}
        {!isConfigured ? (
          <div className="mb-5 p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/50 text-xs">
            <div className="flex items-start gap-2.5">
              <Database size={16} className="text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white">Connect Supabase Cloud</p>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">
                  To sign in with your real personal database, enter your Supabase Project URL and
                  Anon Key.
                </p>
                <button
                  type="button"
                  onClick={onOpenConfig}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <Settings size={13} />
                  <span>Configure Supabase Keys</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
              <ShieldCheck size={15} />
              <span>Supabase Cloud Connected</span>
            </div>
            <button
              onClick={onOpenConfig}
              className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Change
            </button>
          </div>
        )}

        {/* Segmented Tab: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl transition-all ${
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
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-[#1a1825] text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400 text-center">
              {errorMsg}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 hover:from-brand-800 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : mode === 'signin' ? (
                <>
                  <LogIn size={15} />
                  <span>Sign In with Supabase</span>
                </>
              ) : (
                <>
                  <UserPlus size={15} />
                  <span>Create Account & Start Fresh</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Guest / Demo Option if desired */}
        {onContinueAsGuest && (
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-xs font-semibold text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1"
            >
              <span>Explore Demo Passbook First</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

