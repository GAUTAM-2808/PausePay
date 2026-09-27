import React, { useState, useEffect } from 'react';
import {
  Transaction,
  BudgetSettings,
  CategoryBudget,
  ImpulseAvoided,
  UserProfile,
  NotificationItem,
  Category,
  PaymentMethod,
} from './types';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_SETTINGS,
  INITIAL_CATEGORY_BUDGETS,
  INITIAL_USER_PROFILE,
  INITIAL_IMPULSES_AVOIDED,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { HomeScreen } from './screens/HomeScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { BudgetsScreen } from './screens/BudgetsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { BottomNav, NavTab } from './components/BottomNav';
import { DesktopHeader } from './components/DesktopHeader';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { AddExpenseModal } from './components/AddExpenseModal';
import { EditExpenseModal } from './components/EditExpenseModal';
import { PauseInterventionModal } from './components/PauseInterventionModal';
import { SimulateUpiModal } from './components/SimulateUpiModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';

const STORAGE_KEYS = {
  TRANSACTIONS: 'spendpause_transactions_v1',
  SETTINGS: 'spendpause_settings_v1',
  CATEGORY_BUDGETS: 'spendpause_category_budgets_v1',
  PROFILE: 'spendpause_profile_v1',
  IMPULSES: 'spendpause_impulses_v1',
  NOTIFICATIONS: 'spendpause_notifications_v1',
};

export default function App() {
  // 1. Persistent State Initialization
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [settings, setSettings] = useState<BudgetSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORY_BUDGETS);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORY_BUDGETS;
    } catch {
      return INITIAL_CATEGORY_BUDGETS;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [impulsesAvoided, setImpulsesAvoided] = useState<ImpulseAvoided[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.IMPULSES);
      return saved ? JSON.parse(saved) : INITIAL_IMPULSES_AVOIDED;
    } catch {
      return INITIAL_IMPULSES_AVOIDED;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // 2. Active Tab & Modals
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pending Expense for Pause Intercept
  const [pendingExpense, setPendingExpense] = useState<{
    amount: number;
    merchant: string;
    category: Category;
    paymentMethod: PaymentMethod;
    date: string;
    time: string;
    notes?: string;
  } | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      localStorage.setItem(STORAGE_KEYS.CATEGORY_BUDGETS, JSON.stringify(categoryBudgets));
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
      localStorage.setItem(STORAGE_KEYS.IMPULSES, JSON.stringify(impulsesAvoided));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [transactions, settings, categoryBudgets, userProfile, impulsesAvoided, notifications]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement;

      if (e.key === 'Escape') {
        setIsAddOpen(false);
        setIsEditOpen(false);
        setIsPauseOpen(false);
        setIsSimulateOpen(false);
        setIsNotificationsOpen(false);
        setIsShortcutsOpen(false);
        return;
      }

      if (isInput) return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsAddOpen(true);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setIsSimulateOpen(true);
      } else if (e.key === '1') {
        setCurrentTab('home');
      } else if (e.key === '2') {
        setCurrentTab('transactions');
      } else if (e.key === '3') {
        setCurrentTab('insights');
      } else if (e.key === '4') {
        setCurrentTab('budgets');
      } else if (e.key === '5') {
        setCurrentTab('profile');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySpent = transactions
    .filter((tx) => tx.date === todayStr)
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalAvoidedAmount = impulsesAvoided.reduce((acc, i) => acc + i.amount, 0);
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // 3. Add Expense Handler
  const handleAddDirectExpense = (exp: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...exp,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: Date.now(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast('Expense added ✓');
  };

  // Check if expense should be intercepted by Pause Guard
  const handleRequestPauseCheck = (expense: {
    amount: number;
    merchant: string;
    category: Category;
    paymentMethod: PaymentMethod;
    date: string;
    time: string;
    notes?: string;
  }): boolean => {
    if (!settings.upiGuardEnabled) {
      return false;
    }

    const warningThresholdAmount = (settings.dailyLimit * settings.warningThreshold) / 100;
    const projectedToday = todaySpent + expense.amount;

    // Trigger if projected total reaches or crosses warning threshold
    if (projectedToday >= warningThresholdAmount) {
      setPendingExpense(expense);
      setIsAddOpen(false); // Close add modal
      setIsPauseOpen(true); // Open signature pause warning!
      return true;
    }

    return false;
  };

  // When user confirms they really want to proceed with the expense
  const handleConfirmPauseExpense = () => {
    if (pendingExpense) {
      handleAddDirectExpense(pendingExpense);
      setPendingExpense(null);
      setIsPauseOpen(false);
    }
  };

  // When user decides "Maybe later" -> Saves money!
  const handleCancelPauseExpense = (savedAmount: number, merchant: string, category: Category) => {
    const avoidedItem: ImpulseAvoided = {
      id: `imp-${Date.now()}`,
      amount: savedAmount,
      merchant: merchant || 'Mindful Avoided Spend',
      category: category || 'Food',
      date: todayStr,
      timestamp: Date.now(),
      reason: 'Paused and decided not to purchase',
    };

    setImpulsesAvoided((prev) => [avoidedItem, ...prev]);

    // Add celebration notification
    const celebrationNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Mindful Pause Saved Money! 🎉',
      message: `You decided against spending ₹${savedAmount.toLocaleString('en-IN')} on ${merchant || 'impulse purchase'}. Great discipline!`,
      timestamp: Date.now(),
      read: false,
      type: 'celebration',
    };
    setNotifications((prev) => [celebrationNotif, ...prev]);

    setPendingExpense(null);
    setIsPauseOpen(false);
    showToast(`Great choice! You just saved ₹${savedAmount.toLocaleString('en-IN')} 🎉`);
  };

  // 4. Update / Delete Expense
  const handleUpdateExpense = (updated: Transaction) => {
    setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    showToast('Expense updated ✓');
  };

  const handleDeleteExpense = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Expense deleted');
  };

  // 5. Simulation Handler
  const handleSimulateUpi = (amount: number, merchant: string, category: Category, appName: string) => {
    const simExpense = {
      amount,
      merchant: `${merchant} (${appName})`,
      category,
      paymentMethod: 'UPI' as PaymentMethod,
      date: todayStr,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: `Simulated via ${appName} Auto-Guard`,
    };

    const wasIntercepted = handleRequestPauseCheck(simExpense);
    if (!wasIntercepted) {
      handleAddDirectExpense(simExpense);
    }
  };

  // 6. Reset / Wipe data
  const handleResetDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setSettings(INITIAL_SETTINGS);
    setCategoryBudgets(INITIAL_CATEGORY_BUDGETS);
    setUserProfile(INITIAL_USER_PROFILE);
    setImpulsesAvoided(INITIAL_IMPULSES_AVOIDED);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('Reset to realistic Indian demo data ✓');
  };

  const handleClearAllData = () => {
    setTransactions([]);
    setImpulsesAvoided([]);
    setNotifications([]);
    localStorage.clear();
    showToast('All local data cleared');
  };

  const handleExportJson = () => {
    const exportData = {
      userProfile,
      settings,
      categoryBudgets,
      transactions,
      impulsesAvoided,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spendpause_backup_${todayStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Backup downloaded ✓');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Desktop Web App Navigation Header (hidden on mobile) */}
      <DesktopHeader
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAddExpense={() => setIsAddOpen(true)}
        onOpenSimulateUpi={() => setIsSimulateOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        unreadCount={unreadNotificationsCount}
        upiGuardEnabled={settings.upiGuardEnabled}
        onToggleUpiGuard={() =>
          setSettings((s) => ({ ...s, upiGuardEnabled: !s.upiGuardEnabled }))
        }
      />

      {/* Main Responsive App Container */}
      <main className="flex-1 w-full max-w-lg md:max-w-5xl mx-auto px-4 md:px-6 pt-2 md:pt-6">
        {currentTab === 'home' && (
          <HomeScreen
            transactions={transactions}
            settings={settings}
            userProfile={userProfile}
            totalAvoidedAmount={totalAvoidedAmount}
            unreadCount={unreadNotificationsCount}
            onOpenAddExpense={() => setIsAddOpen(true)}
            onOpenSimulateUpi={() => setIsSimulateOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenEditExpense={(tx) => {
              setSelectedTx(tx);
              setIsEditOpen(true);
            }}
            onUpdateDailyLimit={(newLimit) => setSettings((s) => ({ ...s, dailyLimit: newLimit }))}
            onToggleUpiGuard={() =>
              setSettings((s) => ({ ...s, upiGuardEnabled: !s.upiGuardEnabled }))
            }
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'transactions' && (
          <TransactionsScreen
            transactions={transactions}
            onOpenEditExpense={(tx) => {
              setSelectedTx(tx);
              setIsEditOpen(true);
            }}
            onOpenAddExpense={() => setIsAddOpen(true)}
          />
        )}

        {currentTab === 'insights' && (
          <InsightsScreen
            transactions={transactions}
            impulsesAvoided={impulsesAvoided}
            dailyLimit={settings.dailyLimit}
          />
        )}

        {currentTab === 'budgets' && (
          <BudgetsScreen
            settings={settings}
            categoryBudgets={categoryBudgets}
            transactions={transactions}
            onUpdateSettings={setSettings}
            onUpdateCategoryBudget={(cat, limit) =>
              setCategoryBudgets((prev) =>
                prev.map((c) => (c.category === cat ? { ...c, monthlyLimit: limit } : c))
              )
            }
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            userProfile={userProfile}
            settings={settings}
            totalAvoidedAmount={totalAvoidedAmount}
            totalExpensesCount={transactions.length}
            onUpdateProfile={(updated) => setUserProfile((p) => ({ ...p, ...updated }))}
            onToggleUpiGuard={() =>
              setSettings((s) => ({ ...s, upiGuardEnabled: !s.upiGuardEnabled }))
            }
            onResetDemoData={handleResetDemoData}
            onClearAllData={handleClearAllData}
            onExportJson={handleExportJson}
          />
        )}
      </main>

      {/* Floating Bottom Navigation for Mobile */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAddExpense={() => setIsAddOpen(true)}
      />

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddExpense={handleAddDirectExpense}
        onRequestPauseCheck={handleRequestPauseCheck}
      />

      <EditExpenseModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedTx(null);
        }}
        transaction={selectedTx}
        onUpdate={handleUpdateExpense}
        onDelete={handleDeleteExpense}
      />

      <PauseInterventionModal
        isOpen={isPauseOpen}
        onConfirm={handleConfirmPauseExpense}
        onCancel={handleCancelPauseExpense}
        pendingExpense={
          pendingExpense || {
            amount: 0,
            merchant: '',
            category: 'Food',
            paymentMethod: 'UPI',
          }
        }
        currentSpentToday={todaySpent}
        dailyLimit={settings.dailyLimit}
        warningThresholdPercent={settings.warningThreshold}
      />

      <SimulateUpiModal
        isOpen={isSimulateOpen}
        onClose={() => setIsSimulateOpen(false)}
        onSimulate={handleSimulateUpi}
        currentSpentToday={todaySpent}
        dailyLimit={settings.dailyLimit}
      />

      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onClearAll={() => setNotifications([])}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-teal-500 text-slate-950 font-bold text-xs shadow-xl shadow-teal-900/40 border border-teal-300 animate-in fade-in slide-in-from-top-2 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
