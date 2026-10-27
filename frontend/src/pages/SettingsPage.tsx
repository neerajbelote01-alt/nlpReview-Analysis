import React from 'react';
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Sparkles,
  User,
  Shield,
  Info,
  LogOut,
  BrainCircuit,
  Cpu,
  Layers,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, glassEnabled, setGlassEnabled } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System Preferences & Documentation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Settings & About ReviewIQ AI</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize UI aesthetics, inspect user profile status, and review the natural language processing methodology.
        </p>
      </div>

      {/* Visual Preferences */}
      <GlassCard className="p-6 space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-500" />
          <span>Display & Theme Settings</span>
        </h3>

        {/* Theme mode buttons */}
        <div>
          <label className="text-xs font-semibold uppercase font-mono text-slate-400 block mb-2">
            Active Theme Preference
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                theme === 'light'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 font-bold'
                  : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="text-xs">Light Mode</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'border-purple-500 bg-purple-500/10 text-purple-400 font-bold'
                  : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Moon className="w-5 h-5 text-purple-400" />
              <span className="text-xs">Dark Mode</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                theme === 'system'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 font-bold'
                  : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Laptop className="w-5 h-5 text-cyan-500" />
              <span className="text-xs">System Default</span>
            </button>
          </div>
        </div>

        {/* Liquid Glass Toggle */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Liquid Glassmorphism Effects
            </p>
            <p className="text-xs text-slate-400">
              Enables translucent backdrop blur, subtle borders, and futuristic lighting
            </p>
          </div>
          <button
            onClick={() => setGlassEnabled(!glassEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
              glassEnabled
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}
          >
            {glassEnabled ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>
      </GlassCard>

      {/* Account Details */}
      {isAuthenticated && user && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-purple-400" />
            <span>Account Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-slate-400 block mb-0.5">Full Name</span>
              <span className="text-sm font-sans font-bold text-slate-800 dark:text-slate-200">
                {user.full_name}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-slate-400 block mb-0.5">Email Address</span>
              <span className="text-sm font-sans font-bold text-slate-800 dark:text-slate-200">
                {user.email}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-medium text-xs transition-colors inline-flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>
        </GlassCard>
      )}

      {/* About & Methodology Section */}
      <GlassCard className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <BrainCircuit className="w-6 h-6 text-cyan-500" />
          <h2 className="text-lg font-bold">About ReviewIQ AI & NLP Methodology</h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong className="text-slate-800 dark:text-slate-200">ReviewIQ AI</strong> is a full-stack academic
            demonstration platform built to solve the challenge of fine-grained aspect-based sentiment analysis
            (ABSA) in customer product reviews.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5">
              <span className="font-bold text-cyan-500 text-xs uppercase font-mono block">
                NLP Pipeline
              </span>
              <p className="text-xs leading-relaxed">
                Utilizes contrastive clause segmentation (splitting on "but", "however", "although", "yet"),
                windowed negation handling (e.g., "not bad" flips to Positive, "not durable" flips to Negative),
                and TF-IDF unigram/bigram feature extraction.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5">
              <span className="font-bold text-purple-400 text-xs uppercase font-mono block">
                Machine Learning Baseline
              </span>
              <p className="text-xs leading-relaxed">
                Classified using a balanced multi-class Logistic Regression estimator trained and evaluated with
                stratified holdout cross-validation. Calibrated probabilities produce trustworthy confidence scores.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2 mt-4 text-xs">
            <span className="font-bold text-amber-600 dark:text-amber-400 uppercase font-mono block">
              Ethical & Responsible AI Limitations
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
              <li>
                <strong>Synthetic Demonstrations:</strong> All initial product reviews are synthetic demonstrations
                engineered for diverse vocabulary and testing. They do not reflect genuine market sentiment for commercial products.
              </li>
              <li>
                <strong>Sarcasm and Slang:</strong> Like all statistical NLP models, extreme sarcasm, heavy slang, or typos
                may result in misclassification.
              </li>
              <li>
                <strong>Sample Size Sensitivity:</strong> Aspect scores and complaint frequencies depend directly on the
                volume of reviews present in the dataset.
              </li>
            </ul>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
