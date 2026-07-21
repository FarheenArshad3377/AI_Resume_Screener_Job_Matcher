import axiosInstance from './axiosInstance';

const interviewAPI = {
  getMyInterviews: async (params = {}) => {
    const res = await axiosInstance.get('/candidates/me/interviews', { params });
    return res.data;
  },

  getInterviewById: async (interviewId) => {
    const res = await axiosInstance.get(`/candidates/me/interviews/${interviewId}`);
    return res.data;
  },

  requestReschedule: async (interviewId, payload) => {
    // payload: { preferredSlots: [{date, startTime, endTime}], reason }
    const res = await axiosInstance.post(`/candidates/me/interviews/${interviewId}/reschedule`, payload);
    return res.data;
  },

  cancelInterview: async (interviewId) => {
    const res = await axiosInstance.post(`/candidates/me/interviews/${interviewId}/cancel`);
    return res.data;
  },

  getFeedback: async (interviewId) => {
    const res = await axiosInstance.get(`/candidates/me/interviews/${interviewId}/feedback`);
    return res.data;
  }
};

export default interviewAPI;