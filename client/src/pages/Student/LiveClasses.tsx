import React, { useState, useEffect } from 'react';
import { PlayCircle, Calendar, Video, Clock, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyLiveClasses } from '../../services/studentApi';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const StudentLiveClasses: React.FC = () => {
  const navigate = useNavigate();
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'ongoing' | 'completed'>('all');

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        const res = await getMyLiveClasses();
        if (res.success) {
          setLiveSessions(res.data);
        } else {
          toast.error(res.error || 'Failed to fetch live classes');
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.error || 'Failed to fetch live classes');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveClasses();
  }, []);

  const filtered = filter === 'all'
    ? liveSessions
    : liveSessions.filter((s) => s.status === filter);

  const statusCfg: Record<string, { label: string; bg: string; color: string; border: string }> = {
    scheduled: { label: 'Scheduled', bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
    ongoing:   { label: 'LIVE NOW',   bg: 'rgba(239,68,68,0.15)',  color: '#f87171', border: 'rgba(239,68,68,0.3)' },
    completed: { label: 'Completed',  bg: 'rgba(34,197,94,0.15)',  color: '#4ade80', border: 'rgba(34,197,94,0.3)' },
    cancelled: { label: 'Cancelled',  bg: 'rgba(100,116,139,0.15)',color: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
  };

  const tabs = ['all', 'scheduled', 'ongoing', 'completed'] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Live Classes</h1>
        <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Join upcoming live sessions for your enrolled courses.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all"
            style={filter === tab
              ? { background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: 'white' }
              : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader message="Loading upcoming sessions..." />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-16 text-center flex flex-col items-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 relative"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="absolute top-0 right-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <Calendar size={36} style={{ color: '#8b5cf6' }} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No sessions found</h3>
          <p className="max-w-md mb-8 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {filter === 'all'
              ? "Your instructors haven't scheduled any live classes yet. When they do, they will appear right here."
              : `No ${filter} sessions found.`}
          </p>

          {/* Demo test room */}
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
          {filtered.map((session) => {
            const cfg = statusCfg[session.status] || statusCfg.scheduled;
            const scheduledDate = new Date(session.scheduledAt);

            return (
              <div key={session._id} className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold`}
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                      {session.status === 'ongoing' && <Radio size={10} className="animate-pulse" />}
                      {cfg.label}
                    </span>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      <Clock size={12} />
                      <span>{scheduledDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-white text-lg line-clamp-2 mb-1">{session.title}</h3>
                  <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{session.course?.title}</p>
                  <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {session.duration ? ` · ${session.duration} mins` : ''}
                  </p>
                  {session.description && (
                    <p className="text-xs text-white/50 line-clamp-2 mb-4">{session.description}</p>
                  )}

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
                        disabled={session.status === 'completed' || session.status === 'cancelled'}
                        className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all ${
                          session.status === 'completed' || session.status === 'cancelled'
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:-translate-y-0.5'
                        }`}
                        style={
                          session.status !== 'completed' && session.status !== 'cancelled'
                            ? { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }
                            : { background: 'rgba(255,255,255,0.07)' }
                        }
                      >
                        <Video size={18} />
                        {session.status === 'ongoing' ? 'Join Now' :
                         session.status === 'completed' ? 'Session Ended' :
                         session.status === 'cancelled' ? 'Cancelled' : 'Join Session'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentLiveClasses;
