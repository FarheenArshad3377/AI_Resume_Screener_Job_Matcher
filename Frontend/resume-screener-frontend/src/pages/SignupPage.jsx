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

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#eef1f8' }}
    >
      <div
        className="card border-0 shadow-sm p-4"
        style={{ maxWidth: '420px', width: '100%', borderRadius: '16px' }}
      >
        <div className="card-body">
          <h4 className="fw-bold text-primary mb-1">Create Account</h4>
          <p className="text-muted small mb-4">Choose your account type to get started.</p>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          <div className="d-flex gap-2 mb-4">
            <button
              type="button"
              className={`btn flex-grow-1 ${
                formData.role === 'Recruiter' ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => setFormData({ ...formData, role: 'Recruiter' })}
            >
              <i className="bi bi-building me-2"></i>
              I'm Hiring
            </button>
            <button
              type="button"
              className={`btn flex-grow-1 ${
                formData.role === 'Candidate' ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => setFormData({ ...formData, role: 'Candidate', companyName: '' })}
            >
              <i className="bi bi-person me-2"></i>
              I'm Job Hunting
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold small">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-control bg-light border-0"
                placeholder="e.g. Ali Hassan"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {formData.role === 'Recruiter' && (
              <div className="mb-3">
                <label className="form-label fw-semibold small">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  className="form-control bg-light border-0"
                  placeholder="e.g. FinTech Pro"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label fw-semibold small">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control bg-light border-0"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small">Password</label>
              <input
                type="password"
                name="password"
                className="form-control bg-light border-0"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
              {loading ? 'Creating account...' : `Sign Up as ${formData.role}`}
            </button>
          </form>

          <p className="text-center small text-muted mt-3 mb-0">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}