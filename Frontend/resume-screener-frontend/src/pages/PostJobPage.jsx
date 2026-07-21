import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  setFormData,
  resetFormData,
  addSkill,
  removeSkill,
  addRequirement,
  removeRequirement,
  createJob,
  updateJob,
  fetchJobById,
  fetchDepartments,
  fetchEmploymentTypes,
  fetchSkills,
  clearError,
  clearSuccess
} from '../store/slices/jobSlice';
import RecruiterNavbar from '../components/RecruiterNavbar';
import RecruiterSidebar from '../components/RecruiterSidebar';

const emptyFormData = {
  title: '',
  department: '',
  location: '',
  employmentType: '',
  salary: '',
  description: '',
  requirements: [],
  skills: []
};

export default function PostJobPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newRequirement, setNewRequirement] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobId } = useParams();

  const {
    formData = emptyFormData,
    loading,
    error,
    success,
    successMessage,
    departments = [],
    employmentTypes = []
    
  } = useSelector((state) => state.job || {});

  const safeFormData = formData || emptyFormData;

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchEmploymentTypes());
    dispatch(fetchSkills());

    if (jobId) {
      dispatch(fetchJobById(jobId));
    } else {
      dispatch(resetFormData());
    }

    return () => {
      dispatch(resetFormData());
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch, jobId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ [name]: value }));
  };

  const handleAddRequirement = () => {
    const trimmed = newRequirement.trim();
    if (!trimmed) return;
    dispatch(addRequirement(trimmed));
    setNewRequirement('');
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    dispatch(addSkill(trimmed));
    setNewSkill('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = jobId
      ? updateJob({ jobId, jobData: safeFormData })
      : createJob(safeFormData);

    await dispatch(action).unwrap();
    navigate('/recruiter/jobs');
  };

  return (
    <>
      <RecruiterNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
        <RecruiterSidebar isOpen={sidebarOpen} />
        <main className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
          {error && (
            <div className="alert alert-danger">
              {error}
              <button type="button" className="btn-close" onClick={() => dispatch(clearError())} />
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              {successMessage || 'Job saved successfully'}
              <button type="button" className="btn-close" onClick={() => dispatch(clearSuccess())} />
            </div>
          )}

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4 className="mb-4">{jobId ? 'Edit Job' : 'Post New Job'}</h4>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Job title</label>
                  <input
                    type="text"
                    name="title"
                    value={safeFormData.title}
                    onChange={handleFormChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Department</label>
                    <select
                      name="department"
                      value={safeFormData.department}
                      onChange={handleFormChange}
                      className="form-select"
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept.id || dept} value={dept.name || dept}>
                          {dept.name || dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Employment type</label>
                    <select
                      name="employmentType"
                      value={safeFormData.employmentType}
                      onChange={handleFormChange}
                      className="form-select"
                    >
                      <option value="">Select type</option>
                      {employmentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={safeFormData.location}
                      onChange={handleFormChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="mb-3 mt-3">
                  <label className="form-label">Salary range</label>
                  <input
                    type="text"
                    name="salary"
                    value={safeFormData.salary}
                    onChange={handleFormChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={safeFormData.description}
                    onChange={handleFormChange}
                    className="form-control"
                    rows="5"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Requirements</label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      className="form-control"
                      placeholder="Add requirement"
                    />
                    <button type="button" className="btn btn-outline-secondary" onClick={handleAddRequirement}>
                      Add
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {(safeFormData.requirements || []).map((req, idx) => (
                      <span key={`${req}-${idx}`} className="badge bg-secondary">
                        {req}
                        <button
                          type="button"
                          className="btn-close btn-close-white btn-sm ms-2"
                          aria-label="Remove"
                          onClick={() => dispatch(removeRequirement(idx))}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Skills</label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="form-control"
                      placeholder="Add skill"
                    />
                    <button type="button" className="btn btn-outline-secondary" onClick={handleAddSkill}>
                      Add
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {(safeFormData.skills || []).map((skill, idx) => (
                      <span key={`${skill}-${idx}`} className="badge bg-secondary">
                        {skill}
                        <button
                          type="button"
                          className="btn-close btn-close-white btn-sm ms-2"
                          aria-label="Remove"
                          onClick={() => dispatch(removeSkill(idx))}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : jobId ? 'Update Job' : 'Create Job'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/recruiter/jobs')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}