import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchJobDetails,
    fetchJobStats,
    closeJob,
    reopenJob,
    deleteJob,
    clearError,
    clearSuccess
} from '../store/slices/jobDetailSlice';
import recruiterAPI from '../api/recruiterAPI';
import RecruiterNavbar from '../components/RecruiterNavbar';
import RecruiterSidebar from '../components/RecruiterSidebar';

function StatusBadge({ status }) {
    const map = {
        Shortlisted: 'bg-success-subtle text-success',
        Pending: 'bg-secondary-subtle text-secondary',
        Processing: 'bg-info-subtle text-info',
        Scored: 'bg-primary-subtle text-primary',
        Rejected: 'bg-danger-subtle text-danger',
        Hired: 'bg-success text-white'
    };
    return (
        <span className={`badge rounded-pill ${map[status] || 'bg-secondary-subtle text-secondary'}`}>
            {status}
        </span>
    );
}

export default function JobDetailDiscription() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [candidatesLoading, setCandidatesLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('score');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { jobId } = useParams();

    const { job, stats, loading, error, success, successMessage } = useSelector(
        state => state.jobDetail
    );

    useEffect(() => {
        if (jobId) {
            dispatch(fetchJobDetails(jobId));
            dispatch(fetchJobStats(jobId));
            loadCandidates();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobId, dispatch]);

    const loadCandidates = async () => {
        setCandidatesLoading(true);
        try {
            const data = await recruiterAPI.getJobCandidates(jobId);
            setCandidates(Array.isArray(data) ? data : []);
        } catch (err) {
            setCandidates([]);
        } finally {
            setCandidatesLoading(false);
        }
    };

    useEffect(() => {
        if (success && successMessage.includes('deleted')) {
            setTimeout(() => navigate('/jobs'), 2000);
        }
    }, [success, successMessage, navigate]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => dispatch(clearSuccess()), 3000);
            return () => clearTimeout(timer);
        }
    }, [success, dispatch]);

    const handleCloseJob = () => job?.id && dispatch(closeJob(job.id));
    const handleReopenJob = () => job?.id && dispatch(reopenJob(job.id));
    const handleDeleteJob = () => {
        if (job?.id) {
            dispatch(deleteJob(job.id));
            setShowDeleteModal(false);
        }
    };
    const handleEditJob = () => navigate(`/jobs/${jobId}/edit`);

    const avgMatchScore = useMemo(() => {
        if (!candidates.length) return 0;
        const total = candidates.reduce((sum, c) => sum + (c.matchScore || 0), 0);
        return Math.round(total / candidates.length);
    }, [candidates]);

    const daysOpen = useMemo(() => {
        if (!job?.postedDate) return 0;
        const diff = Date.now() - new Date(job.postedDate).getTime();
        return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    }, [job]);

    const filteredCandidates = useMemo(() => {
        let list = [...candidates];

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            list = list.filter(
                (c) =>
                    c.name?.toLowerCase().includes(term) ||
                    c.email?.toLowerCase().includes(term)
            );
        }

        if (sortBy === 'score') {
            list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        } else if (sortBy === 'recent') {
            list.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
        }

        return list;
    }, [candidates, searchTerm, sortBy]);

    if (loading && !job) {
        return (
            <>
                <RecruiterNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
                    <RecruiterSidebar isOpen={sidebarOpen} />
                    <main className="flex-grow-1 d-flex align-items-center justify-content-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </main>
                </div>
            </>
        );
    }

    if (!job) {
        return (
            <>
                <RecruiterNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
                    <RecruiterSidebar isOpen={sidebarOpen} />
                    <main className="flex-grow-1 p-4">
                        <div className="alert alert-info">Job not found</div>
                    </main>
                </div>
            </>
        );
    }

    return (
        <>
            <RecruiterNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
                <RecruiterSidebar isOpen={sidebarOpen} />
                <main className="flex-grow-1" style={{ backgroundColor: '#f8f9fa', overflow: 'auto' }}>
                    <div className="p-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {error}
                                <button type="button" className="btn-close" onClick={() => dispatch(clearError())}></button>
                            </div>
                        )}
                        {success && successMessage && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                {successMessage}
                                <button type="button" className="btn-close" onClick={() => dispatch(clearSuccess())}></button>
                            </div>
                        )}

                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb" className="mb-3">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <a href="#" className="text-primary" onClick={(e) => { e.preventDefault(); navigate('/jobs'); }}>
                                        Jobs
                                    </a>
                                </li>
                                <li className="breadcrumb-item active">{job.title}</li>
                            </ol>
                        </nav>

                        {/* Header */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body d-flex flex-wrap justify-content-between align-items-start gap-3">
                                <div>
                                    <h2 className="mb-2">{job.title}</h2>
                                    <div className="d-flex flex-wrap gap-3 text-muted small">
                                        <span><i className="bi bi-building me-1"></i>{job.department}</span>
                                        <span><i className="bi bi-geo-alt me-1"></i>{job.location}</span>
                                        <span><i className="bi bi-briefcase me-1"></i>{job.employmentType}</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className={`badge ${
                                        job.status === 'Open' ? 'bg-success' :
                                        job.status === 'Closed' ? 'bg-danger' : 'bg-warning'
                                    }`}>
                                        {job.status}
                                    </span>
                                    <button className="btn btn-outline-primary btn-sm" onClick={handleEditJob}>
                                        <i className="bi bi-pencil me-1"></i>Edit Job
                                    </button>
                                    {job.status === 'Open' ? (
                                        <button className="btn btn-outline-danger btn-sm" onClick={handleCloseJob} disabled={loading}>
                                            Close Job
                                        </button>
                                    ) : (
                                        <button className="btn btn-outline-success btn-sm" onClick={handleReopenJob} disabled={loading}>
                                            Reopen Job
                                        </button>
                                    )}
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => setShowDeleteModal(true)} disabled={loading}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body">
                                        <small className="text-muted d-block mb-1">Total Applicants</small>
                                        <h3 className="text-primary mb-0">{stats.totalApplications}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body">
                                        <small className="text-muted d-block mb-1">Avg. Match Score</small>
                                        <h3 className="mb-1">{avgMatchScore}%</h3>
                                        <div className="progress" style={{ height: '4px' }}>
                                            <div className="progress-bar bg-primary" style={{ width: `${avgMatchScore}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body">
                                        <small className="text-muted d-block mb-1">Shortlisted</small>
                                        <h3 className="text-success mb-0">{stats.shortlisted}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body">
                                        <small className="text-muted d-block mb-1">Days Open</small>
                                        <h3 className="mb-0">{daysOpen}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Description + Details + Requirements + Skills */}
                        <div className="row g-4 mb-4">
                            <div className="col-lg-8">
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">Job Description</h5>
                                        <p className="text-muted" style={{ lineHeight: '1.6' }}>{job.description}</p>
                                    </div>
                                </div>

                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">Requirements</h5>
                                        <ul className="list-group list-group-flush">
                                            {job.requirements && job.requirements.map((req, idx) => (
                                                <li key={idx} className="list-group-item px-0 py-2">
                                                    <i className="bi bi-check-circle text-success me-2"></i>{req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="card border-0 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">Required Skills</h5>
                                        <div className="d-flex flex-wrap gap-2">
                                            {job.skills && job.skills.map((skill, idx) => (
                                                <span key={idx} className="badge bg-primary">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">Job Details</h5>
                                        <p className="text-muted small mb-1">Department</p>
                                        <p className="fw-bold">{job.department}</p>
                                        <p className="text-muted small mb-1">Employment Type</p>
                                        <p className="fw-bold">{job.employmentType}</p>
                                        <p className="text-muted small mb-1">Salary</p>
                                        <p className="fw-bold">{job.salary}</p>
                                        <p className="text-muted small mb-1">Posted</p>
                                        <p className="fw-bold mb-0">{new Date(job.postedDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Candidates Table */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                                    <div>
                                        <h5 className="mb-1">Candidates</h5>
                                        <small className="text-muted">
                                            Screening {candidates.length} candidates against role requirements
                                        </small>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <div className="input-group" style={{ width: '220px' }}>
                                            <span className="input-group-text bg-light border-0">
                                                <i className="bi bi-search text-muted"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control bg-light border-0"
                                                placeholder="Search by name, email..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <select
                                            className="form-select"
                                            style={{ width: '160px' }}
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option value="score">Sort: Match Score</option>
                                            <option value="recent">Sort: Recent</option>
                                        </select>
                                    </div>
                                </div>

                                {candidatesLoading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                    </div>
                                ) : filteredCandidates.length === 0 ? (
                                    <div className="text-center py-5 text-muted">No candidates found for this job yet.</div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table align-middle">
                                            <thead>
                                                <tr className="text-muted small text-uppercase">
                                                    <th>Candidate</th>
                                                    <th>Match Score</th>
                                                    <th>Applied Date</th>
                                                    <th>Status</th>
                                                    <th className="text-end">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredCandidates.map((c) => (
                                                    <tr key={c.id}>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div
                                                                    className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center fw-bold text-primary"
                                                                    style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}
                                                                >
                                                                    {c.name?.charAt(0) || '?'}
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold">{c.name}</div>
                                                                    <small className="text-muted">{c.email}</small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ minWidth: '140px' }}>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div className="progress flex-grow-1" style={{ height: '5px' }}>
                                                                    <div
                                                                        className="progress-bar bg-primary"
                                                                        style={{ width: `${c.matchScore || 0}%` }}
                                                                    ></div>
                                                                </div>
                                                                <small className="fw-semibold">{c.matchScore || 0}%</small>
                                                            </div>
                                                        </td>
                                                        <td className="text-muted small">
                                                            {new Date(c.appliedDate).toLocaleDateString()}
                                                        </td>
                                                        <td>
                                                            <StatusBadge status={c.status} />
                                                        </td>
                                                        <td className="text-end">
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => navigate(`/candidate/${c.candidateId}`)}
                                                            >
                                                                View Profile
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Delete Confirmation Modal */}
            <div className={`modal ${showDeleteModal ? 'show d-block' : ''}`} style={{ backgroundColor: showDeleteModal ? 'rgba(0,0,0,0.5)' : '' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete Job</h5>
                            <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this job posting? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-danger" onClick={handleDeleteJob} disabled={loading}>
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}