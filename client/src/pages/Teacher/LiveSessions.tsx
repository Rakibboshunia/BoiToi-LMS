import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Plus, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const LiveSessions: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartInstantMeeting = () => {
    // In a real app, this would hit the backend to create a LiveClass record
    // For demo purposes, we'll just generate a room ID and jump in
    const roomId = `lms-room-${uuidv4().substring(0, 8)}`;
    navigate(`/live/${roomId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Sessions</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage your live classes.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleStartInstantMeeting}
            className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-md font-medium hover:bg-primary/5 transition shadow-sm"
          >
            <PlayCircle size={18} />
            Instant Meeting
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition shadow-sm">
            <Plus size={18} />
            Schedule Class
          </button>
        </div>
      </div>

      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden p-8 text-center">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          <Calendar size={32} />
        </div>
        <h3 className="text-lg font-medium text-foreground">No upcoming sessions</h3>
        <p className="text-muted-foreground mt-1 mb-6">You don't have any live classes scheduled for the future.</p>
      </div>
    </div>
  );
};

export default LiveSessions;
