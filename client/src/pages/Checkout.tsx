import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, ShieldCheck, CreditCard, CheckCircle, 
  ArrowLeft, Star, Clock, Award, PlayCircle, 
  Zap, Tag, GraduationCap
} from 'lucide-react';
import { getCourse } from '../services/courseApi';

const Checkout: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  // Fetch the real course data
  const { data, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourse(courseId as string),
    enabled: !!courseId,
  });
  const course = data?.data;

  const discount = couponApplied ? (course?.price || 0) * 0.2 : 0;
  const total = (course?.price || 0) - discount;

  const handleCoupon = () => {
    if (coupon.trim().toUpperCase() === 'LEARN20') {
      setCouponApplied(true);
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  // Success screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="bg-slate-900 border border-slate-700 rounded-3xl p-12 shadow-2xl text-center max-w-lg w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30"
          >
            <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-white mb-3"
          >
            You're Enrolled! 🎉
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 mb-10 text-lg leading-relaxed"
          >
            You now have full lifetime access to{' '}
            <span className="text-white font-semibold">"{course?.title}"</span>.
            Let's start learning!
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate('/student/dashboard')}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg transition-all hover:-translate-y-1 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
          >
            <PlayCircle size={22} /> Go to My Learning
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
      {/* Subtle top gradient */}
      <div className="fixed top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-blue-950/30 to-transparent pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md py-4 px-6 lg:px-12">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center bg-white px-3 py-1.5 rounded-xl">
            <img src="/logo.png" alt="BoiToi" className="h-8 object-contain" />
          </Link>
          <Link
            to={`/courses/${courseId}`}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Course
          </Link>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-2">Complete Your Enrollment</h1>
          <p className="text-slate-400">You're one step away from unlocking full access.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Payment Form – 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Card form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">1</span>
                Payment Details
              </h2>

              <form onSubmit={handlePayment} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Card Holder Name</label>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Card Number</label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      maxLength={19}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors pr-14"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                      <div className="w-6 h-4 bg-red-500 rounded-sm opacity-80" />
                      <div className="w-6 h-4 bg-yellow-400 rounded-sm opacity-80 -ml-2" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Expiry Date</label>
                    <input
                      required
                      type="text"
                      placeholder="MM / YY"
                      maxLength={7}
                      className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">CVV</label>
                    <input
                      required
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Coupon */}
                <div className="pt-4 border-t border-slate-800">
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Tag size={14} /> Coupon Code <span className="text-slate-500 text-xs font-normal">(try: LEARN20)</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                      disabled={couponApplied}
                      className="flex-1 px-4 py-3 bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={handleCoupon}
                      disabled={couponApplied}
                      className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {couponApplied ? '✓ Applied' : 'Apply'}
                    </button>
                  </div>
                  <AnimatePresence>
                    {couponApplied && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-2 text-emerald-400 text-sm font-medium flex items-center gap-1"
                      >
                        <CheckCircle size={14} /> 20% discount applied!
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-70 text-white rounded-xl font-bold text-lg transition-all hover:-translate-y-1 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Payment…
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Pay ${total.toFixed(2)} — Enroll Now
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-slate-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  256-bit SSL encryption · Your payment is 100% secure
                </p>
              </form>
            </div>
          </div>

          {/* Order Summary – 2 columns */}
          <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-8">
            {/* Course info */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              {isLoading ? (
                <div className="p-8 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
                </div>
              ) : (
                <>
                  <div className="aspect-video bg-slate-800 relative">
                    {course?.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GraduationCap size={48} className="text-slate-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs text-blue-400 font-medium uppercase tracking-wider mb-1">{course?.category}</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    <h3 className="font-bold text-white text-lg leading-snug">{course?.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" fill="currentColor" />
                        {course?.rating?.average?.toFixed(1) || '4.8'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {course?.totalDuration || '12'} hrs
                      </span>
                      <span className="flex items-center gap-1 capitalize">
                        <Award size={14} /> {course?.level}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400">
                      By <span className="text-slate-200 font-medium">{course?.teacher?.name}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Course Price</span>
                  <span className="text-white font-medium">${course?.price?.toFixed(2) || '0.00'}</span>
                </div>
                {couponApplied && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between text-emerald-400 font-medium"
                  >
                    <span>Coupon (LEARN20)</span>
                    <span>–${discount.toFixed(2)}</span>
                  </motion.div>
                )}
                <div className="flex justify-between font-bold text-xl text-white border-t border-slate-800 pt-4">
                  <span>Total</span>
                  <span className="text-emerald-400">${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-800/50 rounded-xl p-3 mt-2">
                <ShieldCheck size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>30-Day Money-Back Guarantee. No questions asked.</span>
              </div>
            </div>

            {/* What you get */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Included in this plan</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                {[
                  'Lifetime access to all materials',
                  'Live interactive sessions',
                  'Quizzes & Assignments',
                  'Downloadable resources',
                  'Certificate of completion',
                  'Community Q&A support',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle size={12} className="text-emerald-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
