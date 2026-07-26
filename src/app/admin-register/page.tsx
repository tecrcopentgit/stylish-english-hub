'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, KeyRound, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerAdmin } from '@/lib/db/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitchLight } from '@/components/ui/LanguageSwitch';
import { academyData } from '@/data/academyData';

const registerSchema = z
  .object({
    email: z.string().min(1, 'Required').email('Invalid email'),
    fullName: z.string().min(1, 'Required').max(100, 'Too long'),
    password: z.string().min(8, 'Minimum 8 characters'),
    confirmPassword: z.string().min(1, 'Required'),
    inviteCode: z.string().min(1, 'Required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function AdminRegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      inviteCode: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    try {
      const result = await registerAdmin({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        inviteCode: data.inviteCode,
      });

      if (result.success) {
        router.push('/admin/dashboard');
      } else {
        setError(result.error || 'Registration failed');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back */}
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{t.common.back || 'Back to login'}</span>
        </Link>

        <div className="card p-8 bg-white rounded-xl shadow-2xl shadow-indigo-950/30">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-slate-800 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">{academyData.name}</h1>
            <p className="text-text-secondary text-sm mt-1">
              {t.admin?.register?.heading || 'Create Admin Account'}
            </p>
          </div>

          {/* Language Switch */}
          <div className="flex justify-center mb-6">
            <LanguageSwitchLight />
          </div>

          {/* Security Notice */}
          <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 text-slate-700">
              <KeyRound className="w-4 h-4" />
              <p className="text-xs font-semibold">
                Invite code required — ask an existing admin for access
              </p>
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Invite Code */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="inviteCode" className="form-label text-sm font-medium text-text-primary">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                  {t.admin?.register?.inviteCode || 'Invite Code'}
                </span>
              </label>
              <input
                type="text"
                id="inviteCode"
                {...register('inviteCode')}
                className={`form-input p-3 border rounded-lg outline-none transition-all ${
                  errors.inviteCode
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
                }`}
                placeholder="Enter admin invite code"
                autoComplete="off"
                disabled={isLoading}
              />
              {errors.inviteCode && (
                <p className="text-xs text-red-500 font-medium">
                  {t.errors?.required || 'Required'}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="fullName" className="form-label text-sm font-medium text-text-primary">
                {t.admin?.register?.fullName || 'Full Name'}
              </label>
              <input
                type="text"
                id="fullName"
                {...register('fullName')}
                className={`form-input p-3 border rounded-lg outline-none transition-all ${
                  errors.fullName
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
                }`}
                placeholder="John Doe"
                autoComplete="name"
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.fullName.type === 'too_long'
                    ? 'Too long'
                    : (t.errors?.required || 'Required')}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="reg-email" className="form-label text-sm font-medium text-text-primary">
                {t.admin?.register?.email || 'Email Address'}
              </label>
              <input
                type="email"
                id="reg-email"
                {...register('email')}
                className={`form-input p-3 border rounded-lg outline-none transition-all ${
                  errors.email
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
                }`}
                placeholder="admin@stylishenglish.com"
                autoComplete="email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.email.type === 'email'
                    ? (t.errors?.invalidEmail || 'Invalid email')
                    : (t.errors?.required || 'Required')}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="reg-password" className="form-label text-sm font-medium text-text-primary">
                {t.admin?.register?.password || 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-password"
                  {...register('password')}
                  className={`form-input w-full p-3 border rounded-lg outline-none transition-all pr-12 ${
                    errors.password
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
                  }`}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label={showPassword ? 'Hide' : 'Show'}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.password.type === 'too_short'
                    ? (t.errors?.tooShort || 'Minimum 8 characters')
                    : (t.errors?.required || 'Required')}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="form-label text-sm font-medium text-text-primary">
                {t.admin?.register?.confirmPassword || 'Confirm Password'}
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  className={`form-input w-full p-3 border rounded-lg outline-none transition-all pr-12 ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
                  }`}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label={showConfirm ? 'Hide' : 'Show'}
                  disabled={isLoading}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.confirmPassword.type === 'custom'
                    ? (t.errors?.passwordMismatch || 'Passwords do not match')
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
              className="btn w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-indigo-600 to-slate-800 text-white rounded-xl hover:from-indigo-700 hover:to-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-indigo-600/25 hover:shadow-indigo-700/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t.admin?.register?.creating || 'Creating account...'}</span>
                </>
              ) : (
                <span>{t.admin?.register?.registerButton || 'Create Admin Account'}</span>
              )}
            </button>
          </form>

          {/* Already have account */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link
              href="/admin-login"
              className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
            >
              <LogIn className="w-4 h-4" />
              Already registered? Sign in
            </Link>
          </div>

          {/* Staff Portal */}
          <div className="mt-3 text-center">
            <Link
              href="/staff/staff-login"
              className="text-xs text-gray-400 hover:text-indigo-600 transition-colors font-medium"
            >
              Switch to Staff Portal →
            </Link>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © 2026 {academyData.name} · Admin Portal · Restricted Access
        </p>
      </motion.div>
    </div>
  );
}