import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJobs, fetchJobById, createJob } from '../../api/jobsApi.js';

// Cache kitni der tak "fresh" mana jaye (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const getJobs = createAsyncThunk(
  'jobs/getJobs',
  async () => {
    return await fetchJobs();
  },
  {
    // Ye function batata hai: call karni hai ya cache use karni hai
    condition: (_, { getState }) => {
      const { jobs } = getState();
      const isCacheFresh =
        jobs.lastFetched && Date.now() - jobs.lastFetched < CACHE_DURATION;

      if (isCacheFresh && jobs.items.length > 0) {
        // Cache fresh hai -> API call cancel kar do
        return false;
      }
      return true; // Cache purani hai ya khali -> API call karo
    },
  }
);

export const getJobById = createAsyncThunk('jobs/getJobById', async (jobId) => {
  return await fetchJobById(jobId);
});

export const addJob = createAsyncThunk('jobs/addJob', async (jobData) => {
  return await createJob(jobData);
});

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    items: [],
    selectedJob: null,
    loading: false,
    error: null,
    lastFetched: null, // last cache timestamp
  },
  reducers: {
    // manual "force refresh" chahiye ho to ye call karo
    invalidateJobsCache: (state) => {
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data?.data ?? [];
        state.pagination = {
          pageNumber: action.payload?.data?.pageNumber,
          pageSize: action.payload?.data?.pageSize,
          totalCount: action.payload?.data?.totalCount,
          totalPages: action.payload?.data?.totalPages,
        };
        state.lastFetched = Date.now(); // cache timestamp set karo
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.selectedJob = action.payload?.data ?? action.payload;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.lastFetched = null; // naya job add hua, cache invalidate karo
      });
  },
});

export const { invalidateJobsCache } = jobsSlice.actions;
export default jobsSlice.reducer;