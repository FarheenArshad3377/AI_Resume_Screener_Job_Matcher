import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import recruiterAPI from '../../api/recruiterApi.js';

// Async thunks
export const fetchRecruiterDashboard = createAsyncThunk(
    'recruiter/fetchDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const [jobsData, statsData, candidatesData] = await Promise.all([
                recruiterAPI.getAllJobs(),
                recruiterAPI.getDashboardStats(),
                recruiterAPI.getRecentCandidates()
            ]);

            return {
                jobs: jobsData,
                stats: statsData,
                recentCandidates: candidatesData
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch dashboard'
            );
        }
    }
);

export const fetchJobById = createAsyncThunk(
    'recruiter/fetchJobById',
    async (jobId, { rejectWithValue }) => {
        try {
            const job = await recruiterAPI.getJobById(jobId);
            return job;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch job'
            );
        }
    }
);

export const fetchJobCandidates = createAsyncThunk(
    'recruiter/fetchJobCandidates',
    async (jobId, { rejectWithValue }) => {
        try {
            const candidates = await recruiterAPI.getJobCandidates(jobId);
            return candidates;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch candidates'
            );
        }
    }
);

export const fetchCandidateProfile = createAsyncThunk(
    'recruiter/fetchCandidateProfile',
    async (candidateId, { rejectWithValue }) => {
        try {
            const candidate = await recruiterAPI.getCandidateProfile(candidateId);
            return candidate;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch candidate profile'
            );
        }
    }
);

export const createJob = createAsyncThunk(
    'recruiter/createJob',
    async (jobData, { rejectWithValue }) => {
        try {
            const newJob = await recruiterAPI.createJob(jobData);
            return newJob;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create job'
            );
        }
    }
);

export const updateJob = createAsyncThunk(
    'recruiter/updateJob',
    async ({ jobId, jobData }, { rejectWithValue }) => {
        try {
            const updatedJob = await recruiterAPI.updateJob(jobId, jobData);
            return updatedJob;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update job'
            );
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
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete job'
            );
        }
    }
);

export const publishJob = createAsyncThunk(
    'recruiter/publishJob',
    async (jobId, { rejectWithValue }) => {
        try {
            const publishedJob = await recruiterAPI.publishJob(jobId);
            return publishedJob;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to publish job'
            );
        }
    }
);

export const updateCandidateStatus = createAsyncThunk(
    'recruiter/updateCandidateStatus',
    async ({ jobId, applicationId, status }, { rejectWithValue }) => {   // 👈 changed
        try {
            const updatedCandidate = await recruiterAPI.updateCandidateStatus(jobId, applicationId, status);
            return updatedCandidate;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update candidate status'
            );
        }
    }
);

const initialState = {
    // Dashboard data
    jobs: [],
    stats: {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        pendingReview: 0
    },
    recentCandidates: [],

    // Current items
    currentJob: null,
    currentCandidates: [],
    currentCandidate: null,

    // UI state
    loading: false,
    error: null,
    success: false,
    successMessage: '',

    // Filters
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
            state.filter = {
                ...state.filter,
                ...action.payload
            };
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
        // Fetch Dashboard
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
            })
            .addCase(fetchRecruiterDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch Job By ID
        builder
            .addCase(fetchJobById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentJob = action.payload;
            })
            .addCase(fetchJobById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch Job Candidates
        builder
            .addCase(fetchJobCandidates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobCandidates.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCandidates = action.payload;
            })
            .addCase(fetchJobCandidates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch Candidate Profile
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

        // Create Job
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
            })
            .addCase(createJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update Job
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
            })
            .addCase(updateJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Delete Job
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
            })
            .addCase(deleteJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Publish Job
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
            })
            .addCase(publishJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update Candidate Status
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
            })
            .addCase(updateCandidateStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setFilter, clearError, clearSuccess, resetCurrentJob, resetCurrentCandidate } = recruiterSlice.actions;
export default recruiterSlice.reducer;