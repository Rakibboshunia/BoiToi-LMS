import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Users, Video, ArrowRight, Sparkles } from 'lucide-react';

const floatingIcons = [
  { Icon: BookOpen, top: '20%', left: '10%', delay: 0 },
  { Icon: GraduationCap, top: '15%', right: '15%', delay: 1 },
  { Icon: Users, bottom: '25%', left: '15%', delay: 2 },
  { Icon: Video, bottom: '30%', right: '10%', delay: 1.5 },
];

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-slate-700/50 hidden md:block"
          style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          <item.Icon size={48} />
        </motion.div>
      ))}

      <motion.div 
        className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-blue-400 text-sm font-medium backdrop-blur-sm"
        >
          <Sparkles size={16} />
          <span>The next-generation learning experience</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Welcome to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            LMS Platform
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
          A comprehensive learning management system with student and teacher dashboards, live classes, quizzes, and a collaborative environment.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
          <Link to="/login" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          
          <Link to="/register" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-8 py-4 bg-slate-900/50 border border-slate-700 text-slate-300 rounded-xl font-semibold backdrop-blur-sm transition-all"
            >
              Create Account
            </motion.button>
          </Link>
        </div>

        {/* Minimal stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-slate-500"
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-slate-300">10k+</span>
            <span className="text-sm mt-1">Students</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-slate-300">500+</span>
            <span className="text-sm mt-1">Courses</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-slate-300">50+</span>
            <span className="text-sm mt-1">Instructors</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-slate-300">24/7</span>
            <span className="text-sm mt-1">Support</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
