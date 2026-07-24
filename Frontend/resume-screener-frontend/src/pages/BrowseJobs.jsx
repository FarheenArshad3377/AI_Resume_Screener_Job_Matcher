import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchJobs,
    setFilters,
    setPage,
    clearError
} from '../store/slices/browseJobsSlice';
import CandidateNavbar from '../components/CandidateNavbar';
import CandidateSidebar from '../components/CandidateSidebar';
import JobSearchBar from '../components/JobSearchBar';
import JobCard from '../components/JobCard';

export default function BrowseJobs() {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('Newest First');

    const { jobs, loading, error, page, pageSize, totalCount, filters } =
        useSelector((s) => s.browseJobs);

    // Search/sort ko redux filters ke saath sync karna (debounce ke bina, chaho to baad mein add kar lena)
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

    // Backend job object ko JobCard ke expected shape mein map karna
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
        <div style={{ backgroundColor: '#f8f9fb', minHeight: '100vh' }}>
            <CandidateNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="d-flex" style={{ overflowX: 'hidden' }}>
           <div style={{ 
                width: sidebarOpen ? '280px' : '0px', 
                minWidth: sidebarOpen ? '280px' : '0px',
                transition: 'all 0.3s ease',
                overflow: 'hidden' 
            }}>
                <CandidateSidebar
                    isOpen={sidebarOpen}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />
                </div>
                <main className="flex-grow-1 p-4">
                    <h3 className="fw-bold mb-1">Browse Jobs</h3>
                    <p className="text-muted mb-4">
                        Discover {totalCount ?? jobs.length} active opportunities matching your profile
                    </p>

                    <JobSearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />

                    {error && (
                        <div className="alert alert-danger d-flex justify-content-between align-items-center">
                            <span>{error}</span>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch(clearError())}>
                                Dismiss
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" />
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-5 text-muted">No jobs found</div>
                    ) : (
                        <div className="row">
                            {jobs.map((job) => (
                                <div className="col-md-6 mb-4" key={job.id || job._id}>
                                    <JobCard job={mapJobForCard(job)} />
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && jobs.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div className="text-muted small">
                                Showing page {page} · {totalCount ?? jobs.length} jobs
                            </div>
                            <div className="btn-group">
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    disabled={page <= 1}
                                    onClick={() => dispatch(setPage(page - 1))}
                                >
                                    Prev
                                </button>
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    disabled={jobs.length < pageSize}
                                    onClick={() => dispatch(setPage(page + 1))}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}