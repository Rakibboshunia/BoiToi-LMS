import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './routes/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import { DashboardLayout } from './components/layouts/DashboardLayout';
import StudentDashboard from './pages/Student/Dashboard';
import TeacherDashboard from './pages/Teacher/Dashboard';
import ManageCourses from './pages/Teacher/ManageCourses';
import CreateCourse from './pages/Teacher/CreateCourse';
import TeacherLiveSessions from './pages/Teacher/LiveSessions';
import CourseCatalog from './pages/Courses';
import CourseDetail from './pages/Courses/CourseDetail';
import StudentLiveClasses from './pages/Student/LiveClasses';
import LiveRoom from './pages/Shared/LiveRoom';
import CreateQuiz from './pages/Teacher/CreateQuiz';
import TakeQuiz from './pages/Student/TakeQuiz';
import CreateAssignment from './pages/Teacher/CreateAssignment';
import SubmitAssignment from './pages/Student/SubmitAssignment';
import StudentAssignments from './pages/Student/Assignments';
import TeacherAssignments from './pages/Teacher/Assignments';
import MyCertificates from './pages/Student/Certificates';
import Checkout from './pages/Checkout';
import MyCourses from './pages/Student/MyCourses';
import Payments from './pages/Student/Payments';
import Profile from './pages/Student/Profile';

// Create a client for react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: 'rgba(20,15,50,0.95)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(16px)',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '500',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              },
              success: {
                iconTheme: { primary: '#4ade80', secondary: 'transparent' },
                style: { borderColor: 'rgba(74,222,128,0.25)' },
              },
              error: {
                iconTheme: { primary: '#f87171', secondary: 'transparent' },
                style: { borderColor: 'rgba(248,113,113,0.25)' },
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<CourseCatalog />} />
            <Route path="/courses/:id" element={<CourseDetail />} />

            {/* Student Protected Routes */}
            <Route element={<PrivateRoute allowedRoles={['student']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/live" element={<StudentLiveClasses />} />
                <Route path="/student/assignments" element={<StudentAssignments />} />
                <Route path="/student/certificates" element={<MyCertificates />} />
                <Route path="/student/courses" element={<MyCourses />} />
                <Route path="/student/payments" element={<Payments />} />
                <Route path="/student/profile" element={<Profile />} />
              </Route>
              {/* Full-screen views (no sidebar) */}
              <Route path="/student/quiz/:id" element={<TakeQuiz />} />
              <Route path="/student/assignments/:id/submit" element={<SubmitAssignment />} />
            </Route>

            {/* Teacher Protected Routes */}
            <Route element={<PrivateRoute allowedRoles={['teacher']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/courses" element={<ManageCourses />} />
                <Route path="/teacher/courses/create" element={<CreateCourse />} />
                <Route path="/teacher/live" element={<TeacherLiveSessions />} />
                <Route path="/teacher/assignments" element={<TeacherAssignments />} />
                {/* Placeholder routes for sidebar links */}
                <Route path="/teacher/students" element={<div className="p-8 text-center text-white/60">My Students — Coming Soon</div>} />
                <Route path="/teacher/earnings" element={<div className="p-8 text-center text-white/60">Earnings — Coming Soon</div>} />
                <Route path="/teacher/settings" element={<div className="p-8 text-center text-white/60">Settings — Coming Soon</div>} />
              </Route>
              {/* Full-screen views (no sidebar) */}
              <Route path="/teacher/courses/:courseId/quiz/create" element={<CreateQuiz />} />
              <Route path="/teacher/courses/:courseId/assignment/create" element={<CreateAssignment />} />
            </Route>

            {/* Payment Checkout - accessible by authenticated students */}
            <Route element={<PrivateRoute allowedRoles={['student']} />}>
              <Route path="/checkout/:courseId" element={<Checkout />} />
            </Route>

            {/* Shared Protected Routes (Live Room) */}
            <Route element={<PrivateRoute allowedRoles={['student', 'teacher']} />}>
              <Route path="/live/:roomId" element={<LiveRoom />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<div className="p-8 text-center text-xl">404 - Page Not Found</div>} />
          </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
