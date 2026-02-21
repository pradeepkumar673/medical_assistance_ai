import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Landing from './Landing';

export default function LandingOrRedirect() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin" />
      </div>
    );
  }
  if (user) {
    const target = user.role === 'doctor' ? '/doctor' : '/user';
    return <Navigate to={target} replace />;
  }
  return <Landing />;
}
