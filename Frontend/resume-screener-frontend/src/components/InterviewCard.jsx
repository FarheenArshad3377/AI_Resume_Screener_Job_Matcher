function statusStyle(status) {
  const map = {
    'Scheduled': { badge: 'bg-primary-subtle text-primary', border: '#0d6efd' },
    'Rescheduled': { badge: 'bg-warning-subtle text-warning-emphasis', border: '#ffc107' },
    'Completed': { badge: 'bg-success-subtle text-success', border: '#198754' },
    'Cancelled': { badge: 'bg-danger-subtle text-danger', border: '#dc3545' },
    'Pending Confirmation': { badge: 'bg-secondary-subtle text-secondary', border: '#6c757d' }
  };
  return map[status] || map['Pending Confirmation'];
}

export default function InterviewCard({ interview, onJoin, onReschedule, onCancel, onViewFeedback, onViewDetails }) {
  const { badge } = statusStyle(interview.status);
  const isCancelled = interview.status === 'Cancelled';
  const isCompleted = interview.status === 'Completed';
  const isScheduled = interview.status === 'Scheduled' || interview.status === 'Rescheduled';

  return (
    <div
      className={`card border-0 shadow-sm mb-3 ${isCancelled ? 'opacity-75' : ''}`}
      style={{ background: isCancelled ? '#fafafa' : '#fff' }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36, background: '#eef4ff', flexShrink: 0 }}
            >
              <i className="bi bi-building text-primary"></i>
            </div>
            <div>
              <div className="fw-semibold">{interview.company}</div>
              <small className="text-primary">{interview.jobTitle}</small>
            </div>
          </div>
          <span className={`badge rounded-pill ${badge}`}>{interview.status}</span>
        </div>

        <div className="d-flex flex-wrap gap-4 p-2 rounded mb-2" style={{ background: '#f8f9fb' }}>
          <div>
            <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>TYPE</small>
            <small className="fw-semibold"><i className="bi bi-camera-video me-1"></i>{interview.interviewType}</small>
          </div>
          <div>
            <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>DATE/TIME</small>
            <small className="fw-semibold">
              <i className="bi bi-calendar-event me-1"></i>
              {new Date(interview.scheduledDate).toLocaleString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
              })}
            </small>
          </div>
          {interview.interviewerName && (
            <div>
              <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>INTERVIEWER</small>
              <small className="fw-semibold"><i className="bi bi-person me-1"></i>{interview.interviewerName}</small>
            </div>
          )}
        </div>

        {interview.rescheduleNote && (
          <small className="text-muted d-block mb-2">{interview.rescheduleNote}</small>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2">
            {isScheduled && (
              <>
                <button className="btn btn-primary btn-sm" onClick={() => onJoin(interview)}>
                  <i className="bi bi-camera-video-fill me-1"></i>Join Interview
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => onReschedule(interview)}>
                  Request Reschedule
                </button>
              </>
            )}
            {isCompleted && (
              <button className="btn btn-outline-primary btn-sm" onClick={() => onViewFeedback(interview)}>
                View Feedback
              </button>
            )}
          </div>

          <div className="d-flex gap-3 align-items-center">
            {isScheduled && (
              <button className="btn btn-link btn-sm text-danger p-0" onClick={() => onCancel(interview)}>
                Cancel
              </button>
            )}
            {(isCancelled || isCompleted) && (
              <button className="btn btn-link btn-sm text-primary p-0" onClick={() => onViewDetails(interview)}>
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}