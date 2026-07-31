import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchJobForApply,
  submitApplication,
  uploadResumeFile,
  clearError,
  clearSuccess,
  setUploadedFileUrl
} from '../store/slices/jobApplySlice';
import CandidateNavbar from '../components/CandidateNavbar';

export default function JobDetailApply() {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { job, loading, error, success, successMessage, uploadedFileUrl } = useSelector(s => s.jobApply);
  const { user } = useSelector(s => s.auth);

  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (jobId) dispatch(fetchJobForApply(jobId));
  }, [jobId, dispatch]);

  useEffect(() => {
    if (success) {
      setTimeout(() => navigate('/my-applications'), 1500);
    }
  }, [success, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);
    setResumeFileName(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      alert("Please select a resume.");
      return;
    }

    if (!user?.email) {
      alert("You must be logged in to apply.");
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append("name", user.fullName || '');
    formData.append("email", user.email || '');
    formData.append("jobId", jobId);
    formData.append("resumeFile", resumeFile);

    try {
      await dispatch(
        submitApplication({
          applicationData: formData,
        })
      ).unwrap();

      alert("Application submitted successfully!");
      navigate("/my-applications");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="rp-landing rp-dash">
      <div className="rp-blob rp-blob-1" />
      <div className="rp-blob rp-blob-2" />

      <CandidateNavbar />

      <main className="rp-apply-main" style={{ position: 'relative', zIndex: 1 }}>
        {error && (
          <div className="rp-auth-alert d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn-close btn-close-white" onClick={() => dispatch(clearError())}></button>
          </div>
        )}
        {success && (
          <div className="rp-auth-alert rp-auth-alert-success d-flex justify-content-between align-items-center">
            <span>{successMessage || 'Applied successfully'}</span>
            <button className="btn-close btn-close-white" onClick={() => dispatch(clearSuccess())}></button>
          </div>
        )}

        <div className="rp-apply-card mb-4">
          <h4 className="mb-1" style={{ color: 'var(--rp-text)' }}>{job?.title ?? 'Loading...'}</h4>
          <small className="text-muted">
            <i className="bi bi-geo-alt me-1"></i>
            {job?.company} • {job?.location}
          </small>
          <p className="mt-3 mb-0" style={{ color: 'var(--rp-text-muted)' }}>{job?.description}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rp-apply-card mb-4">
            <h5 className="mb-4" style={{ color: 'var(--rp-text)' }}>Application</h5>

            <div className="mb-4">
              <label className="rp-filter-label mb-2">Resume</label>
              <label className="rp-file-upload d-flex align-items-center">
                <span className="rp-file-upload-btn">Choose File</span>
                <span className="rp-file-upload-name">
                  {resumeFileName || 'No file chosen'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
              {uploadedFileUrl && (
                <div className="mt-2">
                  <a href={uploadedFileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--rp-accent-2)' }}>
                    Uploaded resume
                  </a>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="rp-filter-label mb-2">Cover Letter</label>
              <textarea
                className="form-control rp-apply-textarea"
                rows="5"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell us why you're a great fit for this role..."
              />
            </div>

            {job?.applicationQuestions?.length > 0 && (
              <div className="mb-4">
                <h6 style={{ color: 'var(--rp-text)' }}>Questions</h6>
                {job.applicationQuestions.map((q, idx) => (
                  <div key={idx} className="mb-3">
                    <label className="rp-filter-label mb-2">{q.question}</label>
                    <input
                      className="form-control rp-apply-input"
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="d-flex gap-2">
              <button type="submit" className="rp-btn-gradient" style={{ border: 'none', padding: '0.6rem 1.75rem' }} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
              <button type="button" className="rp-btn-outline" onClick={() => navigate('/jobs')}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}