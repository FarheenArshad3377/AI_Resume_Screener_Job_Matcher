import { useNavigate } from 'react-router-dom';

export default function JobCard({ job }) {
    const navigate = useNavigate();

    return (
        <div className="card border-0 shadow-sm h-100" style={{ cursor: 'pointer' }}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div 
                        className="rounded bg-light d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px' }}
                    >
                        <i className="bi bi-building text-muted"></i>
                    </div>
                    {job.badge && (
                        <span className="badge bg-info">{job.badge}</span>
                    )}
                    {!job.badge && (
                        <span className="badge bg-success">{job.status}</span>
                    )}
                </div>

                <h6 className="card-title mb-1">{job.title}</h6>
                <p className="text-muted small mb-2">{job.company}</p>
                <p className="text-muted small mb-3">
                    <i className="bi bi-geo-alt me-1"></i>{job.location}
                </p>

                {/* Skills */}
                <div className="mb-3">
                    {job.skills.map((skill, idx) => (
                        <span key={idx} className="badge bg-light text-dark me-1 mb-1">
                            {skill}
                        </span>
                    ))}
                </div>

                {/* Salary */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <strong className="text-dark">{job.salary}</strong>
                </div>

                {/* Apply Button */}
                <button 
                    className="btn btn-primary w-100"
                    onClick={() => navigate(`/jobs/${job.id}/apply`)}
                >
                    Apply Now
                </button>
            </div>
        </div>
    );
}