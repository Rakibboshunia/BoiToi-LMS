import api from './api';

export const getMyPayments = async () => {
  const response = await api.get('/payments/my');
  return response.data;
};

export const initiatePayment = async (courseId: string) => {
  const response = await api.post('/payments/initiate', { courseId });
  return response.data;
};

export const paymentSuccess = async (paymentId: string, transactionId?: string) => {
  const response = await api.post('/payments/success', { paymentId, transactionId });
  return response.data;
};
