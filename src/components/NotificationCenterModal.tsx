import React from 'react';
import { X, Bell, CheckCheck, Flame, ShieldAlert, Sparkles, Info } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationCenterModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'warning':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'celebration':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading">Notifications & Alerts</h2>
              <p className="text-xs text-slate-400">Budget reminders & impulse saves</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between py-2.5 text-xs text-slate-400 border-b border-slate-800/60">
          <span>{notifications.length} updates</span>
          <div className="flex gap-3">
            <button
              onClick={onMarkAllRead}
              className="text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
            <button
              onClick={onClearAll}
              className="text-slate-400 hover:text-rose-400 font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto space-y-2 py-3">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No new alerts. Your spending is in peaceful order! 🧘
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition ${
                  n.read
                    ? 'bg-slate-800/40 border-slate-800 text-slate-300'
                    : 'bg-slate-800/90 border-teal-500/30 text-white shadow-xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700/60 shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold font-heading">{n.title}</h4>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
