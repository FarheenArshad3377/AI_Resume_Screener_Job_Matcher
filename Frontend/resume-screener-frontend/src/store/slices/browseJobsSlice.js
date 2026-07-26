import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import browseJobsAPI from '../../api/browseJobsAPI.js';

export const fetchJobs = createAsyncThunk(
    'browseJobs/fetchJobs',
    async (params, { rejectWithValue }) => {
        try {
            const response = await browseJobsAPI.searchJobs(params);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch jobs'
            );
        }
    }
);

const initialState = {
    jobs: [],
    loading: false,
    error: null,
    page: 1,
    pageSize: 10,
    totalCount: 0,
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
            .addCase(fetchJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.loading = false;
                const payload = action.payload;

                // Backend jo bhi shape return kare, usay normalize kar rahe hain
                const jobsArray = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.data)
                        ? payload.data
                        : Array.isArray(payload?.jobs)
                            ? payload.jobs
                            : [];

                state.jobs = jobsArray;
                state.totalCount = payload?.totalCount ?? payload?.total ?? jobsArray.length;
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setFilters, resetFilters, setPage, clearError } = browseJobsSlice.actions;
export default browseJobsSlice.reducer;