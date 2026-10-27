import React, { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { analysisApi } from '../services/api';
import { AnalysisResult } from '../types';

export const BulkAnalysisPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [stats, setStats] = useState<{
    positive: number;
    negative: number;
    neutral: number;
    mixed: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.name.endsWith('.csv') && !selected.type.includes('csv') && !selected.type.includes('text')) {
      setError('Please select a valid CSV file (.csv).');
      return;
    }

    setFile(selected);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
      
      if (lines.length <= 1) {
        setError('CSV file is empty or only contains headers.');
        return;
      }

      // Check header or parse lines
      const headers = lines[0].split(',').map((h) => h.replace(/["']/g, '').trim().toLowerCase());
      let textColIdx = headers.findIndex((h) =>
        ['review_text', 'review', 'text', 'comment', 'content'].includes(h)
      );
      if (textColIdx === -1) textColIdx = 0; // fallback to first column

      const rawReviews: string[] = [];
      for (let i = 1; i < lines.length && rawReviews.length < 150; i++) {
        const parts = lines[i].split(',');
        const reviewText = (parts[textColIdx] || lines[i]).replace(/^["']|["']$/g, '').trim();
        if (reviewText && reviewText.length > 3) {
          rawReviews.push(reviewText);
        }
      }

      setParsedRows(rawReviews);
    };
    reader.readAsText(selected);
  };

  const handleProcessBulk = async () => {
    if (parsedRows.length === 0) {
      setError('No reviews detected to process.');
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setError(null);

    try {
      const payload = parsedRows.map((text) => ({ review_text: text }));
      const res = await analysisApi.analyzeBulk(payload);
      setProgress(100);
      setResults(res.data.results);
      setStats({
        positive: res.data.positive_count,
        negative: res.data.negative_count,
        neutral: res.data.neutral_count,
        mixed: res.data.mixed_count,
      });
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to process bulk reviews.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Review_Text,Overall_Sentiment,Confidence,Detected_Aspects\n';

    results.forEach((r) => {
      const escapedText = `"${r.review_text.replace(/"/g, '""')}"`;
      const aspectSummary = `"${r.aspect_results.map((a) => `${a.aspect_name}:${a.sentiment}`).join('; ')}"`;
      const conf = r.confidence ? (r.confidence * 100).toFixed(1) + '%' : 'N/A';
      csvContent += `${escapedText},${r.overall_sentiment},${conf},${aspectSummary}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reviewiq_bulk_analysis_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-xs font-semibold mb-2">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>High-Throughput Batch Processing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Bulk Review Analysis</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload large batches of customer reviews via CSV, run aspect-level inference, and export the enriched dataset.
        </p>
      </div>

      {/* Upload Box */}
      <GlassCard className="p-8 border-dashed border-2 border-slate-300 dark:border-white/10 hover:border-cyan-500/50 transition-colors">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
            <Upload className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Select or Drop Review CSV File
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
            File should contain review text under a column named <span className="font-mono text-cyan-500">review_text</span> or <span className="font-mono text-cyan-500">review</span>.
          </p>

          <label className="mt-5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-sm cursor-pointer shadow-md shadow-cyan-500/20 transition-all inline-flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            <span>{file ? file.name : 'Choose CSV File'}</span>
            <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          </label>

          {parsedRows.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-500 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Loaded {parsedRows.length} reviews ready for analysis.</span>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Action Bar when parsed rows exist */}
      {parsedRows.length > 0 && (
        <div className="flex items-center justify-between p-4 glass-panel rounded-2xl">
          <div className="text-xs font-mono text-slate-500">
            Ready to process <span className="font-bold text-slate-800 dark:text-slate-200">{parsedRows.length}</span> reviews.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleProcessBulk}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium text-sm shadow-md shadow-cyan-500/20 hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Batch...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Batch ABSA Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Batch Summary Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in duration-300">
          <GlassCard className="p-4 text-center">
            <span className="text-xs font-mono text-slate-400">Positive</span>
            <p className="text-2xl font-bold text-emerald-500 mt-1">{stats.positive}</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <span className="text-xs font-mono text-slate-400">Negative</span>
            <p className="text-2xl font-bold text-rose-500 mt-1">{stats.negative}</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <span className="text-xs font-mono text-slate-400">Mixed</span>
            <p className="text-2xl font-bold text-amber-500 mt-1">{stats.mixed}</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <span className="text-xs font-mono text-slate-400">Neutral</span>
            <p className="text-2xl font-bold text-sky-500 mt-1">{stats.neutral}</p>
          </GlassCard>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold">Processed Review Batch ({results.length})</h3>
              <p className="text-xs text-slate-400">Extracted aspect sentiments and aggregated results</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Analyzed CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase font-mono text-slate-400 sticky top-0 bg-background/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="pb-3 font-semibold">Review Text</th>
                  <th className="pb-3 font-semibold">Overall</th>
                  <th className="pb-3 font-semibold">Confidence</th>
                  <th className="pb-3 font-semibold">Detected Aspects & Sentiments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {results.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 text-xs max-w-sm truncate text-slate-800 dark:text-slate-200" title={r.review_text}>
                      {r.review_text}
                    </td>
                    <td className="py-3">
                      <SentimentBadge sentiment={r.overall_sentiment} size="sm" />
                    </td>
                    <td className="py-3 font-mono text-xs text-slate-500">
                      {r.confidence ? `${(r.confidence * 100).toFixed(1)}%` : 'N/A'}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {r.aspect_results.map((a, j) => (
                          <span
                            key={j}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                          >
                            <span className="font-medium text-slate-700 dark:text-slate-300">{a.aspect_name}:</span>
                            <span
                              className={`font-semibold ${
                                a.sentiment === 'Positive'
                                  ? 'text-emerald-500'
                                  : a.sentiment === 'Negative'
                                  ? 'text-rose-500'
                                  : a.sentiment === 'Mixed'
                                  ? 'text-amber-500'
                                  : 'text-sky-500'
                              }`}
                            >
                              {a.sentiment}
                            </span>
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
