import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const role = await login(email, password);
      navigate(role === 'user' ? '/user' : '/doctor');
    } catch (err) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface bg-skin-texture p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card-glass p-8 shadow-glass-lg">
          <Link to="/" className="inline-block text-teal-600 font-display font-bold text-lg mb-6">
            ← SkinHealth AI
          </Link>
          <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">Welcome back</h1>
          <p className="text-slate-600 text-sm mb-8">Sign in to access your analyses and consultations.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full py-3 rounded-xl">
              Sign in
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-teal-600 hover:text-teal-700">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
