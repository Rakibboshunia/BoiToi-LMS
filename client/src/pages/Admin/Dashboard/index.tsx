import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, GraduationCap, DollarSign,
  TrendingUp, ShieldCheck, Activity, ArrowUpRight,
  UserCheck, BookMarked, BarChart3, Zap
} from 'lucide-react';
import { getAdminStats } from '../../../services/adminApi';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 }
  }),
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  change?: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, gradient, change, index }) => (
  <motion.div
    custom={index}
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    className="relative bg-slate-900/60 border border-slate-800 rounded-2xl p-5 overflow-hidden group hover:border-slate-700 transition-all duration-300"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
        {icon}
      </div>
      {change && (
        <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded-full">
          <ArrowUpRight size={12} />
          {change}
        </div>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-slate-100">{value}</p>
      <p className="text-slate-500 text-xs">{subtitle}</p>
    </div>
  </motion.div>
);

const recentActivities = [
  { icon: <UserCheck size={16} />, text: 'New student registered', time: '2 mins ago', color: 'text-blue-400 bg-blue-400/10' },
  { icon: <BookMarked size={16} />, text: 'New course published: React Basics', time: '15 mins ago', color: 'text-emerald-400 bg-emerald-400/10' },
  { icon: <DollarSign size={16} />, text: 'Payment received: $49.99', time: '1 hour ago', color: 'text-yellow-400 bg-yellow-400/10' },
  { icon: <GraduationCap size={16} />, text: 'Teacher application approved', time: '3 hours ago', color: 'text-purple-400 bg-purple-400/10' },
  { icon: <Activity size={16} />, text: 'Live session started', time: '5 hours ago', color: 'text-red-400 bg-red-400/10' },
];

const AdminDashboard: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
  });

  const stats = data?.data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <ShieldCheck className="text-purple-400" size={26} />
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Welcome back! Here's an overview of your platform.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
          <Zap size={14} className="text-yellow-400" />
          <span className="text-slate-300 text-sm font-medium">Live Overview</span>
        </div>
      </motion.div>

      {/* Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 h-36 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm">
          Failed to load stats. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            index={0}
            title="Total Users"
            value={stats?.users?.total ?? 0}
            subtitle={`${stats?.users?.students ?? 0} students · ${stats?.users?.teachers ?? 0} teachers`}
            icon={<Users size={20} />}
            gradient="from-blue-500 to-indigo-600"
            change="+12%"
          />
          <StatCard
            index={1}
            title="Students"
            value={stats?.users?.students ?? 0}
            subtitle="Active learners"
            icon={<GraduationCap size={20} />}
            gradient="from-emerald-500 to-teal-600"
            change="+8%"
          />
          <StatCard
            index={2}
            title="Total Courses"
            value={stats?.courses?.total ?? 0}
            subtitle={`${stats?.courses?.published ?? 0} published`}
            icon={<BookOpen size={20} />}
            gradient="from-violet-500 to-purple-600"
            change="+5%"
          />
          <StatCard
            index={3}
            title="Total Revenue"
            value={`$${(stats?.revenue?.total ?? 0).toLocaleString()}`}
            subtitle="All time earnings"
            icon={<DollarSign size={20} />}
            gradient="from-amber-500 to-orange-600"
            change="+22%"
          />
        </div>
      )}

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-slate-200 font-semibold flex items-center gap-2">
              <Activity size={17} className="text-purple-400" />
              Recent Activity
            </h2>
            <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full">Last 24h</span>
          </div>
          <div className="space-y-3">
            {recentActivities.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.07, duration: 0.3 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-sm group-hover:text-slate-100 transition-colors">{item.text}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Platform Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={17} className="text-purple-400" />
            <h2 className="text-slate-200 font-semibold">Platform Summary</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Course Completion Rate', value: 72, color: 'from-blue-500 to-indigo-500' },
              { label: 'Teacher Approval Rate', value: 88, color: 'from-emerald-500 to-teal-500' },
              { label: 'Student Retention', value: 65, color: 'from-purple-500 to-pink-500' },
              { label: 'Revenue Growth', value: 45, color: 'from-amber-500 to-orange-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-slate-400 text-xs">{item.label}</span>
                  <span className="text-slate-300 text-xs font-semibold">{item.value}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-400">Platform Health</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp size={13} /> Excellent
              </span>
            </div>
            <p className="text-slate-600 text-xs">All systems are operating normally</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
