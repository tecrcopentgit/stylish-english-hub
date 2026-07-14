'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  Calendar,
  DollarSign,
  Download,
  Printer,
  BarChart,
  PieChart,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ReportsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'attendance' | 'fees'>('attendance');

  const attendanceReports = [
    { id: 'daily', label: t.staff.reports.dailyAttendance, icon: Calendar },
    { id: 'weekly', label: t.staff.reports.weeklyAttendance, icon: Calendar },
    { id: 'monthly', label: t.staff.reports.monthlyAttendance, icon: Calendar },
    { id: 'student', label: t.staff.reports.studentAttendance, icon: Users },
    { id: 'class', label: t.staff.reports.classAttendance, icon: BarChart },
    { id: 'absence', label: t.staff.reports.absenceReport, icon: FileText },
  ];

  const feeReports = [
    { id: 'daily-collection', label: t.staff.reports.dailyCollection, icon: DollarSign },
    { id: 'monthly-collection', label: t.staff.reports.monthlyCollection, icon: DollarSign },
    { id: 'paid', label: t.staff.reports.paidStudents, icon: Users },
    { id: 'partial', label: t.staff.reports.partiallyPaidStudents, icon: Users },
    { id: 'pending', label: t.staff.reports.pendingStudents, icon: Users },
    { id: 'class-fee', label: t.staff.reports.classFeeReport, icon: PieChart },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
          {t.staff.reports.heading}
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'attendance'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
          }`}
        >
          {t.staff.reports.attendanceReports}
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'fees'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
          }`}
        >
          {t.staff.reports.feeReports}
        </button>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(activeTab === 'attendance' ? attendanceReports : feeReports).map((report, index) => {
          const Icon = report.icon;
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="card p-6 hover:border-primary border-2 border-transparent transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary mb-2">{report.label}</h3>
                  <div className="flex gap-2">
                    <button className="text-sm text-primary hover:underline flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {t.staff.reports.exportCSV}
                    </button>
                    <button className="text-sm text-primary hover:underline flex items-center gap-1">
                      <Printer className="w-4 h-4" />
                      {t.staff.reports.print}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Date Filter */}
      <div className="card p-6 mt-6">
        <h3 className="font-semibold text-text-primary mb-4">{t.staff.reports.selectDateRange}</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="form-group">
            <label className="form-label">{t.staff.reports.from}</label>
            <input type="date" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">{t.staff.reports.to}</label>
            <input type="date" className="form-input" />
          </div>
          <div className="form-group flex items-end">
            <button className="btn btn-primary w-full">
              <FileText className="w-5 h-5" />
              {t.staff.reports.generateReport}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
