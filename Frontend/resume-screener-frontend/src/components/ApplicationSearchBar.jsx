export default function ApplicationSearchBar({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) {
    return (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <div className="input-group">
                            <span className="input-group-text bg-white">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search applications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-4 text-end">
                        <select
                            className="form-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Pending">Pending</option>
                            <option value="Interview">Interview</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}