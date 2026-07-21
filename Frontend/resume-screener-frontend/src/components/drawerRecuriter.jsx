import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  {
    icon: "bi-grid-1x2-fill",
    label: "Dashboard",
    path: "/my-applications",
  },
  {
    icon: "bi-briefcase-fill",
    label: "Jobs",
    path: "/",
  },
  {
    icon: "bi-people-fill",
    label: "Applicants",
    path: "/jobs/1/candidates", // change 1 if needed
  },
  {
    icon: "bi-gear-fill",
    label: "Settings",
    path: "#",
  },
];

export default function DrawerRecruiter() {
  const navigate = useNavigate();
  const location = useLocation();

  const [active, setActive] = useState("Dashboard");

  const storageUsedPercent = 65;

  return (
    <div
      className="d-flex flex-column justify-content-between bg-white border-end p-3"
      style={{ width: "240px", minHeight: "100vh" }}
    >
      <div>
        <ul className="nav nav-pills flex-column gap-1">
          {navItems.map((item) => (
            <li className="nav-item" key={item.label}>
              <button
                className={`nav-link d-flex align-items-center gap-2 w-100 text-start ${
                  active === item.label || location.pathname === item.path
                    ? "active"
                    : "text-dark"
                }`}
                onClick={() => {
                  setActive(item.label);

                  if (item.path !== "#") {
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

      <div className="mt-4">
        <small className="text-muted d-block mb-1">
          Storage used
        </small>

        <div className="progress" style={{ height: "6px" }}>
          <div
            className="progress-bar bg-primary"
            style={{ width: `${storageUsedPercent}%` }}
          ></div>
        </div>

        <small className="text-muted">
          650MB of 1GB used
        </small>
      </div>
    </div>
  );
}