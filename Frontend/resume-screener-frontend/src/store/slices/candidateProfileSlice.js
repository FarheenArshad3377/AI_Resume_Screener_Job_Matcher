import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import candidateProfileAPI from '../../api/candidateProfileApi';

export const fetchCandidateProfile = createAsyncThunk(
  'candidateProfile/fetchCandidateProfile',
  async (candidateId, { rejectWithValue }) => {
    try {
      const data = await candidateProfileAPI.getCandidateProfile(candidateId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchCandidateApplications = createAsyncThunk(
  'candidateProfile/fetchCandidateApplications',
  async ({ candidateId, params }, { rejectWithValue }) => {
    try {
      const data = await candidateProfileAPI.getCandidateApplications(candidateId, params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateCandidateStatus = createAsyncThunk(
  'candidateProfile/updateCandidateStatus',
  async ({ candidateId, status }, { rejectWithValue }) => {
    try {
      const data = await candidateProfileAPI.updateCandidateStatus(candidateId, status);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addCandidateNote = createAsyncThunk(
  'candidateProfile/addCandidateNote',
  async ({ candidateId, note }, { rejectWithValue }) => {
    try {
      const data = await candidateProfileAPI.addNote(candidateId, note);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const downloadCandidateResume = createAsyncThunk(
  'candidateProfile/downloadCandidateResume',
  async (candidateId, { rejectWithValue }) => {
    try {
      const blob = await candidateProfileAPI.downloadResume(candidateId);
      return { blob, candidateId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  candidate: null,
  applications: [],
  notes: [],
  loading: false,
  error: null,
  success: false
};

const candidateProfileSlice = createSlice({
  name: 'candidateProfile',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.success = false; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.candidate = action.payload.data ?? action.payload;
      })
      .addCase(fetchCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCandidateApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.data ?? action.payload;
      })
      .addCase(fetchCandidateApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCandidateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidateStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updated = action.payload.data ?? action.payload;
        if (state.candidate && state.candidate.id === (updated.id || updated.candidateId)) {
          state.candidate.status = updated.status;
        }
        state.applications = state.applications.map(app =>
          app.id === (updated.applicationId || updated.id) ? { ...app, status: updated.status } : app
        );
      })
      .addCase(updateCandidateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addCandidateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCandidateNote.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const note = action.payload.data ?? action.payload;
        state.notes = [note, ...state.notes];
      })
      .addCase(addCandidateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(downloadCandidateResume.fulfilled, () => {})
      .addCase(downloadCandidateResume.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess } = candidateProfileSlice.actions;
export default candidateProfileSlice.reducer;