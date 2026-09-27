import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  CreditCard,
  Plus,
  ArrowUpDown,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Transaction, Category, PaymentMethod } from '../types';
import { CATEGORY_CONFIG } from '../data/mockData';

interface TransactionsScreenProps {
  transactions: Transaction[];
  onOpenEditExpense: (tx: Transaction) => void;
  onOpenAddExpense: () => void;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({
  transactions,
  onOpenEditExpense,
  onOpenAddExpense,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('All');

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tx.amount.toString().includes(searchQuery);

      const matchesCategory =
        selectedCategory === 'All' || tx.category === selectedCategory;

      const matchesPayment =
        selectedPaymentMethod === 'All' || tx.paymentMethod === selectedPaymentMethod;

      return matchesSearch && matchesCategory && matchesPayment;
    });
  }, [transactions, searchQuery, selectedCategory, selectedPaymentMethod]);

  const totalFilteredSpent = filtered.reduce((acc, tx) => acc + tx.amount, 0);

  // Group by Date: Today, Yesterday, or Older Date
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const grouped = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    filtered.forEach((tx) => {
      let groupKey = tx.date;
      if (tx.date === todayStr) {
        groupKey = 'Today';
      } else if (tx.date === yesterdayStr) {
        groupKey = 'Yesterday';
      } else {
        // Format to readable date
        try {
          const d = new Date(tx.date);
          groupKey = d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
        } catch {
          groupKey = tx.date;
        }
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(tx);
    });

    return groups;
  }, [filtered, todayStr, yesterdayStr]);

  return (
    <div className="pb-24 pt-2 w-full space-y-4">
      {/* Screen Title */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">Transactions</h1>
          <p className="text-xs text-slate-400">All expenses with instant categorization</p>
        </div>
        <button
          onClick={onOpenAddExpense}
          className="p-2 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition flex items-center gap-1 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by merchant, note, or ₹ amount..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
            selectedCategory === 'All'
              ? 'bg-teal-500 text-slate-950 border-teal-400'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          All Categories
        </button>
        {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedCategory === cat
                ? 'bg-teal-500 text-slate-950 border-teal-400'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Summary strip */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
        <span className="text-slate-400">
          Showing <span className="text-white font-bold">{filtered.length}</span> payment{filtered.length === 1 ? '' : 's'}
        </span>
        <span className="text-slate-400">
          Total: <span className="text-teal-400 font-bold">₹{totalFilteredSpent.toLocaleString('en-IN')}</span>
        </span>
      </div>

      {/* Grouped Transaction List */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
          <p className="text-sm font-bold text-slate-300">No matching transactions</p>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or category filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([dateLabel, items]) => {
            const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
            return (
              <div key={dateLabel} className="space-y-2">
                {/* Date Header */}
                <div className="flex items-center justify-between text-xs px-1 text-slate-400">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                    {dateLabel}
                  </span>
                  <span className="font-semibold text-slate-300">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-1.5">
                  {items.map((tx) => {
                    const conf = CATEGORY_CONFIG[tx.category] || CATEGORY_CONFIG['Other'];
                    return (
                      <div
                        key={tx.id}
                        onClick={() => onOpenEditExpense(tx)}
                        className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
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
                              {tx.notes && (
                                <>
                                  <span>•</span>
                                  <span className="truncate max-w-[120px] text-slate-500">
                                    "{tx.notes}"
                                  </span>
                                </>
                              )}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
