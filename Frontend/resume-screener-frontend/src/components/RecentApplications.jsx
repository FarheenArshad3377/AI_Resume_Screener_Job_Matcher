export default function RecentApplications({ candidates }) {
  const candidateList = Array.isArray(candidates) ? candidates : [];

  return (
    <div className="rp-apply-card">
      <h5 className="fw-bold mb-4" style={{ color: 'var(--rp-text)' }}>Recent Applications</h5>
      {candidateList.length === 0 ? (
        <div className="text-center py-5">
          <p style={{ color: 'var(--rp-text-muted)' }}>No recent applications</p>
        </div>
      ) : (
        <div>
          {candidateList.map((candidate) => (
            <div
              key={candidate.id}
              className="d-flex align-items-center gap-3 py-3"
              style={{ borderBottom: '1px solid var(--rp-border)' }}
            >
              <div className="rp-job-icon" style={{ width: 36, height: 36 }}>
                <i className="bi bi-person"></i>
              </div>
              <div>
                <div className="fw-semibold small" style={{ color: 'var(--rp-text)' }}>{candidate.name}</div>
                <small style={{ color: 'var(--rp-text-muted)' }}>{candidate.jobTitle}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}