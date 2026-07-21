import axiosInstance from './axiosInstance';

const myApplicationsAPI = {
  getMyApplications: async (params = {}) => {
    const res = await axiosInstance.get('/candidates/me/applications', { params });
    return res.data;
  },

  getApplicationById: async (applicationId) => {
    const res = await axiosInstance.get(`/candidates/me/applications/${applicationId}`);
    return res.data;
  },

  withdrawApplication: async (applicationId) => {
    const res = await axiosInstance.post(`/candidates/me/applications/${applicationId}/withdraw`);
    return res.data;
  },

  downloadOfferLetter: async (applicationId) => {
    const res = await axiosInstance.get(`/candidates/me/applications/${applicationId}/offer`, { responseType: 'blob' });
    return res.data;
  },

  scoreApplication: async (applicationId) => {
    const res = await axiosInstance.post(`/applications/${applicationId}/score`);
    return res.data;
  }
};

export default myApplicationsAPI;