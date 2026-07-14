'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserX,
  UserMinus,
  Clock,
  DollarSign,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  leaveToday: number;
  notMarked: number;
  feesCollected: number;
  pendingFees: number;
  totalPending: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    leaveToday: 0,
    notMarked: 0,
    feesCollected: 0,
    pendingFees: 0,
    totalPending: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/staff/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      label: t.staff.dashboard.totalStudents,
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: t.staff.dashboard.presentToday,
      value: stats.presentToday,
      icon: UserCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      label: t.staff.dashboard.absentToday,
      value: stats.absentToday,
      icon: UserX,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
    },
    {
      label: t.staff.dashboard.leaveToday,
      value: stats.leaveToday,
      icon: UserMinus,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      label: t.staff.dashboard.notMarked,
      value: stats.notMarked,
      icon: Clock,
      color: 'bg-gray-500',
      bgColor: 'bg-gray-50',
    },
    {
      label: t.staff.dashboard.feesCollected,
      value: `₹${stats.feesCollected.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
    },
    {
      label: t.staff.dashboard.pendingFees,
      value: stats.pendingFees,
      icon: AlertCircle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      label: t.staff.dashboard.totalPending,
      value: `₹${stats.totalPending.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
          {t.staff.dashboard.heading}
        </h1>
        <p className="text-text-secondary">
          {t.staff.dashboard.welcome}, <span className="font-semibold text-primary">{user?.name}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="dashboard-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="dashboard-card-label mb-2">{stat.label}</p>
                  {isLoading ? (
                    <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <p className="dashboard-card-value">{stat.value}</p>
                  )}
                </div>
                <div className={`dashboard-card-icon ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.a
            href="/staff/attendance"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="card p-4 text-center hover:border-primary border-2 border-transparent transition-colors"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium text-text-primary text-sm">{t.staff.nav.attendance}</p>
          </motion.a>
          <motion.a
            href="/staff/students"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="card p-4 text-center hover:border-primary border-2 border-transparent transition-colors"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium text-text-primary text-sm">{t.staff.nav.students}</p>
          </motion.a>
          <motion.a
            href="/staff/payments"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="card p-4 text-center hover:border-primary border-2 border-transparent transition-colors"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium text-text-primary text-sm">{t.staff.nav.payments}</p>
          </motion.a>
          <motion.a
            href="/staff/reports"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.45 }}
            className="card p-4 text-center hover:border-primary border-2 border-transparent transition-colors"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium text-text-primary text-sm">{t.staff.nav.reports}</p>
          </motion.a>
        </div>
      </div>
    </div>
  );
}
