export default function CandidateActions({ candidateId }) {
    return (
        <div className="d-flex gap-2">
            <button className="btn btn-outline-danger w-100">
                <i className="bi bi-hand-thumbs-down me-2"></i>Reject
            </button>
            <button className="btn btn-outline-primary w-100">
                <i className="bi bi-chat-dots me-2"></i>Contact
            </button>
            <button className="btn btn-primary w-100">
                <i className="bi bi-bookmark-check me-2"></i>Shortlist
            </button>
        </div>
    );
}