import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';   // 👈 FIX 1: missing import add kiya

export default function CandidateNavbar({ toggleSidebar }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
            <div className="container-fluid">
                <button 
                    className="btn btn-link" 
                    onClick={toggleSidebar}
                    style={{ marginRight: '10px' }}
                >
                    <i className="bi bi-list"></i>
                </button>
                <span className="navbar-brand mb-0 h1" style={{ color: '#0066cc', fontWeight: 'bold' }}>
                    Recruiter Hub
                </span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a 
                                className="nav-link" 
                                href="#dashboard"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/my-applications');
                                }}
                            >
                                Dashboard
                            </a>
                        </li>
                        <li className="nav-item">
                            <a 
                                className="nav-link active" 
                                href="#jobs"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/jobs');
                                }}
                            >
                                Jobs
                            </a>
                        </li>
                        <li className="nav-item">
                            <a 
                                className="nav-link" 
                                href="#applications"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/my-applications');
                                }}
                            >
                                Applications
                            </a>
                        </li>
                        <li className="nav-item">
                            <a 
                                className="nav-link" 
                                href="#interviews"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/my-interviews');
                                }}
                            >
                                Interviews
                            </a>
                        </li>
                    </ul>
                    <div className="ms-3 d-flex align-items-center gap-2">
                        <button className="btn btn-outline-secondary rounded-circle">
                            <i className="bi bi-bell"></i>
                        </button>
                        <button className="btn btn-outline-secondary rounded-circle">
                            <i className="bi bi-gear"></i>
                        </button>

                        {/* Avatar dropdown */}
                        <div className="dropdown">
                            <button
                                className="btn p-0 border-0 bg-transparent dropdown-toggle d-flex align-items-center"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <div
                                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                    style={{ width: '36px', height: '36px' }}
                                >
                                    <i className="bi bi-person"></i>
                                </div>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <button className="dropdown-item" onClick={() => navigate('/profile')}>
                                        Profile
                                    </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button
                                        className="dropdown-item text-danger"
                                        onClick={() => {
                                            dispatch(logout());
                                            navigate('/login');
                                        }}
                                    >
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