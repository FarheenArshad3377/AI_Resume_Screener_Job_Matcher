import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function RecruiterNavbar({ toggleSidebar }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
            <div className="container-fluid">
                {/* Toggle Sidebar Button */}
                <button
                    className="btn btn-link me-3"
                    onClick={toggleSidebar}
                    style={{ textDecoration: 'none' }}
                >
                    <i className="bi bi-list fs-5"></i>
                </button>

                {/* Brand */}
                <a  className="navbar-brand fw-bold"
                    href="/"
                    onClick={(e) => { e.preventDefault(); navigate('/'); }}
                    >
                    RecruitPro AI
                    </a>

                {/* Navbar Toggler for Mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Items */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="ms-auto d-flex align-items-center gap-3">
                        {/* Search */}
                        <div className="input-group" style={{ maxWidth: '300px' }}>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Search jobs..."
                            />
                            <button className="btn btn-outline-secondary btn-sm" type="button">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>

                        {/* Notifications */}
                        <button className="btn btn-link position-relative" style={{ textDecoration: 'none' }}>
                            <i className="bi bi-bell fs-5 text-dark"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                3
                            </span>
                        </button>

                        {/* User Menu */}
                        <div className="dropdown">
                            <button
                                className="btn btn-link d-flex align-items-center gap-2"
                                type="button"
                                id="userMenu"
                                data-bs-toggle="dropdown"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div
                                    className="rounded-circle bg-primary-subtle"
                                    style={{ width: '36px', height: '36px' }}
                                ></div>
                                <i className="bi bi-chevron-down"></i>
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                                <li>
                                    <a  className="dropdown-item"
                                        href="#profile"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/recruiter/profile');
                                        }}>
                                        <i className="bi bi-person me-2"></i>Profile
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#settings">
                                        <i className="bi bi-gear me-2"></i>Settings
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item text-danger"
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right me-2"></i>Logout
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