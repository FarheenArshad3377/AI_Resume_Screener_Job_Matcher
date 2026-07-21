export default function FeedbackModal({ feedback, company, loading, onClose }) {
  if (!feedback && !loading) return null;

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '14px' }}>
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold mb-0">Interview Feedback — {company}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {loading ? (
              <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
            ) : (
              <>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: 44, height: 44 }}
                  >
                    {feedback.interviewerName?.charAt(0) || '?'}
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{feedback.interviewerName}</div>
                    <small className="text-muted">{feedback.role}</small>
                  </div>
                  <div className="text-end">
                    <div className="text-warning">
                      {'★'.repeat(Math.round(feedback.rating || 0))}
                      <span className="text-muted">{'★'.repeat(5 - Math.round(feedback.rating || 0))}</span>
                    </div>
                    <small className="text-muted">{feedback.rating?.toFixed(1)} / 5.0</small>
                  </div>
                </div>

                {feedback.notes && (
                  <div className="mb-3">
                    <small className="text-uppercase text-muted fw-semibold" style={{ fontSize: '0.7rem' }}>
                      Hiring Manager's Notes
                    </small>
                    <div
                      className="p-3 rounded mt-1 fst-italic small"
                      style={{ background: '#f8f9fb', borderLeft: '3px solid #0066cc' }}
                    >
                      "{feedback.notes}"
                    </div>
                  </div>
                )}

                <div className="row g-2 mb-3">
                  {feedback.cultureFit != null && (
                    <div className="col-6">
                      <small className="text-muted d-block mb-1">Culture Fit</small>
                      <div className="progress" style={{ height: '6px' }}>
                        <div className="progress-bar bg-primary" style={{ width: `${feedback.cultureFit}%` }} />
                      </div>
                      <small className="fw-semibold">{feedback.cultureFit}%</small>
                    </div>
                  )}
                  {feedback.techSkills != null && (
                    <div className="col-6">
                      <small className="text-muted d-block mb-1">Tech Skills</small>
                      <div className="progress" style={{ height: '6px' }}>
                        <div className="progress-bar bg-success" style={{ width: `${feedback.techSkills}%` }} />
                      </div>
                      <small className="fw-semibold">{feedback.techSkills}%</small>
                    </div>
                  )}
                </div>

                {feedback.outcome && (
                  <div className="alert bg-warning-subtle text-warning-emphasis text-center small mb-0">
                    <i className="bi bi-arrow-right-circle me-1"></i>
                    <strong>Interview Status:</strong> {feedback.outcome}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="modal-footer border-0">
            <button className="btn btn-primary w-100" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}