import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    setFormData,
    resetFormData,
    addSkill,
    removeSkill,
    addRequirement,
    removeRequirement,
    createJob,
    updateJob,
    publishJob,
    fetchJobById,
    fetchDepartments,
    fetchEmploymentTypes,
    fetchSkills,
    clearError,
    clearSuccess
} from '../store/slices/jobSlice';
import RecruiterNavbar from '../components/RecruiterNavbar';
import RecruiterSidebar from '../components/RecruiterSidebar';

const emptyFormData = {
    title: '',
    department: '',
    description: '',
    location: '',
    employmentType: '',
    salary: '',
    requirements: [],
    skills: []
};

export default function PostJobPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [newRequirement, setNewRequirement] = useState('');
    const [newSkill, setNewSkill] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { jobId } = useParams();
    const jobState = useSelector((state) => state.job || {});

    const {
        formData,
        loading,
        error,
        success,
        successMessage
    } = jobState;

    const safeFormData = formData || emptyFormData;

    const departments = Array.isArray(jobState.departments)
        ? jobState.departments
        : Array.isArray(jobState.departments?.data)
        ? jobState.departments.data
        : [];

    const employmentTypes = Array.isArray(jobState.employmentTypes)
        ? jobState.employmentTypes
        : Array.isArray(jobState.employmentTypes?.data)
        ? jobState.employmentTypes.data
        : [];

    // Fetch options on mount
    useEffect(() => {
        dispatch(fetchDepartments());
        dispatch(fetchEmploymentTypes());
        dispatch(fetchSkills());
    }, [dispatch]);

    // Fetch job if editing
    useEffect(() => {
        if (jobId) {
            dispatch(fetchJobById(jobId));
        } else {
            dispatch(resetFormData());
        }
    }, [jobId, dispatch]);

    // Auto-redirect on success
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate('/jobs');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        dispatch(setFormData({ [name]: value }));
    };

    const handleAddRequirement = () => {
        if (newRequirement.trim()) {
            dispatch(addRequirement(newRequirement.trim()));
            setNewRequirement('');
        }
    };

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            dispatch(addSkill(newSkill.trim()));
            setNewSkill('');
        }
    };

    // action: 'draft' | 'publish'
    const handleSubmit = async (e, action = 'draft') => {
        e.preventDefault();

        if (!safeFormData.title || !safeFormData.department || !safeFormData.description) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            if (jobId) {
                // Editing an existing job -> just update it
                await dispatch(updateJob({ jobId, jobData: safeFormData })).unwrap();
            } else {
                // Creating a new job
                const newJob = await dispatch(createJob(safeFormData)).unwrap();

                // If "Save & Publish" was clicked, immediately publish the newly created job
                if (action === 'publish' && newJob?.id) {
                    await dispatch(publishJob(newJob.id)).unwrap();
                }
            }
        } catch (err) {
            // error is already captured in redux state via the rejected case
        }
    };

    const handlePublish = async () => {
        if (!jobId) return;
        try {
            await dispatch(publishJob(jobId)).unwrap();
        } catch (err) {
            // error already captured in redux state
        }
    };

    return (
        <>
            <RecruiterNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
                <RecruiterSidebar isOpen={sidebarOpen} />
                <main className="flex-grow-1" style={{ backgroundColor: '#f8f9fa', overflow: 'auto' }}>
                    <div className="p-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
                        {/* Error Alert */}
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {error}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => dispatch(clearError())}
                                ></button>
                            </div>
                        )}

                        {/* Success Alert */}
                        {success && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                {successMessage}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => dispatch(clearSuccess())}
                                ></button>
                            </div>
                        )}

                        {/* Page Header */}
                        <div className="mb-4">
                            <h1 className="mb-2">
                                {jobId ? 'Edit Job' : 'Post New Job'}
                            </h1>
                            <p className="text-muted">
                                Fill in the details below to {jobId ? 'update' : 'create'} a job posting.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    {/* Basic Information */}
                                    <h5 className="mb-3">Basic Information</h5>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Job Title *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="title"
                                                value={safeFormData.title}
                                                onChange={handleFormChange}
                                                placeholder="e.g., Senior Frontend Engineer"
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Department *</label>
                                            <select
                                                className="form-select"
                                                name="department"
                                                value={safeFormData.department}
                                                onChange={handleFormChange}
                                                required
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((dept) => (
                                                    <option key={dept.id} value={dept.name}>
                                                        {dept.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Location</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="location"
                                                value={safeFormData.location}
                                                onChange={handleFormChange}
                                                placeholder="e.g., San Francisco, CA"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Employment Type</label>
                                            <select
                                                className="form-select"
                                                name="employmentType"
                                                value={safeFormData.employmentType}
                                                onChange={handleFormChange}
                                            >
                                                <option value="">Select Type</option>
                                                {employmentTypes.map((type) => (
                                                    <option key={type.id} value={type.name}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Salary Range</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="salary"
                                                value={safeFormData.salary}
                                                onChange={handleFormChange}
                                                placeholder="e.g., $140k - $180k"
                                            />
                                        </div>
                                    </div>

                                    <hr />

                                    {/* Job Description */}
                                    <h5 className="mb-3">Job Description</h5>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Description *</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            value={safeFormData.description}
                                            onChange={handleFormChange}
                                            rows="5"
                                            placeholder="Describe the job role and responsibilities..."
                                            required
                                        ></textarea>
                                        <small className={`text-${safeFormData.description.length < 50 ? 'danger' : 'muted'}`}>
                                            {safeFormData.description.length}/50 characters minimum
                                        </small>
                                    </div>

                                    <hr />

                                    {/* Requirements */}
                                    <h5 className="mb-3">Requirements</h5>

                                    <div className="mb-3">
                                        <div className="input-group mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newRequirement}
                                                onChange={(e) => setNewRequirement(e.target.value)}
                                                placeholder="Add a requirement"
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary"
                                                onClick={handleAddRequirement}
                                            >
                                                <i className="bi bi-plus"></i> Add
                                            </button>
                                        </div>

                                        <div className="d-flex flex-wrap gap-2">
                                            {(safeFormData.requirements || []).map((req, idx) => (
                                                <div
                                                    key={idx}
                                                    className="badge bg-light text-dark d-flex align-items-center gap-2 p-2"
                                                >
                                                    {req}
                                                    <button
                                                        type="button"
                                                        className="btn-close btn-close-dark"
                                                        onClick={() => dispatch(removeRequirement(idx))}
                                                    ></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <hr />

                                    {/* Skills */}
                                    <h5 className="mb-3">Required Skills</h5>

                                    <div className="mb-4">
                                        <div className="input-group mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                placeholder="Add a skill"
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary"
                                                onClick={handleAddSkill}
                                            >
                                                <i className="bi bi-plus"></i> Add
                                            </button>
                                        </div>

                                        <div className="d-flex flex-wrap gap-2">
                                            {(safeFormData.skills || []).map((skill, idx) => (
                                                <div
                                                    key={idx}
                                                    className="badge bg-primary d-flex align-items-center gap-2 p-2"
                                                    style={{ color: 'white' }}
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        className="btn-close btn-close-white"
                                                        onClick={() => dispatch(removeSkill(skill))}
                                                    ></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-outline-primary"
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : jobId ? 'Update Draft' : 'Save as Draft'}
                                        </button>

                                        {jobId && (
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={handlePublish}
                                                disabled={loading}
                                            >
                                                {loading ? 'Publishing...' : 'Publish Job'}
                                            </button>
                                        )}

                                        {!jobId && (
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={(e) => handleSubmit(e, 'publish')}
                                                disabled={loading}
                                            >
                                                {loading ? 'Publishing...' : 'Save & Publish'}
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate('/jobs')}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}