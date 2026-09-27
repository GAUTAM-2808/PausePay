import { Category, PaymentMethod, Transaction, BudgetSettings, CategoryBudget, ImpulseAvoided, UserProfile, NotificationItem } from '../types';

export const CATEGORY_CONFIG: Record<Category, { color: string; bg: string; icon: string; nameHindi: string }> = {
  Food: { color: '#F97316', bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: 'Utensils', nameHindi: 'खाना / फ़ूड' },
  Groceries: { color: '#10B981', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: 'ShoppingBag', nameHindi: 'राशन / ग्रॉसरी' },
  Travel: { color: '#3B82F6', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: 'Car', nameHindi: 'यात्रा / कैब' },
  Shopping: { color: '#EC4899', bg: 'bg-pink-500/10 text-pink-400 border-pink-500/20', icon: 'ShoppingBag', nameHindi: 'शॉपिंग' },
  Bills: { color: '#8B5CF6', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: 'Receipt', nameHindi: 'बिल / रिचार्ज' },
  Entertainment: { color: '#EAB308', bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: 'Film', nameHindi: 'मनोरंजन' },
  Health: { color: '#EF4444', bg: 'bg-red-500/10 text-red-400 border-red-500/20', icon: 'HeartPulse', nameHindi: 'दवा / स्वास्थ्य' },
  Education: { color: '#06B6D4', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', icon: 'GraduationCap', nameHindi: 'शिक्षा' },
  Subscriptions: { color: '#6366F1', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: 'Sparkles', nameHindi: 'सब्सक्रिप्शन' },
  Other: { color: '#64748B', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: 'CircleEllipsis', nameHindi: 'अन्य खर्च' },
};

export const QUICK_MERCHANTS: { name: string; category: Category; defaultAmount?: number }[] = [
  { name: 'Chai / Tapri', category: 'Food', defaultAmount: 20 },
  { name: 'Zepto', category: 'Groceries', defaultAmount: 149 },
  { name: 'Blinkit', category: 'Groceries', defaultAmount: 210 },
  { name: 'Swiggy', category: 'Food', defaultAmount: 280 },
  { name: 'Zomato', category: 'Food', defaultAmount: 350 },
  { name: 'Uber Auto', category: 'Travel', defaultAmount: 85 },
  { name: 'Ola Cab', category: 'Travel', defaultAmount: 180 },
  { name: 'Amazon', category: 'Shopping', defaultAmount: 699 },
  { name: 'Starbucks', category: 'Food', defaultAmount: 380 },
  { name: 'D-Mart Supermarket', category: 'Groceries', defaultAmount: 1250 },
  { name: 'Electricity Bill', category: 'Bills', defaultAmount: 1100 },
  { name: 'Netflix / Hotstar', category: 'Subscriptions', defaultAmount: 499 },
];

export const INITIAL_SETTINGS: BudgetSettings = {
  dailyLimit: 1000,
  warningThreshold: 80, // Warn at 80% (₹800)
  weeklyBudget: 7000,
  monthlyBudget: 30000,
  upiGuardEnabled: true,
  saveModeStrictness: 'balanced',
};

export const INITIAL_CATEGORY_BUDGETS: CategoryBudget[] = [
  { category: 'Food', monthlyLimit: 8000 },
  { category: 'Groceries', monthlyLimit: 6000 },
  { category: 'Travel', monthlyLimit: 4000 },
  { category: 'Shopping', monthlyLimit: 5000 },
  { category: 'Bills', monthlyLimit: 4000 },
  { category: 'Entertainment', monthlyLimit: 2000 },
  { category: 'Health', monthlyLimit: 2000 },
  { category: 'Subscriptions', monthlyLimit: 1500 },
  { category: 'Education', monthlyLimit: 2000 },
  { category: 'Other', monthlyLimit: 1500 },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Priya Sharma',
  streakDays: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  language: 'Hinglish',
  theme: 'dark',
  monthlySavingsTarget: 10000,
};

export const INITIAL_IMPULSES_AVOIDED: ImpulseAvoided[] = [
  {
    id: 'imp-1',
    amount: 450,
    merchant: 'Zomato Midnight Dessert',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now() - 3600000 * 4,
    reason: 'Paused during midnight cravings',
  },
  {
    id: 'imp-2',
    amount: 1299,
    merchant: 'Zara Sale T-Shirt',
    category: 'Shopping',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    timestamp: Date.now() - 86400000,
    reason: 'Decided 24h wait rule was better',
  },
  {
    id: 'imp-3',
    amount: 199,
    merchant: 'Blinkit Instant Munchies',
    category: 'Groceries',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    timestamp: Date.now() - 86400000 * 2,
    reason: 'Realized home pantry already had snacks',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '5-Day Safe Streak! 🔥',
    message: "Shabash! You've stayed under your daily budget 5 days straight. Total ₹1,948 saved!",
    timestamp: Date.now() - 1800000,
    read: false,
    type: 'streak',
  },
  {
    id: 'notif-2',
    title: 'UPI Auto-Guard Active 🛡️',
    message: 'Guarding incoming micro-payments across PhonePe, Google Pay, and Paytm.',
    timestamp: Date.now() - 7200000,
    read: true,
    type: 'info',
  },
  {
    id: 'notif-3',
    title: 'Mindful Pause Success ✨',
    message: 'You skipped ₹450 on Zomato earlier today. Your wallet thanks you!',
    timestamp: Date.now() - 14400000,
    read: true,
    type: 'celebration',
  },
];

const todayStr = new Date().toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgoStr = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];
const threeDaysAgoStr = new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0];
const fourDaysAgoStr = new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Today
  {
    id: 'tx-1',
    amount: 140,
    category: 'Food',
    merchant: 'Chaayos Breakfast',
    paymentMethod: 'UPI',
    date: todayStr,
    time: '09:15',
    notes: 'Ginger chai and bun maska',
    createdAt: Date.now() - 1000 * 60 * 180,
  },
  {
    id: 'tx-2',
    amount: 220,
    category: 'Travel',
    merchant: 'Uber Auto to Office',
    paymentMethod: 'UPI',
    date: todayStr,
    time: '10:05',
    notes: 'Morning traffic surge',
    createdAt: Date.now() - 1000 * 60 * 120,
  },
  {
    id: 'tx-3',
    amount: 360,
    category: 'Food',
    merchant: 'Swiggy Lunch Bowl',
    paymentMethod: 'UPI',
    date: todayStr,
    time: '13:40',
    notes: 'Dal makhani combo meal',
    createdAt: Date.now() - 1000 * 60 * 30,
  },

  // Yesterday
  {
    id: 'tx-4',
    amount: 380,
    category: 'Groceries',
    merchant: 'Blinkit Instant',
    paymentMethod: 'UPI',
    date: yesterdayStr,
    time: '19:20',
    notes: 'Milk, bread, curd, biscuits',
    createdAt: Date.now() - 86400000 - 3600000,
  },
  {
    id: 'tx-5',
    amount: 180,
    category: 'Travel',
    merchant: 'Metro Smart Card',
    paymentMethod: 'UPI',
    date: yesterdayStr,
    time: '09:00',
    notes: 'Card recharge via UPI',
    createdAt: Date.now() - 86400000 - 36000000,
  },
  {
    id: 'tx-6',
    amount: 240,
    category: 'Food',
    merchant: 'Subway Wrap',
    paymentMethod: 'UPI',
    date: yesterdayStr,
    time: '14:10',
    createdAt: Date.now() - 86400000 - 20000000,
  },

  // 2 days ago
  {
    id: 'tx-7',
    amount: 650,
    category: 'Shopping',
    merchant: 'Amazon Basics Cable',
    paymentMethod: 'UPI',
    date: twoDaysAgoStr,
    time: '21:30',
    notes: 'Type-C braided cable',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'tx-8',
    amount: 120,
    category: 'Food',
    merchant: 'Sharma Ji Tapri',
    paymentMethod: 'Cash',
    date: twoDaysAgoStr,
    time: '17:15',
    notes: 'Chai + Samosa with team',
    createdAt: Date.now() - 86400000 * 2 - 10000000,
  },

  // 3 days ago
  {
    id: 'tx-9',
    amount: 499,
    category: 'Bills',
    merchant: 'Jio 5G Prepaid Recharge',
    paymentMethod: 'UPI',
    date: threeDaysAgoStr,
    time: '11:00',
    notes: '84-day data pack',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'tx-10',
    amount: 320,
    category: 'Entertainment',
    merchant: 'PVR Inox Popcorn',
    paymentMethod: 'Debit Card',
    date: threeDaysAgoStr,
    time: '20:15',
    createdAt: Date.now() - 86400000 * 3 - 5000000,
  },

  // 4 days ago
  {
    id: 'tx-11',
    amount: 780,
    category: 'Groceries',
    merchant: 'Nature Basket',
    paymentMethod: 'UPI',
    date: fourDaysAgoStr,
    time: '18:45',
    createdAt: Date.now() - 86400000 * 4,
  },
];
