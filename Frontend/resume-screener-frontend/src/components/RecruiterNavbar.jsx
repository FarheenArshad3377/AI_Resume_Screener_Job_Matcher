import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

export default function RecruiterNavbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log('Logout clicked'); // 👈 temporary debug
    dispatch(logout());
    setMenuOpen(false);
    navigate('/login');
  };

  const handleProfile = () => {
    console.log('Profile clicked'); // 👈 temporary debug
    setMenuOpen(false);
    navigate('/recruiter/profile');
  };

  return (
    <nav className="rp-dash-navbar navbar navbar-expand-lg" style={{ position: 'relative', zIndex: 1000 }}>
      <div className="container-fluid">
        <button className="btn btn-link" onClick={toggleSidebar} style={{ marginRight: '10px', color: 'var(--rp-text-muted)' }}>
          <i className="bi bi-list"></i>
        </button>
        <span className="rp-logo">RecruitPro</span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#dashboard" onClick={(e) => { e.preventDefault(); navigate('/recruiter/dashboard'); }}>
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#applications" onClick={(e) => { e.preventDefault(); navigate('/applications'); }}>
                Applications
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#interviews" onClick={(e) => { e.preventDefault(); navigate('/recruiter/interviews'); }}>
                Interviews
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#post-job" onClick={(e) => { e.preventDefault(); navigate('/post-job'); }}>
                Post Job
              </a>
            </li>
          </ul>
          <div className="ms-3 d-flex align-items-center gap-2">
            <button className="rp-icon-btn position-relative">
              <i className="bi bi-bell"></i>
              <span
                className="position-absolute badge rounded-pill"
                style={{ top: -4, right: -4, background: '#f87171', fontSize: '0.6rem' }}
              >
                3
              </span>
            </button>
            <button className="rp-icon-btn"><i className="bi bi-gear"></i></button>

            <div ref={menuRef} style={{ position: 'relative', zIndex: 2000 }}>
              <button
                className="btn p-0 border-0 bg-transparent d-flex align-items-center"
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', background: 'var(--rp-gradient)', color: '#fff' }}>
                  <i className="bi bi-person"></i>
                </div>
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '110%',
                    background: 'var(--rp-surface)',
                    border: '1px solid var(--rp-border)',
                    borderRadius: '10px',
                    minWidth: '160px',
                    zIndex: 3000,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    onClick={handleProfile}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--rp-text)',
                      cursor: 'pointer'
                    }}
                  >
                    Profile
                  </button>
                  <hr style={{ margin: 0, borderColor: 'var(--rp-border)' }} />
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      color: '#f87171',
                      cursor: 'pointer'
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}