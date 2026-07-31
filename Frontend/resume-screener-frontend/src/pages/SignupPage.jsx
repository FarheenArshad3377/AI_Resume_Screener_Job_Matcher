import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../store/slices/authSlice';

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Recruiter',
    companyName: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      navigate(result.payload.role === 'Recruiter' ? '/' : '/jobs');
    }
  };

  const isRecruiter = formData.role === 'Recruiter';

  return (
    <div className="rp-landing">
      <div className="rp-blob rp-blob-1" />
      <div className="rp-blob rp-blob-2" />

      <div className="rp-auth-wrapper">
        <div className="rp-auth-header">
          <div className="rp-logo" style={{ fontSize: '2.2rem' }}>
            RecruitPro
          </div>
          <p className="rp-auth-tagline">The Intelligence for Modern Talent</p>
        </div>

        <div className="rp-auth-card">
          <h4 className="fw-bold mb-1">Create Account</h4>
          <p className="text-muted small mb-4">
            Choose your account type to get started.
          </p>

          {error && <div className="rp-auth-alert">{error}</div>}

          <div className="rp-role-toggle mb-4 w-100">
            <div
              className="rp-role-pill"
              style={{
                left: isRecruiter ? '4px' : '50%',
                width: 'calc(50% - 4px)',
              }}
            />
            <button
              type="button"
              className={`rp-role-btn ${isRecruiter ? 'active' : ''}`}
              style={{ flex: 1 }}
              onClick={() => setFormData({ ...formData, role: 'Recruiter' })}
            >
              <i className="bi bi-building me-2"></i>
              I'm Hiring
            </button>
            <button
              type="button"
              className={`rp-role-btn ${!isRecruiter ? 'active' : ''}`}
              style={{ flex: 1 }}
              onClick={() =>
                setFormData({ ...formData, role: 'Candidate', companyName: '' })
              }
            >
              <i className="bi bi-person me-2"></i>
              I'm Job Hunting
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="rp-auth-label">Full Name</label>
              <div className="rp-input-wrap">
                <i className="bi bi-person rp-input-icon"></i>
                <input
                  type="text"
                  name="fullName"
                  className="rp-auth-input"
                  placeholder="e.g. Ali Hassan"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {isRecruiter && (
              <div className="mb-3">
                <label className="rp-auth-label">Company Name</label>
                <div className="rp-input-wrap">
                  <i className="bi bi-building rp-input-icon"></i>
                  <input
                    type="text"
                    name="companyName"
                    className="rp-auth-input"
                    placeholder="e.g. FinTech Pro"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="rp-auth-label">Email Address</label>
              <div className="rp-input-wrap">
                <i className="bi bi-envelope rp-input-icon"></i>
                <input
                  type="email"
                  name="email"
                  className="rp-auth-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="rp-auth-label">Password</label>
              <div className="rp-input-wrap">
                <i className="bi bi-lock rp-input-icon"></i>
                <input
                  type="password"
                  name="password"
                  className="rp-auth-input"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="rp-btn-gradient w-100 py-2 fw-semibold"
              style={{ border: 'none' }}
              disabled={loading}
            >
              {loading
                ? 'Creating account...'
                : `Sign Up as ${formData.role}`}{' '}
              {!loading && <i className="bi bi-arrow-right ms-1"></i>}
            </button>
          </form>

          <div className="rp-auth-divider"></div>

          <p className="rp-auth-footer-text mb-0">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>

        <div className="rp-auth-below">
          © 2026 RecruitPro AI. All rights reserved.{' '}
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}