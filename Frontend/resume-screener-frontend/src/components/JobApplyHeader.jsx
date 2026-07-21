export default function JobApplyHeader({ job }) {
    return (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h2 className="mb-2">{job.title}</h2>
                        <div className="d-flex gap-3 flex-wrap">
                            <span className="text-muted">
                                <i className="bi bi-clock me-2"></i>{job.employmentType}
                            </span>
                            <span className="text-muted">
                                <i className="bi bi-geo-alt me-2"></i>{job.location}
                            </span>
                            <span className="text-muted">
                                <i className="bi bi-currency-dollar me-2"></i>{job.salary}
                            </span>
                        </div>
                    </div>
                    <span className="badge bg-success">{job.status}</span>
                </div>
            </div>
        </div>
    );
}