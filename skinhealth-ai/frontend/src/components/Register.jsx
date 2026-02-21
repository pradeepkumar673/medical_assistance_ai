import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

export default function Register() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    role: roleParam === 'doctor' ? 'doctor' : 'user',
    phone: '',
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/login');
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
          <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">Create account</h1>
          <p className="text-slate-600 text-sm mb-8">Join to get AI skin analysis and dermatologist access.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">I am a</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              >
                <option value="user">User (patient)</option>
                <option value="doctor">Dermatologist</option>
              </select>
            </div>
            {form.role === 'doctor' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone (optional)</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                />
              </div>
            )}
            <button type="submit" className="btn-primary w-full py-3 rounded-xl">
              Register
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-teal-600 hover:text-teal-700">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
