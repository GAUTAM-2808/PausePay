import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, ShieldCheck, HeartHandshake, Sparkles, X } from 'lucide-react';
import { Category, PaymentMethod } from '../types';

interface PauseModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: (savedAmount: number, merchant: string, category: Category) => void;
  pendingExpense: {
    amount: number;
    merchant: string;
    category: Category;
    paymentMethod: PaymentMethod;
  };
  currentSpentToday: number;
  dailyLimit: number;
  warningThresholdPercent: number;
}

export const PauseInterventionModal: React.FC<PauseModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  pendingExpense,
  currentSpentToday,
  dailyLimit,
  warningThresholdPercent,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setCanSkip(false);
      return;
    }

    setCountdown(5);
    setCanSkip(false);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const newTotal = currentSpentToday + pendingExpense.amount;
  const isBudgetExceeded = newTotal > dailyLimit;
  const remainingBefore = Math.max(0, dailyLimit - currentSpentToday);
  const percentUsedAfter = Math.round((newTotal / dailyLimit) * 100);

  // Friendly Hinglish dynamic headlines & punchlines
  const hinglishTitle = isBudgetExceeded
    ? '⚠️ Daily budget cross hone wala hai!'
    : 'Ek minute 😅 Ek baar soch le!';

  const hinglishPrompt = isBudgetExceeded
    ? 'Bhai, ye purchase aaj ka limit paar kar dega. Sachme itni urgent hai?'
    : 'Tujhe ye sachme kharidna hai kya? Budget thoda tight ho raha hai.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 p-6 shadow-2xl shadow-amber-950/40 text-white overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Tag */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>UPI Spending Guard Intercept</span>
          </div>
          <button
            onClick={() => onCancel(pendingExpense.amount, pendingExpense.merchant, pendingExpense.category)}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Emoji & Headline */}
        <div className="text-center my-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-3xl mb-3 shadow-inner">
            {isBudgetExceeded ? '😰' : '✋'}
          </div>
          <h2 className="text-xl font-bold font-heading text-amber-300 leading-tight">
            {hinglishTitle}
          </h2>
          <p className="text-sm text-slate-300 mt-1.5 font-medium leading-snug">
            {hinglishPrompt}
          </p>
        </div>

        {/* Expense Card */}
        <div className="my-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-700/60 text-xs text-slate-400">
            <span>Payment to:</span>
            <span className="font-semibold text-white truncate max-w-[160px]">
              {pendingExpense.merchant || 'Uncategorized Spend'}
            </span>
          </div>

          <div className="flex items-baseline justify-between py-2 text-sm">
            <span className="text-slate-400">This Expense:</span>
            <span className="text-xl font-bold text-amber-400">
              ₹{pendingExpense.amount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-700/40 text-xs">
            <div className="bg-slate-900/60 p-2 rounded-xl">
              <span className="text-slate-400 block">Already Spent:</span>
              <span className="font-bold text-slate-200">
                ₹{currentSpentToday.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-xl">
              <span className="text-slate-400 block">Today's Limit:</span>
              <span className="font-bold text-slate-200">
                ₹{dailyLimit.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* New Projection bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">After this purchase:</span>
              <span className={isBudgetExceeded ? 'text-rose-400 font-bold' : 'text-amber-300 font-medium'}>
                ₹{newTotal.toLocaleString('en-IN')} ({percentUsedAfter}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-700/60 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isBudgetExceeded ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(100, percentUsedAfter)}%` }}
              />
            </div>
            {isBudgetExceeded ? (
              <p className="text-[11px] text-rose-400 font-medium mt-1">
                ⚠️ Will exceed today's budget by ₹{(newTotal - dailyLimit).toLocaleString('en-IN')}!
              </p>
            ) : (
              <p className="text-[11px] text-amber-300/80 font-medium mt-1">
                Only ₹{(dailyLimit - newTotal).toLocaleString('en-IN')} remaining for the day.
              </p>
            )}
          </div>
        </div>

        {/* 5-second countdown mindful pause notice */}
        <div className="flex items-center justify-center gap-1.5 py-1 text-xs text-teal-300 font-medium">
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          {countdown > 0 ? (
            <span>Mindful Pause: Take a breath ({countdown}s)...</span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Ready! What is your call?
            </span>
          )}
        </div>

        {/* Decision Actions */}
        <div className="mt-4 space-y-2">
          {/* Skip and save action button (Primary recommended option) */}
          <button
            type="button"
            onClick={() => onCancel(pendingExpense.amount, pendingExpense.merchant, pendingExpense.category)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40 transition active:scale-[0.98]"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Maybe later (Save ₹{pendingExpense.amount.toLocaleString('en-IN')})</span>
          </button>

          {/* Confirm anyway button */}
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white font-medium text-xs border border-slate-700/80 transition flex items-center justify-center gap-1.5"
          >
            <span>Yes, I really need this</span>
          </button>
        </div>

        {/* Subtext reassurance */}
        <p className="text-[11px] text-slate-500 text-center mt-3 font-normal">
          SpendPause helps you decide. We don't block your bank or UPI.
        </p>
      </div>
    </div>
  );
};
