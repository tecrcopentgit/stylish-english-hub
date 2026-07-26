'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginAdmin } from '@/lib/db/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitchLight } from '@/components/ui/LanguageSwitch';
import { academyData } from '@/data/academyData';

const loginSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(1, 'Required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
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
      const result = await loginAdmin({ email: data.email, password: data.password });

      if (result.success) {
        router.push('/admin/dashboard');
      } else {
        setError(result.error || 'Admin login failed');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Admin login failed');
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
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{t.common.back || 'Back'}</span>
        </Link>

        <div className="card p-8 bg-white rounded-xl shadow-2xl shadow-indigo-950/30">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-slate-800 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">{academyData.name}</h1>
            <p className="text-text-secondary text-sm mt-1">
              {t.admin?.login?.heading || 'Administration Portal'}
            </p>
          </div>

          {/* Language Switch */}
          <div className="flex justify-center mb-6">
            <LanguageSwitchLight />
          </div>

          {/* Register Link for New Admins */}
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-100 rounded-xl text-center">
            <p className="text-sm text-indigo-800 font-medium mb-2">
              New administrator?
            </p>
            <Link
              href="/admin-register"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 hover:shadow-sm transition-all font-semibold text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Create Admin Account
            </Link>
            <p className="text-xs text-indigo-600 mt-3">
              Requires an invite code · <Link href="/admin/register" className="underline font-medium hover:text-indigo-800">Register here</Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400 font-medium uppercase tracking-wider">
                Existing Admin
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="admin-email" className="form-label text-sm font-medium text-text-primary">
                {t.admin?.login?.email || 'Email Address'}
              </label>
              <input
                type="email"
                id="admin-email"
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
              <label htmlFor="admin-password" className="form-label text-sm font-medium text-text-primary">
                {t.admin?.login?.password || 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password"
                  {...register('password')}
                  className={`form-input w-full p-3 border rounded-lg outline-none transition-all pr-12 ${
                    errors.password
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
                  }`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">
                  {t.errors?.required || 'Required'}
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
                  <span>{t.admin?.login?.loggingIn || 'Signing in...'}</span>
                </>
              ) : (
                <span>{t.admin?.login?.loginButton || 'Admin Login'}</span>
              )}
            </button>
          </form>

          {/* Staff Portal Link */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link
              href="/staff-login"
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