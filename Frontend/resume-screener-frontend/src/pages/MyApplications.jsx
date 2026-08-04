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
  if (score >= 70) return { color: '#4ade80', label: 'Excellent' };
  if (score >= 40) return { color: '#22d3ee', label: 'High' };
  return { color: '#f87171', label: 'Low' };
}

function ScoreRing({ score }) {
  if (score == null) {
    return (
      <div className="text-center" style={{ width: '60px' }}>
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
          style={{ width: 44, height: 44, border: '3px solid var(--rp-border)' }}
        >
          <i className="bi bi-hourglass-split" style={{ fontSize: '0.9rem', color: 'var(--rp-text-muted)' }}></i>
        </div>
        <div className="small" style={{ fontSize: '0.65rem', color: 'var(--rp-text-muted)' }}>Pending</div>
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
        <circle cx="26" cy="26" r={radius} fill="none" stroke="var(--rp-border)" strokeWidth="4" />
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
      <div className="small" style={{ fontSize: '0.7rem', color: 'var(--rp-text-muted)' }}>{label}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Reviewed: { icon: 'bi-eye', cls: 'rp-badge-info' },
    Pending: { icon: 'bi-hourglass-split', cls: 'rp-badge-muted' },
    Interview: { icon: 'bi-calendar-check', cls: 'rp-badge-accent' },
    Closed: { icon: 'bi-x-circle', cls: 'rp-badge-danger' },
    Offered: { icon: 'bi-check-circle', cls: 'rp-badge-success' },
    Withdrawn: { icon: 'bi-dash-circle', cls: 'rp-badge-muted' },
    Scored: { icon: 'bi-star', cls: 'rp-badge-accent' }
  };
  const conf = map[status] || { icon: 'bi-circle', cls: 'rp-badge-muted' };

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
    <div className="rp-landing rp-dash">
      <div className="rp-blob rp-blob-1" />
      <div className="rp-blob rp-blob-2" />

      <CandidateNavbar toggleSidebar={() => {}} />
      <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)', position: 'relative', zIndex: 1 }}>
        

        <main className="flex-grow-1 p-4">
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

            <div className="d-flex justify-content-between align-items-center mb-1">
              <h3 className="fw-bold mb-0" style={{ color: 'var(--rp-text)' }}>My Applications</h3>
              <button className="rp-btn-outline btn-sm" onClick={() => dispatch(clearError())}>
                Clear
              </button>
            </div>
            <p className="mb-4" style={{ color: 'var(--rp-text-muted)' }}>
              Track your progress and match status for active job roles.
            </p>

            {error && <div className="rp-auth-alert">{error}</div>}

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="rp-stat-card d-flex align-items-center gap-3">
                  <div className="rp-stat-icon rp-stat-icon-purple">
                    <i className="bi bi-file-earmark-text"></i>
                  </div>
                  <div>
                    <small className="d-block text-uppercase rp-stat-label">Total Applied</small>
                    <h4 className="mb-0 fw-bold" style={{ color: 'var(--rp-text)' }}>{totalCount ?? applications.length}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="rp-stat-card d-flex align-items-center gap-3">
                  <div className="rp-stat-icon rp-stat-icon-cyan">
                    <i className="bi bi-eye"></i>
                  </div>
                  <div>
                    <small className="d-block text-uppercase rp-stat-label">Reviews</small>
                    <h4 className="mb-0 fw-bold" style={{ color: 'var(--rp-text)' }}>{String(reviewsCount).padStart(2, '0')}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="rp-stat-card d-flex align-items-center gap-3">
                  <div className="rp-stat-icon rp-stat-icon-amber">
                    <i className="bi bi-calendar-check"></i>
                  </div>
                  <div>
                    <small className="d-block text-uppercase rp-stat-label">Interviews</small>
                    <h4 className="mb-0 fw-bold" style={{ color: 'var(--rp-text)' }}>{String(interviewsCount).padStart(2, '0')}</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="rp-apply-card p-0">
              <div className="p-4">
                {loading ? (
                  <div className="text-center py-5"><div className="spinner-border" style={{ color: 'var(--rp-accent-1)' }} /></div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-5" style={{ color: 'var(--rp-text-muted)' }}>No applications found</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle rp-dark-table">
                      <thead>
                        <tr className="small text-uppercase">
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
                                <div className="rp-job-icon" style={{ width: 36, height: 36, fontSize: '1rem' }}>
                                  <i className="bi bi-building"></i>
                                </div>
                                <div>
                                  <div className="fw-semibold" style={{ color: 'var(--rp-text)' }}>{app.jobTitle}</div>
                                  {app.company && <small style={{ color: 'var(--rp-text-muted)' }}>{app.company}</small>}
                                </div>
                              </div>
                            </td>
                            <td className="small" style={{ color: 'var(--rp-text-muted)' }}>
                              {new Date(app.appliedDate).toLocaleDateString()}
                            </td>
                            <td><ScoreRing score={app.matchScore} /></td>
                            <td><StatusBadge status={app.status} /></td>
                            <td className="text-end">
                              <button className="rp-btn-outline btn-sm" onClick={() => handleView(app.id)}>
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
              <div className="rp-dash-pagination d-flex justify-content-between align-items-center mt-3">
                <div className="small" style={{ color: 'var(--rp-text-muted)' }}>
                  Showing page {page} · {totalCount ?? applications.length} applications
                </div>
                <div className="btn-group">
                  <button className="btn btn-sm" disabled={page <= 1}
                    onClick={() => dispatch(setPage(page - 1))}>Prev</button>
                  <button className="btn btn-sm"
                    onClick={() => dispatch(setPage(page + 1))}>Next</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

  {currentApplication && (
  <div 
    className="rp-modal-backdrop" 
    onClick={handleCloseModal}
  >
    <div 
      className="rp-modal-dialog" 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="rp-modal-content">
        {/* Header */}
        <div className="rp-modal-header">
          <div>
            <h5 className="rp-modal-title">{currentApplication.jobTitle}</h5>
            {currentApplication.company && (
              <span className="rp-modal-subtitle">
                <i className="bi bi-building me-1"></i>{currentApplication.company}
              </span>
            )}
          </div>
          <button 
            type="button" 
            className="rp-modal-close-btn" 
            onClick={handleCloseModal}
            aria-label="Close"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className="rp-modal-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <StatusBadge status={currentApplication.status} />
            {currentApplication.matchScore != null && (
              <div className="text-end">
                <div className="rp-score-val">
                  {currentApplication.matchScore}%
                </div>
                <small className="rp-score-lbl">Match Score</small>
              </div>
            )}
          </div>

          <div className="rp-info-card">
            <div className="rp-job-icon">
              <i className="bi bi-calendar-event"></i>
            </div>
            <div>
              <small className="d-block text-muted">Applied On</small>
              <span className="fw-semibold small text-white">
                {new Date(currentApplication.appliedDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="rp-modal-footer">
          {/* {currentApplication.status !== 'Withdrawn' && currentApplication.status !== 'Closed' && (
            <button 
              className="btn btn-outline-danger w-100" 
              onClick={() => { handleWithdraw(currentApplication.id); handleCloseModal(); }}
            >
              Withdraw Application
            </button>
          )} */}
          {/* <button className="rp-btn-outline w-100" onClick={handleCloseModal}>
            Close
          </button> */}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}