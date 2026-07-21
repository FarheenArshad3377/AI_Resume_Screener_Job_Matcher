export default function DashboardStats({ stats }) {
    return (
        <div className="row g-3">
            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="text-muted small mb-1">Total Jobs</p>
                                <h4 className="mb-0">{stats.totalJobs}</h4>
                            </div>
                            <div className="rounded-circle bg-primary-subtle p-2">
                                <i className="bi bi-briefcase text-primary"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="text-muted small mb-1">Active Jobs</p>
                                <h4 className="mb-0">{stats.activeJobs}</h4>
                            </div>
                            <div className="rounded-circle bg-success-subtle p-2">
                                <i className="bi bi-check-circle text-success"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="text-muted small mb-1">Applications</p>
                                <h4 className="mb-0">{stats.totalApplications}</h4>
                            </div>
                            <div className="rounded-circle bg-info-subtle p-2">
                                <i className="bi bi-people text-info"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="text-muted small mb-1">Pending Review</p>
                                <h4 className="mb-0">{stats.pendingReview}</h4>
                            </div>
                            <div className="rounded-circle bg-warning-subtle p-2">
                                <i className="bi bi-hourglass text-warning"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}