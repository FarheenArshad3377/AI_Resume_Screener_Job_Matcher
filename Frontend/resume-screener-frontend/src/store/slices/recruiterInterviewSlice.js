import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import recruiterInterviewAPI from '../../api/recruiterInterviewApi.js';

export const fetchInterviews = createAsyncThunk(
  'recruiterInterview/fetchInterviews',
  async (params, { rejectWithValue }) => {
    try {
      return await recruiterInterviewAPI.getInterviews(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch interviews');
    }
  }
);

export const scheduleInterview = createAsyncThunk(
  'recruiterInterview/scheduleInterview',
  async (payload, { rejectWithValue }) => {
    try {
      return await recruiterInterviewAPI.scheduleInterview(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to schedule interview');
    }
  }
);

export const fetchRescheduleRequest = createAsyncThunk(
  'recruiterInterview/fetchRescheduleRequest',
  async (interviewId, { rejectWithValue }) => {
    try {
      const data = await recruiterInterviewAPI.getRescheduleRequest(interviewId);
      return { interviewId, data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch reschedule request');
    }
  }
);

export const confirmReschedule = createAsyncThunk(
  'recruiterInterview/confirmReschedule',
  async ({ interviewId, payload }, { rejectWithValue }) => {
    try {
      return await recruiterInterviewAPI.confirmReschedule(interviewId, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to confirm reschedule');
    }
  }
);

export const cancelInterview = createAsyncThunk(
  'recruiterInterview/cancelInterview',
  async ({ interviewId, reason }, { rejectWithValue }) => {
    try {
      return await recruiterInterviewAPI.cancelInterview(interviewId, reason);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to cancel interview');
    }
  }
);

export const submitFeedback = createAsyncThunk(
  'recruiterInterview/submitFeedback',
  async ({ interviewId, payload }, { rejectWithValue }) => {
    try {
      return await recruiterInterviewAPI.submitFeedback(interviewId, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit feedback');
    }
  }
);

export const fetchFeedback = createAsyncThunk(
  'recruiterInterview/fetchFeedback',
  async (interviewId, { rejectWithValue }) => {
    try {
      return await recruiterInterviewAPI.getFeedback(interviewId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || null); // 404 = no feedback yet, not a real error
    }
  }
);

export const sendReminder = createAsyncThunk(
  'recruiterInterview/sendReminder',
  async (interviewId, { rejectWithValue }) => {
    try {
      return await recruiterInterviewAPI.sendReminder(interviewId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send reminder');
    }
  }
);

export const searchCandidates = createAsyncThunk(
  'recruiterInterview/searchCandidates',
  async (query, { rejectWithValue }) => {
    try {
      return await recruiterInterviewAPI.searchCandidates(query);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to search candidates');
    }
  }
);

export const fetchActiveJobs = createAsyncThunk(
  'recruiterInterview/fetchActiveJobs',
  async (_, { rejectWithValue }) => {
    try {
      return await recruiterInterviewAPI.getActiveJobs();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchTeamMembers = createAsyncThunk(
  'recruiterInterview/fetchTeamMembers',
  async (_, { rejectWithValue }) => {
    try {
      return await recruiterInterviewAPI.getTeamMembers();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch team members');
    }
  }
);

const initialState = {
  interviews: [],
  stats: { scheduledToday: 0, thisWeek: 0, pendingConfirmation: 0, completed: 0 },
  totalCount: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,
  success: false,
  successMessage: '',

  filters: {
    search: '',
    jobId: 'All',
    status: 'All',
    dateFrom: null,
    dateTo: null
  },

  // Modal state
  scheduleModalOpen: false,
  rescheduleTarget: null,
  rescheduleRequest: null,
  feedbackTarget: null,
  feedbackData: null,
  feedbackLoading: false,

  // Dropdown data
  candidateResults: [],
  activeJobs: [],
  teamMembers: []
};

const recruiterInterviewSlice = createSlice({
  name: 'recruiterInterview',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.success = false; state.successMessage = ''; },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    setPage: (state, action) => { state.page = action.payload; },

    openScheduleModal: (state) => { state.scheduleModalOpen = true; },
    closeScheduleModal: (state) => { state.scheduleModalOpen = false; state.candidateResults = []; },

    openRescheduleModal: (state, action) => { state.rescheduleTarget = action.payload; },
    closeRescheduleModal: (state) => { state.rescheduleTarget = null; state.rescheduleRequest = null; },

    openFeedbackModal: (state, action) => { state.feedbackTarget = action.payload; },
    closeFeedbackModal: (state) => { state.feedbackTarget = null; state.feedbackData = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.interviews = payload?.interviews ?? [];
        state.stats = payload?.stats ?? state.stats;
        state.totalCount = payload?.totalCount ?? state.interviews.length;
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(scheduleInterview.pending, (state) => {
        state.loading = true;
      })
      .addCase(scheduleInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.successMessage = 'Interview scheduled successfully';
        state.scheduleModalOpen = false;
        state.interviews = [action.payload, ...state.interviews];
      })
      .addCase(scheduleInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchRescheduleRequest.fulfilled, (state, action) => {
        state.rescheduleRequest = action.payload.data;
      })

      .addCase(confirmReschedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(confirmReschedule.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.successMessage = 'Interview rescheduled';
        state.rescheduleTarget = null;
        state.rescheduleRequest = null;
        const updated = action.payload;
        state.interviews = state.interviews.map((iv) =>
          iv.id === updated.id ? { ...iv, ...updated } : iv
        );
      })
      .addCase(confirmReschedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelInterview.fulfilled, (state, action) => {
        const updated = action.payload;
        state.interviews = state.interviews.map((iv) =>
          iv.id === updated.id ? { ...iv, status: 'Cancelled' } : iv
        );
        state.success = true;
        state.successMessage = 'Interview cancelled';
      })
      .addCase(cancelInterview.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.successMessage = 'Feedback saved';
        if (state.feedbackTarget) {
          state.interviews = state.interviews.map((iv) =>
            iv.id === state.feedbackTarget.id ? { ...iv, status: 'Completed' } : iv
          );
        }
        state.feedbackTarget = null;
        state.feedbackData = null;
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchFeedback.pending, (state) => {
        state.feedbackLoading = true;
      })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.feedbackLoading = false;
        state.feedbackData = action.payload;
      })
      .addCase(fetchFeedback.rejected, (state) => {
        state.feedbackLoading = false;
        state.feedbackData = null; // no feedback yet — not treated as error
      })

      .addCase(sendReminder.fulfilled, (state) => {
        state.success = true;
        state.successMessage = 'Reminder sent';
      })

      .addCase(searchCandidates.fulfilled, (state, action) => {
        state.candidateResults = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(fetchActiveJobs.fulfilled, (state, action) => {
        state.activeJobs = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.teamMembers = Array.isArray(action.payload) ? action.payload : [];
      });
  }
});

export const {
  clearError,
  clearSuccess,
  setFilters,
  setPage,
  openScheduleModal,
  closeScheduleModal,
  openRescheduleModal,
  closeRescheduleModal,
  openFeedbackModal,
  closeFeedbackModal
} = recruiterInterviewSlice.actions;

export default recruiterInterviewSlice.reducer;