import React from 'react';

interface SentimentBadgeProps {
  sentiment: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({
  sentiment,
  size = 'md',
  showDot = true,
}) => {
  const norm = (sentiment || '').toLowerCase();

  let colorClasses = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  let dotColor = 'bg-slate-400';

  if (norm.includes('pos')) {
    colorClasses = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    dotColor = 'bg-emerald-500';
  } else if (norm.includes('neg')) {
    colorClasses = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
    dotColor = 'bg-rose-500';
  } else if (norm.includes('mix')) {
    colorClasses = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-500';
  } else if (norm.includes('neu')) {
    colorClasses = 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30';
    dotColor = 'bg-sky-400';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-medium',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition-all ${colorClasses} ${sizeClasses}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />}
      <span className="capitalize">{sentiment}</span>
    </span>
  );
};
