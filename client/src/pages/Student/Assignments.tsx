import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

// Mock data – in production this would come from useQuery(() => getAssignmentsForCourse(courseId))
const mockAssignments = [
  { id: '1', title: 'Build a REST API', dueDate: '2026-08-05', submissionStatus: 'submitted', grade: null, maxScore: 100 },
  { id: '2', title: 'React Final Project', dueDate: '2026-08-12', submissionStatus: 'pending', grade: null, maxScore: 100 },
  { id: '3', title: 'Database Schema Design', dueDate: '2026-07-20', submissionStatus: 'graded', grade: 88, maxScore: 100 },
];

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending:    { label: 'Pending',   icon: Clock,        color: 'text-orange-600 bg-orange-100' },
  submitted:  { label: 'Submitted', icon: CheckCircle,  color: 'text-blue-600 bg-blue-100' },
  graded:     { label: 'Graded',    icon: CheckCircle,  color: 'text-green-600 bg-green-100' },
  late:       { label: 'Late',      icon: AlertCircle,  color: 'text-red-600 bg-red-100' },
};

const StudentAssignments: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
        <p className="text-muted-foreground mt-1">Track and submit your coursework.</p>
      </div>

      <div className="space-y-4">
        {mockAssignments.map((assignment) => {
          const status = statusConfig[assignment.submissionStatus] || statusConfig.pending;
          const StatusIcon = status.icon;
          const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.submissionStatus === 'pending';

          return (
            <div key={assignment.id} className="bg-background border border-border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <FileText size={24} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-foreground">{assignment.title}</h3>
                <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-muted-foreground items-center">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {isOverdue && (
                    <span className="text-red-600 font-medium">· Overdue!</span>
                  )}
                  <span>Max Score: {assignment.maxScore}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${status.color}`}>
                  <StatusIcon size={13} />
                  {status.label}
                  {assignment.submissionStatus === 'graded' && assignment.grade !== null && ` · ${assignment.grade}/${assignment.maxScore}`}
                </span>

                {assignment.submissionStatus === 'pending' && (
                  <Link
                    to={`/student/assignments/${assignment.id}/submit`}
                    className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition"
                  >
                    Submit
                  </Link>
                )}
                {assignment.submissionStatus === 'submitted' && (
                  <Link
                    to={`/student/assignments/${assignment.id}/submit`}
                    className="px-4 py-2 border border-input text-sm font-medium rounded-lg hover:bg-secondary transition"
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
