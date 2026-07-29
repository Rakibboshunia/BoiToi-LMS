import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  // Default redirect is student dashboard, unless coming from somewhere else
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      const res = await login(data);
      
      // Redirect based on role
      const redirectPath = res.user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
      navigate(from === '/' ? redirectPath : from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-background rounded-xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Log in to continue your learning journey</p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-foreground">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                {...register("password")}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 transition-opacity flex justify-center items-center h-10 mt-6"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Register here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
