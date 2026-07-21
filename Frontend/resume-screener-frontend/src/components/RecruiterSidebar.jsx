import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';           // 👈 NEW
import { logout } from '../store/slices/authSlice'; 
export default function RecruiterSidebar({ isOpen }) {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();          // 👈 NEW
    const [active, setActive] = useState('Dashboard');

    const handleLogout = () => {             // 👈 NEW
        dispatch(logout());
        navigate('/login');
    };
  const mainNav = [
    {
        icon: 'bi-grid-1x2-fill',
        label: 'Dashboard',
        path: '/',
    },
    {
        icon: 'bi-people-fill',
        label: 'Applications',
        path: '/my-applications',
    },
    {
        icon: 'bi-calendar-event',
        label: 'Interviews',
        path: '/recruiter/interviews',   // 👈 FIX
    },
    {
        icon: 'bi-bar-chart-fill',
        label: 'Analytics',
        path: '#',   // Analytics page abhi nahi bani, isay chhod do filhal
    },
];

    return (
        <div
            className="d-flex flex-column justify-content-between bg-white border-end p-3"
            style={{
                width: isOpen ? '230px' : '0px',
                overflow: 'hidden',
                transition: 'width 0.3s ease',
                minHeight: '100vh'
            }}
        >
            <div>
                <div className="mb-4 px-2">
                    <div className="fw-bold text-primary fs-5">
                        RecruitPro AI
                    </div>
                    <small className="text-muted">
                        Modern Hiring
                    </small>
                </div>

               <ul className="nav nav-pills flex-column gap-1">
    {mainNav.map((item) => (
        <li className="nav-item" key={item.label}>
            <button
                className={`nav-link d-flex align-items-center gap-2 w-100 text-start ${
                    location.pathname === item.path ? 'active' : 'text-dark'
                }`}
                onClick={() => {
                    if (item.path !== '#') {
                        navigate(item.path);
                    }
                }}
            >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
            </button>
        </li>
    ))}
</ul>
            </div>

            <div>
                <button
                    className="btn btn-primary w-100 mb-3 fw-semibold"
                    onClick={() => navigate('/post-job')}
                >
                    + Create New Job
                </button>

                <ul className="nav nav-pills flex-column gap-1 mb-3">
                    <li className="nav-item">
                        <button className="nav-link d-flex align-items-center gap-2 w-100 text-start text-dark">
                            <i className="bi bi-gear-fill"></i>
                            Settings
                        </button>
                    </li>

                    <li className="nav-item">
                        <button className="nav-link d-flex align-items-center gap-2 w-100 text-start text-dark">
                            <i className="bi bi-question-circle"></i>
                            Help
                        </button>
                    </li>

                <li className="nav-item">
                <button
                    className="nav-link d-flex align-items-center gap-2 w-100 text-start text-danger"
                    onClick={handleLogout}   // 👈 YE ADD KARO
                >
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                </button>
            </li>
                </ul>

                <div className="d-flex align-items-center gap-2 px-2">
                    <div
                        className="rounded-circle bg-primary-subtle"
                        style={{ width: '40px', height: '40px' }}
                    ></div>

                    <div>
                        <div className="small fw-semibold">
                            Recruiter Profile
                        </div>

                        <small
                            className="text-muted"
                            style={{ fontSize: '0.72rem' }}
                        >
                            Lead Talent Partner
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}