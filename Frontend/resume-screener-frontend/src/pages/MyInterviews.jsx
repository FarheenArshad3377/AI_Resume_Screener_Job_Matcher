import { useEffect, useState } from 'react';
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
  clearError
} from '../store/slices/interviewSlice';
import InterviewsSidebar from '../components/InterviewsSidebar';
import InterviewCard from '../components/InterviewCard';
import RescheduleModal from '../components/RescheduleModal';
import FeedbackModal from '../components/FeedbackModal';

export default function MyInterviews() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { user } = useSelector((s) => s.auth);
  const {
    interviews, loading, error,
    rescheduleTarget, feedbackData, feedbackLoading
  } = useSelector((s) => s.interview);

  useEffect(() => {
    dispatch(fetchMyInterviews());
  }, [dispatch]);

  const upcoming = interviews.filter((i) => i.status === 'Scheduled' || i.status === 'Rescheduled').length;
  const completed = interviews.filter((i) => i.status === 'Completed').length;
  const cancelled = interviews.filter((i) => i.status === 'Cancelled').length;

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

  const handleViewDetails = (interview) => {
    // Reuse feedback fetch path or navigate — placeholder for now
    dispatch(fetchFeedback(interview.id));
  };

  return (
    <div style={{ backgroundColor: '#f8f9fb', minHeight: '100vh' }}>
      <nav className="navbar navbar-light bg-white border-bottom shadow-sm px-3">
        <button className="btn btn-link" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <i className="bi bi-list"></i>
        </button>
        <div className="input-group mx-3" style={{ maxWidth: '320px' }}>
          <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
          <input className="form-control bg-light border-0" placeholder="Search interviews..." />
        </div>
        <div className="ms-auto d-flex align-items-center gap-3">
          <i className="bi bi-bell text-muted"></i>
          <i className="bi bi-gear text-muted"></i>
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32, fontSize: '0.8rem' }}
          >
            {user?.fullName?.charAt(0) || '?'}
          </div>
        </div>
      </nav>

      <div className="d-flex">
        <InterviewsSidebar isOpen={sidebarOpen} user={user} />

        <main className="flex-grow-1 p-4">
          <div style={{ maxWidth: '900px' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h3 className="fw-bold mb-0">My Interviews</h3>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/jobs')}>
                Browse Jobs
              </button>
            </div>
            <p className="text-muted mb-4">Track and manage your upcoming and past interviews</p>

            {error && (
              <div className="alert alert-danger d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch(clearError())}>Dismiss</button>
              </div>
            )}

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                      <i className="bi bi-calendar-check text-primary"></i>
                    </div>
                    <div>
                      <small className="text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>Upcoming</small>
                      <h5 className="mb-0 fw-bold">{upcoming}</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-success-subtle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                      <i className="bi bi-check-circle text-success"></i>
                    </div>
                    <div>
                      <small className="text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>Completed</small>
                      <h5 className="mb-0 fw-bold">{completed}</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-danger-subtle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                      <i className="bi bi-x-circle text-danger"></i>
                    </div>
                    <div>
                      <small className="text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>Cancelled</small>
                      <h5 className="mb-0 fw-bold">{cancelled}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
            ) : interviews.length === 0 ? (
              <div className="text-center py-5">
                <div
                  className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: 70, height: 70 }}
                >
                  <i className="bi bi-camera-video text-primary" style={{ fontSize: '1.5rem' }}></i>
                </div>
                <h6 className="fw-bold">No interviews scheduled yet</h6>
                <p className="text-muted small">Keep applying to jobs to get your first interview!</p>
                <button className="btn btn-primary btn-sm me-2" onClick={() => navigate('/jobs')}>
                  <i className="bi bi-search me-1"></i>Browse Jobs
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/my-applications')}>
                  View Application History
                </button>
              </div>
            ) : (
              interviews.map((iv) => (
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
    </div>
  );
}