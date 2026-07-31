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

function StatusBadge({ status }) {
    const map = {
        Shortlisted: 'rp-badge-success',
        Pending: 'rp-badge-muted',
        Processing: 'rp-badge-info',
        Scored: 'rp-badge-accent',
        Rejected: 'rp-badge-danger',
        Hired: 'rp-badge-success'
    };
    return (
        <span className={`badge rounded-pill ${map[status] || 'rp-badge-muted'}`}>
            {status}
        </span>
    );
}

export default function JobDetailDiscription() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false); // 👈 NEW: independent from global loading
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
            setTimeout(() => navigate('/recruiter/jobs'), 2000);
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

    // 👇 UPDATED: uses its own deleteLoading state instead of the global `loading`
   const handleDeleteJob = async () => {
    console.log('🔥🔥🔥 NEW CODE IS RUNNING 🔥🔥🔥');
    if (!job?.id) return;
    setDeleteLoading(true);
    try {
        await dispatch(deleteJob(job.id)).unwrap();
        setShowDeleteModal(false);
    } catch (err) {
        console.error('Delete failed:', err);
    } finally {
        setDeleteLoading(false);
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
            <div className="rp-landing rp-dash">
                <div className="rp-blob rp-blob-1" />
                <div className="rp-blob rp-blob-2" />
                <RecruiterNavbar toggleSidebar={() => {}} />
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 60px)', position: 'relative', zIndex: 1 }}>
                    <div className="spinner-border" style={{ color: 'var(--rp-accent-1)' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="rp-landing rp-dash">
                <div className="rp-blob rp-blob-1" />
                <div className="rp-blob rp-blob-2" />
                <RecruiterNavbar toggleSidebar={() => {}} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <main className="p-4">
                        <div className="rp-auth-alert">Job not found</div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="rp-landing rp-dash">
            <div className="rp-blob rp-blob-1" />
            <div className="rp-blob rp-blob-2" />

            <RecruiterNavbar toggleSidebar={() => {}} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <main className="p-4">
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        {error && (
                            <div className="rp-auth-alert d-flex justify-content-between align-items-center">
                                <span>{error}</span>
                                <button className="rp-btn-outline btn-sm" onClick={() => dispatch(clearError())}>Dismiss</button>
                            </div>
                        )}
                        {success && successMessage && (
                            <div className="rp-auth-alert-success rp-auth-alert d-flex justify-content-between align-items-center">
                                <span>{successMessage}</span>
                                <button className="rp-btn-outline btn-sm" onClick={() => dispatch(clearSuccess())}>Dismiss</button>
                            </div>
                        )}

                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb" className="mb-3">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <a
                                        href="#"
                                        style={{ color: 'var(--rp-accent-2)', textDecoration: 'none' }}
                                        onClick={(e) => { e.preventDefault(); navigate('/recruiter/jobs'); }}
                                    >
                                        Jobs
                                    </a>
                                </li>
                                <li className="breadcrumb-item active" style={{ color: 'var(--rp-text-muted)' }}>{job.title}</li>
                            </ol>
                        </nav>

                        {/* Header */}
                        <div className="rp-apply-card mb-4">
                            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                                <div>
                                    <h3 className="fw-bold mb-2" style={{ color: 'var(--rp-text)' }}>{job.title}</h3>
                                    <div className="d-flex flex-wrap gap-3 small" style={{ color: 'var(--rp-text-muted)' }}>
                                        <span><i className="bi bi-building me-1"></i>{job.department}</span>
                                        <span><i className="bi bi-geo-alt me-1"></i>{job.location}</span>
                                        <span><i className="bi bi-briefcase me-1"></i>{job.employmentType}</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className={`badge rounded-pill ${
                                        job.status === 'Open' ? 'rp-badge-success' :
                                        job.status === 'Closed' ? 'rp-badge-danger' : 'rp-badge-muted'
                                    }`}>
                                        {job.status}
                                    </span>
                                    <button className="rp-btn-outline btn-sm" onClick={handleEditJob}>
                                        <i className="bi bi-pencil me-1"></i>Edit Job
                                    </button>
                                    {job.status === 'Open' ? (
                                        <button className="rp-btn-outline btn-sm" style={{ color: '#f87171' }} onClick={handleCloseJob} disabled={loading}>
                                            Close Job
                                        </button>
                                    ) : (
                                        <button className="rp-btn-outline btn-sm" style={{ color: '#4ade80' }} onClick={handleReopenJob} disabled={loading}>
                                            Reopen Job
                                        </button>
                                    )}
                                    <button className="rp-btn-outline btn-sm" style={{ color: '#f87171' }} onClick={() => setShowDeleteModal(true)} disabled={loading}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-3">
                                <div className="rp-stat-card">
                                    <small className="d-block mb-1 rp-stat-label">Total Applicants</small>
                                    <h3 className="mb-0 fw-bold" style={{ color: 'var(--rp-accent-1)' }}>{stats.totalApplications}</h3>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="rp-stat-card">
                                    <small className="d-block mb-1 rp-stat-label">Avg. Match Score</small>
                                    <h3 className="mb-1 fw-bold" style={{ color: 'var(--rp-text)' }}>{avgMatchScore}%</h3>
                                    <div className="progress" style={{ height: '4px', background: 'var(--rp-surface-2)' }}>
                                        <div className="progress-bar" style={{ width: `${avgMatchScore}%`, background: 'var(--rp-accent-1)' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="rp-stat-card">
                                    <small className="d-block mb-1 rp-stat-label">Shortlisted</small>
                                    <h3 className="mb-0 fw-bold" style={{ color: '#4ade80' }}>{stats.shortlisted}</h3>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="rp-stat-card">
                                    <small className="d-block mb-1 rp-stat-label">Days Open</small>
                                    <h3 className="mb-0 fw-bold" style={{ color: 'var(--rp-text)' }}>{daysOpen}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Job Description + Details + Requirements + Skills */}
                        <div className="row g-4 mb-4">
                            <div className="col-lg-8">
                                <div className="rp-apply-card mb-4">
                                    <h5 className="fw-bold mb-3" style={{ color: 'var(--rp-text)' }}>Job Description</h5>
                                    <p style={{ lineHeight: '1.6', color: 'var(--rp-text-muted)' }}>{job.description}</p>
                                </div>

                                <div className="rp-apply-card mb-4">
                                    <h5 className="fw-bold mb-3" style={{ color: 'var(--rp-text)' }}>Requirements</h5>
                                    <ul className="list-unstyled mb-0">
                                        {job.requirements && job.requirements.map((req, idx) => (
                                            <li key={idx} className="py-2" style={{ borderBottom: idx !== job.requirements.length - 1 ? '1px solid var(--rp-border)' : 'none', color: 'var(--rp-text)' }}>
                                                <i className="bi bi-check-circle me-2" style={{ color: '#4ade80' }}></i>{req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="rp-apply-card">
                                    <h5 className="fw-bold mb-3" style={{ color: 'var(--rp-text)' }}>Required Skills</h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        {job.skills && job.skills.map((skill, idx) => (
                                            <span key={idx} className="badge rounded-pill rp-badge-accent">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="rp-apply-card">
                                    <h5 className="fw-bold mb-3" style={{ color: 'var(--rp-text)' }}>Job Details</h5>
                                    <p className="small mb-1" style={{ color: 'var(--rp-text-muted)' }}>Department</p>
                                    <p className="fw-semibold" style={{ color: 'var(--rp-text)' }}>{job.department}</p>
                                    <p className="small mb-1" style={{ color: 'var(--rp-text-muted)' }}>Employment Type</p>
                                    <p className="fw-semibold" style={{ color: 'var(--rp-text)' }}>{job.employmentType}</p>
                                    <p className="small mb-1" style={{ color: 'var(--rp-text-muted)' }}>Salary</p>
                                    <p className="fw-semibold" style={{ color: 'var(--rp-text)' }}>{job.salary}</p>
                                    <p className="small mb-1" style={{ color: 'var(--rp-text-muted)' }}>Posted</p>
                                    <p className="fw-semibold mb-0" style={{ color: 'var(--rp-text)' }}>{new Date(job.postedDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Candidates Table */}
                        <div className="rp-apply-card">
                            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                                <div>
                                    <h5 className="fw-bold mb-1" style={{ color: 'var(--rp-text)' }}>Candidates</h5>
                                    <small style={{ color: 'var(--rp-text-muted)' }}>
                                        Screening {candidates.length} candidates against role requirements
                                    </small>
                                </div>
                                <div className="d-flex gap-2">
                                    <div className="input-group" style={{ width: '220px' }}>
                                        <span className="input-group-text" style={{ background: 'var(--rp-surface-2)', border: '1px solid var(--rp-border)' }}>
                                            <i className="bi bi-search" style={{ color: 'var(--rp-text-muted)' }}></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control rp-apply-input"
                                            placeholder="Search by name, email..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <select
                                        className="form-select rp-apply-input"
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
                                    <div className="spinner-border" style={{ color: 'var(--rp-accent-1)' }} role="status"></div>
                                </div>
                            ) : filteredCandidates.length === 0 ? (
                                <div className="text-center py-5" style={{ color: 'var(--rp-text-muted)' }}>No candidates found for this job yet.</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle rp-dark-table">
                                        <thead>
                                            <tr className="small text-uppercase">
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
                                                                className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                                                style={{ width: '36px', height: '36px', fontSize: '0.8rem', background: 'var(--rp-gradient)', color: '#fff' }}
                                                            >
                                                                {c.name?.charAt(0) || '?'}
                                                            </div>
                                                            <div>
                                                                <div className="fw-semibold" style={{ color: 'var(--rp-text)' }}>{c.name}</div>
                                                                <small style={{ color: 'var(--rp-text-muted)' }}>{c.email}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ minWidth: '140px' }}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="progress flex-grow-1" style={{ height: '5px', background: 'var(--rp-surface-2)' }}>
                                                                <div
                                                                    className="progress-bar"
                                                                    style={{ width: `${c.matchScore || 0}%`, background: 'var(--rp-accent-1)' }}
                                                                ></div>
                                                            </div>
                                                            <small className="fw-semibold" style={{ color: 'var(--rp-text)' }}>{c.matchScore || 0}%</small>
                                                        </div>
                                                    </td>
                                                    <td className="small" style={{ color: 'var(--rp-text-muted)' }}>
                                                        {new Date(c.appliedDate).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <StatusBadge status={c.status} />
                                                    </td>
                                                    <td className="text-end">
                                                        <button
                                                            className="rp-btn-gradient btn-sm"
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
                </main>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="rp-modal-content">
                            <div className="rp-modal-header">
                                <h5 className="fw-bold mb-0" style={{ color: '#fff' }}>Delete Job</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="p-4">
                                <p style={{ color: 'var(--rp-text)' }}>Are you sure you want to delete this job posting? This action cannot be undone.</p>
                            </div>
                            <div className="p-4 pt-0 d-flex gap-2">
                                <button type="button" className="rp-btn-outline w-100" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>
                                    Cancel
                                </button>
                                {/* 👇 UPDATED: uses deleteLoading instead of global loading, calls handleDeleteJob directly */}
                                <button
                                    type="button"
                                    className="btn w-100"
                                    style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600 }}
                                    onClick={handleDeleteJob}
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}