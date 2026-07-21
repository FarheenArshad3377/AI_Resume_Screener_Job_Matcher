import axiosInstance from './axiosInstance';

const recruiterInterviewAPI = {
  getInterviews: async (params = {}) => {
    const res = await axiosInstance.get('/recruiter/interviews', { params });
    return res.data;
  },

  getInterviewById: async (interviewId) => {
    const res = await axiosInstance.get(`/recruiter/interviews/${interviewId}`);
    return res.data;
  },

  scheduleInterview: async (payload) => {
    const res = await axiosInstance.post('/recruiter/interviews', payload);
    return res.data;
  },

  getRescheduleRequest: async (interviewId) => {
    const res = await axiosInstance.get(`/recruiter/interviews/${interviewId}/reschedule-requests`);
    return res.data;
  },

  confirmReschedule: async (interviewId, payload) => {
    const res = await axiosInstance.put(`/recruiter/interviews/${interviewId}/reschedule`, payload);
    return res.data;
  },

  cancelInterview: async (interviewId, reason) => {
    const res = await axiosInstance.post(`/recruiter/interviews/${interviewId}/cancel`, { reason });
    return res.data;
  },

  submitFeedback: async (interviewId, payload) => {
    const res = await axiosInstance.post(`/recruiter/interviews/${interviewId}/feedback`, payload);
    return res.data;
  },

  getFeedback: async (interviewId) => {
    const res = await axiosInstance.get(`/recruiter/interviews/${interviewId}/feedback`);
    return res.data;
  },

  sendReminder: async (interviewId) => {
    const res = await axiosInstance.post(`/recruiter/interviews/${interviewId}/send-reminder`);
    return res.data;
  },

  searchCandidates: async (query) => {
    const res = await axiosInstance.get('/recruiter/candidates/search', { params: { query } });
    return res.data;
  },

  getActiveJobs: async () => {
    const res = await axiosInstance.get('/recruiter/jobs/active');
    return res.data;
  },

  getTeamMembers: async () => {
    const res = await axiosInstance.get('/recruiter/team-members');
    return res.data;
  }
};

export default recruiterInterviewAPI;