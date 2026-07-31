import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchMyInterviews,
  requestReschedule,
  cancelInterview,
  fetchFeedback,
  openRescheduleModal,
  closeRescheduleModal,
  closeFeedbackModal,
  openDetailsModal,      
  closeDetailsModal,     
  clearError
} from '../store/slices/interviewSlice';
import CandidateNavbar from '../components/CandidateNavbar';
import InterviewCard from '../components/InterviewCard';
import RescheduleModal from '../components/RescheduleModal';
import FeedbackModal from '../components/FeedbackModal';
import InterviewDetailsModal from '../components/InterviewDetailsModal';

export default function MyInterviews() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((s) => s.auth);
  const {
    interviews, loading, error,
    rescheduleTarget, feedbackData, feedbackLoading,
     selectedInterview  
  } = useSelector((s) => s.interview);

  useEffect(() => {
    dispatch(fetchMyInterviews());
  }, [dispatch]);

  const list = Array.isArray(interviews) ? interviews : [];

  const upcoming = list.filter((i) => i.status === 'Scheduled' || i.status === 'Rescheduled').length;
  const completed = list.filter((i) => i.status === 'Completed').length;
  const cancelled = list.filter((i) => i.status === 'Cancelled').length;

  const handleJoin = (interview) => {
    if (interview.meetingLink) window.open(interview.meetingLink, '_blank');
  };

  const handleReschedule = (interview) => dispatch(openRescheduleModal(interview));
  const handleRescheduleSubmit = ({ interviewId, payload }) => {
    dispatch(requestReschedule({ interviewId, payload }));
  };

  const handleCancel = (interview) => {
    if (!confirm(`Cancel interview with ${interview.company}?`)) return;
    dispatch(cancelInterview(interview.id));
  };

  const handleViewFeedback = (interview) => dispatch(fetchFeedback(interview.id));
  const handleViewDetails = (interview) => dispatch(openDetailsModal(interview));

  return (
    <div className="rp-landing rp-dash">
      <div className="rp-blob rp-blob-1" />
      <div className="rp-blob rp-blob-2" />

      <CandidateNavbar toggleSidebar={() => {}} />

      <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)', position: 'relative', zIndex: 1 }}>
        <main className="flex-grow-1 p-4">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>

            <div className="d-flex justify-content-between align-items-center mb-1">
              <h3 className="fw-bold mb-0" style={{ color: 'var(--rp-text)' }}>My Interviews</h3>
              <button className="rp-btn-gradient btn-sm" onClick={() => navigate('/jobs')}>
                Browse Jobs
              </button>
            </div>
            <p className="mb-4" style={{ color: 'var(--rp-text-muted)' }}>
              Track and manage your upcoming and past interviews
            </p>

            {error && (
              <div className="rp-auth-alert d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <button className="rp-btn-outline btn-sm" onClick={() => dispatch(clearError())}>Dismiss</button>
              </div>
            )}

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="rp-stat-card d-flex align-items-center gap-3">
                  <div className="rp-stat-icon rp-stat-icon-purple">
                    <i className="bi bi-calendar-check"></i>
                  </div>
                  <div>
                    <small className="d-block text-uppercase rp-stat-label">Upcoming</small>
                    <h4 className="mb-0 fw-bold" style={{ color: 'var(--rp-text)' }}>{upcoming}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="rp-stat-card d-flex align-items-center gap-3">
                  <div className="rp-stat-icon rp-stat-icon-cyan">
                    <i className="bi bi-check-circle"></i>
                  </div>
                  <div>
                    <small className="d-block text-uppercase rp-stat-label">Completed</small>
                    <h4 className="mb-0 fw-bold" style={{ color: 'var(--rp-text)' }}>{completed}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="rp-stat-card d-flex align-items-center gap-3">
                  <div className="rp-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                    <i className="bi bi-x-circle"></i>
                  </div>
                  <div>
                    <small className="d-block text-uppercase rp-stat-label">Cancelled</small>
                    <h4 className="mb-0 fw-bold" style={{ color: 'var(--rp-text)' }}>{cancelled}</h4>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: 'var(--rp-accent-1)' }} />
              </div>
            ) : list.length === 0 ? (
              <div className="rp-apply-card text-center py-5">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: 70, height: 70, background: 'rgba(139, 92, 246, 0.15)' }}
                >
                  <i className="bi bi-camera-video" style={{ fontSize: '1.5rem', color: 'var(--rp-accent-1)' }}></i>
                </div>
                <h6 className="fw-bold" style={{ color: 'var(--rp-text)' }}>No interviews scheduled yet</h6>
                <p className="small mb-3" style={{ color: 'var(--rp-text-muted)' }}>
                  Keep applying to jobs to get your first interview!
                </p>
                <button className="rp-btn-gradient btn-sm me-2" onClick={() => navigate('/jobs')}>
                  <i className="bi bi-search me-1"></i>Browse Jobs
                </button>
                <button className="rp-btn-outline btn-sm" onClick={() => navigate('/my-applications')}>
                  View Application History
                </button>
              </div>
            ) : (
              list.map((iv) => (
                <InterviewCard
                  key={iv.id}
                  interview={iv}
                  onJoin={handleJoin}
                  onReschedule={handleReschedule}
                  onCancel={handleCancel}
                  onViewFeedback={handleViewFeedback}
                  onViewDetails={handleViewDetails}
                />
              ))
            )}
          </div>
        </main>
      </div>

      {rescheduleTarget && (
        <RescheduleModal
          interview={rescheduleTarget}
          loading={loading}
          onClose={() => dispatch(closeRescheduleModal())}
          onSubmit={handleRescheduleSubmit}
        />
      )}

      {(feedbackData || feedbackLoading) && (
        <FeedbackModal
          feedback={feedbackData}
          company={feedbackData?.company || rescheduleTarget?.company || ''}
          loading={feedbackLoading}
          onClose={() => dispatch(closeFeedbackModal())}
        />
      )}
      {selectedInterview && (
  <InterviewDetailsModal
    interview={selectedInterview}
    onClose={() => dispatch(closeDetailsModal())}
  />
)}
    </div>
  );
}