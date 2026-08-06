import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Plus, Calendar, Video } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const LiveSessions: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartInstantMeeting = () => {
    const roomId = `lms-room-${uuidv4().substring(0, 8)}`;
    navigate(`/live/${roomId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Sessions</h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Schedule and manage your live classes.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleStartInstantMeeting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}
          >
            <Video size={16} /> Instant Meeting
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #f97316, #8b5cf6)', boxShadow: '0 4px 15px rgba(249,115,22,0.3)' }}
          >
            <Plus size={16} /> Schedule Class
          </button>
        </div>
      </div>

      <div className="rounded-2xl p-16 text-center flex flex-col items-center"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <Calendar size={36} style={{ color: '#8b5cf6' }} />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No upcoming sessions</h3>
        <p className="max-w-md text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          You don't have any live classes scheduled for the future. Start an instant meeting or schedule one to connect with students.
        </p>
      </div>
    </div>
  );
};

export default LiveSessions;
