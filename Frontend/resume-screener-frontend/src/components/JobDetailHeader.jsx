import { useNavigate } from 'react-router-dom';

export default function JobDetailHeader({ job }) {
    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
                <h2 className="mb-2">{job.title}</h2>
                <div className="d-flex gap-3 flex-wrap">
                    <span className="text-muted">
                        <i className="bi bi-building me-2"></i>{job.department}
                    </span>
                    <span className="text-muted">
                        <i className="bi bi-geo-alt me-2"></i>{job.location}
                    </span>
                    <span className="text-muted">
                        <i className="bi bi-clock me-2"></i>{job.employmentType}
                    </span>
                    <span className="text-muted">
                        <i className="bi bi-calendar me-2"></i>Full-time
                    </span>
                </div>
            </div>
            <div className="d-flex gap-2">
                <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                >
                    <i className="bi bi-pencil me-2"></i>Edit Job
                </button>
                <button className="btn btn-primary">
                    <i className="bi bi-person-plus me-2"></i>Invite Candidate
                </button>
            </div>
        </div>
    );
}