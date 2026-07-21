import { useNavigate } from 'react-router-dom';

export default function JobPostingCards({ jobs = [] }) {
    const navigate = useNavigate();

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Open':
                return 'bg-success';
            case 'Closed':
                return 'bg-danger';
            case 'Draft':
                return 'bg-warning';
            default:
                return 'bg-secondary';
        }
    };

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body">
                <h5 className="card-title mb-4">Job Postings</h5>

                {jobs.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted">No jobs posted yet</p>
                    </div>
                ) : (
                    <div className="list-group list-group-flush">
                        {jobs.map((job) => (
                            <div 
                                key={job.id} 
                               className="list-group-item px-0 py-4 mb-2 border-bottom cursor-pointer"
                                onClick={() => navigate(`/jobs/${job.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1">{job.title}</h6>
                                        <small className="text-muted d-block">
                                            <i className="bi bi-geo-alt me-1"></i>{job.location}
                                        </small>
                                        <small className="text-muted d-block">
                                            <i className="bi bi-briefcase me-1"></i>{job.employmentType}
                                        </small>
                                    </div>
                                    <div className="text-end">
                                        <span className={`badge ${getStatusBadge(job.status)} mb-2`}>
                                            {job.status}
                                        </span>
                                        <br />
                                        <small className="text-muted d-block">
                                            {job.applicants} Applications
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}