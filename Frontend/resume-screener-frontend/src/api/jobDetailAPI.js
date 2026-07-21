import axiosInstance from './axiosInstance';

export const jobDetailAPI = {
  // GET: /api/recruiter/jobs/{jobId}/details
  getJobDetails: async (jobId) => {
    const response = await axiosInstance.get(`/recruiter/jobs/${jobId}/details`);
    return response.data.data;
  },

  // GET: /api/recruiter/jobs/{jobId}/stats
  getJobStats: async (jobId) => {
    const response = await axiosInstance.get(`/recruiter/jobs/${jobId}/stats`);
    return response.data.data;
  },

  // POST: /api/recruiter/jobs/{jobId}/close
  closeJob: async (jobId) => {
    const response = await axiosInstance.post(`/recruiter/jobs/${jobId}/close`);
    return response.data.data;
  },

  // POST: /api/recruiter/jobs/{jobId}/reopen
  reopenJob: async (jobId) => {
    const response = await axiosInstance.post(`/recruiter/jobs/${jobId}/reopen`);
    return response.data.data;
  },

  // DELETE: /api/recruiter/jobs/{jobId}
  deleteJob: async (jobId) => {
    const response = await axiosInstance.delete(`/recruiter/jobs/${jobId}`);
    return response.data.data;
  }
};

export default jobDetailAPI;