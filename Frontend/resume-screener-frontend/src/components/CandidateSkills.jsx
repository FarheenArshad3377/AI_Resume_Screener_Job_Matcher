export default function CandidateSkills({ matchedSkills, missingSkills }) {
    // Ensure arrays exist
    const matched = Array.isArray(matchedSkills) ? matchedSkills : [];
    const missing = Array.isArray(missingSkills) ? missingSkills : [];

    return (
        <>
            {/* Matched Skills */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <h6 className="card-title mb-3">
                        <i className="bi bi-check-circle text-success me-2"></i>Matched Skills
                    </h6>
                    {matched.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                            {matched.map((skill, idx) => (
                                <span key={idx} className="badge bg-success">
                                    {skill.name || skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted small mb-0">No matched skills</p>
                    )}
                </div>
            </div>

            {/* Missing Skills */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <h6 className="card-title mb-3">
                        <i className="bi bi-exclamation-circle text-warning me-2"></i>Missing Skills
                    </h6>
                    {missing.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                            {missing.map((skill, idx) => (
                                <span key={idx} className="badge bg-light text-dark">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted small mb-0">No missing skills</p>
                    )}
                </div>
            </div>
        </>
    );
}