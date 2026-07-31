import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function LandingNavbar() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isRecruiter = user?.role === "Recruiter";

  return (
    <nav className="rp-navbar py-3 px-4 d-flex align-items-center justify-content-between sticky-top">
      <div
        className="rp-logo"
        role="button"
        onClick={() => navigate("/")}
      >
        RecruitPro
      </div>

      <div className="d-none d-lg-flex align-items-center gap-4">
        <a className="rp-nav-link active" href="#top">Dashboard</a>
        <a
          className="rp-nav-link"
          href="/jobs"
          onClick={(e) => { e.preventDefault(); navigate("/jobs"); }}
        >
          Jobs
        </a>
        <a className="rp-nav-link" href="#top" onClick={(e) => e.preventDefault()}>
          Talent
        </a>
        <a className="rp-nav-link" href="#top" onClick={(e) => e.preventDefault()}>
          Analytics
        </a>
      </div>

      <div className="d-flex align-items-center gap-3">
        <input
          className="rp-search d-none d-md-block"
          type="text"
          placeholder="Search..."
        />
        <button
          className="rp-btn-gradient d-none d-sm-inline-flex align-items-center gap-2"
          style={{ padding: "0.55rem 1.25rem", fontSize: "0.85rem" }}
          onClick={() => navigate(isRecruiter ? "/post-job" : "/jobs")}
        >
          <i className="bi bi-plus-lg" />
          {isRecruiter ? "Post a Job" : "Find a Job"}
        </button>
        <button className="rp-icon-btn" aria-label="Notifications">
          <i className="bi bi-bell" />
        </button>
        <button className="rp-icon-btn" aria-label="Settings">
          <i className="bi bi-gear" />
        </button>
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.fullName || "Guest"
          )}&background=6c5ce7&color=fff`}
          alt="profile"
          className="rounded-circle"
          width={38}
          height={38}
          role="button"
          onClick={() => navigate(isRecruiter ? "/recruiter/profile" : "/profile")}
        />
      </div>
    </nav>
  );
}
