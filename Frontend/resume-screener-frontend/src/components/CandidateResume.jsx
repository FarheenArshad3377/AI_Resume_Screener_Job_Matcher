export default function CandidateResume({ candidate = {}, experience = [], education = {} }) {
    return (
        <>
            {/* Resume Header */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h5 className="mb-1">{candidate.name || 'N/A'}</h5>
                            <p className="text-muted mb-0">{candidate.position || 'N/A'}</p>
                        </div>
                        <div className="text-end">
                            <button className="btn btn-sm btn-outline-secondary me-2">
                                <i className="bi bi-download"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-secondary me-2">
                                <i className="bi bi-printer"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-secondary">
                                <i className="bi bi-share"></i>
                            </button>
                        </div>
                    </div>
                    <div className="row text-muted small">
                        <div className="col-6">
                            <p className="mb-1"><strong>Email:</strong> {candidate.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> {candidate.phone || 'N/A'}</p>
                        </div>
                        <div className="col-6">
                            <p className="mb-1"><strong>Location:</strong> {candidate.location || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Info Tabs */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <ul className="nav nav-tabs mb-4" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab">
                                CONTACT
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="experience-tab" data-bs-toggle="tab" data-bs-target="#experience" type="button" role="tab">
                                EXPERIENCE
                            </button>
                        </li>
                    </ul>

                    {/* Contact Tab */}
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="contact" role="tabpanel">
                            <p className="mb-2"><strong>Email:</strong></p>
                            <p className="text-primary mb-3">{candidate.email || 'N/A'}</p>
                            <p className="mb-2"><strong>Phone:</strong></p>
                            <p className="text-primary mb-3">{candidate.phone || 'N/A'}</p>
                            <p className="mb-2"><strong>Location:</strong></p>
                            <p className="mb-0">{candidate.location || 'N/A'}</p>
                        </div>

                        {/* Experience Tab */}
                        <div className="tab-pane fade" id="experience" role="tabpanel">
                            {experience && experience.length > 0 ? (
                                experience.map((exp, idx) => (
                                    <div key={idx} className="mb-4">
                                        <h6 className="mb-1">{exp.title}</h6>
                                        <p className="text-muted small mb-1">{exp.company}</p>
                                        <p className="text-muted small mb-2">{exp.duration}</p>
                                        <p className="mb-0">{exp.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No experience data</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Education */}
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <h6 className="card-title mb-3">EDUCATION</h6>
                    {education.degree ? (
                        <>
                            <h6 className="mb-1">{education.degree}</h6>
                            <p className="text-muted small mb-1">{education.school}</p>
                            <p className="text-muted small">{education.year}</p>
                        </>
                    ) : (
                        <p className="text-muted">No education data</p>
                    )}
                </div>
            </div>
        </>
    );
}