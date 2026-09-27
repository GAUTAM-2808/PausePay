import React, { useMemo } from 'react';
import {
  TrendingDown,
  PieChart,
  BarChart3,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Banknote,
  Flame,
  Award,
} from 'lucide-react';
import { Transaction, ImpulseAvoided, Category } from '../types';
import { CATEGORY_CONFIG } from '../data/mockData';

interface InsightsScreenProps {
  transactions: Transaction[];
  impulsesAvoided: ImpulseAvoided[];
  dailyLimit: number;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({
  transactions,
  impulsesAvoided,
  dailyLimit,
}) => {
  // Total overall spent
  const totalSpent = useMemo(
    () => transactions.reduce((acc, tx) => acc + tx.amount, 0),
    [transactions]
  );

  // Total avoided through mindful pause
  const totalAvoided = useMemo(
    () => impulsesAvoided.reduce((acc, imp) => acc + imp.amount, 0),
    [impulsesAvoided]
  );

  // Category breakdown
  const categoryTotals = useMemo(() => {
    const map: { [key in Category]?: number } = {};
    transactions.forEach((tx) => {
      map[tx.category] = (map[tx.category] || 0) + tx.amount;
    });

    return Object.entries(map)
      .map(([cat, amount]) => ({
        category: cat as Category,
        amount: amount || 0,
        percentage: totalSpent > 0 ? Math.round(((amount || 0) / totalSpent) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, totalSpent]);

  const topCategory = categoryTotals[0];

  // Payment method breakdown
  const paymentMethodStats = useMemo(() => {
    const map: { [key: string]: number } = { UPI: 0, Cash: 0, Card: 0, Other: 0 };
    transactions.forEach((tx) => {
      if (tx.paymentMethod === 'UPI') map.UPI += tx.amount;
      else if (tx.paymentMethod === 'Cash') map.Cash += tx.amount;
      else if (tx.paymentMethod.includes('Card')) map.Card += tx.amount;
      else map.Other += tx.amount;
    });

    return [
      { name: 'UPI (PhonePe, GPay)', amount: map.UPI, icon: Smartphone, color: 'text-teal-400', bg: 'bg-teal-500' },
      { name: 'Cash', amount: map.Cash, icon: Banknote, color: 'text-emerald-400', bg: 'bg-emerald-500' },
      { name: 'Cards (Debit/Credit)', amount: map.Card, icon: CreditCard, color: 'text-blue-400', bg: 'bg-blue-500' },
    ];
  }, [transactions]);

  // Last 7 days spending for bar chart
  const last7DaysData = useMemo(() => {
    const days: { label: string; dateStr: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' });

      const dayTotal = transactions
        .filter((tx) => tx.date === dateStr)
        .reduce((sum, tx) => sum + tx.amount, 0);

      days.push({
        label: dayName,
        dateStr,
        amount: dayTotal,
      });
    }
    return days;
  }, [transactions]);

  const maxDayAmount = Math.max(dailyLimit, ...last7DaysData.map((d) => d.amount));

  // Average daily spending (last 7 days)
  const averageDailySpend = Math.round(
    last7DaysData.reduce((sum, d) => sum + d.amount, 0) / 7
  );

  return (
    <div className="pb-24 pt-2 w-full space-y-4">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-xl font-bold font-heading text-white">Spending Insights</h1>
        <p className="text-xs text-slate-400">Smart analysis of your digital and UPI habits</p>
      </div>

      {/* Impulse Saved Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-teal-900/60 via-slate-900 to-slate-950 border border-teal-500/30 p-5 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Mindful Pause Impact</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
            {impulsesAvoided.length} Purchases Avoided
          </span>
        </div>

        <div className="my-3">
          <span className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            ₹{totalAvoided.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-teal-300 font-medium block mt-1">
            Total money kept in your bank by pausing before spending!
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <p className="leading-relaxed">
            💡 <strong className="text-white">Financial Guard Tip:</strong> Most UPI micro-transactions under ₹300 feel painless in the moment, but accumulate to over ₹9,000/month. SpendPause intercepted {impulsesAvoided.length} impulsive moments!
          </p>
        </div>
      </div>

      {/* 2-Col Stat Highlights */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            7-Day Daily Avg
          </span>
          <span className="text-xl font-bold text-white font-heading mt-1 block">
            ₹{averageDailySpend.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Limit: ₹{dailyLimit.toLocaleString('en-IN')}/day
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Top Category
          </span>
          <span className="text-xl font-bold text-teal-400 font-heading mt-1 block truncate">
            {topCategory ? topCategory.category : 'None'}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            {topCategory ? `₹${topCategory.amount} (${topCategory.percentage}%)` : 'No data'}
          </span>
        </div>
      </div>

      {/* 7-Day Spending Trend Bar Chart */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Last 7 Days Spending
            </h3>
          </div>
          <span className="text-[10px] text-slate-500">
            Dotted line = ₹{dailyLimit} limit
          </span>
        </div>

        {/* Bars */}
        <div className="h-36 flex items-end justify-between gap-2 pt-4 relative">
          {/* Daily limit guide line */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-amber-400/40 z-10"
            style={{
              bottom: `${(dailyLimit / maxDayAmount) * 100}%`,
            }}
          />

          {last7DaysData.map((day, idx) => {
            const heightPercent = maxDayAmount > 0 ? Math.round((day.amount / maxDayAmount) * 100) : 0;
            const isOverLimit = day.amount > dailyLimit;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition">
                  {day.amount > 0 ? `₹${day.amount}` : '-'}
                </span>
                <div className="w-full max-w-[28px] h-full flex items-end">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isOverLimit
                        ? 'bg-rose-500 hover:bg-rose-400'
                        : 'bg-teal-500 hover:bg-teal-400'
                    }`}
                    style={{ height: `${Math.max(8, heightPercent)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Category Distribution
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Total: ₹{totalSpent.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="space-y-3">
          {categoryTotals.map((item) => {
            const conf = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG['Other'];
            return (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: conf.color }}
                    />
                    <span className="font-semibold text-slate-200">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">{item.percentage}%</span>
                    <span className="font-bold text-white">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: conf.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method Distribution */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-teal-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Payment Mode Breakdown
          </h3>
        </div>

        <div className="space-y-2.5">
          {paymentMethodStats.map((item, idx) => {
            const Icon = item.icon;
            const pct = totalSpent > 0 ? Math.round((item.amount / totalSpent) * 100) : 0;
            return (
              <div key={idx} className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{item.name}</span>
                    <span className="text-[10px] text-slate-400">{pct}% of total expenses</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-white">
                  ₹{item.amount.toLocaleString('en-IN')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Avoided Impulses List */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Avoided Impulse Wins (Saved Moments)
          </h3>
        </div>

        <div className="space-y-2">
          {impulsesAvoided.map((imp) => (
            <div
              key={imp.id}
              className="p-3 rounded-2xl bg-teal-950/20 border border-teal-900/30 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-white block">{imp.merchant}</span>
                <span className="text-[10px] text-teal-400/80 block mt-0.5">
                  {imp.reason || 'Paused and decided later'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 block">
                  +₹{imp.amount.toLocaleString('en-IN')} saved
                </span>
                <span className="text-[10px] text-slate-500">
                  {imp.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
