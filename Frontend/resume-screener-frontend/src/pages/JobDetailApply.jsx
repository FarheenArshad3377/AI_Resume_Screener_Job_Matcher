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
import RecruiterNavbar from '../components/RecruiterNavbar';

export default function JobDetailApply() {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { job, loading, error, success, successMessage, uploadedFileUrl } = useSelector(s => s.jobApply);
  const { user } = useSelector(s => s.auth);   // 👈 NEW

  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
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
// Backend expects these fields — ab logged-in user ka asli data
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
    <>
      <RecruiterNavbar toggleSidebar={() => {}} />
      <main className="p-4" style={{ maxWidth: 900, margin: '0 auto' }}>
        {error && <div className="alert alert-danger">{error} <button className="btn-close" onClick={() => dispatch(clearError())}></button></div>}
        {success && <div className="alert alert-success">{successMessage || 'Applied successfully'} <button className="btn-close" onClick={() => dispatch(clearSuccess())}></button></div>}

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h4 className="mb-1">{job?.title ?? 'Loading...'}</h4>
            <small className="text-muted">{job?.company} • {job?.location}</small>
            <p className="mt-3">{job?.description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5>Application</h5>

              <div className="mb-3">
                <label className="form-label">Resume</label>
                <input type="file" className="form-control" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                {uploadedFileUrl && <div className="mt-2"><a href={uploadedFileUrl} target="_blank" rel="noreferrer">Uploaded resume</a></div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Cover Letter</label>
                <textarea className="form-control" rows="5" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
              </div>

              {/* Example dynamic questions */}
              {job?.applicationQuestions?.length > 0 && (
                <div className="mb-3">
                  <h6>Questions</h6>
                  {job.applicationQuestions.map((q, idx) => (
                    <div key={idx} className="mb-2">
                      <label className="form-label">{q.question}</label>
                      <input className="form-control" value={answers[q.id] || ''} onChange={(e) => setAnswers(a => ({ ...a, [q.id]: e.target.value }))} />
                    </div>
                  ))}
                </div>
              )}

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/jobs')}>Cancel</button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}