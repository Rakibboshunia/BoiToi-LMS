import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, ShieldCheck, CreditCard, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock course data – in production fetched via getCourse(courseId)
const mockCourse = {
  title: 'Complete Web Development Bootcamp',
  price: 49.99,
  thumbnail: '',
  teacher: { name: 'John Doe' },
  totalLessons: 120,
};

const Checkout: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment gateway call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-background border border-border rounded-2xl p-12 shadow-xl text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Enrollment Successful!</h2>
          <p className="text-muted-foreground mb-8">
            You now have full access to <span className="font-semibold text-foreground">{mockCourse.title}</span>.
          </p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Order Summary */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-6 lg:sticky lg:top-8">
          <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

          <div className="flex gap-4 items-start pb-6 border-b border-border">
            <div className="w-20 h-16 bg-secondary rounded-xl overflow-hidden shrink-0">
              {mockCourse.thumbnail ? (
                <img src={mockCourse.thumbnail} alt={mockCourse.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground leading-snug">{mockCourse.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">By {mockCourse.teacher.name}</p>
              <p className="text-xs text-muted-foreground">{mockCourse.totalLessons} lessons · Lifetime access</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Original Price</span>
              <span>${mockCourse.price}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount (–)</span>
              <span>–$0.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-foreground border-t border-border pt-3">
              <span>Total</span>
              <span>${mockCourse.price}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck size={16} className="text-green-600 shrink-0" />
            <span>30-Day Money-Back Guarantee. Safe &amp; Secure Checkout.</span>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <CreditCard size={20} />
            Payment Details
          </h2>

          <form onSubmit={handlePayment} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Card Holder Name</label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Card Number</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:outline-none pr-12"
                />
                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Expiry Date</label>
                <input
                  required
                  type="text"
                  placeholder="MM / YY"
                  maxLength={7}
                  className="w-full px-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">CVV</label>
                <input
                  required
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  className="w-full px-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-base hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Pay ${mockCourse.price}
                </>
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <ShieldCheck size={13} className="text-green-600" />
              Your payment is encrypted and secure.
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
