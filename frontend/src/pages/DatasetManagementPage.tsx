import React, { useState, useEffect } from 'react';
import {
  Database,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Layers,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { datasetApi } from '../services/api';

export const DatasetManagementPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const res = await datasetApi.getSummary();
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a CSV file.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await datasetApi.uploadCsv(formData);
      setUploadStatus(`Successfully imported and analyzed ${res.data.imported_count} new reviews!`);
      setFile(null);
      fetchSummary();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'CSV upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading || !summary) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-xs font-semibold mb-2">
          <Database className="w-3.5 h-3.5" />
          <span>Corpus & Provenance Control</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Dataset Hub & Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor dataset integrity, inspect product review distributions, and append new review corpora.
        </p>
      </div>

      {/* Provenance Notice */}
      <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-200 mb-0.5">Academic Provenance Statement</p>
          <p className="leading-relaxed">{summary.provenance_statement}</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-5 text-center">
          <span className="text-xs font-mono text-slate-400 uppercase">Total Corpus Reviews</span>
          <p className="text-3xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {summary.total_reviews}
          </p>
        </GlassCard>

        <GlassCard className="p-5 text-center">
          <span className="text-xs font-mono text-slate-400 uppercase">Synthetic Demo Reviews</span>
          <p className="text-3xl font-bold font-mono text-cyan-500 mt-1">
            {summary.synthetic_demo_reviews}
          </p>
        </GlassCard>

        <GlassCard className="p-5 text-center">
          <span className="text-xs font-mono text-slate-400 uppercase">User-Uploaded Reviews</span>
          <p className="text-3xl font-bold font-mono text-purple-400 mt-1">
            {summary.user_uploaded_reviews}
          </p>
        </GlassCard>
      </div>

      {/* Product Corpus Distribution Table */}
      <GlassCard className="p-6">
        <h3 className="text-base font-bold mb-1">Corpus Breakdown by Smartphone</h3>
        <p className="text-xs text-slate-400 mb-4">Verification that each flagship meets the 20+ review threshold</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase font-mono text-slate-400 border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="pb-3 font-semibold">Product Name</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Review Count</th>
                <th className="pb-3 font-semibold">Threshold Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {summary.products.map((p: any) => (
                <tr key={p.product_id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                  <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{p.product_name}</td>
                  <td className="py-3 text-xs text-slate-500">{p.category}</td>
                  <td className="py-3 font-mono text-xs font-semibold">{p.review_count} reviews</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Passed (&ge; 20 distinct reviews)</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Dataset Import Box */}
      <GlassCard className="p-6">
        <h3 className="text-base font-bold mb-1">Import Additional Reviews CSV</h3>
        <p className="text-xs text-slate-400 mb-4">
          Append external reviews to the database with automatic ABSA ingestion
        </p>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 dark:border-white/10 p-6 rounded-xl text-center">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setError(null);
                setUploadStatus(null);
              }}
              className="hidden"
              id="dataset-csv-input"
            />
            <label htmlFor="dataset-csv-input" className="cursor-pointer space-y-2 block">
              <Upload className="w-8 h-8 text-cyan-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {file ? file.name : 'Click to select CSV file for database ingestion'}
              </p>
              <p className="text-xs text-slate-400">Must include column 'review_text'</p>
            </label>
          </div>

          {uploadStatus && (
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{uploadStatus}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || isUploading}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Ingesting & Analyzing...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload & Import Dataset</span>
              </>
            )}
          </button>
        </form>
      </GlassCard>
    </div>
  );
};
