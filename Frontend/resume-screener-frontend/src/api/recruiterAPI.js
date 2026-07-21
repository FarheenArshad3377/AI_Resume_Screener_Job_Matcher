import axiosInstance from './axiosInstance';

// Recruiter Dashboard APIs
export const recruiterAPI = {
  // Get all jobs for the logged-in recruiter (with applicant counts + match score)
  getAllJobs: async () => {
    const response = await axiosInstance.get('/recruiter/jobs');
    return response.data.data;
  },

  // Get job by ID (full detail)
  getJobById: async (jobId) => {
    const response = await axiosInstance.get(`/recruiter/jobs/${jobId}/details`);
    return response.data.data;
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/recruiter/dashboard/stats');
    return response.data.data;
  },

  // Get recent candidates
  getRecentCandidates: async () => {
    const response = await axiosInstance.get('/recruiter/candidates/recent');
    return response.data.data;
  },

  // Create new job
  createJob: async (jobData) => {
    const response = await axiosInstance.post('/recruiter/jobs', jobData);
    return response.data.data;
  },

  // Update job
  updateJob: async (jobId, jobData) => {
    const response = await axiosInstance.put(`/recruiter/jobs/${jobId}`, jobData);
    return response.data.data;
  },

  // Delete job
  deleteJob: async (jobId) => {
    const response = await axiosInstance.delete(`/recruiter/jobs/${jobId}`);
    return response.data.data;
  },

  // Publish job
  publishJob: async (jobId) => {
    const response = await axiosInstance.post(`/recruiter/jobs/${jobId}/publish`);
    return response.data.data;
  },

  // Get candidates for a job (returns array directly)
  getJobCandidates: async (jobId) => {
    const response = await axiosInstance.get(`/recruiter/jobs/${jobId}/candidates`);
    return response.data.data.items; // backend wraps as { items, totalCount }
  },

  // Get candidate profile
  getCandidateProfile: async (candidateId) => {
    const response = await axiosInstance.get(`/recruiter/candidates/${candidateId}`);
    return response.data.data;
  },

  // Update candidate application status
  // NOTE: backend requires jobId + applicationId (not just candidateId)
  updateCandidateStatus: async (jobId, applicationId, status) => {
    const response = await axiosInstance.put(
      `/recruiter/jobs/${jobId}/applications/${applicationId}/status`,
      { status }
    );
    return response.data.data;
  },
  getAllApplications: async () => {
  const response = await axiosInstance.get('/recruiter/applications');
  return response.data.data;
},
};

export default recruiterAPI;