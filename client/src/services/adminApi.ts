import api from './api';

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getAdminTeachers = async () => {
  const response = await api.get('/admin/teachers');
  return response.data;
};

export const getAdminCourses = async () => {
  const response = await api.get('/admin/courses');
  return response.data;
};

export const getAdminPayments = async () => {
  const response = await api.get('/admin/payments');
  return response.data;
};

// Actions
export const toggleUserStatus = async (id: string) => {
  const response = await api.put(`/admin/users/${id}/status`);
  return response.data;
};

export const toggleTeacherApproval = async (id: string) => {
  const response = await api.put(`/admin/teachers/${id}/approve`);
  return response.data;
};

export const toggleCourseStatus = async (id: string) => {
  const response = await api.put(`/admin/courses/${id}/status`);
  return response.data;
};

export const deleteCourse = async (id: string) => {
  const response = await api.delete(`/admin/courses/${id}`);
  return response.data;
};

