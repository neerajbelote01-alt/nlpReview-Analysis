import React, { useState, useEffect } from 'react';
import {
  Layers,
  ThumbsUp,
  ThumbsDown,
  Filter,
  BarChart2,
  Smartphone,
  Quote,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { analyticsApi, productApi } from '../services/api';
import { Product } from '../types';

export const AspectAnalyticsPage: React.FC = () => {
  const [aspectsData, setAspectsData] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedAspect, setSelectedAspect] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [aspRes, prodRes] = await Promise.all([
        analyticsApi.getAspects({
          product_id: selectedProduct || undefined,
          aspect_name: selectedAspect || undefined,
        }),
        productApi.getAll(),
      ]);
      setAspectsData(aspRes.data.aspects || []);
      setProducts(prodRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedProduct, selectedAspect]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-xs font-semibold mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Feature-Level Sentiment Dissection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Aspect Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore mention frequencies, net polarity scores, customer praise quotes, and pain points across all 12 canonical hardware aspects.
        </p>
      </div>

      {/* Filter Toolbar */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Product:</span>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
            >
              <option value="">All Smartphones</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Aspect Filter:</span>
            <select
              value={selectedAspect}
              onChange={(e) => setSelectedAspect(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
            >
              <option value="">All 12 Aspects</option>
              {[
                'Camera',
                'Battery',
                'Display',
                'Performance',
                'Price',
                'Design',
                'Build quality',
                'Audio and speakers',
                'Software and user interface',
                'Connectivity',
                'Charging',
                'Durability',
              ].map((asp) => (
                <option key={asp} value={asp}>
                  {asp}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500">
          Showing {aspectsData.length} analyzed aspects
        </div>
      </GlassCard>

      {/* Aspect Cards List */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : aspectsData.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-2xl">
          <p className="text-sm text-slate-400">No aspect records match your filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {aspectsData.map((item) => {
            const pos = item.sentiments?.Positive || 0;
            const neg = item.sentiments?.Negative || 0;
            const mix = item.sentiments?.Mixed || 0;
            const neu = item.sentiments?.Neutral || 0;
            const tot = pos + neg + mix + neu || 1;
            const posPct = Math.round((pos / tot) * 100);
            const negPct = Math.round((neg / tot) * 100);

            return (
              <GlassCard key={item.aspect_name} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {item.aspect_name}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">
                        {item.total_mentions} total customer mentions
                      </span>
                    </div>
                  </div>

                  {/* Net Sentiment Score */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">
                        Net Polarity
                      </span>
                      <span
                        className={`text-lg font-bold font-mono ${
                          item.net_sentiment >= 0 ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {item.net_sentiment > 0 ? `+${item.net_sentiment}` : item.net_sentiment}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500">
                        {pos} Pos
                      </span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-500">
                        {neg} Neg
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-500">
                        {mix} Mix
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Positive: {posPct}%</span>
                    <span>Negative: {negPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${posPct}%` }} className="bg-emerald-500 h-full" />
                    <div style={{ width: `${Math.round((mix / tot) * 100)}%` }} className="bg-amber-500 h-full" />
                    <div style={{ width: `${Math.round((neu / tot) * 100)}%` }} className="bg-sky-500 h-full" />
                    <div style={{ width: `${negPct}%` }} className="bg-rose-500 h-full" />
                  </div>
                </div>

                {/* Excerpt Columns */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Praise Quotes */}
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Frequently Praised Attributes</span>
                    </div>
                    {item.frequent_praises?.length > 0 ? (
                      <div className="space-y-2">
                        {item.frequent_praises.map((p: any, i: number) => (
                          <div key={i} className="text-xs text-slate-600 dark:text-slate-300 italic border-l-2 border-emerald-500/40 pl-2">
                            "{p.text}"
                            <span className="block text-[10px] text-slate-400 font-mono not-italic mt-0.5">
                              — {p.product} (evidence: {p.evidence})
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No positive excerpts recorded.</p>
                    )}
                  </div>

                  {/* Complaint Quotes */}
                  <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Reported Friction & Complaints</span>
                    </div>
                    {item.common_complaints?.length > 0 ? (
                      <div className="space-y-2">
                        {item.common_complaints.map((c: any, i: number) => (
                          <div key={i} className="text-xs text-slate-600 dark:text-slate-300 italic border-l-2 border-rose-500/40 pl-2">
                            "{c.text}"
                            <span className="block text-[10px] text-slate-400 font-mono not-italic mt-0.5">
                              — {c.product} (evidence: {c.evidence})
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No negative excerpts recorded.</p>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
