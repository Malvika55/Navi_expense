import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, IndianRupee, Sparkles } from 'lucide-react';
import { Transaction, TransactionType, PaymentMethod } from '../../types';
import { Modal } from '../common/Modal';
import { useExpenses } from '../../context/ExpenseContext';
import { generateReferenceId } from '../../lib/formatters';
import { CategoryIcon } from '../common/CategoryIcon';

interface AddEditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
  defaultType?: TransactionType;
}

export const AddEditTransactionModal: React.FC<AddEditTransactionModalProps> = ({
  isOpen,
  onClose,
  transactionToEdit,
  defaultType = 'expense',
}) => {
  const { categories, addTransaction, updateTransaction } = useExpenses();

  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [bankName, setBankName] = useState<string>('HDFC Bank •• 4912');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Suggestions for rapid entry
  const expenseSuggestions = ['Swiggy', 'Zomato', 'Uber', 'Zepto', 'Amazon', 'Starbucks', 'Tata Power'];
  const incomeSuggestions = ['TechCorp Salary', 'Freelance Project', 'Dividend Credit', 'Cashback', 'Consulting'];

  // Initialize or reset form
  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setAmount(String(transactionToEdit.amount));
      setTitle(transactionToEdit.title);
      setCategoryId(transactionToEdit.category_id);
      setDate(transactionToEdit.date);
      setTime(transactionToEdit.time);
      setPaymentMethod(transactionToEdit.payment_method);
      setBankName(transactionToEdit.bank_name || 'HDFC Bank •• 4912');
      setNotes(transactionToEdit.notes || '');
    } else {
      const now = new Date();
      setType(defaultType);
      setAmount('');
      setTitle('');
      setDate(now.toISOString().split('T')[0]);
      setTime(now.toTimeString().slice(0, 5));
      setPaymentMethod('UPI');
      setBankName('HDFC Bank •• 4912');
      setNotes('');
      // Set first matching category
      const defaultCat = categories.find((c) => c.type === defaultType);
      setCategoryId(defaultCat ? defaultCat.id : '');
    }
    setError('');
  }, [transactionToEdit, isOpen, defaultType, categories]);

  // When type changes, ensure category matches type
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const firstCat = categories.find((c) => c.type === newType);
    if (firstCat) {
      setCategoryId(firstCat.id);
    }
  };

  const handleQuickAddAmount = (addValue: number) => {
    const cur = parseFloat(amount) || 0;
    setAmount(String(cur + addValue));
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a merchant or transaction title.');
      return;
    }
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    const selectedCat = categories.find((c) => c.id === categoryId);

    if (transactionToEdit) {
      await updateTransaction({
        ...transactionToEdit,
        type,
        amount: numAmount,
        title: title.trim(),
        category_id: categoryId,
        category_name: selectedCat?.name || '',
        date,
        time,
        payment_method: paymentMethod,
        bank_name: bankName,
        notes: notes.trim(),
      });
    } else {
      await addTransaction({
        type,
        amount: numAmount,
        title: title.trim(),
        category_id: categoryId,
        category_name: selectedCat?.name || '',
        date,
        time,
        payment_method: paymentMethod,
        bank_name: bankName,
        reference_id: generateReferenceId(),
        notes: notes.trim(),
        status: 'COMPLETED',
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionToEdit ? 'Edit Transaction' : 'Record Transaction'}
      subtitle="Navi-style UPI & Expense Tracking"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle: Expense vs Income */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              type === 'expense'
                ? 'bg-white dark:bg-[#1a1825] text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <ArrowDownLeft size={15} />
            <span>Expense (Paid)</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              type === 'income'
                ? 'bg-white dark:bg-[#1a1825] text-navi-green dark:text-emerald-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <ArrowUpRight size={15} />
            <span>Income (Received)</span>
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            Amount (INR)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-extrabold text-gray-400">
              ₹
            </span>
            <input
              type="number"
              step="any"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              autoFocus={!transactionToEdit}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Quick Amount Chips */}
          <div className="flex items-center gap-1.5 mt-2">
            {[100, 500, 1000, 2000, 5000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAddAmount(val)}
                className="text-[11px] font-bold px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                +₹{val}
              </button>
            ))}
          </div>
        </div>

        {/* Merchant / Title Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            {type === 'expense' ? 'Merchant or Recipient' : 'Received From / Source'}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === 'expense' ? 'e.g. Swiggy, Uber, Tata Power' : 'e.g. Salary, Client Payout'}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          {/* Quick suggestions */}
          <div className="flex items-center gap-1 mt-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {(type === 'expense' ? expenseSuggestions : incomeSuggestions).map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => setTitle(sug)}
                className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900/60 shrink-0 transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Category Picker */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
            Category
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800">
            {filteredCategories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-400'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <CategoryIcon
                    iconName={cat.icon}
                    size={16}
                    color={isSelected ? '#ffffff' : cat.color}
                  />
                  <span className="text-[10px] font-bold mt-1 line-clamp-1">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Payment Method & Bank */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="UPI">UPI (Google Pay / PhonePe / Navi)</option>
              <option value="Bank Transfer">Bank Transfer (IMPS/NEFT)</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Cash">Cash</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Bank / Account
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. HDFC Bank •• 4912"
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Notes / Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            Notes (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add transaction remarks or tags..."
            className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Validation Error Message */}
        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold text-rose-600 dark:text-rose-400 text-center">
            {error}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 hover:from-brand-800 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles size={15} />
            <span>{transactionToEdit ? 'Save Changes' : 'Save Transaction'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

