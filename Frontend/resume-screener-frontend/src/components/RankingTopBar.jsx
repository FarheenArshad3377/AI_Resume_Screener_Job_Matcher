import { useNavigate } from "react-router-dom";

export default function RankingTopBar({
  jobTitle,
  activeFilter,
  setActiveFilter,
}) {
  const navigate = useNavigate();

  const filters = [
    "All Applicants",
    "Shortlisted",
    "Rejected",
  ];

  return (
    <div className="bg-white border-bottom px-4 py-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
      <div>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <h5 className="fw-bold mb-0">
            Candidate Ranking
          </h5>

          <div className="d-flex gap-2">
            {filters.map((f) => (
              <span
                key={f}
                role="button"
                onClick={() => setActiveFilter(f)}
                className={`rounded-pill px-3 py-1 small ${
                  activeFilter === f
                    ? "bg-primary-subtle text-primary fw-semibold"
                    : "bg-light text-muted"
                }`}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <small className="text-muted text-uppercase">
          {jobTitle}
        </small>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div
          className="input-group"
          style={{ width: "220px" }}
        >
          <span className="input-group-text bg-light border-0">
            <i className="bi bi-search text-muted"></i>
          </span>

          <input
            type="text"
            className="form-control bg-light border-0"
            placeholder="Search candidates..."
          />
        </div>

        <i className="bi bi-bell fs-5 text-muted"></i>

        <button
          className="btn btn-primary btn-sm fw-semibold"
          onClick={() => window.print()}
        >
          Export CSV
        </button>

        <div
          role="button"
          onClick={() => navigate("/")}
          className="rounded-circle bg-primary-subtle"
          style={{
            width: "36px",
            height: "36px",
          }}
        ></div>
      </div>
    </div>
  );
}