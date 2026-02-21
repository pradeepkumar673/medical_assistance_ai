import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChatBubbleLeftRightIcon, PhoneIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

const OPTIONS = [
  {
    type: 'chat',
    title: 'Chat Consultation',
    price: '₹300',
    desc: 'Quick text advice',
    detail: 'Usually &lt; 30 min response',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    type: 'call',
    title: 'Voice Call',
    price: '₹500',
    desc: '10–15 min call',
    detail: 'Immediate',
    icon: PhoneIcon,
  },
  {
    type: 'video',
    title: 'Video Consultation',
    price: '₹1,000',
    desc: 'Full visual exam',
    detail: 'Highest accuracy',
    icon: VideoCameraIcon,
  },
];

export default function ConsultationCards({ analysisId }) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-xl font-semibold text-slate-800">
        Consult a dermatologist
      </h3>
      <p className="text-slate-600 text-sm">
        Choose a consultation type. You&apos;ll pick a doctor on the next step.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OPTIONS.map((opt, i) => {
          const Icon = opt.icon;
          return (
            <motion.div
              key={opt.type}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <Link to={`/consult/${analysisId}?type=${opt.type}`}>
                <div className="card-glass p-6 h-full border-2 border-transparent group-hover:border-teal-200 transition-all duration-200">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                    <Icon className="w-6 h-6 text-teal-700" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-1">{opt.title}</h4>
                  <p className="text-2xl font-bold text-teal-700 mb-2">{opt.price}</p>
                  <p className="text-sm text-slate-600">{opt.desc}</p>
                  <p className="text-xs text-slate-500 mt-1">{opt.detail}</p>
                  <span className="inline-block mt-4 text-teal-600 font-medium text-sm group-hover:underline">
                    Select →
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
