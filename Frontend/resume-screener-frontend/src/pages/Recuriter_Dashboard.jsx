import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecruiterDashboard, clearError, clearSuccess } from '../store/slices/recruiterSlice';
import RecruiterNavbar from '../components/RecruiterNavbar';
import RecruiterSidebar from '../components/RecruiterSidebar';
import DashboardStats from '../components/DashboardStats';
import JobPostingCards from '../components/JobPostingCards';
import RecentApplications from '../components/RecentApplications';

export default function RecruiterDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const dispatch = useDispatch();
    
    const { jobs, stats, recentCandidates, loading, error, success, successMessage } = useSelector(
        state => state.recruiter
    );

    useEffect(() => {
        dispatch(fetchRecruiterDashboard());
    }, [dispatch]);

    // Auto-clear success message after 3 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                dispatch(clearSuccess());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, dispatch]);

    return (
        <>
            <RecruiterNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
                <RecruiterSidebar isOpen={sidebarOpen} />
                <main className="flex-grow-1" style={{ backgroundColor: '#f8f9fa', overflow: 'auto' }}>
                    <div className="p-4">
                        {/* Error Alert */}
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {error}
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => dispatch(clearError())}
                                ></button>
                            </div>
                        )}

                        {/* Success Alert */}
                        {success && successMessage && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                {successMessage}
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => dispatch(clearSuccess())}
                                ></button>
                            </div>
                        )}

                        {/* Loading State */}
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Page Header */}
                                <div className="mb-4">
                                    <h1 className="mb-2">Dashboard</h1>
                                    <p className="text-muted">Welcome back! Here's what's happening with your jobs today.</p>
                                </div>

                                {/* Stats Cards */}
                                <DashboardStats stats={stats} />

                                {/* Jobs and Applications Section */}
                                <div className="row mt-4 g-4">
                                    <div className="col-lg-8">
                                        <JobPostingCards jobs={jobs} />
                                    </div>
                                    <div className="col-lg-4">
                                        <RecentApplications candidates={recentCandidates} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}