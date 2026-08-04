import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import candidateRankingAPI from '../../api/candidateRankingAPI.js';

const CACHE_DURATION = 2 * 60 * 1000; // 2 min — ranking data jaldi stale ho sakta hai

export const fetchJobCandidates = createAsyncThunk(
  'candidateRanking/fetchJobCandidates',
  async ({ jobId, params }, { rejectWithValue }) => {
    try {
      return await candidateRankingAPI.getJobCandidates(jobId, params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
  {
    condition: ({ jobId }, { getState }) => {
      const { candidateRanking } = getState();
      const isFresh =
        candidateRanking.currentJobId === jobId &&
        candidateRanking.lastFetched &&
        Date.now() - candidateRanking.lastFetched < CACHE_DURATION;
      return !isFresh;
    },
  }
);

export const rankCandidates = createAsyncThunk(
  'candidateRanking/rankCandidates',
  async (jobId, { rejectWithValue }) => {
    try {
      return await candidateRankingAPI.rankCandidates(jobId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
  // Condition nahi lagai — "Rank Candidates" button user khud dabata hai,
  // explicitly fresh data chahiye, cache se skip nahi karna
);

export const updateCandidateStatus = createAsyncThunk(
  'candidateRanking/updateCandidateStatus',
  async ({ jobId, candidateId, status }, { rejectWithValue }) => {
    try {
      return await candidateRankingAPI.updateCandidateStatus(jobId, candidateId, status);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const exportCandidatesCSV = createAsyncThunk(
  'candidateRanking/exportCandidatesCSV',
  async (jobId, { rejectWithValue }) => {
    try {
      return await candidateRankingAPI.exportCandidatesCSV(jobId);
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
  currentJobId: null,
  lastFetched: null,
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
      .addCase(fetchJobCandidates.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentJobId = action.meta.arg.jobId;
      })
      .addCase(fetchJobCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload.data || action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchJobCandidates.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(rankCandidates.pending, (state) => { state.rankingInProgress = true; state.error = null; })
      .addCase(rankCandidates.fulfilled, (state, action) => {
        state.rankingInProgress = false;
        state.candidates = action.payload.data || action.payload;
        state.success = true;
        state.lastFetched = Date.now(); // fresh ranking hui, cache timestamp update
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

      .addCase(exportCandidatesCSV.fulfilled, () => { /* handled in UI */ })
      .addCase(exportCandidatesCSV.rejected, (state, action) => { state.error = action.payload; })

      .addCase(downloadResume.fulfilled, () => { /* handled in UI */ })
      .addCase(downloadResume.rejected, (state, action) => { state.error = action.payload; });
  }
});

export const { setFilter, setSortBy, clearError, clearSuccess } = candidateRankingSlice.actions;
export default candidateRankingSlice.reducer;