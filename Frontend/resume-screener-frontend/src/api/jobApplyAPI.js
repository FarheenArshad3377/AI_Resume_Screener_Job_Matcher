import axiosInstance from './axiosInstance';

const jobApplyAPI = {
  // Get Job Details
  getJobForApply: async (jobId) => {
    const res = await axiosInstance.get(`/jobs/${jobId}`);
    return res.data;
  },

  // Apply for Job
  applyToJob: async (applicationData) => {
    const res = await axiosInstance.post(
      '/candidates/upload',
      applicationData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return res.data;
  },

  // Optional: Upload Resume Separately
  uploadResume: async (file) => {
    const fd = new FormData();
    fd.append('resumeFile', file);

    const res = await axiosInstance.post(
      '/candidates/upload',
      fd,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return res.data;
  },
};

export default jobApplyAPI;