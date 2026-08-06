import api from './api';

export const getStudentDashboardStats = async () => {
  const response = await api.get('/student/dashboard');
  return response.data;
};
