import React from 'react';
import {
  Home,
  Receipt,
  BarChart3,
  Sliders,
  User,
  Plus,
  Zap,
  Bell,
  Keyboard,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { NavTab } from './BottomNav';
import { SpendPauseLogo } from './SpendPauseLogo';

interface DesktopHeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAddExpense: () => void;
  onOpenSimulateUpi: () => void;
  onOpenNotifications: () => void;
  onOpenShortcuts: () => void;
  unreadCount: number;
  upiGuardEnabled: boolean;
  onToggleUpiGuard: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddExpense,
  onOpenSimulateUpi,
  onOpenNotifications,
  onOpenShortcuts,
  unreadCount,
  upiGuardEnabled,
  onToggleUpiGuard,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Dashboard', icon: Home, key: '1' },
    { id: 'transactions' as NavTab, label: 'Transactions', icon: Receipt, key: '2' },
    { id: 'insights' as NavTab, label: 'Insights & Pause Impact', icon: BarChart3, key: '3' },
    { id: 'budgets' as NavTab, label: 'Budgets & Limits', icon: Sliders, key: '4' },
    { id: 'profile' as NavTab, label: 'Settings', icon: User, key: '5' },
  ];

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <SpendPauseLogo size="sm" showText={true} />

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800/80">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 shadow-sm border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={`Switch to ${tab.label} (Press ${tab.key})`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className="hidden lg:inline text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                    {tab.key}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: UPI Guard, Notifications, Shortcuts, Add Expense */}
        <div className="flex items-center gap-3">
          {/* UPI Guard Status Toggle */}
          <button
            onClick={onToggleUpiGuard}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition border ${
              upiGuardEnabled
                ? 'bg-teal-500/10 text-teal-300 border-teal-500/30 hover:bg-teal-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
            title="Toggle UPI Impulse Guard (Auto-detects before spending)"
          >
            {upiGuardEnabled ? (
              <ShieldCheck className="w-4 h-4 text-teal-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-slate-500" />
            )}
            <span className="text-[11px]">UPI Guard: {upiGuardEnabled ? 'ACTIVE' : 'OFF'}</span>
          </button>

          {/* Test Guard Button */}
          <button
            onClick={onOpenSimulateUpi}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition"
            title="Simulate a UPI transaction from PhonePe/GPay to test the Pause Guard (Press S)"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Test UPI</span>
            <span className="hidden xl:inline text-[9px] font-mono px-1 rounded bg-amber-500/20 text-amber-200">
              S
            </span>
          </button>

          {/* Keyboard Shortcuts Helper */}
          <button
            onClick={onOpenShortcuts}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
            title="View Keyboard Shortcuts (Press ?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
            title="Notifications & Spend Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Add Expense Button */}
          <button
            onClick={onOpenAddExpense}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-900/30 flex items-center gap-1.5 transition active:scale-95"
            title="Add a new expense manually (Press N)"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Expense</span>
            <span className="hidden xl:inline text-[9px] font-mono px-1 py-0.2 rounded bg-teal-900/60 text-teal-100">
              N
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
