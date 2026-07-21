import axiosInstance from './axiosInstance';

const companyProfileAPI = {
  getProfile: async () => {
    const res = await axiosInstance.get('/recruiter/company-profile');
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await axiosInstance.put('/recruiter/company-profile', profileData);
    return res.data;
  },

  uploadLogo: async (file) => {
    const fd = new FormData();
    fd.append('logo', file);
    const res = await axiosInstance.post('/recruiter/company-profile/logo', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};

export default companyProfileAPI;