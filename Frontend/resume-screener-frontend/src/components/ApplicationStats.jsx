export default function ApplicationStats({ stats }) {
    const iconMap = {
        'bi-file-text': '#0066cc',
        'bi-eye': '#ff6b35',
        'bi-calendar-check': '#4169e1'
    };

    return (
        <div className="row g-3 mb-4">
            {stats.map((stat, idx) => (
                <div key={idx} className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted fw-bold small mb-2">{stat.label}</p>
                                    <h3 className="mb-0">{stat.value}</h3>
                                </div>
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ 
                                        width: '50px', 
                                        height: '50px', 
                                        backgroundColor: '#f0f0f0' 
                                    }}
                                >
                                    <i 
                                        className={`bi ${stat.icon}`}
                                        style={{ 
                                            color: iconMap[stat.icon],
                                            fontSize: '24px'
                                        }}
                                    ></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}