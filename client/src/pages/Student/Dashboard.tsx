import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Award, PlayCircle, Clock, ArrowRight, Video } from 'lucide-react';
import { getStudentDashboardStats } from '../../services/studentApi';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['studentDashboardStats'],
    queryFn: getStudentDashboardStats,
  });

  const stats = data?.data?.stats || { totalEnrolled: 0, completedCourses: 0, liveClassesCount: 0, hoursLearned: 0 };
  const recentEnrollments = data?.data?.recentEnrollments || [];
  const upcomingClasses = data?.data?.upcomingLiveClasses || [];

  const statCards = [
    { label: 'Enrolled Courses', value: stats.totalEnrolled, icon: <BookOpen size={24} className="text-blue-400" />, bg: "from-blue-500/20 to-cyan-500/10", border: "border-blue-500/20" },
    { label: 'Completed', value: stats.completedCourses, icon: <Award size={24} className="text-emerald-400" />, bg: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-500/20" },
    { label: 'Upcoming Live', value: stats.liveClassesCount, icon: <PlayCircle size={24} className="text-purple-400" />, bg: "from-purple-500/20 to-pink-500/10", border: "border-purple-500/20" },
    { label: 'Hours Learned', value: stats.hoursLearned, icon: <Clock size={24} className="text-amber-400" />, bg: "from-amber-500/20 to-orange-500/10", border: "border-amber-500/20" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-slate-800 rounded-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{user?.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            You're making great progress. Ready to continue your learning journey today?
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className={`bg-slate-900/60 border ${stat.border} rounded-2xl p-6 shadow-lg backdrop-blur-sm relative overflow-hidden group`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {isLoading ? <span className="animate-pulse bg-slate-800 text-transparent rounded">000</span> : stat.value}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-slate-800/50 flex items-center justify-center shadow-inner border border-slate-700">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="text-blue-400" size={20} />
              Continue Learning
            </h2>
            <Link to="/student/courses" className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-slate-500">Loading your courses...</div>
          ) : recentEnrollments.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl bg-slate-800/20">
              <BookOpen size={48} className="mb-4 text-slate-600 opacity-50" />
              <p>You haven't enrolled in any courses yet.</p>
              <Link to="/courses" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-medium">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentEnrollments.map((enrollment: any) => (
                <div key={enrollment._id} className="group bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex gap-4 hover:bg-slate-800 transition-colors">
                  <div className="w-32 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-700 relative">
                    {enrollment.course?.thumbnail ? (
                      <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                        <BookOpen size={24} className="text-slate-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle size={32} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="text-base font-semibold text-slate-200 truncate group-hover:text-blue-400 transition-colors">
                      {enrollment.course?.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Instructor: {enrollment.course?.teacher?.name || 'Unknown'}</p>
                    
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-slate-300 w-8">{enrollment.progress || 0}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Upcoming Live Classes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="text-purple-400" size={20} />
              Upcoming Live
            </h2>
          </div>
          
          <div className="flex-1">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-slate-500">Loading...</div>
            ) : upcomingClasses.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl bg-slate-800/20">
                <Video size={32} className="mb-3 text-slate-600 opacity-50" />
                <p className="text-sm">No upcoming classes.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingClasses.map((liveClass: any) => {
                  const startTime = new Date(liveClass.startTime);
                  return (
                    <div key={liveClass._id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:border-purple-500/50 transition-colors">
                      <div className="flex gap-3">
                        <div className="bg-slate-900 rounded-lg p-2 text-center min-w-[50px] border border-slate-700">
                          <p className="text-xs text-slate-400 uppercase font-bold">{startTime.toLocaleString('default', { month: 'short' })}</p>
                          <p className="text-lg font-bold text-white">{startTime.getDate()}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-purple-400 font-medium mb-1">
                            {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <h4 className="text-sm font-semibold text-slate-200 truncate">{liveClass.topic}</h4>
                          <p className="text-xs text-slate-400 truncate mt-1">{liveClass.course?.title}</p>
                        </div>
                      </div>
                      <Link 
                        to={`/student/live/${liveClass._id}`}
                        className="mt-3 w-full block text-center py-2 bg-slate-700/50 hover:bg-purple-600 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        Join Class
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
