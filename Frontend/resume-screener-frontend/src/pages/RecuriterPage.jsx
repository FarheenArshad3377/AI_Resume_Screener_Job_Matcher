import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../store/slices/jobsSlice';

function StatusBadge({ status }) {
  const isNew = status === 'New';
  return (
    <span
      className={`badge rounded-pill ${
        isNew ? 'bg-primary-subtle text-primary' : 'bg-warning-subtle text-warning-emphasis'
      }`}
    >
      {status}
    </span>
  );
}

function JobCard({ job }) {
  const navigate = useNavigate();

  // Backend se aane wale skills ek comma-separated string hain, tags mein todte hain
  const skillsArray = job.requiredSkills
    ? job.requiredSkills.split(',').map((s) => s.trim())
    : [];

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary"
              style={{ width: '40px', height: '40px' }}
            >
              <i className="bi bi-briefcase-fill"></i>
            </div>
            <StatusBadge status="New" />
          </div>

          <h5 className="card-title mb-1">{job.title}</h5>
          <p className="text-muted small mb-3">
            {new Date(job.createdAt).toLocaleDateString()}
          </p>

          <div className="mb-3">
            {skillsArray.map((skill) => (
              <span key={skill} className="badge bg-light text-dark border me-1 mb-1">
                {skill}
              </span>
            ))}
          </div>

          <hr />

          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              <i className="bi bi-people me-1"></i>
              {job.applications?.length || 0} Applicants
            </small>
            <button
              className="btn btn-sm btn-link text-primary text-decoration-none p-0"
              onClick={() => navigate(`/jobs/${job.id}/candidates`)}
            >
              View Applicants <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecruiterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: jobs, loading, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  return (
    <div className="p-4 flex-grow-1" style={{ backgroundColor: '#f8f9fb' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Active Job Postings</h3>
          <p className="text-muted mb-0">
            Manage your open positions and track candidate progress.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/jobs/1/apply')} // temporary, will link to a real create-job flow later
        >
          <i className="bi bi-plus-lg me-1"></i> Create New Job
        </button>
      </div>

      {loading && <p className="text-muted">Loading jobs...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      <div className="row">
        {jobs.map((job) => (
          <JobCard job={job} key={job.id} />
        ))}

        {jobs.length === 0 && !loading && (
          <p className="text-muted">No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
}