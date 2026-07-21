import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import candidateRankingAPI from '../../api/candidateRankingApi';

export const fetchJobCandidates = createAsyncThunk(
  'candidateRanking/fetchJobCandidates',
  async ({ jobId, params }, { rejectWithValue }) => {
    try {
      const data = await candidateRankingAPI.getJobCandidates(jobId, params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const rankCandidates = createAsyncThunk(
  'candidateRanking/rankCandidates',
  async (jobId, { rejectWithValue }) => {
    try {
      const data = await candidateRankingAPI.rankCandidates(jobId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateCandidateStatus = createAsyncThunk(
  'candidateRanking/updateCandidateStatus',
  async ({ jobId, candidateId, status }, { rejectWithValue }) => {
    try {
      const data = await candidateRankingAPI.updateCandidateStatus(jobId, candidateId, status);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const exportCandidatesCSV = createAsyncThunk(
  'candidateRanking/exportCandidatesCSV',
  async (jobId, { rejectWithValue }) => {
    try {
      const blob = await candidateRankingAPI.exportCandidatesCSV(jobId);
      return blob;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const downloadResume = createAsyncThunk(
  'candidateRanking/downloadResume',
  async (candidateId, { rejectWithValue }) => {
    try {
      const blob = await candidateRankingAPI.downloadResume(candidateId);
      return { blob, candidateId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  candidates: [],
  loading: false,
  error: null,
  success: false,
  rankingInProgress: false,
  filter: { status: 'All', minScore: 0 },
  sortBy: 'score_desc'
};

const candidateRankingSlice = createSlice({
  name: 'candidateRanking',
  initialState,
  reducers: {
    setFilter: (state, action) => { state.filter = { ...state.filter, ...action.payload }; },
    setSortBy: (state, action) => { state.sortBy = action.payload; },
    clearError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.success = false; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobCandidates.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchJobCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload.data || action.payload;
      })
      .addCase(fetchJobCandidates.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(rankCandidates.pending, (state) => { state.rankingInProgress = true; state.error = null; })
      .addCase(rankCandidates.fulfilled, (state, action) => {
        state.rankingInProgress = false;
        state.candidates = action.payload.data || action.payload;
        state.success = true;
      })
      .addCase(rankCandidates.rejected, (state, action) => { state.rankingInProgress = false; state.error = action.payload; })

      .addCase(updateCandidateStatus.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateCandidateStatus.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.candidates.findIndex(c => c.id === action.payload.id || c.id === action.payload.candidateId);
        if (idx !== -1) state.candidates[idx] = { ...state.candidates[idx], ...action.payload };
        state.success = true;
      })
      .addCase(updateCandidateStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(exportCandidatesCSV.fulfilled, (state) => { /* handled in UI */ })
      .addCase(exportCandidatesCSV.rejected, (state, action) => { state.error = action.payload; })

      .addCase(downloadResume.fulfilled, (state) => { /* handled in UI */ })
      .addCase(downloadResume.rejected, (state, action) => { state.error = action.payload; });
  }
});

export const { setFilter, setSortBy, clearError, clearSuccess } = candidateRankingSlice.actions;
export default candidateRankingSlice.reducer;