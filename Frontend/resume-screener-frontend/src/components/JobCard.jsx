import { useNavigate } from 'react-router-dom';

export default function JobCard({ job }) {
  const navigate = useNavigate();

  return (
    <div className="rp-job-card">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="rp-job-icon">
          <i className="bi bi-building"></i>
        </div>
        {job.badge ? (
          <span className="rp-tag rp-tag-accent">{job.badge}</span>
        ) : (
          <span className="rp-tag rp-tag-open">{job.status}</span>
        )}
      </div>

      <h6 className="mb-1">{job.title}</h6>
      <p className="text-muted small mb-2">{job.company}</p>
      <p className="text-muted small mb-3">
        <i className="bi bi-geo-alt me-1"></i>
        {job.location}
      </p>

      <div className="mb-3">
        {job.skills.map((skill, idx) => (
          <span key={idx} className="rp-tag me-1 mb-1">
            {skill}
          </span>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <strong style={{ color: 'var(--rp-text)' }}>{job.salary}</strong>
      </div>

      <button
        className="rp-btn-gradient w-100"
        style={{ border: 'none' }}
        onClick={() => navigate(`/jobs/${job.id}/apply`)}
      >
        Apply Now
      </button>
    </div>
  );
}