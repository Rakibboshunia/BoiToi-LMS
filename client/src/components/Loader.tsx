import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-t-2 border-r-2"
          style={{ borderColor: '#f97316', filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.6))' }}
        />
        {/* Inner reverse spinning ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute w-12 h-12 rounded-full border-b-2 border-l-2"
          style={{ borderColor: '#8b5cf6', filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.6))' }}
        />
        {/* Center icon */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
        >
          <Sparkles size={18} style={{ color: '#fff' }} />
        </motion.div>
      </div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium tracking-wide"
          style={{
            background: 'linear-gradient(90deg, #f97316, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 10px rgba(249,115,22,0.2)'
          }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(15,12,41,0.8)', backdropFilter: 'blur(8px)' }}>
        {content}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center min-h-[250px]">
      {content}
    </div>
  );
};

export default Loader;
