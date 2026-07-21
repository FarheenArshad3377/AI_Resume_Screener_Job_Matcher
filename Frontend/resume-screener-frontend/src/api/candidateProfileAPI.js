import axiosInstance from './axiosInstance';

const candidateProfileAPI = {
  getCandidateProfile: async (candidateId) => {
    const res = await axiosInstance.get(`/recruiter/candidates/${candidateId}`);
    return res.data;
  },

  getCandidateApplications: async (candidateId, params = {}) => {
    const res = await axiosInstance.get(`/recruiter/candidates/${candidateId}/applications`, { params });
    return res.data;
  },

  updateCandidateStatus: async (candidateId, status) => {
    const res = await axiosInstance.put(`/recruiter/candidates/${candidateId}/status`, { status });
    return res.data;
  },

  addNote: async (candidateId, note) => {
    const res = await axiosInstance.post(`/recruiter/candidates/${candidateId}/notes`, { note });
    return res.data;
  },

  downloadResume: async (candidateId) => {
    const res = await axiosInstance.get(`/candidates/${candidateId}/resume`, { responseType: 'blob' });
    return res.data;
  }
};

export default candidateProfileAPI;