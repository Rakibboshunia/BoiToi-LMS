import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Users, DollarSign, Star, TrendingUp, Plus, Zap, ArrowRight, BarChart3, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTeacherDashboard } from '../../services/dashboardApi';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getTeacherDashboard();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          toast.error(response.error || 'Failed to load dashboard data');
        }
      } catch (error) {
        toast.error('Failed to fetch teacher dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = [
    {
      label: 'Total Courses',
      value: dashboardData?.stats?.totalCourses?.toString() || '0',
      icon: <BookOpen size={22} />,
      gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
      glow: 'rgba(59,130,246,0.35)',
      sub: 'published',
    },
    {
      label: 'Total Students',
      value: dashboardData?.stats?.totalStudents?.toString() || '0',
      icon: <Users size={22} />,
      gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      glow: 'rgba(139,92,246,0.35)',
      sub: 'active',
    },
    {
      label: 'Total Earnings',
      value: `$${dashboardData?.stats?.totalEarnings?.toFixed(2) || '0.00'}`,
      icon: <DollarSign size={22} />,
      gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
      glow: 'rgba(249,115,22,0.35)',
      sub: 'this month',
    },
    {
      label: 'Avg Rating',
      value: dashboardData?.stats?.avgRating?.toString() || '0.0',
      icon: <Star size={22} />,
      gradient: 'linear-gradient(135deg, #f97316, #8b5cf6)',
      glow: 'rgba(249,115,22,0.3)',
      sub: 'overall',
    },
  ];

  const quickActions = [
    { label: 'New Course', icon: <Plus size={16} />, gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', path: '/teacher/courses/create' },
    { label: 'Live Session', icon: <Zap size={16} />, gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)', path: '/teacher/live' },
    { label: 'Assignments', icon: <BookOpen size={16} />, gradient: 'linear-gradient(135deg, #f97316, #ef4444)', path: '/teacher/assignments' },
    { label: 'My Students', icon: <Users size={16} />, gradient: 'linear-gradient(135deg, #f97316, #8b5cf6)', path: '/teacher/students' },
  ];

  return (
    <div className="space-y-6">

      {/* ─── Approval Banner ─── */}
      {!user?.isApproved && (
        <div
          className="flex items-start gap-3 px-5 py-4 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,179,8,0.1))',
            border: '1px solid rgba(249,115,22,0.3)',
          }}
        >
          <Bell size={18} style={{ color: '#f97316', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: '#fdba74' }}>Profile Under Review</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(253,186,116,0.7)' }}>
              You can create courses now, but they won't be published until you're approved by admin.
            </p>
          </div>
        </div>
      )}

      {/* ─── Hero Welcome Banner ─── */}
      <div
        className="relative rounded-2xl overflow-hidden p-6 md:p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(139,92,246,0.25) 50%, rgba(59,130,246,0.2) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={15} style={{ color: '#f97316' }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#f97316' }}>
                Teacher Dashboard
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Hello, <span style={{ background: 'linear-gradient(90deg, #f97316, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0]}!</span>
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Your teaching empire starts here. Let's inspire some minds today! ✨
            </p>
          </div>

          <button
            onClick={() => navigate('/teacher/courses/create')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #f97316, #8b5cf6)',
              boxShadow: '0 4px 15px rgba(249,115,22,0.35)',
            }}
          >
            <Plus size={18} />
            Create New Course
          </button>
        </div>
      </div>

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 8px 32px ${stat.glow}`)}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                style={{ background: stat.gradient }}>
                {stat.icon}
              </div>
              <TrendingUp size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</p>
            <p className="text-xs mt-2 px-2 py-0.5 rounded-full inline-block" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ─── Quick Actions ─── */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white" style={{ background: action.gradient }}>
                {action.icon}
              </div>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Main Panels ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Enrollments */}
        <div className="rounded-2xl flex flex-col overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '300px' }}>
          <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} />
              <h2 className="text-base font-semibold text-white">Recent Activity</h2>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium hover:opacity-80" style={{ color: '#8b5cf6' }}>
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            {loading ? (
              <Loader message="Loading activity..." />
            ) : dashboardData?.recentActivity?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-white/5">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/20 text-blue-400">
                      <Bell size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{activity.message}</p>
                      <p className="text-xs text-white/50">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <Users size={28} style={{ color: '#3b82f6' }} />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium mb-1">No activity yet</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Recent events will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="rounded-2xl flex flex-col overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '300px' }}>
          <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #f97316, #8b5cf6)' }} />
              <h2 className="text-base font-semibold text-white">Earnings Overview</h2>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)' }}>
              Monthly
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <BarChart3 size={28} style={{ color: '#f97316' }} />
            </div>
            <div className="text-center">
              <p className="text-white font-medium mb-1">No earnings data</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Your revenue chart will appear once students enroll</p>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="text-center">
                <p className="text-xl font-bold text-white">${dashboardData?.stats?.totalEarnings?.toFixed(2) || '0.00'}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>This Month</p>
              </div>
              <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="text-center">
                <p className="text-xl font-bold text-white">${dashboardData?.stats?.totalEarnings?.toFixed(2) || '0.00'}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
