import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCompanyProfile, updateCompanyProfile, clearSuccess as clearCompanySuccess } from '../store/slices/companyProfileSlice';
import { changePassword, clearAuthSuccess, clearAuthError } from '../store/slices/authSlice';

export default function RecruiterSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, loading: companyLoading, saving, error: companyError, success: companySuccess, successMessage } = useSelector((state) => state.companyProfile);
  const { loading: authLoading, error: authError, passwordChangeSuccess } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({ fullName: '', email: '', companyName: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  useEffect(() => {
    dispatch(fetchCompanyProfile());
    return () => { dispatch(clearCompanySuccess()); dispatch(clearAuthSuccess()); };
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || '',
        email: profile.email || '',
        companyName: profile.companyName || '',
      });
    }
  }, [profile]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    dispatch(updateCompanyProfile(form));
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) {
      alert('New password aur confirm password match nahi ho rahe.');
      return;
    }
    dispatch(clearAuthError());
    dispatch(changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }));
    setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
  };

  const tabs = [
    { id: 'profile', label: 'Company Profile' },
    { id: 'security', label: 'Security' },
  ];

  const switchTab = (id) => {
    setActiveTab(id);
    dispatch(clearCompanySuccess());
    dispatch(clearAuthSuccess());
    dispatch(clearAuthError());
  };

  return (
    <div
      className="rp-landing"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '4rem',
      }}
    >
      <div className="rp-blob rp-blob-1" />
      <div className="rp-blob rp-blob-2" />

      <div className="container-fluid" style={{ maxWidth: '700px', position: 'relative', zIndex: 1 }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="mb-1">Settings</h3>
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
              Manage your company profile and account security.
            </p>
          </div>
          <button
            className="btn rp-icon-btn"
            onClick={() => navigate(-1)}
            style={{ width: 'auto', borderRadius: 'var(--rp-radius-pill)', padding: '0.5rem 1.1rem', fontSize: '0.85rem', fontWeight: 600 }}
          >
            &larr; Back
          </button>
        </div>

        <div className="rp-role-toggle mb-4" style={{ width: 'fit-content' }}>
          <div
            className="rp-role-pill"
            style={{
              left: activeTab === 'profile' ? '4px' : 'calc(50% - 2px)',
              width: 'calc(50% - 2px)',
            }}
          />
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`rp-role-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rp-auth-card" style={{ maxWidth: '100%', margin: 0 }}>
          {activeTab === 'profile' && (
            <>
              {companyError && <div className="rp-auth-alert">{companyError}</div>}
              {companySuccess && (
                <div
                  className="rp-auth-alert"
                  style={{ background: 'rgba(34, 211, 238, 0.12)', borderColor: 'rgba(34, 211, 238, 0.35)', color: 'var(--rp-accent-cyan)' }}
                >
                  {successMessage}
                </div>
              )}
              {companyLoading ? (
                <p className="text-muted">Loading...</p>
              ) : (
                <form onSubmit={handleProfileSave}>
                  <div className="mb-3">
                    <label className="rp-auth-label">Full Name</label>
                    <div className="rp-input-wrap">
                      <input
                        type="text"
                        className="rp-auth-input"
                        style={{ paddingLeft: '1rem' }}
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="rp-auth-label">Email</label>
                    <div className="rp-input-wrap">
                      <input
                        type="email"
                        className="rp-auth-input"
                        style={{ paddingLeft: '1rem' }}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="rp-auth-label">Company Name</label>
                    <div className="rp-input-wrap">
                      <input
                        type="text"
                        className="rp-auth-input"
                        style={{ paddingLeft: '1rem' }}
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn rp-btn-gradient" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
              )}
            </>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSave}>
              {authError && <div className="rp-auth-alert">{authError}</div>}
              {passwordChangeSuccess && (
                <div
                  className="rp-auth-alert"
                  style={{ background: 'rgba(34, 211, 238, 0.12)', borderColor: 'rgba(34, 211, 238, 0.35)', color: 'var(--rp-accent-cyan)' }}
                >
                  Password updated successfully.
                </div>
              )}
              <div className="mb-3">
                <label className="rp-auth-label">Current Password</label>
                <div className="rp-input-wrap">
                  <input
                    type="password"
                    className="rp-auth-input"
                    style={{ paddingLeft: '1rem' }}
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="rp-auth-label">New Password</label>
                <div className="rp-input-wrap">
                  <input
                    type="password"
                    className="rp-auth-input"
                    style={{ paddingLeft: '1rem' }}
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="rp-auth-label">Confirm New Password</label>
                <div className="rp-input-wrap">
                  <input
                    type="password"
                    className="rp-auth-input"
                    style={{ paddingLeft: '1rem' }}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <button type="submit" className="btn rp-btn-gradient" disabled={authLoading}>
                {authLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}