import React, { useState, useEffect } from 'react';
import { PlayCircle, Calendar, Video, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStudentDashboard } from '../../services/dashboardApi';
import { getLiveClasses } from '../../services/liveApi';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const StudentLiveClasses: React.FC = () => {
  const navigate = useNavigate();
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllLiveClasses = async () => {
      try {
        const dashRes = await getStudentDashboard();
        if (dashRes.success && dashRes.data.enrolledCourses) {
          const courses = dashRes.data.enrolledCourses;
          let allLiveClasses: any[] = [];
          
          for (const course of courses) {
            try {
              const liveRes = await getLiveClasses(course._id);
              if (liveRes.success && liveRes.data) {
                // Attach course info
                const classesWithCourse = liveRes.data.map((c: any) => ({
                  ...c,
                  courseTitle: course.title
                }));
                allLiveClasses = [...allLiveClasses, ...classesWithCourse];
              }
            } catch (err) {
              console.error(`Failed to fetch live classes for course ${course._id}:`, err);
            }
          }
          
          // Sort by scheduledAt
          allLiveClasses.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
          setLiveSessions(allLiveClasses);
        } else if (!dashRes.success) {
          toast.error(dashRes.error || 'Failed to fetch enrolled courses');
        }
      } catch (error) {
        toast.error('Failed to fetch live classes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllLiveClasses();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Live Classes</h1>
        <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Join upcoming live sessions for your enrolled courses.</p>
      </div>

      {loading ? (
        <Loader message="Loading upcoming sessions..." />
      ) : liveSessions.length === 0 ? (
        <div className="rounded-2xl p-16 text-center flex flex-col items-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          
          {/* Empty State Icon */}
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 relative"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="absolute top-0 right-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <Calendar size={36} style={{ color: '#8b5cf6' }} />
          </div>

          <h3 className="text-xl font-semibold text-white mb-2">No upcoming sessions</h3>
          <p className="max-w-md mb-8 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Your instructors haven't scheduled any live classes yet. When they do, they will appear right here.
          </p>
          
          {/* Test Room Button */}
          <div className="p-5 rounded-2xl w-full max-w-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <p className="text-xs mb-4 uppercase tracking-wider font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>Developer Demo</p>
            <button 
              onClick={() => navigate('/live/test-room-123')}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }}
            >
              <Video size={18} /> Join Test Room
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveSessions.map((session) => (
            <div key={session._id} className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                    session.status === 'ongoing' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                    session.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {session.status === 'ongoing' ? 'LIVE NOW' : session.status.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-white/50">
                    <Clock size={12} />
                    <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-white text-lg line-clamp-2 mb-1">{session.title}</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>{session.courseTitle}</p>
                <p className="text-xs text-white/60 line-clamp-3 mb-6">{session.description}</p>
                
                <div className="mt-auto">
                  {session.status === 'completed' && session.recordingUrl ? (
                    <a 
                      href={session.recordingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                    >
                      <PlayCircle size={18} /> Watch Recording
                    </a>
                  ) : (
                    <button 
                      onClick={() => navigate(`/live/${session.roomId}`)}
                      disabled={session.status === 'completed'}
                      className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all ${
                        session.status === 'completed' ? 'opacity-50 cursor-not-allowed bg-white/10' : 'hover:-translate-y-0.5'
                      }`}
                      style={session.status !== 'completed' ? { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' } : {}}
                    >
                      <Video size={18} /> {session.status === 'completed' ? 'Session Ended' : 'Join Session'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentLiveClasses;
