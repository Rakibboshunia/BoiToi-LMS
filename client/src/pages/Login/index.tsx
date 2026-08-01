import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, BookOpen, Zap } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPass, setShowPass] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data);
      const redirectPath = res.user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
      navigate(from === '/' ? redirectPath : from, { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0d1b3e 100%)' }}>
      {/* ── Left decorative panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative text-center"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f97316, #8b5cf6)' }}>
              <Sparkles size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">LMS <span style={{ background: 'linear-gradient(90deg,#f97316,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Platform</span></span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Learn. Grow.<br />
            <span style={{ background: 'linear-gradient(90deg,#f97316,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Succeed.</span>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Join thousands of students and teachers<br />on the most powerful LMS platform.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 mt-10">
            {[
              { icon: <BookOpen size={16} />, text: 'Access 500+ premium courses' },
              { icon: <Zap size={16} />, text: 'Live interactive sessions' },
              { icon: <Sparkles size={16} />, text: 'AI-powered learning paths' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#f97316,#8b5cf6)' }}>
                  {f.icon}
                </div>
                <span className="text-sm text-white/70">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right: Login Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f97316,#8b5cf6)' }}>
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">LMS Platform</span>
          </div>

          <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-white">Welcome back 👋</h1>
              <p className="mt-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Sign in to continue your learning journey
              </p>
            </div>


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200"
                    placeholder="you@example.com"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={e => (e.currentTarget.style.border = '1px solid rgba(249,115,22,0.5)')}
                    onBlur={e => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)')}
                  />
                </div>
                {errors.email && <p className="text-xs mt-1.5" style={{ color: '#fca5a5' }}>{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Password</label>
                  <Link to="/forgot-password" className="text-xs font-medium transition-opacity hover:opacity-80" style={{ color: '#f97316' }}>
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    {...register("password")}
                    className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200"
                    placeholder="••••••••"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onFocus={e => (e.currentTarget.style.border = '1px solid rgba(249,115,22,0.5)')}
                    onBlur={e => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)')}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                    style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs mt-1.5" style={{ color: '#fca5a5' }}>{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:-translate-y-0.5 mt-2"
                style={{
                  background: isSubmitting ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg, #f97316, #8b5cf6)',
                  boxShadow: '0 4px 20px rgba(249,115,22,0.3)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold transition-opacity hover:opacity-80" style={{ color: '#f97316' }}>
                Create one free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
