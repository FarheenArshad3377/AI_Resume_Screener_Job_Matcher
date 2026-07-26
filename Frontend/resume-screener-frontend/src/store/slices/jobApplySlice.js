import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jobApplyAPI from '../../api/jobApplyAPI.js';
import myApplicationsAPI from '../../api/myApplicationsAPI.js'; // . Import MyApplications API

export const fetchJobForApply = createAsyncThunk(
  'jobApply/fetchJobForApply',
  async (jobId, { rejectWithValue }) => {
    try {
      const data = await jobApplyAPI.getJobForApply(jobId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ⚡ UPDATED: Auto-score trigger added after application creation
export const submitApplication = createAsyncThunk(
  'jobApply/submitApplication',
  async ({ jobId, applicationData }, { rejectWithValue }) => {
    try {
      // 1. Submit Application & Resume
      const res = await jobApplyAPI.applyToJob(applicationData);

      // Extract Application ID from Backend Response
      const appId = res?.data?.id || res?.data?.applicationId || res?.id || res?.applicationId;

      // 2. 🚀 Trigger Gemini AI Scoring automatically right after submission!
      if (appId) {
        try {
          await myApplicationsAPI.scoreApplication(appId);
        } catch (scoreErr) {
          console.warn('AI scoring trigger warning:', scoreErr);
        }
      }

      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const uploadResumeFile = createAsyncThunk(
  'jobApply/uploadResumeFile',
  async (file, { rejectWithValue }) => {
    try {
      const data = await jobApplyAPI.uploadResume(file);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  job: null,
  loading: false,
  error: null,
  success: false,
  successMessage: '',
  uploadedFileUrl: null
};

const jobApplySlice = createSlice({
  name: 'jobApply',
  initialState,
  reducers: {
    clearError: (s) => { s.error = null; },
    clearSuccess: (s) => { s.success = false; s.successMessage = ''; },
    setUploadedFileUrl: (s, a) => { s.uploadedFileUrl = a.payload; }
  },
  extraReducers: (b) => {
    b.addCase(fetchJobForApply.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchJobForApply.fulfilled, (s, a) => { s.loading = false; s.job = a.payload.data ?? a.payload; })
     .addCase(fetchJobForApply.rejected, (s, a) => { s.loading = false; s.error = a.payload; });

    b.addCase(submitApplication.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(submitApplication.fulfilled, (s, a) => {
       s.loading = false;
       s.success = true;
       s.successMessage = a.payload.message ?? 'Application submitted & scored successfully!';
     })
     .addCase(submitApplication.rejected, (s, a) => { s.loading = false; s.error = a.payload; });

    b.addCase(uploadResumeFile.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(uploadResumeFile.fulfilled, (s, a) => {
       s.loading = false;
       s.uploadedFileUrl = a.payload.data?.url ?? a.payload.url ?? null;
     })
     .addCase(uploadResumeFile.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  }
});

export const { clearError, clearSuccess, setUploadedFileUrl } = jobApplySlice.actions;
export default jobApplySlice.reducer;