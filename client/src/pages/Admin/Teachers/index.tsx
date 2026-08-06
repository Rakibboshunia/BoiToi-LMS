import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { GraduationCap, Search, MoreVertical, Mail, CheckCircle2, XCircle, Clock, CheckSquare, XSquare, Power } from 'lucide-react';
import { getAdminTeachers, toggleTeacherApproval, toggleUserStatus } from '../../../services/adminApi';
import { cn } from '../../../utils/cn';

const AdminTeachers: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminTeachers'],
    queryFn: getAdminTeachers,
  });

  const toggleApprovalMutation = useMutation({
    mutationFn: toggleTeacherApproval,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTeachers'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTeachers'] });
    },
  });

  const handleToggleApproval = (id: string) => {
    if (window.confirm('Are you sure you want to change this teacher\'s approval status?')) {
      toggleApprovalMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id: string) => {
    if (window.confirm('Are you sure you want to change this teacher\'s account status?')) {
      toggleStatusMutation.mutate(id);
    }
  };

  const teachers = data?.data || [];

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
            <GraduationCap className="text-emerald-400" size={24} />
            Teacher Management
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Manage and approve teacher accounts.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search teachers..." 
            className="w-full sm:w-64 bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
      </motion.div>

      {/* Teachers Table */}
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
                <th className="px-6 py-4 font-medium">Teacher</th>
                <th className="px-6 py-4 font-medium">Approval Status</th>
                <th className="px-6 py-4 font-medium">Account Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading teachers...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-400">Failed to load teachers.</td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No teachers found.</td>
                </tr>
              ) : (
                teachers.map((teacher: any, index: number) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={teacher._id} 
                    className="hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/10">
                          {teacher.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">{teacher.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail size={12} /> {teacher.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {teacher.isApproved ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1 w-max">
                          <CheckCircle2 size={14} /> Approved
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-amber-500/10 text-amber-400 border-amber-500/20 flex items-center gap-1 w-max">
                          <Clock size={14} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {teacher.isActive ? (
                        <div className="text-slate-300 text-sm">Active</div>
                      ) : (
                        <div className="text-red-400 text-sm">Inactive</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(teacher.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleToggleApproval(teacher._id)}
                          disabled={toggleApprovalMutation.isPending}
                          className={cn(
                            "p-2 rounded-lg transition-colors flex items-center gap-2 text-sm",
                            teacher.isApproved 
                              ? "text-amber-400 hover:bg-amber-500/10" 
                              : "text-emerald-400 hover:bg-emerald-500/10"
                          )}
                          title={teacher.isApproved ? "Revoke Approval" : "Approve"}
                        >
                          {teacher.isApproved ? <XSquare size={16} /> : <CheckSquare size={16} />}
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(teacher._id)}
                          disabled={toggleStatusMutation.isPending}
                          className={cn(
                            "p-2 rounded-lg transition-colors flex items-center gap-2 text-sm",
                            teacher.isActive 
                              ? "text-red-400 hover:bg-red-500/10" 
                              : "text-slate-400 hover:bg-slate-500/10"
                          )}
                          title={teacher.isActive ? "Deactivate Account" : "Activate Account"}
                        >
                          <Power size={16} />
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

export default AdminTeachers;
