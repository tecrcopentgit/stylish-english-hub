'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Loader2,
  CheckCircle,
  X,
  DollarSign,
  BookOpen,
  Calendar,
  FileText,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  IndianRupee,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import type { FeeStructure } from '@/db/schema';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeeFormData {
  className: string;
  monthlyFee: string;
  admissionFee: string;
  materialFee: string;
  otherFee: string;
  effectiveDate: string;
  notes: string;
}

interface ApiError {
  message: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CLASS_OPTIONS = [
  'LKG',
  'UKG',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
];

const DEFAULT_FORM_VALUES: FeeFormData = {
  className: '',
  monthlyFee: '0',
  admissionFee: '0',
  materialFee: '0',
  otherFee: '0',
  effectiveDate: new Date().toISOString().split('T')[0],
  notes: '',
};

// ─── Animation Variants ───────────────────────────────────────────────────────

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// ✅ FIXED: Added 'as const' to type property and to the whole object
const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 28 },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 16,
    transition: { duration: 0.18 },
  },
} as const;

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

// ─── Helper: format INR ───────────────────────────────────────────────────────

const inr = (value: number | string) =>
  `₹${Number(value).toLocaleString('en-IN')}`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
      <div className={`${color} w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium truncate">{label}</p>
        <p className="text-lg font-bold text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 rounded-full w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function FormField({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FeesPage() {
  const { t } = useLanguage();

  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeStructure | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FeeFormData>({ defaultValues: DEFAULT_FORM_VALUES });

  // Live-calculated total
  const monthlyFee  = parseFloat(watch('monthlyFee')  || '0') || 0;
  const admissionFee = parseFloat(watch('admissionFee') || '0') || 0;
  const materialFee  = parseFloat(watch('materialFee')  || '0') || 0;
  const otherFee     = parseFloat(watch('otherFee')     || '0') || 0;
  const totalFee     = monthlyFee + admissionFee + materialFee + otherFee;

  // Summary stats derived from list
  const totalClasses    = feeStructures.length;
  const avgMonthlyFee   = totalClasses
    ? feeStructures.reduce((s, f) => s + Number(f.monthlyFee), 0) / totalClasses
    : 0;
  const highestTotalFee = feeStructures.length
    ? Math.max(...feeStructures.map((f) => Number(f.totalFee)))
    : 0;

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchFeeStructures = async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setErrorMessage('');

      const response = await fetch('/api/staff/fees', {
        credentials: 'include',
      });

      if (!response.ok) {
        const err: ApiError = await response.json().catch(() => ({
          message: 'Unknown error',
        }));
        throw new Error(err.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setFeeStructures(data.fees ?? []);
    } catch (error) {
      console.error('Error fetching fee structures:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to load fee structures.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeeStructures();
  }, []);

  // ── Modal helpers ──────────────────────────────────────────────────────────

  const openAddModal = () => {
    setEditingFee(null);
    setSubmitError('');
    reset(DEFAULT_FORM_VALUES);
    setIsModalOpen(true);
  };

  const openEditModal = (fee: FeeStructure) => {
    setEditingFee(fee);
    setSubmitError('');
    reset({
      className:     fee.className,
      monthlyFee:    String(fee.monthlyFee),
      admissionFee:  String(fee.admissionFee),
      materialFee:   String(fee.materialFee),
      otherFee:      String(fee.otherFee),
      effectiveDate: fee.effectiveDate,
      notes:         fee.notes ?? '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return; // prevent accidental close
    setIsModalOpen(false);
    setEditingFee(null);
    setSubmitError('');
  };

  // ── Form submission ────────────────────────────────────────────────────────

  const onSubmit = async (data: FeeFormData) => {
    try {
      setSubmitError('');

      const url = editingFee
        ? `/api/staff/fees/${editingFee.id}`
        : '/api/staff/fees';

      const response = await fetch(url, {
        method:  editingFee ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          monthlyFee:   data.monthlyFee   || '0',
          admissionFee: data.admissionFee || '0',
          materialFee:  data.materialFee  || '0',
          otherFee:     data.otherFee     || '0',
          totalFee:     totalFee.toString(),
        }),
      });

      if (!response.ok) {
        const err: ApiError = await response.json().catch(() => ({
          message: 'Unknown error',
        }));
        throw new Error(err.message || `HTTP ${response.status}`);
      }

      const saved: FeeStructure = await response.json();

      // Optimistically update local list
      if (editingFee) {
        setFeeStructures((prev) =>
          prev.map((f) => (f.id === editingFee.id ? saved : f))
        );
      } else {
        setFeeStructures((prev) => [...prev, saved]);
      }

      // Show success toast
      const msg = editingFee
        ? `Fee structure for ${saved.className} updated successfully.`
        : `Fee structure for ${saved.className} added successfully.`;

      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(''), 4000);

      closeModal();
    } catch (error) {
      console.error('Error saving fee structure:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to save. Please try again.'
      );
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {t.staff.fees.heading}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage class-wise fee structures
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchFeeStructures(true)}
              disabled={isRefreshing || isLoading}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-sm font-medium px-3 py-2 rounded-xl shadow-sm transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t.staff.fees.addClass}
            </button>
          </div>
        </div>

        {/* ── Success Toast ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" />
              <span className="flex-1">{successMessage}</span>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Error Banner ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{errorMessage}</span>
              <button
                onClick={() => fetchFeeStructures()}
                className="underline font-medium hover:no-underline"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Summary Cards ────────────────────────────────────────────────── */}
        {!isLoading && feeStructures.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <SummaryCard
              label="Total Classes Configured"
              value={String(totalClasses)}
              icon={BookOpen}
              color="bg-blue-500"
            />
            <SummaryCard
              label="Avg. Monthly Fee"
              value={inr(Math.round(avgMonthlyFee))}
              icon={IndianRupee}
              color="bg-emerald-500"
            />
            <SummaryCard
              label="Highest Total Fee"
              value={inr(highestTotalFee)}
              icon={TrendingUp}
              color="bg-purple-500"
            />
          </motion.div>
        )}

        {/* ── Fee Structure Table ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* ── Desktop Table ──────────────────────────────────────────────── */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    t.staff.fees.class,
                    t.staff.fees.monthlyFee,
                    t.staff.fees.admissionFee,
                    t.staff.fees.materialFee,
                    t.staff.fees.otherFee,
                    t.staff.fees.totalFee,
                    t.staff.fees.effectiveDate,
                    t.staff.fees.actions,
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : feeStructures.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <DollarSign className="w-10 h-10 opacity-40" />
                        <p className="font-medium">{t.common.noData}</p>
                        <button
                          onClick={openAddModal}
                          className="text-blue-600 text-sm font-medium hover:underline"
                        >
                          Add your first fee structure →
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  feeStructures.map((fee, i) => (
                    <motion.tr
                      key={fee.id}
                      custom={i}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-gray-800">
                          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                          {fee.className}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {inr(fee.monthlyFee)}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {inr(fee.admissionFee)}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {inr(fee.materialFee)}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {inr(fee.otherFee)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-gray-900">
                          {inr(fee.totalFee)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(fee.effectiveDate).toLocaleDateString('en-IN')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => openEditModal(fee)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                          aria-label={`Edit ${fee.className}`}
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Cards ───────────────────────────────────────────────── */}
          <div className="lg:hidden divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-3 p-4 bg-gray-50 rounded-xl">
                    <div className="h-4 w-24 bg-gray-200 rounded-full" />
                    <div className="h-3 w-full bg-gray-100 rounded-full" />
                    <div className="h-3 w-3/4 bg-gray-100 rounded-full" />
                  </div>
                ))}
              </div>
            ) : feeStructures.length === 0 ? (
              <div className="py-16 text-center">
                <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">{t.common.noData}</p>
              </div>
            ) : (
              feeStructures.map((fee, i) => (
                <motion.div
                  key={fee.id}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-4 hover:bg-gray-50/60 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-gray-800">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      {fee.className}
                    </span>
                    <button
                      onClick={() => openEditModal(fee)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {[
                      { label: t.staff.fees.monthlyFee,   value: inr(fee.monthlyFee) },
                      { label: t.staff.fees.admissionFee, value: inr(fee.admissionFee) },
                      { label: t.staff.fees.materialFee,  value: inr(fee.materialFee) },
                      { label: t.staff.fees.otherFee,     value: inr(fee.otherFee) },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="font-medium text-gray-700">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(fee.effectiveDate).toLocaleDateString('en-IN')}
                    </span>
                    <span className="font-bold text-gray-900">
                      {t.staff.fees.totalFee}:{' '}
                      <span className="text-blue-600">{inr(fee.totalFee)}</span>
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={closeModal}
              />

              {/* Modal panel */}
              <motion.div
                key="modal"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              >
                <div
                  className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {editingFee
                          ? t.staff.fees.editFee
                          : t.staff.fees.addClass}
                      </h2>
                      {editingFee && (
                        <p className="text-sm text-gray-400 mt-0.5">
                          Editing: {editingFee.className}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={closeModal}
                      disabled={isSubmitting}
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Body — scrollable */}
                  <div className="overflow-y-auto flex-1 px-6 py-5">
                    <form
                      id="fee-form"
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      {/* Class selector */}
                      <FormField
                        label={t.staff.fees.class}
                        required
                      >
                        <select
                          {...register('className', {
                            required: 'Please select a class.',
                          })}
                          disabled={!!editingFee}
                          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                        >
                          <option value="">Select a class…</option>
                          {CLASS_OPTIONS.map((cls) => (
                            <option key={cls} value={cls}>
                              {cls}
                            </option>
                          ))}
                        </select>
                        {errors.className && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.className.message}
                          </p>
                        )}
                      </FormField>

                      {/* Fee fields — 2 column grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {(
                          [
                            {
                              name: 'monthlyFee' as const,
                              label: t.staff.fees.monthlyFee,
                            },
                            {
                              name: 'admissionFee' as const,
                              label: t.staff.fees.admissionFee,
                            },
                            {
                              name: 'materialFee' as const,
                              label: t.staff.fees.materialFee,
                            },
                            {
                              name: 'otherFee' as const,
                              label: t.staff.fees.otherFee,
                            },
                          ] as const
                        ).map(({ name, label }) => (
                          <FormField key={name} label={label}>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium pointer-events-none">
                                ₹
                              </span>
                              <input
                                {...register(name, {
                                  min: { value: 0, message: 'Cannot be negative' },
                                })}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0"
                                className="w-full border border-gray-200 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              />
                            </div>
                            {errors[name] && (
                              <p className="text-xs text-red-500 mt-1">
                                {errors[name]?.message}
                              </p>
                            )}
                          </FormField>
                        ))}
                      </div>

                      {/* Total fee display */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                            {t.staff.fees.totalFee}
                          </p>
                          <p className="text-2xl font-bold text-blue-700 mt-0.5">
                            {inr(totalFee)}
                          </p>
                        </div>
                        <IndianRupee className="w-8 h-8 text-blue-200" />
                      </div>

                      {/* Effective date */}
                      <FormField
                        label={t.staff.fees.effectiveDate}
                        hint="Fee structure will apply from this date."
                      >
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          <input
                            {...register('effectiveDate', {
                              required: 'Effective date is required.',
                            })}
                            type="date"
                            className="w-full border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          />
                        </div>
                        {errors.effectiveDate && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.effectiveDate.message}
                          </p>
                        )}
                      </FormField>

                      {/* Notes */}
                      <FormField label={t.staff.fees.notes}>
                        <div className="relative">
                          <FileText className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                          <textarea
                            {...register('notes')}
                            rows={3}
                            placeholder="Optional notes about this fee structure…"
                            className="w-full border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
                          />
                        </div>
                      </FormField>

                      {/* Submit-level error */}
                      <AnimatePresence>
                        {submitError && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
                          >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {submitError}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {t.common.cancel}
                    </button>
                    <button
                      type="submit"
                      form="fee-form"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl shadow-sm transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          {t.common.save}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}