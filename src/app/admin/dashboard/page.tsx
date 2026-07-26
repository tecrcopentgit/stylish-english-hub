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
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
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

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  trend?: number;
  prefix?: string;
  suffix?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-3.5 w-28 bg-gray-200 rounded-full" />
          <div className="h-8 w-20 bg-gray-200 rounded-lg" />
          <div className="h-3 w-16 bg-gray-100 rounded-full" />
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

function StatCard({
  stat,
  index,
}: {
  stat: StatCard;
  index: number;
}) {
  const Icon = stat.icon;
  const isPositiveTrend = stat.trend !== undefined && stat.trend >= 0;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 truncate">
            {stat.label}
          </p>
          <p className="text-3xl font-bold text-gray-800 leading-none">
            {stat.prefix && (
              <span className="text-lg font-semibold text-gray-500 mr-0.5">
                {stat.prefix}
              </span>
            )}
            {typeof stat.value === 'number'
              ? stat.value.toLocaleString()
              : stat.value}
            {stat.suffix && (
              <span className="text-sm font-medium text-gray-400 ml-1">
                {stat.suffix}
              </span>
            )}
          </p>
          {stat.trend !== undefined && (
            <div
              className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                isPositiveTrend ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {isPositiveTrend ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span>
                {Math.abs(stat.trend)}% vs yesterday
              </span>
            </div>
          )}
        </div>
        <div
          className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ml-3`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboardStats = async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      const response = await fetch('/api/staff/dashboard');

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data: DashboardStats = await response.json();
      setStats(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // ── Attendance Cards ─────────────────────────────────────────────
  const attendanceCards: StatCard[] = [
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
  ];

  // ── Fee Cards ────────────────────────────────────────────────────
  const feeCards: StatCard[] = [
    {
      label: 'Fees Collected',
      value: stats.feesCollected,
      icon: DollarSign,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      prefix: '₹',
    },
    {
      label: 'Pending Fees (Students)',
      value: stats.pendingFees,
      icon: AlertCircle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Total Pending Amount',
      value: stats.totalPending,
      icon: TrendingUp,
      color: 'bg-rose-500',
      bgColor: 'bg-rose-50',
      prefix: '₹',
    },
  ];

  // ── Quick Actions ────────────────────────────────────────────────
  const quickActions = [
    {
      href: '/staff/attendance',
      icon: UserCheck,
      label: t.staff.nav.attendance,
      delay: 0.3,
      description: 'Mark today\'s attendance',
    },
    {
      href: '/staff/students',
      icon: Users,
      label: t.staff.nav.students,
      delay: 0.35,
      description: 'View student records',
    },
    {
      href: '/staff/reports',
      icon: TrendingUp,
      label: t.staff.nav.reports,
      delay: 0.45,
      description: 'Generate reports',
    },
  ];

  // ── Attendance Rate ──────────────────────────────────────────────
  const attendanceRate =
    stats.totalStudents > 0
      ? Math.round((stats.presentToday / stats.totalStudents) * 100)
      : 0;

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {t.staff.dashboard.heading}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {t.staff.dashboard.welcome},{' '}
              <span className="font-semibold text-blue-600">
                {user?.name}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 shadow-sm">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{today}</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchDashboardStats(true)}
              disabled={isRefreshing || isLoading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              <span className="hidden sm:inline">
                {isRefreshing ? 'Refreshing…' : 'Refresh'}
              </span>
            </button>
          </div>
        </motion.div>

        {/* ── Last Updated ────────────────────────────────────────── */}
        {lastUpdated && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-400 -mt-4"
          >
            Last updated:{' '}
            {lastUpdated.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </motion.p>
        )}

        {/* ── Error Banner ────────────────────────────────────────── */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => fetchDashboardStats()}
              className="ml-auto underline font-medium hover:no-underline"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* ── Attendance Rate Banner ───────────────────────────────── */}
        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 text-white shadow-md"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  Today's Attendance Rate
                </p>
                <p className="text-4xl font-bold mt-1">
                  {attendanceRate}
                  <span className="text-2xl text-blue-200 font-semibold">%</span>
                </p>
                <p className="text-blue-200 text-xs mt-1">
                  {stats.presentToday} present out of {stats.totalStudents} students
                </p>
              </div>

              {/* Mini progress bar */}
              <div className="flex-1 min-w-[160px] max-w-xs">
                <div className="flex justify-between text-xs text-blue-200 mb-1.5">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <div className="h-3 bg-blue-400/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${attendanceRate}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-blue-200 mt-1.5">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-white inline-block" />
                    Present
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400/60 inline-block" />
                    Absent / Leave
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Attendance Stats ─────────────────────────────────────── */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-500" />
            Attendance Overview
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
            >
              {attendanceCards.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </motion.div>
          )}
        </section>

        {/* ── Fee Stats ────────────────────────────────────────────── */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            Fee Summary
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {feeCards.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </motion.div>
          )}
        </section>

        {/* ── Quick Actions ────────────────────────────────────────── */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.a
                  key={action.href}
                  href={action.href}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: action.delay }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-white border-2 border-transparent hover:border-blue-500 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {action.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {action.description}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 ml-auto transition-colors" />
                </motion.a>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}