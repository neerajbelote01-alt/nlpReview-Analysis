import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  Sparkles,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  History,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, showSidebarToggle = true }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          {showSidebarToggle && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-600 via-purple-600 to-indigo-600 dark:from-cyan-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                ReviewIQ AI
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline -mt-1">
                ABSA Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop quick links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link to="/dashboard" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            Dashboard
          </Link>
          <Link to="/analyzer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>Analyzer</span>
          </Link>
          <Link to="/products" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            Catalog
          </Link>
          <Link to="/compare" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            Compare
          </Link>
          <Link to="/model-evaluation" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            Evaluation
          </Link>
        </nav>

        {/* Right: Controls & Auth */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-200 text-sm font-medium"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">{user.full_name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl glass-dropdown shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-200 dark:border-white/10">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {user.full_name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-mono">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/history"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <History className="w-4 h-4 text-cyan-500" />
                    <span>My History</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-purple-400" />
                    <span>Settings & About</span>
                  </Link>

                  <div className="my-1 border-t border-slate-200 dark:border-white/10" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-500 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-sm font-medium rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-cyan-500/20 hover:opacity-95 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
