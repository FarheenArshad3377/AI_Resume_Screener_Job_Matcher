import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jobApplyAPI from '../../api/jobApplyAPI.js';
import myApplicationsAPI from '../../api/myApplicationsAPI.js';

const CACHE_DURATION = 5 * 60 * 1000; // 5 min — job posting details rarely change

export const fetchJobForApply = createAsyncThunk(
  'jobApply/fetchJobForApply',
  async (jobId, { rejectWithValue }) => {
    try {
      return await jobApplyAPI.getJobForApply(jobId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
  {
    // NEW: agar same jobId already fresh cached hai to call skip
    condition: (jobId, { getState }) => {
      const { jobApply } = getState();
      const isFresh =
        jobApply.currentJobId === jobId &&
        jobApply.lastFetched &&
        Date.now() - jobApply.lastFetched < CACHE_DURATION;
      return !isFresh;
    },
  }
);

export const submitApplication = createAsyncThunk(
  'jobApply/submitApplication',
  async ({ jobId, applicationData }, { rejectWithValue }) => {
    try {
      const res = await jobApplyAPI.applyToJob(applicationData);
      const appId = res?.data?.id || res?.data?.applicationId || res?.id || res?.applicationId;

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
      return await jobApplyAPI.uploadResume(file);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  job: null,
  currentJobId: null, // NEW
  lastFetched: null,  // NEW
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
    b.addCase(fetchJobForApply.pending, (s, a) => {
      s.loading = true;
      s.error = null;
      s.currentJobId = a.meta.arg; // NEW
    })
     .addCase(fetchJobForApply.fulfilled, (s, a) => {
       s.loading = false;
       s.job = a.payload.data ?? a.payload;
       s.lastFetched = Date.now(); // NEW
     })
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