import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadResume } from '../../api/candidatesApi.js';
import { fetchApplicationsByJob } from '../../api/applicationsApi.js';

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
    const data = response?.data ?? response;   // 👈 naya: wrapper unwrap

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
  }
);

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState: {
    candidates: [],       // 👈 NEW - ranking list ke liye
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
      })
      .addCase(submitResume.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(getCandidates.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
      })
      .addCase(getCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetUploadStatus } = candidatesSlice.actions;
export default candidatesSlice.reducer;