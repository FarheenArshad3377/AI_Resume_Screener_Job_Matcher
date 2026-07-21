import axiosInstance from './axiosInstance';

const jobAPI = {
  // =============================================
  // CREATE JOB
  // =============================================
  createJob: async (jobData) => {
    const response = await axiosInstance.post('/recruiter/jobs', jobData);
    return response.data.data;
  },

  // =============================================
  // GET JOB BY ID
  // =============================================
  getJobById: async (jobId) => {
    const response = await axiosInstance.get(`/recruiter/jobs/${jobId}`);
    return response.data.data;
  },

  // =============================================
  // UPDATE JOB
  // =============================================
  updateJob: async (jobId, jobData) => {
    const response = await axiosInstance.put(
      `/recruiter/jobs/${jobId}`,
      jobData
    );
    return response.data.data;
  },

  // =============================================
  // PUBLISH JOB
  // =============================================
  publishJob: async (jobId) => {
    const response = await axiosInstance.post(
      `/recruiter/jobs/${jobId}/publish`
    );
    return response.data.data;
  },

  // =============================================
  // GET DEPARTMENTS
  // =============================================
  getDepartments: async () => {
    const response = await axiosInstance.get('/departments');
    return response.data.data;
  },

  // =============================================
  // GET EMPLOYMENT TYPES
  // =============================================
  getEmploymentTypes: async () => {
    const response = await axiosInstance.get('/employment-types');
    return response.data.data;
  },

  // =============================================
  // GET SKILLS
  // =============================================
  getSkills: async () => {
    const response = await axiosInstance.get('/skills');
    return response.data.data;
  }
};

export default jobAPI;