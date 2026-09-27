import React, { useState } from 'react';
import { X, Sparkles, PlusCircle } from 'lucide-react';
import { Category, PaymentMethod, Transaction } from '../types';
import { CATEGORY_CONFIG, QUICK_MERCHANTS } from '../data/mockData';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onRequestPauseCheck: (expense: {
    amount: number;
    merchant: string;
    category: Category;
    paymentMethod: PaymentMethod;
    date: string;
    time: string;
    notes?: string;
  }) => boolean; // returns true if intercepted by pause warning
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  onRequestPauseCheck,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [merchant, setMerchant] = useState<string>('');
  const [category, setCategory] = useState<Category>('Food');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectQuickMerchant = (item: typeof QUICK_MERCHANTS[0]) => {
    setMerchant(item.name);
    setCategory(item.category);
    if (item.defaultAmount && !amount) {
      setAmount(item.defaultAmount.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than ₹0');
      return;
    }

    const newExpense = {
      amount: Math.round(numAmount),
      merchant: merchant.trim() || 'General Expense',
      category,
      paymentMethod,
      date,
      time,
      notes: notes.trim() || undefined,
    };

    // Check if this triggers the signature pause guard!
    const wasIntercepted = onRequestPauseCheck(newExpense);
    if (!wasIntercepted) {
      // If not intercepted, add immediately and close
      onAddExpense(newExpense);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setAmount('');
    setMerchant('');
    setCategory('Food');
    setPaymentMethod('UPI');
    setNotes('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading">Add Expense</h2>
              <p className="text-xs text-slate-400">Log cash, card, or UPI expense</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Amount (₹) *
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-2xl font-bold text-teal-400 select-none">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                autoFocus
                className="w-full pl-11 pr-4 py-3 text-2xl font-bold rounded-2xl bg-slate-800/80 border border-slate-700/80 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white placeholder-slate-600 transition"
              />
            </div>
            {error && <p className="text-xs text-rose-400 mt-1.5 font-medium">{error}</p>}
          </div>

          {/* Quick Indian Merchant Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Quick Merchant Picks
              </label>
              <span className="text-[11px] text-teal-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto-categorizes
              </span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {QUICK_MERCHANTS.slice(0, 7).map((item) => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => handleSelectQuickMerchant(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
                    merchant === item.name
                      ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-xs'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Merchant Name input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Merchant / Payee (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Swiggy, Local Kirana, Chai Stall"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 focus:outline-none focus:border-teal-500 text-sm text-white placeholder-slate-500 transition"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => {
                const conf = CATEGORY_CONFIG[cat];
                const isSelected = category === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition ${
                      isSelected
                        ? 'bg-teal-500/20 border-teal-400 text-teal-300 font-bold'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs truncate w-full">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['UPI', 'Cash', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Other'] as PaymentMethod[]).map(
                (method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition ${
                      paymentMethod === method
                        ? 'bg-teal-500 text-slate-950 font-bold border-teal-400'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {method}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Office lunch with Raj, urgent purchase"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 focus:outline-none focus:border-teal-500 text-xs text-white placeholder-slate-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-teal-900/30 transition active:scale-[0.98]"
            >
              Log Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
