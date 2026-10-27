import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Flame,
  ThumbsDown,
  Quote,
  Filter,
  Smartphone,
  Info,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { analyticsApi, productApi } from '../services/api';
import { ComplaintItem, Product } from '../types';

export const ComplaintDiscoveryPage: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const [compRes, prodRes] = await Promise.all([
        analyticsApi.getComplaints(selectedProduct || undefined),
        productApi.getAll(),
      ]);
      setComplaints(compRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedProduct]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-semibold mb-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Friction Discovery & Anomaly Detection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Complaint Discovery</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Surfaces the most frequently reported defects, thermal throttle issues, battery drains, and negative review excerpts.
        </p>
      </div>

      {/* Academic Transparency Alert */}
      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">Provenance Notice:</span> Complaint frequency and percentages are derived strictly
          from the currently seeded synthetic dataset. They indicate simulated customer friction areas for academic demonstration.
        </p>
      </div>

      {/* Product Filter */}
      <GlassCard className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Filter by Smartphone:</span>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
          >
            <option value="">All Flagship Models</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {complaints.length} recurring friction aspects identified
        </span>
      </GlassCard>

      {/* Complaints List */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-2xl">
          <p className="text-sm text-slate-400">No complaints found for this selection.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((item, idx) => (
            <GlassCard key={item.aspect_name} className="p-6 border-l-4 border-l-rose-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-sm">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span>{item.aspect_name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 font-mono font-semibold">
                        {item.problem_count} complaints
                      </span>
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs text-slate-400">Affected devices:</span>
                      {item.affected_products.map((p) => (
                        <span
                          key={p}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">Complaint Share</span>
                  <span className="text-lg font-bold font-mono text-rose-500">{item.percentage}%</span>
                </div>
              </div>

              {/* Representative Excerpts */}
              <div className="mt-4 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Verbatim Customer Excerpts:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {item.representative_excerpts.map((ex, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-xs italic space-y-1"
                    >
                      <p className="text-slate-700 dark:text-slate-300">"{ex.text}"</p>
                      <div className="flex items-center justify-between text-[10px] font-mono not-italic text-slate-400 pt-1">
                        <span>Model: {ex.product}</span>
                        {ex.evidence && <span className="text-rose-500">Evidence: {ex.evidence}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
