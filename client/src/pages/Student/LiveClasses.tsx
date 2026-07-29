import React from 'react';
import { PlayCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentLiveClasses: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Live Classes</h1>
        <p className="text-muted-foreground mt-1">Join upcoming live sessions for your enrolled courses.</p>
      </div>

      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden p-8 text-center">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          <Calendar size={32} />
        </div>
        <h3 className="text-lg font-medium text-foreground">No upcoming sessions</h3>
        <p className="text-muted-foreground mt-1 mb-6">Your instructors haven't scheduled any live classes yet.</p>
        
        {/* For demo purposes, allow joining a test room */}
        <button 
          onClick={() => navigate('/live/test-room-123')}
          className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-md font-medium hover:bg-primary/5 transition shadow-sm"
        >
          <PlayCircle size={18} />
          Join Test Room
        </button>
      </div>
    </div>
  );
};

export default StudentLiveClasses;
