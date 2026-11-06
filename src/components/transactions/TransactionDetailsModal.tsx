import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Edit3,
  Trash2,
  Share2,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Tag,
} from 'lucide-react';
import { Transaction } from '../../types';
import { Modal } from '../common/Modal';
import { formatINR, formatTime12h, formatGroupDate } from '../../lib/formatters';
import { useExpenses } from '../../context/ExpenseContext';
import { CategoryIcon } from '../common/CategoryIcon';

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { categories } = useExpenses();
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!transaction) return null;

  const isIncome = transaction.type === 'income';
  const category = categories.find((c) => c.id === transaction.category_id);

  const handleCopyRef = () => {
    if (transaction.reference_id) {
      navigator.clipboard.writeText(transaction.reference_id);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleShareReceipt = () => {
    const text = `NaviPulse UPI Receipt\n${isIncome ? 'Received from' : 'Paid to'}: ${transaction.title}\nAmount: ${formatINR(transaction.amount, true)}\nDate: ${transaction.date} ${transaction.time}\nRef: ${transaction.reference_id || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details" maxWidth="md">
      <div className="flex flex-col items-center">
        {/* Navi-style Success Tick & Amount Header */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-navi-green flex items-center justify-center mb-3 ring-8 ring-emerald-50 dark:ring-emerald-950/20">
          <CheckCircle2 size={36} strokeWidth={2.4} />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Transaction Successful
        </span>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1 mb-0.5">
          {isIncome ? `+ ${formatINR(transaction.amount, true)}` : `- ${formatINR(transaction.amount, true)}`}
        </h3>

        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
          {isIncome ? 'Received from' : 'Paid to'}{' '}
          <strong className="text-gray-900 dark:text-white font-bold">{transaction.title}</strong>
        </p>

        {/* Receipt Details Card */}
        <div className="w-full bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 my-5 border border-gray-100 dark:border-gray-700/60 space-y-3.5 text-xs">
          {/* Reference ID with copy */}
          <div className="flex items-center justify-between py-1 border-b border-gray-200/60 dark:border-gray-700/60">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium">
              <span>UPI Ref ID</span>
            </span>
            <div className="flex items-center gap-1.5 font-mono font-semibold text-gray-800 dark:text-gray-200">
              <span>{transaction.reference_id || 'UPI/2026/8192847192'}</span>
              <button
                onClick={handleCopyRef}
                title="Copy reference ID"
                className="p-1 hover:text-brand-600 transition-colors"
              >
                {copiedRef ? (
                  <Check size={14} className="text-emerald-500" />
                ) : (
                  <Copy size={14} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-center justify-between py-1 border-b border-gray-200/60 dark:border-gray-700/60">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium">
              <Calendar size={13} />
              <span>Date & Time</span>
            </span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {formatGroupDate(transaction.date)}, {formatTime12h(transaction.time)}
            </span>
          </div>

          {/* Payment Method & Bank */}
          <div className="flex items-center justify-between py-1 border-b border-gray-200/60 dark:border-gray-700/60">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium">
              <Building2 size={13} />
              <span>{isIncome ? 'Credited To' : 'Debited From'}</span>
            </span>
            <span className="font-semibold text-gray-800 dark:text-gray-200 text-right">
              {transaction.bank_name || 'Primary Bank Account'}
            </span>
          </div>

          {/* Payment Mode */}
          <div className="flex items-center justify-between py-1 border-b border-gray-200/60 dark:border-gray-700/60">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium">
              <CreditCard size={13} />
              <span>Payment Mode</span>
            </span>
            <span className="font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
              {transaction.payment_method}
            </span>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between py-1 border-b border-gray-200/60 dark:border-gray-700/60">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium">
              <Tag size={13} />
              <span>Category</span>
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-gray-800 dark:text-gray-200">
              {category?.icon && (
                <CategoryIcon iconName={category.icon} size={14} color={category.color} />
              )}
              <span>{transaction.category_name || category?.name || 'General'}</span>
            </div>
          </div>

          {/* Notes (if any) */}
          {transaction.notes && (
            <div className="flex items-start justify-between py-1">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium">
                <FileText size={13} />
                <span>Notes</span>
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200 text-right max-w-[200px] leading-relaxed">
                {transaction.notes}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons: Edit, Delete, Share */}
        <div className="w-full flex items-center gap-2">
          <button
            onClick={() => {
              onClose();
              onEdit(transaction);
            }}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:hover:bg-brand-900 dark:text-brand-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-brand-200 dark:border-brand-800/40"
          >
            <Edit3 size={15} />
            <span>Edit</span>
          </button>

          <button
            onClick={handleShareReceipt}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            {copiedShare ? (
              <>
                <Check size={15} className="text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Share2 size={15} />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onClose();
              onDelete(transaction.id);
            }}
            className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-400 transition-colors border border-rose-200 dark:border-rose-900/30"
            title="Delete Transaction"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

