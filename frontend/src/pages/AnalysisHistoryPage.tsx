import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Trash2,
  Search,
  Sparkles,
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { analysisApi } from '../services/api';
import { AnalysisResult } from '../types';
import { useAuth } from '../context/AuthContext';

export const AnalysisHistoryPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [search, setSearch] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await analysisApi.getHistory({
        search: search.trim() || undefined,
        sentiment: sentimentFilter || undefined,
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [isAuthenticated, sentimentFilter]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this saved analysis?')) return;
    try {
      await analysisApi.deleteAnalysis(id);
      setHistory(history.filter((h) => h.id !== id));
    } catch (err) {
      alert('Failed to delete analysis record.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 glass-panel rounded-2xl">
        <Lock className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold">Authentication Required</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6 leading-relaxed">
          Your review analysis history is privately isolated and requires an account to view and manage.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-sm transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-medium transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-xs font-semibold mb-2">
          <History className="w-3.5 h-3.5" />
          <span>Private User Workspace</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Saved Analysis History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Private analyses saved by <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.full_name}</span>. Securely isolated from other accounts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchHistory()}
            placeholder="Search saved reviews by text..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] text-sm focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none w-full sm:w-auto"
          >
            <option value="">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
            <option value="Mixed">Mixed</option>
            <option value="Neutral">Neutral</option>
          </select>
          <button
            onClick={fetchHistory}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </GlassCard>

      {/* History Items Feed */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl space-y-3">
          <Sparkles className="w-10 h-10 text-cyan-500 mx-auto" />
          <h3 className="text-base font-bold">No saved analyses found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When you run reviews through the Review Analyzer with "Save to history" checked, they will appear here.
          </p>
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-semibold hover:bg-cyan-600 transition-colors"
          >
            <span>Analyze a Review Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <GlassCard key={item.id} className="p-6 space-y-4" hoverEffect>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <SentimentBadge sentiment={item.overall_sentiment} size="md" />
                  {item.product_name && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                      {item.product_name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  {item.analysis_timestamp && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.analysis_timestamp).toLocaleDateString()}</span>
                    </span>
                  )}

                  {item.id && (
                    <button
                      onClick={() => handleDelete(item.id!)}
                      className="text-rose-500 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Delete this analysis"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
                "{item.review_text}"
              </p>

              {/* Detected Aspect Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-mono text-slate-400">Aspects:</span>
                {item.aspect_results.map((asp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                  >
                    <span className="font-semibold">{asp.aspect_name}:</span>
                    <span
                      className={`font-bold ${
                        asp.sentiment === 'Positive'
                          ? 'text-emerald-500'
                          : asp.sentiment === 'Negative'
                          ? 'text-rose-500'
                          : asp.sentiment === 'Mixed'
                          ? 'text-amber-500'
                          : 'text-sky-500'
                      }`}
                    >
                      {asp.sentiment}
                    </span>
                    {asp.evidence_text && (
                      <span className="text-slate-400 text-[10px] font-mono">
                        ({asp.evidence_text})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
