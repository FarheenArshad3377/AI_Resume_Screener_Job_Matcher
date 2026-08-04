import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadResume } from '../../api/candidatesApi.js';
import { fetchApplicationsByJob } from '../../api/applicationsApi.js';

const CACHE_DURATION = 3 * 60 * 1000; // 3 min

export const submitResume = createAsyncThunk(
  'candidates/submitResume',
  async (formData) => {
    return await uploadResume(formData);
  }
);

export const getCandidates = createAsyncThunk(
  'candidates/getCandidates',
  async (jobId) => {
    const response = await fetchApplicationsByJob(jobId);
    const data = response?.data ?? response;

    return data.map((app) => ({
      id: app.id,
      name: app.candidateName,
      role: app.candidateEmail,
      matchScore: app.matchScore ?? 0,
      matchedSkills: app.matchedSkills
        ? app.matchedSkills.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      missingSkills: app.missingSkills
        ? app.missingSkills.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      status: app.status,
      aiSummary: app.aiSummary,
    }));
  },
  {
    condition: (jobId, { getState }) => {
      const { candidates } = getState();
      const isFresh =
        candidates.currentJobId === jobId &&
        candidates.lastFetched &&
        Date.now() - candidates.lastFetched < CACHE_DURATION;
      return !isFresh;
    },
  }
);

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState: {
    candidates: [],
    currentJobId: null,
    lastFetched: null,
    loading: false,
    uploadStatus: 'idle',
    lastUploadResult: null,
    error: null,
  },
  reducers: {
    resetUploadStatus: (state) => {
      state.uploadStatus = 'idle';
      state.lastUploadResult = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitResume.pending, (state) => {
        state.uploadStatus = 'loading';
        state.error = null;
      })
      .addCase(submitResume.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        state.lastUploadResult = action.payload;
        state.lastFetched = null; // naya resume aaya, cache invalidate
      })
      .addCase(submitResume.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(getCandidates.pending, (state, action) => {
        state.loading = true;
        state.currentJobId = action.meta.arg;
      })
      .addCase(getCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(getCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetUploadStatus } = candidatesSlice.actions;
export default candidatesSlice.reducer;