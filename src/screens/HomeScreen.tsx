import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Flame,
  TrendingDown,
  ChevronRight,
  Sliders,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Transaction, BudgetSettings, UserProfile, Category } from '../types';
import { CATEGORY_CONFIG } from '../data/mockData';
import { SpendPauseLogo } from '../components/SpendPauseLogo';

interface HomeScreenProps {
  transactions: Transaction[];
  settings: BudgetSettings;
  userProfile: UserProfile;
  totalAvoidedAmount: number;
  unreadCount: number;
  onOpenAddExpense: () => void;
  onOpenSimulateUpi: () => void;
  onOpenNotifications: () => void;
  onOpenEditExpense: (tx: Transaction) => void;
  onUpdateDailyLimit: (newLimit: number) => void;
  onToggleUpiGuard: () => void;
  onNavigateTab: (tab: 'home' | 'transactions' | 'insights' | 'budgets' | 'profile') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  transactions,
  settings,
  userProfile,
  totalAvoidedAmount,
  unreadCount,
  onOpenAddExpense,
  onOpenSimulateUpi,
  onOpenNotifications,
  onOpenEditExpense,
  onUpdateDailyLimit,
  onToggleUpiGuard,
  onNavigateTab,
}) => {
  const [showAdjustLimit, setShowAdjustLimit] = useState(false);
  const [tempLimit, setTempLimit] = useState(settings.dailyLimit.toString());

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter((tx) => tx.date === todayStr);
  const todaySpent = todayTransactions.reduce((acc, tx) => acc + tx.amount, 0);

  const dailyLimit = settings.dailyLimit;
  const remaining = Math.max(0, dailyLimit - todaySpent);
  const percentage = Math.round((todaySpent / dailyLimit) * 100);

  // Status message logic
  let statusText = "You're doing great 👍";
  let statusBg = 'bg-teal-500/15 text-teal-300 border-teal-500/30';
  let progressColor = 'from-teal-400 to-emerald-500';

  if (percentage >= 100) {
    statusText = 'Daily budget exceeded ⚠️';
    statusBg = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    progressColor = 'from-amber-500 to-rose-600';
  } else if (percentage >= 90) {
    statusText = 'Careful! Almost at your limit.';
    statusBg = 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    progressColor = 'from-amber-400 to-orange-500';
  } else if (percentage >= 70) {
    statusText = "You're getting close 👀";
    statusBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    progressColor = 'from-teal-400 to-amber-400';
  }

  // Greeting time
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const handleSaveLimit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempLimit);
    if (!isNaN(val) && val >= 100) {
      onUpdateDailyLimit(Math.round(val));
      setShowAdjustLimit(false);
    }
  };

  return (
    <div className="pb-24 pt-2 w-full space-y-4">
      {/* Mobile Top Header (Hidden on Desktop since DesktopHeader is present) */}
      <header className="md:hidden flex items-center justify-between pt-2">
        <SpendPauseLogo size="md" />

        <div className="flex items-center gap-2">
          {/* UPI Guard Active indicator chip */}
          <button
            onClick={onToggleUpiGuard}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition border ${
              settings.upiGuardEnabled
                ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                settings.upiGuardEnabled ? 'bg-teal-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
            <span>{settings.upiGuardEnabled ? 'Guard ON' : 'Guard OFF'}</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Responsive Grid: 1 col on mobile, 12 cols on desktop */}
      <div className="md:grid md:grid-cols-12 md:gap-6 md:space-y-0 space-y-4">
        {/* Left / Main Column (Desktop 7 cols) */}
        <div className="md:col-span-7 space-y-4">
          {/* Welcome Greeting */}
          <div className="pt-1 flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
                {greeting}, {userProfile.name.split(' ')[0]} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Mindful impulse guard is actively monitoring today's spending.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 font-medium">
                Day {userProfile.streakDays} on track
              </span>
            </div>
          </div>

          {/* Main Spending Card (Hero) */}
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 sm:p-6 shadow-xl overflow-hidden">
            {/* Ambient background blur */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Card Header & Adjust Limit */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                TODAY'S SPENDING METER
              </span>
              <button
                onClick={() => {
                  setTempLimit(settings.dailyLimit.toString());
                  setShowAdjustLimit(true);
                }}
                className="flex items-center gap-1 text-[11px] font-semibold text-teal-400 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 px-2.5 py-1 rounded-lg border border-teal-500/20 transition cursor-pointer"
                title="Adjust your daily target limit"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Limit: ₹{dailyLimit.toLocaleString('en-IN')}</span>
              </button>
            </div>

            {/* Spending Amount & Status */}
            <div className="flex items-baseline justify-between mt-1">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight">
                    ₹{todaySpent.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 font-medium">
                    / ₹{dailyLimit.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {todayTransactions.length} transaction{todayTransactions.length === 1 ? '' : 's'} recorded today
                </p>
              </div>

              {/* Dynamic Status badge */}
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${statusBg} text-right`}>
                {statusText}
              </div>
            </div>

            {/* Large Visual Progress Indicator */}
            <div className="mt-5 pt-1">
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-400">Daily Budget Progress</span>
                <span className={percentage >= 100 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                  {percentage}% ({todaySpent > dailyLimit ? `+₹${todaySpent - dailyLimit} over limit` : `₹${remaining.toLocaleString('en-IN')} remaining`})
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800/80 p-0.5 overflow-hidden border border-slate-700/60">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-700 ease-out`}
                  style={{ width: `${Math.min(100, percentage)}%` }}
                />
              </div>

              {/* Warning Threshold Notch */}
              <div className="relative mt-1">
                <div
                  className="absolute -top-4 w-0.5 h-4 bg-amber-400/80"
                  style={{ left: `${settings.warningThreshold}%` }}
                  title={`Warning threshold: ${settings.warningThreshold}%`}
                />
                <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>₹0</span>
                  <span className="text-amber-400/90 font-medium">⚠️ Intercept starts at {settings.warningThreshold}%</span>
                  <span>₹{dailyLimit.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Quick Remaining Stat Pillars */}
            <div className="grid grid-cols-2 gap-3 mt-5 pt-3 border-t border-slate-800/80">
              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Remaining Allowance
                </span>
                <span className="text-lg font-bold text-emerald-400 mt-0.5 block">
                  ₹{remaining.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Mindful Spending Pace
                </span>
                <span className="text-lg font-bold text-teal-300 mt-0.5 block">
                  {percentage < 70 ? 'Optimal Pace 🎯' : percentage <= 90 ? 'Tight Pace 🤏' : 'Pause Required ✋'}
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
              <button
                onClick={onOpenAddExpense}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>+ Add Expense (N)</span>
              </button>
              <button
                onClick={onOpenSimulateUpi}
                className="py-3 px-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Simulate UPI Payment (S)</span>
              </button>
            </div>
          </div>

          {/* Streak & Savings Milestone Card */}
          <div className="grid grid-cols-2 gap-3">
            {/* Streak */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Safe Streak</span>
                <span className="text-lg font-bold text-white font-heading">
                  {userProfile.streakDays} Days 🔥
                </span>
              </div>
            </div>

            {/* Impulses Avoided */}
            <div
              onClick={() => onNavigateTab('insights')}
              className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-teal-500/40 transition group"
              title="Click to view avoided impulses analysis"
            >
              <div className="w-11 h-11 rounded-2xl bg-teal-500/15 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs text-slate-400 block font-medium">Saved via Pause</span>
                <span className="text-lg font-bold text-teal-300 font-heading truncate block">
                  ₹{totalAvoidedAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Desktop 5 cols) */}
        <div className="md:col-span-5 space-y-4">
          {/* UPI Auto-Guard & Simulator Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-teal-950/30 border border-teal-900/40 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">UPI Impulse Interceptor</h3>
                  <p className="text-[11px] text-teal-300/80">Active for Indian UPI Apps</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              When payment requests from PhonePe, GPay, or Paytm reach {settings.warningThreshold}% of your daily limit, SpendPause initiates a mindful 3-second breathing checkpoint.
            </p>

            <button
              onClick={onOpenSimulateUpi}
              className="w-full py-2.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-teal-400" />
              <span>Simulate Impulse Checkpoint</span>
            </button>
          </div>

          {/* Today's Transactions Quick List */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Today's Activity ({todayTransactions.length})
              </h3>
              {todayTransactions.length > 0 && (
                <button
                  onClick={() => onNavigateTab('transactions')}
                  className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-0.5 cursor-pointer"
                >
                  <span>See all</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {todayTransactions.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-400" />
                </div>
                <p className="text-xs font-bold text-slate-300">No spends logged today</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Great self-control! Log an expense or simulate UPI whenever you shop.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayTransactions.slice(0, 5).map((tx) => {
                  const conf = CATEGORY_CONFIG[tx.category] || CATEGORY_CONFIG['Other'];
                  return (
                    <div
                      key={tx.id}
                      onClick={() => onOpenEditExpense(tx)}
                      className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700/80 flex items-center justify-between cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ backgroundColor: `${conf.color}20`, color: conf.color }}
                        >
                          {tx.category.slice(0, 2)}
                        </div>
                        <div className="truncate">
                          <span className="text-xs font-bold text-white block truncate">
                            {tx.merchant}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <span>{tx.time}</span>
                            <span>•</span>
                            <span>{tx.paymentMethod}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-white block">
                          ₹{tx.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {tx.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Adjust Daily Limit Modal */}
      {showAdjustLimit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold font-heading">Set Daily Spending Limit</h3>
            <p className="text-xs text-slate-400 mt-1">
              Choose how much you want to allow yourself to spend per day before UPI warnings trigger.
            </p>

            <form onSubmit={handleSaveLimit} className="mt-4 space-y-3">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-lg font-bold text-teal-400">₹</span>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={tempLimit}
                  onChange={(e) => setTempLimit(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-lg font-bold rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex gap-2">
                {[500, 1000, 1500, 2000].map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setTempLimit(preset.toString())}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustLimit(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition"
                >
                  Save Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
