import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMyApplications,
  fetchApplicationById,
  withdrawApplication,
  setPage,
  clearError
} from '../store/slices/myApplicationsSlice';
import CandidateNavbar from '../components/CandidateNavbar';
import InterviewsSidebar from '../components/InterviewsSidebar';

function getScoreVisual(score) {
  if (score >= 70) return { color: '#198754', label: 'Excellent' };
  if (score >= 40) return { color: '#0d6efd', label: 'High' };
  return { color: '#dc3545', label: 'Low' };
}

function ScoreRing({ score }) {
  if (score == null) {
    return (
      <div className="text-center" style={{ width: '60px' }}>
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
          style={{ width: 44, height: 44, border: '3px solid #e9ecef' }}
        >
          <i className="bi bi-hourglass-split text-muted" style={{ fontSize: '0.9rem' }}></i>
        </div>
        <div className="small text-muted" style={{ fontSize: '0.65rem' }}>Pending</div>
      </div>
    );
  }

  const { color, label } = getScoreVisual(score);
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="text-center" style={{ width: '60px' }}>
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={radius} fill="none" stroke="#eee" strokeWidth="4" />
        <circle
          cx="26" cy="26" r={radius} fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
        />
        <text x="26" y="30" textAnchor="middle" fontSize="12" fontWeight="700" fill={color}>
          {score}%
        </text>
      </svg>
      <div className="small text-muted" style={{ fontSize: '0.7rem' }}>{label}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Reviewed: { icon: 'bi-eye', cls: 'bg-info-subtle text-info' },
    Pending: { icon: 'bi-hourglass-split', cls: 'bg-secondary-subtle text-secondary' },
    Interview: { icon: 'bi-calendar-check', cls: 'bg-primary-subtle text-primary' },
    Closed: { icon: 'bi-x-circle', cls: 'bg-danger-subtle text-danger' },
    Offered: { icon: 'bi-check-circle', cls: 'bg-success-subtle text-success' },
    Withdrawn: { icon: 'bi-dash-circle', cls: 'bg-secondary-subtle text-secondary' },
    Scored: { icon: 'bi-star', cls: 'bg-primary-subtle text-primary' }
  };
  const conf = map[status] || { icon: 'bi-circle', cls: 'bg-secondary-subtle text-secondary' };

  return (
    <span className={`badge rounded-pill ${conf.cls}`}>
      <i className={`bi ${conf.icon} me-1`}></i>{status}
    </span>
  );
}

export default function MyApplications() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { applications, loading, error, page, pageSize, totalCount, currentApplication } =
    useSelector((s) => s.myApplications);

  useEffect(() => {
    dispatch(fetchMyApplications({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  const handleView = (id) => dispatch(fetchApplicationById(id));
  const handleCloseModal = () => dispatch({ type: 'myApplications/clearCurrentApplication' });
  const handleWithdraw = (id) => {
    if (!confirm('Withdraw application?')) return;
    dispatch(withdrawApplication(id));
  };

  const reviewsCount = applications.filter(a => a.status === 'Reviewed').length;
  const interviewsCount = applications.filter(a => a.status === 'Interview').length;

  return (
    <>
      <CandidateNavbar toggleSidebar={() => {}} />
      <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
        <InterviewsSidebar isOpen={true} user={user} />

        <main className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

            <div className="d-flex justify-content-between align-items-center mb-1">
              <h3 className="fw-bold mb-0">My Applications</h3>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => dispatch(clearError())}>
                Clear
              </button>
            </div>
            <p className="text-muted mb-4">Track your progress and match status for active job roles.</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center"
                      style={{ width: 44, height: 44 }}>
                      <i className="bi bi-file-earmark-text text-primary"></i>
                    </div>
                    <div>
                      <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.7rem' }}>Total Applied</small>
                      <h4 className="mb-0 fw-bold">{totalCount ?? applications.length}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-info-subtle d-flex align-items-center justify-content-center"
                      style={{ width: 44, height: 44 }}>
                      <i className="bi bi-eye text-info"></i>
                    </div>
                    <div>
                      <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.7rem' }}>Reviews</small>
                      <h4 className="mb-0 fw-bold">{String(reviewsCount).padStart(2, '0')}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-warning-subtle d-flex align-items-center justify-content-center"
                      style={{ width: 44, height: 44 }}>
                      <i className="bi bi-calendar-check text-warning"></i>
                    </div>
                    <div>
                      <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.7rem' }}>Interviews</small>
                      <h4 className="mb-0 fw-bold">{String(interviewsCount).padStart(2, '0')}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-5 text-muted">No applications found</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr className="text-muted small text-uppercase">
                          <th>Company & Role</th>
                          <th>Applied Date</th>
                          <th>Match Score</th>
                          <th>Status</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app) => (
                          <tr key={app.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="rounded bg-light d-flex align-items-center justify-content-center"
                                  style={{ width: 36, height: 36, flexShrink: 0 }}>
                                  <i className="bi bi-building text-muted"></i>
                                </div>
                                <div>
                                  <div className="fw-semibold">{app.jobTitle}</div>
                                  {app.company && <small className="text-muted">{app.company}</small>}
                                </div>
                              </div>
                            </td>
                            <td className="text-muted small">
                              {new Date(app.appliedDate).toLocaleDateString()}
                            </td>
                            <td><ScoreRing score={app.matchScore} /></td>
                            <td><StatusBadge status={app.status} /></td>
                            <td className="text-end">
                              <button className="btn btn-outline-secondary btn-sm" onClick={() => handleView(app.id)}>
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {!loading && applications.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted small">
                  Showing page {page} · {totalCount ?? applications.length} applications
                </div>
                <div className="btn-group">
                  <button className="btn btn-outline-secondary btn-sm" disabled={page <= 1}
                    onClick={() => dispatch(setPage(page - 1))}>Prev</button>
                  <button className="btn btn-outline-secondary btn-sm"
                    onClick={() => dispatch(setPage(page + 1))}>Next</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {currentApplication && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.55)' }} onClick={handleCloseModal}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '14px', overflow: 'hidden' }}>
              <div className="modal-header border-0 text-white" style={{ background: 'linear-gradient(135deg, #0066cc, #4d9fff)', padding: '1.5rem' }}>
                <div>
                  <h5 className="modal-title fw-bold mb-1">{currentApplication.jobTitle}</h5>
                  {currentApplication.company && (
                    <small className="opacity-75"><i className="bi bi-building me-1"></i>{currentApplication.company}</small>
                  )}
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <StatusBadge status={currentApplication.status} />
                  {currentApplication.matchScore != null && (
                    <div className="text-end">
                      <div className="fw-bold text-primary" style={{ fontSize: '1.4rem' }}>{currentApplication.matchScore}%</div>
                      <small className="text-muted">Match Score</small>
                    </div>
                  )}
                </div>
                <div className="d-flex align-items-center gap-3 p-2 rounded mb-3" style={{ background: '#f8f9fb' }}>
                  <div className="rounded-circle bg-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: 36, height: 36 }}>
                    <i className="bi bi-calendar-event text-primary"></i>
                  </div>
                  <div>
                    <small className="text-muted d-block">Applied On</small>
                    <span className="fw-semibold small">
                      {new Date(currentApplication.appliedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                {currentApplication.status !== 'Withdrawn' && currentApplication.status !== 'Closed' && (
                  <button className="btn btn-outline-danger w-100 mt-2" onClick={() => { handleWithdraw(currentApplication.id); handleCloseModal(); }}>
                    Withdraw Application
                  </button>
                )}
              </div>
              <div className="modal-footer border-0 px-4 pb-4 pt-0">
                <button className="btn btn-light w-100" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}