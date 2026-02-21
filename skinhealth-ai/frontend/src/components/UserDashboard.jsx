import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import UploadForm from './UploadForm';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const res = await api.get('/api/analyses'); // We'll add this endpoint later
      setAnalyses(res.data);
    } catch (err) {
      toast.error('Failed to load analyses');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
      <p className="mb-4">Welcome, {user?.name}!</p>

      <UploadForm onUpload={fetchAnalyses} />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Past Analyses</h2>
      <div className="grid gap-4">
        {analyses.map(a => (
          <div key={a.id} className="border p-4 rounded shadow">
            <p><strong>Disease:</strong> {a.prediction}</p>
            <p><strong>Severity:</strong> {a.severity}</p>
            <p><strong>Date:</strong> {new Date(a.timestamp).toLocaleString()}</p>
            <Link to={`/analysis/${a.id}`} className="text-blue-600">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}