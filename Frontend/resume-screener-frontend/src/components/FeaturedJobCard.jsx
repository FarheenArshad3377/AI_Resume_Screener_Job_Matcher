import { useNavigate } from "react-router-dom";

// NOTE: your current GET /jobs response (see jobsSlice) doesn't include
// company name, salary, location or an AI match score — those only exist
// per-application via POST /applications/{id}/score. Until the API returns
// richer job data, this card falls back to placeholders for any missing
// field so the landing page still looks complete. Swap these once your
// /jobs endpoint (or a dedicated /jobs/featured) returns real values.
export default function FeaturedJobCard({ job, score = 90, badge, avatars = [] }) {
  const navigate = useNavigate();

  const ringColor =
    score >= 95 ? "#22d3ee" : score >= 85 ? "#a855f7" : "#6c5ce7";

  return (
    <div
      className="rp-job-card"
      role="button"
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="rp-job-icon">
          <i className="bi bi-briefcase" />
        </div>
        <div className="text-center">
          <div
            className="rp-score-ring"
            style={{ "--score": score, "--ring-color": ringColor }}
          >
            <span>{score}%</span>
          </div>
          <div className="rp-score-caption mt-1">AI SCORE</div>
        </div>
      </div>

      <h6 className="mb-1">{job.title}</h6>
      <p className="text-muted small mb-3">{job.company || "Hiring Company"}</p>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <span className="rp-tag">{job.location || "Remote"}</span>
        <span className="rp-tag">{job.salary || "Competitive"}</span>
        {badge && (
          <span
            className={`rp-tag ${
              badge.toLowerCase() === "open" ? "rp-tag-open" : "rp-tag-accent"
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <div className="rp-avatar-stack d-flex align-items-center">
          {avatars.slice(0, 3).map((src, i) => (
            <img key={i} src={src} alt="" />
          ))}
          {avatars.length > 3 && (
            <span className="rp-avatar-more">+{avatars.length - 3}</span>
          )}
        </div>
        <button
          className="rp-bookmark-btn"
          onClick={(e) => e.stopPropagation()}
          aria-label="Save job"
        >
          <i className="bi bi-bookmark" />
        </button>
      </div>
    </div>
  );
}
