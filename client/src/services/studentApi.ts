import api from './api';

export const getStudentDashboardStats = async () => {
  const response = await api.get('/student/dashboard');
  return response.data;
};

export const getMyEnrolledCourses = async () => {
  const response = await api.get('/student/courses');
  return response.data;
};

export const getMyLiveClasses = async () => {
  const response = await api.get('/student/live-classes');
  return response.data;
};

export const getMyAssignments = async () => {
  const response = await api.get('/student/assignments');
  return response.data;
};
