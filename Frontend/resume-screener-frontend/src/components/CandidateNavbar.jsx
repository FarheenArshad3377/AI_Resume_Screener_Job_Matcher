import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

export default function CandidateNavbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { label: 'Dashboard', path: '/my-applications' },
    { label: 'Jobs', path: '/jobs' },
    { label: 'Applications', path: '/my-applications' },
    { label: 'Interviews', path: '/my-interviews' },
  ];

  return (
    <nav className="rp-dash-navbar navbar navbar-expand-lg">
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
            {navLinks.map((link) => (
              <li className="nav-item" key={link.label}>
                <a
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                  href={`#${link.label.toLowerCase()}`}
                  onClick={(e) => { e.preventDefault(); navigate(link.path); }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="ms-3 d-flex align-items-center gap-2">
            <button className="rp-icon-btn"><i className="bi bi-bell"></i></button>
            <button className="rp-icon-btn"><i className="bi bi-gear"></i></button>

            <div className="dropdown">
              <button className="btn p-0 border-0 bg-transparent dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', background: 'var(--rp-gradient)', color: '#fff' }}>
                  <i className="bi bi-person"></i>
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" style={{ background: 'var(--rp-surface)', border: '1px solid var(--rp-border)' }}>
                <li>
                  <button className="dropdown-item" style={{ color: 'var(--rp-text)' }} onClick={() => navigate('/profile')}>
                    Profile
                  </button>
                </li>
                <li><hr className="dropdown-divider" style={{ borderColor: 'var(--rp-border)' }} /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={() => { dispatch(logout()); navigate('/login'); }}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}