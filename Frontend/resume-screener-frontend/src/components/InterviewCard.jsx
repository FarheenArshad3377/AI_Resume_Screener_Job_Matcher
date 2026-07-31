function statusStyle(status) {
  const map = {
    'Scheduled': 'rp-badge-info',
    'Rescheduled': 'rp-badge-accent',
    'Completed': 'rp-badge-success',
    'Cancelled': 'rp-badge-danger',
    'Pending Confirmation': 'rp-badge-muted'
  };
  return map[status] || 'rp-badge-muted';
}

export default function InterviewCard({ interview, onJoin, onReschedule, onCancel, onViewFeedback, onViewDetails }) {
  const badgeClass = statusStyle(interview.status);
  const isCancelled = interview.status === 'Cancelled';
  const isCompleted = interview.status === 'Completed';
  const isScheduled = interview.status === 'Scheduled' || interview.status === 'Rescheduled';

  return (
    <div
      className="rp-apply-card mb-3"
      style={{ opacity: isCancelled ? 0.75 : 1 }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex align-items-center gap-2">
          <div className="rp-job-icon" style={{ width: 40, height: 40 }}>
            <i className="bi bi-building"></i>
          </div>
          <div>
            <div className="fw-semibold" style={{ color: 'var(--rp-text)' }}>{interview.company}</div>
            <small style={{ color: 'var(--rp-accent-2)' }}>{interview.jobTitle}</small>
          </div>
        </div>
        <span className={`badge rounded-pill ${badgeClass}`}>{interview.status}</span>
      </div>

      <div
        className="d-flex flex-wrap gap-4 p-2 rounded mb-3"
        style={{ background: 'var(--rp-surface-2)' }}
      >
        <div>
          <small className="d-block" style={{ fontSize: '0.7rem', color: 'var(--rp-text-muted)' }}>TYPE</small>
          <small className="fw-semibold" style={{ color: 'var(--rp-text)' }}>
            <i className="bi bi-camera-video me-1"></i>{interview.interviewType}
          </small>
        </div>
        <div>
          <small className="d-block" style={{ fontSize: '0.7rem', color: 'var(--rp-text-muted)' }}>DATE/TIME</small>
          <small className="fw-semibold" style={{ color: 'var(--rp-text)' }}>
            <i className="bi bi-calendar-event me-1"></i>
            {new Date(interview.scheduledDate).toLocaleString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
            })}
          </small>
        </div>
        {interview.interviewerName && (
          <div>
            <small className="d-block" style={{ fontSize: '0.7rem', color: 'var(--rp-text-muted)' }}>INTERVIEWER</small>
            <small className="fw-semibold" style={{ color: 'var(--rp-text)' }}>
              <i className="bi bi-person me-1"></i>{interview.interviewerName}
            </small>
          </div>
        )}
      </div>

      {interview.rescheduleNote && (
        <small className="d-block mb-3" style={{ color: 'var(--rp-text-muted)' }}>
          <i className="bi bi-info-circle me-1"></i>{interview.rescheduleNote}
        </small>
      )}

      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-2">
          {isScheduled && (
            <>
              <button className="rp-btn-gradient btn-sm" onClick={() => onJoin(interview)}>
                <i className="bi bi-camera-video-fill me-1"></i>Join Interview
              </button>
              <button className="rp-btn-outline btn-sm" onClick={() => onReschedule(interview)}>
                Request Reschedule
              </button>
            </>
          )}
          {isCompleted && (
            <button className="rp-btn-outline btn-sm" onClick={() => onViewFeedback(interview)}>
              View Feedback
            </button>
          )}
        </div>

        <div className="d-flex gap-3 align-items-center">
          {isScheduled && (
            <button
              className="btn btn-link btn-sm p-0"
              style={{ color: '#f87171', textDecoration: 'none' }}
              onClick={() => onCancel(interview)}
            >
              Cancel
            </button>
          )}
          {(isCancelled || isCompleted) && (
            <button
              className="btn btn-link btn-sm p-0"
              style={{ color: 'var(--rp-accent-2)', textDecoration: 'none' }}
              onClick={() => onViewDetails(interview)}
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}