import { useNavigate } from 'react-router-dom';

export default function JobPostingCards({ jobs = [] }) {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open': return 'rp-badge-success';
      case 'Closed': return 'rp-badge-danger';
      case 'Draft': return 'rp-badge-muted';
      default: return 'rp-badge-muted';
    }
  };

  return (
    <div className="rp-apply-card">
      <h5 className="fw-bold mb-4" style={{ color: 'var(--rp-text)' }}>Job Postings</h5>

      {jobs.length === 0 ? (
        <div className="text-center py-5">
          <p style={{ color: 'var(--rp-text-muted)' }}>No jobs posted yet</p>
        </div>
      ) : (
        <div>
          {jobs.map((job) => (
            <div
              key={job.id}
              className="py-3 mb-1"
              style={{ borderBottom: '1px solid var(--rp-border)', cursor: 'pointer' }}
              onClick={() => navigate(`/recruiter/jobs/${job.id}`)}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="mb-1" style={{ color: 'var(--rp-text)' }}>{job.title}</h6>
                  <small className="d-block" style={{ color: 'var(--rp-text-muted)' }}>
                    <i className="bi bi-geo-alt me-1"></i>{job.location}
                  </small>
                  <small className="d-block" style={{ color: 'var(--rp-text-muted)' }}>
                    <i className="bi bi-briefcase me-1"></i>{job.employmentType}
                  </small>
                </div>
                <div className="text-end">
                  <span className={`badge rounded-pill ${getStatusBadge(job.status)} mb-2`}>
                    {job.status}
                  </span>
                  <small className="d-block" style={{ color: 'var(--rp-text-muted)' }}>
                    {job.applicants} Applications
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}