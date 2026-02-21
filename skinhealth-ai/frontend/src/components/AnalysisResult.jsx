import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  ShieldExclamationIcon,
  LightBulbIcon,
  XCircleIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { DISEASE_GUIDE } from '../data/diseaseGuide';
import ConsultationCards from './ConsultationCards';

const SEVERITY_CONFIG = {
  Low: {
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    label: 'Low risk',
    icon: CheckCircleIcon,
  },
  Medium: {
    color: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    label: 'Moderate',
    icon: ExclamationTriangleIcon,
  },
  High: {
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    label: 'High risk',
    icon: ExclamationCircleIcon,
  },
};

function SectionCard({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="flex items-center gap-3 font-semibold text-slate-800">
          {Icon && <Icon className="w-5 h-5 text-teal-600 shrink-0" />}
          {title}
        </span>
        {open ? <ChevronUpIcon className="w-5 h-5 text-slate-400" /> : <ChevronDownIcon className="w-5 h-5 text-slate-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AnalysisResult() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [viewMode, setViewMode] = useState('overlay');
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.55);

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
  const SeverityIcon = severityConfig.icon;
  const confidence = analysis.confidence != null ? Math.round(analysis.confidence * 100) : null;
  const imageUrl = `/uploads/${analysis.image || ''}`;
  const heatmapUrl = analysis.heatmap ? `/uploads/${analysis.heatmap}` : null;
  const guide = DISEASE_GUIDE[analysis.prediction] || {};

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <h1 className="font-display text-3xl font-bold text-slate-800">Analysis result</h1>
        <Link
          to="/user"
          className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1"
        >
          ← Back to dashboard
        </Link>
      </motion.div>

      {/* Hero: Image + Heatmap */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl"
      >
        <div className="grid lg:grid-cols-5 gap-0">
          <div className="lg:col-span-3 bg-slate-900 p-4 md:p-6 flex flex-col items-center justify-center min-h-[340px]">
            {viewMode === 'side-by-side' && (
              <div className="flex gap-3 w-full max-w-2xl">
                <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                  <img src={imageUrl} alt="Original" className="w-full h-full object-contain aspect-square" />
                </div>
                {heatmapUrl && (
                  <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                    <img src={heatmapUrl} alt="Grad-CAM heatmap" className="w-full h-full object-contain aspect-square" />
                  </div>
                )}
              </div>
            )}
            {(viewMode === 'original' || viewMode === 'overlay') && (
              <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                <img
                  src={imageUrl}
                  alt="Skin lesion"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {heatmapUrl && viewMode === 'overlay' && (
                  <img
                    src={heatmapUrl}
                    alt="Grad-CAM overlay"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply pointer-events-none"
                    style={{ opacity: heatmapOpacity }}
                  />
                )}
              </div>
            )}
            {viewMode === 'heatmap' && heatmapUrl && (
              <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                <img src={heatmapUrl} alt="Grad-CAM heatmap" className="w-full h-full object-cover" />
              </div>
            )}

            {heatmapUrl && (
              <div className="mt-4 w-full max-w-md space-y-3">
                <div className="flex flex-wrap gap-2">
                  {['original', 'overlay', 'heatmap', 'side-by-side'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition ${
                        viewMode === mode
                          ? 'bg-teal-500 text-white'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {mode.replace('-', ' ')}
                    </button>
                  ))}
                </div>
                {viewMode === 'overlay' && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Overlay blend</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={heatmapOpacity}
                      onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                      className="flex-1 h-2 rounded-full appearance-none bg-slate-600 accent-teal-400"
                    />
                    <span className="text-xs text-slate-400 w-8">{Math.round(heatmapOpacity * 100)}%</span>
                  </div>
                )}
                <p className="text-xs text-slate-500">
                  Grad-CAM heatmap: blue = low attention, red = high (model focus).
                </p>
              </div>
            )}
          </div>

          {/* Prediction card */}
          <div className="lg:col-span-2 p-6 md:p-8 flex flex-col justify-center bg-slate-50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">AI prediction</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
              {analysis.prediction}
            </h2>
            {guide.tagline && (
              <p className="text-slate-600 text-sm mt-1">{guide.tagline}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 ${severityConfig.bg} ${severityConfig.color} ${severityConfig.border}`}>
                <SeverityIcon className="w-5 h-5" />
                {analysis.severity} risk
              </span>
              {confidence != null && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border-2 border-slate-300 text-slate-700"
                    title="Model confidence"
                  >
                    {confidence}%
                  </div>
                  <span className="text-xs text-slate-500">confidence</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Detailed disease guide (expandable) */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-4"
      >
        <h2 className="font-display text-xl font-bold text-slate-800 flex items-center gap-2">
          <InformationCircleIcon className="w-6 h-6 text-teal-600" />
          About this condition
        </h2>
        <p className="text-slate-600 text-sm">
          Expand each section for detailed, educational information. This is not a substitute for professional diagnosis.
        </p>

        <div className="grid gap-4">
          {guide.whatIs && (
            <SectionCard title="What is this condition?" icon={InformationCircleIcon} defaultOpen>
              <p className="whitespace-pre-line">{guide.whatIs}</p>
            </SectionCard>
          )}
          {guide.symptoms && guide.symptoms.length > 0 && (
            <SectionCard title="Common symptoms" icon={HeartIcon}>
              <ul className="list-disc list-inside space-y-2">
                {guide.symptoms.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </SectionCard>
          )}
          {guide.whatItCouldLeadTo && guide.whatItCouldLeadTo.length > 0 && (
            <SectionCard title="What it could lead to (if untreated or monitored)" icon={ExclamationTriangleIcon}>
              <ul className="list-disc list-inside space-y-2">
                {guide.whatItCouldLeadTo.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </SectionCard>
          )}
          {guide.precautions && guide.precautions.length > 0 && (
            <SectionCard title="Precautions & what you should do" icon={ShieldExclamationIcon}>
              <ul className="list-disc list-inside space-y-2">
                {guide.precautions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </SectionCard>
          )}
          {guide.whatToAvoid && guide.whatToAvoid.length > 0 && (
            <SectionCard title="What to avoid" icon={XCircleIcon}>
              <ul className="list-disc list-inside space-y-2">
                {guide.whatToAvoid.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </SectionCard>
          )}
          <SectionCard title="First-aid & immediate steps" icon={LightBulbIcon} defaultOpen>
            <p className="whitespace-pre-line">{guide.firstAid || analysis.first_aid}</p>
          </SectionCard>
        </div>

        {guide.urgency && (
          <div className={`rounded-2xl border-2 p-4 ${severityConfig.border} ${severityConfig.bg}`}>
            <p className="font-semibold text-slate-800">Recommended urgency</p>
            <p className={`text-sm mt-1 ${severityConfig.color}`}>{guide.urgency}</p>
          </div>
        )}
      </motion.section>

      {/* Disclaimer */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
        <p className="font-medium">Disclaimer</p>
        <p className="mt-1">
          This analysis is powered by AI and is for informational use only. It is not a substitute for a professional medical diagnosis.
          Always consult a board-certified dermatologist or doctor for any skin concern, especially if a lesion changes, bleeds, or worries you.
        </p>
      </div>

      {/* Consultation CTA */}
      {(analysis.severity === 'Medium' || analysis.severity === 'High') && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pt-6 border-t border-slate-200"
        >
          <ConsultationCards analysisId={id} />
        </motion.section>
      )}
      {analysis.severity === 'Low' && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6">
          <p className="font-semibold text-emerald-800">Recommendation</p>
          <p className="text-emerald-700 text-sm mt-1">
            Monitor the lesion. Re-analyze in 2 weeks or if it changes in size, shape, color, or texture. When in doubt, see a dermatologist.
          </p>
        </div>
      )}
    </div>
  );
}
