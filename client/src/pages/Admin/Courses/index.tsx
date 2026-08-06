import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Search, MoreVertical, CheckCircle2, XCircle, Users, Power, Trash2 } from 'lucide-react';
import { getAdminCourses, toggleCourseStatus, deleteCourse } from '../../../services/adminApi';
import { cn } from '../../../utils/cn';

const AdminCourses: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: getAdminCourses,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleCourseStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
    },
  });

  const handleToggleStatus = (id: string) => {
    if (window.confirm('Are you sure you want to change this course\'s publish status?')) {
      toggleStatusMutation.mutate(id);
    }
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Are you absolutely sure you want to delete this course? This action cannot be undone.')) {
      deleteCourseMutation.mutate(id);
    }
  };

  const courses = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="text-violet-400" size={24} />
            Course Management
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Review and manage all courses on the platform.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="w-full sm:w-64 bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
          />
        </div>
      </motion.div>

      {/* Courses Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4 font-medium">Course Title</th>
                <th className="px-6 py-4 font-medium">Instructor</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading courses...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-400">Failed to load courses.</td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No courses found.</td>
                </tr>
              ) : (
                courses.map((course: any, index: number) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={course._id} 
                    className="hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-10 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              <BookOpen size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200 group-hover:text-violet-400 transition-colors line-clamp-1">{course.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Users size={12} /> {course.enrolledCount || 0} enrolled
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-300">{course.teacher?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{course.teacher?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                      {course.price === 0 ? 'Free' : `$${course.price}`}
                    </td>
                    <td className="px-6 py-4">
                      {course.isPublished ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1 w-max">
                          <CheckCircle2 size={14} /> Published
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-500/10 text-slate-400 border-slate-500/20 flex items-center gap-1 w-max">
                          <XCircle size={14} /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleToggleStatus(course._id)}
                          disabled={toggleStatusMutation.isPending}
                          className={cn(
                            "p-2 rounded-lg transition-colors flex items-center gap-2 text-sm",
                            course.isPublished 
                              ? "text-slate-400 hover:bg-slate-500/10" 
                              : "text-emerald-400 hover:bg-emerald-500/10"
                          )}
                          title={course.isPublished ? "Unpublish Course" : "Publish Course"}
                        >
                          <Power size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course._id)}
                          disabled={deleteCourseMutation.isPending}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminCourses;
