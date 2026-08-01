import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import recruiterAPI from '../api/recruiterAPI';
import axiosInstance from '../api/axiosInstance';
import RecruiterNavbar from '../components/RecruiterNavbar';
import axios from 'axios';
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
    const [resumeBlobUrl, setResumeBlobUrl] = useState(null);
    const [resumeLoading, setResumeLoading] = useState(false);

    useEffect(() => {
        loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [candidateId]);

    // 👇 UPDATED: resume ab candidate.resumeUrl se load hota hai (candidate profile load hone ke baad),
    // ek galat guessed endpoint (/candidates/{id}/resume) ki jagah jo 404 de raha tha
    useEffect(() => {
        if (candidate?.resumeUrl) {
            loadResume(candidate.resumeUrl);
        } else {
            setResumeBlobUrl(null);
        }
        return () => {
            if (resumeBlobUrl) URL.revokeObjectURL(resumeBlobUrl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [candidate?.resumeUrl]);

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

    // 👇 UPDATED: takes the resumeUrl coming from the candidate object,
    // fetches it through axiosInstance (so auth headers are attached), then makes a blob URL
const loadResume = async (resumeUrl) => {
    setResumeLoading(true);
    try {
        const fullUrl = resumeUrl.startsWith('http')
            ? resumeUrl
            : `https://recruitpro-api.runasp.net${resumeUrl.startsWith('/') ? '' : '/'}${resumeUrl}`;

        // Static file hai, auth header ki zaroorat nahi (agar UseStaticFiles auth se pehle hai)
        const response = await axios.get(fullUrl, { responseType: 'blob' });
        const blobUrl = URL.createObjectURL(response.data);
        setResumeBlobUrl(blobUrl);
    } catch (err) {
        console.error('Resume load failed:', err);
        setResumeBlobUrl(null);
    } finally {
        setResumeLoading(false);
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
                    <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
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
                            <div className="col-lg-3">
                                <div className="rp-apply-card mb-4 text-center">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto mb-3"
                                        style={{ width: '84px', height: '84px', fontSize: '1.8rem', background: 'var(--rp-gradient)', color: '#fff' }}
                                    >
                                        {candidate.name?.charAt(0) || '?'}
                                    </div>
                                    <h5 className="mb-1" style={{ color: 'var(--rp-text)' }}>{candidate.name}</h5>
                                    <p className="small mb-3" style={{ color: 'var(--rp-text-muted)' }}>{candidate.email}</p>

                                    <div
                                        className="rounded-circle mx-auto d-flex flex-column align-items-center justify-content-center mb-3"
                                        style={{ width: '120px', height: '120px', border: `4px solid ${scoreColor}`, color: scoreColor }}
                                    >
                                        <h2 className="mb-0">{score}%</h2>
                                        <small style={{ color: 'var(--rp-text-muted)', fontSize: '0.65rem', letterSpacing: '0.05em' }}>AI MATCH</small>
                                    </div>

                                    <div className="d-flex flex-column gap-2">
                                        <button
                                            className="rp-btn-gradient btn-sm w-100"
                                            style={{ border: 'none' }}
                                            onClick={() => handleStatusChange('Shortlisted')}
                                            disabled={actionLoading || !latestApplication}
                                        >
                                            <i className="bi bi-calendar-check me-1"></i>Shortlist
                                        </button>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="rp-btn-outline btn-sm flex-grow-1"
                                                style={{ color: '#f87171' }}
                                                onClick={() => handleStatusChange('Rejected')}
                                                disabled={actionLoading || !latestApplication}
                                            >
                                                Reject
                                            </button>
                                            <button
                                                className="rp-btn-outline btn-sm flex-grow-1"
                                                onClick={() => window.open(`mailto:${candidate.email}`)}
                                            >
                                                Contact
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="rp-apply-card">
                                    <p className="fw-semibold mb-2 small text-uppercase" style={{ color: 'var(--rp-text-muted)', letterSpacing: '0.05em' }}>
                                        <i className="bi bi-graph-up me-2"></i>AI Skill Breakdown
                                    </p>
                                    <p className="small mb-2" style={{ color: 'var(--rp-text)' }}>
                                        Matched Skills <span style={{ color: 'var(--rp-text-muted)' }}>{matchedSkills.length}</span>
                                    </p>
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {matchedSkills.length > 0 ? (
                                            matchedSkills.map((skill) => (
                                                <span key={skill} className="badge rounded-pill rp-badge-success">{skill}</span>
                                            ))
                                        ) : (
                                            <small style={{ color: 'var(--rp-text-muted)' }}>None recorded</small>
                                        )}
                                    </div>
                                    <p className="small mb-2" style={{ color: 'var(--rp-text)' }}>
                                        Gaps / Low Confidence <span style={{ color: 'var(--rp-text-muted)' }}>{missingSkills.length}</span>
                                    </p>
                                    <div className="d-flex flex-wrap gap-2">
                                        {missingSkills.length > 0 ? (
                                            missingSkills.map((skill) => (
                                                <span key={skill} className="badge rounded-pill" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>{skill}</span>
                                            ))
                                        ) : (
                                            <small style={{ color: 'var(--rp-text-muted)' }}>None — full match!</small>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Middle Column */}
                            <div className="col-lg-6">
                                <div className="rp-apply-card mb-4">
                                    <h5 className="mb-3" style={{ color: 'var(--rp-text)' }}>AI Summary</h5>
                                    <p className="small mb-0" style={{ color: 'var(--rp-text-muted)', lineHeight: '1.6' }}>
                                        {latestApplication?.aiSummary || 'No AI summary available yet.'}
                                    </p>
                                </div>

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

                                {candidate.notes && candidate.notes.length > 0 && (
                                    <div className="rp-apply-card mb-4">
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

                                <div className="rp-apply-card">
                                    <h5 className="mb-3" style={{ color: 'var(--rp-text)' }}>Resume Content</h5>
                                    <p className="small" style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: 'var(--rp-text-muted)', maxHeight: '260px', overflowY: 'auto' }}>
                                        {candidate.parsedText || 'No resume text available.'}
                                    </p>
                                </div>
                            </div>

                            {/* Right Column — Resume Preview */}
                            <div className="col-lg-3">
                                <div className="rp-apply-card p-0 rp-resume-panel">
                                    <div className="d-flex align-items-center justify-content-between p-3" style={{ borderBottom: '1px solid var(--rp-border)' }}>
                                        <span className="fw-semibold small" style={{ color: 'var(--rp-text)' }}>
                                            <i className="bi bi-file-earmark-text me-2"></i>Resume Preview
                                        </span>
                                        {resumeBlobUrl && (
                                            <a href={resumeBlobUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--rp-accent-2)' }}>
                                                <i className="bi bi-box-arrow-up-right"></i>
                                            </a>
                                        )}
                                    </div>

                                    {resumeLoading ? (
                                        <div className="p-4 text-center">
                                            <div className="spinner-border spinner-border-sm" style={{ color: 'var(--rp-accent-1)' }} role="status"></div>
                                        </div>
                                    ) : resumeBlobUrl ? (
                                        <iframe src={resumeBlobUrl} title="Resume Preview" className="rp-resume-iframe" />
                                    ) : (
                                        <div className="p-4 text-center small" style={{ color: 'var(--rp-text-muted)' }}>
                                            {candidate.resumeUrl ? 'Unable to load resume preview.' : 'No resume file available.'}
                                        </div>
                                    )}

                                    {resumeBlobUrl && (
                                        <div className="p-3 d-flex gap-2" style={{ borderTop: '1px solid var(--rp-border)' }}>
                                            <a
                                                href={resumeBlobUrl}
                                                download={`${candidate.name || 'resume'}.pdf`}
                                                className="rp-btn-outline btn-sm flex-grow-1 text-center"
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <i className="bi bi-download me-1"></i>Download
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}