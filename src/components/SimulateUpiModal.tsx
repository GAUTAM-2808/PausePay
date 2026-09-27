import React, { useState } from 'react';
import { X, Zap, Smartphone, ArrowRight, ShieldAlert } from 'lucide-react';
import { Category } from '../types';

interface SimulateUpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulate: (amount: number, merchant: string, category: Category, appName: string) => void;
  currentSpentToday: number;
  dailyLimit: number;
}

const PRESET_SIMULATIONS: {
  appName: string;
  merchant: string;
  amount: number;
  category: Category;
  appColor: string;
  tag: string;
}[] = [
  {
    appName: 'Google Pay',
    merchant: 'Zomato Midnight Craving',
    amount: 420,
    category: 'Food',
    appColor: 'from-blue-600 to-indigo-700',
    tag: 'Frequent Micro-Spend',
  },
  {
    appName: 'PhonePe',
    merchant: 'Zepto 10-min Grocery',
    amount: 290,
    category: 'Groceries',
    appColor: 'from-purple-600 to-indigo-800',
    tag: 'Quick Impulse',
  },
  {
    appName: 'Paytm',
    merchant: 'Uber Late Evening Surge',
    amount: 380,
    category: 'Travel',
    appColor: 'from-cyan-600 to-blue-700',
    tag: 'Daily Commute',
  },
  {
    appName: 'CRED UPI',
    merchant: 'Zara Sale Shoes',
    amount: 1850,
    category: 'Shopping',
    appColor: 'from-zinc-700 to-zinc-900',
    tag: 'Budget Buster ⚠️',
  },
  {
    appName: 'BHIM UPI',
    merchant: 'Corner Tapri Cutting Chai',
    amount: 30,
    category: 'Food',
    appColor: 'from-emerald-600 to-teal-800',
    tag: 'Safe Micro-Spend 👍',
  },
];

export const SimulateUpiModal: React.FC<SimulateUpiModalProps> = ({
  isOpen,
  onClose,
  onSimulate,
  currentSpentToday,
  dailyLimit,
}) => {
  const [customAmount, setCustomAmount] = useState('500');
  const [customMerchant, setCustomMerchant] = useState('Swiggy Instamart');
  const [customCategory, setCustomCategory] = useState<Category>('Groceries');
  const [customApp, setCustomApp] = useState('PhonePe');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-teal-500/30 p-6 text-white max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading">Simulate UPI Payment</h2>
              <p className="text-xs text-slate-400">Test real-time SpendPause guard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status banner */}
        <div className="my-4 p-3 rounded-2xl bg-teal-950/40 border border-teal-800/40 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block">Spent Today:</span>
            <span className="font-bold text-white text-sm">
              ₹{currentSpentToday.toLocaleString('en-IN')} / ₹{dailyLimit.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block">Remaining:</span>
            <span className="font-bold text-teal-400 text-sm">
              ₹{Math.max(0, dailyLimit - currentSpentToday).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 font-medium mb-3">
          Pick a simulated UPI payment to see how SpendPause intercepts impulse spending before UPI PIN confirmation:
        </p>

        {/* Preset Cards */}
        <div className="space-y-2">
          {PRESET_SIMULATIONS.map((preset, idx) => {
            const wouldExceed = currentSpentToday + preset.amount > dailyLimit;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSimulate(preset.amount, preset.merchant, preset.category, preset.appName);
                  onClose();
                }}
                className="w-full p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-teal-500/50 flex items-center justify-between text-left transition group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${preset.appColor} flex items-center justify-center text-white shrink-0 shadow-xs`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{preset.appName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-300">
                        {preset.tag}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      {preset.merchant}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-sm font-bold block ${
                      wouldExceed ? 'text-rose-400' : 'text-teal-400'
                    }`}
                  >
                    ₹{preset.amount}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center justify-end gap-0.5 group-hover:text-teal-300 transition">
                    Test <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Simulation */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Or Custom Payment Test
          </span>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Amount (₹)</label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">App</label>
              <select
                value={customApp}
                onChange={(e) => setCustomApp(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              >
                <option value="PhonePe">PhonePe</option>
                <option value="Google Pay">Google Pay</option>
                <option value="Paytm">Paytm</option>
                <option value="CRED">CRED</option>
                <option value="BHIM">BHIM</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const num = parseFloat(customAmount);
              if (num > 0) {
                onSimulate(Math.round(num), customMerchant, customCategory, customApp);
                onClose();
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Simulate Custom UPI Intercept</span>
          </button>
        </div>
      </div>
    </div>
  );
};
