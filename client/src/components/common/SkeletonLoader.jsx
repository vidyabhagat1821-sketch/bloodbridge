import React from 'react';

export const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-panel p-5 rounded-2xl animate-pulse space-y-3 border border-slate-800/80"
        >
          {type === 'card' && (
            <>
              <div className="flex items-center justify-between">
                <div className="h-5 bg-slate-800 rounded-lg w-1/3"></div>
                <div className="h-6 bg-slate-800 rounded-full w-16"></div>
              </div>
              <div className="h-4 bg-slate-800/60 rounded w-3/4"></div>
              <div className="h-4 bg-slate-800/40 rounded w-1/2"></div>
              <div className="pt-2 flex gap-3">
                <div className="h-8 bg-slate-800 rounded-xl w-24"></div>
                <div className="h-8 bg-slate-800/50 rounded-xl w-24"></div>
              </div>
            </>
          )}
          {type === 'table' && (
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="h-4 bg-slate-800 rounded w-1/4"></div>
              <div className="h-4 bg-slate-800/60 rounded w-1/4"></div>
              <div className="h-4 bg-slate-800/40 rounded w-1/4"></div>
              <div className="h-6 bg-slate-800 rounded-full w-16"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
