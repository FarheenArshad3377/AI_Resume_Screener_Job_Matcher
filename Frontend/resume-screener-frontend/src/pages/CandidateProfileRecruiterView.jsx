import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import recruiterAPI from '../api/recruiterAPI';
import RecruiterNavbar from '../components/RecruiterNavbar';
import RecruiterSidebar from '../components/RecruiterSidebar';

function getScoreColor(score) {
    if (score >= 70) return { text: 'text-success', bar: 'bg-success' };
    if (score >= 40) return { text: 'text-warning', bar: 'bg-warning' };
    return { text: 'text-danger', bar: 'bg-danger' };
}

export default function CandidateProfileRecruiterView() {
    const { candidateId } = useParams();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [candidateId]);

    const loadProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await recruiterAPI.getCandidateProfile(candidateId);
            setCandidate(data);
        } catch (err) {
            setError('Failed to load candidate profile.');
        } finally {
            setLoading(false);
        }
    };

    // Most recent application carries the matched/missing skills + AI summary for this candidate
    const latestApplication = candidate?.applications?.[0] || null;

    const parseSkills = (str) =>
        str ? str.split(',').map((s) => s.trim()).filter(Boolean) : [];

    const handleStatusChange = async (newStatus) => {
        if (!latestApplication) return;
        setActionLoading(true);
        try {
            await recruiterAPI.updateCandidateStatus(
                latestApplication.jobId,
                latestApplication.id,
                newStatus
            );
            await loadProfile();
        } catch (err) {
            setError('Failed to update status.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <RecruiterNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
                    <RecruiterSidebar isOpen={sidebarOpen} />
                    <main className="flex-grow-1 d-flex align-items-center justify-content-center">
                        <div className="spinner-border text-primary" role="status"></div>
                    </main>
                </div>
            </>
        );
    }

    if (error || !candidate) {
        return (
            <>
                <RecruiterNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
                    <RecruiterSidebar isOpen={sidebarOpen} />
                    <main className="flex-grow-1 p-4">
                        <div className="alert alert-danger">{error || 'Candidate not found'}</div>
                    </main>
                </div>
            </>
        );
    }

    const score = latestApplication?.matchScore ?? 0;
    const colors = getScoreColor(score);
    const matchedSkills = parseSkills(latestApplication?.matchedSkills);
    const missingSkills = parseSkills(latestApplication?.missingSkills);

    return (
        <>
            <RecruiterNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
                <RecruiterSidebar isOpen={sidebarOpen} />
                <main className="flex-grow-1" style={{ backgroundColor: '#f8f9fa', overflow: 'auto' }}>
                    <div className="p-4" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb" className="mb-4">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <a href="#" className="text-primary" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                                        Jobs
                                    </a>
                                </li>
                                {latestApplication && (
                                    <li className="breadcrumb-item">
                                        <a
                                            href="#"
                                            className="text-primary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(`/recruiter/jobs/${latestApplication.jobId}`);
                                            }}
                                        >
                                            {latestApplication.jobTitle}
                                        </a>
                                    </li>
                                )}
                                <li className="breadcrumb-item active">Candidate Profile</li>
                            </ol>
                        </nav>

                        <div className="row g-4">
                            {/* Left Column */}
                            <div className="col-lg-4">
                                {/* Header Card */}
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body text-center">
                                        <div
                                            className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold mx-auto mb-3"
                                            style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}
                                        >
                                            {candidate.name?.charAt(0) || '?'}
                                        </div>
                                        <h5 className="mb-1">{candidate.name}</h5>
                                        <p className="text-muted small mb-3">{candidate.email}</p>

                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-outline-danger btn-sm flex-grow-1"
                                                onClick={() => handleStatusChange('Rejected')}
                                                disabled={actionLoading || !latestApplication}
                                            >
                                                Reject
                                            </button>
                                            <button
                                                className="btn btn-outline-secondary btn-sm flex-grow-1"
                                                onClick={() => window.open(`mailto:${candidate.email}`)}
                                            >
                                                Contact
                                            </button>
                                            <button
                                                className="btn btn-primary btn-sm flex-grow-1"
                                                onClick={() => handleStatusChange('Shortlisted')}
                                                disabled={actionLoading || !latestApplication}
                                            >
                                                Shortlist
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Match Score */}
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body text-center">
                                        <p className="text-muted small mb-3">AI Match Score</p>
                                        <div
                                            className={`rounded-circle border border-4 mx-auto d-flex flex-column align-items-center justify-content-center ${colors.text}`}
                                            style={{ width: '120px', height: '120px', borderColor: 'currentColor' }}
                                        >
                                            <h2 className="mb-0">{score}%</h2>
                                            <small className="text-muted">Match Score</small>
                                        </div>
                                        {latestApplication?.aiSummary && (
                                            <p className="text-muted small mt-3 mb-0">{latestApplication.aiSummary}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body">
                                        <p className="fw-semibold mb-2">
                                            <i className="bi bi-check-circle text-success me-2"></i>Matched Skills
                                        </p>
                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            {matchedSkills.length > 0 ? (
                                                matchedSkills.map((skill) => (
                                                    <span key={skill} className="badge bg-success-subtle text-success">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <small className="text-muted">No matched skills recorded</small>
                                            )}
                                        </div>

                                        <p className="fw-semibold mb-2">
                                            <i className="bi bi-exclamation-circle text-warning me-2"></i>Missing Skills
                                        </p>
                                        <div className="d-flex flex-wrap gap-2">
                                            {missingSkills.length > 0 ? (
                                                missingSkills.map((skill) => (
                                                    <span key={skill} className="badge bg-warning-subtle text-warning-emphasis">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <small className="text-muted">None — full match!</small>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {candidate.notes && candidate.notes.length > 0 && (
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <p className="fw-semibold mb-2">
                                                <i className="bi bi-chat-left-text me-2"></i>Hiring Manager Notes
                                            </p>
                                            {candidate.notes.map((note) => (
                                                <div key={note.id} className="mb-2 pb-2 border-bottom">
                                                    <p className="small mb-1">{note.text}</p>
                                                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                                                        {note.createdBy} · {new Date(note.createdAt).toLocaleDateString()}
                                                    </small>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column */}
                            <div className="col-lg-8">
                                {/* Contact Info */}
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body">
                                        <h5 className="mb-3">Contact Information</h5>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <small className="text-muted d-block">Email</small>
                                                <span className="fw-semibold">{candidate.email}</span>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <small className="text-muted d-block">Resume</small>
                                                <a
                                                    href={`http://localhost:5286${candidate.resumeUrl}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-primary"
                                                >
                                                    <i className="bi bi-file-earmark-pdf me-1"></i>View Resume
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Application History */}
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body">
                                        <h5 className="mb-3">Application History</h5>
                                        {candidate.applications && candidate.applications.length > 0 ? (
                                            <div className="table-responsive">
                                                <table className="table table-sm align-middle">
                                                    <thead>
                                                        <tr className="text-muted small text-uppercase">
                                                            <th>Job</th>
                                                            <th>Applied</th>
                                                            <th>Score</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {candidate.applications.map((app) => (
                                                            <tr key={app.id}>
                                                                <td>
                                                                    <a
                                                                        href="#"
                                                                        className="text-primary text-decoration-none"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            navigate(`/recruiter/jobs/${app.jobId}`);
                                                                        }}
                                                                    >
                                                                        {app.jobTitle}
                                                                    </a>
                                                                </td>
                                                                <td className="text-muted small">
                                                                    {new Date(app.appliedDate).toLocaleDateString()}
                                                                </td>
                                                                <td>{app.matchScore ?? '—'}%</td>
                                                                <td>
                                                                    <span className="badge bg-light text-dark border">{app.status}</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="text-muted mb-0">No applications found.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Resume Text */}
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="mb-3">Resume Content</h5>
                                        <p className="text-muted small" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                                            {candidate.parsedText || 'No resume text available.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}