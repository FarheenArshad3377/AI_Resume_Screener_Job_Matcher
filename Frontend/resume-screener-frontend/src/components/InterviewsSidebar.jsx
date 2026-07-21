import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: 'bi-grid', path: '/dashboard' },
  { label: 'Browse Jobs', icon: 'bi-briefcase', path: '/jobs' },
  { label: 'My Applications', icon: 'bi-file-earmark-text', path: '/my-applications' },
  { label: 'My Interviews', icon: 'bi-camera-video', path: '/my-interviews' },
  { label: 'Profile', icon: 'bi-person', path: '/profile' }
];

export default function InterviewsSidebar({ isOpen, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="bg-white border-end d-flex flex-column"
      style={{
        width: isOpen ? '220px' : '0px',
        overflow: 'hidden',
        transition: 'width 0.3s ease',
        minHeight: 'calc(100vh - 60px)'
      }}
    >
      <div className="p-3">
        <span className="fw-bold" style={{ color: '#0066cc' }}>RecruitPro AI</span>
        <div className="text-muted" style={{ fontSize: '0.72rem' }}>Hiring Platform</div>
      </div>

      <nav className="flex-grow-1 px-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={`btn w-100 text-start d-flex align-items-center gap-2 mb-1 ${
                active ? 'btn-primary' : 'btn-light text-dark'
              }`}
              style={{ fontSize: '0.9rem' }}
              onClick={() => navigate(item.path)}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-top d-flex align-items-center gap-2">
        <div
          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
          style={{ width: '32px', height: '32px', fontSize: '0.8rem', flexShrink: 0 }}
        >
          {user?.fullName?.charAt(0) || '?'}
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="fw-semibold small text-truncate">{user?.fullName || 'Guest'}</div>
          <small className="text-muted" style={{ fontSize: '0.7rem' }}>Candidate</small>
        </div>
      </div>
    </div>
  );
}