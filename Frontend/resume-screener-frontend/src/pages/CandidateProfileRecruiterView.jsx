import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import recruiterAPI from '../api/recruiterAPI';
import RecruiterNavbar from '../components/RecruiterNavbar';

function getScoreColor(score) {
    if (score >= 70) return '#4ade80';
    if (score >= 40) return '#f59e0b';
    return '#f87171';
}

export default function CandidateProfileRecruiterView() {
    const { candidateId } = useParams();
    const navigate = useNavigate();
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
            <div className="rp-landing rp-dash">
                <div className="rp-blob rp-blob-1" />
                <div className="rp-blob rp-blob-2" />
                <RecruiterNavbar toggleSidebar={() => {}} />
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 60px)', position: 'relative', zIndex: 1 }}>
                    <div className="spinner-border" style={{ color: 'var(--rp-accent-1)' }} role="status"></div>
                </div>
            </div>
        );
    }

    if (error || !candidate) {
        return (
            <div className="rp-landing rp-dash">
                <div className="rp-blob rp-blob-1" />
                <div className="rp-blob rp-blob-2" />
                <RecruiterNavbar toggleSidebar={() => {}} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <main className="p-4">
                        <div className="rp-auth-alert">{error || 'Candidate not found'}</div>
                    </main>
                </div>
            </div>
        );
    }

    const score = latestApplication?.matchScore ?? 0;
    const scoreColor = getScoreColor(score);
    const matchedSkills = parseSkills(latestApplication?.matchedSkills);
    const missingSkills = parseSkills(latestApplication?.missingSkills);

    return (
        <div className="rp-landing rp-dash">
            <div className="rp-blob rp-blob-1" />
            <div className="rp-blob rp-blob-2" />

            <RecruiterNavbar toggleSidebar={() => {}} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <main className="p-4">
                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb" className="mb-4">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <a
                                        href="#"
                                        style={{ color: 'var(--rp-accent-2)', textDecoration: 'none' }}
                                        onClick={(e) => { e.preventDefault(); navigate('/'); }}
                                    >
                                        Jobs
                                    </a>
                                </li>
                                {latestApplication && (
                                    <li className="breadcrumb-item">
                                        <a
                                            href="#"
                                            style={{ color: 'var(--rp-accent-2)', textDecoration: 'none' }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(`/recruiter/jobs/${latestApplication.jobId}`);
                                            }}
                                        >
                                            {latestApplication.jobTitle}
                                        </a>
                                    </li>
                                )}
                                <li className="breadcrumb-item active" style={{ color: 'var(--rp-text-muted)' }}>Candidate Profile</li>
                            </ol>
                        </nav>

                        <div className="row g-4">
                            {/* Left Column */}
                            <div className="col-lg-4">
                                {/* Header Card */}
                                <div className="rp-apply-card mb-4 text-center">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto mb-3"
                                        style={{ width: '64px', height: '64px', fontSize: '1.5rem', background: 'var(--rp-gradient)', color: '#fff' }}
                                    >
                                        {candidate.name?.charAt(0) || '?'}
                                    </div>
                                    <h5 className="mb-1" style={{ color: 'var(--rp-text)' }}>{candidate.name}</h5>
                                    <p className="small mb-3" style={{ color: 'var(--rp-text-muted)' }}>{candidate.email}</p>

                                   <div className="d-flex gap-2">
                                        <button
                                            className="rp-btn-outline btn-sm flex-grow-1"
                                            style={{ color: '#f87171', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                                            onClick={() => handleStatusChange('Rejected')}
                                            disabled={actionLoading || !latestApplication}
                                        >
                                            Reject
                                        </button>
                                        <button
                                            className="rp-btn-outline btn-sm flex-grow-1"
                                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                                            onClick={() => window.open(`mailto:${candidate.email}`)}
                                        >
                                            Contact
                                        </button>
                                        <button
                                            className="rp-btn-gradient btn-sm flex-grow-1"
                                            style={{ border: 'none', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                                            onClick={() => handleStatusChange('Shortlisted')}
                                            disabled={actionLoading || !latestApplication}
                                        >
                                            Shortlist
                                        </button>
                                    </div>
                                </div>

                                {/* Match Score */}
                                <div className="rp-apply-card mb-4 text-center">
                                    <p className="small mb-3" style={{ color: 'var(--rp-text-muted)' }}>AI Match Score</p>
                                    <div
                                        className="rounded-circle mx-auto d-flex flex-column align-items-center justify-content-center"
                                        style={{ width: '120px', height: '120px', border: `4px solid ${scoreColor}`, color: scoreColor }}
                                    >
                                        <h2 className="mb-0">{score}%</h2>
                                        <small style={{ color: 'var(--rp-text-muted)' }}>Match Score</small>
                                    </div>
                                    {latestApplication?.aiSummary && (
                                        <p className="small mt-3 mb-0" style={{ color: 'var(--rp-text-muted)' }}>{latestApplication.aiSummary}</p>
                                    )}
                                </div>

                                {/* Skills */}
                                <div className="rp-apply-card mb-4">
                                    <p className="fw-semibold mb-2" style={{ color: 'var(--rp-text)' }}>
                                        <i className="bi bi-check-circle me-2" style={{ color: '#4ade80' }}></i>Matched Skills
                                    </p>
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {matchedSkills.length > 0 ? (
                                            matchedSkills.map((skill) => (
                                                <span key={skill} className="badge rounded-pill rp-badge-success">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <small style={{ color: 'var(--rp-text-muted)' }}>No matched skills recorded</small>
                                        )}
                                    </div>

                                    <p className="fw-semibold mb-2" style={{ color: 'var(--rp-text)' }}>
                                        <i className="bi bi-exclamation-circle me-2" style={{ color: '#f59e0b' }}></i>Missing Skills
                                    </p>
                                    <div className="d-flex flex-wrap gap-2">
                                        {missingSkills.length > 0 ? (
                                            missingSkills.map((skill) => (
                                                <span key={skill} className="badge rounded-pill" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <small style={{ color: 'var(--rp-text-muted)' }}>None — full match!</small>
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                {candidate.notes && candidate.notes.length > 0 && (
                                    <div className="rp-apply-card">
                                        <p className="fw-semibold mb-2" style={{ color: 'var(--rp-text)' }}>
                                            <i className="bi bi-chat-left-text me-2"></i>Hiring Manager Notes
                                        </p>
                                        {candidate.notes.map((note) => (
                                            <div key={note.id} className="mb-2 pb-2" style={{ borderBottom: '1px solid var(--rp-border)' }}>
                                                <p className="small mb-1" style={{ color: 'var(--rp-text)' }}>{note.text}</p>
                                                <small style={{ fontSize: '0.72rem', color: 'var(--rp-text-muted)' }}>
                                                    {note.createdBy} · {new Date(note.createdAt).toLocaleDateString()}
                                                </small>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Column */}
                            <div className="col-lg-8">
                                {/* Contact Info */}
                                <div className="rp-apply-card mb-4">
                                    <h5 className="mb-3" style={{ color: 'var(--rp-text)' }}>Contact Information</h5>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <small className="d-block" style={{ color: 'var(--rp-text-muted)' }}>Email</small>
                                            <span className="fw-semibold" style={{ color: 'var(--rp-text)' }}>{candidate.email}</span>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <small className="d-block" style={{ color: 'var(--rp-text-muted)' }}>Resume</small>
                                            <a
                                                href={`http://localhost:5286${candidate.resumeUrl}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{ color: 'var(--rp-accent-2)' }}
                                            >
                                                <i className="bi bi-file-earmark-pdf me-1"></i>View Resume
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Application History */}
                                <div className="rp-apply-card mb-4">
                                    <h5 className="mb-3" style={{ color: 'var(--rp-text)' }}>Application History</h5>
                                    {candidate.applications && candidate.applications.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-sm align-middle rp-dark-table">
                                                <thead>
                                                    <tr className="small text-uppercase">
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
                                                                    style={{ color: 'var(--rp-accent-2)', textDecoration: 'none' }}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        navigate(`/recruiter/jobs/${app.jobId}`);
                                                                    }}
                                                                >
                                                                    {app.jobTitle}
                                                                </a>
                                                            </td>
                                                            <td className="small" style={{ color: 'var(--rp-text-muted)' }}>
                                                                {new Date(app.appliedDate).toLocaleDateString()}
                                                            </td>
                                                            <td style={{ color: 'var(--rp-text)' }}>{app.matchScore ?? '—'}%</td>
                                                            <td>
                                                                <span className="badge rounded-pill rp-badge-muted">{app.status}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="mb-0" style={{ color: 'var(--rp-text-muted)' }}>No applications found.</p>
                                    )}
                                </div>

                                {/* Resume Text */}
                                <div className="rp-apply-card">
                                    <h5 className="mb-3" style={{ color: 'var(--rp-text)' }}>Resume Content</h5>
                                    <p className="small" style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: 'var(--rp-text-muted)' }}>
                                        {candidate.parsedText || 'No resume text available.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}