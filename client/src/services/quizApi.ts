import api from './api';

export const createQuiz = async (quizData: any) => {
  const response = await api.post('/quizzes', quizData);
  return response.data;
};

export const getQuizzesForCourse = async (courseId: string) => {
  const response = await api.get(`/quizzes/course/${courseId}`);
  return response.data;
};

export const getQuiz = async (quizId: string) => {
  const response = await api.get(`/quizzes/${quizId}`);
  return response.data;
};

export const submitQuizAttempt = async (quizId: string, answers: any, timeTaken: number) => {
  const response = await api.post(`/quizzes/${quizId}/attempt`, {
    answers,
    timeTaken
  });
  return response.data;
};
