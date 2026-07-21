export default function CandidateHeader({ candidate }) {
    return (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
                <div className="text-center mb-3">
                    <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
                        style={{ width: '100px', height: '100px', fontSize: '40px', fontWeight: 'bold' }}
                    >
                        {candidate.name.charAt(0)}
                    </div>
                </div>
                <h5 className="text-center mb-1">{candidate.name}</h5>
                <p className="text-center text-muted small mb-3">{candidate.email}</p>
                <p className="text-center mb-3">
                    <a href={`https://${candidate.linkedinUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-linkedin me-2"></i>LinkedIn
                    </a>
                </p>
                <div className="text-center small mb-3">
                    <p className="mb-1"><strong>{candidate.phone}</strong></p>
                    <p className="text-muted mb-0">
                        <i className="bi bi-geo-alt me-1"></i>{candidate.location}
                    </p>
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary w-100 btn-sm">
                        <i className="bi bi-hand-thumbs-down me-1"></i>Reject
                    </button>
                    <button className="btn btn-outline-secondary w-100 btn-sm">
                        <i className="bi bi-chat me-1"></i>Contact
                    </button>
                    <button className="btn btn-primary w-100 btn-sm">
                        <i className="bi bi-bookmark-check me-1"></i>Shortlist
                    </button>
                </div>
            </div>
        </div>
    );
}