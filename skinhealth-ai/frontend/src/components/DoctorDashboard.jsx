import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/consult/requests');
      setRequests(res.data);
    } catch (err) {
      toast.error('Failed to load requests');
    }
  };

  const handleResponse = async (consultId, action, timeSlot = null) => {
    try {
      await api.post(`/consult/respond/${consultId}`, { action, time_slot: timeSlot });
      toast.success(`Request ${action}ed`);
      fetchRequests();
    } catch (err) {
      toast.error('Failed to respond');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
      <p className="mb-4">Welcome, Dr. {user?.name}</p>

      <h2 className="text-2xl font-semibold mb-4">Pending Consultation Requests</h2>
      {requests.filter(r => r.status === 'pending').map(req => (
        <div key={req.id} className="border p-4 rounded shadow mb-4">
          <p><strong>Patient:</strong> {req.user_name}</p>
          <p><strong>Disease:</strong> {req.disease}</p>
          <p><strong>Type:</strong> {req.type}</p>
          <div className="mt-2 space-x-2">
            <button
              onClick={() => {
                const slot = prompt('Enter time slot (YYYY-MM-DD HH:MM):');
                if (slot) handleResponse(req.id, 'accept', slot);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Accept
            </button>
            <button
              onClick={() => handleResponse(req.id, 'reject')}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      <h2 className="text-2xl font-semibold mt-8 mb-4">Accepted / Past Consultations</h2>
      {requests.filter(r => r.status !== 'pending').map(req => (
        <div key={req.id} className="border p-4 rounded shadow mb-2">
          <p><strong>Patient:</strong> {req.user_name} - <strong>Status:</strong> {req.status}</p>
          {req.time_slot && <p><strong>Scheduled:</strong> {new Date(req.time_slot).toLocaleString()}</p>}
        </div>
      ))}
    </div>
  );
}