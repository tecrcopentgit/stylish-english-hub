'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  UserX,
  X,
  Loader2,
  CheckCircle,
  Phone,
  MessageCircle,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Student } from '@/db/schema';

const studentSchema = z.object({
  admissionNumber: z.string().min(1, 'Admission number is required'),
  studentName: z.string().min(1, 'Student name is required'),
  parentName: z.string().min(1, 'Parent name is required'),
  className: z.string().min(1, 'Class is required'),
  schoolName: z.string().optional(),
  shift: z.string().min(1, 'Shift is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  whatsappNumber: z.string().optional(),
  monthlyFee: z.string().min(1, 'Monthly fee is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  notes: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

const classOptions = [
  'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
];

const shiftOptions = ['shift1', 'shift2'];

export default function StudentsPage() {
  const { t } = useLanguage();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ★ DELETE CONFIRMATION STATE
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    student: Student | null;
    type: 'delete' | 'deactivate';
  }>({ open: false, student: null, type: 'delete' });
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, filterClass, filterShift, filterStatus]);

  // Auto-dismiss messages
  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => setSuccessMessage(''), 4000);
      return () => clearTimeout(t);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const t = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(t);
    }
  }, [errorMessage]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/staff/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.studentName.toLowerCase().includes(search) ||
          s.parentName.toLowerCase().includes(search) ||
          s.admissionNumber.toLowerCase().includes(search) ||
          s.phoneNumber.includes(search)
      );
    }

    if (filterClass) {
      filtered = filtered.filter((s) => s.className === filterClass);
    }

    if (filterShift) {
      filtered = filtered.filter((s) => s.shift === filterShift);
    }

    if (filterStatus) {
      filtered = filtered.filter((s) => s.status === filterStatus);
    }

    setFilteredStudents(filtered);
  };

  const openAddModal = () => {
    setEditingStudent(null);
    reset({
      admissionNumber: '',
      studentName: '',
      parentName: '',
      className: '',
      schoolName: '',
      shift: '',
      phoneNumber: '',
      whatsappNumber: '',
      monthlyFee: '',
      joiningDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setValue('admissionNumber', student.admissionNumber);
    setValue('studentName', student.studentName);
    setValue('parentName', student.parentName);
    setValue('className', student.className);
    setValue('schoolName', student.schoolName || '');
    setValue('shift', student.shift);
    setValue('phoneNumber', student.phoneNumber);
    setValue('whatsappNumber', student.whatsappNumber || '');
    setValue('monthlyFee', String(student.monthlyFee));
    setValue('joiningDate', student.joiningDate);
    setValue('notes', student.notes || '');
    setIsModalOpen(true);
  };

  const onSubmit = async (data: StudentFormData) => {
    try {
      const url = editingStudent
        ? `/api/staff/students/${editingStudent.id}`
        : '/api/staff/students';

      const response = await fetch(url, {
        method: editingStudent ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setSuccessMessage(
          editingStudent
            ? t.staff.students.saveSuccess
            : t.staff.students.saveSuccess
        );
        fetchStudents();
      } else {
        const err = await response.json();
        setErrorMessage(err.error || 'Failed to save student');
      }
    } catch (error) {
      console.error('Error saving student:', error);
      setErrorMessage('Failed to save student');
    }
  };

  // ★ OPEN DELETE CONFIRMATION
  const openDeleteConfirm = (student: Student) => {
    setDeleteConfirm({ open: true, student, type: 'delete' });
  };

  // ★ OPEN DEACTIVATE CONFIRMATION
  const openDeactivateConfirm = (student: Student) => {
    setDeleteConfirm({ open: true, student, type: 'deactivate' });
  };

  // ★ HANDLE PERMANENT DELETE
  const handleDelete = async () => {
    if (!deleteConfirm.student) return;
    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/staff/students/${deleteConfirm.student.id}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setSuccessMessage(
          `${deleteConfirm.student.studentName} has been permanently deleted`
        );
        // Remove from local state immediately
        setStudents((prev) =>
          prev.filter((s) => s.id !== deleteConfirm.student!.id)
        );
      } else {
        const err = await response.json();
        setErrorMessage(err.error || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      setErrorMessage('Failed to delete student');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ open: false, student: null, type: 'delete' });
    }
  };

  // ★ HANDLE DEACTIVATE (soft delete)
  const handleDeactivate = async () => {
    if (!deleteConfirm.student) return;
    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/staff/students/${deleteConfirm.student.id}/deactivate`,
        { method: 'POST' }
      );

      if (response.ok) {
        setSuccessMessage(
          `${deleteConfirm.student.studentName} has been deactivated`
        );
        fetchStudents();
      } else {
        const err = await response.json();
        setErrorMessage(err.error || 'Failed to deactivate student');
      }
    } catch (error) {
      console.error('Error deactivating student:', error);
      setErrorMessage('Failed to deactivate student');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ open: false, student: null, type: 'deactivate' });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
          {t.staff.students.heading}
        </h1>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus className="w-5 h-5" />
          {t.staff.students.addStudent}
        </button>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.staff.students.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="form-select"
          >
            <option value="">{t.staff.students.allClasses}</option>
            {classOptions.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          <select
            value={filterShift}
            onChange={(e) => setFilterShift(e.target.value)}
            className="form-select"
          >
            <option value="">{t.staff.students.allShifts}</option>
            {shiftOptions.map((shift) => (
              <option key={shift} value={shift}>
                {shift === 'shift1' ? '5:30 PM – 7:00 PM' : '7:00 PM – 8:30 PM'}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-select"
          >
            <option value="">{t.staff.students.allStatuses}</option>
            <option value="active">{t.staff.students.active}</option>
            <option value="inactive">{t.staff.students.inactive}</option>
            <option value="discontinued">{t.staff.students.discontinued}</option>
          </select>
        </div>
      </div>

      {/* Students Count */}
      <div className="mb-4 text-sm text-text-secondary">
        Showing {filteredStudents.length} of {students.length} students
      </div>

      {/* Students List */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="spinner" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            {t.staff.students.noStudents}
          </div>
        ) : (
          <>
            {/* ==================== DESKTOP TABLE ==================== */}
            <div className="hidden lg:block table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.staff.students.admissionNo}</th>
                    <th>{t.staff.students.studentName}</th>
                    <th>{t.staff.students.parentName}</th>
                    <th>{t.staff.students.class}</th>
                    <th>{t.staff.students.shift}</th>
                    <th>{t.staff.students.phone}</th>
                    <th>{t.staff.students.monthlyFee}</th>
                    <th>{t.staff.students.status}</th>
                    <th className="text-center">{t.staff.students.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="font-medium">
                        {student.admissionNumber}
                      </td>
                      <td>{student.studentName}</td>
                      <td>{student.parentName}</td>
                      <td>{student.className}</td>
                      <td>
                        {student.shift === 'shift1'
                          ? '5:30-7:00 PM'
                          : '7:00-8:30 PM'}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${student.phoneNumber}`}
                            className="text-primary hover:underline"
                          >
                            {student.phoneNumber}
                          </a>
                          {student.whatsappNumber && (
                            <a
                              href={`https://wa.me/${student.whatsappNumber.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-500 hover:text-green-600"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td>
                        ₹{Number(student.monthlyFee).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span
                          className={`status-${
                            student.status === 'active' ? 'present' : 'absent'
                          }`}
                        >
                          {student.status === 'active'
                            ? t.staff.students.active
                            : student.status === 'inactive'
                            ? t.staff.students.inactive
                            : t.staff.students.discontinued}
                        </span>
                      </td>
                      {/* ★ UPDATED ACTIONS COLUMN */}
                      <td>
                        <div className="flex items-center justify-center gap-1">
                          {/* Edit */}
                          <button
                            onClick={() => openEditModal(student)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit student"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Deactivate — only for active students */}
                          {student.status === 'active' && (
                            <button
                              onClick={() => openDeactivateConfirm(student)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Deactivate student"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}

                          {/* ★ DELETE — permanent */}
                          <button
                            onClick={() => openDeleteConfirm(student)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete student permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ==================== MOBILE CARDS ==================== */}
            <div className="lg:hidden mobile-card-view p-4 space-y-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="card-item bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-text-primary">
                        {student.studentName}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {student.admissionNumber}
                      </p>
                    </div>
                    <span
                      className={`status-${
                        student.status === 'active' ? 'present' : 'absent'
                      }`}
                    >
                      {student.status === 'active'
                        ? t.staff.students.active
                        : student.status === 'inactive'
                        ? t.staff.students.inactive
                        : t.staff.students.discontinued}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="card-row flex justify-between">
                      <span className="card-label text-text-secondary">
                        {t.staff.students.parentName}
                      </span>
                      <span className="card-value font-medium">
                        {student.parentName}
                      </span>
                    </div>
                    <div className="card-row flex justify-between">
                      <span className="card-label text-text-secondary">
                        {t.staff.students.class}
                      </span>
                      <span className="card-value font-medium">
                        {student.className} •{' '}
                        {student.shift === 'shift1'
                          ? '5:30-7:00 PM'
                          : '7:00-8:30 PM'}
                      </span>
                    </div>
                    <div className="card-row flex justify-between">
                      <span className="card-label text-text-secondary">
                        {t.staff.students.phone}
                      </span>
                      <span className="card-value flex items-center gap-2">
                        <a
                          href={`tel:${student.phoneNumber}`}
                          className="text-primary"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        {student.whatsappNumber && (
                          <a
                            href={`https://wa.me/${student.whatsappNumber.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}
                        <span className="text-text-primary">
                          {student.phoneNumber}
                        </span>
                      </span>
                    </div>
                    <div className="card-row flex justify-between">
                      <span className="card-label text-text-secondary">
                        {t.staff.students.monthlyFee}
                      </span>
                      <span className="card-value font-semibold text-text-primary">
                        ₹{Number(student.monthlyFee).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* ★ MOBILE ACTION BUTTONS */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(student)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      {t.common.edit}
                    </button>

                    {/* Deactivate — only for active */}
                    {student.status === 'active' && (
                      <button
                        onClick={() => openDeactivateConfirm(student)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                      >
                        <UserX className="w-4 h-4" />
                        Deactivate
                      </button>
                    )}

                    {/* ★ Delete */}
                    <button
                      onClick={() => openDeleteConfirm(student)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ==================== ADD/EDIT MODAL ==================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-10 px-4 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content max-w-2xl w-full bg-white rounded-2xl shadow-2xl mb-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary">
                  {editingStudent
                    ? t.staff.students.editStudent
                    : t.staff.students.addStudent}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">
                      {t.staff.students.admissionNo} *
                    </label>
                    <input
                      {...register('admissionNumber')}
                      className="form-input"
                    />
                    {errors.admissionNumber && (
                      <p className="form-error">
                        {errors.admissionNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      {t.staff.students.studentName} *
                    </label>
                    <input
                      {...register('studentName')}
                      className="form-input"
                    />
                    {errors.studentName && (
                      <p className="form-error">
                        {errors.studentName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">
                      {t.staff.students.parentName} *
                    </label>
                    <input
                      {...register('parentName')}
                      className="form-input"
                    />
                    {errors.parentName && (
                      <p className="form-error">
                        {errors.parentName.message}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">School Name</label>
                    <input
                      {...register('schoolName')}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">
                      {t.staff.students.class} *
                    </label>
                    <select
                      {...register('className')}
                      className="form-select"
                    >
                      <option value="">Select Class</option>
                      {classOptions.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                    {errors.className && (
                      <p className="form-error">
                        {errors.className.message}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      {t.staff.students.shift} *
                    </label>
                    <select {...register('shift')} className="form-select">
                      <option value="">Select Shift</option>
                      <option value="shift1">5:30 PM – 7:00 PM</option>
                      <option value="shift2">7:00 PM – 8:30 PM</option>
                    </select>
                    {errors.shift && (
                      <p className="form-error">{errors.shift.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">
                      {t.staff.students.phone} *
                    </label>
                    <input
                      {...register('phoneNumber')}
                      className="form-input"
                      placeholder="+91 XXXXX XXXXX"
                    />
                    {errors.phoneNumber && (
                      <p className="form-error">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      {t.staff.students.whatsapp}
                    </label>
                    <input
                      {...register('whatsappNumber')}
                      className="form-input"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">
                      {t.staff.students.monthlyFee} *
                    </label>
                    <input
                      {...register('monthlyFee')}
                      type="number"
                      className="form-input"
                      placeholder="0"
                    />
                    {errors.monthlyFee && (
                      <p className="form-error">
                        {errors.monthlyFee.message}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      {t.staff.students.joiningDate} *
                    </label>
                    <input
                      {...register('joiningDate')}
                      type="date"
                      className="form-input"
                    />
                    {errors.joiningDate && (
                      <p className="form-error">
                        {errors.joiningDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    {...register('notes')}
                    className="form-textarea"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                    {t.common.save}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== ★ DELETE/DEACTIVATE CONFIRMATION MODAL ==================== */}
      <AnimatePresence>
        {deleteConfirm.open && deleteConfirm.student && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center px-4"
            onClick={() =>
              !isDeleting &&
              setDeleteConfirm({ open: false, student: null, type: 'delete' })
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-md bg-white rounded-2xl  shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div
                className={`p-6 flex flex-col items-center text-center ${
                  deleteConfirm.type === 'delete'
                    ? 'bg-red-50'
                    : 'bg-amber-50'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex flex-col items-center justify-center mb-4 ${
                    deleteConfirm.type === 'delete'
                      ? 'bg-red-100'
                      : 'bg-amber-100'
                  }`}
                >
                  {deleteConfirm.type === 'delete' ? (
                    <Trash2 className="w-8 h-8 text-red-600" />
                  ) : (
                    <UserX className="w-8 h-8 text-amber-600" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {deleteConfirm.type === 'delete'
                    ? 'Delete Student Permanently?'
                    : 'Deactivate Student?'}
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                  {deleteConfirm.type === 'delete' ? (
                    <>
                      This will <strong>permanently remove</strong>{' '}
                      all data for this student including attendance
                      and payment records. This action{' '}
                      <strong>cannot be undone</strong>.
                    </>
                  ) : (
                    <>
                      This will mark the student as inactive. They
                      won&apos;t appear in attendance but their data
                      will be preserved.
                    </>
                  )}
                </p>
              </div>

              {/* Student Info */}
              <div className="px-6 py-4 bg-gray-50 border-y border-gray-200">
                <div className="flex   items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                    {deleteConfirm.student.studentName
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {deleteConfirm.student.studentName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {deleteConfirm.student.admissionNumber} •{' '}
                      {deleteConfirm.student.className} •{' '}
                      {deleteConfirm.student.shift === 'shift1'
                        ? 'Shift 1'
                        : 'Shift 2'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="p-4 flex flex-col lg:flex-row  bg-amber-600 gap-3 ">
                <button
                  onClick={() =>
                    setDeleteConfirm({
                      open: false,
                      student: null,
                      type: 'delete',
                    })
                  }
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    deleteConfirm.type === 'delete'
                      ? handleDelete
                      : handleDeactivate
                  }
                  disabled={isDeleting}
                  className={`flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                    deleteConfirm.type === 'delete'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : deleteConfirm.type === 'delete' ? (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Yes, Delete Permanently
                    </>
                  ) : (
                    <>
                      <UserX className="w-4 h-4" />
                      Yes, Deactivate
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}