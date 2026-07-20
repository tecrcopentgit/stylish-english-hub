'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitchLight } from '@/components/ui/LanguageSwitch';
import { academyData } from '@/data/academyData';

// Moved out of component to prevent re-instantiation on renders
const registerSchema = z
  .object({
    name: z.string().min(1, 'Required').min(2, 'Too short'),
    email: z.string().min(1, 'Required').email('Invalid'),
    password: z.string().min(1, 'Required').min(8, 'Too short'),
    confirmPassword: z.string().min(1, 'Required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function StaffRegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }, // Prevents uncontrolled-to-controlled warnings
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    try {
      const result = await registerUser(data.name, data.email, data.password);
      if (result.success) {
        router.push('/staff/dashboard');
      } else {
        setError(result.error || t.staff.register.error);
        setIsLoading(false);
      }
    } catch (err) {
      setError(t.staff.register.error);
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
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-md">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">{academyData.name}</h1>
            <p className="text-text-secondary text-sm mt-1">{t.staff.register.heading}</p>
          </div>

          {/* Language Switch */}
          <div className="flex justify-center mb-6">
            <LanguageSwitchLight />
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Name */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="name" className="form-label text-sm font-medium text-text-primary">
                {t.staff.register.name}
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className={`form-input p-2.5 border rounded-lg outline-none transition-all ${
                  errors.name ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'focus:border-primary'
                }`}
                placeholder="Jane Doe"
                autoComplete="name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="form-error text-xs text-red-500 font-medium">
                  {errors.name.message === 'Too short'
                    ? t.errors?.tooShort || 'Too short'
                    : t.errors?.required || 'Required'}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="email" className="form-label text-sm font-medium text-text-primary">
                {t.staff.register.email}
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
                <p className="form-error text-xs text-red-500 font-medium">
                  {errors.email.type === 'email' ? t.errors?.invalidEmail || 'Invalid email' : t.errors?.required || 'Required'}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="password" className="form-label text-sm font-medium text-text-primary">
                {t.staff.register.password}
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
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? t.staff.login.hidePassword : t.staff.login.showPassword}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="form-error text-xs text-red-500 font-medium">
                  {errors.password.message === 'Too short'
                    ? t.errors?.tooShort || 'Password must be at least 8 characters'
                    : t.errors?.required || 'Required'}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="form-label text-sm font-medium text-text-primary">
                {t.staff.register.confirmPassword}
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
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConfirmPassword ? t.staff.login.hidePassword : t.staff.login.showPassword}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="form-error text-xs text-red-500 font-medium">
                  {errors.confirmPassword.message === "Passwords don't match"
                    ? t.errors?.passwordMismatch || "Passwords don't match"
                    : t.errors?.required || 'Required'}
                </p>
              )}
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg overflow-hidden"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
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
                  <span>{t.staff.register.registering}</span>
                </>
              ) : (
                <span>{t.staff.register.registerButton}</span>
              )}
            </button>
          </form>

          {/* Link to Login */}
          <p className="text-center text-sm text-text-secondary mt-6">
            {t.staff.register.haveAccount}{' '}
            <Link href="/staff/login" className="text-primary font-medium hover:underline">
              {t.staff.register.loginLink}
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