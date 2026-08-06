import React, { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, Star, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStudentDashboard } from '../../services/dashboardApi';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const mockEnrolledCourses = [
  {
    id: 'course-1',
    title: 'Advanced Web Development 2026',
    instructor: 'Jane Doe',
    progress: 45,
    thumbnail: '',
    category: 'Web Development',
  },
  {
    id: 'course-2',
    title: 'UI/UX Design Masterclass',
    instructor: 'Alex Smith',
    progress: 12,
    thumbnail: '',
    category: 'System Design',
  },
];

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getStudentDashboard();
        if (response.success && response.data.enrolledCourses) {
          setCourses(response.data.enrolledCourses);
        } else if (!response.success) {
          toast.error(response.error || 'Failed to fetch enrolled courses');
        }
      } catch (error) {
        toast.error('Failed to fetch enrolled courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Courses</h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Pick up where you left off and continue learning.</p>
        </div>
        <Link
          to="/courses"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }}
        >
          <BookOpen size={16} /> Browse More Courses
        </Link>
      </div>

      {loading ? (
        <Loader message="Loading your courses..." />
      ) : courses.length === 0 ? (
        <div className="rounded-2xl p-16 flex flex-col items-center gap-4 text-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <BookOpen size={28} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <p className="font-semibold text-white mb-1">No enrolled courses</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>You haven't enrolled in any courses yet.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            >
              <div className="h-40 w-full relative bg-secondary flex items-center justify-center">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))' }}>
                    <PlayCircle size={40} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  </div>
                )}
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold backdrop-blur-md"
                  style={{ background: 'rgba(0,0,0,0.5)', color: 'white' }}>
                  {course.category}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-semibold text-white text-lg line-clamp-2 mb-1">{course.title}</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>by {course.instructor}</p>
                
                <div className="mt-auto space-y-3">
                  <div className="flex justify-between items-end mb-1 text-xs">
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>Overall Progress</span>
                    <span className="font-semibold" style={{ color: '#8b5cf6' }}>{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }} />
                  </div>
                  
                  <Link to={`/student/courses/${course._id}`} className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  >
                    Continue Learning <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
