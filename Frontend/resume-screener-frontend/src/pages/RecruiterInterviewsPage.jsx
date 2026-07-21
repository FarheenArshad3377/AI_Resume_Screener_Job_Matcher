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
import RecruiterSidebar from '../components/RecruiterSidebar';
import StatusBadge from '../components/StatusBadge';
import ScheduleInterviewModal from '../components/ScheduleInterviewModal';
import RecruiterRescheduleModal from '../components/RecruiterRescheduleModal';
import RecruiterFeedbackModal from '../components/RecruiterFeedbackModal';

export default function RecruiterInterviewsPage() {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    <>
      <RecruiterNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
        <RecruiterSidebar isOpen={sidebarOpen} />

        <main className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            <div className="d-flex justify-content-between align-items-center mb-1">
              <h3 className="fw-bold mb-0">Interviews</h3>
              <button className="btn btn-primary" onClick={() => dispatch(openScheduleModal())}>
                <i className="bi bi-plus-lg me-1"></i>Schedule New Interview
              </button>
            </div>
            <p className="text-muted mb-4">Manage and track interviews across all your job postings.</p>

            {error && (
              <div className="alert alert-danger d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch(clearError())}>Dismiss</button>
              </div>
            )}

            {/* Stat cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                      <i className="bi bi-calendar-check text-primary"></i>
                    </div>
                    <div>
                      <small className="text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Scheduled Today</small>
                      <h5 className="mb-0 fw-bold">{stats.scheduledToday}</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-info-subtle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                      <i className="bi bi-calendar-week text-info"></i>
                    </div>
                    <div>
                      <small className="text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>This Week</small>
                      <h5 className="mb-0 fw-bold">{stats.thisWeek}</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-warning-subtle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                      <i className="bi bi-hourglass-split text-warning"></i>
                    </div>
                    <div>
                      <small className="text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Pending Confirmation</small>
                      <h5 className="mb-0 fw-bold">{stats.pendingConfirmation}</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-success-subtle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                      <i className="bi bi-check-circle text-success"></i>
                    </div>
                    <div>
                      <small className="text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Completed</small>
                      <h5 className="mb-0 fw-bold">{stats.completed}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body d-flex flex-wrap gap-2 align-items-center">
                <div className="input-group" style={{ maxWidth: '220px' }}>
                  <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
                  <input
                    className="form-control bg-light border-0"
                    placeholder="Search candidate..."
                    value={filters.search}
                    onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
                  />
                </div>

                <select
                  className="form-select"
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
                  className="form-select"
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
                    className="form-control form-control-sm"
                    value={filters.dateFrom || ''}
                    onChange={(e) => dispatch(setFilters({ dateFrom: e.target.value }))}
                  />
                  <span className="text-muted small">to</span>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={filters.dateTo || ''}
                    onChange={(e) => dispatch(setFilters({ dateTo: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
                ) : interviews.length === 0 ? (
                  <div className="text-center py-5 text-muted">No interviews found</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr className="text-muted small text-uppercase">
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
                                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                  style={{ width: 32, height: 32, fontSize: '0.75rem', flexShrink: 0 }}
                                >
                                  {iv.candidateName?.charAt(0)}
                                </div>
                                <div>
                                  <div className="fw-semibold small">{iv.candidateName}</div>
                                  <small className="text-muted" style={{ fontSize: '0.72rem' }}>{iv.candidateEmail}</small>
                                </div>
                              </div>
                            </td>
                            <td className="small">{iv.jobTitle}</td>
                            <td>
                              <span className="badge bg-light text-dark border">{iv.interviewType}</span>
                            </td>
                            <td className="small text-muted">
                              {new Date(iv.scheduledDate).toLocaleString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
                              })}
                            </td>
                            <td>
                              <div className="d-flex" style={{ marginLeft: '4px' }}>
                                {(iv.interviewers || []).slice(0, 3).map((int, idx) => (
                                  <div
                                    key={int.id}
                                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center border border-white"
                                    style={{ width: 26, height: 26, fontSize: '0.65rem', marginLeft: '-4px', zIndex: idx }}
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
                                  className="btn btn-sm btn-light"
                                  onClick={() => setOpenMenuId(openMenuId === iv.id ? null : iv.id)}
                                >
                                  <i className="bi bi-three-dots-vertical"></i>
                                </button>
                                {openMenuId === iv.id && (
                                  <ul className="dropdown-menu dropdown-menu-end show" style={{ position: 'absolute', right: 0 }}>
                                    <li>
                                      <button className="dropdown-item" onClick={() => setOpenMenuId(null)}>
                                        View Details
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => { dispatch(openRescheduleModal(iv)); setOpenMenuId(null); }}
                                      >
                                        Edit / Reschedule
                                      </button>
                                    </li>
                                    {iv.status === 'Completed' && (
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          onClick={() => { dispatch(openFeedbackModal(iv)); setOpenMenuId(null); }}
                                        >
                                          Add Feedback
                                        </button>
                                      </li>
                                    )}
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => { dispatch(sendReminder(iv.id)); setOpenMenuId(null); }}
                                      >
                                        Send Reminder
                                      </button>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
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
            </div>

            {!loading && interviews.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted small">
                  Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} results
                </div>
                <div className="btn-group">
                  <button className="btn btn-outline-secondary btn-sm" disabled={page <= 1} onClick={() => dispatch(setPage(page - 1))}>Previous</button>
                  <button className="btn btn-outline-secondary btn-sm" disabled={page * pageSize >= totalCount} onClick={() => dispatch(setPage(page + 1))}>Next</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {scheduleModalOpen && <ScheduleInterviewModal />}
      {rescheduleTarget && <RecruiterRescheduleModal />}
      {feedbackTarget && <RecruiterFeedbackModal />}
    </>
  );
}