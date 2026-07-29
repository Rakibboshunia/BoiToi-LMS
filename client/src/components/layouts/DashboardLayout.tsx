import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, X, LogOut, User as UserIcon, BookOpen, 
  LayoutDashboard, PlayCircle, Settings, Award, 
  CreditCard, Users, FileText
} from 'lucide-react';
import { cn } from '../../utils/cn';
import NotificationBell from '../NotificationBell';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const StudentNavItems: SidebarItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard',   path: '/student/dashboard' },
  { icon: <BookOpen size={20} />,       label: 'My Courses',   path: '/student/courses' },
  { icon: <PlayCircle size={20} />,     label: 'Live Classes', path: '/student/live' },
  { icon: <FileText size={20} />,       label: 'Assignments',  path: '/student/assignments' },
  { icon: <Award size={20} />,          label: 'Certificates', path: '/student/certificates' },
  { icon: <CreditCard size={20} />,     label: 'Payments',     path: '/student/payments' },
  { icon: <UserIcon size={20} />,       label: 'Profile',      path: '/student/profile' },
];

const TeacherNavItems: SidebarItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard',      path: '/teacher/dashboard' },
  { icon: <BookOpen size={20} />,        label: 'Manage Courses', path: '/teacher/courses' },
  { icon: <PlayCircle size={20} />,      label: 'Live Sessions',  path: '/teacher/live' },
  { icon: <FileText size={20} />,        label: 'Assignments',    path: '/teacher/assignments' },
  { icon: <Users size={20} />,           label: 'My Students',    path: '/teacher/students' },
  { icon: <CreditCard size={20} />,      label: 'Earnings',       path: '/teacher/earnings' },
  { icon: <Settings size={20} />,        label: 'Settings',       path: '/teacher/settings' },
];

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = user?.role === 'teacher' ? TeacherNavItems : StudentNavItems;
  const roleLabel = user?.role === 'teacher' ? 'Teacher Portal' : 'Student Portal';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-background border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shrink-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="text-xl font-bold text-primary">LMS Platform</span>
        </div>
        
        <div className="p-4 border-b border-border">
          <div className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
            {roleLabel}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 w-full transition-colors"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-background border-b border-border flex items-center px-4 lg:px-8 justify-between sticky top-0 z-30">
          <button 
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="ml-auto flex items-center gap-2">
            <NotificationBell />
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
