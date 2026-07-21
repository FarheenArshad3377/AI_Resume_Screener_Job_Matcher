import axiosInstance from './axiosInstance';

export const scoreApplication = async (applicationId) => {
  const response = await axiosInstance.post(`/applications/${applicationId}/score`);
  // 👆 ye C# backend se EXACTLY match karta hai!
  return response.data;
};

export const fetchApplicationById = async (id) => {
  const response = await axiosInstance.get(`/applications/${id}`);
  return response.data;
};

export const fetchApplicationsByJob = async (jobId) => {
  const response = await axiosInstance.get(`/applications/by-job/${jobId}`);
  return response.data;
};