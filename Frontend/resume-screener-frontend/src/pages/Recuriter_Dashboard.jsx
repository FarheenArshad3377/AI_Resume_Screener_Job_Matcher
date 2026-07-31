import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRecruiterDashboard, clearError, clearSuccess } from '../store/slices/recruiterSlice';
import RecruiterNavbar from '../components/RecruiterNavbar';
import DashboardStats from '../components/DashboardStats';
import JobPostingCards from '../components/JobPostingCards';
import RecentApplications from '../components/RecentApplications';

export default function RecruiterDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { jobs, stats, recentCandidates, loading, error, success, successMessage } = useSelector(
    (state) => state.recruiter
  );

  useEffect(() => {
    dispatch(fetchRecruiterDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dispatch(clearSuccess()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  return (
    <div className="rp-landing rp-dash">
      <div className="rp-blob rp-blob-1" />
      <div className="rp-blob rp-blob-2" />

      <RecruiterNavbar toggleSidebar={() => {}} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <main className="p-4">
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

            {error && (
              <div className="rp-auth-alert d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <button className="rp-btn-outline btn-sm" onClick={() => dispatch(clearError())}>Dismiss</button>
              </div>
            )}

            {success && successMessage && (
              <div className="rp-auth-alert-success rp-auth-alert d-flex justify-content-between align-items-center">
                <span>{successMessage}</span>
                <button className="rp-btn-outline btn-sm" onClick={() => dispatch(clearSuccess())}>Dismiss</button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: 'var(--rp-accent-1)' }} />
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h3 className="fw-bold mb-0" style={{ color: 'var(--rp-text)' }}>Dashboard</h3>
                  <button className="rp-btn-gradient btn-sm" onClick={() => navigate('/post-job')}>
                    <i className="bi bi-plus-lg me-1"></i>Create New Job
                  </button>
                </div>
                <p className="mb-4" style={{ color: 'var(--rp-text-muted)' }}>
                  Welcome back! Here's what's happening with your jobs today.
                </p>

                <DashboardStats stats={stats} />

                <div className="row mt-4 g-4">
                  <div className="col-lg-8">
                    <JobPostingCards jobs={jobs} />
                  </div>
                  <div className="col-lg-4">
                    <RecentApplications candidates={recentCandidates} />
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}