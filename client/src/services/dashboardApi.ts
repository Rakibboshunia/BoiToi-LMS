import api from './api';

export const getTeacherDashboard = async () => {
  const response = await api.get('/dashboard/teacher');
  return response.data;
};

export const getStudentDashboard = async () => {
  const response = await api.get('/dashboard/student');
  return response.data;
};
