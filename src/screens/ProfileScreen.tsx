import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Flame,
  Globe,
  Download,
  RotateCcw,
  Trash2,
  Lock,
  Sparkles,
  Check,
} from 'lucide-react';
import { UserProfile, BudgetSettings } from '../types';

interface ProfileScreenProps {
  userProfile: UserProfile;
  settings: BudgetSettings;
  totalAvoidedAmount: number;
  totalExpensesCount: number;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onToggleUpiGuard: () => void;
  onResetDemoData: () => void;
  onClearAllData: () => void;
  onExportJson: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  settings,
  totalAvoidedAmount,
  totalExpensesCount,
  onUpdateProfile,
  onToggleUpiGuard,
  onResetDemoData,
  onClearAllData,
  onExportJson,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [exportedToast, setExportedToast] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateProfile({ name: nameInput.trim() });
      setIsEditingName(false);
    }
  };

  const handleExport = () => {
    onExportJson();
    setExportedToast(true);
    setTimeout(() => setExportedToast(false), 2000);
  };

  return (
    <div className="pb-24 pt-2 w-full space-y-4">
      {/* Title */}
      <div className="pt-2">
        <h1 className="text-xl font-bold font-heading text-white">Profile & Security</h1>
        <p className="text-xs text-slate-400">Settings, mindful streaks, and on-device privacy</p>
      </div>

      {/* User Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-xl font-black text-slate-950 shadow-lg shadow-teal-900/30">
            {userProfile.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </div>
          <div className="flex-1">
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-2.5 py-1 text-sm font-bold rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-lg bg-teal-500 text-slate-950 text-xs font-bold"
                >
                  Save
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-heading text-white">{userProfile.name}</h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-[11px] text-teal-400 hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Mindful Spender 🧘
              </span>
            </div>
          </div>
        </div>

        {/* Streak & Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Safe Streak</span>
            <span className="text-sm font-bold text-amber-400 mt-0.5 block">
              {userProfile.streakDays} Days 🔥
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Saved Spends</span>
            <span className="text-sm font-bold text-teal-300 mt-0.5 block">
              ₹{totalAvoidedAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Expenses</span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              {totalExpensesCount}
            </span>
          </div>
        </div>
      </div>

      {/* UPI Auto-Guard Setting */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">UPI Auto-Guard Intercept</span>
            <span className="text-[11px] text-slate-400">
              Show pause modal when threshold or limit is crossed
            </span>
          </div>
        </div>

        <button
          onClick={onToggleUpiGuard}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            settings.upiGuardEnabled ? 'bg-teal-500' : 'bg-slate-700'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
              settings.upiGuardEnabled ? 'right-0.5' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* Language Switcher */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            App Language Tone
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['English', 'Hinglish', 'Hindi'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => onUpdateProfile({ language: lang })}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                userProfile.language === lang
                  ? 'bg-teal-500 text-slate-950 border-teal-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-400">
          Hinglish mode includes friendly prompts like: <em className="text-slate-300">"Tujhe ye sachme kharidna hai kya?"</em>
        </p>
      </div>

      {/* Data Management Actions */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Data & Backup
        </span>

        {/* Export JSON */}
        <button
          onClick={handleExport}
          className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-between transition"
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-teal-400" />
            <span>Export Transactions (JSON)</span>
          </div>
          {exportedToast && <span className="text-teal-400 text-[11px]">Downloaded ✓</span>}
        </button>

        {/* Reset Demo Data */}
        <button
          onClick={() => setShowConfirmReset(true)}
          className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-between transition"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Reset to Realistic Indian Demo Data</span>
          </div>
          <span className="text-slate-500 text-[10px]">Tap to reset</span>
        </button>

        {/* Clear All */}
        <button
          onClick={() => setShowConfirmClear(true)}
          className="w-full py-2.5 px-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center justify-between transition"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            <span>Clear All Data & Start Fresh</span>
          </div>
        </button>
      </div>

      {/* 100% On-Device Privacy Guarantee Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-300">
          <h4 className="font-bold text-white mb-0.5">100% Local On-Device Privacy</h4>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            SpendPause does NOT request bank credentials, account numbers, or UPI PINs. All spending limits and transaction history remain privately stored on your device.
          </p>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 text-white">
            <h3 className="text-base font-bold font-heading">Reset Demo Data?</h3>
            <p className="text-xs text-slate-400 mt-1">
              This will reload sample Indian expenses (Swiggy, Zepto, Uber, Chai) and restore standard ₹1,000 daily budget limits.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetDemoData();
                  setShowConfirmReset(false);
                }}
                className="flex-1 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-rose-500/30 p-5 text-white">
            <h3 className="text-base font-bold font-heading text-rose-400">Clear All Records?</h3>
            <p className="text-xs text-slate-400 mt-1">
              All transactions and streak history will be wiped from this browser.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAllData();
                  setShowConfirmClear(false);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                Wipe All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
