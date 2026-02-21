import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function UploadForm({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setLoading(true);
    try {
      const res = await api.post('/api/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Analysis complete');
      navigate(`/analysis/${res.data.analysis_id}`);
      if (onUpload) onUpload();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-2 border-dashed p-6 rounded text-center">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <button
        type="submit"
        disabled={!file || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Upload & Analyze'}
      </button>
    </form>
  );
}