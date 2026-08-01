import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu, LogOut, User as UserIcon, BookOpen,
  LayoutDashboard, PlayCircle, Settings, Award,
  CreditCard, Users, FileText, Sparkles, ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/cn';
import NotificationBell from '../NotificationBell';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const StudentNavItems: SidebarItem[] = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard',   path: '/student/dashboard' },
  { icon: <BookOpen size={18} />,        label: 'My Courses',   path: '/student/courses' },
  { icon: <PlayCircle size={18} />,      label: 'Live Classes', path: '/student/live' },
  { icon: <FileText size={18} />,        label: 'Assignments',  path: '/student/assignments' },
  { icon: <Award size={18} />,           label: 'Certificates', path: '/student/certificates' },
  { icon: <CreditCard size={18} />,      label: 'Payments',     path: '/student/payments' },
  { icon: <UserIcon size={18} />,        label: 'Profile',      path: '/student/profile' },
];

const TeacherNavItems: SidebarItem[] = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard',      path: '/teacher/dashboard' },
  { icon: <BookOpen size={18} />,        label: 'Manage Courses', path: '/teacher/courses' },
  { icon: <PlayCircle size={18} />,      label: 'Live Sessions',  path: '/teacher/live' },
  { icon: <FileText size={18} />,        label: 'Assignments',    path: '/teacher/assignments' },
  { icon: <Users size={18} />,           label: 'My Students',    path: '/teacher/students' },
  { icon: <CreditCard size={18} />,      label: 'Earnings',       path: '/teacher/earnings' },
  { icon: <Settings size={18} />,        label: 'Settings',       path: '/teacher/settings' },
];

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = user?.role === 'teacher' ? TeacherNavItems : StudentNavItems;
  const roleLabel = user?.role === 'teacher' ? 'Teacher Portal' : 'Student Portal';
  const roleColor = user?.role === 'teacher' ? 'from-orange-500 to-purple-600' : 'from-blue-500 to-purple-600';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0d1b3e 100%)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          background: 'linear-gradient(180deg, rgba(20,10,50,0.98) 0%, rgba(10,15,60,0.98) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f97316, #8b5cf6)' }}>
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">LMS <span style={{ background: 'linear-gradient(90deg,#f97316,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Platform</span></span>
        </div>

        {/* User Profile Card */}
        <div className="mx-3 mt-4 mb-2 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-xs uppercase font-semibold tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {roleLabel}
          </div>
          <div className="flex items-center gap-3">
            {(user as any)?.avatar ? (
              <img
                src={(user as any).avatar}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${user?.role === 'teacher' ? '#f97316, #8b5cf6' : '#3b82f6, #8b5cf6'})` }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                "group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-white shadow-lg"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
              style={({ isActive }) => isActive ? {
                background: `linear-gradient(135deg, rgba(249,115,22,0.25), rgba(139,92,246,0.25))`,
                border: '1px solid rgba(249,115,22,0.3)',
              } : {}}
            >
              <div className="flex items-center gap-3">
                <span className="transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                {item.label}
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all duration-200"
            style={{ color: 'rgba(248,113,113,0.8)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header
          className="h-16 flex items-center px-4 lg:px-8 justify-between sticky top-0 z-30"
          style={{
            background: 'rgba(15,12,41,0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.6)' }}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            {/* Breadcrumb / Title area */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-1 rounded-full"
                style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)' }}>
                {roleLabel}
              </span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <NotificationBell />
            {(user as any)?.avatar ? (
              <img
                src={(user as any).avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                title="Go to Profile"
                onClick={() => navigate(user?.role === 'teacher' ? '/teacher/settings' : '/student/profile')}
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                style={{ background: `linear-gradient(135deg, ${user?.role === 'teacher' ? '#f97316, #8b5cf6' : '#3b82f6, #8b5cf6'})` }}
                title="Go to Profile"
                onClick={() => navigate(user?.role === 'teacher' ? '/teacher/settings' : '/student/profile')}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
