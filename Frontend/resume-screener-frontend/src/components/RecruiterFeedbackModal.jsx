import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFeedback,
  submitFeedback,
  closeFeedbackModal
} from '../store/slices/recruiterInterviewSlice';

export default function RecruiterFeedbackModal() {
  const dispatch = useDispatch();
  const { feedbackTarget, feedbackData, feedbackLoading, loading } = useSelector((s) => s.recruiterInterview);

  const [rating, setRating] = useState(0);
  const [strengths, setStrengths] = useState('');
  const [concerns, setConcerns] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [privateNotes, setPrivateNotes] = useState('');

  useEffect(() => {
    if (feedbackTarget) dispatch(fetchFeedback(feedbackTarget.id));
  }, [feedbackTarget, dispatch]);

  useEffect(() => {
    if (feedbackData) {
      setRating(feedbackData.rating || 0);
      setStrengths(feedbackData.strengths || '');
      setConcerns(feedbackData.concerns || '');
      setRecommendation(feedbackData.recommendation || null);
      setPrivateNotes(feedbackData.privateNotes || '');
    }
  }, [feedbackData]);

  if (!feedbackTarget) return null;

  const handleSubmit = () => {
    dispatch(submitFeedback({
      interviewId: feedbackTarget.id,
      payload: { rating, strengths, concerns, recommendation, privateNotes }
    }));
  };

  const recommendations = [
    { value: 'MoveToNextRound', label: 'Move to next round', icon: 'bi-arrow-right-circle', cls: 'btn-outline-primary' },
    { value: 'Reject', label: 'Reject', icon: 'bi-x-circle', cls: 'btn-outline-danger' },
    { value: 'Hire', label: 'Hire', icon: 'bi-check-circle', cls: 'btn-outline-success' }
  ];

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => dispatch(closeFeedbackModal())}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '14px' }}>
          <div className="modal-header border-0">
            <div>
              <h5 className="modal-title fw-bold mb-0">Add Interview Feedback</h5>
              <small className="text-muted">
                Candidate: {feedbackTarget.candidateName} • {feedbackTarget.jobTitle}
              </small>
            </div>
            <button className="btn-close" onClick={() => dispatch(closeFeedbackModal())}></button>
          </div>

          <div className="modal-body">
            {feedbackLoading ? (
              <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
            ) : (
              <>
                <label className="form-label small fw-semibold d-block">Overall Rating</label>
                <div className="mb-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <i
                      key={n}
                      className={`bi ${n <= rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'} me-1`}
                      style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                      onClick={() => setRating(n)}
                    ></i>
                  ))}
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-success">
                      <i className="bi bi-check-circle me-1"></i>Strengths
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Technical expertise, design system knowledge..."
                      value={strengths}
                      onChange={(e) => setStrengths(e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-warning-emphasis">
                      <i className="bi bi-exclamation-triangle me-1"></i>Concerns
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Areas for improvement or red flags..."
                      value={concerns}
                      onChange={(e) => setConcerns(e.target.value)}
                    />
                  </div>
                </div>

                <label className="form-label small fw-semibold d-block">Recommendation</label>
                <div className="d-flex gap-2 mb-3">
                  {recommendations.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      className={`btn btn-sm flex-grow-1 ${recommendation === r.value ? r.cls.replace('outline-', '') + ' text-white' : r.cls}`}
                      onClick={() => setRecommendation(r.value)}
                    >
                      <i className={`bi ${r.icon} d-block mb-1`}></i>
                      {r.label}
                    </button>
                  ))}
                </div>

                <label className="form-label small fw-semibold">
                  <i className="bi bi-lock me-1"></i>Private Recruiter Notes
                </label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Internal only. Not visible to hiring managers or AI summarizer."
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                />

                <div className="d-flex align-items-center gap-2 mt-2 text-muted small">
                  <i className="bi bi-magic"></i>
                  AI will summarize these notes for the hiring team.
                </div>
              </>
            )}
          </div>

          <div className="modal-footer border-0">
            <button className="btn btn-light" onClick={() => dispatch(closeFeedbackModal())}>Cancel</button>
            <button className="btn btn-primary" disabled={loading || feedbackLoading} onClick={handleSubmit}>
              {loading ? 'Saving...' : 'Save Feedback'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}