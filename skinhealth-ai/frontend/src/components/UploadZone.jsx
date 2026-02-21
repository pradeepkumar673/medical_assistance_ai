import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function UploadZone({ onUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleFile = useCallback(
    async (file) => {
      if (!file || !file.type.startsWith('image/')) {
        toast.error('Please upload an image (PNG, JPG, JPEG)');
        return;
      }
      setPreview(URL.createObjectURL(file));
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await api.post('/api/predict', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Analysis complete');
        onUpload?.();
        navigate(`/analysis/${res.data.analysis_id}`);
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Upload failed');
        setPreview(null);
      } finally {
        setLoading(false);
      }
    },
    [navigate, onUpload]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass p-8 md:p-12"
    >
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-300
          min-h-[280px] flex flex-col items-center justify-center text-center p-8
          ${dragActive ? 'border-teal-500 bg-teal-50/50 scale-[1.01]' : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50/50'}
          ${loading ? 'pointer-events-none opacity-80' : ''}
        `}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-14 h-14 rounded-full border-4 border-teal-200 border-t-teal-600"
            />
            <p className="text-slate-600 font-medium">Analyzing your image…</p>
          </div>
        ) : preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-40 rounded-xl object-contain mx-auto shadow-lg"
            />
            <p className="text-sm text-slate-500">Processing…</p>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 rounded-2xl bg-teal-100 flex items-center justify-center mb-4">
              <PhotoIcon className="w-10 h-10 text-teal-600" />
            </div>
            <p className="text-lg font-semibold text-slate-700 mb-1">
              Drag & drop your image here
            </p>
            <p className="text-sm text-slate-500 mb-6">or click to browse</p>
            <label className="btn-primary cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onInputChange}
                disabled={loading}
              />
              <span className="flex items-center gap-2">
                <ArrowUpTrayIcon className="w-5 h-5" />
                Choose image
              </span>
            </label>
          </>
        )}
      </div>
    </motion.div>
  );
}
