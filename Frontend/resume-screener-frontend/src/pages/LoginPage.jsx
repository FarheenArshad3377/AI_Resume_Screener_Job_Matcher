import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../store/slices/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await dispatch(login(formData));
  if (login.fulfilled.match(result)) {
    if (result.payload.role === 'Recruiter') {
      navigate('/');
    } else {
      navigate('/jobs');
    }
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
          <h4 className="fw-bold text-primary mb-1">Welcome Back</h4>
          <p className="text-muted small mb-4">Log in to your Recruiter Hub account.</p>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          <form onSubmit={handleSubmit}>
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
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center small text-muted mt-3 mb-0">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}