import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchJobCandidates,
  rankCandidates,
  updateCandidateStatus,
  exportCandidatesCSV,
  downloadResume,
  setFilter,
  setSortBy,
  clearError
} from '../store/slices/candidateRankingSlice';
import RecruiterNavbar from '../components/RecruiterNavbar';
import RecruiterSidebar from '../components/RecruiterSidebar';

export default function CandidateRankingPage() {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { candidates, loading, error, rankingInProgress, filter, sortBy } = useSelector(s => s.candidateRanking);

  useEffect(() => {
    if (jobId) dispatch(fetchJobCandidates({ jobId, params: { status: filter.status, sortBy } }));
  }, [jobId, dispatch, filter.status, sortBy]);

  const handleRank = () => dispatch(rankCandidates(jobId));
  const handleStatus = (candidateId, status) => dispatch(updateCandidateStatus({ jobId, candidateId, status }));
  const handleExport = async () => {
    try {
      const blob = await dispatch(exportCandidatesCSV(jobId)).unwrap();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `candidates_job_${jobId}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) { /* ignore; slice will set error */ }
  };
  const handleDownloadResume = async (candidateId, name) => {
    try {
      const { blob } = await dispatch(downloadResume(candidateId)).unwrap();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name || candidateId}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) { /* handled by slice */ }
  };

  return (
    <>
      <RecruiterNavbar toggleSidebar={() => {}} />
      <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
        <RecruiterSidebar isOpen={true} />
        <main className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Candidates - Job #{jobId}</h4>
            <div className="d-flex gap-2">
              <select className="form-select form-select-sm" style={{ width: 160 }}
                value={filter.status}
                onChange={(e) => dispatch(setFilter({ status: e.target.value }))}>
                <option value="All">All</option>
                <option value="New">New</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select className="form-select form-select-sm" style={{ width: 140 }}
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}>
                <option value="score_desc">Score: High → Low</option>
                <option value="score_asc">Score: Low → High</option>
                <option value="applied_recent">Applied: Recent</option>
              </select>

              <button className="btn btn-outline-secondary btn-sm" onClick={() => dispatch(clearError())}>Clear</button>
              <button className="btn btn-primary btn-sm" onClick={handleRank} disabled={rankingInProgress}>
                {rankingInProgress ? 'Ranking…' : 'Rank Candidates'}
              </button>
              <button className="btn btn-outline-success btn-sm" onClick={handleExport}>Export CSV</button>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
              ) : candidates.length === 0 ? (
                <div className="text-center py-5 text-muted">No candidates found</div>
              ) : (
                <div className="list-group">
                  {candidates.map(c => (
                    <div key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{c.name}</h6>
                        <small className="text-muted d-block">{c.email} • {c.appliedDate}</small>
                        <small className="d-block mt-1">
                          <span className="badge bg-primary me-2">{c.matchScore}%</span>
                          <span className={`badge ${c.status === 'Shortlisted' ? 'bg-success' : c.status === 'Rejected' ? 'bg-danger' : 'bg-secondary'}`}>{c.status}</span>
                        </small>
                      </div>

                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/candidate/${c.id}`)}>View</button>
                        <div className="dropdown">
                          <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">Status</button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li><button className="dropdown-item" onClick={() => handleStatus(c.id, 'Reviewing')}>Mark Reviewing</button></li>
                            <li><button className="dropdown-item" onClick={() => handleStatus(c.id, 'Shortlisted')}>Shortlist</button></li>
                            <li><button className="dropdown-item" onClick={() => handleStatus(c.id, 'Rejected')}>Reject</button></li>
                          </ul>
                        </div>
                        <button className="btn btn-sm btn-outline-success" onClick={() => handleDownloadResume(c.id, c.name)}>Resume</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}