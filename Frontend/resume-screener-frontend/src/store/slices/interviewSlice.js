import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import interviewAPI from '../../api/interviewApi';

export const fetchMyInterviews = createAsyncThunk(
  'interview/fetchMyInterviews',
  async (params, { rejectWithValue }) => {
    try {
      return await interviewAPI.getMyInterviews(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch interviews');
    }
  }
);

export const fetchInterviewById = createAsyncThunk(
  'interview/fetchInterviewById',
  async (interviewId, { rejectWithValue }) => {
    try {
      return await interviewAPI.getInterviewById(interviewId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch interview');
    }
  }
);

export const requestReschedule = createAsyncThunk(
  'interview/requestReschedule',
  async ({ interviewId, payload }, { rejectWithValue }) => {
    try {
      return await interviewAPI.requestReschedule(interviewId, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to request reschedule');
    }
  }
);

export const cancelInterview = createAsyncThunk(
  'interview/cancelInterview',
  async (interviewId, { rejectWithValue }) => {
    try {
      return await interviewAPI.cancelInterview(interviewId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to cancel interview');
    }
  }
);

export const fetchFeedback = createAsyncThunk(
  'interview/fetchFeedback',
  async (interviewId, { rejectWithValue }) => {
    try {
      return await interviewAPI.getFeedback(interviewId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch feedback');
    }
  }
);

const initialState = {
  interviews: [],
  loading: false,
  error: null,
  success: false,
  successMessage: '',

  // Modal-driven state
  selectedInterview: null,   // details modal
  rescheduleTarget: null,    // reschedule modal
  feedbackData: null,        // feedback modal
  feedbackLoading: false
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.success = false; state.successMessage = ''; },
    openDetailsModal: (state, action) => { state.selectedInterview = action.payload; },
    closeDetailsModal: (state) => { state.selectedInterview = null; },
    openRescheduleModal: (state, action) => { state.rescheduleTarget = action.payload; },
    closeRescheduleModal: (state) => { state.rescheduleTarget = null; },
    closeFeedbackModal: (state) => { state.feedbackData = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyInterviews.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.interviews = Array.isArray(payload) ? payload : (payload?.data ?? []);
      })
      .addCase(fetchMyInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(requestReschedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestReschedule.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.successMessage = 'Reschedule request sent';
        state.rescheduleTarget = null;
        const updated = action.payload?.data ?? action.payload;
        state.interviews = state.interviews.map((iv) =>
          iv.id === updated.id ? { ...iv, ...updated } : iv
        );
      })
      .addCase(requestReschedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelInterview.fulfilled, (state, action) => {
        const id = action.payload?.data?.id ?? action.payload?.id ?? action.meta.arg;
        state.interviews = state.interviews.map((iv) =>
          iv.id === id ? { ...iv, status: 'Cancelled' } : iv
        );
        state.success = true;
        state.successMessage = 'Interview cancelled';
      })
      .addCase(cancelInterview.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(fetchFeedback.pending, (state) => {
        state.feedbackLoading = true;
      })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.feedbackLoading = false;
        state.feedbackData = action.payload?.data ?? action.payload;
      })
      .addCase(fetchFeedback.rejected, (state, action) => {
        state.feedbackLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  clearSuccess,
  openDetailsModal,
  closeDetailsModal,
  openRescheduleModal,
  closeRescheduleModal,
  closeFeedbackModal
} = interviewSlice.actions;

export default interviewSlice.reducer;