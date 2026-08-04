import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import candidateProfileAPI from '../../api/candidateProfileAPI.js';

const CACHE_DURATION = 3 * 60 * 1000; // 3 min

export const fetchCandidateProfile = createAsyncThunk(
  'candidateProfile/fetchCandidateProfile',
  async (candidateId, { rejectWithValue }) => {
    try {
      return await candidateProfileAPI.getCandidateProfile(candidateId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
  {
    // Agar wahi candidate already fresh cached hai to call skip
    condition: (candidateId, { getState }) => {
      const { candidateProfile } = getState();
      const isFresh =
        candidateProfile.candidate?.id === candidateId &&
        candidateProfile.lastFetched &&
        Date.now() - candidateProfile.lastFetched < CACHE_DURATION;
      return !isFresh;
    },
  }
);

export const fetchCandidateApplications = createAsyncThunk(
  'candidateProfile/fetchCandidateApplications',
  async ({ candidateId, params }, { rejectWithValue }) => {
    try {
      return await candidateProfileAPI.getCandidateApplications(candidateId, params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
  // Isme caching nahi lagai — params (filters) baar baar badalte hain
);

export const updateCandidateStatus = createAsyncThunk(
  'candidateProfile/updateCandidateStatus',
  async ({ candidateId, status }, { rejectWithValue }) => {
    try {
      return await candidateProfileAPI.updateCandidateStatus(candidateId, status);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addCandidateNote = createAsyncThunk(
  'candidateProfile/addCandidateNote',
  async ({ candidateId, note }, { rejectWithValue }) => {
    try {
      return await candidateProfileAPI.addNote(candidateId, note);
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
  success: false,
  lastFetched: null,
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
        state.lastFetched = Date.now();
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
        state.lastFetched = null; // status badla, cache invalidate
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