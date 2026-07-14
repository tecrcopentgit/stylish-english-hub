'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Receipt, MessageCircle, CheckCircle, Copy, Check, X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { academyData } from '@/data/academyData';
import type { Student, Payment } from '@/db/schema';

interface PaymentFormData {
  studentId: string;
  feeMonth: string;
  monthlyFee: string;
  previousBalance: string;
  discount: string;
  amountPaid: string;
  paymentMethod: string;
  remarks: string;
}

export default function PaymentsPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageCopied, setMessageCopied] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [lastPayment, setLastPayment] = useState<Payment | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<PaymentFormData>();

  const monthlyFee = parseFloat(watch('monthlyFee') || '0');
  const previousBalance = parseFloat(watch('previousBalance') || '0');
  const discount = parseFloat(watch('discount') || '0');
  const amountPaid = parseFloat(watch('amountPaid') || '0');

  const totalDue = monthlyFee + previousBalance;
  const pendingBalance = totalDue - discount - amountPaid;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, paymentsRes] = await Promise.all([
        fetch('/api/staff/students?status=active'),
        fetch('/api/staff/payments'),
      ]);

      if (studentsRes.ok) {
        const data = await studentsRes.json();
        setStudents(data.students || []);
      }

      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setSelectedStudent(null);
    reset({
      studentId: '',
      feeMonth: new Date().toISOString().slice(0, 7),
      monthlyFee: '',
      previousBalance: '0',
      discount: '0',
      amountPaid: '',
      paymentMethod: 'cash',
      remarks: '',
    });
    setIsModalOpen(true);
  };

  const handleStudentSelect = (studentId: string) => {
    const student = students.find((s) => s.id === parseInt(studentId));
    if (student) {
      setSelectedStudent(student);
      setValue('monthlyFee', String(student.monthlyFee));
    }
  };

  const onSubmit = async (data: PaymentFormData) => {
    const paymentStatus = pendingBalance <= 0 
      ? 'paid' 
      : pendingBalance < totalDue 
        ? 'partially_paid' 
        : 'pending';

    try {
      const response = await fetch('/api/staff/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          pendingBalance: Math.max(0, pendingBalance),
          paymentStatus,
          receivedBy: user?.name,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setLastPayment(result.payment);
        setIsModalOpen(false);
        setSuccessMessage(t.staff.payments.paymentSaved);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchData();
      }
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  const generatePaymentMessage = (payment: Payment) => {
    const student = students.find((s) => s.id === payment.studentId);
    
    let message = '';
    const statusText = payment.paymentStatus === 'paid' 
      ? (language === 'ta' ? 'முழுமையாக செலுத்தப்பட்டது' : 'Paid')
      : (language === 'ta' ? 'பகுதி கட்டணம் செலுத்தப்பட்டது' : 'Partially Paid');

    if (language === 'ta') {
      message = `அன்பார்ந்த பெற்றோருக்கு,

${payment.studentName} அவர்களுக்கான ${payment.feeMonth} மாதக் கட்டணமாக ₹${Number(payment.amountPaid).toLocaleString('en-IN')} பெற்றுக்கொண்டோம்.

கட்டண நிலை:
${statusText}

மீதமுள்ள தொகை:
₹${Number(payment.pendingBalance).toLocaleString('en-IN')}

ரசீது எண்:
${payment.receiptNumber}

உங்கள் ஒத்துழைப்புக்கு நன்றி.

${academyData.name}
${academyData.tagline.ta}`;
    } else {
      message = `Dear Parent,

We have received ₹${Number(payment.amountPaid).toLocaleString('en-IN')} towards the fee for ${payment.studentName} for ${payment.feeMonth}.

Payment Status:
${statusText}

Pending Balance:
₹${Number(payment.pendingBalance).toLocaleString('en-IN')}

Receipt Number:
${payment.receiptNumber}

Thank you for your payment.

${academyData.name}
${academyData.tagline.en}`;
    }

    setGeneratedMessage(message);
    setShowMessageModal(true);
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
    setMessageCopied(true);
    setTimeout(() => setMessageCopied(false), 2000);
  };

  const filteredPayments = searchTerm
    ? payments.filter((p) =>
        p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : payments;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
          {t.staff.payments.heading}
        </h1>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus className="w-5 h-5" />
          {t.staff.payments.recordPayment}
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

      {/* Search */}
      <div className="card p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t.staff.payments.searchStudent}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Payments List */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="spinner" />
          </div>
        ) : filteredPayments.length === 0 ? (
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
                    <th>{t.staff.payments.receiptNumber}</th>
                    <th>{t.staff.payments.paymentDate}</th>
                    <th>{t.staff.students.studentName}</th>
                    <th>{t.staff.payments.feeMonth}</th>
                    <th>{t.staff.payments.amountPaid}</th>
                    <th>{t.staff.payments.pendingBalance}</th>
                    <th>{t.staff.payments.paymentStatus}</th>
                    <th>{t.common.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="font-medium">{payment.receiptNumber}</td>
                      <td>{new Date(payment.paymentDate).toLocaleDateString('en-IN')}</td>
                      <td>{payment.studentName}</td>
                      <td>{payment.feeMonth}</td>
                      <td>₹{Number(payment.amountPaid).toLocaleString('en-IN')}</td>
                      <td>₹{Number(payment.pendingBalance).toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`status-${payment.paymentStatus === 'paid' ? 'present' : payment.paymentStatus === 'pending' ? 'absent' : 'leave'}`}>
                          {payment.paymentStatus === 'paid' ? t.staff.payments.paid :
                           payment.paymentStatus === 'partially_paid' ? t.staff.payments.partiallyPaid :
                           t.staff.payments.pending}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => generatePaymentMessage(payment)}
                          className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                          aria-label="WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden mobile-card-view p-4">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="card-item">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-text-primary">{payment.studentName}</p>
                      <p className="text-sm text-text-secondary">{payment.receiptNumber}</p>
                    </div>
                    <span className={`status-${payment.paymentStatus === 'paid' ? 'present' : 'leave'}`}>
                      {payment.paymentStatus === 'paid' ? t.staff.payments.paid : t.staff.payments.partiallyPaid}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t.staff.payments.feeMonth}</span>
                    <span className="card-value">{payment.feeMonth}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t.staff.payments.amountPaid}</span>
                    <span className="card-value font-semibold text-green-600">
                      ₹{Number(payment.amountPaid).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">{t.staff.payments.pendingBalance}</span>
                    <span className="card-value">
                      ₹{Number(payment.pendingBalance).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-end mt-3 pt-3 border-t">
                    <button
                      onClick={() => generatePaymentMessage(payment)}
                      className="btn btn-secondary text-sm py-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Payment Modal */}
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
                  {t.staff.payments.recordPayment}
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
                  <label className="form-label">{t.staff.payments.selectStudent} *</label>
                  <select
                    {...register('studentId')}
                    onChange={(e) => handleStudentSelect(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.studentName} - {student.className}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">{t.staff.payments.feeMonth}</label>
                    <input {...register('feeMonth')} type="month" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.staff.payments.monthlyFee}</label>
                    <input {...register('monthlyFee')} type="number" className="form-input" readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">{t.staff.payments.previousBalance}</label>
                    <input {...register('previousBalance')} type="number" className="form-input" placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.staff.payments.discount}</label>
                    <input {...register('discount')} type="number" className="form-input" placeholder="0" />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Total Due:</span>
                    <span className="font-medium">₹{totalDue.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.staff.payments.amountPaid} *</label>
                  <input {...register('amountPaid')} type="number" className="form-input" placeholder="0" />
                </div>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-text-secondary">{t.staff.payments.pendingBalance}</p>
                  <p className={`text-2xl font-bold ${pendingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{Math.max(0, pendingBalance).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.staff.payments.paymentMethod}</label>
                  <select {...register('paymentMethod')} className="form-select">
                    <option value="cash">{t.staff.payments.cash}</option>
                    <option value="upi">{t.staff.payments.upi}</option>
                    <option value="bank_transfer">{t.staff.payments.bankTransfer}</option>
                    <option value="other">{t.staff.payments.other}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.staff.payments.remarks}</label>
                  <textarea {...register('remarks')} className="form-textarea" rows={2} />
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
                    {t.staff.payments.savePayment}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WhatsApp Message Modal */}
      <AnimatePresence>
        {showMessageModal && (
          <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-text-primary mb-4">
                  {t.staff.payments.generateMessage}
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans">
                    {generatedMessage}
                  </pre>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={copyMessage}
                    className="btn btn-secondary flex-1"
                  >
                    {messageCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {messageCopied ? 'Copied!' : t.staff.attendance.copyMessage}
                  </button>
                  <button
                    onClick={() => {
                      const encoded = encodeURIComponent(generatedMessage);
                      window.open(`https://wa.me/?text=${encoded}`, '_blank');
                    }}
                    className="btn btn-primary flex-1 bg-green-500 hover:bg-green-600"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
