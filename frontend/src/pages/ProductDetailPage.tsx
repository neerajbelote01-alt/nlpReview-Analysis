import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Smartphone,
  ArrowLeft,
  Star,
  MessageSquare,
  Sparkles,
  Layers,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Filter,
  ExternalLink,
  ShoppingCart,
  ShoppingBag,
  Globe,
  Tag,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { SentimentPieChart } from '../components/charts/SentimentPieChart';
import { productApi } from '../services/api';
import { ProductDetail, Review } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewFilter, setReviewFilter] = useState<'All' | 'Positive' | 'Negative' | 'Mixed'>('All');

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    Promise.all([productApi.getById(id), productApi.getReviews(id)])
      .then(([prodRes, revsRes]) => {
        setProduct(prodRes.data);
        setReviews(revsRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading || !product) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === 'All') return true;
    return r.overall_sentiment === reviewFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-cyan-500 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalog</span>
        </Link>
      </div>

      {/* Main Product Header Card */}
      <GlassCard className="p-6 sm:p-8" glow="cyan">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center flex-1">
            {/* Product Hero Image */}
            <div className="w-full sm:w-48 h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 shrink-0 shadow-md">
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {product.brand}
                  </span>
                )}
                {product.price && (
                  <span className="text-sm font-bold font-mono text-emerald-500 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {product.price}
                  </span>
                )}
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{product.average_rating ?? '4.6'}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                {product.name}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action and Store Buttons */}
          <div className="flex flex-col gap-3 shrink-0">
            <Link
              to="/analyzer"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium text-sm shadow-md shadow-cyan-500/20 hover:opacity-95 transition-all text-center flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze for This Device</span>
            </Link>

            {/* Direct Connect Buttons */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-semibold">
                Direct Store & Official Links:
              </span>
              <div className="flex flex-col gap-1.5">
                {product.amazon_url && (
                  <a
                    href={product.amazon_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 hover:bg-amber-500/20 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="w-3.5 h-3.5 text-amber-500" />
                      <span>View on Amazon</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {product.flipkart_url && (
                  <a
                    href={product.flipkart_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25 hover:bg-blue-500/20 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                      <span>View on Flipkart</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {product.official_url && (
                  <a
                    href={product.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/20 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Official Brand Website</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Aspect Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Sentiment Donut */}
        <GlassCard className="p-6">
          <h3 className="text-base font-bold mb-1">Sentiment Profile</h3>
          <p className="text-xs text-slate-400 mb-4">Total customer sentiment split</p>
          <SentimentPieChart
            data={{
              positive: product.sentiment_summary?.Positive || 0,
              negative: product.sentiment_summary?.Negative || 0,
              neutral: product.sentiment_summary?.Neutral || 0,
              mixed: product.sentiment_summary?.Mixed || 0,
            }}
          />
        </GlassCard>

        {/* Feature-by-Feature Aspect Breakdown */}
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="text-base font-bold mb-1">Aspect Sentiment Performance</h3>
          <p className="text-xs text-slate-400 mb-4">Sentiment ratio per detected hardware/software feature</p>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {Object.entries(product.aspect_breakdown || {}).map(([aspName, sMap]) => {
              const pos = sMap.Positive || 0;
              const neg = sMap.Negative || 0;
              const mix = sMap.Mixed || 0;
              const neu = sMap.Neutral || 0;
              const total = pos + neg + mix + neu;
              const posPct = total > 0 ? Math.round((pos / total) * 100) : 0;
              const negPct = total > 0 ? Math.round((neg / total) * 100) : 0;

              return (
                <div key={aspName} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{aspName}</span>
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {pos} pos / {neg} neg ({total} mentions)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${posPct}%` }} className="bg-emerald-500 h-full" title={`Positive: ${posPct}%`} />
                    <div style={{ width: `${total > 0 ? Math.round((mix / total) * 100) : 0}%` }} className="bg-amber-500 h-full" title="Mixed" />
                    <div style={{ width: `${total > 0 ? Math.round((neu / total) * 100) : 0}%` }} className="bg-sky-500 h-full" title="Neutral" />
                    <div style={{ width: `${negPct}%` }} className="bg-rose-500 h-full" title={`Negative: ${negPct}%`} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Customer Reviews Stream for this product */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold">Cataloged Customer Reviews ({reviews.length})</h3>
            <p className="text-xs text-slate-400">Authentic customer and synthetic feedback for {product.name}</p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {(['All', 'Positive', 'Negative', 'Mixed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setReviewFilter(filter)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  reviewFilter === filter
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs italic">
              No reviews match the selected filter.
            </div>
          ) : (
            filteredReviews.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {r.overall_sentiment && <SentimentBadge sentiment={r.overall_sentiment} size="sm" />}
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      ★ {r.rating ?? 'N/A'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">ID: {r.id}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
                  "{r.review_text}"
                </p>

                <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1">
                  <span>Source: {r.source_type}</span>
                  <span>{r.aspect_count} features identified</span>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
};
