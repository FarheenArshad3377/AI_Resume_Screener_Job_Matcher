
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jobAPI from '../../api/jobApi';
 
// Async thunks
export const createJob = createAsyncThunk(
    'job/createJob',
    async (jobData, { rejectWithValue }) => {
        try {
            const newJob = await jobAPI.createJob(jobData);
            return newJob;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create job'
            );
        }
    }
);
 
export const fetchJobById = createAsyncThunk(
    'job/fetchJobById',
    async (jobId, { rejectWithValue }) => {
        try {
            const job = await jobAPI.getJobById(jobId);
            return job;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch job'
            );
        }
    }
);
 
export const updateJob = createAsyncThunk(
    'job/updateJob',
    async ({ jobId, jobData }, { rejectWithValue }) => {
        try {
            const updatedJob = await jobAPI.updateJob(jobId, jobData);
            return updatedJob;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update job'
            );
        }
    }
);
 
export const publishJob = createAsyncThunk(
    'job/publishJob',
    async (jobId, { rejectWithValue }) => {
        try {
            const publishedJob = await jobAPI.publishJob(jobId);
            return publishedJob;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to publish job'
            );
        }
    }
);
 
export const fetchDepartments = createAsyncThunk(
    'job/fetchDepartments',
    async (_, { rejectWithValue }) => {
        try {
            const departments = await jobAPI.getDepartments();
            return departments;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch departments'
            );
        }
    }
);
 
export const fetchEmploymentTypes = createAsyncThunk(
    'job/fetchEmploymentTypes',
    async (_, { rejectWithValue }) => {
        try {
            const types = await jobAPI.getEmploymentTypes();
            return types;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch employment types'
            );
        }
    }
);
 
export const fetchSkills = createAsyncThunk(
    'job/fetchSkills',
    async (_, { rejectWithValue }) => {
        try {
            const skills = await jobAPI.getSkills();
            return skills;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch skills'
            );
        }
    }
);
 
const initialState = {
    // Form data
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
 
    // Current job (for editing)
    currentJob: null,
 
    // Dropdown options
    departments: [],
    employmentTypes: [],
    skills: [],
 
    // UI state
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
            state.formData = {
                ...state.formData,
                ...action.payload
            };
        },
 
        resetFormData: (state) => {
            state.formData = {
                title: '',
                department: '',
                description: '',
                location: '',
                employmentType: '',
                salary: '',
                requirements: [],
                skills: []
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
            state.formData.skills = state.formData.skills.filter(
                skill => skill !== action.payload
            );
        },
 
        addRequirement: (state, action) => {
            state.formData.requirements.push(action.payload);
        },
 
        removeRequirement: (state, action) => {
            state.formData.requirements = state.formData.requirements.filter(
                (_, idx) => idx !== action.payload
            );
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
        // Create Job
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
 
        // Fetch Job By ID
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
            })
            .addCase(fetchJobById.rejected, (state, action) => {
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
                state.success = true;
                state.successMessage = 'Job updated successfully!';
                state.currentJob = action.payload;
            })
            .addCase(updateJob.rejected, (state, action) => {
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
                state.success = true;
                state.successMessage = 'Job published successfully!';
                state.currentJob = action.payload;
            })
            .addCase(publishJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
 
        // Fetch Departments
        builder
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.departments = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchDepartments.rejected, (state) => {
                state.departments = [];
            });
 
        // Fetch Employment Types
        builder
            .addCase(fetchEmploymentTypes.fulfilled, (state, action) => {
                state.employmentTypes = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchEmploymentTypes.rejected, (state) => {
                state.employmentTypes = [];
            });
 
        // Fetch Skills
        builder
            .addCase(fetchSkills.fulfilled, (state, action) => {
                state.skills = Array.isArray(action.payload) ? action.payload : [];
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