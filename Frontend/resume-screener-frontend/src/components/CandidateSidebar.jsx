import { useState } from 'react';

export default function CandidateSidebar({ isOpen, filters, onFilterChange, onClearFilters }) {
    return (
        <div 
            className="bg-white border-end p-3" 
            style={{ 
                width: isOpen ? '200px' : '0px',
                overflow: 'hidden',
                transition: 'width 0.3s ease',
                minHeight: '100%'
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-uppercase fw-bold mb-0">Filters</h6>
                <button 
                    className="btn btn-link btn-sm text-primary p-0"
                    onClick={onClearFilters}
                >
                    Clear all
                </button>
            </div>

            <hr />

            {/* Location Filter */}
            <div className="mb-4">
                <h6 className="text-uppercase fw-bold small mb-3">Location</h6>
                <div className="input-group mb-2">
                    <span className="input-group-text bg-white">
                        <i className="bi bi-geo-alt"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="City, State or Remote"
                    />
                </div>
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="remote"
                        checked={filters.location.includes('Remote')}
                        onChange={(e) => {
                            const updated = e.target.checked 
                                ? [...filters.location, 'Remote']
                                : filters.location.filter(l => l !== 'Remote');
                            onFilterChange('location', updated);
                        }}
                    />
                    <label className="form-check-label small" htmlFor="remote">
                        Remote
                    </label>
                </div>
            </div>

            <hr />

            {/* Job Type Filter */}
            <div className="mb-4">
                <h6 className="text-uppercase fw-bold small mb-3">Job Type</h6>
                {['Full-time', 'Contract', 'Part-time', 'Internship'].map((type) => (
                    <div key={type} className="form-check mb-2">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id={type}
                            checked={filters.jobType.includes(type)}
                            onChange={(e) => {
                                const updated = e.target.checked 
                                    ? [...filters.jobType, type]
                                    : filters.jobType.filter(t => t !== type);
                                onFilterChange('jobType', updated);
                            }}
                        />
                        <label className="form-check-label small" htmlFor={type}>
                            {type}
                        </label>
                    </div>
                ))}
            </div>

            <hr />

            {/* Salary Range Filter */}
            <div className="mb-4">
                <h6 className="text-uppercase fw-bold small mb-3">Salary Range</h6>
                <div className="d-flex justify-content-between mb-2">
                    <small className="text-muted">${filters.salaryRange[0] / 1000}k</small>
                    <small className="text-muted">${filters.salaryRange[1] / 1000}k</small>
                </div>
                <input 
                    type="range" 
                    className="form-range" 
                    min="0" 
                    max="200000" 
                    step="10000"
                    value={filters.salaryRange[1]}
                    onChange={(e) => {
                        onFilterChange('salaryRange', [filters.salaryRange[0], parseInt(e.target.value)]);
                    }}
                />
            </div>

            <hr />

            {/* Experience Filter */}
            <div className="mb-4">
                <h6 className="text-uppercase fw-bold small mb-3">Experience</h6>
                <select 
                    className="form-select form-select-sm"
                    value={filters.experience}
                    onChange={(e) => onFilterChange('experience', e.target.value)}
                >
                    <option>Any Experience</option>
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior Level</option>
                    <option>Lead / Manager</option>
                </select>
            </div>
        </div>
    );
}