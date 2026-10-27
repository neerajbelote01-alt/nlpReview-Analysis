import React, { useState, useEffect } from 'react';
import {
  Cpu,
  CheckCircle2,
  Table,
  BarChart2,
  Info,
  ShieldCheck,
  RefreshCw,
  GitBranch,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { modelApi } from '../services/api';
import { ModelEvaluation } from '../types';

export const ModelEvaluationPage: React.FC = () => {
  const [evalData, setEvalData] = useState<ModelEvaluation | null>(null);
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEval = async () => {
    setIsLoading(true);
    try {
      const [evalRes, infoRes] = await Promise.all([
        modelApi.getEvaluation(),
        modelApi.getInfo(),
      ]);
      setEvalData(evalRes.data);
      setModelInfo(infoRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEval();
  }, []);

  if (isLoading || !evalData) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  const { primary_model, dataset_info, model_comparison, methodology } = evalData;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-xs font-semibold mb-2">
          <Cpu className="w-3.5 h-3.5" />
          <span>Empirical NLP Benchmark</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Model Evaluation & Metrics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Rigorous test-set evaluation using stratified 75/25 holdout split. Real confusion matrix and baseline classifier comparisons.
        </p>
      </div>

      {/* Methodology banner */}
      <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-200 mb-0.5">Evaluation Protocol</p>
          <p className="leading-relaxed">{methodology}</p>
          <div className="flex flex-wrap items-center gap-4 mt-2 font-mono text-[11px] text-cyan-600 dark:text-cyan-400">
            <span>Total Labeled Benchmark Samples: {dataset_info.total_samples}</span>
            <span>Train Set: {dataset_info.train_samples}</span>
            <span>Test Set: {dataset_info.test_samples} (25%)</span>
            <span>Stratified Seed: {dataset_info.random_state}</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="p-5 text-center" glow="cyan">
          <span className="text-xs font-mono text-slate-400 uppercase">Test Accuracy</span>
          <p className="text-3xl font-bold font-mono text-cyan-500 mt-1">
            {(primary_model.accuracy * 100).toFixed(1)}%
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Exact Match Ratio</span>
        </GlassCard>

        <GlassCard className="p-5 text-center" glow="purple">
          <span className="text-xs font-mono text-slate-400 uppercase">Macro Precision</span>
          <p className="text-3xl font-bold font-mono text-purple-400 mt-1">
            {(primary_model.precision_macro * 100).toFixed(1)}%
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Unweighted Class Average</span>
        </GlassCard>

        <GlassCard className="p-5 text-center" glow="emerald">
          <span className="text-xs font-mono text-slate-400 uppercase">Macro Recall</span>
          <p className="text-3xl font-bold font-mono text-emerald-500 mt-1">
            {(primary_model.recall_macro * 100).toFixed(1)}%
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Sensitivity Across Classes</span>
        </GlassCard>

        <GlassCard className="p-5 text-center" glow="amber">
          <span className="text-xs font-mono text-slate-400 uppercase">Weighted F1-Score</span>
          <p className="text-3xl font-bold font-mono text-amber-500 mt-1">
            {(primary_model.f1_weighted * 100).toFixed(1)}%
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Support-Balanced Harmonic Mean</span>
        </GlassCard>
      </div>

      {/* Confusion Matrix and Classification Report Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4x4 Confusion Matrix */}
        <GlassCard className="p-6">
          <h3 className="text-base font-bold mb-1">Empirical Confusion Matrix</h3>
          <p className="text-xs text-slate-400 mb-4">
            Ground Truth (Rows) vs. Model Predictions (Columns) on holdout test set
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400">
                  <th className="py-2 text-left">True \ Pred</th>
                  {primary_model.labels.map((l) => (
                    <th key={l} className="py-2 font-bold text-slate-700 dark:text-slate-300">
                      {l}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {primary_model.confusion_matrix.map((row) => (
                  <tr key={row.true_label} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="py-3 text-left font-bold text-slate-700 dark:text-slate-300">
                      {row.true_label}
                    </td>
                    {primary_model.labels.map((col) => {
                      const count = (row as any)[col] ?? 0;
                      const isDiagonal = row.true_label === col;
                      return (
                        <td
                          key={col}
                          className={`py-3 font-bold ${
                            isDiagonal
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg'
                              : count > 0
                              ? 'text-rose-500'
                              : 'text-slate-400'
                          }`}
                        >
                          {count}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-4">
            Green diagonal denotes correct classifications on the independent test split.
          </p>
        </GlassCard>

        {/* Per-Class Classification Report */}
        <GlassCard className="p-6">
          <h3 className="text-base font-bold mb-1">Per-Class Classification Report</h3>
          <p className="text-xs text-slate-400 mb-4">Precision, Recall, and F1 per sentiment category</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-200 dark:border-white/10 text-slate-400 uppercase">
                <tr>
                  <th className="pb-2">Class</th>
                  <th className="pb-2">Precision</th>
                  <th className="pb-2">Recall</th>
                  <th className="pb-2">F1-Score</th>
                  <th className="pb-2 text-right">Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {primary_model.classification_report.map((item) => (
                  <tr key={item.class} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{item.class}</td>
                    <td className="py-3 font-semibold text-cyan-500">{(item.precision * 100).toFixed(1)}%</td>
                    <td className="py-3 font-semibold text-purple-400">{(item.recall * 100).toFixed(1)}%</td>
                    <td className="py-3 font-semibold text-emerald-500">{(item.f1_score * 100).toFixed(1)}%</td>
                    <td className="py-3 text-right text-slate-400">{item.support}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Baseline Model Comparison Table */}
      <GlassCard className="p-6">
        <h3 className="text-base font-bold mb-1">Baseline Model Comparison</h3>
        <p className="text-xs text-slate-400 mb-4">
          Performance metrics across 3 standard classification algorithms evaluated on identical test splits
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase font-mono text-slate-400 border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="pb-3 font-semibold">Model Pipeline</th>
                <th className="pb-3 font-semibold">Accuracy</th>
                <th className="pb-3 font-semibold">Macro Precision</th>
                <th className="pb-3 font-semibold">Macro Recall</th>
                <th className="pb-3 font-semibold">Macro F1</th>
                <th className="pb-3 font-semibold">Weighted F1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-mono text-xs">
              {model_comparison.map((m, idx) => (
                <tr
                  key={m.model_name}
                  className={`hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors ${
                    idx === 0 ? 'bg-cyan-500/5 font-bold' : ''
                  }`}
                >
                  <td className="py-3.5 font-sans font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {idx === 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500 text-white font-mono uppercase">
                        Selected
                      </span>
                    )}
                    <span>{m.model_name}</span>
                  </td>
                  <td className="py-3.5 text-cyan-500 font-semibold">{(m.accuracy * 100).toFixed(1)}%</td>
                  <td className="py-3.5">{(m.precision_macro * 100).toFixed(1)}%</td>
                  <td className="py-3.5">{(m.recall_macro * 100).toFixed(1)}%</td>
                  <td className="py-3.5">{(m.f1_macro * 100).toFixed(1)}%</td>
                  <td className="py-3.5 text-emerald-500 font-semibold">{(m.f1_weighted * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
