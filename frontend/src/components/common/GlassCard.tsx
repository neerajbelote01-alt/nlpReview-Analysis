import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glow = 'none',
  ...props
}) => {
  const { glassEnabled } = useTheme();

  let glowClass = '';
  if (glow === 'cyan') glowClass = 'hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]';
  if (glow === 'purple') glowClass = 'hover:shadow-[0_0_25px_rgba(139,92,246,0.25)]';
  if (glow === 'emerald') glowClass = 'hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]';
  if (glow === 'amber') glowClass = 'hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]';

  const baseStyle = glassEnabled
    ? 'glass-panel rounded-2xl shadow-glass-sm dark:shadow-glass-dark backdrop-blur-md'
    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm';

  const hoverStyle = hoverEffect
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg'
    : '';

  return (
    <div
      className={`${baseStyle} ${hoverStyle} ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
