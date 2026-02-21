import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const STATUS_STYLE = {
  pending: 'bg-amber-50 border-amber-200 text-amber-800',
  accepted: 'bg-teal-50 border-teal-200 text-teal-800',
  rejected: 'bg-red-50 border-red-200 text-red-700',
  paid: 'bg-emerald-50 border-emerald-200 text-emerald-700',
};

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [responding, setResponding] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/consult/requests');
      setRequests(res.data || []);
    } catch (err) {
      toast.error('Failed to load requests');
    }
  };

  const handleResponse = async (consultId, action, timeSlot = null) => {
    setResponding(consultId);
    try {
      await api.post(`/consult/respond/${consultId}`, { action, time_slot: timeSlot });
      toast.success(`Request ${action}ed`);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to respond');
    } finally {
      setResponding(null);
    }
  };

  const handleAccept = (req) => {
    const slot = window.prompt('Enter time slot (e.g. 2025-03-01 14:00):');
    if (slot) handleResponse(req.id, 'accept', slot);
  };

  const pending = requests.filter((r) => r.status === 'pending');
  const others = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome, Dr. {user?.name}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="text-slate-600 hover:text-red-600 font-medium text-sm"
        >
          Log out
        </button>
      </div>

      <section>
        <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">Pending requests</h2>
        {pending.length === 0 ? (
          <div className="card-glass p-8 text-center text-slate-500">
            No pending requests.
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-glass p-6 border border-slate-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                      <UserCircleIcon className="w-8 h-8 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{req.user_name}</p>
                      <p className="text-sm text-slate-500">Condition: {req.disease}</p>
                      <p className="text-sm text-slate-500">Type: {req.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAccept(req)}
                      disabled={responding === req.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      {responding === req.id ? '…' : 'Accept'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResponse(req.id, 'reject')}
                      disabled={responding === req.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 disabled:opacity-50"
                    >
                      <XCircleIcon className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">Accepted / past</h2>
        {others.length === 0 ? (
          <div className="card-glass p-6 text-center text-slate-500 text-sm">
            No other consultations yet.
          </div>
        ) : (
          <div className="space-y-3">
            {others.map((req) => (
              <div
                key={req.id}
                className={`card-glass p-4 flex flex-wrap items-center justify-between gap-4 border ${STATUS_STYLE[req.status] || 'border-slate-200'}`}
              >
                <div className="flex items-center gap-3">
                  <ClockIcon className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-800">{req.user_name}</p>
                    <p className="text-sm text-slate-600">
                      {req.time_slot ? new Date(req.time_slot).toLocaleString() : req.status}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[req.status] || 'bg-slate-100'}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
