import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const loadApplications = async () => {
        setLoading(true);
        try {
            const data = await recruiterAPI.getAllApplications();
            setApplications(Array.isArray(data) ? data : []);
        } catch {
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
    }, []);

    const filtered = useMemo(() => {
        if (!searchTerm.trim()) return applications;
        const term = searchTerm.toLowerCase();
        return applications.filter(
            (application) =>
                application.name?.toLowerCase().includes(term) ||
                application.email?.toLowerCase().includes(term) ||
                application.jobTitle?.toLowerCase().includes(term)
        );
    }, [applications, searchTerm]);

    return (
        <div className="rp-landing rp-dash">
            <div className="rp-blob rp-blob-1" />
            <div className="rp-blob rp-blob-2" />

            <RecruiterNavbar toggleSidebar={() => {}} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <main className="p-4">
                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                            <div>
                                <h3 className="fw-bold mb-1" style={{ color: 'var(--rp-text)' }}>Applications</h3>
                                <p className="mb-0" style={{ color: 'var(--rp-text-muted)' }}>
                                    All candidates across your job postings.
                                </p>
                            </div>

                            <div className="input-group" style={{ width: '260px' }}>
                                <span className="input-group-text" style={{ background: 'var(--rp-surface-2)', border: '1px solid var(--rp-border)' }}>
                                    <i className="bi bi-search" style={{ color: 'var(--rp-text-muted)' }} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control rp-apply-input"
                                    placeholder="Search name, email, job..."
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                />
                            </div>
                        </div>

                        <div className="rp-apply-card">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" style={{ color: 'var(--rp-accent-1)' }} role="status" />
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="text-center py-5" style={{ color: 'var(--rp-text-muted)' }}>
                                    No applications yet.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle rp-dark-table">
                                        <thead>
                                            <tr className="small text-uppercase">
                                                <th>Candidate</th>
                                                <th>Applied For</th>
                                                <th>Match Score</th>
                                                <th>Applied Date</th>
                                                <th>Status</th>
                                                <th className="text-end">Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filtered.map((application) => (
                                                <tr key={application.id}>
                                                    <td>
                                                        <div className="fw-semibold" style={{ color: 'var(--rp-text)' }}>
                                                            {application.name || application.candidateName || 'N/A'}
                                                        </div>
                                                        <small style={{ color: 'var(--rp-text-muted)' }}>
                                                           {application.email || application.candidateEmail || 'N/A'}
                                                        </small>
                                                    </td>

                                                    <td>
                                                        <a
                                                            href="#"
                                                            style={{ color: 'var(--rp-accent-2)', textDecoration: 'none' }}
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                navigate(`/recruiter/jobs/${application.jobId}`);
                                                            }}
                                                        >
                                                            {application.jobTitle || 'N/A'}
                                                        </a>
                                                    </td>

                                                    <td>
                                                        <div className="d-flex align-items-center gap-2" style={{ minWidth: '120px' }}>
                                                            <div className="progress flex-grow-1" style={{ height: '5px', background: 'var(--rp-surface-2)' }}>
                                                                <div
                                                                    className="progress-bar"
                                                                    style={{ width: `${application.matchScore || 0}%`, background: 'var(--rp-accent-1)' }}
                                                                />
                                                            </div>
                                                            <small className="fw-semibold" style={{ color: 'var(--rp-text)' }}>
                                                                {application.matchScore || 0}%
                                                            </small>
                                                        </div>
                                                    </td>

                                                    <td className="small" style={{ color: 'var(--rp-text-muted)' }}>
                                                        {application.appliedDate || application.createdAt
                                                            ? new Date(application.appliedDate || application.createdAt).toLocaleDateString()
                                                            : 'N/A'}
                                                    </td>

                                                    <td>
                                                        <StatusBadge status={application.status} />
                                                    </td>

                                                    <td className="text-end">
                                                        <button
                                                            className="rp-btn-gradient btn-sm"
                                                            onClick={() => navigate(`/candidate/${application.candidateId}`)}
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
        </div>
    );
}