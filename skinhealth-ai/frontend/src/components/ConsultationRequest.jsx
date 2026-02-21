import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ConsultationRequest() {
  const { analysisId } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [consultType, setConsultType] = useState('chat');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/consult/doctors');
        setDoctors(res.data);
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
    try {
      await api.post('/consult/request', {
        doctor_id: selectedDoctor,
        analysis_id: analysisId,
        type: consultType
      });
      toast.success('Request sent to doctor');
      navigate('/user');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Request failed');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Request Consultation</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Doctor</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">-- Choose --</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} {d.is_online ? '(Online)' : ''}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Consultation Type</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="radio" value="chat" checked={consultType === 'chat'} onChange={(e) => setConsultType(e.target.value)} className="mr-2" />
              Chat (₹300)
            </label>
            <label className="flex items-center">
              <input type="radio" value="call" checked={consultType === 'call'} onChange={(e) => setConsultType(e.target.value)} className="mr-2" />
              Call (₹500)
            </label>
            <label className="flex items-center">
              <input type="radio" value="video" checked={consultType === 'video'} onChange={(e) => setConsultType(e.target.value)} className="mr-2" />
              Video Call (₹1000)
            </label>
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Send Request
        </button>
      </form>
    </div>
  );
}