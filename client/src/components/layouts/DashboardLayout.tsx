import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, X, LogOut, User as UserIcon, BookOpen, 
  LayoutDashboard, PlayCircle, Settings, Award, 
  CreditCard, Users, FileText, ShieldCheck, GraduationCap,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/cn';
import NotificationBell from '../NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const StudentNavItems: SidebarItem[] = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard',    path: '/student/dashboard' },
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

const AdminNavItems: SidebarItem[] = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard',    path: '/admin/dashboard' },
  { icon: <Users size={18} />,           label: 'Users',        path: '/admin/users' },
  { icon: <BookOpen size={18} />,        label: 'Courses',      path: '/admin/courses' },
  { icon: <GraduationCap size={18} />,   label: 'Teachers',     path: '/admin/teachers' },
  { icon: <CreditCard size={18} />,      label: 'Payments',     path: '/admin/payments' },
  { icon: <Settings size={18} />,        label: 'Settings',     path: '/admin/settings' },
];

const roleConfig = {
  student: { label: 'Student Portal', items: StudentNavItems, accent: 'from-blue-500 to-indigo-500' },
  teacher: { label: 'Teacher Portal', items: TeacherNavItems, accent: 'from-emerald-500 to-teal-500' },
  admin:   { label: 'Admin Portal',   items: AdminNavItems,   accent: 'from-purple-500 to-pink-500' },
};

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = (user?.role as keyof typeof roleConfig) || 'student';
  const { label: roleLabel, items: navItems, accent } = roleConfig[role];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900/95 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shrink-0 flex flex-col backdrop-blur-xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={cn("w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center", accent)}>
              <ShieldCheck size={15} className="text-white" />
            </div>
            <span className="text-base font-bold text-slate-100">LMS Platform</span>
          </div>
          <button 
            className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* User Profile */}
        <div className="p-4 border-b border-slate-800">
          <div className={cn("text-xs uppercase font-semibold tracking-wider mb-3 text-transparent bg-clip-text bg-gradient-to-r", accent)}>
            {roleLabel}
          </div>
          <div className="flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center font-bold text-white text-sm shrink-0", accent)}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                isActive 
                  ? "text-white bg-slate-800" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className={cn("absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-gradient-to-b", accent)}
                    />
                  )}
                  <span className={cn("transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-slate-500" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-all"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/80 border-b border-slate-800 flex items-center px-4 lg:px-6 justify-between sticky top-0 z-30 backdrop-blur-xl">
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          
          <div className="hidden lg:flex items-center gap-2 text-slate-500 text-sm">
            <span className={cn("font-semibold text-transparent bg-clip-text bg-gradient-to-r", accent)}>
              {roleLabel}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <NotificationBell />
            <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center font-bold text-white text-xs cursor-default", accent)}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
