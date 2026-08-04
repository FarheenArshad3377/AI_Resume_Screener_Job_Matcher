import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecruiterPage from './pages/RecuriterPage';
import RecuriterDashboard from './pages/Recuriter_Dashboard';
import PostJobPage from './pages/PostNewJob';
import ResumeUploadPage from './pages/ResumeUploadPage';
import CandidateRankingPage from './pages/CandidateRankingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import JobDetailDiscription from './pages/JobDetailDiscription';
import JobDetailApply from './pages/JobDetailApply';
import MyApplications from './pages/MyApplications';
import CandidateProfileRecruiterView from './pages/CandidateProfileRecruiterView';
import BrowseJobs from './pages/BrowseJobs';
import ApplicationsPage from './pages/ApplicationsPage';
import MyInterviews from './pages/MyInterviews';
import RecruiterInterviewsPage from './pages/RecruiterInterviewsPage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import CandidateProfilePage from './pages/CandidateProfilePage';
import HomePage from './pages/HomePage';
import Settings from './pages/Settings'; 
import RecruiterSettings from './pages/RecruiterSettings';
import CandidateSettings from './pages/CandidateSettings';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 👇 Public landing — opens by default, no login required */}
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Recruiter routes */}
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Recruiter']}>
              <RecuriterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute allowedRoles={['Recruiter']}>
              <RecuriterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
        path="/recruiter/jobs/:jobId"
        element={
          <ProtectedRoute allowedRoles={['Recruiter']}>
            <JobDetailDiscription />
          </ProtectedRoute>
        }
      />
        <Route
          path="/applications"
          element={
            <ProtectedRoute allowedRoles={['Recruiter']}>
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-job"
          element={
            <ProtectedRoute allowedRoles={['Recruiter']}>
              <PostJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:jobId/edit"
          element={
            <ProtectedRoute allowedRoles={['Recruiter']}>
              <PostJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:jobId/candidates"
          element={
            <ProtectedRoute allowedRoles={['Recruiter']}>
              <CandidateRankingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/:candidateId"
          element={
            <ProtectedRoute allowedRoles={['Recruiter']}>
              <CandidateProfileRecruiterView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/profile"
          element={
            <ProtectedRoute allowedRoles={['Recruiter']}>
              <CompanyProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['Candidate']}>
              <CandidateProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Candidate routes */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRoles={['Candidate']}>
              <BrowseJobs />
            </ProtectedRoute>
          }
        />
        <Route
        path="/jobs/:jobId"
        element={
          <ProtectedRoute allowedRoles={['Candidate']}>
            <JobDetailDiscription />
          </ProtectedRoute>
        }
      />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRoles={['Candidate']}>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-interviews"
          element={
            <ProtectedRoute allowedRoles={['Candidate']}>
              <MyInterviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/interviews"
          element={
            <ProtectedRoute allowedRoles={['Recruiter']}>
              <RecruiterInterviewsPage />
            </ProtectedRoute>
          }
        />

      // existing 
      <Route path="/recruiter/settings" element={<RecruiterSettings />} />
         <Route path="/settings" element={<CandidateSettings />} />
        {/* Shared route */}
        <Route
          path="/jobs/:jobId/apply"
          element={
            <ProtectedRoute>
              <JobDetailApply />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;