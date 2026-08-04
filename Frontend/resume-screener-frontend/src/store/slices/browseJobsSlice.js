import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import browseJobsAPI from '../../api/browseJobsAPI.js';

const CACHE_DURATION = 2 * 60 * 1000; // 2 min

export const fetchJobs = createAsyncThunk(
    'browseJobs/fetchJobs',
    async (params, { rejectWithValue }) => {
        try {
            return await browseJobsAPI.searchJobs(params);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
        }
    },
    {
        // Cache key filters+page ke combination se banti hai
        condition: (params, { getState }) => {
            const { browseJobs } = getState();
            const key = JSON.stringify(params ?? {});
            const isFresh =
                browseJobs.lastQueryKey === key &&
                browseJobs.lastFetched &&
                Date.now() - browseJobs.lastFetched < CACHE_DURATION;
            return !isFresh;
        },
    }
);

const initialState = {
    jobs: [],
    loading: false,
    error: null,
    page: 1,
    pageSize: 10,
    totalCount: 0,
    lastQueryKey: null,
    lastFetched: null,
    filters: {
        q: '',
        location: [],       // array, CandidateSidebar checkbox ke liye
        jobType: [],
        salaryRange: [0, 200000],
        experience: 'Any Experience',
        sortBy: 'Newest First'
    }
};

const browseJobsSlice = createSlice({
    name: 'browseJobs',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.page = 1; // filter change pe page reset
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
            state.page = 1;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobs.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                state.lastQueryKey = JSON.stringify(action.meta.arg ?? {});
            })
           .addCase(fetchJobs.fulfilled, (state, action) => {
                state.loading = false;
                const outer = action.payload?.data ?? action.payload;   // pehle outer wrapper unwrap karo

                const jobsArray = Array.isArray(outer)
                    ? outer
                    : Array.isArray(outer?.data)
                    ? outer.data
                    : Array.isArray(outer?.jobs)
                        ? outer.jobs
                        : [];

                state.jobs = jobsArray;
                state.totalCount = outer?.totalCount ?? outer?.total ?? jobsArray.length;
                state.lastFetched = Date.now();
                })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setFilters, resetFilters, setPage, clearError } = browseJobsSlice.actions;
export default browseJobsSlice.reducer;