import api from './api';

export const getMyCertificates = async () => {
  const response = await api.get('/certificates/my');
  return response.data;
};
