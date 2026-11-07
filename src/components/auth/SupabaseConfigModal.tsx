import React, { useState } from 'react';
import { Database, Key, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import {
  getStoredSupabaseCredentials,
  saveStoredSupabaseCredentials,
  SUPABASE_SQL_SCHEMA,
} from '../../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const currentCreds = getStoredSupabaseCredentials();
  const [url, setUrl] = useState(currentCreds.url);
  const [anonKey, setAnonKey] = useState(currentCreds.anonKey);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSupabaseCredentials(url, anonKey);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onSaved();
      onClose();
    }, 1000);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supabase Cloud Configuration"
      subtitle="Connect persistent PostgreSQL cloud database with RLS"
      maxWidth="md"
    >
      <form onSubmit={handleSave} className="space-y-4">
        <div className="p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/50 text-xs text-brand-900 dark:text-brand-200 flex items-start gap-2.5">
          <ShieldCheck size={18} className="text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            Navi Plus uses <strong>Supabase Row Level Security (RLS)</strong>. Your
            transactions, categories, and budgets are securely partitioned so only your
            authenticated account can access your data.
          </div>
        </div>

        {/* Project URL */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            Supabase Project URL
          </label>
          <div className="relative">
            <Database size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Anon Key */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            Supabase Anon Public API Key
          </label>
          <div className="relative">
            <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Schema SQL Helper */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Database Tables & RLS Migration
            </span>
            <button
              type="button"
              onClick={handleCopySchema}
              className="flex items-center gap-1 text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              {copiedSchema ? (
                <>
                  <Check size={12} className="text-emerald-500" />
                  <span>Copied SQL</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy SQL Schema</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
            Copy the SQL schema script and run it in your Supabase SQL Editor. It creates the
            tables (transactions, categories, budgets, profiles) with Row Level Security.
          </p>
        </div>

        {successMsg && (
          <div className="p-2 text-xs font-bold text-center text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl">
            Credentials saved successfully!
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/30"
          >
            Save Credentials
          </button>
        </div>
      </form>
    </Modal>
  );
};
