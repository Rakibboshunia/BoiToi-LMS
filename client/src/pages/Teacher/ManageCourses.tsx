import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import { getCourses } from '../../services/courseApi';

const ManageCourses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['teacher-courses'],
    queryFn: () => getCourses(),
  });

  const courses = (data?.data || []).filter((c: any) =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cardStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Courses</h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Create, edit, and manage your course catalog.</p>
        </div>
        <Link
          to="/teacher/courses/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#f97316,#8b5cf6)', boxShadow: '0 4px 15px rgba(249,115,22,0.3)' }}
        >
          <Plus size={16} /> Create Course
        </Link>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        {/* Search bar */}
        <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => (e.currentTarget.style.border = '1px solid rgba(249,115,22,0.4)')}
              onBlur={e => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)')}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <div className="w-6 h-6 border-2 border-white/20 border-t-orange-400 rounded-full animate-spin mx-auto mb-3" />
            Loading courses...
          </div>
        ) : courses.length === 0 ? (
          <div className="p-16 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <BookOpen size={28} style={{ color: '#f97316' }} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-white mb-1">No courses yet</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Get started by creating your first course.</p>
            </div>
            <Link to="/teacher/courses/create"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#f97316,#8b5cf6)', boxShadow: '0 4px 15px rgba(249,115,22,0.3)' }}>
              <Plus size={16} /> Create Course
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <tr>
                  {['Course', 'Price', 'Status', 'Students', 'Actions'].map((h, i) => (
                    <th key={h} className={`px-5 py-3.5 font-medium text-xs uppercase tracking-wider ${i === 4 ? 'text-right' : 'text-left'}`}
                      style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map((course: any) => (
                  <tr key={course._id} className="transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                          style={{ background: 'rgba(255,255,255,0.06)' }}>
                          {course.thumbnail
                            ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            : <BookOpen size={18} style={{ color: 'rgba(255,255,255,0.3)' }} />}
                        </div>
                        <div>
                          <p className="font-medium text-white line-clamp-1">{course.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{course.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {course.isFree
                        ? <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>Free</span>
                        : <span className="text-sm font-medium text-white">${course.price}</span>}
                    </td>
                    <td className="px-5 py-4">
                      {course.isPublished
                        ? <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>Published</span>
                        : <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)' }}>Draft</span>}
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {course.enrollmentCount || 0}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded-lg transition-all" title="Edit"
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.15)'; e.currentTarget.style.color = '#f97316'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
                          <Edit size={16} />
                        </button>
                        <button className="p-2 rounded-lg transition-all" title="Delete"
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
                          <Trash2 size={16} />
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

export default ManageCourses;
