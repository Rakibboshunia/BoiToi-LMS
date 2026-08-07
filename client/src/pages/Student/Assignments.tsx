import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import { getMyAssignments } from '../../services/studentApi';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const statusConfig: Record<string, { label: string; icon: React.ElementType; bg: string; color: string; border: string }> = {
  pending:     { label: 'Pending',     icon: Clock,        bg: 'rgba(249,115,22,0.12)', color: '#fb923c', border: 'rgba(249,115,22,0.25)' },
  submitted:   { label: 'Submitted',   icon: CheckCircle,  bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  graded:      { label: 'Graded',      icon: CheckCircle,  bg: 'rgba(34,197,94,0.12)',  color: '#4ade80', border: 'rgba(34,197,94,0.25)' },
  late:        { label: 'Late',        icon: AlertCircle,  bg: 'rgba(239,68,68,0.12)',  color: '#f87171', border: 'rgba(239,68,68,0.25)' },
  resubmitted: { label: 'Resubmitted', icon: CheckCircle,  bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
};

const StudentAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await getMyAssignments();
        if (res.success) {
          setAssignments(res.data);
        } else {
          toast.error(res.error || 'Failed to fetch assignments');
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.error || 'Failed to fetch assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const filtered = filter === 'all'
    ? assignments
    : assignments.filter((a) => a.submissionStatus === filter);

  const filters = ['all', 'pending', 'submitted', 'graded', 'late'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Assignments</h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Track and submit your coursework.</p>
        </div>
        {!loading && assignments.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} style={{ color: 'rgba(255,255,255,0.35)' }} />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                style={filter === f
                  ? { background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: 'white' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
                }
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          <Loader message="Loading assignments..." />
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl p-16 text-center flex flex-col items-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <FileText size={28} style={{ color: '#a78bfa' }} />
            </div>
            <p className="font-semibold text-white mb-1">No assignments found</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {filter === 'all'
                ? "You don't have any assignments in your enrolled courses."
                : `No ${filter} assignments found.`}
            </p>
          </div>
        ) : filtered.map((assignment) => {
          const status = statusConfig[assignment.submissionStatus] || statusConfig.pending;
          const StatusIcon = status.icon;
          const dueDate = new Date(assignment.dueDate);
          const isOverdue = dueDate < new Date() && assignment.submissionStatus === 'pending';

          return (
            <div
              key={assignment._id}
              className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'}` }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <FileText size={22} style={{ color: '#a78bfa' }} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white">{assignment.title}</h3>
                <p className="text-xs text-white/50 mb-1.5">{assignment.courseTitle}</p>
                <div className="flex flex-wrap gap-3 items-center text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    Due: {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {isOverdue && <span className="font-semibold" style={{ color: '#f87171' }}>· Overdue!</span>}
                  <span>Max: {assignment.maxScore} pts</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
                  <StatusIcon size={12} />
                  {status.label}
                  {assignment.submissionStatus === 'graded' && assignment.submissionGrade != null
                    && ` · ${assignment.submissionGrade}/${assignment.maxScore}`}
                </span>

                {(assignment.submissionStatus === 'pending' || assignment.submissionStatus === 'late') && (
                  <Link
                    to={`/student/assignments/${assignment._id}/submit`}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}
                  >
                    Submit
                  </Link>
                )}
                {(assignment.submissionStatus === 'submitted' || assignment.submissionStatus === 'resubmitted') && (
                  <Link
                    to={`/student/assignments/${assignment._id}/submit`}
                    className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
                  >
                    Re-submit
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentAssignments;
