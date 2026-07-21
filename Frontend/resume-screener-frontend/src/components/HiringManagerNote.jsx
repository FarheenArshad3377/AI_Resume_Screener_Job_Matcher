export default function HiringManagerNote({ note }) {
    return (
        <div className="card border-0 shadow-sm" style={{ backgroundColor: '#e3f2fd' }}>
            <div className="card-body">
                <h6 className="card-title mb-2">
                    <i className="bi bi-info-circle text-primary me-2"></i>Hiring Manager Note
                </h6>
                <p className="mb-0 small">{note || 'No notes available'}</p>
            </div>
        </div>
    );
}