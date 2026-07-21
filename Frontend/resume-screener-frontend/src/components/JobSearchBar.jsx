export default function JobSearchBar({ searchTerm, setSearchTerm, sortBy, setSortBy }) {
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
                                placeholder="Search for jobs, skills, or companies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-4 text-end">
                        <label className="form-label small fw-bold mb-0 me-2">Sort by:</label>
                        <select 
                            className="form-select d-inline-block"
                            style={{ width: 'auto' }}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option>Newest First</option>
                            <option>Most Relevant</option>
                            <option>Salary High to Low</option>
                            <option>Salary Low to High</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}