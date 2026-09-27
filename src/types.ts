export type Category =
  | 'Food'
  | 'Groceries'
  | 'Travel'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Education'
  | 'Subscriptions'
  | 'Other';

export type PaymentMethod =
  | 'UPI'
  | 'Cash'
  | 'Debit Card'
  | 'Credit Card'
  | 'Bank Transfer'
  | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  merchant: string;
  paymentMethod: PaymentMethod;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notes?: string;
  isSimulated?: boolean;
  createdAt: number;
}

export interface BudgetSettings {
  dailyLimit: number;
  warningThreshold: number; // 70, 80, 90, 100
  weeklyBudget: number;
  monthlyBudget: number;
  upiGuardEnabled: boolean;
  saveModeStrictness: 'gentle' | 'balanced' | 'strict';
}

export interface CategoryBudget {
  category: Category;
  monthlyLimit: number;
}

export interface ImpulseAvoided {
  id: string;
  amount: number;
  merchant: string;
  category: Category;
  date: string;
  timestamp: number;
  reason?: string;
}

export interface UserProfile {
  name: string;
  streakDays: number;
  lastActiveDate: string;
  language: 'English' | 'Hinglish' | 'Hindi';
  theme: 'dark' | 'light';
  monthlySavingsTarget: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'warning' | 'celebration' | 'info' | 'streak';
}
