export default function RecentApplications({ candidates }) {
  const candidateList = Array.isArray(candidates) ? candidates : [];

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-4">Recent Applications</h5>
        {candidateList.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No recent applications</p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {candidateList.map((candidate) => (
              <div key={candidate.id} className="list-group-item ...">
                ...
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}