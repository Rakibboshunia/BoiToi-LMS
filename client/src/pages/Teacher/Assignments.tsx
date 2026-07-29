import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, User, Download, Loader } from 'lucide-react';

// Mock data – replace with useQuery() in production
const mockSubmissions = [
  { id: 's1', student: { name: 'Alice Rahman', avatar: '' }, assignment: 'Build a REST API', submittedAt: '2026-08-04', status: 'submitted', grade: null },
  { id: 's2', student: { name: 'Bob Karim',    avatar: '' }, assignment: 'Build a REST API', submittedAt: '2026-08-05', status: 'late',      grade: null },
  { id: 's3', student: { name: 'Carol Mitu',   avatar: '' }, assignment: 'React Final Project', submittedAt: '2026-08-11', status: 'graded', grade: 92 },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  submitted: { label: 'Submitted', color: 'text-blue-700 bg-blue-100' },
  late:      { label: 'Late',      color: 'text-red-700 bg-red-100' },
  graded:    { label: 'Graded',    color: 'text-green-700 bg-green-100' },
  pending:   { label: 'Pending',   color: 'text-orange-700 bg-orange-100' },
};

const TeacherAssignments: React.FC = () => {
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [grades, setGrades] = useState<Record<string, string>>({});

  const handleGrade = (submissionId: string) => {
    const grade = grades[submissionId];
    if (!grade) return;
    alert(`Graded submission ${submissionId} with ${grade}/100 (Demo)`);
    setGradingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground mt-1">Review and grade student submissions.</p>
        </div>
        <Link
          to="/teacher/courses"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition"
        >
          <FileText size={18} />
          Create Assignment
        </Link>
      </div>

      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-secondary/20 border-b border-border">
          <h2 className="font-semibold">Recent Submissions</h2>
        </div>

        <div className="divide-y divide-border">
          {mockSubmissions.map((sub) => {
            const status = statusConfig[sub.status] || statusConfig.pending;
            const isGrading = gradingId === sub.id;

            return (
              <div key={sub.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                  {sub.student.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{sub.student.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{sub.assignment}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                    {status.label}
                    {sub.status === 'graded' && sub.grade !== null && ` · ${sub.grade}/100`}
                  </span>

                  {sub.status !== 'graded' && !isGrading && (
                    <button
                      onClick={() => setGradingId(sub.id)}
                      className="px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition"
                    >
                      Grade
                    </button>
                  )}

                  {isGrading && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0} max={100}
                        placeholder="Score"
                        value={grades[sub.id] || ''}
                        onChange={(e) => setGrades({ ...grades, [sub.id]: e.target.value })}
                        className="w-20 px-2 py-1.5 text-sm border border-input rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                      <button
                        onClick={() => handleGrade(sub.id)}
                        className="px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setGradingId(null)}
                        className="px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
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
