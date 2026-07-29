import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  role: z.enum(['student', 'teacher'], {
    required_error: "Please select an account type",
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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'student',
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError(null);
      // Omit confirmPassword before sending to API
      const { confirmPassword, ...submitData } = data;
      const res = await registerUser(submitData);
      
      const redirectPath = res.user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to register. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-background rounded-xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Create an Account</h1>
            <p className="text-muted-foreground mt-2">Join us and start learning today</p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Role Selection */}
            <div className="flex gap-4 mb-6">
              <label 
                className={`flex-1 cursor-pointer border rounded-lg p-3 text-center transition-all ${
                  selectedRole === 'student' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-input hover:bg-accent text-muted-foreground'
                }`}
              >
                <input type="radio" value="student" {...register('role')} className="hidden" />
                <span className="block font-medium">Student</span>
              </label>
              <label 
                className={`flex-1 cursor-pointer border rounded-lg p-3 text-center transition-all ${
                  selectedRole === 'teacher' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-input hover:bg-accent text-muted-foreground'
                }`}
              >
                <input type="radio" value="teacher" {...register('role')} className="hidden" />
                <span className="block font-medium">Teacher</span>
              </label>
            </div>
            {errors.role && <p className="text-destructive text-xs mt-1">{errors.role.message}</p>}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <input
                type="text"
                {...register("name")}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                type="password"
                {...register("password")}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                placeholder="Min. 8 characters"
              />
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 transition-opacity flex justify-center items-center h-10 mt-6"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
