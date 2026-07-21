// app/staff/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Context & UI Imports
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitchLight } from '@/components/ui/LanguageSwitch';
import { academyData } from '@/data/academyData';

// Secure Server Action Import
import { registerUser } from '@/lib/db/auth';

// Validation Schema with password matching
const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function StaffRegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
      fullName: '', 
      email: '', 
      password: '', 
      confirmPassword: '' 
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (isLoading) return;
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      // Call the Server Action directly (No fetch needed!)
      const result = await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        setSuccess('Registration successful! Redirecting to login...');
        // Redirect to login page after a short delay so they can see the success message
        setTimeout(() => {
          router.push('/staff/login');
        }, 2000);
      } else {
        setError(result.error || t.staff.register?.error || 'Registration failed');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(t.staff.register?.error || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-secondary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back to Login */}
        <Link 
          href="/staff/login" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{t.common?.backToLogin || 'Back to Login'}</span>
        </Link>

        <div className="card p-8 bg-white rounded-xl shadow-xl">
          {/* Logo & Heading */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-md">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">{academyData.name}</h1>
            <p className="text-text-secondary text-sm mt-1">{t.staff.register?.heading || 'Create Staff Account'}</p>
          </div>

          {/* Language Switch */}
          <div className="flex justify-center mb-6">
            <LanguageSwitchLight />
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            
            {/* Full Name */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="fullName" className="form-label text-sm font-medium text-text-primary">
                {t.staff.register?.fullName || 'Full Name'}
              </label>
              <input
                type="text"
                id="fullName"
                {...register('fullName')}
                className={`form-input p-2.5 border rounded-lg outline-none transition-all ${
                  errors.fullName ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'focus:border-primary'
                }`}
                placeholder="John Doe"
                autoComplete="name"
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="form-error text-xs text-red-500 font-medium">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="email" className="form-label text-sm font-medium text-text-primary">
                {t.staff.register?.email || 'Email Address'}
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className={`form-input p-2.5 border rounded-lg outline-none transition-all ${
                  errors.email ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'focus:border-primary'
                }`}
                placeholder="staff@stylishenglish.com"
                autoComplete="email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="form-error text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="password" className="form-label text-sm font-medium text-text-primary">
                {t.staff.register?.password || 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password')}
                  className={`form-input w-full p-2.5 border rounded-lg outline-none transition-all pr-12 ${
                    errors.password ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'focus:border-primary'
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="form-error text-xs text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="form-label text-sm font-medium text-text-primary">
                {t.staff.register?.confirmPassword || 'Confirm Password'}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  className={`form-input w-full p-2.5 border rounded-lg outline-none transition-all pr-12 ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'focus:border-primary'
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="form-error text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Messages (Error & Success) */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg overflow-hidden"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg overflow-hidden"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full flex items-center justify-center gap-2 p-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t.staff.register?.creating || 'Creating Account...'}</span>
                </>
              ) : (
                <span>{t.staff.register?.registerButton || 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-text-secondary mt-6">
            {t.staff.register?.haveAccount || 'Already have an account?'}{' '}
            <Link href="/staff/login" className="text-primary font-semibold hover:underline">
              {t.staff.register?.loginLink || 'Sign in here'}
            </Link>
          </p>
        </div>

        {/* Copyright */}
        <p className="text-center text-white/60 text-sm mt-6">
          © 2026 {academyData.name}
        </p>
      </motion.div>
    </div>
  );
}