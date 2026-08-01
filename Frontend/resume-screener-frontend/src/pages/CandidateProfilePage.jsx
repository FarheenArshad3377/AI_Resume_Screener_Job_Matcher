import { useState } from 'react';
import { useSelector } from 'react-redux';
import CandidateNavbar from '../components/CandidateNavbar';

export default function CandidateProfilePage() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="rp-landing rp-dash">
      <div className="rp-blob rp-blob-1" />
      <div className="rp-blob rp-blob-2" />

      <CandidateNavbar toggleSidebar={() => {}} />

      <main className="p-4" style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h3 className="fw-bold mb-1" style={{ color: 'var(--rp-text)' }}>My Profile</h3>
        <p className="mb-4" style={{ color: 'var(--rp-text-muted)' }}>Your account information.</p>

        <div className="rp-apply-card">
          <div className="d-flex align-items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--rp-border)' }}>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{ width: 64, height: 64, fontSize: '1.5rem', background: 'var(--rp-gradient)', color: '#fff' }}
            >
              {user?.fullName?.charAt(0) || '?'}
            </div>
            <div>
              <h5 className="mb-1" style={{ color: 'var(--rp-text)' }}>{user?.fullName || 'Candidate'}</h5>
              <small style={{ color: 'var(--rp-text-muted)' }}>{user?.role}</small>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <small className="d-block text-uppercase rp-stat-label">
                Full Name
              </small>
              <p className="mb-0 fw-semibold" style={{ color: 'var(--rp-text)' }}>{user?.fullName || '—'}</p>
            </div>

            <div className="col-md-6">
              <small className="d-block text-uppercase rp-stat-label">
                Email
              </small>
              <p className="mb-0 fw-semibold" style={{ color: 'var(--rp-text)' }}>{user?.email || '—'}</p>
            </div>

            <div className="col-md-6">
              <small className="d-block text-uppercase rp-stat-label">
                Account Type
              </small>
              <p className="mb-0 fw-semibold" style={{ color: 'var(--rp-text)' }}>{user?.role || '—'}</p>
            </div>
          </div>

          <div className="mt-4 mb-0 small rp-profile-note">
            <i className="bi bi-info-circle me-1"></i>
            Additional details (phone, location, skills, resume) coming soon.
          </div>
        </div>
      </main>
    </div>
  );
}