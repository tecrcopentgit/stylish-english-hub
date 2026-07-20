'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  CreditCard,
  Receipt,
  MessageCircle,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitchLight } from '@/components/ui/LanguageSwitch';
import { academyData } from '@/data/academyData';

// Declared explicitly with rigid key bindings to guarantee type safety against translation files
interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  key: 'dashboard' | 'students' | 'attendance' | 'feeStructure' | 'payments' | 'whatsappMessages' | 'reports' | 'settings';
}

const navItems: NavItem[] = [
  { href: '/staff/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { href: '/staff/students', icon: Users, key: 'students' },
  { href: '/staff/attendance', icon: ClipboardCheck, key: 'attendance' },
  { href: '/staff/fees', icon: CreditCard, key: 'feeStructure' },
  { href: '/staff/payments', icon: Receipt, key: 'payments' },
  { href: '/staff/messages', icon: MessageCircle, key: 'whatsappMessages' },
  { href: '/staff/reports', icon: FileText, key: 'reports' },
  { href: '/staff/settings', icon: Settings, key: 'settings' },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Monitors active authentication structures and handles unauthenticated state redirections
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/staff-login'); // Use replace instead of push to avoid broken history back-button states
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/staff-login');
    } catch (error) {
      console.error('Logout navigation failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center" aria-live="polite">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-light flex flex-col lg:flex-row">
      {/* Mobile Header Layout */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 z-50 bg-secondary flex items-center justify-between px-4 shadow-md">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-white p-2 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-accent" />
          <span className="text-white font-semibold text-sm">Staff Portal</span>
        </div>
        <LanguageSwitchLight />
      </header>

      {/* Sidebar Dropdown Screen Blocker Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Dashboard Nav Aside Sidebar Menu Panels */}
      <aside
        className={`sidebar fixed top-0 bottom-0 left-0 z-50 w-64 bg-secondary text-white transform lg:transform-none lg:opacity-100 transition-all duration-300 ease-in-out border-r border-gray-800 ${
          sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand/Academy Profile Logo Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shadow-inner">
                  <GraduationCap className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm tracking-wide truncate max-w-[140px]">
                    {academyData.name}
                  </p>
                  <p className="text-gray-400 text-xs font-medium">Staff Portal</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Active Employee Role Status Info Card block */}
          <div className="p-4 border-b border-gray-800 bg-black/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center ring-2 ring-primary/20 shadow-md">
                <span className="text-white font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                <p className="text-gray-400 text-xs font-medium capitalize truncate">
                  {user.role ? user.role.replace('_', ' ') : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Anchors Links Engine List Container */}
          <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  <span className="truncate">{t.staff.nav[item.key] || item.key}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-white" />}
                </Link>
              );
            })}
          </nav>

          {/* Inline Multi-Language Desktop Footer Trigger Selector Toggle switch block */}
          <div className="p-4 border-t border-gray-800 hidden lg:block bg-black/5">
            <LanguageSwitchLight />
          </div>

          {/* Destroy Context Security Authentication Session Outflows Trigger */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>{t.staff.nav.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Primary Context Content Wrapper Window Container viewport area */}
      <main className="flex-1 min-h-screen pt-16 lg:pt-0 lg:ml-64 bg-bg-light transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
