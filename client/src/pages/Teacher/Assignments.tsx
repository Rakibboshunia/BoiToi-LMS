import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const mockSubmissions = [
  { id: 's1', student: { name: 'Alice Rahman', avatar: '' }, assignment: 'Build a REST API', submittedAt: '2026-08-04', status: 'submitted', grade: null },
  { id: 's2', student: { name: 'Bob Karim',    avatar: '' }, assignment: 'Build a REST API', submittedAt: '2026-08-05', status: 'late',      grade: null },
  { id: 's3', student: { name: 'Carol Mitu',   avatar: '' }, assignment: 'React Final Project', submittedAt: '2026-08-11', status: 'graded', grade: 92 },
];

const statusConfig: Record<string, { label: string; bg: string; color: string; border: string }> = {
  submitted: { label: 'Submitted', bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  late:      { label: 'Late',      bg: 'rgba(239,68,68,0.12)',  color: '#f87171', border: 'rgba(239,68,68,0.25)' },
  graded:    { label: 'Graded',    bg: 'rgba(34,197,94,0.12)',  color: '#4ade80', border: 'rgba(34,197,94,0.25)' },
  pending:   { label: 'Pending',   bg: 'rgba(249,115,22,0.12)', color: '#fb923c', border: 'rgba(249,115,22,0.25)' },
};

const TeacherAssignments: React.FC = () => {
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [grades, setGrades] = useState<Record<string, string>>({});

  const handleGrade = (submissionId: string) => {
    const grade = grades[submissionId];
    if (!grade) return;
    toast.success(`Graded submission ${submissionId} with ${grade}/100 (Demo)`);
    setGradingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Assignments</h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Review and grade student submissions.</p>
        </div>
        <Link
          to="/teacher/courses"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #f97316, #8b5cf6)', boxShadow: '0 4px 15px rgba(249,115,22,0.3)' }}
        >
          <Plus size={16} /> Create Assignment
        </Link>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="p-4" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="font-semibold text-white">Recent Submissions</h2>
        </div>

        <div className="divide-y divide-white/10">
          {mockSubmissions.map((sub) => {
            const status = statusConfig[sub.status] || statusConfig.pending;
            const isGrading = gradingId === sub.id;

            return (
              <div key={sub.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors hover:bg-white/5">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                  {sub.student.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">{sub.student.name}</p>
                  <p className="text-sm truncate" style={{ color: 'rgba(255,255,255,0.6)' }}>{sub.assignment}</p>
                  <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <Clock size={12} />
                    {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
                    {status.label}
                    {sub.status === 'graded' && sub.grade !== null && ` · ${sub.grade}/100`}
                  </span>

                  {sub.status !== 'graded' && !isGrading && (
                    <button
                      onClick={() => setGradingId(sub.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)' }}
                    >
                      Grade
                    </button>
                  )}

                  {isGrading && (
                    <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10">
                      <input
                        type="number"
                        min={0} max={100}
                        placeholder="Score"
                        value={grades[sub.id] || ''}
                        onChange={(e) => setGrades({ ...grades, [sub.id]: e.target.value })}
                        className="w-20 px-3 py-1.5 text-sm rounded-lg text-white outline-none"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                      <button
                        onClick={() => handleGrade(sub.id)}
                        className="px-4 py-1.5 text-sm font-medium text-white rounded-lg transition-all"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setGradingId(null)}
                        className="px-3 py-1.5 text-sm transition-colors rounded-lg hover:bg-white/10"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignments;
