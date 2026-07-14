'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { academyData } from '@/data/academyData';

const enquirySchema = z.object({
  studentName: z.string().min(1, 'Student name is required'),
  parentName: z.string().min(1, 'Parent name is required'),
  className: z.string().min(1, 'Class is required'),
  phone: z.string().min(10, 'Valid phone number is required').max(15),
  program: z.string().optional(),
  shift: z.string().optional(),
  message: z.string().optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

const classOptions = [
  'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
];

export default function EnquiryForm() {
  const { language, t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setStatus('loading');
    
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const getErrorMessage = (field: keyof EnquiryFormData) => {
    const error = errors[field];
    if (!error) return null;
    
    const validationMessages = t.enquiry.validation;
    switch (field) {
      case 'studentName':
        return validationMessages.studentNameRequired;
      case 'parentName':
        return validationMessages.parentNameRequired;
      case 'className':
        return validationMessages.gradeRequired;
      case 'phone':
        return error.type === 'too_small' 
          ? validationMessages.phoneRequired 
          : validationMessages.phoneInvalid;
      default:
        return error.message;
    }
  };

  return (
    <section id="enquiry" className="section bg-gradient-to-br from-primary via-primary-dark to-secondary">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-heading text-white">{t.enquiry.heading}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="card p-8">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-text-primary font-medium">{t.enquiry.success}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Student Name */}
                <div className="form-group">
                  <label htmlFor="studentName" className="form-label">
                    {t.enquiry.studentName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    {...register('studentName')}
                    className={`form-input ${errors.studentName ? 'border-red-500' : ''}`}
                    placeholder={t.enquiry.studentName}
                  />
                  {errors.studentName && (
                    <p className="form-error">{getErrorMessage('studentName')}</p>
                  )}
                </div>

                {/* Parent Name */}
                <div className="form-group">
                  <label htmlFor="parentName" className="form-label">
                    {t.enquiry.parentName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="parentName"
                    {...register('parentName')}
                    className={`form-input ${errors.parentName ? 'border-red-500' : ''}`}
                    placeholder={t.enquiry.parentName}
                  />
                  {errors.parentName && (
                    <p className="form-error">{getErrorMessage('parentName')}</p>
                  )}
                </div>

                {/* Grade and Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="className" className="form-label">
                      {t.enquiry.grade} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="className"
                      {...register('className')}
                      className={`form-select ${errors.className ? 'border-red-500' : ''}`}
                    >
                      <option value="">{t.enquiry.selectGrade}</option>
                      {classOptions.map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                    {errors.className && (
                      <p className="form-error">{getErrorMessage('className')}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      {t.enquiry.phone} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="+91 XXXXX XXXXX"
                    />
                    {errors.phone && (
                      <p className="form-error">{getErrorMessage('phone')}</p>
                    )}
                  </div>
                </div>

                {/* Program and Shift */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="program" className="form-label">
                      {t.enquiry.program}
                    </label>
                    <select id="program" {...register('program')} className="form-select">
                      <option value="">{t.enquiry.selectProgram}</option>
                      {academyData.programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.title[language]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="shift" className="form-label">
                      {t.enquiry.shift}
                    </label>
                    <select id="shift" {...register('shift')} className="form-select">
                      <option value="">{t.enquiry.selectShift}</option>
                      {academyData.schedule.shifts.map((shift) => (
                        <option key={shift.id} value={shift.id}>
                          {shift.time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    {t.enquiry.message}
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    className="form-textarea"
                    rows={4}
                    placeholder={t.enquiry.message}
                  />
                </div>

                {/* Error Message */}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{t.enquiry.error}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn btn-primary w-full"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t.enquiry.submitting}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t.enquiry.submit}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
