import React from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  GitCompare,
  ShieldCheck,
  Zap,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { GlassCard } from '../components/common/GlassCard';
import { SentimentBadge } from '../components/common/SentimentBadge';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      {/* Ambient background blur circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-cyan-500/15 dark:bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/15 dark:bg-purple-500/10 rounded-full blur-[140px]" />
      </div>

      <Navbar showSidebarToggle={false} />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mx-auto mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>Aspect-Based Sentiment Analysis with NLP</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
          Turn Customer Opinions into{' '}
          <span className="bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Actionable Intelligence
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          ReviewIQ AI dissects complex customer reviews to uncover fine-grained sentiment across
          individual features—camera, battery, display, and speed—without reading hundreds of reviews manually.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/analyzer"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Try Live Review Analyzer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold text-base transition-all"
          >
            Explore Dashboard
          </Link>
        </div>

        {/* Interactive Example Review Analysis Showcase */}
        <div className="mt-16 max-w-4xl mx-auto w-full">
          <GlassCard className="p-6 sm:p-8 text-left border border-cyan-500/30 shadow-2xl relative overflow-hidden" glow="cyan">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-mono text-slate-400">Live ABSA Pipeline Execution</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                Overall: Mixed
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
                Sample Customer Review
              </p>
              <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 italic bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                "The camera is excellent and the display looks beautiful, but the battery drains quickly and the price is too high."
              </p>
            </div>

            {/* Extracted Aspects Grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Aspect 1</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">Camera</p>
                <div className="mt-2">
                  <SentimentBadge sentiment="Positive" size="sm" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Aspect 2</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">Display</p>
                <div className="mt-2">
                  <SentimentBadge sentiment="Positive" size="sm" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Aspect 3</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">Battery</p>
                <div className="mt-2">
                  <SentimentBadge sentiment="Negative" size="sm" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Aspect 4</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">Price</p>
                <div className="mt-2">
                  <SentimentBadge sentiment="Negative" size="sm" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Core System Architecture</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Engineered with modern NLP methodologies and a complete full-stack framework.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6" hoverEffect>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">12 Canonical Aspects</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Detects camera, battery, display, performance, price, design, build quality, audio, software, connectivity, charging, and durability.
            </p>
          </GlassCard>

          <GlassCard className="p-6" hoverEffect>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Real NLP Pipeline</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Combines TF-IDF feature extraction, balanced Logistic Regression, clause segmentation, and negation preservation rules.
            </p>
          </GlassCard>

          <GlassCard className="p-6" hoverEffect>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <GitCompare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Multi-Product Comparison</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Directly compares flagship smartphones feature-by-feature using real aggregated customer sentiment metrics.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/60 dark:border-white/10 py-8 px-4 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          ReviewIQ AI — AI-Based Product Review Analysis Using NLP
        </p>
        <p className="mt-1">
          Built with React, Vite, TypeScript, Tailwind CSS, FastAPI, and scikit-learn.
        </p>
        <p className="mt-1 text-slate-400">
          All sample reviews are synthetic academic demonstrations clearly labeled for testing.
        </p>
      </footer>
    </div>
  );
};
