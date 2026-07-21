import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

export default function Header({ variant = "full" }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isRecruiter = user?.role === "Recruiter";   // 👈 NEW

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const UserMenu = ({ size = 40 }) => (
    <div className="dropdown">
      <div
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        className="d-flex align-items-center gap-2"
      >
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.fullName || "User"
          )}&background=6366f1&color=fff`}
          alt="profile"
          className="rounded-circle"
          width={size}
          height={size}
        />
        <span className="d-none d-md-inline small fw-semibold">
          {user?.fullName}
        </span>
        <i className="bi bi-chevron-down small d-none d-md-inline"></i>
      </div>
      <ul className="dropdown-menu dropdown-menu-end shadow-sm">
    <li>
      <span className="dropdown-item-text small text-muted">
        {user?.email} · <span className="badge bg-light text-dark">{user?.role}</span>
      </span>
    </li>
    <li><hr className="dropdown-divider" /></li>
    <li className="nav-item">
    <button
        className="nav-link d-flex align-items-center gap-2 w-100 text-start text-dark"
        onClick={() => navigate('/recruiter/profile')}
    >
        <i className="bi bi-person-circle"></i>
        Profile
    </button>
</li>
    <li><hr className="dropdown-divider" /></li>
    <li>
      <button className="dropdown-item text-danger" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right me-2"></i>
        Logout
      </button>
    </li>
</ul>
    </div>
  );

  if (variant === "simple") {
    return (
      <nav className="navbar navbar-light bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
        <div
          className="d-flex align-items-center gap-3"
          role="button"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-list fs-5"></i>
          <span className="fw-bold text-primary">Recruiter Hub</span>
        </div>
        <UserMenu size={32} />
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-light bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
      <div
        className="d-flex align-items-center gap-3"
        role="button"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <i className="bi bi-list fs-4 d-lg-none"></i>
        <span className="fw-bold fs-5 text-primary">
          <i className="bi bi-grid-1x2-fill me-2"></i>
          Recruiter Hub
        </span>
      </div>

      <div className="flex-grow-1 mx-4 d-none d-md-block" style={{ maxWidth: "400px" }}>
        <div className="input-group">
          <span className="input-group-text bg-light border-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control bg-light border-0"
            placeholder="Search candidates or jobs..."
          />
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        {isRecruiter && (   // 👈 NEW - sirf Recruiter ko dikhega
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => navigate("/jobs/create")}
          >
            <i className="bi bi-plus-lg"></i>
            <span className="d-none d-sm-inline">Create New Job</span>
          </button>
        )}
        <UserMenu />
      </div>
    </nav>
  );
}