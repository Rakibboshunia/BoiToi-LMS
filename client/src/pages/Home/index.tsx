import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, BookOpen, PlayCircle, Award, ArrowRight, 
  Users, Zap, Star, Search, Menu, X, CheckCircle, 
  Globe, Monitor, Code, Cpu, Database, Smartphone, 
  Cloud, Shield, Play
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCourses } from '../../services/courseApi';
import Loader from '../../components/Loader';

const categories = [
  { name: 'Web Development', icon: <Code size={24} />, courses: '1.2k+', color: 'from-blue-500 to-cyan-400' },
  { name: 'Data Science', icon: <Database size={24} />, courses: '800+', color: 'from-pink-500 to-rose-400' },
  { name: 'AI & ML', icon: <Cpu size={24} />, courses: '1.5k+', color: 'from-orange-500 to-amber-400' },
  { name: 'Mobile Dev', icon: <Smartphone size={24} />, courses: '900+', color: 'from-indigo-500 to-purple-400' },
  { name: 'DevOps & Cloud', icon: <Cloud size={24} />, courses: '1.1k+', color: 'from-emerald-500 to-teal-400' },
  { name: 'Cybersecurity', icon: <Shield size={24} />, courses: '400+', color: 'from-purple-500 to-fuchsia-400' },
  { name: 'Software Testing', icon: <CheckCircle size={24} />, courses: '300+', color: 'from-red-500 to-pink-500' },
  { name: 'System Design', icon: <Monitor size={24} />, courses: '500+', color: 'from-rose-400 to-red-500' },
];

const benefits = [
  { 
    title: 'Learn from industry experts', 
    description: 'Select from top instructors around the world who have real-world experience.',
    icon: <Users size={28} className="text-blue-400" />
  },
  { 
    title: 'Find video courses on almost any topic', 
    description: 'Build your library for your career and personal growth.',
    icon: <PlayCircle size={28} className="text-purple-400" />
  },
  { 
    title: 'Learn at your own pace', 
    description: 'Enjoy lifetime access to courses on our platform and mobile app.',
    icon: <Zap size={28} className="text-orange-400" />
  },
  { 
    title: 'Earn recognized certificates', 
    description: 'Prove your skills to employers with verifiable completion certificates.',
    icon: <Award size={28} className="text-emerald-400" />
  }
];

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Web Developer',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    content: 'The web development bootcamp completely changed my career trajectory. The instructors are top-notch and the community is incredibly supportive.',
    rating: 5
  },
  {
    name: 'David Chen',
    role: 'UX Designer',
    avatar: 'https://i.pravatar.cc/150?u=david',
    content: 'I\'ve taken over 10 courses here. The quality of the video production and the depth of the material is consistently excellent across all categories.',
    rating: 5
  },
  {
    name: 'Maria Garcia',
    role: 'Data Analyst',
    avatar: 'https://i.pravatar.cc/150?u=maria',
    content: 'The practical, hands-on projects were exactly what I needed to build my portfolio. I landed my dream job just two months after completing the data science track.',
    rating: 4.5
  }
];

const Home: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/courses');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: () => getCourses({ limit: 4 }),
  });

  const featuredCourses = coursesData?.data?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* 1. Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0e]/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/10 group-hover:shadow-white/20 transition-all overflow-hidden shrink-0">
                <img src="/logo.png" alt="BoiToi" className="w-8 h-8 object-contain" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                Boi<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Toi</span>
              </span>
            </Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-80 focus-within:bg-white/10 focus-within:border-indigo-500/50 transition-all">
              <Search size={18} className="text-slate-400 mr-2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..." 
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-slate-500"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/courses" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Courses</Link>
            <Link to="/courses" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Categories</Link>
            <Link to="/register?role=teacher" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Teach</Link>
            
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link to="/register" className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
              Sign up
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-[#12121a] border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl md:hidden"
            >
              <form onSubmit={handleSearch} className="flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-2">
                <Search size={18} className="text-slate-400 mr-2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-sm w-full text-white" 
                />
              </form>
              <Link to="/courses" className="text-base font-medium text-slate-300 py-2 border-b border-white/5">Courses</Link>
              <Link to="/courses" className="text-base font-medium text-slate-300 py-2 border-b border-white/5">Categories</Link>
              <Link to="/register?role=teacher" className="text-base font-medium text-slate-300 py-2 border-b border-white/5">Teach</Link>
              <div className="flex flex-col gap-3 mt-4">
                <Link to="/login" className="px-5 py-3 rounded-xl text-center font-medium text-white bg-white/5 border border-white/10">Log in</Link>
                <Link to="/register" className="px-5 py-3 rounded-xl text-center font-medium text-white bg-indigo-600 hover:bg-indigo-700">Sign up</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-24 md:pt-32 pb-16">
        {/* 2. Hero Section */}
        <section className="relative max-w-7xl mx-auto px-6 mb-32">
          {/* Decorative Gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[70vh]">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-start text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
                <Sparkles size={14} />
                The New Standard of Learning
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                Unlock Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  Potential
                </span> Today.
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
                Join over 12 million students learning from world-class instructors. Master new skills, advance your career, and explore your passions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/register" className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95">
                  Get Started Free
                </Link>
                <Link to="/courses" className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <PlayCircle size={20} className="text-slate-300" />
                  Explore Courses
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6 text-sm text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-indigo-400" /> No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-indigo-400" /> 14-day free trial
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-indigo-900/50 bg-[#1a1a24] p-4">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Students learning together" 
                  className="w-full h-full object-cover rounded-[2.5rem]"
                />
                
                {/* Floating UI Elements */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-12 -left-6 bg-[#1a1a24] border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                    <CheckCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Course Completed</p>
                    <p className="text-sm font-bold text-white">Advanced React</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 15, 0] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-16 -right-6 bg-[#1a1a24] border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-4"
                >
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} alt="user" className="w-10 h-10 rounded-full border-2 border-[#1a1a24]" />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Join</p>
                    <p className="text-sm font-bold text-white">12k+ Students</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. Trusted By */}
        <section className="border-y border-white/5 bg-white/[0.02] py-10 mb-32 flex justify-center">
          <div className="max-w-7xl px-6 w-full text-center">
            <p className="text-sm font-medium text-slate-400 mb-8 uppercase tracking-widest">Trusted by over 10,000 companies around the world</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="font-bold text-2xl font-serif">Google</div>
              <div className="font-bold text-2xl tracking-tighter">Microsoft</div>
              <div className="font-bold text-2xl italic">Amazon</div>
              <div className="font-bold text-2xl tracking-widest">NETFLIX</div>
              <div className="font-bold text-2xl font-mono">Spotify</div>
            </div>
          </div>
        </section>

        {/* 4. Top Categories */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Top Categories</h2>
              <p className="text-slate-400 max-w-2xl">Explore our wide range of categories and find the perfect course to kickstart your new career.</p>
            </div>
            <Link to="/courses" className="inline-flex items-center gap-2 text-indigo-400 font-medium hover:text-indigo-300 transition-colors group">
              View all categories <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                key={i}
              >
                <Link to={`/courses?category=${encodeURIComponent(cat.name)}`} className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all group">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${cat.color} mb-6 shadow-lg`}>
                    <div className="text-white drop-shadow-md">{cat.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                  <p className="text-slate-400 text-sm font-medium">{cat.courses} Courses</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. Why Choose Us (Benefits) */}
        <section className="py-24 bg-[#12121a] mb-32 border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
            <div className="text-center mb-16 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Learn with BoiToi?</h2>
              <p className="text-slate-400 text-lg">We provide a world-class learning experience designed to help you achieve your goals faster and more efficiently.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                  className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-all"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-14 h-14 rounded-2xl bg-[#1a1a24] border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Featured Courses */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Courses</h2>
              <p className="text-slate-400 max-w-2xl">Hand-picked courses by our expert team to help you master new skills.</p>
            </div>
            <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              Browse all courses
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader message="Loading amazing courses..." /></div>
          ) : featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map((course: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={course._id}
                >
                  <Link to={`/courses/${course._id}`} className="block group h-full flex flex-col bg-[#12121a] rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
                    <div className="relative aspect-video overflow-hidden bg-[#1a1a24]">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={40} className="text-white/10" />
                        </div>
                      )}
                      
                      {/* Overlay badges */}
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10">
                        {course.category}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                        <Play size={12} className="text-indigo-400" />
                        {course.sections?.reduce((acc: number, sec: any) => acc + sec.lessons?.length || 0, 0) || 0} Lessons
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                          <Star size={14} fill="currentColor" />
                          {course.rating?.average?.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-slate-500 text-xs">({course.rating?.count || 0} reviews)</span>
                      </div>
                      
                      <h3 className="font-bold text-white text-lg leading-tight mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">
                        {course.shortDescription || course.description}
                      </p>
                      
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                            {course.instructor?.name?.charAt(0) || 'I'}
                          </div>
                          <span className="text-xs font-medium text-slate-300 truncate max-w-[100px]">{course.instructor?.name || 'Instructor'}</span>
                        </div>
                        <div className="font-extrabold text-white text-lg">
                          {course.isFree ? <span className="text-emerald-400">Free</span> : `$${course.price}`}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
             <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl border-dashed">
                <p className="text-slate-400">No courses available at the moment.</p>
             </div>
          )}
        </section>

        {/* 7. Become an Instructor Banner */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-[#1a1040] rounded-[3rem] p-10 md:p-16 relative overflow-hidden border border-white/10 shadow-2xl">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Come teach with us</h2>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-lg">
                  Become an instructor and change lives — including your own. We provide the tools and skills to teach what you love.
                </p>
                <ul className="space-y-4 mb-10">
                  {['Earn money sharing your expertise', 'Inspire millions of students globally', 'Join a community of 50k+ instructors'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-200">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <CheckCircle size={14} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/register?role=teacher" className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-indigo-900 bg-white hover:bg-slate-100 transition-all shadow-lg hover:shadow-white/25">
                  Start teaching today
                </Link>
              </div>
              
              <div className="hidden lg:block relative">
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Instructor teaching" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                     <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-white font-bold">John Doe</p>
                          <p className="text-slate-300 text-xs">Web Developer Instructor</p>
                        </div>
                        <div className="bg-indigo-600 px-3 py-1 rounded-lg text-xs font-bold text-white">Top Rated</div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Testimonials */}
        <section className="max-w-7xl mx-auto px-6 mb-20 flex flex-col items-center">
          <div className="text-center mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Students Say</h2>
            <p className="text-slate-400 text-lg">Discover how BoiToi has transformed the careers and lives of thousands of learners worldwide.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 w-full">
            {testimonials.map((test, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col relative"
              >
                <div className="text-6xl text-indigo-500/20 absolute top-4 left-6 font-serif">"</div>
                <div className="flex gap-1 mb-6 relative z-10">
                  {[...Array(5)].map((_, j) => (
                     <Star key={j} size={16} className={j < Math.floor(test.rating) ? "text-amber-400 fill-amber-400" : "text-slate-600"} />
                  ))}
                </div>
                <p className="text-slate-300 italic mb-8 flex-1 relative z-10 leading-relaxed">"{test.content}"</p>
                
                <div className="flex items-center gap-4 mt-auto relative z-10 pt-6 border-t border-white/10">
                  <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full border-2 border-indigo-500/30" />
                  <div>
                    <h4 className="font-bold text-white">{test.name}</h4>
                    <p className="text-xs text-slate-400">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <footer className="bg-[#050508] border-t border-white/10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
            <div className="col-span-2 lg:col-span-2 flex flex-col">
              <Link to="/" className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                  <img src="/logo.png" alt="BoiToi" className="w-7 h-7 object-contain" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">
                  Boi<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Toi</span>
                </span>
              </Link>
              <p className="text-slate-400 text-sm mb-6 max-w-sm leading-relaxed">
                Empowering individuals and organizations to achieve their goals through high-quality, accessible, and affordable online education.
              </p>
              <div className="flex gap-3">
                {/* GitHub */}
                <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all group"
                  title="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                {/* Portfolio */}
                <a href="https://yourportfolio.com" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-purple-600 hover:text-white hover:border-purple-500 transition-all group"
                  title="Portfolio">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all group"
                  title="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white hover:border-pink-500 transition-all group"
                  title="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className="text-white font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link to="/courses" className="hover:text-indigo-400 transition-colors">Browse Courses</Link></li>
                <li><Link to="/register?role=teacher" className="hover:text-indigo-400 transition-colors">Become an Instructor</Link></li>
                <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Get Started Free</Link></li>
                <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Log In</Link></li>
              </ul>
            </div>

            <div className="flex flex-col">
              <h4 className="text-white font-bold mb-6">Learn</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link to="/courses?category=Web+Development" className="hover:text-indigo-400 transition-colors">Web Development</Link></li>
                <li><Link to="/courses?category=Data+Science" className="hover:text-indigo-400 transition-colors">Data Science</Link></li>
                <li><Link to="/courses?category=AI+%26+ML" className="hover:text-indigo-400 transition-colors">AI & ML</Link></li>
                <li><Link to="/courses?category=Cybersecurity" className="hover:text-indigo-400 transition-colors">Cybersecurity</Link></li>
              </ul>
            </div>

            <div className="flex flex-col">
              <h4 className="text-white font-bold mb-6">Account</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Create Account</Link></li>
                <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Sign In</Link></li>
                <li><Link to="/student/dashboard" className="hover:text-indigo-400 transition-colors">Student Dashboard</Link></li>
                <li><Link to="/teacher/dashboard" className="hover:text-indigo-400 transition-colors">Teacher Dashboard</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} BoiToi, Inc. All rights reserved.</p>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-slate-400 text-sm">
              <Globe size={16} />
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
