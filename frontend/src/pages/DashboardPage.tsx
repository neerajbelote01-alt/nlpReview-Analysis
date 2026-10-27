import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  MessageSquare,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Clock,
  ArrowRight,
  Filter,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { SentimentPieChart } from '../components/charts/SentimentPieChart';
import { AspectBarChart } from '../components/charts/AspectBarChart';
import { analyticsApi } from '../services/api';
import { DashboardStats } from '../types';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await analyticsApi.getDashboard();
      setData(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to load dashboard metrics from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl lg:col-span-2" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center p-8 glass-panel rounded-2xl">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold">Unable to Connect to Backend</h3>
        <p className="text-sm text-slate-500 mt-2 mb-6">{error || 'Database has no recorded data.'}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 rounded-xl bg-cyan-500 text-white font-medium inline-flex items-center gap-2 hover:bg-cyan-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Intelligence Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Aggregated from {data.total_reviews} reviews and {data.total_analyses} real aspect analyses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
            title="Refresh metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/analyzer"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium text-sm shadow-md shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze New Review</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 flex items-center justify-between" hoverEffect glow="cyan">
          <div>
            <span className="text-xs uppercase font-mono text-slate-400 tracking-wider">Total Products</span>
            <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-slate-100">{data.total_products}</p>
            <span className="text-[11px] text-cyan-500 mt-1 inline-block">Flagships Cataloged</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between" hoverEffect glow="purple">
          <div>
            <span className="text-xs uppercase font-mono text-slate-400 tracking-wider">Total Reviews</span>
            <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-slate-100">{data.total_reviews}</p>
            <span className="text-[11px] text-purple-400 mt-1 inline-block">Customer Testimonials</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between" hoverEffect glow="emerald">
          <div>
            <span className="text-xs uppercase font-mono text-slate-400 tracking-wider">ABSA Analyses</span>
            <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-slate-100">{data.total_analyses}</p>
            <span className="text-[11px] text-emerald-500 mt-1 inline-block">NLP Pipeline Runs</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between" hoverEffect glow="amber">
          <div>
            <span className="text-xs uppercase font-mono text-slate-400 tracking-wider">Aspect Cues Found</span>
            <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-slate-100">
              {data.most_frequent_aspects.reduce((acc, curr) => acc + curr.total_mentions, 0)}
            </p>
            <span className="text-[11px] text-amber-500 mt-1 inline-block">Extracted Feature Mentions</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aspect Sentiment Breakdown Bar Chart */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Aspect-Level Sentiment Distribution</h2>
              <p className="text-xs text-slate-400">Mentions breakdown by canonical aspect</p>
            </div>
            <Link to="/aspects" className="text-xs font-medium text-cyan-500 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <AspectBarChart data={data.most_frequent_aspects} limit={7} />
        </GlassCard>

        {/* Overall Sentiment Donut Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Overall Sentiment</h2>
              <p className="text-xs text-slate-400">Classified review distribution</p>
            </div>
          </div>
          <SentimentPieChart data={data.sentiment_distribution} />
        </GlassCard>
      </div>

      {/* Top Praised & Complained Aspects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Praised */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Top Praised Aspects</h3>
              <p className="text-xs text-slate-400">Features with the highest positive volume</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.top_positive_aspects.slice(0, 4).map((asp) => (
              <div key={asp.aspect_name} className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-white/5">
                <span className="text-sm font-medium">{asp.aspect_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-500">
                    +{asp.positive_count} positive
                  </span>
                  <span className="text-xs text-slate-400">({asp.total_mentions} mentions)</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Most Complained */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <ThumbsDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Top Recurring Complaints</h3>
              <p className="text-xs text-slate-400">Features with the most customer friction</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.top_negative_aspects.slice(0, 4).map((asp) => (
              <div key={asp.aspect_name} className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-white/5">
                <span className="text-sm font-medium">{asp.aspect_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-rose-500">
                    -{asp.negative_count} negative
                  </span>
                  <span className="text-xs text-slate-400">({asp.total_mentions} mentions)</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Product Overview Table */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold">Product Sentiment Overview</h3>
            <p className="text-xs text-slate-400">Live sentiment aggregations per cataloged smartphone</p>
          </div>
          <Link to="/products" className="text-xs font-medium text-cyan-500 hover:underline flex items-center gap-1">
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase font-mono text-slate-400 border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Total Reviews</th>
                <th className="pb-3 font-semibold">Avg Rating</th>
                <th className="pb-3 font-semibold">Positive</th>
                <th className="pb-3 font-semibold">Negative</th>
                <th className="pb-3 font-semibold">Mixed</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {data.product_sentiment_comparison.map((item) => (
                <tr key={item.product_id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 font-medium">{item.product_name}</td>
                  <td className="py-3.5 text-slate-500 font-mono text-xs">{item.total_reviews}</td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold text-xs">
                      ★ {item.average_rating ?? 'N/A'}
                    </span>
                  </td>
                  <td className="py-3.5 text-emerald-500 font-semibold">{item.positive}</td>
                  <td className="py-3.5 text-rose-500 font-semibold">{item.negative}</td>
                  <td className="py-3.5 text-amber-500 font-semibold">{item.mixed}</td>
                  <td className="py-3.5 text-right">
                    <Link
                      to={`/products/${item.product_id}`}
                      className="text-xs text-cyan-500 hover:text-cyan-400 font-medium"
                    >
                      View Details &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Recent Analysis Activity Stream */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-500" />
            <h3 className="text-sm font-bold">Recent Analysis Activity</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time Stream</span>
        </div>

        <div className="space-y-3">
          {data.recent_activity.map((act) => (
            <div
              key={act.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {act.product_name}
                  </span>
                  <SentimentBadge sentiment={act.overall_sentiment} size="sm" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{act.review_text}"</p>
              </div>

              {act.confidence && (
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono block">Confidence</span>
                  <span className="text-xs font-bold font-mono text-cyan-500">
                    {(act.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
