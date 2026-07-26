import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jobDetailAPI from '../../api/jobDetailApi.js';

// Async thunks
export const fetchJobDetails = createAsyncThunk(
    'jobDetail/fetchJobDetails',
    async (jobId, { rejectWithValue }) => {
        try {
            const jobDetails = await jobDetailAPI.getJobDetails(jobId);
            return jobDetails;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch job details'
            );
        }
    }
);

export const fetchJobStats = createAsyncThunk(
    'jobDetail/fetchJobStats',
    async (jobId, { rejectWithValue }) => {
        try {
            const stats = await jobDetailAPI.getJobStats(jobId);
            return stats;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch job stats'
            );
        }
    }
);

export const closeJob = createAsyncThunk(
    'jobDetail/closeJob',
    async (jobId, { rejectWithValue }) => {
        try {
            const result = await jobDetailAPI.closeJob(jobId);
            return result;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to close job'
            );
        }
    }
);

export const reopenJob = createAsyncThunk(
    'jobDetail/reopenJob',
    async (jobId, { rejectWithValue }) => {
        try {
            const result = await jobDetailAPI.reopenJob(jobId);
            return result;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to reopen job'
            );
        }
    }
);

export const deleteJob = createAsyncThunk(
    'jobDetail/deleteJob',
    async (jobId, { rejectWithValue }) => {
        try {
            await jobDetailAPI.deleteJob(jobId);
            return jobId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete job'
            );
        }
    }
);

const initialState = {
    job: null,
    stats: {
        totalApplications: 0,
        newApplications: 0,
        shortlisted: 0,
        rejected: 0
    },
    loading: false,
    error: null,
    success: false,
    successMessage: ''
};

const jobDetailSlice = createSlice({
    name: 'jobDetail',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
        // Fetch Job Details
        builder
            .addCase(fetchJobDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.job = action.payload;
            })
            .addCase(fetchJobDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch Job Stats
        builder
            .addCase(fetchJobStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJobStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchJobStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Close Job
        builder
            .addCase(closeJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(closeJob.fulfilled, (state, action) => {
                state.loading = false;
                if (state.job) {
                    state.job.status = 'Closed';
                }
                state.success = true;
                state.successMessage = 'Job closed successfully';
            })
            .addCase(closeJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Reopen Job
        builder
            .addCase(reopenJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(reopenJob.fulfilled, (state, action) => {
                state.loading = false;
                if (state.job) {
                    state.job.status = 'Open';
                }
                state.success = true;
                state.successMessage = 'Job reopened successfully';
            })
            .addCase(reopenJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Delete Job
        builder
            .addCase(deleteJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteJob.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Job deleted successfully';
            })
            .addCase(deleteJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSuccess } = jobDetailSlice.actions;
export default jobDetailSlice.reducer;