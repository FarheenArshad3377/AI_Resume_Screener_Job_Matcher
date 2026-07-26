import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import myApplicationsAPI from '../../api/myApplicationsAPI.js';

export const fetchMyApplications = createAsyncThunk(
  'myApplications/fetchMyApplications',
  async (params, { rejectWithValue }) => {
    try {
      const data = await myApplicationsAPI.getMyApplications(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchApplicationById = createAsyncThunk(
  'myApplications/fetchApplicationById',
  async (applicationId, { rejectWithValue }) => {
    try {
      const data = await myApplicationsAPI.getApplicationById(applicationId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const withdrawApplication = createAsyncThunk(
  'myApplications/withdrawApplication',
  async (applicationId, { rejectWithValue }) => {
    try {
      const data = await myApplicationsAPI.withdrawApplication(applicationId);
      return data;
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
  currentApplication: null
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
      // Fetch List
      .addCase(fetchMyApplications.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchMyApplications.fulfilled, (s, a) => {
        s.loading = false;
        const resData = a.payload?.data ?? a.payload;
        s.applications = resData?.data ?? resData?.items ?? (Array.isArray(resData) ? resData : []);
        s.totalCount = resData?.totalCount ?? a.payload?.totalCount ?? s.applications.length;
      })
      .addCase(fetchMyApplications.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      // Fetch Detail (Modal Data)
      .addCase(fetchApplicationById.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchApplicationById.fulfilled, (s, a) => {
        s.loading = false;
        // Correctly unwrap API response: ApiResponse.data -> Application object
        s.currentApplication = a.payload?.data ?? a.payload;
      })
      .addCase(fetchApplicationById.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      // Withdraw
      .addCase(withdrawApplication.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(withdrawApplication.fulfilled, (s, a) => {
        s.loading = false;
        s.success = true;
        s.successMessage = a.payload?.message ?? 'Application withdrawn';
        const id = a.payload?.data?.id ?? a.payload?.id;
        s.applications = s.applications.map(app => app.id === id ? { ...app, status: 'Withdrawn' } : app);
      })
      .addCase(withdrawApplication.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      // Download Offer
      .addCase(downloadOfferLetter.fulfilled, (s) => { /* Handled in UI */ })
      .addCase(downloadOfferLetter.rejected, (s, a) => { s.error = a.payload; });
  }
});

export const { setPage, clearError, clearSuccess, clearCurrentApplication } = myApplicationsSlice.actions;
export default myApplicationsSlice.reducer;