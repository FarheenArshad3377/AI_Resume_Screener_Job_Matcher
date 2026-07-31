import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import RoleToggle from '../components/RoleToggle';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  // Cosmetic only — the API doesn't take a role on login, the server
  // returns the real role in the response. We still redirect based on
  // result.payload.role below, never on this toggle, so a wrong click
  // here can't send someone to the wrong dashboard.
  const [uiRole, setUiRole] = useState('candidate');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
      e.preventDefault();
      const result = await dispatch(login(formData));
      if (login.fulfilled.match(result)) {
        const payload = result.payload?.data ?? result.payload;
        navigate(payload.role === 'Recruiter' ? '/recruiter/dashboard' : '/jobs');
      }
};

  return (
    <div className="rp-landing rp-auth-wrapper">
      <div className="rp-blob rp-blob-1" />
      <div className="rp-blob rp-blob-2" />

      <div className="rp-auth-header">
        <div className="rp-logo" style={{ fontSize: '2.2rem' }}>RecruitPro</div>
        <p className="rp-auth-tagline">The Intelligence for Modern Talent</p>
      </div>

      <div className="rp-auth-card">
        <h4 className="fw-bold mb-1">Welcome Back</h4>
        <p className="text-muted small mb-4">Enter your credentials to access the portal</p>

      
        {error && <div className="rp-auth-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="rp-auth-label">Email Address</label>
            <div className="rp-input-wrap">
              <i className="bi bi-envelope rp-input-icon" />
              <input
                type="email"
                name="email"
                className="rp-auth-input"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="rp-auth-label mb-0">Password</label>
              <Link to="/forgot-password" className="rp-forgot-link">Forgot password?</Link>
            </div>
            <div className="rp-input-wrap">
              <i className="bi bi-lock rp-input-icon" />
              <input
                type="password"
                name="password"
                className="rp-auth-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="rp-btn-gradient w-100 d-flex align-items-center justify-content-center gap-2"
            style={{ fontSize: '0.95rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : (
              <>
                Sign In <i className="bi bi-arrow-right" />
              </>
            )}
          </button>
        </form>

        <div className="rp-auth-divider" />

        <p className="rp-auth-footer-text mb-0">
          Don't have an account? <Link to="/signup">Create Account</Link>
        </p>
      </div>

      <div className="rp-auth-below">
        © 2026 RecruitPro AI. All rights reserved.
        <Link to="#" onClick={(e) => e.preventDefault()}>Privacy Policy</Link>
        <Link to="#" onClick={(e) => e.preventDefault()}>Terms of Service</Link>
      </div>
    </div>
  );
}