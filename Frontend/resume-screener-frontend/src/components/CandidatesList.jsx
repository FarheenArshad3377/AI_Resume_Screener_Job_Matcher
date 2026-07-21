import { useNavigate } from 'react-router-dom';

export default function CandidatesList({ candidates }) {
    const navigate = useNavigate();

    const getScoreColor = (score) => {
        if (score >= 80) return '#28a745';
        if (score >= 60) return '#ffc107';
        return '#dc3545';
    };

    const getInitialsBg = (initials) => {
        const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#17a2b8', '#0066cc'];
        return colors[initials.charCodeAt(0) % colors.length];
    };

    return (
        <div className="table-responsive">
            <table className="table table-hover mb-0">
                <thead className="table-light">
                    <tr>
                        <th style={{ width: '25%' }}>CANDIDATE NAME</th>
                        <th style={{ width: '15%' }}>MATCH SCORE</th>
                        <th style={{ width: '20%' }}>APPLIED DATE</th>
                        <th style={{ width: '20%' }}>STATUS</th>
                        <th style={{ width: '20%' }}>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map((candidate) => (
                        <tr key={candidate.id}>
                            <td>
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: getInitialsBg(candidate.initials),
                                            fontSize: '14px'
                                        }}
                                    >
                                        {candidate.initials}
                                    </div>
                                    <div>
                                        <strong className="d-block">{candidate.name}</strong>
                                        <small className="text-muted">{candidate.email}</small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold">{candidate.matchScore}%</span>
                                    <div className="progress" style={{ width: '60px', height: '4px' }}>
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width: `${candidate.matchScore}%`,
                                                backgroundColor: getScoreColor(candidate.matchScore)
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <small className="text-muted">{candidate.appliedDate}</small>
                            </td>
                            <td>
                                <span className={`badge bg-${candidate.statusBg}`}>
                                    {candidate.status}
                                </span>
                            </td>
                            <td>
                                <button
                                    className="btn btn-sm btn-link text-primary text-decoration-none"
                                    onClick={() => navigate(`/candidate/${candidate.id}`)}
                                >
                                    View Profile
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}