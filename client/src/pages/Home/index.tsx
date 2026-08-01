import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, PlayCircle, Award, ArrowRight, Users, Zap, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCourses } from '../../services/courseApi';
import Loader from '../../components/Loader';

const features = [
  { icon: <BookOpen size={20} />, title: '500+ Courses', desc: 'Expert-led courses across every domain', gradient: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' },
  { icon: <PlayCircle size={20} />, title: 'Live Classes', desc: 'Interactive real-time sessions with teachers', gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
  { icon: <Award size={20} />, title: 'Certificates', desc: 'Industry-recognized completion certificates', gradient: 'linear-gradient(135deg,#f97316,#ef4444)' },
  { icon: <Zap size={20} />, title: 'AI Learning', desc: 'Personalized AI-powered learning paths', gradient: 'linear-gradient(135deg,#f97316,#8b5cf6)' },
];

const stats = [
  { value: '12K+', label: 'Students', icon: <Users size={18} /> },
  { value: '500+', label: 'Courses', icon: <BookOpen size={18} /> },
  { value: '98%', label: 'Satisfaction', icon: <Star size={18} /> },
];

const Home: React.FC = () => {
  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: () => getCourses({ limit: 3 }),
  });

  const featuredCourses = coursesData?.data?.slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0d1b3e 100%)' }}>
      {/* Decorative orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-12 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
      <div className="fixed top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />

      {/* Navbar */}
      <nav className="relative flex items-center justify-between px-6 md:px-12 h-16"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#f97316,#8b5cf6)' }}>
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg">
            LMS <span style={{ background: 'linear-gradient(90deg,#f97316,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Platform</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ color: 'rgba(255,255,255,0.65)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'white')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}>
            Sign In
          </Link>
          <Link to="/register" className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#f97316,#8b5cf6)', boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', color: '#f97316' }}>
            <Sparkles size={14} />
            AI-Powered Learning Platform
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Learn Smarter,<br />
            <span style={{ background: 'linear-gradient(90deg,#f97316,#8b5cf6,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Grow Faster
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            A comprehensive learning management system with live classes, quizzes, certificates, and AI-powered learning paths.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-base transition-all hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg,#f97316,#8b5cf6)', boxShadow: '0 8px 30px rgba(249,115,22,0.4)' }}>
              Start Learning Free <ArrowRight size={18} />
            </Link>
            <Link to="/courses" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-base transition-all hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
              Browse Courses <BookOpen size={18} />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-14">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center">
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mt-20 w-full">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
              className="rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3"
                style={{ background: f.gradient }}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Featured Courses */}
        <div className="max-w-6xl mx-auto mt-32 w-full px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Courses</h2>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.55)' }}>Explore some of our most popular learning paths</p>
          </div>
          
          {isLoading ? (
            <Loader message="Loading courses..." />
          ) : featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCourses.map((course: any, i: number) => (
                <motion.div key={course._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <Link 
                    to={`/courses/${course._id}`}
                    className="block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 group h-full flex flex-col"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}
                  >
                    <div className="h-48 relative overflow-hidden">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                          <BookOpen size={40} style={{ color: 'rgba(255,255,255,0.2)' }} />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold text-white"
                        style={{ background: 'rgba(15,12,41,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {course.category}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                      <p className="text-sm mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {course.shortDescription || course.description}
                      </p>
                      
                      <div className="mt-auto pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#f97316' }}>
                          <Star size={16} fill="currentColor" />
                          <span>{course.rating?.average?.toFixed(1) || '0.0'}</span>
                          <span style={{ color: 'rgba(255,255,255,0.3)' }}>({course.rating?.count || 0})</span>
                        </div>
                        <div className="font-bold text-lg text-white">
                          {course.isFree ? 'Free' : `$${course.price}`}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>No courses available at the moment.</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              View All Courses <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm" style={{ color: 'rgba(255,255,255,0.25)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        © 2026 LMS Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
