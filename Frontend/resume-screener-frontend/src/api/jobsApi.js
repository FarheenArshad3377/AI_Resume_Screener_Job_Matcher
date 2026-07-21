import axiosInstance from './axiosInstance';

export const fetchJobs = async () => {
  const response = await axiosInstance.get('/jobs');
  return response.data;
};

export const fetchJobById = async (id) => {
  const response = await axiosInstance.get(`/jobs/${id}`);
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await axiosInstance.post('/jobs', jobData);
  return response.data;
};

export const updateJob = async (id, jobData) => {
  const response = await axiosInstance.put(`/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id) => {
  await axiosInstance.delete(`/jobs/${id}`);
  return id;
};
