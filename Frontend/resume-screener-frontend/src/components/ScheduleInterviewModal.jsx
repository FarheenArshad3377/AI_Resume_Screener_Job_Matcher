import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  scheduleInterview,
  searchCandidates,
  fetchActiveJobs,
  fetchTeamMembers,
  closeScheduleModal
} from '../store/slices/recruiterInterviewSlice';

const interviewTypes = ['Phone Screen', 'Technical Screen', 'Design Review', 'Technical Round', 'On-site', 'Video Call'];

export default function ScheduleInterviewModal() {
  const dispatch = useDispatch();
  const { candidateResults, activeJobs, teamMembers, loading } = useSelector((s) => s.recruiterInterview);

  const [candidateQuery, setCandidateQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [jobId, setJobId] = useState('');
  const [interviewType, setInterviewType] = useState(interviewTypes[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [interviewers, setInterviewers] = useState([]);
  const [teamQuery, setTeamQuery] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    dispatch(fetchActiveJobs());
    dispatch(fetchTeamMembers());
  }, [dispatch]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (candidateQuery.trim()) dispatch(searchCandidates(candidateQuery));
    }, 300);
    return () => clearTimeout(t);
  }, [candidateQuery, dispatch]);

  const toggleInterviewer = (member) => {
    setInterviewers((prev) =>
      prev.find((i) => i.id === member.id)
        ? prev.filter((i) => i.id !== member.id)
        : [...prev, member]
    );
  };

  const handleSubmit = () => {
    if (!selectedCandidate || !jobId || !date || !time) {
      alert('Please fill candidate, job, date and time.');
      return;
    }
    dispatch(scheduleInterview({
      candidateId: selectedCandidate.id,
      jobId,
      interviewType,
      scheduledDate: new Date(`${date}T${time}`).toISOString(),
      interviewerIds: interviewers.map((i) => i.id),
      meetingLink,
      notes
    }));
  };

  const filteredTeam = teamMembers.filter((m) =>
    m.name.toLowerCase().includes(teamQuery.toLowerCase())
  );

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => dispatch(closeScheduleModal())}>
      <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '14px' }}>
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold mb-0">Schedule New Interview</h5>
            <button className="btn-close" onClick={() => dispatch(closeScheduleModal())}></button>
          </div>

          <div className="modal-body">
            <div className="row g-3">
              {/* Candidate */}
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Candidate</label>
                {selectedCandidate ? (
                  <div className="d-flex align-items-center justify-content-between border rounded p-2">
                    <span className="small">{selectedCandidate.name}</span>
                    <button className="btn btn-sm btn-link text-danger p-0" onClick={() => setSelectedCandidate(null)}>
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="position-relative">
                    <input
                      className="form-control"
                      placeholder="Search candidate name..."
                      value={candidateQuery}
                      onChange={(e) => setCandidateQuery(e.target.value)}
                    />
                    {candidateResults.length > 0 && candidateQuery && (
                      <div className="list-group position-absolute w-100 shadow-sm" style={{ zIndex: 10, maxHeight: '160px', overflowY: 'auto' }}>
                        {candidateResults.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            className="list-group-item list-group-item-action small"
                            onClick={() => { setSelectedCandidate(c); setCandidateQuery(''); }}
                          >
                            {c.name} <span className="text-muted">— {c.email}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Job Posting */}
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Job Posting</label>
                <select className="form-select" value={jobId} onChange={(e) => setJobId(e.target.value)}>
                  <option value="">Select active role</option>
                  {activeJobs.map((job) => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
              </div>

              {/* Interview Type */}
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Interview Type</label>
                <select className="form-select" value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
                  {interviewTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Date & Time */}
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Date & Time</label>
                <div className="d-flex gap-2">
                  <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                  <input type="time" className="form-control" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>

              {/* Assign Interviewers */}
              <div className="col-12">
                <label className="form-label small fw-semibold">Assign Interviewer(s)</label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {interviewers.map((i) => (
                    <span key={i.id} className="badge bg-light text-dark border d-flex align-items-center gap-1">
                      {i.name}
                      <i className="bi bi-x-circle" style={{ cursor: 'pointer' }} onClick={() => toggleInterviewer(i)}></i>
                    </span>
                  ))}
                </div>
                <div className="position-relative">
                  <input
                    className="form-control"
                    placeholder="+ Add Member"
                    value={teamQuery}
                    onChange={(e) => setTeamQuery(e.target.value)}
                  />
                  {teamQuery && (
                    <div className="list-group position-absolute w-100 shadow-sm" style={{ zIndex: 10, maxHeight: '150px', overflowY: 'auto' }}>
                      {filteredTeam.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          className="list-group-item list-group-item-action small"
                          onClick={() => { toggleInterviewer(m); setTeamQuery(''); }}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Meeting Link */}
              <div className="col-12">
                <label className="form-label small fw-semibold">Meeting Link</label>
                <input
                  className="form-control"
                  placeholder="https://zoom.us/j/..."
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="col-12">
                <label className="form-label small fw-semibold">Interview Notes (Internal Only)</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Specific topics or focus areas for this session..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 mt-3 text-muted small">
              <i className="bi bi-magic"></i>
              AI will suggest preparation materials after scheduling.
            </div>
          </div>

          <div className="modal-footer border-0">
            <button className="btn btn-light" onClick={() => dispatch(closeScheduleModal())}>Cancel</button>
            <button className="btn btn-primary" disabled={loading} onClick={handleSubmit}>
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}