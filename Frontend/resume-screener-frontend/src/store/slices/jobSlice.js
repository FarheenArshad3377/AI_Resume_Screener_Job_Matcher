import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jobAPI from '../../api/jobAPI.js';

const DROPDOWN_CACHE_DURATION = 10 * 60 * 1000; // 10 min — dropdowns rarely change
const JOB_CACHE_DURATION = 3 * 60 * 1000;

export const createJob = createAsyncThunk(
    'job/createJob',
    async (jobData, { rejectWithValue }) => {
        try {
            return await jobAPI.createJob(jobData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create job');
        }
    }
);

export const fetchJobById = createAsyncThunk(
    'job/fetchJobById',
    async (jobId, { rejectWithValue }) => {
        try {
            return await jobAPI.getJobById(jobId);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch job');
        }
    },
    {
        condition: (jobId, { getState }) => {
            const { job } = getState();
            const isFresh =
                job.currentJob?.id === jobId &&
                job.lastFetched &&
                Date.now() - job.lastFetched < JOB_CACHE_DURATION;
            return !isFresh;
        },
    }
);

export const updateJob = createAsyncThunk(
    'job/updateJob',
    async ({ jobId, jobData }, { rejectWithValue }) => {
        try {
            return await jobAPI.updateJob(jobId, jobData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update job');
        }
    }
);

export const publishJob = createAsyncThunk(
    'job/publishJob',
    async (jobId, { rejectWithValue }) => {
        try {
            return await jobAPI.publishJob(jobId);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to publish job');
        }
    }
);

export const fetchDepartments = createAsyncThunk(
    'job/fetchDepartments',
    async (_, { rejectWithValue }) => {
        try {
            return await jobAPI.getDepartments();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
        }
    },
    {
        condition: (_, { getState }) => {
            const { job } = getState();
            const isFresh =
                job.departments.length > 0 &&
                job.departmentsFetched &&
                Date.now() - job.departmentsFetched < DROPDOWN_CACHE_DURATION;
            return !isFresh;
        },
    }
);

export const fetchEmploymentTypes = createAsyncThunk(
    'job/fetchEmploymentTypes',
    async (_, { rejectWithValue }) => {
        try {
            return await jobAPI.getEmploymentTypes();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch employment types');
        }
    },
    {
        condition: (_, { getState }) => {
            const { job } = getState();
            const isFresh =
                job.employmentTypes.length > 0 &&
                job.employmentTypesFetched &&
                Date.now() - job.employmentTypesFetched < DROPDOWN_CACHE_DURATION;
            return !isFresh;
        },
    }
);

export const fetchSkills = createAsyncThunk(
    'job/fetchSkills',
    async (_, { rejectWithValue }) => {
        try {
            return await jobAPI.getSkills();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch skills');
        }
    },
    {
        condition: (_, { getState }) => {
            const { job } = getState();
            const isFresh =
                job.skills.length > 0 &&
                job.skillsFetched &&
                Date.now() - job.skillsFetched < DROPDOWN_CACHE_DURATION;
            return !isFresh;
        },
    }
);

const initialState = {
    formData: {
        title: '',
        department: '',
        description: '',
        location: '',
        employmentType: '',
        salary: '',
        requirements: [],
        skills: []
    },

    currentJob: null,
    lastFetched: null, // NEW

    departments: [],
    departmentsFetched: null, // NEW
    employmentTypes: [],
    employmentTypesFetched: null, // NEW
    skills: [],
    skillsFetched: null, // NEW

    loading: false,
    error: null,
    success: false,
    successMessage: '',
    isEditing: false
};

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {
        setFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        resetFormData: (state) => {
            state.formData = {
                title: '', department: '', description: '', location: '',
                employmentType: '', salary: '', requirements: [], skills: []
            };
            state.isEditing = false;
            state.currentJob = null;
        },
        addSkill: (state, action) => {
            if (!state.formData.skills.includes(action.payload)) {
                state.formData.skills.push(action.payload);
            }
        },
        removeSkill: (state, action) => {
            state.formData.skills = state.formData.skills.filter(skill => skill !== action.payload);
        },
        addRequirement: (state, action) => {
            state.formData.requirements.push(action.payload);
        },
        removeRequirement: (state, action) => {
            state.formData.requirements = state.formData.requirements.filter((_, idx) => idx !== action.payload);
        },
        setIsEditing: (state, action) => {
            state.isEditing = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
            state.successMessage = '';
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(createJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Job created successfully!';
                state.currentJob = action.payload;
                state.formData = initialState.formData;
            })
            .addCase(createJob.rejected, (state, action) => {
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
                const job = action.payload || {};
                state.currentJob = job;
                state.formData = {
                    title: job.title || '',
                    department: job.department || '',
                    description: job.description || '',
                    location: job.location || '',
                    employmentType: job.employmentType || '',
                    salary: job.salary || '',
                    requirements: job.requirements || [],
                    skills: job.skills || []
                };
                state.isEditing = true;
                state.lastFetched = Date.now(); // NEW
            })
            .addCase(fetchJobById.rejected, (state, action) => {
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
                state.success = true;
                state.successMessage = 'Job updated successfully!';
                state.currentJob = action.payload;
                state.lastFetched = Date.now(); // NEW: fresh data hai already
            })
            .addCase(updateJob.rejected, (state, action) => {
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
                state.success = true;
                state.successMessage = 'Job published successfully!';
                state.currentJob = action.payload;
            })
            .addCase(publishJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.departments = Array.isArray(action.payload) ? action.payload : [];
                state.departmentsFetched = Date.now(); // NEW
            })
            .addCase(fetchDepartments.rejected, (state) => {
                state.departments = [];
            });

        builder
            .addCase(fetchEmploymentTypes.fulfilled, (state, action) => {
                state.employmentTypes = Array.isArray(action.payload) ? action.payload : [];
                state.employmentTypesFetched = Date.now(); // NEW
            })
            .addCase(fetchEmploymentTypes.rejected, (state) => {
                state.employmentTypes = [];
            });

        builder
            .addCase(fetchSkills.fulfilled, (state, action) => {
                state.skills = Array.isArray(action.payload) ? action.payload : [];
                state.skillsFetched = Date.now(); // NEW
            })
            .addCase(fetchSkills.rejected, (state) => {
                state.skills = [];
            });
    }
});

export const {
    setFormData,
    resetFormData,
    addSkill,
    removeSkill,
    addRequirement,
    removeRequirement,
    setIsEditing,
    clearError,
    clearSuccess
} = jobSlice.actions;

export default jobSlice.reducer;