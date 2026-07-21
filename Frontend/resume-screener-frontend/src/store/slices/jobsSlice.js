import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJobs, fetchJobById, createJob } from '../../api/jobsApi';

export const getJobs = createAsyncThunk('jobs/getJobs', async () => {
  return await fetchJobs();
});

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
    selectedJob: null,   // 👈 NEW
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.selectedJob = action.payload;   // 👈 NEW
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export default jobsSlice.reducer;