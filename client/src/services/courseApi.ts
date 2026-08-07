import api from './api';

export const getCourses = async (params: { search?: string; category?: string; level?: string } = {}) => {
  const response = await api.get('/courses', { params });
  return response.data;
};

export const getCourse = async (id: string) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const createCourse = async (courseData: any) => {
  const response = await api.post('/courses', courseData);
  return response.data;
};

export const updateCourse = async (id: string, courseData: any) => {
  const response = await api.put(`/courses/${id}`, courseData);
  return response.data;
};

export const createModule = async (courseId: string, moduleData: any) => {
  const response = await api.post(`/courses/${courseId}/modules`, moduleData);
  return response.data;
};

export const createLesson = async (moduleId: string, lessonData: any) => {
  const response = await api.post(`/courses/modules/${moduleId}/lessons`, lessonData);
  return response.data;
};
