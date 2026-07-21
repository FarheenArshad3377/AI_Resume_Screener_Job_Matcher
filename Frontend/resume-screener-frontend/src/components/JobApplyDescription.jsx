export default function JobApplyDescription({ job }) {
    return (
        <>
            {/* Full Job Description */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">Full Job Description</h5>
                    <p className="text-muted">{job.description}</p>
                </div>
            </div>

            {/* Key Responsibilities */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">Key Responsibilities</h5>
                    <ul className="list-unstyled">
                        {job.responsibilities.map((responsibility, idx) => (
                            <li key={idx} className="mb-2">
                                <div className="d-flex gap-3">
                                    <i className="bi bi-check-circle text-success" style={{ marginTop: '2px' }}></i>
                                    <span>{responsibility}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Requirements */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">Requirements</h5>
                    <ul className="list-unstyled">
                        {job.requirements.map((requirement, idx) => (
                            <li key={idx} className="mb-2">
                                <div className="d-flex gap-3">
                                    <span className="text-muted">•</span>
                                    <span>{requirement}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}