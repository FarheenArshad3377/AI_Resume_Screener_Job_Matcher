export default function JobDetailStats({ stats }) {
    const getScoreColor = (score) => {
        if (score >= 80) return '#28a745';
        if (score >= 60) return '#ffc107';
        return '#dc3545';
    };

    return (
        <div className="row g-3 mb-4">
            {stats.map((stat, idx) => (
                <div key={idx} className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <p className="text-muted fw-bold small mb-2">{stat.label}</p>
                            <h4 className="mb-2">{stat.value}</h4>
                            {stat.change && (
                                <small className="text-success">
                                    <i className="bi bi-arrow-up"></i> {stat.change}
                                </small>
                            )}
                            {stat.detail && (
                                <small className="text-muted d-block">{stat.detail}</small>
                            )}
                            {stat.label === 'AVG. MATCH SCORE' && (
                                <div className="progress mt-2" style={{ height: '4px' }}>
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: stat.value, backgroundColor: getScoreColor(parseInt(stat.value)) }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}