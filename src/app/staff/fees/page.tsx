'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Loader2, CheckCircle, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import type { FeeStructure } from '@/db/schema';

interface FeeFormData {
  className: string;
  monthlyFee: string;
  admissionFee: string;
  materialFee: string;
  otherFee: string;
  effectiveDate: string;
  notes: string;
}

const classOptions = [
  'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
];

export default function FeesPage() {
  const { t } = useLanguage();
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeStructure | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FeeFormData>();

  const monthlyFee = watch('monthlyFee') || '0';
  const admissionFee = watch('admissionFee') || '0';
  const materialFee = watch('materialFee') || '0';
  const otherFee = watch('otherFee') || '0';

  const totalFee = 
    parseFloat(monthlyFee) + 
    parseFloat(admissionFee) + 
    parseFloat(materialFee) + 
    parseFloat(otherFee);

  useEffect(() => {
    fetchFeeStructures();
  }, []);
const fetchFeeStructures = async () => {
  try {
    const response = await fetch('/api/staff/fees', {
      credentials: 'include',          // ← 👈 Add this
    });
    if (response.ok) {
      const data = await response.json();
      setFeeStructures(data.fees || []);
    }
  } catch (error) {
    console.error('Error fetching fee structures:', error);
  } finally {
    setIsLoading(false);
  }
};

  const openAddModal = () => {
    setEditingFee(null);
    reset({
      className: '',
      monthlyFee: '',
      admissionFee: '',
      materialFee: '',
      otherFee: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (fee: FeeStructure) => {
    setEditingFee(fee);
    setValue('className', fee.className);
    setValue('monthlyFee', String(fee.monthlyFee));
    setValue('admissionFee', String(fee.admissionFee));
    setValue('materialFee', String(fee.materialFee));
    setValue('otherFee', String(fee.otherFee));
    setValue('effectiveDate', fee.effectiveDate);
    setValue('notes', fee.notes || '');
    setIsModalOpen(true);
  };

 const onSubmit = async (data: FeeFormData) => {
  try {
    const url = editingFee
      ? `/api/staff/fees/${editingFee.id}`
      : '/api/staff/fees';
    
    const response = await fetch(url, {
      method: editingFee ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',          // ← 👈 Add this
      body: JSON.stringify({
        ...data,
        totalFee: totalFee.toString(),
      }),
    });
    // ... rest stays the same
  } catch (error) {
    console.error('Error saving fee structure:', error);
  }
};

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
          {t.staff.fees.heading}
        </h1>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus className="w-5 h-5" />
          {t.staff.fees.addClass}
        </button>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fee Structure List */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="spinner" />
          </div>
        ) : feeStructures.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            {t.common.noData}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.staff.fees.class}</th>
                    <th>{t.staff.fees.monthlyFee}</th>
                    <th>{t.staff.fees.admissionFee}</th>
                    <th>{t.staff.fees.materialFee}</th>
                    <th>{t.staff.fees.otherFee}</th>
                    <th>{t.staff.fees.totalFee}</th>
                    <th>{t.staff.fees.effectiveDate}</th>
                    <th>{t.staff.fees.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {feeStructures.map((fee) => (
                    <tr key={fee.id}>
                      <td className="font-medium">{fee.className}</td>
                      <td>₹{Number(fee.monthlyFee).toLocaleString('en-IN')}</td>
                      <td>₹{Number(fee.admissionFee).toLocaleString('en-IN')}</td>
                      <td>₹{Number(fee.materialFee).toLocaleString('en-IN')}</td>
                      <td>₹{Number(fee.otherFee).toLocaleString('en-IN')}</td>
                      <td className="font-semibold">₹{Number(fee.totalFee).toLocaleString('en-IN')}</td>
                      <td>{new Date(fee.effectiveDate).toLocaleDateString('en-IN')}</td>
                      <td>
                        <button
                          onClick={() => openEditModal(fee)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          aria-label="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden mobile-card-view p-4">
              {feeStructures.map((fee) => (
                <div key={fee.id} className="card-item">
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-semibold text-text-primary">{fee.className}</p>
                    <button
                      onClick={() => openEditModal(fee)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t.staff.fees.monthlyFee}</span>
                    <span className="card-value">₹{Number(fee.monthlyFee).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t.staff.fees.admissionFee}</span>
                    <span className="card-value">₹{Number(fee.admissionFee).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t.staff.fees.totalFee}</span>
                    <span className="card-value font-semibold">₹{Number(fee.totalFee).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary">
                  {editingFee ? t.staff.fees.editFee : t.staff.fees.addClass}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div className="form-group">
                  <label className="form-label">{t.staff.fees.class} *</label>
                  <select {...register('className')} className="form-select" disabled={!!editingFee}>
                    <option value="">Select Class</option>
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">{t.staff.fees.monthlyFee}</label>
                    <input {...register('monthlyFee')} type="number" className="form-input" placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.staff.fees.admissionFee}</label>
                    <input {...register('admissionFee')} type="number" className="form-input" placeholder="0" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">{t.staff.fees.materialFee}</label>
                    <input {...register('materialFee')} type="number" className="form-input" placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.staff.fees.otherFee}</label>
                    <input {...register('otherFee')} type="number" className="form-input" placeholder="0" />
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-text-secondary">{t.staff.fees.totalFee}</p>
                  <p className="text-2xl font-bold text-primary">₹{totalFee.toLocaleString('en-IN')}</p>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.staff.fees.effectiveDate}</label>
                  <input {...register('effectiveDate')} type="date" className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">{t.staff.fees.notes}</label>
                  <textarea {...register('notes')} className="form-textarea" rows={2} />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    {t.common.cancel}
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                    {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {t.common.save}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
