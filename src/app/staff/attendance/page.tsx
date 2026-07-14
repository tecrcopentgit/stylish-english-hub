'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Users,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  Copy,
  MessageCircle,
  Check,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { academyData } from '@/data/academyData';
import type { Student } from '@/db/schema';

type AttendanceStatus = 'P' | 'A' | 'L' | 'LT';

interface StudentAttendance {
  studentId: number;
  studentName: string;
  status: AttendanceStatus;
  remarks: string;
}

const classOptions = [
  'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
];

export default function AttendancePage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageCopied, setMessageCopied] = useState(false);

  const loadStudents = async () => {
    if (!selectedClass || !selectedShift) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/staff/students?class=${selectedClass}&shift=${selectedShift}&status=active`
      );
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
        
        // Initialize attendance data
        const initialAttendance: StudentAttendance[] = (data.students || []).map((s: Student) => ({
          studentId: s.id,
          studentName: s.studentName,
          status: 'P' as AttendanceStatus,
          remarks: '',
        }));
        setAttendanceData(initialAttendance);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = (studentId: number, status: AttendanceStatus) => {
    setAttendanceData((prev) =>
      prev.map((a) => (a.studentId === studentId ? { ...a, status } : a))
    );
  };

  const updateRemarks = (studentId: number, remarks: string) => {
    setAttendanceData((prev) =>
      prev.map((a) => (a.studentId === studentId ? { ...a, remarks } : a))
    );
  };

  const markAllPresent = () => {
    setAttendanceData((prev) => prev.map((a) => ({ ...a, status: 'P' as AttendanceStatus })));
  };

  const resetAttendance = () => {
    setAttendanceData((prev) => prev.map((a) => ({ ...a, status: 'P' as AttendanceStatus, remarks: '' })));
  };

  const saveAttendance = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/staff/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          className: selectedClass,
          shift: selectedShift,
          attendance: attendanceData,
          markedBy: user?.name,
        }),
      });

      if (response.ok) {
        setSuccessMessage(t.staff.attendance.attendanceSaved);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const generateWhatsAppReport = () => {
    const present = attendanceData.filter((a) => a.status === 'P');
    const absent = attendanceData.filter((a) => a.status === 'A');
    const leave = attendanceData.filter((a) => a.status === 'L');
    const late = attendanceData.filter((a) => a.status === 'LT');

    const shiftTime = selectedShift === 'shift1' ? '5:30 PM – 7:00 PM' : '7:00 PM – 8:30 PM';
    const formattedDate = new Date(selectedDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    let message = '';

    if (language === 'ta') {
      message = `*${academyData.name}*
*தினசரி வருகைப் பதிவு*

தேதி: ${formattedDate}
வகுப்பு: ${selectedClass}
வகுப்பு நேரம்: ${shiftTime}

`;

      if (present.length > 0) {
        message += `*வருகை தந்த மாணவர்கள்*\n\n`;
        present.forEach((s, i) => {
          message += `${i + 1}. ${s.studentName}\n`;
        });
        message += '\n';
      }

      if (absent.length > 0) {
        message += `*வராத மாணவர்கள்*\n\n`;
        absent.forEach((s, i) => {
          message += `${i + 1}. ${s.studentName}\n`;
        });
        message += '\n';
      }

      if (leave.length > 0) {
        message += `*விடுப்பு*\n\n`;
        leave.forEach((s, i) => {
          message += `${i + 1}. ${s.studentName}\n`;
        });
        message += '\n';
      }

      message += `மொத்த மாணவர்கள்: ${attendanceData.length}
வருகை: ${present.length}
வரவில்லை: ${absent.length}
விடுப்பு: ${leave.length}
தாமதம்: ${late.length}

வருகையைப் பதிவு செய்த ஆசிரியர்:
${user?.name}

நன்றி.

*${academyData.name}*
${academyData.tagline.ta}`;
    } else {
      message = `*${academyData.name}*
*Daily Attendance Report*

Date: ${formattedDate}
Class: ${selectedClass}
Shift: ${shiftTime}

`;

      if (present.length > 0) {
        message += `*Present Students*\n\n`;
        present.forEach((s, i) => {
          message += `${i + 1}. ${s.studentName}\n`;
        });
        message += '\n';
      }

      if (absent.length > 0) {
        message += `*Absent Students*\n\n`;
        absent.forEach((s, i) => {
          message += `${i + 1}. ${s.studentName}\n`;
        });
        message += '\n';
      }

      if (leave.length > 0) {
        message += `*Leave*\n\n`;
        leave.forEach((s, i) => {
          message += `${i + 1}. ${s.studentName}\n`;
        });
        message += '\n';
      }

      message += `Total Students: ${attendanceData.length}
Present: ${present.length}
Absent: ${absent.length}
Leave: ${leave.length}
Late: ${late.length}

Attendance Marked By:
${user?.name}

Thank you.

*${academyData.name}*
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

  const shareToWhatsApp = () => {
    const encodedMessage = encodeURIComponent(generatedMessage);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const filteredStudents = searchTerm
    ? attendanceData.filter((s) =>
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : attendanceData;

  const presentCount = attendanceData.filter((a) => a.status === 'P').length;
  const absentCount = attendanceData.filter((a) => a.status === 'A').length;
  const leaveCount = attendanceData.filter((a) => a.status === 'L').length;
  const lateCount = attendanceData.filter((a) => a.status === 'LT').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
          {t.staff.attendance.heading}
        </h1>
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

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {t.staff.attendance.selectDate}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t.staff.attendance.selectClass}</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="form-select"
            >
              <option value="">Select Class</option>
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t.staff.attendance.selectShift}</label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="form-select"
            >
              <option value="">Select Shift</option>
              <option value="shift1">5:30 PM – 7:00 PM</option>
              <option value="shift2">7:00 PM – 8:30 PM</option>
            </select>
          </div>
          <div className="form-group flex items-end">
            <button
              onClick={loadStudents}
              disabled={!selectedClass || !selectedShift || isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Users className="w-5 h-5" />
              )}
              {t.staff.attendance.loadStudents}
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Stats */}
      {attendanceData.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="card p-4 text-center bg-green-50">
            <p className="text-2xl font-bold text-green-600">{presentCount}</p>
            <p className="text-sm text-green-700">{t.staff.attendance.present}</p>
          </div>
          <div className="card p-4 text-center bg-red-50">
            <p className="text-2xl font-bold text-red-600">{absentCount}</p>
            <p className="text-sm text-red-700">{t.staff.attendance.absent}</p>
          </div>
          <div className="card p-4 text-center bg-amber-50">
            <p className="text-2xl font-bold text-amber-600">{leaveCount}</p>
            <p className="text-sm text-amber-700">{t.staff.attendance.leave}</p>
          </div>
          <div className="card p-4 text-center bg-blue-50">
            <p className="text-2xl font-bold text-blue-600">{lateCount}</p>
            <p className="text-sm text-blue-700">{t.staff.attendance.late}</p>
          </div>
        </div>
      )}

      {/* Attendance Actions */}
      {attendanceData.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.staff.attendance.searchStudent}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
          <button onClick={markAllPresent} className="btn btn-secondary">
            <CheckCircle className="w-5 h-5" />
            {t.staff.attendance.markAllPresent}
          </button>
          <button onClick={resetAttendance} className="btn btn-secondary">
            <RefreshCw className="w-5 h-5" />
            {t.staff.attendance.reset}
          </button>
        </div>
      )}

      {/* Student List */}
      {attendanceData.length === 0 ? (
        <div className="card p-8 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-text-secondary">{t.staff.attendance.noStudentsLoaded}</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.studentId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className="card p-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-text-primary">{student.studentName}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateStatus(student.studentId, 'P')}
                    className={`attendance-btn attendance-btn-p ${student.status === 'P' ? 'selected' : ''}`}
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    {t.staff.attendance.present}
                  </button>
                  <button
                    onClick={() => updateStatus(student.studentId, 'A')}
                    className={`attendance-btn attendance-btn-a ${student.status === 'A' ? 'selected' : ''}`}
                  >
                    <XCircle className="w-4 h-4 inline mr-1" />
                    {t.staff.attendance.absent}
                  </button>
                  <button
                    onClick={() => updateStatus(student.studentId, 'L')}
                    className={`attendance-btn attendance-btn-l ${student.status === 'L' ? 'selected' : ''}`}
                  >
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    {t.staff.attendance.leave}
                  </button>
                  <button
                    onClick={() => updateStatus(student.studentId, 'LT')}
                    className={`attendance-btn attendance-btn-lt ${student.status === 'LT' ? 'selected' : ''}`}
                  >
                    <Clock className="w-4 h-4 inline mr-1" />
                    {t.staff.attendance.late}
                  </button>
                </div>
                <div className="lg:w-48">
                  <input
                    type="text"
                    placeholder={t.staff.attendance.remarks}
                    value={student.remarks}
                    onChange={(e) => updateRemarks(student.studentId, e.target.value)}
                    className="form-input text-sm"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Save and Generate Actions */}
      {attendanceData.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={saveAttendance}
            disabled={isSaving}
            className="btn btn-primary flex-1"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            {t.staff.attendance.saveAttendance}
          </button>
          <button onClick={generateWhatsAppReport} className="btn btn-accent flex-1">
            <MessageCircle className="w-5 h-5" />
            {t.staff.attendance.generateReport}
          </button>
        </div>
      )}

      {/* Message Modal */}
      <AnimatePresence>
        {showMessageModal && (
          <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-text-primary mb-4">
                  WhatsApp {language === 'ta' ? 'செய்தி' : 'Message'}
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans">
                    {generatedMessage}
                  </pre>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={copyMessage}
                    className="btn btn-secondary flex-1"
                  >
                    {messageCopied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                    {messageCopied ? t.staff.attendance.messageCopied : t.staff.attendance.copyMessage}
                  </button>
                  <button
                    onClick={shareToWhatsApp}
                    className="btn btn-primary flex-1 bg-green-500 hover:bg-green-600"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {t.staff.attendance.shareWhatsApp}
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
