
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { 
  PlayCircle, Clock, Award, Star, CheckCircle, Users, ArrowRight,
  Lock, BookOpen, ArrowLeft, Video, 
  MonitorPlay, FileText, Download 
} from 'lucide-react';

import { getCourse } from '../../services/courseApi';
import { useAuth } from '../../context/AuthContext';

const CourseDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourse(id as string),
    enabled: !!id,
    retry: false,
  });

  const course = data?.data;

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    // In a real app, this would initiate payment or free enrollment
    navigate(`/checkout/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-slate-400 font-medium">Loading course details...</p>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="text-slate-400 mb-4">
          <BookOpen size={64} className="opacity-50" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
        <p className="text-slate-500 mb-6">The course you are looking for does not exist or has been removed.</p>
        <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30 pb-24">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50 py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link to="/" className="flex items-center bg-white px-4 py-1.5 rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all">
            <img src="/logo.png" alt="BoiToi Logo" className="h-8 md:h-10 object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              <ArrowLeft size={16} /> Back to Courses
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-sm font-medium text-blue-400"
            >
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                {course.category}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Award size={14} /> {course.level} Level
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
            >
              {course.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed"
            >
              {course.shortDescription || course.description}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-8 text-sm border-y border-slate-800/50 py-6"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center text-yellow-500">
                  <Star size={20} fill="currentColor" />
                </div>
                <span className="text-lg font-bold text-white">{course.rating?.average?.toFixed(1) || '4.8'}</span>
                <span className="text-slate-500">({course.rating?.count || 124} reviews)</span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-300">
                <Users size={20} className="text-blue-400" />
                <span><strong className="text-white">{course.enrollmentCount || 0}</strong> students enrolled</span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-300">
                <Clock size={20} className="text-purple-400" />
                <span><strong className="text-white">{course.totalDuration || '12.5'}</strong> hours of content</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden">
                {course.teacher?.avatar ? (
                  <img src={course.teacher.avatar} alt={course.teacher.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {course.teacher?.name?.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-0.5">Course Instructor</p>
                <p className="text-lg font-bold text-white">{course.teacher?.name}</p>
              </div>
            </motion.div>
          </div>

          {/* Floating Action Card (Desktop) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full lg:w-[420px] shrink-0 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl shadow-blue-900/20 overflow-hidden relative lg:-mb-40 z-20"
          >
            <div className="aspect-video bg-slate-800 relative group cursor-pointer">
              {course.previewVideo ? (
                 <video src={course.previewVideo} controls className="w-full h-full object-cover" />
              ) : course.thumbnail ? (
                <>
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center group-hover:bg-slate-900/20 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PlayCircle size={32} className="text-white ml-1" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PlayCircle size={64} className="text-slate-600" />
                </div>
              )}
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-extrabold text-white">
                  {course.isFree ? 'Free' : `$${course.price}`}
                </span>
                {!course.isFree && (
                  <span className="text-lg text-slate-500 line-through mb-1">${(course.price * 1.5).toFixed(2)}</span>
                )}
              </div>
              
              <button 
                onClick={handleEnroll}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                Enroll Now <ArrowRight size={20} />
              </button>
              
              <div className="pt-6 border-t border-slate-800">
                <p className="font-semibold text-white mb-4">This course includes:</p>
                <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex items-center gap-3"><MonitorPlay size={18} className="text-blue-400" /> {course.totalDuration || '12.5'} hours on-demand video</li>
                  <li className="flex items-center gap-3"><FileText size={18} className="text-purple-400" /> {course.modules?.length || 5} comprehensive modules</li>
                  <li className="flex items-center gap-3"><Download size={18} className="text-emerald-400" /> Downloadable resources</li>
                  <li className="flex items-center gap-3"><Clock size={18} className="text-orange-400" /> Full lifetime access</li>
                  <li className="flex items-center gap-3"><Award size={18} className="text-yellow-400" /> Certificate of completion</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 lg:px-12 py-16 flex flex-col lg:flex-row gap-16">
        <div className="flex-1 space-y-16 lg:pr-8">
          
          {/* What you'll learn */}
          {(course.whatYouLearn && course.whatYouLearn.length > 0) ? (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">What you'll learn</h2>
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {course.whatYouLearn.map((item: string, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="mt-1 bg-emerald-500/20 p-1 rounded-full text-emerald-400 shrink-0">
                        <CheckCircle size={16} />
                      </div>
                      <span className="text-slate-300 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">What you'll learn</h2>
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "Master the core concepts and advanced techniques of the subject.",
                    "Build real-world projects to add to your portfolio.",
                    "Understand industry best practices and standards.",
                    "Learn how to troubleshoot and solve complex problems."
                  ].map((item: string, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="mt-1 bg-emerald-500/20 p-1 rounded-full text-emerald-400 shrink-0">
                        <CheckCircle size={16} />
                      </div>
                      <span className="text-slate-300 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Description */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Course Description</h2>
            <div className="prose prose-invert prose-slate max-w-none prose-p:text-slate-400 prose-p:leading-relaxed prose-headings:text-white">
              <p>{course.description}</p>
            </div>
          </section>

          {/* Course Content */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Course Curriculum</h2>
                <p className="text-slate-400">Detailed breakdown of the topics covered in this course.</p>
              </div>
              <div className="text-sm font-medium text-blue-400 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20 inline-block">
                {course.modules?.length || 0} Modules • {course.modules?.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0) || 0} Lessons
              </div>
            </div>
            
            <div className="border border-slate-800 rounded-3xl overflow-hidden bg-slate-900/30">
              {(!course.modules || course.modules.length === 0) ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                    <Video size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Curriculum is being updated</h3>
                  <p className="text-slate-400">The instructor is currently uploading the modules for this course.</p>
                </div>
              ) : (
                course.modules.map((mod: any, idx: number) => (
                  <div key={mod._id} className="border-b border-slate-800 last:border-0 group">
                    <div className="bg-slate-900 p-6 flex justify-between items-center transition-colors">
                      <h4 className="font-bold text-white text-lg">
                        <span className="text-blue-500 mr-2">Module {idx + 1}:</span> {mod.title}
                      </h4>
                      <span className="text-sm font-medium px-3 py-1 bg-slate-800 text-slate-300 rounded-full">
                        {mod.lessons?.length || 0} lessons
                      </span>
                    </div>
                    {mod.lessons && mod.lessons.length > 0 && (
                      <div className="divide-y divide-slate-800/50 bg-slate-900/30">
                        {mod.lessons.map((lesson: any) => (
                          <div key={lesson._id} className="p-5 pl-8 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                              {lesson.type === 'video' ? (
                                <MonitorPlay size={20} className="text-blue-400" />
                              ) : (
                                <FileText size={20} className="text-purple-400" />
                              )}
                              <span className="text-slate-300 font-medium group-hover/lesson:text-white transition-colors">{lesson.title}</span>
                            </div>
                            {lesson.isFreePreview ? (
                              <button className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md hover:bg-emerald-500/20 transition-colors">
                                Preview
                              </button>
                            ) : (
                              <Lock size={16} className="text-slate-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
        
        {/* Spacer for floating card on desktop */}
        <div className="hidden lg:block w-[420px] shrink-0"></div>
      </div>
    </div>
  );
};

export default CourseDetail;
