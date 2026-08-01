import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Award, PlayCircle, Clock, TrendingUp, Zap, Target, ArrowRight } from 'lucide-react';
import { getStudentDashboard } from '../../services/dashboardApi';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const GlassCard: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style }) => (
  <div
    className={`rounded-2xl p-6 ${className}`}
    style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)',
      ...style,
    }}
  >
    {children}
  </div>
);

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getStudentDashboard();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          toast.error(response.error || 'Failed to fetch dashboard data');
        }
      } catch (error) {
        toast.error('Failed to fetch student dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = [
    {
      label: 'Enrolled Courses',
      value: dashboardData?.stats?.enrolled?.toString() || '0',
      icon: <BookOpen size={22} />,
      gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      glow: 'rgba(59,130,246,0.3)',
      change: 'Courses',
    },
    {
      label: 'Completed',
      value: dashboardData?.stats?.completed?.toString() || '0',
      icon: <Award size={22} />,
      gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
      glow: 'rgba(249,115,22,0.3)',
      change: 'Progress',
    },
    {
      label: 'Live Classes',
      value: dashboardData?.stats?.liveClasses?.toString() || '0',
      icon: <PlayCircle size={22} />,
      gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      glow: 'rgba(139,92,246,0.3)',
      change: 'Upcoming',
    },
    {
      label: 'Hours Learned',
      value: `${dashboardData?.stats?.hoursLearned || 0}h`,
      icon: <Clock size={22} />,
      gradient: 'linear-gradient(135deg, #f97316, #8b5cf6)',
      glow: 'rgba(249,115,22,0.3)',
      change: 'Total time',
    },
  ];

  const quickActions = [
    { label: 'Browse Courses', icon: <BookOpen size={18} />, gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' },
    { label: 'Join Live Class', icon: <PlayCircle size={18} />, gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
    { label: 'View Assignments', icon: <Target size={18} />, gradient: 'linear-gradient(135deg, #f97316, #ef4444)' },
    { label: 'My Certificates', icon: <Award size={18} />, gradient: 'linear-gradient(135deg, #f97316, #8b5cf6)' },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Hero Welcome Banner ─── */}
      <div
        className="relative rounded-2xl overflow-hidden p-6 md:p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(139,92,246,0.25) 50%, rgba(249,115,22,0.2) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', transform: 'translateY(40%)' }} />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} style={{ color: '#f97316' }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#f97316' }}>
                Student Dashboard
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Welcome back, <span style={{ background: 'linear-gradient(90deg, #f97316, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0]}!</span>
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Your learning journey continues — keep pushing forward! 🚀
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-2xl font-bold text-white">0%</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Overall Progress</p>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-5 group cursor-pointer transition-all duration-300 hover:-translate-y-1"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: `0 0 0 0 ${stat.glow}`,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 8px 32px ${stat.glow}`)}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 0 0 ${stat.glow}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                style={{ background: stat.gradient }}>
                {stat.icon}
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ─── Quick Actions ─── */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              className="group flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: action.gradient }}>
                {action.icon}
              </div>
              <span className="truncate">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Main Panels ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Continue Learning */}
        <div className="lg:col-span-2 rounded-2xl flex flex-col overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '320px' }}>
          <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} />
              <h2 className="text-base font-semibold text-white">Continue Learning</h2>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
              style={{ color: '#8b5cf6' }}>
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            {loading ? (
              <Loader message="Loading activity..." />
            ) : dashboardData?.enrolledCourses?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.enrolledCourses.map((course: any) => (
                  <div key={course._id} className="flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-white/5">
                    <img src={course.thumbnail || 'https://via.placeholder.com/150'} alt={course.title} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-white/50">{course.instructor}</p>
                      <div className="mt-2 w-full bg-white/10 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-white/70">{course.progress}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <BookOpen size={28} style={{ color: '#3b82f6' }} />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium mb-1">No courses yet</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Browse our catalog and start your first course today</p>
                </div>
                <button
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Live Classes */}
        <div className="rounded-2xl flex flex-col overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '320px' }}>
          <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }} />
              <h2 className="text-base font-semibold text-white">Live Classes</h2>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.3)' }}>
              Upcoming
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <PlayCircle size={28} style={{ color: '#8b5cf6' }} />
            </div>
            <div className="text-center">
              <p className="text-white font-medium mb-1">No upcoming classes</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Enroll in a course to see live sessions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
