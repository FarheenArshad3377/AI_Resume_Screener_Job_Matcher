import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

export default function CandidateNavbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
            <li className="nav-item">
              <a className="nav-link" href="#dashboard" onClick={(e) => { e.preventDefault(); navigate('/my-applications'); }}>
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="#jobs" onClick={(e) => { e.preventDefault(); navigate('/jobs'); }}>
                Jobs
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#applications" onClick={(e) => { e.preventDefault(); navigate('/my-applications'); }}>
                Applications
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#interviews" onClick={(e) => { e.preventDefault(); navigate('/my-interviews'); }}>
                Interviews
              </a>
            </li>
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