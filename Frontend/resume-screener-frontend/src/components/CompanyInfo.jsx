export default function CompanyInfo({ company }) {
    return (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
                <div className="text-center mb-4">
                    <div 
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: '60px', height: '60px', fontSize: '24px' }}
                    >
                        <i className="bi bi-building"></i>
                    </div>
                </div>

                <h6 className="text-center mb-1 fw-bold">{company.name}</h6>
                <p className="text-center text-muted small mb-3">
                    {company.employees} • {company.type}
                </p>

                <p className="text-muted small text-center">{company.description}</p>

                <button className="btn btn-outline-primary w-100">
                    View Company Profile
                </button>
            </div>
        </div>
    );
}