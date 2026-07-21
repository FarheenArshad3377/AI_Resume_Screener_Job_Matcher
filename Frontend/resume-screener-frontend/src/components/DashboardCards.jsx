export default function DashboardCards() {
    const cards = [
        {
            title: 'TOTAL JOBS',
            value: '12',
            subtitle: '+2 this month',
            icon: 'bi-briefcase',
            color: '#0066cc'
        },
        {
            title: 'TOTAL APPLICANTS',
            value: '156',
            subtitle: '+24 since yesterday',
            icon: 'bi-people',
            color: '#ff6b35'
        },
        {
            title: 'AVG MATCH %',
            value: '72%',
            subtitle: 'Optimized by AI Hub',
            icon: 'bi-pie-chart',
            color: '#4169e1'
        }
    ];

    return (
        <div className="row g-3">
            {cards.map((card, idx) => (
                <div key={idx} className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted fw-bold small">{card.title}</p>
                                    <h3 className="mb-1">{card.value}</h3>
                                    <small className="text-muted">{card.subtitle}</small>
                                </div>
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0' }}
                                >
                                    <i className={`bi ${card.icon}`} style={{ color: card.color, fontSize: '24px' }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}