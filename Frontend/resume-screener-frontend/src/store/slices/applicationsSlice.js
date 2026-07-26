import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchApplicationsByJob, scoreApplication } from '../../api/applicationsApi.js';

export const getApplicationsByJob = createAsyncThunk(
  'applications/getApplicationsByJob',
  async (jobId) => {
    return await fetchApplicationsByJob(jobId);
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
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getApplicationsByJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplicationsByJob.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getApplicationsByJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default applicationsSlice.reducer;