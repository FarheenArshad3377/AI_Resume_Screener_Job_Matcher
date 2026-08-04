import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RecruiterNavbar from '../components/RecruiterNavbar';
import { fetchCompanyProfile } from '../store/slices/companyProfileSlice';

export default function CompanyProfilePage() {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((s) => s.companyProfile);

  useEffect(() => {
    dispatch(fetchCompanyProfile());
  }, [dispatch]);

  return (
    <div className="rp-landing rp-dash">
      <div className="rp-blob rp-blob-1" />
      <div className="rp-blob rp-blob-2" />

      <RecruiterNavbar toggleSidebar={() => {}} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <main className="p-4">
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>

            <h3 className="fw-bold mb-1" style={{ color: 'var(--rp-text)' }}>Company Profile</h3>
            <p className="mb-4" style={{ color: 'var(--rp-text-muted)' }}>
              Your account and company information.
            </p>

            {loading ? (
              <p style={{ color: 'var(--rp-text-muted)' }}>Loading...</p>
            ) : (
              <div className="rp-apply-card">
                <div
                  className="d-flex align-items-center gap-3 mb-4 pb-3"
                  style={{ borderBottom: '1px solid var(--rp-border)' }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: 64, height: 64, fontSize: '1.5rem', background: 'var(--rp-gradient)', color: '#fff' }}
                  >
                    {profile?.companyName?.charAt(0) || profile?.fullName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: 'var(--rp-text)' }}>
                      {profile?.companyName || 'Company Name Not Set'}
                    </h5>
                    <small style={{ color: 'var(--rp-text-muted)' }}>{profile?.role}</small>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <small className="d-block text-uppercase" style={{ fontSize: '0.7rem', color: 'var(--rp-text-muted)' }}>
                      Contact Person
                    </small>
                    <p className="mb-0 fw-semibold" style={{ color: 'var(--rp-text)' }}>{profile?.fullName || '—'}</p>
                  </div>

                  <div className="col-md-6">
                    <small className="d-block text-uppercase" style={{ fontSize: '0.7rem', color: 'var(--rp-text-muted)' }}>
                      Email
                    </small>
                    <p className="mb-0 fw-semibold" style={{ color: 'var(--rp-text)' }}>{profile?.email || '—'}</p>
                  </div>

                  <div className="col-md-6">
                    <small className="d-block text-uppercase" style={{ fontSize: '0.7rem', color: 'var(--rp-text-muted)' }}>
                      Company Name
                    </small>
                    <p className="mb-0 fw-semibold" style={{ color: 'var(--rp-text)' }}>{profile?.companyName || '—'}</p>
                  </div>

                  <div className="col-md-6">
                    <small className="d-block text-uppercase" style={{ fontSize: '0.7rem', color: 'var(--rp-text-muted)' }}>
                      Account Type
                    </small>
                    <p className="mb-0 fw-semibold" style={{ color: 'var(--rp-text)' }}>{profile?.role || '—'}</p>
                  </div>
                </div>

                <div
                  className="mt-4 mb-0 small p-3"
                  style={{
                    background: 'var(--rp-surface-2)',
                    border: '1px solid var(--rp-border)',
                    borderRadius: 'var(--rp-radius-md)',
                    color: 'var(--rp-text-muted)'
                  }}
                >
                  <i className="bi bi-info-circle me-1"></i>
                  Additional company details (phone, website, industry, address) coming soon.
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}