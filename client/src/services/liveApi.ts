import api from './api';

export const getLiveClasses = async (courseId: string) => {
  const response = await api.get(`/live/${courseId}`);
  return response.data;
};

export const scheduleLiveClass = async (liveData: any) => {
  const response = await api.post('/live', liveData);
  return response.data;
};

export const updateLiveStatus = async (id: string, status: string, recordingUrl?: string) => {
  const payload: any = { status };
  if (recordingUrl) payload.recordingUrl = recordingUrl;
  const response = await api.put(`/live/${id}/status`, payload);
  return response.data;
};
