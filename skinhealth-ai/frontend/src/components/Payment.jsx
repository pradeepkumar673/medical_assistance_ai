import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * Razorpay frontend integration (snippet).
 * Load script: <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
 * Backend returns order_id, amount, key_id. You create options and open Razorpay checkout.
 */
export default function Payment() {
  const [searchParams] = useSearchParams();
  const consultationId = searchParams.get('consultation_id');
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!consultationId) return;
    const createOrder = async () => {
      try {
        const res = await api.post('/consult/create-order', { consultation_id: consultationId });
        setOrder(res.data);
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Could not create order');
      }
    };
    createOrder();
  }, [consultationId]);

  const openRazorpay = () => {
    if (!order?.order_id || !window.Razorpay) {
      toast.error('Payment not configured. Load Razorpay script and set keys.');
      return;
    }
    setLoading(true);
    const options = {
      key: order.key_id,
      amount: order.amount,
      currency: 'INR',
      order_id: order.order_id,
      name: 'SkinHealth AI',
      description: 'Consultation payment',
      handler: async (response) => {
        try {
          await api.post('/consult/verify-payment', {
            consultation_id: consultationId,
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
          setPaid(true);
          toast.success('Payment successful!');
        } catch (err) {
          toast.error(err.response?.data?.msg || 'Verification failed');
        } finally {
          setLoading(false);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => {
      toast.error('Payment failed');
      setLoading(false);
    });
    rzp.open();
  };

  if (paid) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto card-glass p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-800 mb-2">Payment successful</h2>
        <p className="text-slate-600 mb-8">The doctor will contact you soon.</p>
        <button type="button" onClick={() => navigate('/user')} className="btn-primary rounded-xl px-6 py-3">
          Back to dashboard
        </button>
      </motion.div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto card-glass p-8 text-center">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-slate-600">Preparing payment…</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto card-glass p-8"
    >
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-6">Complete payment</h1>
      <div className="rounded-xl bg-slate-50 p-4 mb-6">
        <p className="text-sm text-slate-500">Amount</p>
        <p className="text-2xl font-bold text-slate-800">₹{order.amount / 100}</p>
      </div>
      <button
        type="button"
        onClick={openRazorpay}
        disabled={loading}
        className="btn-primary w-full py-3 rounded-xl disabled:opacity-50"
      >
        {loading ? 'Opening…' : 'Pay securely with Razorpay'}
      </button>
      <p className="mt-4 text-xs text-slate-500 text-center">
        You will be redirected to Razorpay checkout.
      </p>
    </motion.div>
  );
}
