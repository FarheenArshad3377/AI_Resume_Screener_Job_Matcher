export default function CandidateCard({ candidate }) {
  const { name, role, matchScore, matchedSkills, missingSkills } = candidate;

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body d-flex flex-wrap align-items-center gap-3">
        <div
          className="rounded-circle bg-primary-subtle flex-shrink-0"
          style={{ width: '44px', height: '44px' }}
        ></div>

        <div style={{ width: '170px' }}>
          <div className="fw-bold">{name}</div>
          <small className="text-muted">{role}</small>
        </div>

        <div style={{ width: '130px' }}>
          <small className="text-muted d-block">AI Match Score</small>
          <div className="d-flex align-items-center gap-2">
            <div className="progress flex-grow-1" style={{ height: '5px' }}>
              <div
                className="progress-bar bg-primary"
                style={{ width: `${matchScore}%` }}
              ></div>
            </div>
            <small className="fw-bold text-primary">{matchScore}%</small>
          </div>
        </div>

        <div className="flex-grow-1 d-flex flex-wrap gap-1">
          {matchedSkills.map((skill) => (
            <span
              key={skill}
              className="badge bg-primary-subtle text-primary rounded-pill fw-normal"
            >
              {skill}
            </span>
          ))}
          {missingSkills.map((skill) => (
            <span
              key={skill}
              className="badge bg-danger-subtle text-danger rounded-pill fw-normal"
            >
              {skill}
            </span>
          ))}
        </div>

        
          < a href="#"
          className="text-primary small text-decoration-none fw-semibold text-nowrap"
        >
          AI Summary <i className="bi bi-chevron-down"></i>
        </a>

        <button className="btn btn-primary btn-sm fw-semibold text-nowrap">
          View Full Profile
        </button>
      </div>
    </div>
  );
}