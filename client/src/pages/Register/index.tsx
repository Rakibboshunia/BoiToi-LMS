import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Sparkles, ArrowRight, GraduationCap, ChalkboardTeacher } from 'lucide-react';

// Use a simple SVG icon since lucide doesn't have ChalkboardTeacher
const TeacherIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  role: z.enum(['student', 'teacher'], {
    error: "Please select an account type",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'student' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError(null);
      const { confirmPassword: _cp, ...submitData } = data;
      const res = await registerUser(submitData);
      const redirectPath = res.user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to register. Please try again.");
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-10"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0d1b3e 100%)' }}>
      {/* Decorative orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
      <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
      <div className="fixed top-1/2 right-1/4 w-60 h-60 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f97316, #8b5cf6)' }}>
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            LMS <span style={{ background: 'linear-gradient(90deg,#f97316,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Platform</span>
          </span>
        </div>

        <div className="rounded-2xl p-7"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Create your account ✨</h1>
            <p className="mt-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Join thousands of learners and educators today
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-xl mb-5 text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {/* Student */}
                <label className="relative cursor-pointer">
                  <input type="radio" value="student" {...register('role')} className="sr-only" />
                  <div className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-200"
                    style={selectedRole === 'student' ? {
                      background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
                      border: '2px solid rgba(59,130,246,0.5)',
                    } : {
                      background: 'rgba(255,255,255,0.04)',
                      border: '2px solid rgba(255,255,255,0.08)',
                    }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: selectedRole === 'student' ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : 'rgba(255,255,255,0.08)' }}>
                      <User size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: selectedRole === 'student' ? 'white' : 'rgba(255,255,255,0.5)' }}>
                      Student
                    </span>
                  </div>
                </label>

                {/* Teacher */}
                <label className="relative cursor-pointer">
                  <input type="radio" value="teacher" {...register('role')} className="sr-only" />
                  <div className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-200"
                    style={selectedRole === 'teacher' ? {
                      background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(139,92,246,0.2))',
                      border: '2px solid rgba(249,115,22,0.5)',
                    } : {
                      background: 'rgba(255,255,255,0.04)',
                      border: '2px solid rgba(255,255,255,0.08)',
                    }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: selectedRole === 'teacher' ? 'linear-gradient(135deg,#f97316,#8b5cf6)' : 'rgba(255,255,255,0.08)' }}>
                      <TeacherIcon />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: selectedRole === 'teacher' ? 'white' : 'rgba(255,255,255,0.5)' }}>
                      Teacher
                    </span>
                  </div>
                </label>
              </div>
              {errors.role && <p className="text-xs mt-1.5" style={{ color: '#fca5a5' }}>{errors.role.message}</p>}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type="text" {...register("name")} placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.border = '1px solid rgba(249,115,22,0.5)')}
                  onBlur={e => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)')}
                />
              </div>
              {errors.name && <p className="text-xs mt-1.5" style={{ color: '#fca5a5' }}>{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type="email" {...register("email")} placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.border = '1px solid rgba(249,115,22,0.5)')}
                  onBlur={e => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)')}
                />
              </div>
              {errors.email && <p className="text-xs mt-1.5" style={{ color: '#fca5a5' }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type={showPass ? 'text' : 'password'} {...register("password")} placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-white outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.border = '1px solid rgba(249,115,22,0.5)')}
                  onBlur={e => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)')}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 transition-opacity"
                  style={{ color: 'white' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1.5" style={{ color: '#fca5a5' }}>{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type="password" {...register("confirmPassword")} placeholder="Repeat your password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.border = '1px solid rgba(249,115,22,0.5)')}
                  onBlur={e => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)')}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs mt-1.5" style={{ color: '#fca5a5' }}>{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm mt-2 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: isSubmitting ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg, #f97316, #8b5cf6)',
                boxShadow: '0 4px 20px rgba(249,115,22,0.3)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition-opacity hover:opacity-80" style={{ color: '#f97316' }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
