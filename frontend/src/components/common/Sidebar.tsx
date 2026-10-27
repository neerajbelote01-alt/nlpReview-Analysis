import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  FileSpreadsheet,
  Smartphone,
  Layers,
  GitCompare,
  AlertTriangle,
  Cpu,
  Database,
  History,
  Info,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Review Analyzer', path: '/analyzer', icon: Sparkles, highlight: true },
  { name: 'Bulk Analysis', path: '/bulk-analysis', icon: FileSpreadsheet },
  { name: 'Product Catalog', path: '/products', icon: Smartphone },
  { name: 'Aspect Analytics', path: '/aspects', icon: Layers },
  { name: 'Comparison', path: '/compare', icon: GitCompare },
  { name: 'Complaints', path: '/complaints', icon: AlertTriangle },
  { name: 'Model Evaluation', path: '/model-evaluation', icon: Cpu },
  { name: 'Dataset Hub', path: '/dataset', icon: Database },
  { name: 'My History', path: '/history', icon: History, requireAuth: true },
  { name: 'Settings & About', path: '/settings', icon: Info },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();

  const navContent = (
    <div className="flex flex-col h-full py-4">
      <div className="px-4 mb-3 flex items-center justify-between lg:hidden">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-3 space-y-1 flex-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          if (item.requireAuth && !isAuthenticated) {
            return null;
          }
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-white/5'
                }`
              }
            >
              <Icon
                className={`w-4 h-4 transition-transform ${
                  item.highlight ? 'text-cyan-500' : ''
                }`}
              />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* College Project Disclaimer Card */}
      <div className="p-3 mx-3 mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-xs text-slate-500 dark:text-slate-400">
        <p className="font-semibold text-cyan-600 dark:text-cyan-400 mb-1">Academic ABSA Demo</p>
        <p className="leading-relaxed">
          TF-IDF & Logistic Regression with multi-aspect contextual classification.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 glass-nav border-r border-slate-200/60 dark:border-white/10 min-h-[calc(100vh-4rem)]">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 glass-dropdown shadow-2xl z-50">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
