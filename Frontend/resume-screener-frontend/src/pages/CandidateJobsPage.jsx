import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../store/slices/jobsSlice';
import Header from '../components/Header';

export default function CandidateJobsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: jobs, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  return (
    <div style={{ backgroundColor: '#f8f9fb', minHeight: '100vh' }}>
      <Header variant="simple" />

      <div className="p-4">
        <h3 className="fw-bold mb-1">Open Positions</h3>
        <p className="text-muted mb-4">Browse jobs and apply with your resume.</p>

        {loading && <p className="text-muted">Loading jobs...</p>}

        <div className="row">
          {jobs.map((job) => {
            const skills = job.requiredSkills
              ? job.requiredSkills.split(',').map((s) => s.trim())
              : [];
            return (
              <div className="col-md-4 mb-4" key={job.id}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-1">{job.title}</h5>
                    <p className="text-muted small mb-3">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mb-3">
                      {skills.map((skill) => (
                        <span key={skill} className="badge bg-light text-dark border me-1 mb-1">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="small text-muted flex-grow-1">{job.description}</p>
                    <button
                      className="btn btn-primary w-100 mt-2"
                      onClick={() => navigate(`/jobs/${job.id}/apply`)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {jobs.length === 0 && !loading && (
            <p className="text-muted">No open positions right now.</p>
          )}
        </div>
      </div>
    </div>
  );
}