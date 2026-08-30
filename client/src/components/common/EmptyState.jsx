import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no active items to display at this moment.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="glass-panel rounded-2xl p-10 text-center flex flex-col items-center justify-center border border-slate-800/80 my-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center mb-4 text-slate-400">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-medium text-sm transition-all shadow-lg shadow-crimson-900/40"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
