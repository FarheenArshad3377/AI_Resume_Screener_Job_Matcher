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

    useEffect(() => {
        dispatch(fetchDepartments());
        dispatch(fetchEmploymentTypes());
        dispatch(fetchSkills());
    }, [dispatch]);

    useEffect(() => {
        if (jobId) {
            dispatch(fetchJobById(jobId));
        } else {
            dispatch(resetFormData());
        }
    }, [jobId, dispatch]);

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

    const handleSubmit = async (e, action = 'draft') => {
        e.preventDefault();

        if (!safeFormData.title || !safeFormData.department || !safeFormData.description) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            if (jobId) {
                await dispatch(updateJob({ jobId, jobData: safeFormData })).unwrap();
            } else {
                const newJob = await dispatch(createJob(safeFormData)).unwrap();

                if (action === 'publish' && newJob?.id) {
                    await dispatch(publishJob(newJob.id)).unwrap();
                }
            }
        } catch (err) {
            // error already captured in redux state
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
        <div className="rp-landing rp-dash">
            <div className="rp-blob rp-blob-1" />
            <div className="rp-blob rp-blob-2" />

            <RecruiterNavbar toggleSidebar={() => {}} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <main className="p-4">
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                        {error && (
                            <div className="rp-auth-alert d-flex justify-content-between align-items-center">
                                <span>{error}</span>
                                <button className="rp-btn-outline btn-sm" onClick={() => dispatch(clearError())}>Dismiss</button>
                            </div>
                        )}

                        {success && (
                            <div className="rp-auth-alert-success rp-auth-alert d-flex justify-content-between align-items-center">
                                <span>{successMessage}</span>
                                <button className="rp-btn-outline btn-sm" onClick={() => dispatch(clearSuccess())}>Dismiss</button>
                            </div>
                        )}

                        <div className="mb-4">
                            <h3 className="fw-bold mb-1" style={{ color: 'var(--rp-text)' }}>
                                {jobId ? 'Edit Job' : 'Post New Job'}
                            </h3>
                            <p style={{ color: 'var(--rp-text-muted)' }}>
                                Fill in the details below to {jobId ? 'update' : 'create'} a job posting.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="rp-apply-card">

                                {/* Basic Information */}
                                <h5 className="fw-bold mb-3" style={{ color: 'var(--rp-text)' }}>Basic Information</h5>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="rp-auth-label">Job Title *</label>
                                        <input
                                            type="text"
                                            className="form-control rp-apply-input"
                                            name="title"
                                            value={safeFormData.title}
                                            onChange={handleFormChange}
                                            placeholder="e.g., Senior Frontend Engineer"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="rp-auth-label">Department *</label>
                                        <select
                                            className="form-select rp-apply-input"
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
                                        <label className="rp-auth-label">Location</label>
                                        <input
                                            type="text"
                                            className="form-control rp-apply-input"
                                            name="location"
                                            value={safeFormData.location}
                                            onChange={handleFormChange}
                                            placeholder="e.g., San Francisco, CA"
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="rp-auth-label">Employment Type</label>
                                        <select
                                            className="form-select rp-apply-input"
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
                                        <label className="rp-auth-label">Salary Range</label>
                                        <input
                                            type="text"
                                            className="form-control rp-apply-input"
                                            name="salary"
                                            value={safeFormData.salary}
                                            onChange={handleFormChange}
                                            placeholder="e.g., $140k - $180k"
                                        />
                                    </div>
                                </div>

                                <hr style={{ borderColor: 'var(--rp-border)' }} />

                                {/* Job Description */}
                                <h5 className="fw-bold mb-3 mt-3" style={{ color: 'var(--rp-text)' }}>Job Description</h5>

                                <div className="mb-3">
                                    <label className="rp-auth-label">Description *</label>
                                    <textarea
                                        className="form-control rp-apply-textarea"
                                        name="description"
                                        value={safeFormData.description}
                                        onChange={handleFormChange}
                                        rows="5"
                                        placeholder="Describe the job role and responsibilities..."
                                        required
                                    ></textarea>
                                    <small style={{ color: safeFormData.description.length < 50 ? '#f87171' : 'var(--rp-text-muted)' }}>
                                        {safeFormData.description.length}/50 characters minimum
                                    </small>
                                </div>

                                <hr style={{ borderColor: 'var(--rp-border)' }} />

                                {/* Requirements */}
                                <h5 className="fw-bold mb-3 mt-3" style={{ color: 'var(--rp-text)' }}>Requirements</h5>

                                <div className="mb-3">
                                    <div className="input-group mb-2">
                                        <input
                                            type="text"
                                            className="form-control rp-apply-input"
                                            value={newRequirement}
                                            onChange={(e) => setNewRequirement(e.target.value)}
                                            placeholder="Add a requirement"
                                        />
                                        <button
                                            type="button"
                                            className="rp-btn-outline btn-sm"
                                            onClick={handleAddRequirement}
                                        >
                                            <i className="bi bi-plus"></i> Add
                                        </button>
                                    </div>

                                    <div className="d-flex flex-wrap gap-2">
                                        {(safeFormData.requirements || []).map((req, idx) => (
                                            <div
                                                key={idx}
                                                className="badge rounded-pill rp-badge-muted d-flex align-items-center gap-2 p-2"
                                            >
                                                {req}
                                                <i
                                                    className="bi bi-x-circle"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => dispatch(removeRequirement(idx))}
                                                ></i>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <hr style={{ borderColor: 'var(--rp-border)' }} />

                                {/* Skills */}
                                <h5 className="fw-bold mb-3 mt-3" style={{ color: 'var(--rp-text)' }}>Required Skills</h5>

                                <div className="mb-4">
                                    <div className="input-group mb-2">
                                        <input
                                            type="text"
                                            className="form-control rp-apply-input"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            placeholder="Add a skill"
                                        />
                                        <button
                                            type="button"
                                            className="rp-btn-outline btn-sm"
                                            onClick={handleAddSkill}
                                        >
                                            <i className="bi bi-plus"></i> Add
                                        </button>
                                    </div>

                                    <div className="d-flex flex-wrap gap-2">
                                        {(safeFormData.skills || []).map((skill, idx) => (
                                            <div
                                                key={idx}
                                                className="badge rounded-pill rp-badge-accent d-flex align-items-center gap-2 p-2"
                                            >
                                                {skill}
                                                <i
                                                    className="bi bi-x-circle"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => dispatch(removeSkill(skill))}
                                                ></i>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="rp-btn-outline btn-sm"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : jobId ? 'Update Draft' : 'Save as Draft'}
                                    </button>

                                    {jobId && (
                                        <button
                                            type="button"
                                            className="rp-btn-gradient btn-sm"
                                            onClick={handlePublish}
                                            disabled={loading}
                                        >
                                            {loading ? 'Publishing...' : 'Publish Job'}
                                        </button>
                                    )}

                                    {!jobId && (
                                        <button
                                            type="button"
                                            className="rp-btn-gradient btn-sm"
                                            onClick={(e) => handleSubmit(e, 'publish')}
                                            disabled={loading}
                                        >
                                            {loading ? 'Publishing...' : 'Save & Publish'}
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className="rp-btn-outline btn-sm"
                                        onClick={() => navigate('/jobs')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}