import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile, changePassword, clearAuthSuccess, clearAuthError } from '../store/slices/authSlice';

export default function CandidateSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error, profileUpdateSuccess, passwordChangeSuccess } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ fullName: user?.fullName || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  useEffect(() => {
    return () => dispatch(clearAuthSuccess());
  }, [dispatch]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    dispatch(updateProfile(profile));
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
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
  ];

  const switchTab = (id) => {
    setActiveTab(id);
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
        // alignItems: 'center',
        // justifyContent: 'center',
        paddingTop: '4rem', // isi value ko badhao/ghatao top se down karne ke liye
      }}
    >
      {/* ambient background blobs, consistent with rest of the app */}
      <div className="rp-blob rp-blob-1" />
      <div className="rp-blob rp-blob-2" />

      <div className="container-fluid" style={{ maxWidth: '700px', position: 'relative', zIndex: 1 }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="mb-1">Settings</h3>
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
              Manage your profile and account security.
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

        {/* Pill tab switcher, matches rp-role-toggle used elsewhere in the app */}
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
          {error && <div className="rp-auth-alert">{error}</div>}
          {profileUpdateSuccess && activeTab === 'profile' && (
            <div
              className="rp-auth-alert"
              style={{ background: 'rgba(34, 211, 238, 0.12)', borderColor: 'rgba(34, 211, 238, 0.35)', color: 'var(--rp-accent-cyan)' }}
            >
              Profile updated successfully.
            </div>
          )}
          {passwordChangeSuccess && activeTab === 'security' && (
            <div
              className="rp-auth-alert"
              style={{ background: 'rgba(34, 211, 238, 0.12)', borderColor: 'rgba(34, 211, 238, 0.35)', color: 'var(--rp-accent-cyan)' }}
            >
              Password updated successfully.
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave}>
              <div className="mb-3">
                <label className="rp-auth-label">Full Name</label>
                <div className="rp-input-wrap">
                  <input
                    type="text"
                    className="rp-auth-input"
                    style={{ paddingLeft: '1rem' }}
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="rp-auth-label">Email</label>
                <div className="rp-input-wrap">
                  <input
                    type="email"
                    className="rp-auth-input"
                    style={{ paddingLeft: '1rem' }}
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn rp-btn-gradient" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSave}>
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
              <button type="submit" className="btn rp-btn-gradient" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}