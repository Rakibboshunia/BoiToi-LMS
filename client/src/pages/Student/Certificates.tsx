import React from 'react';
import { Award, Download, ExternalLink, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Mock data – replace with useQuery(() => getMyCertificates())
const mockCertificates = [
  {
    id: 'c1',
    certificateId: 'CERT-A1B2C3D4',
    course: { title: 'Complete Web Development Bootcamp', thumbnail: '' },
    issuedAt: '2026-07-15',
  },
  {
    id: 'c2',
    certificateId: 'CERT-X9Y8Z7W6',
    course: { title: 'React & TypeScript Mastery', thumbnail: '' },
    issuedAt: '2026-06-28',
  },
];

const MyCertificates: React.FC = () => {
  if (mockCertificates.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">My Certificates</h1>
        <div className="bg-background border border-border rounded-xl p-16 shadow-sm text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <Award size={32} />
          </div>
          <h3 className="text-lg font-medium text-foreground">No certificates yet</h3>
          <p className="text-muted-foreground mt-1 mb-6">Complete a course to earn your first certificate.</p>
          <Link to="/courses" className="px-5 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Certificates</h1>
        <p className="text-muted-foreground mt-1">Your earned certifications. Share them with the world!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCertificates.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative bg-background border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Certificate Background Pattern */}
            <div className="h-32 bg-gradient-to-br from-primary/80 via-primary to-purple-600 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 left-2 w-24 h-24 border-4 border-white rounded-full" />
                <div className="absolute bottom-2 right-2 w-16 h-16 border-4 border-white rounded-full" />
              </div>
              <Award size={56} className="text-white opacity-90" strokeWidth={1.5} />
            </div>

            {/* Certificate Info */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Certificate of Completion</p>
                  <h3 className="font-bold text-lg text-foreground leading-tight">{cert.course.title}</h3>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Issued on</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{cert.certificateId}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    className="p-2.5 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                    title="Download Certificate"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    className="p-2.5 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                    title="Share Certificate"
                  >
                    <ExternalLink size={18} />
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
