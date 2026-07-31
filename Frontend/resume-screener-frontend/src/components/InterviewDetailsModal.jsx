export default function InterviewDetailsModal({ interview, onClose }) {
  if (!interview) return null;

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="rp-modal-content">
          <div className="rp-modal-header">
            <div>
              <h5 className="fw-bold mb-1" style={{ color: '#fff' }}>{interview.jobTitle}</h5>
              <small className="opacity-75" style={{ color: '#fff' }}>
                <i className="bi bi-building me-1"></i>{interview.company}
              </small>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="p-4">
            <div className="mb-3">
              <span className="badge rounded-pill rp-badge-danger">{interview.status}</span>
            </div>

            <div className="d-flex flex-column gap-3">
              <div>
                <small className="d-block" style={{ color: 'var(--rp-text-muted)' }}>Type</small>
                <span style={{ color: 'var(--rp-text)' }}>{interview.interviewType}</span>
              </div>
              <div>
                <small className="d-block" style={{ color: 'var(--rp-text-muted)' }}>Date/Time</small>
                <span style={{ color: 'var(--rp-text)' }}>
                  {new Date(interview.scheduledDate).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
                  })}
                </span>
              </div>
              {interview.interviewerName && (
                <div>
                  <small className="d-block" style={{ color: 'var(--rp-text-muted)' }}>Interviewer</small>
                  <span style={{ color: 'var(--rp-text)' }}>{interview.interviewerName}</span>
                </div>
              )}
              {interview.rescheduleNote && (
                <div>
                  <small className="d-block" style={{ color: 'var(--rp-text-muted)' }}>Note</small>
                  <span style={{ color: 'var(--rp-text)' }}>{interview.rescheduleNote}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 pt-0">
            <button className="rp-btn-outline w-100" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}