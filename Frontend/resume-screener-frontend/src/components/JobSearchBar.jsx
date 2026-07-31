export default function JobSearchBar({
    searchTerm, setSearchTerm,
    sortBy, setSortBy,
    filters, onFilterChange, onClearFilters
}) {
    return (
        <div className="rp-jobs-filter-card mb-4">
            <div className="row g-3 align-items-end mx-0">
                <div className="col-md-3">
                    <label className="rp-filter-label">Role Title</label>
                    <div className="input-group input-group-sm">
                        <span className="input-group-text"><i className="bi bi-search"></i></span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Design, Engineer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-md-3">
                    <label className="rp-filter-label">Location</label>
                    <div className="input-group input-group-sm">
                        <span className="input-group-text"><i className="bi bi-geo-alt"></i></span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Remote, Karachi..."
                            value={filters.location.join(', ')}
                            onChange={(e) =>
                                onFilterChange('location', e.target.value ? e.target.value.split(',').map(s => s.trim()) : [])
                            }
                        />
                    </div>
                </div>

                <div className="col-md-2">
                    <label className="rp-filter-label">Job Type</label>
                    <select
                        className="form-select form-select-sm"
                        value={filters.jobType[0] || ''}
                        onChange={(e) => onFilterChange('jobType', e.target.value ? [e.target.value] : [])}
                    >
                        <option value="">Any Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>

                <div className="col-md-2">
                    <label className="rp-filter-label">Experience</label>
                    <select
                        className="form-select form-select-sm"
                        value={filters.experience}
                        onChange={(e) => onFilterChange('experience', e.target.value)}
                    >
                        <option>Any Experience</option>
                        <option>Entry Level</option>
                        <option>Mid Level</option>
                        <option>Senior Level</option>
                    </select>
                </div>

                <div className="col-md-2">
                    <button className="rp-btn-gradient w-100" style={{ border: 'none' }} onClick={onClearFilters}>
                        Clear
                    </button>
                </div>
            </div>

            <div className="d-flex justify-content-end align-items-center mt-3">
                <label className="small fw-bold mb-0 me-2" style={{ color: 'var(--rp-text-muted)' }}>
                    Sort by:
                </label>
                <select
                    className="form-select form-select-sm d-inline-block"
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
    );
}