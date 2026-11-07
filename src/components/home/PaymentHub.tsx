import React, { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  CreditCard,
  ReceiptText,
  Share2,
  Smartphone,
  User,
  Wallet,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useExpenses } from '../../context/ExpenseContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../lib/formatters';

type PaymentAction = 'mobile' | 'upi' | 'self' | 'balance' | null;

const qrPattern = [
  '111111100101101111111',
  '100000101110101000001',
  '101110100010101011101',
  '101110101111101011101',
  '101110100100101011101',
  '100000101011101000001',
  '111111101010101111111',
  '000000001111100000000',
  '110101111001101011101',
  '001011001110011010010',
  '111100111011110111100',
  '010011010100101001011',
  '101101111010111101101',
  '000000001101100000000',
  '111111101011101111111',
  '100000101110101000001',
  '101110101001101011101',
  '101110100111101011101',
  '101110101010101011101',
  '100000101101101000001',
  '111111101010101111111',
];

export const PaymentHub: React.FC = () => {
  const { profile } = useAuth();
  const { currentMonthSummary, selectedMonth } = useExpenses();
  const { info, success } = useToast();
  const [activeAction, setActiveAction] = useState<PaymentAction>(null);
  const [upiModalOpen, setUpiModalOpen] = useState(false);

  const upiId = profile?.upi_id || 'user@navipulse';
  const appBalance = currentMonthSummary.totalIncome - currentMonthSummary.totalExpense;

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      success(`${label} copied`, value);
    } catch {
      info(`${label}: ${value}`, 'Clipboard access is unavailable in this browser.');
    }
  };

  const handleShare = async () => {
    const shareText = 'Here is my Navi Plus payment link: ₹350';
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Navi Plus', text: shareText });
      } catch {
        // Sharing can be dismissed by the user; no error notification is needed.
      }
      return;
    }
    await copyText(shareText, 'Share message');
  };

  const actions = [
    {
      id: 'mobile' as const,
      label: 'Pay mobile number',
      icon: Smartphone,
      className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    {
      id: 'upi' as const,
      label: 'Pay to UPI ID or bank',
      icon: CreditCard,
      className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    {
      id: 'self' as const,
      label: 'Self transfer',
      icon: User,
      className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    {
      id: 'balance' as const,
      label: 'Check balance',
      icon: Wallet,
      className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
  ];

  return (
    <>
      <section className="space-y-4" aria-label="Payments">
        <button
          onClick={() => setActiveAction('upi')}
          className="w-full flex items-center justify-center gap-3 rounded-full bg-[#21002f] px-5 py-4 text-white shadow-lg shadow-purple-950/10 transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <ReceiptText size={25} className="text-emerald-400" />
          <span className="text-lg font-extrabold tracking-tight">Scan &amp; pay</span>
          <ArrowUpRight size={18} className="text-white/60" />
        </button>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map(({ id, label, icon: Icon, className }) => (
            <button
              key={id}
              onClick={() => setActiveAction(id)}
              className="group flex min-w-0 flex-col items-center text-center transition-transform active:scale-95"
            >
              <span className={`flex h-20 w-20 items-center justify-center rounded-full shadow-sm transition-transform group-hover:-translate-y-0.5 sm:h-24 sm:w-24 ${className}`}>
                <Icon size={34} strokeWidth={2.2} />
              </span>
              <span className="mt-2 max-w-[130px] text-sm font-semibold leading-5 text-gray-800 dark:text-gray-200">
                {label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setUpiModalOpen(true)}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:border-brand-300 hover:text-brand-600 dark:border-gray-700 dark:bg-[#1a1825] dark:text-gray-300"
          >
            <ReceiptText size={20} />
            My QR
          </button>
          <button
            onClick={handleShare}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:border-brand-300 hover:text-brand-600 dark:border-gray-700 dark:bg-[#1a1825] dark:text-gray-300"
          >
            <Share2 size={20} />
            Share <span className="text-base">→ ₹350</span>
          </button>
          <button
            onClick={() => copyText(upiId, 'UPI ID')}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:border-brand-300 hover:text-brand-600 dark:border-gray-700 dark:bg-[#1a1825] dark:text-gray-300"
          >
            <Copy size={20} />
            Copy UPI ID
          </button>
        </div>
      </section>

      <Modal
        isOpen={activeAction !== null}
        onClose={() => setActiveAction(null)}
        title={activeAction === 'balance' ? 'Check balance' : 'Scan & pay'}
        subtitle="Demo mode — no real payment will be made"
      >
        {activeAction === 'balance' ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Wallet size={30} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                App balance · {selectedMonth}
              </p>
              <p className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white">
                {formatINR(appBalance, true)}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Calculated from your recorded income and expenses. Connect a bank provider to view a live bank balance.
            </p>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setActiveAction(null);
              info('Payment request ready', 'Connect a supported payment provider to complete real payments.');
            }}
          >
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              {activeAction === 'mobile' ? 'Mobile number' : activeAction === 'self' ? 'Transfer to' : 'UPI ID or bank account'}
              <input
                required
                type={activeAction === 'mobile' ? 'tel' : 'text'}
                placeholder={activeAction === 'mobile' ? 'Enter mobile number' : 'example@upi'}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Amount
              <input
                required
                min="1"
                step="1"
                type="number"
                placeholder="₹ 0"
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </label>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-brand-500/25 hover:bg-brand-700">
              <ArrowUpRight size={17} />
              Continue securely
            </button>
          </form>
        )}
      </Modal>

      <Modal isOpen={upiModalOpen} onClose={() => setUpiModalOpen(false)} title="My QR" subtitle="Scan to pay this UPI ID">
        <div className="flex flex-col items-center gap-4">
          <div className="grid grid-cols-[repeat(21,minmax(0,1fr))] gap-0.5 rounded-xl border-8 border-white bg-white p-2 shadow-lg dark:border-gray-100">
            {qrPattern.join('').split('').map((cell, index) => (
              <span key={index} className={`h-2 w-2 sm:h-2.5 sm:w-2.5 ${cell === '1' ? 'bg-[#111111]' : 'bg-white'}`} />
            ))}
          </div>
          <p className="font-bold text-gray-900 dark:text-white">{upiId}</p>
          <button onClick={() => copyText(upiId, 'UPI ID')} className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-2.5 text-xs font-bold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
            <Check size={15} />
            Copy UPI ID
          </button>
        </div>
      </Modal>
    </>
  );
};
