import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import ConsultationCards from './ConsultationCards';

const SEVERITY_CONFIG = {
  Low: { color: 'text-safe', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Low risk' },
  Medium: { color: 'text-warning', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Moderate' },
  High: { color: 'text-coral', bg: 'bg-red-50', border: 'border-red-200', label: 'High risk' },
};

export default function AnalysisResult() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [viewMode, setViewMode] = useState('original'); // 'original' | 'heatmap' | 'side-by-side'
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.6);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await api.get(`/api/analysis/${id}`);
        setAnalysis(res.data);
      } catch (err) {
        toast.error('Failed to load analysis');
      }
    };
    fetchAnalysis();
  }, [id]);

  if (!analysis) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-4 border-teal-200 border-t-teal-600"
        />
      </div>
    );
  }

  const severityConfig = SEVERITY_CONFIG[analysis.severity] || SEVERITY_CONFIG.Low;
  const confidence = analysis.confidence != null ? Math.round(analysis.confidence * 100) : null;
  const imageUrl = `/uploads/${analysis.image || ''}`;
  const heatmapUrl = analysis.heatmap ? `/uploads/${analysis.heatmap}` : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <h1 className="font-display text-3xl font-bold text-slate-800">Analysis result</h1>
        <Link
          to="/user"
          className="text-teal-600 hover:text-teal-700 font-medium text-sm"
        >
          ← Back to dashboard
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-glass overflow-hidden"
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image / Heatmap area */}
          <div className="relative bg-slate-100 min-h-[320px] flex items-center justify-center p-4">
            {viewMode === 'side-by-side' && (
              <div className="flex gap-2 w-full h-full max-h-[400px]">
                <img
                  src={imageUrl}
                  alt="Original"
                  className="flex-1 object-contain rounded-xl shadow-lg"
                />
                {heatmapUrl && (
                  <img
                    src={heatmapUrl}
                    alt="Heatmap"
                    className="flex-1 object-contain rounded-xl shadow-lg"
                  />
                )}
              </div>
            )}
            {viewMode !== 'side-by-side' && (
              <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={imageUrl}
                  alt="Skin lesion"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {heatmapUrl && viewMode === 'heatmap' && (
                  <img
                    src={heatmapUrl}
                    alt="Heatmap overlay"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
                    style={{ opacity: heatmapOpacity }}
                  />
                )}
              </div>
            )}
            {heatmapUrl && (
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                {['original', 'heatmap', 'side-by-side'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                      viewMode === mode ? 'bg-teal-600 text-white' : 'bg-white/90 text-slate-600'
                    }`}
                  >
                    {mode.replace('-', ' ')}
                  </button>
                ))}
                {viewMode === 'heatmap' && (
                  <div className="flex items-center gap-2 w-full mt-2">
                    <span className="text-xs text-slate-600">Blend</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={heatmapOpacity}
                      onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                      className="flex-1 h-2 rounded-full appearance-none bg-slate-200 accent-teal-600"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Result panel */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className={`rounded-2xl border-2 ${severityConfig.border} ${severityConfig.bg} p-4 mb-6`}>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Prediction</p>
              <p className={`text-2xl font-bold ${severityConfig.color} mt-1`}>
                {analysis.prediction}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${severityConfig.bg} ${severityConfig.color} border ${severityConfig.border}`}>
                  {analysis.severity === 'High' && <ExclamationTriangleIcon className="w-4 h-4" />}
                  {analysis.severity === 'Low' && <CheckCircleIcon className="w-4 h-4" />}
                  {analysis.severity}
                </span>
                {confidence != null && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700">
                      {confidence}%
                    </div>
                    <span className="text-xs text-slate-500">confidence</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <InformationCircleIcon className="w-4 h-4 text-teal-600" />
                  First-aid & self-care
                </p>
                <p className="text-slate-600 mt-1">{analysis.first_aid}</p>
              </div>
              <p className="text-xs text-slate-500 italic">
                This is not professional medical advice. When in doubt, see a dermatologist.
              </p>
            </div>

            {(analysis.severity === 'Medium' || analysis.severity === 'High') && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <ConsultationCards analysisId={id} />
              </div>
            )}
            {analysis.severity === 'Low' && (
              <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-emerald-800 font-medium">Recommendation</p>
                <p className="text-emerald-700 text-sm mt-1">
                  Monitor the lesion. Re-analyze in 2 weeks or if it changes.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
