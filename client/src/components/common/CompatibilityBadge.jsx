import React from 'react';

export const BloodGroupBadge = ({ group, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1 font-bold',
    lg: 'text-lg px-4 py-1.5 font-extrabold'
  };

  const isUniversal = group === 'O-';
  const isUniversalRecip = group === 'AB+';

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-lg border font-mono ${sizeClasses[size] || sizeClasses.md} ${
      isUniversal
        ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 shadow-sm shadow-rose-900/50'
        : isUniversalRecip
        ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
        : 'bg-slate-900/80 border-slate-700/80 text-slate-200'
    } ${className}`}>
      <span>{group || 'Unknown'}</span>
      {isUniversal && (
        <span className="text-[9px] uppercase font-sans tracking-tight text-rose-400 font-semibold">
          Universal
        </span>
      )}
    </div>
  );
};

export const UrgencyBadge = ({ urgency }) => {
  const u = urgency?.toUpperCase() || 'NORMAL';

  if (u === 'CRITICAL') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        CRITICAL STAT
      </span>
    );
  }

  if (u === 'URGENT') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        URGENT
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
      STANDARD
    </span>
  );
};
