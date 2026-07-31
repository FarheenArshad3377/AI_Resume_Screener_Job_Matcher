import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJobs } from "../../src/store/slices/jobsSlice.js";
import FeaturedJobCard from "./FeaturedJobCard.jsx";

const BADGES = ["URGENT", "OPEN", "FEATURED"];
const SCORES = [98, 85, 92];

export default function FeaturedJobs() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  const featured = (items || []).slice(0, 3);

  return (
    <section className="rp-section">
      <div className="container">
        <div className="d-flex justify-content-between align-items-end flex-wrap gap-2 mb-4">
          <div>
            <h2 className="h3 mb-1">Featured Positions</h2>
            <p className="rp-section-eyebrow mb-0">
              Top roles tailored for your profile based on 42 matching data points.
            </p>
          </div>
          <a
            className="rp-view-all"
            href="/jobs"
            onClick={(e) => e.preventDefault()}
          >
            View All Jobs <i className="bi bi-arrow-right ms-1" />
          </a>
        </div>

        {loading && (
          <p className="text-muted">Loading featured positions…</p>
        )}

        {!loading && featured.length === 0 && (
          <p className="text-muted">No open positions yet — check back soon.</p>
        )}

        <div className="row g-4">
          {featured.map((job, i) => (
            <div className="col-md-4" key={job.id ?? i}>
              <FeaturedJobCard
                job={job}
                score={SCORES[i % SCORES.length]}
                badge={BADGES[i % BADGES.length]}
                avatars={[]}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
