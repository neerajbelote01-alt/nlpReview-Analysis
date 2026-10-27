import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  Check,
  Smartphone,
  Star,
  Layers,
  Info,
  AlertCircle,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { analyticsApi, productApi } from '../services/api';
import { Product } from '../types';

export const ProductComparisonPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(['prod_nova_x', 'prod_pixelwave_9']);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    productApi.getAll().then((res) => setAllProducts(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setComparisonData(null);
      return;
    }
    setIsLoading(true);
    analyticsApi
      .getCompare(selectedIds)
      .then((res) => setComparisonData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [selectedIds]);

  const toggleProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((p) => p !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const keyAspects = [
    'Camera',
    'Battery',
    'Display',
    'Performance',
    'Price',
    'Build quality',
    'Charging',
    'Software and user interface',
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-xs font-semibold mb-2">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Multi-Flagship Head-to-Head</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Product Comparison</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select between 2 and 4 devices to benchmark real customer feature sentiment side by side.
        </p>
      </div>

      {/* Product Selector Bar */}
      <GlassCard className="p-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
          Select Smartphones to Compare (Max 4):
        </span>
        <div className="flex flex-wrap gap-2">
          {allProducts.map((p) => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleProduct(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-cyan-500/20'
                    : 'border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Comparison Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-sm animate-pulse">
          Calculating comparative aspect scores from database...
        </div>
      ) : !comparisonData || comparisonData.products.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          Please select at least one product to compare.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Comparison Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparisonData.products.map((p: any) => {
              const pos = p.sentiment_distribution?.Positive || 0;
              const neg = p.sentiment_distribution?.Negative || 0;
              const total = pos + neg + (p.sentiment_distribution?.Mixed || 0) + (p.sentiment_distribution?.Neutral || 0) || 1;
              const posRate = Math.round((pos / total) * 100);

              return (
                <GlassCard key={p.id} className="p-5" glow="cyan">
                  <span className="text-[10px] font-mono uppercase text-slate-400">{p.category}</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">{p.name}</h3>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sample Size:</span>
                      <span className="font-mono font-semibold">{p.review_count} reviews</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Positive Rate:</span>
                      <span className="font-mono font-bold text-emerald-500">{posRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Complaints:</span>
                      <span className="font-mono font-bold text-rose-500">{neg} mentions</span>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Detailed Aspect Matrix Table */}
          <GlassCard className="p-6">
            <h3 className="text-base font-bold mb-1">Aspect Benchmark Matrix</h3>
            <p className="text-xs text-slate-400 mb-4">
              Real sentiment distribution per feature (Positive / Negative / Mixed)
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase font-mono text-slate-400 border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="pb-3 font-semibold">Aspect Feature</th>
                    {comparisonData.products.map((p: any) => (
                      <th key={p.id} className="pb-3 font-semibold">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {keyAspects.map((aspect) => (
                    <tr key={aspect} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-500" />
                        <span>{aspect}</span>
                      </td>

                      {comparisonData.products.map((p: any) => {
                        const aspStats = p.aspects?.[aspect];
                        if (!aspStats) {
                          return (
                            <td key={p.id} className="py-3.5 text-xs text-slate-400 italic">
                              Insufficient data
                            </td>
                          );
                        }

                        const pos = aspStats.Positive || 0;
                        const neg = aspStats.Negative || 0;
                        const mix = aspStats.Mixed || 0;
                        const tot = pos + neg + mix + (aspStats.Neutral || 0);

                        return (
                          <td key={p.id} className="py-3.5">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-xs">
                                <span className="font-semibold text-emerald-500">{pos} pos</span>
                                <span className="text-slate-400">/</span>
                                <span className="font-semibold text-rose-500">{neg} neg</span>
                                {mix > 0 && <span className="text-amber-500">({mix} mix)</span>}
                              </div>
                              <div className="w-28 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                                <div
                                  style={{ width: `${tot > 0 ? (pos / tot) * 100 : 0}%` }}
                                  className="bg-emerald-500 h-full"
                                />
                                <div
                                  style={{ width: `${tot > 0 ? (mix / tot) * 100 : 0}%` }}
                                  className="bg-amber-500 h-full"
                                />
                                <div
                                  style={{ width: `${tot > 0 ? (neg / tot) * 100 : 0}%` }}
                                  className="bg-rose-500 h-full"
                                />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
