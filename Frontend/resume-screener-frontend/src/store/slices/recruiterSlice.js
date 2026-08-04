import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import recruiterAPI from '../../api/recruiterAPI.js';

const CACHE_DURATION = 3 * 60 * 1000; // 3 min

export const fetchRecruiterDashboard = createAsyncThunk(
    'recruiter/fetchDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const [jobsData, statsData, candidatesData] = await Promise.all([
                recruiterAPI.getAllJobs(),
                recruiterAPI.getDashboardStats(),
                recruiterAPI.getRecentCandidates()
            ]);
            return { jobs: jobsData, stats: statsData, recentCandidates: candidatesData };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch dashboard');
        }
    },
    {
        condition: (_, { getState }) => {
            const { recruiter } = getState();
            const isFresh =
                recruiter.lastFetched &&
                Date.now() - recruiter.lastFetched < CACHE_DURATION;
            return !isFresh;
        },
    }
);

export const fetchJobById = createAsyncThunk(
    'recruiter/fetchJobById',
    async (jobId, { rejectWithValue }) => {
        try {
            return await recruiterAPI.getJobById(jobId);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch job');
        }
    },
    {
        condition: (jobId, { getState }) => {
            const { recruiter } = getState();
            const isFresh =
                recruiter.currentJob?.id === jobId &&
                recruiter.currentJobFetched &&
                Date.now() - recruiter.currentJobFetched < CACHE_DURATION;
            return !isFresh;
        },
    }
);

export const fetchJobCandidates = createAsyncThunk(
    'recruiter/fetchJobCandidates',
    async (jobId, { rejectWithValue }) => {
        try {
            return await recruiterAPI.getJobCandidates(jobId);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidates');
        }
    },
    {
        condition: (jobId, { getState }) => {
            const { recruiter } = getState();
            const isFresh =
                recruiter.currentCandidatesJobId === jobId &&
                recruiter.currentCandidatesFetched &&
                Date.now() - recruiter.currentCandidatesFetched < CACHE_DURATION;
            return !isFresh;
        },
    }
);

export const fetchCandidateProfile = createAsyncThunk(
    'recruiter/fetchCandidateProfile',
    async (candidateId, { rejectWithValue }) => {
        try {
            return await recruiterAPI.getCandidateProfile(candidateId);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidate profile');
        }
    }
);

export const createJob = createAsyncThunk(
    'recruiter/createJob',
    async (jobData, { rejectWithValue }) => {
        try {
            return await recruiterAPI.createJob(jobData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create job');
        }
    }
);

export const updateJob = createAsyncThunk(
    'recruiter/updateJob',
    async ({ jobId, jobData }, { rejectWithValue }) => {
        try {
            return await recruiterAPI.updateJob(jobId, jobData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update job');
        }
    }
);

export const deleteJob = createAsyncThunk(
    'recruiter/deleteJob',
    async (jobId, { rejectWithValue }) => {
        try {
            await recruiterAPI.deleteJob(jobId);
            return jobId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
        }
    }
);

export const publishJob = createAsyncThunk(
    'recruiter/publishJob',
    async (jobId, { rejectWithValue }) => {
        try {
            return await recruiterAPI.publishJob(jobId);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to publish job');
        }
    }
);

export const updateCandidateStatus = createAsyncThunk(
    'recruiter/updateCandidateStatus',
    async ({ jobId, applicationId, status }, { rejectWithValue }) => {
        try {
            return await recruiterAPI.updateCandidateStatus(jobId, applicationId, status);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update candidate status');
        }
    }
);

const initialState = {
    jobs: [],
    stats: {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        pendingReview: 0
    },
    recentCandidates: [],
    lastFetched: null, // NEW: dashboard cache

    currentJob: null,
    currentJobFetched: null, // NEW
    currentCandidates: [],
    currentCandidatesJobId: null,   // NEW
    currentCandidatesFetched: null, // NEW
    currentCandidate: null,

    loading: false,
    error: null,
    success: false,
    successMessage: '',

    filter: {
        status: 'All',
        department: 'All',
        sortBy: 'recent'
    }
};

const recruiterSlice = createSlice({
    name: 'recruiter',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.filter = { ...state.filter, ...action.payload };
        },
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
            state.successMessage = '';
        },
        resetCurrentJob: (state) => {
            state.currentJob = null;
        },
        resetCurrentCandidate: (state) => {
            state.currentCandidate = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecruiterDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecruiterDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload.jobs;
                state.stats = action.payload.stats;
                state.recentCandidates = action.payload.recentCandidates;
                state.lastFetched = Date.now(); // NEW
            })
            .addCase(fetchRecruiterDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchJobById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentJob = action.payload;
                state.currentJobFetched = Date.now(); // NEW
            })
            .addCase(fetchJobById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchJobCandidates.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                state.currentCandidatesJobId = action.meta.arg; // NEW
            })
            .addCase(fetchJobCandidates.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCandidates = action.payload;
                state.currentCandidatesFetched = Date.now(); // NEW
            })
            .addCase(fetchJobCandidates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchCandidateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCandidateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCandidate = action.payload;
            })
            .addCase(fetchCandidateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(createJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs.push(action.payload);
                state.success = true;
                state.successMessage = 'Job created successfully';
                state.lastFetched = null; // NEW: dashboard cache invalidate
            })
            .addCase(createJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(updateJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateJob.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.jobs.findIndex(job => job.id === action.payload.id);
                if (index !== -1) {
                    state.jobs[index] = action.payload;
                }
                if (state.currentJob && state.currentJob.id === action.payload.id) {
                    state.currentJob = action.payload;
                }
                state.success = true;
                state.successMessage = 'Job updated successfully';
                state.lastFetched = null; // NEW
            })
            .addCase(updateJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(deleteJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = state.jobs.filter(job => job.id !== action.payload);
                state.success = true;
                state.successMessage = 'Job deleted successfully';
                state.lastFetched = null; // NEW
            })
            .addCase(deleteJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(publishJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(publishJob.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.jobs.findIndex(job => job.id === action.payload.id);
                if (index !== -1) {
                    state.jobs[index] = action.payload;
                }
                if (state.currentJob && state.currentJob.id === action.payload.id) {
                    state.currentJob = action.payload;
                }
                state.success = true;
                state.successMessage = 'Job published successfully';
                state.lastFetched = null; // NEW
            })
            .addCase(publishJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(updateCandidateStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCandidateStatus.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentCandidate && state.currentCandidate.id === action.payload.id) {
                    state.currentCandidate = action.payload;
                }
                state.success = true;
                state.successMessage = 'Candidate status updated';
                state.currentCandidatesFetched = null; // NEW: candidates list cache invalidate
            })
            .addCase(updateCandidateStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setFilter, clearError, clearSuccess, resetCurrentJob, resetCurrentCandidate } = recruiterSlice.actions;
export default recruiterSlice.reducer;