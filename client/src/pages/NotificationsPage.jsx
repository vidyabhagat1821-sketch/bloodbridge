import React from 'react';
import {
  Bell,
  CheckCircle2,
  AlertOctagon,
  MessageSquare,
  Clock,
  CheckCheck
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { EmptyState } from '../components/common/EmptyState';
import { Link } from 'react-router-dom';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-crimson-500" />
            Emergency Alerts & Notifications
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch alerts, donor acceptance responses, and system updates
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You are completely caught up. New emergency alerts and responses will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                !n.isRead
                  ? 'bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-950/20'
                  : 'glass-panel border-slate-800 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    n.type === 'EMERGENCY_REQUEST'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {n.type === 'EMERGENCY_REQUEST' ? (
                      <AlertOctagon className="w-5 h-5 animate-pulse" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-crimson-500 animate-ping"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {n.requestId && (
                  <Link
                    to="/requests"
                    className="px-3 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs shrink-0 transition-colors"
                  >
                    View Request
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
