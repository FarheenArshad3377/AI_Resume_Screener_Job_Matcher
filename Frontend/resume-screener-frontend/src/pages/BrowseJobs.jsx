import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchJobs,
    setFilters,
    setPage,
    clearError
} from '../store/slices/browseJobsSlice';
import CandidateNavbar from '../components/CandidateNavbar';
import JobSearchBar from '../components/JobSearchBar';
import JobCard from '../components/JobCard';

export default function BrowseJobs() {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('Newest First');

    const { jobs, loading, error, page, pageSize, totalCount, filters } =
        useSelector((s) => s.browseJobs);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setFilters({ q: searchTerm, sortBy }));
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm, sortBy, dispatch]);

    useEffect(() => {
        const params = {
            page,
            pageSize,
            q: filters.q,
            location: filters.location.join(','),
            jobType: filters.jobType.join(','),
            minSalary: filters.salaryRange[0],
            maxSalary: filters.salaryRange[1],
            experience: filters.experience,
            sortBy: filters.sortBy
        };
        dispatch(fetchJobs(params));
    }, [
        dispatch,
        page,
        pageSize,
        filters.q,
        filters.location,
        filters.jobType,
        filters.salaryRange,
        filters.experience,
        filters.sortBy
    ]);

    const handleFilterChange = (key, value) => {
        dispatch(setFilters({ [key]: value }));
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSortBy('Newest First');
        dispatch(setFilters({
            q: '',
            location: [],
            jobType: [],
            salaryRange: [0, 200000],
            experience: 'Any Experience',
            sortBy: 'Newest First'
        }));
    };

    const mapJobForCard = (job) => ({
        id: job.id || job._id,
        title: job.title,
        company: job.company || job.department || 'Company',
        location: job.location,
        status: job.status || 'Active',
        badge: job.badge || (job.featured ? 'Featured' : null),
        skills: Array.isArray(job.skills) ? job.skills : [],
        salary: job.salary || (job.minSalary && job.maxSalary
            ? `$${job.minSalary / 1000}k - $${job.maxSalary / 1000}k`
            : 'Not disclosed')
    });

    return (
        <div className="rp-landing rp-dash">
            <div className="rp-blob rp-blob-1" />
            <div className="rp-blob rp-blob-2" />

            <CandidateNavbar />

            <main className="rp-jobs-main" style={{ position: 'relative', zIndex: 1 }}>
                <div className="text-center mb-4">
                    <h1 className="rp-jobs-hero-title">
                        Find Your Next <span className="rp-text-gradient">Impact</span>
                    </h1>
                    <p className="text-muted mb-0">
                        Discover {totalCount ?? jobs.length} active opportunities matching your profile
                    </p>
                </div>

                <JobSearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

                {error && (
                    <div className="rp-auth-alert d-flex justify-content-between align-items-center">
                        <span>{error}</span>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch(clearError())}>
                            Dismiss
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: 'var(--rp-accent-1)' }} />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-5 text-muted">No jobs found</div>
                ) : (
                    <div className="row">
                        {jobs.map((job) => (
                            <div className="col-md-6 col-lg-4 mb-4" key={job.id || job._id}>
                                <JobCard job={mapJobForCard(job)} />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && jobs.length > 0 && (
                    <div className="rp-dash-pagination d-flex justify-content-between align-items-center mt-3">
                        <div className="text-muted small">
                            Showing page {page} · {totalCount ?? jobs.length} jobs
                        </div>
                        <div className="btn-group">
                            <button className="btn btn-sm" disabled={page <= 1} onClick={() => dispatch(setPage(page - 1))}>
                                Prev
                            </button>
                            <button className="btn btn-sm" disabled={jobs.length < pageSize} onClick={() => dispatch(setPage(page + 1))}>
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}