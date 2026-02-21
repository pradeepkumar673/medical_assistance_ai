import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import UploadZone from './UploadZone';

const SEVERITY_STYLE = {
  High: 'bg-red-50 border-red-200 text-red-700',
  Medium: 'bg-amber-50 border-amber-200 text-amber-800',
  Low: 'bg-emerald-50 border-emerald-200 text-emerald-700',
};

export default function UserDashboard() {
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const res = await api.get('/api/analyses');
      setAnalyses(res.data || []);
    } catch (err) {
      toast.error('Failed to load analyses');
    }
  };

  return (
    <div className="space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-display text-2xl font-bold text-slate-800 mb-4">New analysis</h2>
        <UploadZone onUpload={fetchAnalyses} />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-display text-2xl font-bold text-slate-800 mb-4">Past analyses</h2>
        {analyses.length === 0 ? (
          <div className="card-glass p-12 text-center text-slate-500">
            <p>No analyses yet. Upload an image above to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                whileHover={{ y: -2 }}
              >
                <Link to={`/analysis/${a.id}`}>
                  <div className={`card-glass p-5 border ${SEVERITY_STYLE[a.severity] || SEVERITY_STYLE.Low}`}>
                    <p className="text-xs text-slate-500">
                      {a.timestamp ? new Date(a.timestamp).toLocaleDateString() : '—'}
                    </p>
                    <p className="font-semibold text-slate-800 mt-1">{a.prediction}</p>
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_STYLE[a.severity] || SEVERITY_STYLE.Low}`}>
                      {a.severity}
                    </span>
                    <p className="mt-3 text-teal-600 text-sm font-medium">View details →</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
