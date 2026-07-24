
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import recruiterAPI from '../api/recruiterApi';
import RecruiterNavbar from '../components/RecruiterNavbar';
import InterviewsSidebar from '../components/InterviewsSidebar';
import { useSelector } from 'react-redux';
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

export default function ApplicationsPage() {
    const { user } = useSelector((s) => s.auth);
    const [sidebarOpen, setSidebarOpen] = useState(true);
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
        <>
            <RecruiterNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
              <InterviewsSidebar isOpen={true} user={user} />

                <main className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                            <div>
                                <h2 className="mb-1">Applications</h2>
                                <p className="text-muted mb-0">
                                    All candidates across your job postings.
                                </p>
                            </div>

                            <div className="input-group" style={{ width: '260px' }}>
                                <span className="input-group-text bg-light border-0">
                                    <i className="bi bi-search text-muted" />
                                </span>

                                <input
                                    type="text"
                                    className="form-control bg-light border-0"
                                    placeholder="Search name, email, job..."
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                />
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status" />
                                    </div>
                                ) : filtered.length === 0 ? (
                                    <div className="text-center py-5 text-muted">
                                        No applications yet.
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table align-middle">
                                            <thead>
                                                <tr className="text-muted small text-uppercase">
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
                                                            <div className="fw-semibold">
                                                                {application.name || application.candidateName || 'N/A'}
                                                            </div>
                                                            <small className="text-muted">
                                                               {application.email || application.candidateEmail || 'N/A'}
                                                            </small>
                                                        </td>

                                                        <td>
                                                            <a
                                                                href="#"
                                                                className="text-primary text-decoration-none"
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
                                                            <div className="progress flex-grow-1" style={{ height: '5px' }}>
                                                                <div
                                                                    className="progress-bar bg-primary"
                                                                    style={{ width: `${application.matchScore || 0}%` }}
                                                                />
                                                            </div>
                                                            <small className="fw-semibold">
                                                                {application.matchScore || 0}%
                                                            </small>
                                                        </div>
                                                    </td>

                                                    <td className="text-muted small">
                                                        {application.appliedDate || application.createdAt
                                                            ? new Date(application.appliedDate || application.createdAt).toLocaleDateString()
                                                            : 'N/A'}
                                                    </td>

                                                    <td>
                                                        <StatusBadge status={application.status} />
                                                    </td>

                                                    <td className="text-end">
                                                        <button
                                                            className="btn btn-primary btn-sm"
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
                    </div>
                </main>
            </div>
        </>
    );
}
