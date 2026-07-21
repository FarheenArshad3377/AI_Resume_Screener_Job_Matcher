import axiosInstance from './axiosInstance';

const candidateRankingAPI = {
  getJobCandidates: async (jobId, params = {}) => {
    const response = await axiosInstance.get(`/recruiter/jobs/${jobId}/candidates`, { params });
    return response.data;
  },

  getCandidateScore: async (jobId, candidateId) => {
    const response = await axiosInstance.get(`/recruiter/jobs/${jobId}/candidates/${candidateId}/score`);
    return response.data;
  },

  updateCandidateStatus: async (jobId, candidateId, status) => {
    const response = await axiosInstance.put(`/recruiter/jobs/${jobId}/candidates/${candidateId}/status`, { status });
    return response.data;
  },

  rankCandidates: async (jobId) => {
    const response = await axiosInstance.post(`/recruiter/jobs/${jobId}/rank`);
    return response.data;
  },

  exportCandidatesCSV: async (jobId) => {
    const response = await axiosInstance.get(`/recruiter/jobs/${jobId}/candidates/export`, {
      params: { format: 'csv' },
      responseType: 'blob'
    });
    return response.data;
  },

  downloadResume: async (candidateId) => {
    const response = await axiosInstance.get(`/candidates/${candidateId}/resume`, { responseType: 'blob' });
    return response.data;
  },
  
};

export default candidateRankingAPI;