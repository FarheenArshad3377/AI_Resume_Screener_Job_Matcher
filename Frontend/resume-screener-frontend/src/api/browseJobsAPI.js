import axiosInstance from './axiosInstance';

const browseJobsAPI = {
  searchJobs: async (params = {}) => {
    const res = await axiosInstance.get('/jobs', { params });
    return res.data;
  },

  getJobById: async (jobId) => {
    const res = await axiosInstance.get(`/jobs/${jobId}`);
    return res.data;
  },

  applyToJob: async (jobId, application) => {
    const res = await axiosInstance.post(`/jobs/${jobId}/apply`, application);
    return res.data;
  }
};

export default browseJobsAPI;