export default function ApplicationsTable({ applications }) {
    const getScoreColor = (score) => {
        if (score >= 80) return '#28a745';
        if (score >= 60) return '#ffc107';
        return '#dc3545';
    };

    const getCompanyInitials = (company) => {
        return company
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getInitialsBg = (company) => {
        const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#17a2b8', '#0066cc'];
        return colors[company.charCodeAt(0) % colors.length];
    };

    return (
        <div className="card border-0 shadow-sm">
            <div className="table-responsive">
                <table className="table table-hover mb-0">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: '30%' }}>COMPANY & ROLE</th>
                            <th style={{ width: '15%' }}>APPLIED DATE</th>
                            <th style={{ width: '15%' }}>MATCH SCORE</th>
                            <th style={{ width: '15%' }}>STATUS</th>
                            <th style={{ width: '15%' }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td>
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded d-flex align-items-center justify-content-center text-white fw-bold"
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                backgroundColor: getInitialsBg(app.company),
                                                fontSize: '12px'
                                            }}
                                        >
                                            {getCompanyInitials(app.company)}
                                        </div>
                                        <div>
                                            <strong className="d-block">{app.company}</strong>
                                            <small className="text-muted">{app.role}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <small className="text-muted">{app.appliedDate}</small>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div 
                                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                backgroundColor: getScoreColor(app.matchScore),
                                                fontSize: '12px'
                                            }}
                                        >
                                            {app.matchScore}%
                                        </div>
                                        <small className="text-muted">{app.matchLevel}</small>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge bg-${app.statusColor}`}>
                                        {app.status === 'Interview' && <i className="bi bi-calendar-check me-1"></i>}
                                        {app.status === 'Reviewed' && <i className="bi bi-eye me-1"></i>}
                                        {app.status === 'Pending' && <i className="bi bi-clock me-1"></i>}
                                        {app.status === 'Closed' && <i className="bi bi-x-circle me-1"></i>}
                                        {app.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-outline-secondary">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}