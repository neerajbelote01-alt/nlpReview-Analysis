import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, glassEnabled, setGlassEnabled, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl transition-all duration-200 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
        title="Change theme"
        aria-label="Theme selector"
      >
        {theme === 'system' ? (
          <Laptop className="w-4 h-4 text-cyan-500" />
        ) : resolvedTheme === 'dark' ? (
          <Moon className="w-4 h-4 text-purple-400" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 rounded-xl glass-dropdown shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Theme Mode
          </div>

          <button
            onClick={() => {
              setTheme('light');
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${
              theme === 'light' ? 'text-cyan-600 dark:text-cyan-400 font-medium' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light</span>
          </button>

          <button
            onClick={() => {
              setTheme('dark');
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${
              theme === 'dark' ? 'text-cyan-600 dark:text-cyan-400 font-medium' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <Moon className="w-4 h-4 text-purple-400" />
            <span>Dark</span>
          </button>

          <button
            onClick={() => {
              setTheme('system');
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${
              theme === 'system' ? 'text-cyan-600 dark:text-cyan-400 font-medium' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <Laptop className="w-4 h-4 text-cyan-500" />
            <span>System Default</span>
          </button>

          <div className="my-1 border-t border-slate-200 dark:border-white/10" />

          <div className="px-3 py-1 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Visual Style
          </div>

          <button
            onClick={() => setGlassEnabled(!glassEnabled)}
            className="w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-300"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Liquid Glass</span>
            </span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                glassEnabled
                  ? 'bg-cyan-500/20 text-cyan-500 dark:text-cyan-300'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {glassEnabled ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
