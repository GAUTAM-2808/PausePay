import React, { useState } from 'react';
import {
  Sliders,
  ShieldAlert,
  Percent,
  CalendarDays,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { BudgetSettings, CategoryBudget, Transaction, Category } from '../types';
import { CATEGORY_CONFIG } from '../data/mockData';

interface BudgetsScreenProps {
  settings: BudgetSettings;
  categoryBudgets: CategoryBudget[];
  transactions: Transaction[];
  onUpdateSettings: (newSettings: BudgetSettings) => void;
  onUpdateCategoryBudget: (category: Category, newLimit: number) => void;
}

export const BudgetsScreen: React.FC<BudgetsScreenProps> = ({
  settings,
  categoryBudgets,
  transactions,
  onUpdateSettings,
  onUpdateCategoryBudget,
}) => {
  const [dailyLimit, setDailyLimit] = useState(settings.dailyLimit.toString());
  const [warningThreshold, setWarningThreshold] = useState<number>(settings.warningThreshold);
  const [weeklyBudget, setWeeklyBudget] = useState(settings.weeklyBudget.toString());
  const [monthlyBudget, setMonthlyBudget] = useState(settings.monthlyBudget.toString());
  const [strictness, setStrictness] = useState(settings.saveModeStrictness);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Calculate current month's spent for each category
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlySpentByCategory = transactions
    .filter((tx) => {
      const d = new Date(tx.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as { [key in Category]?: number });

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const dVal = parseFloat(dailyLimit);
    const wVal = parseFloat(weeklyBudget);
    const mVal = parseFloat(monthlyBudget);

    if (isNaN(dVal) || dVal <= 0) return;

    onUpdateSettings({
      ...settings,
      dailyLimit: Math.round(dVal),
      warningThreshold,
      weeklyBudget: Math.round(wVal) || Math.round(dVal * 7),
      monthlyBudget: Math.round(mVal) || Math.round(dVal * 30),
      saveModeStrictness: strictness,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const warnAmount = Math.round((parseFloat(dailyLimit || '0') * warningThreshold) / 100);

  return (
    <div className="pb-24 pt-2 w-full space-y-4">
      {/* Title */}
      <div className="pt-2">
        <h1 className="text-xl font-bold font-heading text-white">Budgets & Limits</h1>
        <p className="text-xs text-slate-400">
          Configure daily targets, warning thresholds, and category guards
        </p>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-4">
        {/* Daily Spending Limit Card */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Daily Spending Limit
            </span>
            <span className="text-xs text-teal-400 font-bold">
              ₹{dailyLimit}/day
            </span>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-4 text-2xl font-bold text-teal-400">₹</span>
            <input
              type="number"
              min="100"
              step="50"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-xl font-bold rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex gap-2">
            {[500, 1000, 1500, 2000].map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => setDailyLimit(preset.toString())}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  dailyLimit === preset.toString()
                    ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                ₹{preset}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Warning Threshold (70%, 80%, 90%, 100%) */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Warning Threshold
              </span>
            </div>
            <span className="text-xs font-bold text-amber-300">
              Trigger at {warningThreshold}% (₹{warnAmount})
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            SpendPause will display the friendly <strong className="text-slate-200">"Ek minute 😅"</strong> modal when today's spending reaches this threshold.
          </p>

          <div className="grid grid-cols-4 gap-2">
            {[70, 80, 90, 100].map((pct) => (
              <button
                type="button"
                key={pct}
                onClick={() => setWarningThreshold(pct)}
                className={`py-2.5 rounded-2xl text-xs font-bold border transition ${
                  warningThreshold === pct
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-950/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Weekly & Monthly Targets */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Macro Spending Budgets
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Weekly Target (₹)
              </label>
              <input
                type="number"
                value={weeklyBudget}
                onChange={(e) => setWeeklyBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Monthly Target (₹)
              </label>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Save Mode Strictness */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Pause Intervention Tone
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(['gentle', 'balanced', 'strict'] as const).map((mode) => (
              <button
                type="button"
                key={mode}
                onClick={() => setStrictness(mode)}
                className={`py-2 px-3 rounded-xl text-xs font-bold capitalize border transition ${
                  strictness === mode
                    ? 'bg-teal-500 text-slate-950 border-teal-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400">
            {strictness === 'gentle' && 'Friendly subtle reminder when near limit.'}
            {strictness === 'balanced' && 'Standard pause countdown with Hinglish prompts.'}
            {strictness === 'strict' && 'Rigorous pause countdown with extra impulse friction.'}
          </p>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-900/30 transition flex items-center justify-center gap-2"
        >
          {savedSuccess ? (
            <>
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Budgets Updated ✓</span>
            </>
          ) : (
            <span>Save Budget Settings</span>
          )}
        </button>
      </form>

      {/* Category-Wise Budgets */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Monthly Category Budgets
          </h3>
          <span className="text-[11px] text-slate-500">Live tracker</span>
        </div>

        <div className="space-y-3.5">
          {categoryBudgets.map((catBudget) => {
            const conf = CATEGORY_CONFIG[catBudget.category] || CATEGORY_CONFIG['Other'];
            const spent = monthlySpentByCategory[catBudget.category] || 0;
            const limit = catBudget.monthlyLimit;
            const pct = Math.min(100, Math.round((spent / limit) * 100));
            const isExceeded = spent > limit;

            return (
              <div key={catBudget.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: conf.color }}
                    />
                    <span className="font-bold text-white">{catBudget.category}</span>
                  </div>
                  <div className="text-right">
                    <span className={isExceeded ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      ₹{spent.toLocaleString('en-IN')}
                    </span>
                    <span className="text-slate-500"> / ₹{limit.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isExceeded ? 'bg-rose-500' : ''
                    }`}
                    style={{
                      width: `${pct}%`,
                      backgroundColor: isExceeded ? undefined : conf.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
