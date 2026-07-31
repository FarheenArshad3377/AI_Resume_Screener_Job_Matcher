import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInterviews,
  setFilters,
  setPage,
  clearError,
  openScheduleModal,
  openRescheduleModal,
  openFeedbackModal,
  cancelInterview,
  sendReminder
} from '../store/slices/recruiterInterviewSlice';
import RecruiterNavbar from '../components/RecruiterNavbar';
import StatusBadge from '../components/StatusBadge';
import ScheduleInterviewModal from '../components/ScheduleInterviewModal';
import RecruiterRescheduleModal from '../components/RecruiterRescheduleModal';
import RecruiterFeedbackModal from '../components/RecruiterFeedbackModal';

export default function RecruiterInterviewsPage() {
  const dispatch = useDispatch();
  const [openMenuId, setOpenMenuId] = useState(null);

  const {
    interviews, stats, loading, error, page, pageSize, totalCount,
    filters, scheduleModalOpen, rescheduleTarget, feedbackTarget, activeJobs
  } = useSelector((s) => s.recruiterInterview);

  useEffect(() => {
    dispatch(fetchInterviews({
      page, pageSize,
      search: filters.search,
      jobId: filters.jobId !== 'All' ? filters.jobId : undefined,
      status: filters.status !== 'All' ? filters.status : undefined,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo
    }));
  }, [dispatch, page, pageSize, filters]);

  const handleCancel = (interview) => {
    if (!confirm(`Cancel interview with ${interview.candidateName}?`)) return;
    dispatch(cancelInterview({ interviewId: interview.id }));
    setOpenMenuId(null);
  };

  return (
    <div className="rp-landing rp-dash">
      <div className="rp-blob rp-blob-1" />
      <div className="rp-blob rp-blob-2" />

      <RecruiterNavbar toggleSidebar={() => {}} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <main className="p-4">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            <div className="d-flex justify-content-between align-items-center mb-1">
              <h3 className="fw-bold mb-0" style={{ color: 'var(--rp-text)' }}>Interviews</h3>
              <button className="rp-btn-gradient btn-sm" onClick={() => dispatch(openScheduleModal())}>
                <i className="bi bi-plus-lg me-1"></i>Schedule New Interview
              </button>
            </div>
            <p className="mb-4" style={{ color: 'var(--rp-text-muted)' }}>
              Manage and track interviews across all your job postings.
            </p>

            {error && (
              <div className="rp-auth-alert d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <button className="rp-btn-outline btn-sm" onClick={() => dispatch(clearError())}>Dismiss</button>
              </div>
            )}

            {/* Stat cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="rp-stat-card d-flex align-items-center gap-3">
                  <div className="rp-stat-icon rp-stat-icon-purple">
                    <i className="bi bi-calendar-check"></i>
                  </div>
                  <div>
                    <small className="d-block text-uppercase rp-stat-label">Scheduled Today</small>
                    <h5 className="mb-0 fw-bold" style={{ color: 'var(--rp-text)' }}>{stats.scheduledToday}</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="rp-stat-card d-flex align-items-center gap-3">
                  <div className="rp-stat-icon rp-stat-icon-cyan">
                    <i className="bi bi-calendar-week"></i>
                  </div>
                  <div>
                    <small className="d-block text-uppercase rp-stat-label">This Week</small>
                    <h5 className="mb-0 fw-bold" style={{ color: 'var(--rp-text)' }}>{stats.thisWeek}</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="rp-stat-card d-flex align-items-center gap-3">
                  <div className="rp-stat-icon rp-stat-icon-amber">
                    <i className="bi bi-hourglass-split"></i>
                  </div>
                  <div>
                    <small className="d-block text-uppercase rp-stat-label">Pending Confirmation</small>
                    <h5 className="mb-0 fw-bold" style={{ color: 'var(--rp-text)' }}>{stats.pendingConfirmation}</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="rp-stat-card d-flex align-items-center gap-3">
                  <div className="rp-stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>
                    <i className="bi bi-check-circle"></i>
                  </div>
                  <div>
                    <small className="d-block text-uppercase rp-stat-label">Completed</small>
                    <h5 className="mb-0 fw-bold" style={{ color: 'var(--rp-text)' }}>{stats.completed}</h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="rp-apply-card mb-3 py-3">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <div className="input-group" style={{ maxWidth: '220px' }}>
                  <span className="input-group-text" style={{ background: 'var(--rp-surface-2)', border: '1px solid var(--rp-border)' }}>
                    <i className="bi bi-search" style={{ color: 'var(--rp-text-muted)' }}></i>
                  </span>
                  <input
                    className="form-control rp-apply-input"
                    placeholder="Search candidate..."
                    value={filters.search}
                    onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
                  />
                </div>

                <select
                  className="form-select rp-apply-input"
                  style={{ maxWidth: '180px' }}
                  value={filters.jobId}
                  onChange={(e) => dispatch(setFilters({ jobId: e.target.value }))}
                >
                  <option value="All">All Job Postings</option>
                  {activeJobs.map((job) => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>

                <select
                  className="form-select rp-apply-input"
                  style={{ maxWidth: '160px' }}
                  value={filters.status}
                  onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
                >
                  <option value="All">Status: All</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <div className="d-flex gap-1 align-items-center ms-auto">
                  <input
                    type="date"
                    className="form-control form-control-sm rp-apply-input"
                    value={filters.dateFrom || ''}
                    onChange={(e) => dispatch(setFilters({ dateFrom: e.target.value }))}
                  />
                  <span className="small" style={{ color: 'var(--rp-text-muted)' }}>to</span>
                  <input
                    type="date"
                    className="form-control form-control-sm rp-apply-input"
                    value={filters.dateTo || ''}
                    onChange={(e) => dispatch(setFilters({ dateTo: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="rp-apply-card">
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border" style={{ color: 'var(--rp-accent-1)' }} /></div>
              ) : interviews.length === 0 ? (
                <div className="text-center py-5" style={{ color: 'var(--rp-text-muted)' }}>No interviews found</div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle rp-dark-table">
                    <thead>
                      <tr className="small text-uppercase">
                        <th>Candidate</th>
                        <th>Job Title / Role</th>
                        <th>Interview Type</th>
                        <th>Date & Time</th>
                        <th>Interviewer(s)</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interviews.map((iv) => (
                        <tr key={iv.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: 32, height: 32, fontSize: '0.75rem', flexShrink: 0, background: 'var(--rp-gradient)', color: '#fff' }}
                              >
                                {iv.candidateName?.charAt(0)}
                              </div>
                              <div>
                                <div className="fw-semibold small" style={{ color: 'var(--rp-text)' }}>{iv.candidateName}</div>
                                <small style={{ fontSize: '0.72rem', color: 'var(--rp-text-muted)' }}>{iv.candidateEmail}</small>
                              </div>
                            </div>
                          </td>
                          <td className="small" style={{ color: 'var(--rp-text)' }}>{iv.jobTitle}</td>
                          <td>
                            <span className="badge rounded-pill rp-badge-muted">{iv.interviewType}</span>
                          </td>
                          <td className="small" style={{ color: 'var(--rp-text-muted)' }}>
                            {new Date(iv.scheduledDate).toLocaleString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
                            })}
                          </td>
                          <td>
                            <div className="d-flex" style={{ marginLeft: '4px' }}>
                              {(iv.interviewers || []).slice(0, 3).map((int, idx) => (
                                <div
                                  key={int.id}
                                  className="rounded-circle d-flex align-items-center justify-content-center"
                                  style={{ width: 26, height: 26, fontSize: '0.65rem', marginLeft: '-4px', zIndex: idx, background: 'var(--rp-surface-2)', color: 'var(--rp-text)', border: '2px solid var(--rp-surface)' }}
                                  title={int.name}
                                >
                                  {int.name?.charAt(0)}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td><StatusBadge status={iv.status} /></td>
                          <td className="text-end">
                            <div className="dropdown">
                              <button
                                className="rp-btn-outline btn-sm"
                                onClick={() => setOpenMenuId(openMenuId === iv.id ? null : iv.id)}
                              >
                                <i className="bi bi-three-dots-vertical"></i>
                              </button>
                              {openMenuId === iv.id && (
                                <ul
                                  className="dropdown-menu dropdown-menu-end show"
                                  style={{ position: 'absolute', right: 0, background: 'var(--rp-surface)', border: '1px solid var(--rp-border)' }}
                                >
                                  <li>
                                    <button className="dropdown-item" style={{ color: 'var(--rp-text)' }} onClick={() => setOpenMenuId(null)}>
                                      View Details
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      style={{ color: 'var(--rp-text)' }}
                                      onClick={() => { dispatch(openRescheduleModal(iv)); setOpenMenuId(null); }}
                                    >
                                      Edit / Reschedule
                                    </button>
                                  </li>
                                  {iv.status === 'Completed' && (
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        style={{ color: 'var(--rp-text)' }}
                                        onClick={() => { dispatch(openFeedbackModal(iv)); setOpenMenuId(null); }}
                                      >
                                        Add Feedback
                                      </button>
                                    </li>
                                  )}
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      style={{ color: 'var(--rp-text)' }}
                                      onClick={() => { dispatch(sendReminder(iv.id)); setOpenMenuId(null); }}
                                    >
                                      Send Reminder
                                    </button>
                                  </li>
                                  <li><hr className="dropdown-divider" style={{ borderColor: 'var(--rp-border)' }} /></li>
                                  <li>
                                    <button className="dropdown-item text-danger" onClick={() => handleCancel(iv)}>
                                      Cancel Interview
                                    </button>
                                  </li>
                                </ul>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {!loading && interviews.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="small" style={{ color: 'var(--rp-text-muted)' }}>
                  Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} results
                </div>
                <div className="btn-group">
                  <button className="rp-btn-outline btn-sm" disabled={page <= 1} onClick={() => dispatch(setPage(page - 1))}>Previous</button>
                  <button className="rp-btn-outline btn-sm" disabled={page * pageSize >= totalCount} onClick={() => dispatch(setPage(page + 1))}>Next</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {scheduleModalOpen && <ScheduleInterviewModal />}
      {rescheduleTarget && <RecruiterRescheduleModal />}
      {feedbackTarget && <RecruiterFeedbackModal />}
    </div>
  );
}