import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user) || {};

  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  });

  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    jobAlerts: true,
    applicationUpdates: true,
  });

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    // TODO: dispatch(updateProfile(profile)) — apna thunk/API call yahan lagao
    console.log('Saving profile:', profile);
    flashSaved();
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      alert('New password and confirm password match nahi ho rahe');
      return;
    }
    // TODO: dispatch(changePassword(passwords)) — apna thunk/API call yahan lagao
    console.log('Changing password');
    setPasswords({ current: '', next: '', confirm: '' });
    flashSaved();
  };

  const handlePrefsSave = () => {
    // TODO: dispatch(updateNotificationPrefs(prefs))
    console.log('Saving prefs:', prefs);
    flashSaved();
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notification Preferences' },
  ];

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '900px' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 style={{ color: 'var(--rp-text)' }}>Settings</h3>
        <button className="btn btn-link" onClick={() => navigate(-1)} style={{ color: 'var(--rp-text-muted)' }}>
          &larr; Back
        </button>
      </div>

      <div className="d-flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="btn"
            style={{
              background: activeTab === tab.id ? 'var(--rp-gradient)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--rp-text-muted)',
              border: '1px solid var(--rp-border)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        style={{
          background: 'var(--rp-surface)',
          border: '1px solid var(--rp-border)',
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        {saved && (
          <div className="alert alert-success py-2" role="alert">
            Changes saved.
          </div>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave}>
            <div className="mb-3">
              <label className="form-label" style={{ color: 'var(--rp-text-muted)' }}>Full Name</label>
              <input
                type="text"
                className="form-control"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ color: 'var(--rp-text-muted)' }}>Email</label>
              <input
                type="email"
                className="form-control"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ color: 'var(--rp-text-muted)' }}>Phone</label>
              <input
                type="tel"
                className="form-control"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <button type="submit" className="btn" style={{ background: 'var(--rp-gradient)', color: '#fff' }}>
              Save Profile
            </button>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handlePasswordSave}>
            <div className="mb-3">
              <label className="form-label" style={{ color: 'var(--rp-text-muted)' }}>Current Password</label>
              <input
                type="password"
                className="form-control"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ color: 'var(--rp-text-muted)' }}>New Password</label>
              <input
                type="password"
                className="form-control"
                value={passwords.next}
                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ color: 'var(--rp-text-muted)' }}>Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn" style={{ background: 'var(--rp-gradient)', color: '#fff' }}>
              Update Password
            </button>
          </form>
        )}

        {activeTab === 'notifications' && (
          <div>
            {[
              { key: 'emailNotifications', label: 'Email Notifications' },
              { key: 'jobAlerts', label: 'Job Alerts' },
              { key: 'applicationUpdates', label: 'Application Status Updates' },
            ].map((item) => (
              <div className="form-check form-switch mb-3" key={item.key}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={prefs[item.key]}
                  onChange={(e) => setPrefs({ ...prefs, [item.key]: e.target.checked })}
                />
                <label className="form-check-label" style={{ color: 'var(--rp-text)' }}>
                  {item.label}
                </label>
              </div>
            ))}
            <button onClick={handlePrefsSave} className="btn" style={{ background: 'var(--rp-gradient)', color: '#fff' }}>
              Save Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}