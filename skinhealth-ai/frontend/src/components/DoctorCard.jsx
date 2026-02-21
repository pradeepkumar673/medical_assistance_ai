import { motion } from 'framer-motion';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function DoctorCard({ doctor, selected, onSelect }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      onClick={() => onSelect(doctor.id)}
      className={`
        w-full text-left rounded-2xl p-5 border-2 transition-all duration-200
        flex items-center gap-4
        ${selected ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-slate-50/50'}
      `}
    >
      <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
        <UserCircleIcon className="w-9 h-9 text-teal-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 truncate">{doctor.name}</p>
        {doctor.phone && (
          <p className="text-sm text-slate-500 truncate">{doctor.phone}</p>
        )}
        {doctor.is_online && (
          <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Online
          </span>
        )}
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-teal-600 bg-teal-600' : 'border-slate-300'}`}>
        {selected && <span className="text-white text-xs">✓</span>}
      </div>
    </motion.button>
  );
}
