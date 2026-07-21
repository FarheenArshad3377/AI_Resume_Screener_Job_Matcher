export default function CandidateMatchScore({ candidate }) {
    return (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body text-center">
                <h6 className="text-muted fw-bold mb-3">AI Match Score</h6>
                <div 
                    className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{
                        width: '140px',
                        height: '140px',
                        backgroundColor: '#f0f0f0',
                        position: 'relative'
                    }}
                >
                    <svg width="140" height="140" style={{ position: 'absolute' }}>
                        <circle
                            cx="70"
                            cy="70"
                            r="65"
                            fill="none"
                            stroke="#e9ecef"
                            strokeWidth="8"
                        />
                        <circle
                            cx="70"
                            cy="70"
                            r="65"
                            fill="none"
                            stroke="#0066cc"
                            strokeWidth="8"
                            strokeDasharray={`${(candidate.matchScore / 100) * 408.4} 408.4`}
                            strokeLinecap="round"
                            style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px' }}
                        />
                    </svg>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0066cc' }}>
                            {candidate.matchScore}%
                        </div>
                        <small className="text-muted">Match Score</small>
                    </div>
                </div>
                <p className="text-muted small">
                    Candidate matches 88% of job requirements and shows expertise with the team's tech stack.
                </p>
            </div>
        </div>
    );
}