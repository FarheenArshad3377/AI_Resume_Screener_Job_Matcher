import { useState } from 'react';
import { useSelector } from 'react-redux';
import CandidateNavbar from '../components/CandidateNavbar';

export default function CandidateProfilePage() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div style={{ backgroundColor: '#f8f9fb', minHeight: '100vh' }}>
      <CandidateNavbar toggleSidebar={() => {}} />

      <main className="p-4" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h3 className="fw-bold mb-1">My Profile</h3>
        <p className="text-muted mb-4">Your account information.</p>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 64, height: 64, fontSize: '1.5rem' }}
              >
                {user?.fullName?.charAt(0) || '?'}
              </div>
              <div>
                <h5 className="mb-1">{user?.fullName || 'Candidate'}</h5>
                <small className="text-muted">{user?.role}</small>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.7rem' }}>
                  Full Name
                </small>
                <p className="mb-0 fw-semibold">{user?.fullName || '—'}</p>
              </div>

              <div className="col-md-6">
                <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.7rem' }}>
                  Email
                </small>
                <p className="mb-0 fw-semibold">{user?.email || '—'}</p>
              </div>

              <div className="col-md-6">
                <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.7rem' }}>
                  Account Type
                </small>
                <p className="mb-0 fw-semibold">{user?.role || '—'}</p>
              </div>
            </div>

            <div className="alert alert-light border mt-4 mb-0 small text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Additional details (phone, location, skills, resume) coming soon.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}