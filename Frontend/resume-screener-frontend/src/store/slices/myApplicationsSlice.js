import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import myApplicationsAPI from '../../api/myApplicationsAPI.js';

const CACHE_DURATION = 2 * 60 * 1000; // 2 min

export const fetchMyApplications = createAsyncThunk(
  'myApplications/fetchMyApplications',
  async (params, { rejectWithValue }) => {
    try {
      return await myApplicationsAPI.getMyApplications(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
  {
    condition: (params, { getState }) => {
      const { myApplications } = getState();
      const key = JSON.stringify(params ?? {});
      const isFresh =
        myApplications.lastQueryKey === key &&
        myApplications.lastFetched &&
        Date.now() - myApplications.lastFetched < CACHE_DURATION;
      return !isFresh;
    },
  }
);

export const fetchApplicationById = createAsyncThunk(
  'myApplications/fetchApplicationById',
  async (applicationId, { rejectWithValue }) => {
    try {
      return await myApplicationsAPI.getApplicationById(applicationId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
  // Modal-driven single fetch — cache ki zaroorat nahi
);

export const withdrawApplication = createAsyncThunk(
  'myApplications/withdrawApplication',
  async (applicationId, { rejectWithValue }) => {
    try {
      return await myApplicationsAPI.withdrawApplication(applicationId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const downloadOfferLetter = createAsyncThunk(
  'myApplications/downloadOfferLetter',
  async (applicationId, { rejectWithValue }) => {
    try {
      const blob = await myApplicationsAPI.downloadOfferLetter(applicationId);
      return { blob, applicationId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  applications: [],
  totalCount: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,
  success: false,
  successMessage: '',
  currentApplication: null,

  lastQueryKey: null, // NEW
  lastFetched: null   // NEW
};

const myApplicationsSlice = createSlice({
  name: 'myApplications',
  initialState,
  reducers: {
    setPage: (s, a) => { s.page = a.payload; },
    clearError: (s) => { s.error = null; },
    clearSuccess: (s) => { s.success = false; s.successMessage = ''; },
    clearCurrentApplication: (s) => { s.currentApplication = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApplications.pending, (s, a) => {
        s.loading = true;
        s.error = null;
        s.lastQueryKey = JSON.stringify(a.meta.arg ?? {}); // NEW
      })
      .addCase(fetchMyApplications.fulfilled, (s, a) => {
        s.loading = false;
        const resData = a.payload?.data ?? a.payload;
        s.applications = resData?.data ?? resData?.items ?? (Array.isArray(resData) ? resData : []);
        s.totalCount = resData?.totalCount ?? a.payload?.totalCount ?? s.applications.length;
        s.lastFetched = Date.now(); // NEW
      })
      .addCase(fetchMyApplications.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchApplicationById.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchApplicationById.fulfilled, (s, a) => {
        s.loading = false;
        s.currentApplication = a.payload?.data ?? a.payload;
      })
      .addCase(fetchApplicationById.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(withdrawApplication.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(withdrawApplication.fulfilled, (s, a) => {
        s.loading = false;
        s.success = true;
        s.successMessage = a.payload?.message ?? 'Application withdrawn';
        const id = a.payload?.data?.id ?? a.payload?.id;
        s.applications = s.applications.map(app => app.id === id ? { ...app, status: 'Withdrawn' } : app);
        s.lastFetched = null; // NEW: invalidate cache
      })
      .addCase(withdrawApplication.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(downloadOfferLetter.fulfilled, () => { /* Handled in UI */ })
      .addCase(downloadOfferLetter.rejected, (s, a) => { s.error = a.payload; });
  }
});

export const { setPage, clearError, clearSuccess, clearCurrentApplication } = myApplicationsSlice.actions;
export default myApplicationsSlice.reducer;