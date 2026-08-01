import React, { useState, useEffect } from 'react';
import { Award, Download, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getMyCertificates } from '../../services/certificateApi';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const MyCertificates: React.FC = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await getMyCertificates();
        if (res.success) {
          setCertificates(res.data);
        } else {
          toast.error(res.error || 'Failed to fetch certificates');
        }
      } catch (error) {
        toast.error('Failed to fetch certificates');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Certificates</h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Your earned certifications. Share them with the world!</p>
        </div>
        <Loader message="Loading certificates..." />
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Certificates</h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Your earned certifications. Share them with the world!</p>
        </div>
        <div className="rounded-2xl p-16 flex flex-col items-center gap-4 text-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(249,115,22,0.2)' }}>
            <Award size={28} style={{ color: '#f97316' }} />
          </div>
          <div>
            <p className="font-semibold text-white mb-1">No certificates yet</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Complete a course to earn your first certificate.</p>
          </div>
          <Link to="/courses"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#f97316,#8b5cf6)', boxShadow: '0 4px 15px rgba(249,115,22,0.3)' }}>
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Certificates</h1>
        <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Your earned certifications. Share them with the world!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert, idx) => (
          <motion.div
            key={cert._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
          >
            {/* Certificate Header / Pattern */}
            <div className="h-32 relative overflow-hidden flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.8), rgba(139,92,246,0.9))' }}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 left-2 w-24 h-24 border-4 border-white rounded-full" />
                <div className="absolute bottom-2 right-2 w-16 h-16 border-4 border-white rounded-full" />
              </div>
              <Award size={50} className="text-white opacity-90" strokeWidth={1.5} />
            </div>

            {/* Certificate Info */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#f97316' }}>
                  Certificate of Completion
                </p>
                <h3 className="font-bold text-lg text-white leading-tight">{cert.course.title}</h3>
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Issued on</p>
                  <p className="text-sm font-medium text-white mt-0.5">
                    {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs font-mono mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>ID: {cert.certificateId}</p>
                </div>

                <div className="flex gap-2">
                  <button className="p-2.5 rounded-lg transition-all" title="Download Certificate"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                    <Download size={16} />
                  </button>
                  <button className="p-2.5 rounded-lg transition-all" title="Share Certificate"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyCertificates;
