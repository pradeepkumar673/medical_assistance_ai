import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  PhotoIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const nav = [
  { to: '/user', label: 'Home', icon: HomeIcon },
  { to: '/user', label: 'New Analysis', icon: PhotoIcon },
  { to: '/user', label: 'My History', icon: ClockIcon },
  { to: '/user', label: 'Consultations', icon: ChatBubbleLeftRightIcon },
  { to: '/user', label: 'Profile', icon: UserCircleIcon },
];

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200/80 shadow-glass
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <Link to="/user" className="font-display text-xl font-bold text-teal-700">
              SkinHealth AI
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {nav.map(({ to, label, icon: Icon }, idx) => {
              const isActive = location.pathname === '/user' ? idx === 0 : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
                    ${isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}
                  `}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-100">
            <p className="px-4 py-2 text-sm text-slate-500 truncate">{user?.name}</p>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 font-medium transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 py-3 lg:px-8">
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6 text-slate-600" />
          </button>
        </header>
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
