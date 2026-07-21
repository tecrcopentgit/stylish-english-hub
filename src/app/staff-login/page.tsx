'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitchLight } from '@/components/ui/LanguageSwitch';
import { academyData } from '@/data/academyData';

const loginSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid'),
  password: z.string().min(1, 'Required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function StaffLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (isLoading) return;
    setError('');
    setIsLoading(true);
    
    try {
      // Responds to src/lib/db/auth.ts via useAuth context
      const result = await login(data.email, data.password);
      
      if (result.success) {
        router.push('/staff/dashboard');
      } else {
        setError(result.error || t.staff.login.error || 'Login failed');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || t.staff.login.error || 'Login failed');
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
        {/* Back to Home */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{t.common.back}</span>
        </Link>

        <div className="card p-8 bg-white rounded-xl shadow-xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-md">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">{academyData.name}</h1>
            <p className="text-text-secondary text-sm mt-1">{t.staff.login.heading}</p>
          </div>

          {/* Language Switch */}
          <div className="flex justify-center mb-6">
            <LanguageSwitchLight />
          </div>

          {/* Register Link for New Users */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl text-center">
            <p className="text-sm text-blue-800 font-medium mb-2">
              New staff member?
            </p>
            <Link 
              href="/staff/register"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-blue-200 text-primary rounded-lg hover:bg-blue-50 hover:shadow-sm transition-all font-semibold text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Create Staff Account
            </Link>
            <p className="text-xs text-blue-600 mt-3">
              Don't have login credentials? <Link href="/staff/register" className="underline font-medium hover:text-blue-800">Register here</Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400 font-medium uppercase tracking-wider">Existing User</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="email" className="form-label text-sm font-medium text-text-primary">
                {t.staff.login.email}
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className={`form-input p-3 border rounded-lg outline-none transition-all ${
                  errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10'
                }`}
                placeholder="staff@stylishenglish.com"
                autoComplete="email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.email.type === 'email' ? (t.errors?.invalidEmail || 'Invalid email') : (t.errors?.required || 'Required')}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="password" className="form-label text-sm font-medium text-text-primary">
                {t.staff.login.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password')}
                  className={`form-input w-full p-3 border rounded-lg outline-none transition-all pr-12 ${
                    errors.password ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10'
                  }`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label={showPassword ? (t.staff.login.hidePassword || 'Hide') : (t.staff.login.showPassword || 'Show')}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.password.message === 'Too short'
                    ? (t.errors?.tooShort || 'Too short')
                    : (t.errors?.required || 'Required')}
                </p>
              )}
            </div>

            {/* Error */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg overflow-hidden"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-tight">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full flex items-center justify-center gap-2 p-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t.staff.login.loggingIn || 'Signing in...'}</span>
                </>
              ) : (
                <span>{t.staff.login.loginButton || 'Login'}</span>
              )}
            </button>
          </form>

         
        </div>

        <p className="text-center text-white/50 text-xs mt-6">
          © 2026 {academyData.name} · Staff Portal
        </p>
      </motion.div>
    </div>
  );
}