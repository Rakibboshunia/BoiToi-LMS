import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Award, PlayCircle, Clock } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Enrolled Courses', value: '0', icon: <BookOpen className="text-blue-500" /> },
    { label: 'Completed', value: '0', icon: <Award className="text-green-500" /> },
    { label: 'Live Classes', value: '0', icon: <PlayCircle className="text-purple-500" /> },
    { label: 'Hours Learned', value: '0', icon: <Clock className="text-orange-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground mt-1">Here is what's happening with your learning progress today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-background border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background border border-border rounded-xl p-6 shadow-sm h-80 flex flex-col">
          <h2 className="text-lg font-bold text-foreground mb-4">Continue Learning</h2>
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
            You haven't enrolled in any courses yet.
          </div>
        </div>
        
        <div className="bg-background border border-border rounded-xl p-6 shadow-sm h-80 flex flex-col">
          <h2 className="text-lg font-bold text-foreground mb-4">Upcoming Live Classes</h2>
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
            No upcoming classes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
