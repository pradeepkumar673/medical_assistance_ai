import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import DoctorCard from './DoctorCard';

const TYPE_LABELS = { chat: 'Chat (₹300)', call: 'Voice (₹500)', video: 'Video (₹1,000)' };

export default function ConsultationRequest() {
  const { analysisId } = useParams();
  const [searchParams] = useSearchParams();
  const typeFromUrl = searchParams.get('type') || 'chat';
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [consultType, setConsultType] = useState(typeFromUrl);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/consult/doctors');
        setDoctors(res.data || []);
      } catch (err) {
        toast.error('Failed to load doctors');
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }
    setLoading(true);
    try {
      await api.post('/consult/request', {
        doctor_id: selectedDoctor,
        analysis_id: analysisId,
        type: consultType,
      });
      toast.success('Request sent to doctor');
      navigate('/user');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glass p-8"
      >
        <Link to={`/analysis/${analysisId}`} className="text-teal-600 hover:text-teal-700 text-sm font-medium mb-6 inline-block">
          ← Back to result
        </Link>
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">Request consultation</h1>
        <p className="text-slate-600 text-sm mb-8">Choose a dermatologist and consultation type.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Consultation type</label>
            <div className="flex flex-wrap gap-2">
              {['chat', 'call', 'video'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setConsultType(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    consultType === t ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Select dermatologist</label>
            {doctors.length === 0 ? (
              <p className="text-slate-500 py-4">No dermatologists available. Try again later.</p>
            ) : (
              <div className="space-y-3">
                {doctors.map((d) => (
                  <DoctorCard
                    key={d.id}
                    doctor={d}
                    selected={selectedDoctor === d.id}
                    onSelect={setSelectedDoctor}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!selectedDoctor || loading}
            className="btn-primary w-full py-3 rounded-xl disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Sending…' : 'Send request'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
