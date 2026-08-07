import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  BookOpen, GraduationCap, Users, Video, 
  ArrowRight, Sparkles, CheckCircle, PlayCircle, 
  Star, Shield, Zap, Globe, Quote, Code, Briefcase, Palette, ChevronDown, Award, UserPlus, Search, ShoppingCart
} from 'lucide-react';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-900/50 overflow-hidden transition-colors hover:border-slate-700">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="font-semibold text-slate-200">{question}</span>
        <ChevronDown className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </button>
      <div className={`px-6 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-slate-400 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

interface Instructor {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: string;
  price: number;
  teacher: Instructor;
  enrollmentCount: number;
  rating: { average: number; count: number };
}

const Home: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch published courses from backend
  const { data, isLoading } = useQuery({
    queryKey: ['publicCourses'],
    queryFn: async () => {
      const res = await api.get('/courses');
      return res.data;
    }
  });

  const courses: Course[] = data?.data || [];
  
  // Extract unique instructors from courses for the Instructors section
  const instructors = Array.from(new Map(courses.filter(c => c.teacher).map(c => [c.teacher._id, c.teacher])).values());

  const categories = [
    { name: 'Development', icon: Code, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { name: 'Business', icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'Design', icon: Palette, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { name: 'Marketing', icon: Globe, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  const testimonials = [
    { name: "Sarah Johnson", role: "Software Engineer", content: "This LMS completely transformed my career. The live classes are incredibly engaging and the instructors are top-notch.", avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Michael Chen", role: "UX Designer", content: "I love the interactive assignments. It's not just watching videos; you actually get to practice what you learn immediately.", avatar: "https://i.pravatar.cc/150?img=2" },
    { name: "Emma Williams", role: "Data Analyst", content: "The community support here is unmatched. Whenever I got stuck, both peers and mentors were there to help me out.", avatar: "https://i.pravatar.cc/150?img=3" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link to="/" className="flex items-center bg-white px-4 py-1.5 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all">
            <img src="/logo.png" alt="BoiToi Logo" className="h-10 md:h-12 object-contain" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#courses" className="hover:text-blue-400 transition-colors">Courses</a>
            <a href="#instructors" className="hover:text-blue-400 transition-colors">Instructors</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link to="/register" className="text-sm font-semibold px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
              >
                <Sparkles size={16} />
                <span>The Future of E-Learning</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6"
              >
                Master New Skills with <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                  World-Class Experts
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Access high-quality courses, interactive live sessions, and practical assignments. Build your career with an immersive learning experience.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-1">
                  Start Learning Now <ArrowRight size={18} />
                </Link>
                <a href="#courses" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-semibold transition-all hover:-translate-y-1 backdrop-blur-sm">
                  <PlayCircle size={18} /> Browse Courses
                </a>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1 relative w-full max-w-lg lg:max-w-none"
            >
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-blue-900/20 bg-slate-900 aspect-[4/3] group">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" alt="Learning" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-800/50 bg-slate-900/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-800/50 text-center">
            {[
              { label: 'Active Students', value: '15K+', icon: Users },
              { label: 'Video Courses', value: '350+', icon: Video },
              { label: 'Expert Instructors', value: '120+', icon: Award },
              { label: 'Success Rate', value: '98%', icon: CheckCircle },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="text-blue-400 mb-3"><stat.icon size={28} /></div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 border-y border-slate-800/50 bg-slate-900/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Top Categories</h2>
              <p className="text-slate-400">Explore our most popular learning paths</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors flex flex-col items-center text-center group cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-2xl ${category.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className={category.color} size={32} />
                </div>
                <h3 className="font-semibold text-white">{category.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Steps to Buy */}
      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Start Learning in 3 Easy Steps</h2>
            <p className="text-slate-400">Buying a course and starting your journey has never been easier.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 -translate-y-1/2 z-0" />
            
            {[
              { icon: UserPlus, title: "1. Create an Account", desc: "Sign up for free in less than a minute to get your personalized learning dashboard.", color: "text-blue-400", bg: "bg-blue-500/20" },
              { icon: Search, title: "2. Find Your Course", desc: "Browse our catalog of expert-led courses and find the perfect match for your career goals.", color: "text-purple-400", bg: "bg-purple-500/20" },
              { icon: ShoppingCart, title: "3. Enroll & Learn", desc: "Purchase securely and get instant, lifetime access to all course materials and live sessions.", color: "text-emerald-400", bg: "bg-emerald-500/20" },
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center hover:border-blue-500/50 transition-colors shadow-xl shadow-slate-950"
              >
                <div className={`w-20 h-20 mx-auto rounded-2xl ${step.bg} flex items-center justify-center mb-6 shadow-inner`}>
                  <step.icon className={step.color} size={36} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Courses Section */}
      <section id="courses" className="py-24 bg-slate-950">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Popular Courses</h2>
            <p className="text-slate-400 text-lg">Learn from the best with our highly rated, industry-standard courses.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.slice(0, 6).map((course, i) => (
                <motion.div 
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-900/10 transition-all flex flex-col"
                >
                  <Link to={`/courses/${course._id}`} className="block aspect-video bg-slate-800 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500 group-hover:scale-105 transition-transform duration-500">
                        <Video size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600/90 backdrop-blur-sm rounded-full text-xs font-bold text-white uppercase tracking-wider">
                      {course.category || 'General'}
                    </div>
                  </Link>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-yellow-500 text-sm mb-3">
                      <Star size={16} fill="currentColor" />
                      <span className="font-medium text-slate-300">{course.rating?.average || '4.5'}</span>
                      <span className="text-slate-500">({course.enrollmentCount || 0} students)</span>
                    </div>
                    <Link to={`/courses/${course._id}`}>
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 hover:text-blue-400 transition-colors">{course.title}</h3>
                    </Link>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">{course.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-800">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 mb-1">Price</span>
                        <span className="text-xl font-bold text-emerald-400">${course.price || 'Free'}</span>
                      </div>
                      <Link to={`/courses/${course._id}`} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
                        Enroll Now <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-10">
              No courses available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Instructors Section */}
      {instructors.length > 0 && (
        <section id="instructors" className="py-24 bg-slate-900/50 border-y border-slate-800">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Top Instructors</h2>
              <p className="text-slate-400 text-lg">Learn directly from industry experts who are passionate about teaching.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {instructors.slice(0, 4).map((instructor, i) => (
                <motion.div 
                  key={instructor._id || i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center hover:border-blue-500/50 transition-colors"
                >
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2 border-slate-800">
                    {instructor.avatar ? (
                      <img src={instructor.avatar} alt={instructor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                        {instructor.name?.charAt(0) || 'I'}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white">{instructor.name}</h3>
                  <p className="text-sm text-blue-400 mb-2">Senior Instructor</p>
                  <p className="text-sm text-slate-400 line-clamp-2">{instructor.bio || 'Expert in their field with years of practical experience.'}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Platform Features</h2>
            <p className="text-slate-400 text-lg">Everything you need to succeed in one place.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', title: 'Extensive Library', desc: 'Access hundreds of courses covering programming, design, marketing, and more.' },
              { icon: Video, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', title: 'Live Interactive Classes', desc: 'Join live sessions, ask questions in real-time, and collaborate with your classmates.' },
              { icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', title: 'Industry Certificates', desc: 'Earn recognized certificates upon completion to showcase your new skills to employers.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/80 transition-colors group"
              >
                <div className={`w-14 h-14 rounded-xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={feature.color} size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900/30 border-t border-slate-800">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Student Success Stories</h2>
            <p className="text-slate-400 text-lg">Hear from our community of learners who transformed their careers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-950 p-8 rounded-3xl border border-slate-800 relative"
              >
                <Quote className="absolute top-6 right-6 text-slate-800" size={40} />
                <p className="text-slate-300 italic mb-8 relative z-10">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border border-slate-700" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <span className="text-xs text-blue-400">{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <p className="text-slate-400 text-lg mb-8">Can't find the answer you're looking for? Reach out to our customer support team.</p>
              <button className="px-6 py-3 bg-slate-900 border border-slate-700 hover:border-blue-500 text-white rounded-xl transition-colors font-medium">
                Contact Support
              </button>
            </div>
            <div className="lg:w-2/3 w-full flex flex-col gap-4">
              <FAQItem 
                question="How do I enroll in a course?" 
                answer="Simply browse our course catalog, click on the course you are interested in, and click the 'Enroll Now' button. You can pay securely using our integrated payment gateway." 
              />
              <FAQItem 
                question="Are the certificates recognized by employers?" 
                answer="Yes! Upon completing all modules and assignments in a course, you will receive an industry-recognized certificate that you can add to your resume or LinkedIn profile." 
              />
              <FAQItem 
                question="Do I get lifetime access to the courses I buy?" 
                answer="Absolutely. Once you purchase a course, you have lifetime access to its contents, including any future updates the instructor makes to the materials." 
              />
              <FAQItem 
                question="What if I have questions during the course?" 
                answer="Each course has a dedicated Q&A section where you can interact directly with the instructor and other students. Many courses also offer weekly live sessions for direct interaction." 
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-16 text-center max-w-5xl mx-auto shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Career?</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">Join thousands of students who are already learning and achieving their goals. Sign up today and get access to our platform.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="px-8 py-4 bg-white text-slate-950 hover:bg-slate-200 rounded-xl font-bold transition-all hover:-translate-y-1">
                Create Free Account
              </Link>
              <Link to="/courses" className="px-8 py-4 bg-slate-800 text-white hover:bg-slate-700 rounded-xl font-bold transition-all hover:-translate-y-1">
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
        <div className="container mx-auto px-6 lg:px-12 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center justify-center md:justify-start mb-6">
                <div className="inline-flex items-center bg-white px-4 py-2 rounded-2xl shadow-lg">
                  <img src="/logo.png" alt="BoiToi Logo" className="h-10 object-contain" />
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">Empowering learners worldwide with accessible, high-quality education and collaborative tools.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/courses" className="hover:text-blue-400 transition-colors">All Courses</Link></li>
                <li><Link to="/login" className="hover:text-blue-400 transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
            <p>© {new Date().getFullYear()} BoiToi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
