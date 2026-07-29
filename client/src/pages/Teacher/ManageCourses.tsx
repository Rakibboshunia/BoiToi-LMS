import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, MoreVertical } from 'lucide-react';
import { getCourses } from '../../services/courseApi';
import { useAuth } from '../../context/AuthContext';

const ManageCourses: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch courses (In a real app, you'd filter by teacher ID on the backend, 
  // but for now we'll just fetch all and assume the backend handles it or we filter here)
  const { data, isLoading } = useQuery({
    queryKey: ['teacher-courses'],
    queryFn: () => getCourses(),
  });

  const courses = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Courses</h1>
          <p className="text-muted-foreground mt-1">Create, edit, and manage your course catalog.</p>
        </div>
        
        <Link 
          to="/teacher/courses/create" 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition shadow-sm"
        >
          <Plus size={18} />
          Create Course
        </Link>
      </div>

      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/20">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <BookOpen size={32} />
            </div>
            <h3 className="text-lg font-medium text-foreground">No courses yet</h3>
            <p className="text-muted-foreground mt-1 mb-6">Get started by creating your first course.</p>
            <Link 
              to="/teacher/courses/create" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition shadow-sm"
            >
              <Plus size={18} />
              Create Course
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/30 text-muted-foreground border-b border-border">
                <tr>
                  <th className="font-medium p-4">Course</th>
                  <th className="font-medium p-4">Price</th>
                  <th className="font-medium p-4">Status</th>
                  <th className="font-medium p-4">Students</th>
                  <th className="font-medium p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {courses.map((course: any) => (
                  <tr key={course._id} className="hover:bg-secondary/10 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-secondary rounded-md overflow-hidden shrink-0">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">{course.title}</p>
                          <p className="text-xs text-muted-foreground">{course.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {course.isFree ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Free</span>
                      ) : (
                        <span className="font-medium">${course.price}</span>
                      )}
                    </td>
                    <td className="p-4">
                      {course.isPublished ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Published</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Draft</span>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {course.enrollmentCount || 0}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="More">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Also import BookOpen for the empty state
import { BookOpen } from 'lucide-react';

export default ManageCourses;
