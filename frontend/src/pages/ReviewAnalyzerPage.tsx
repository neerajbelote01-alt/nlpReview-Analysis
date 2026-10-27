import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Bookmark,
  Share2,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { analysisApi, productApi } from '../services/api';
import { AnalysisResult, Product } from '../types';
import { useAuth } from '../context/AuthContext';

const EXAMPLE_REVIEWS = [
  {
    title: 'Multi-Aspect Mixed',
    text: 'The camera is excellent and the display looks beautiful, but the battery drains quickly and the price is too high.',
  },
  {
    title: 'Negation Handling',
    text: 'The battery is not bad at all and the chassis is definitely not cheap.',
  },
  {
    title: 'Gaming & Thermals',
    text: 'The performance is fast, but the phone heats up during gaming.',
  },
  {
    title: 'Charging & Sound',
    text: '150W ultra-fast charging is unbelievable, and stereo speakers deliver thunderous volume.',
  },
];

export const ReviewAnalyzerPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [reviewText, setReviewText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [saveToHistory, setSaveToHistory] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    productApi
      .getAll()
      .then((res) => {
        setProducts(res.data);
        if (res.data.length > 0) {
          setSelectedProduct(res.data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleAnalyze = async () => {
    if (!reviewText.trim()) {
      setError('Please enter a review text to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await analysisApi.analyzeSingle({
        review_text: reviewText.trim(),
        product_id: selectedProduct || undefined,
        save_to_history: isAuthenticated && saveToHistory,
      });
      setResult(res.data);
      if (isAuthenticated && saveToHistory && res.data.id) {
        setSaveSuccess(true);
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Analysis failed. Please verify backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setReviewText('');
    setResult(null);
    setError(null);
    setSaveSuccess(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Natural Language Processing Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Review Analyzer</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Perform aspect-based sentiment analysis with clause segmentation, negation awareness, and confidence scoring.
        </p>
      </div>

      {/* Quick Test Pre-Sets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quick Test Cases:</span>
        {EXAMPLE_REVIEWS.map((ex, idx) => (
          <button
            key={idx}
            onClick={() => {
              setReviewText(ex.text);
              setResult(null);
            }}
            className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-medium text-slate-700 dark:text-slate-300"
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Input Area Card */}
      <GlassCard className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Customer Review Text
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Select Smartphone:</span>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="">No Product / Standalone</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Type or paste a product review here... (e.g. 'The camera is excellent and the display looks beautiful, but the battery drains quickly and the price is too high.')"
            rows={4}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-y"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveToHistory}
                    onChange={(e) => setSaveToHistory(e.target.checked)}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Save to private analysis history</span>
                </label>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>

              <button
                onClick={handleAnalyze}
                disabled={isLoading || !reviewText.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium text-sm shadow-md shadow-cyan-500/25 hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Review</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Analysis Results Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Overview Summary Card */}
          <GlassCard className="p-6 border border-cyan-500/30" glow="cyan">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <span className="text-xs uppercase font-mono text-slate-400">Aggregated Evaluation</span>
                <div className="flex items-center gap-3 mt-1">
                  <h3 className="text-xl font-bold">Overall Sentiment:</h3>
                  <SentimentBadge sentiment={result.overall_sentiment} size="lg" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                {result.confidence !== undefined && (
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-mono block">Model Confidence</span>
                    <span className="text-lg font-bold font-mono text-cyan-500">
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                )}

                {saveSuccess && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Saved to History</span>
                  </div>
                )}
              </div>
            </div>

            {/* Model Architecture Transparency Note */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Model: {result.model_name}</span>
              <span>Detected Aspects: {result.aspect_results.length}</span>
            </div>
          </GlassCard>

          {/* Aspect-by-Aspect Breakdown Table */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold">Feature-Level Aspect Analysis</h3>
                <p className="text-xs text-slate-400">
                  Granular sentiment classification with extracted textual evidence cues
                </p>
              </div>
            </div>

            {result.aspect_results.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No specific hardware/software aspects detected in this review.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase font-mono text-slate-400 border-b border-slate-200 dark:border-white/10">
                    <tr>
                      <th className="pb-3 font-semibold">Aspect Feature</th>
                      <th className="pb-3 font-semibold">Classified Sentiment</th>
                      <th className="pb-3 font-semibold">Confidence</th>
                      <th className="pb-3 font-semibold">Extracted Linguistic Evidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                    {result.aspect_results.map((asp, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-cyan-500" />
                          <span>{asp.aspect_name}</span>
                        </td>
                        <td className="py-4">
                          <SentimentBadge sentiment={asp.sentiment} size="md" />
                        </td>
                        <td className="py-4 font-mono text-xs text-slate-500">
                          {asp.confidence ? `${(asp.confidence * 100).toFixed(1)}%` : 'Calibrated'}
                        </td>
                        <td className="py-4 text-xs font-mono">
                          <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                            {asp.evidence_text || 'Contextual inference'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
};
