import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchApplicationsByJob, scoreApplication } from '../../api/applicationsApi.js';

const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

export const getApplicationsByJob = createAsyncThunk(
  'applications/getApplicationsByJob',
  async (jobId) => {
    return await fetchApplicationsByJob(jobId);
  },
  {
    // Har jobId ka cache alag check hota hai
    condition: (jobId, { getState }) => {
      const { applications } = getState();
      const cached = applications.cacheByJobId[jobId];
      const isCacheFresh =
        cached && Date.now() - cached.lastFetched < CACHE_DURATION;

      if (isCacheFresh) {
        return false; // Cache fresh hai -> API call cancel
      }
      return true; // Purana ya nahi hai -> API call karo
    },
  }
);

export const runScoring = createAsyncThunk(
  'applications/runScoring',
  async (applicationId) => {
    return await scoreApplication(applicationId);
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    items: [],
    currentJobId: null,   // abhi konsa jobId dikh raha hai
    cacheByJobId: {},     // { [jobId]: { lastFetched } }
    loading: false,
    error: null,
  },
  reducers: {
    // manual refresh chahiye ho to
    invalidateApplicationsCache: (state, action) => {
      const jobId = action.payload;
      if (jobId) {
        delete state.cacheByJobId[jobId];
      } else {
        state.cacheByJobId = {}; // sab cache clear
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getApplicationsByJob.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentJobId = action.meta.arg; // jobId store karo
      })
      .addCase(getApplicationsByJob.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data ?? action.payload;
        const jobId = action.meta.arg;
        state.cacheByJobId[jobId] = { lastFetched: Date.now() };
      })
      .addCase(getApplicationsByJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(runScoring.fulfilled, (state) => {
        // Scoring hone ke baad us job ka cache invalidate karo
        // taake agli baar fresh scores aayein
        if (state.currentJobId) {
          delete state.cacheByJobId[state.currentJobId];
        }
      });
  },
});

export const { invalidateApplicationsCache } = applicationsSlice.actions;
export default applicationsSlice.reducer;