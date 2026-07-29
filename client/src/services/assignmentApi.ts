import api from './api';

export const createAssignment = async (assignmentData: any) => {
  const response = await api.post('/assignments', assignmentData);
  return response.data;
};

export const getAssignmentsForCourse = async (courseId: string) => {
  const response = await api.get(`/assignments/course/${courseId}`);
  return response.data;
};

export const submitAssignment = async (assignmentId: string, submissionData: any) => {
  const response = await api.post(`/assignments/${assignmentId}/submit`, submissionData);
  return response.data;
};

export const gradeSubmission = async (submissionId: string, gradingData: any) => {
  const response = await api.put(`/assignments/submissions/${submissionId}/grade`, gradingData);
  return response.data;
};
