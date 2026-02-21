import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BeakerIcon,
  ShieldCheckIcon,
  HeartIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const DISEASE_CLASSES = [
  { name: 'Actinic Keratoses', short: 'AK', color: 'from-amber-100 to-orange-100' },
  { name: 'Basal Cell Carcinoma', short: 'BCC', color: 'from-rose-100 to-pink-100' },
  { name: 'Benign Keratosis', short: 'BKL', color: 'from-slate-100 to-slate-200' },
  { name: 'Dermatofibroma', short: 'DF', color: 'from-violet-100 to-purple-100' },
  { name: 'Melanoma', short: 'MEL', color: 'from-red-100 to-coral' },
  { name: 'Melanocytic Nevi', short: 'NV', color: 'from-emerald-100 to-teal-100' },
  { name: 'Vascular Lesions', short: 'VASC', color: 'from-sky-100 to-blue-100' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface bg-skin-texture">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-slate-50" />
        <div className="absolute inset-0 bg-skin-texture opacity-50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-teal-600 font-medium text-sm uppercase tracking-widest mb-4">
              AI-Powered Skin Analysis
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight max-w-4xl mx-auto">
              Early Detection Saves Lives
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto font-body">
              Get instant AI-powered skin analysis and connect with board-certified dermatologists — all from your phone or computer.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/register"
                  className="btn-primary text-lg px-8 py-4 rounded-2xl shadow-glass-lg"
                >
                  Analyze My Skin (Free)
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/register?role=doctor"
                  className="btn-secondary text-lg px-8 py-4 rounded-2xl"
                >
                  I&apos;m a Dermatologist
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="relative py-12 border-t border-slate-200/60 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-x-12 gap-y-4 text-slate-600 text-sm">
          <span className="flex items-center gap-2">
            <BeakerIcon className="w-5 h-5 text-teal-600" />
            Powered by HAM10000-trained deep learning
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-teal-600" />
            Privacy first — your images stay secure
          </span>
          <span className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
            Not a substitute for professional diagnosis
          </span>
        </div>
      </section>

      {/* Disease classes cards */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-bold text-center text-slate-800 mb-4"
          >
            Conditions We Help Identify
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-slate-600 mb-12 max-w-xl mx-auto"
          >
            Our model is trained on the HAM10000 dataset to recognize these seven common skin conditions.
          </motion.p>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4"
          >
            {DISEASE_CLASSES.map((d) => (
              <motion.div
                key={d.short}
                variants={item}
                whileHover={{ y: -4 }}
                className={`rounded-2xl p-4 bg-gradient-to-br ${d.color} border border-white/60 shadow-glass cursor-default`}
              >
                <div className="text-2xl font-bold text-slate-700">{d.short}</div>
                <div className="text-xs font-medium text-slate-600 mt-1">{d.name}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA + Login */}
      <section className="py-16 bg-teal-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Already have an account?
          </h2>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3 font-medium text-teal-800 bg-white hover:bg-teal-50 transition shadow-lg"
          >
            <HeartIcon className="w-5 h-5" />
            Sign in
          </Link>
        </div>
      </section>
    </div>
  );
}
