export default function DashboardStats({ stats }) {
  const items = [
    { label: 'Total Jobs', value: stats.totalJobs, icon: 'bi-briefcase', cls: 'rp-stat-icon-purple' },
    { label: 'Active Jobs', value: stats.activeJobs, icon: 'bi-check-circle', cls: 'rp-stat-icon-cyan' },
    { label: 'Applications', value: stats.totalApplications, icon: 'bi-people', cls: 'rp-stat-icon-amber' },
    { label: 'Pending Review', value: stats.pendingReview, icon: 'bi-hourglass', cls: '', style: { background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' } }
  ];

  return (
    <div className="row g-3">
      {items.map((item) => (
        <div className="col-md-6 col-lg-3" key={item.label}>
          <div className="rp-stat-card d-flex align-items-center gap-3">
            <div className={`rp-stat-icon ${item.cls}`} style={item.style}>
              <i className={`bi ${item.icon}`}></i>
            </div>
            <div>
              <small className="d-block text-uppercase rp-stat-label">{item.label}</small>
              <h4 className="mb-0 fw-bold" style={{ color: 'var(--rp-text)' }}>{item.value ?? 0}</h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}