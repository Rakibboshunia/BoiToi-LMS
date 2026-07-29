import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Users, DollarSign, Star } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Courses', value: '0', icon: <BookOpen className="text-blue-500" /> },
    { label: 'Total Students', value: '0', icon: <Users className="text-purple-500" /> },
    { label: 'Total Earnings', value: '$0', icon: <DollarSign className="text-green-500" /> },
    { label: 'Avg Rating', value: '0.0', icon: <Star className="text-orange-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">Here is the overview of your teaching business.</p>
        </div>
        
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition shadow-sm">
          Create New Course
        </button>
      </div>

      {!user?.isApproved && (
        <div className="bg-amber-100 border border-amber-200 text-amber-800 px-4 py-3 rounded-md text-sm font-medium">
          Your instructor profile is currently under review. You can create courses, but they cannot be published until you are approved.
        </div>
      )}

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background border border-border rounded-xl p-6 shadow-sm h-80 flex flex-col">
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Enrollments</h2>
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
            No recent enrollments.
          </div>
        </div>
        
        <div className="bg-background border border-border rounded-xl p-6 shadow-sm h-80 flex flex-col">
          <h2 className="text-lg font-bold text-foreground mb-4">Earnings Overview</h2>
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
            Chart placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
