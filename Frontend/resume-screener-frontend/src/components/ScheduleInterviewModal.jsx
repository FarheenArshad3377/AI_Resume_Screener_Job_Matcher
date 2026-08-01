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
    if (!selectedCandidate) {
      alert('Please select a candidate from the dropdown list.');
      return;
    }
    if (!jobId || !date || !time) {
      alert('Please fill job, date and time.');
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
  <>
    {/* Backdrop — apna alag, full-screen, sirf isi pe click se close hota hai */}
    <div
      onClick={() => dispatch(closeScheduleModal())}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 2000
      }}
    />

    {/* Dialog — backdrop ka child NAHI hai, is liye event bubbling ka sawal hi nahi */}
   <div
  className="modal-lg"
  style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 2001,
    margin: 0,
    width: '100%',
    maxWidth: '800px',
    pointerEvents: 'auto'   // 👈 ye add karo — Bootstrap ka override khatam
  }}
>
      <div className="rp-modal-content">
        <div className="rp-modal-header">
          <h5 className="fw-bold mb-0" style={{ color: '#fff' }}>Schedule New Interview</h5>
          <button className="btn-close btn-close-white" onClick={() => dispatch(closeScheduleModal())}></button>
        </div>

        <div className="p-4">
          <div className="row g-3">
            {/* Candidate */}
            <div className="col-md-6">
              <label className="rp-filter-label mb-2">Candidate</label>
              {selectedCandidate ? (
                <div
                  className="d-flex align-items-center justify-content-between rounded p-2"
                  style={{ background: 'var(--rp-surface-2)', border: '1px solid var(--rp-border)' }}
                >
                  <span className="small" style={{ color: 'var(--rp-text)' }}>{selectedCandidate.name}</span>
                  <button
                    className="btn btn-sm btn-link p-0"
                    style={{ color: '#f87171', textDecoration: 'none' }}
                    onClick={() => setSelectedCandidate(null)}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="position-relative">
                  <input
                    className="form-control rp-apply-input"
                    placeholder="Search candidate name..."
                    value={candidateQuery}
                    onChange={(e) => setCandidateQuery(e.target.value)}
                  />
                  {candidateQuery.trim() && (
                    <div className="rp-dropdown-list">
                      {candidateResults.length > 0 ? (
                        candidateResults.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            className="rp-dropdown-item"
                            onClick={() => { setSelectedCandidate(c); setCandidateQuery(''); }}
                          >
                            {c.name} <span style={{ color: 'var(--rp-text-muted)' }}>— {c.email}</span>
                          </button>
                        ))
                      ) : (
                        <div className="rp-dropdown-empty">No candidates found</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Job Posting */}
            <div className="col-md-6">
              <label className="rp-filter-label mb-2">Job Posting</label>
              <select className="form-select rp-apply-input" value={jobId} onChange={(e) => setJobId(e.target.value)}>
                <option value="">Select active role</option>
                {activeJobs.map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </div>

            {/* Interview Type */}
            <div className="col-md-6">
              <label className="rp-filter-label mb-2">Interview Type</label>
              <select className="form-select rp-apply-input" value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
                {interviewTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Date & Time */}
            <div className="col-md-6">
              <label className="rp-filter-label mb-2">Date & Time</label>
              <div className="d-flex gap-2">
                <input type="date" className="form-control rp-apply-input" value={date} onChange={(e) => setDate(e.target.value)} />
                <input type="time" className="form-control rp-apply-input" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>

            {/* Assign Interviewers */}
            <div className="col-12">
              <label className="rp-filter-label mb-2">Assign Interviewer(s)</label>
              <div className="d-flex flex-wrap gap-2 mb-2">
                {interviewers.map((i) => (
                  <span
                    key={i.id}
                    className="badge rounded-pill d-flex align-items-center gap-1"
                    style={{ background: 'var(--rp-surface-2)', border: '1px solid var(--rp-border)', color: 'var(--rp-text)' }}
                  >
                    {i.name}
                    <i className="bi bi-x-circle" style={{ cursor: 'pointer' }} onClick={() => toggleInterviewer(i)}></i>
                  </span>
                ))}
              </div>
              <div className="position-relative">
                <input
                  className="form-control rp-apply-input"
                  placeholder="+ Add Member"
                  value={teamQuery}
                  onChange={(e) => setTeamQuery(e.target.value)}
                />
                {teamQuery.trim() && (
                  <div className="rp-dropdown-list">
                    {filteredTeam.length > 0 ? (
                      filteredTeam.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          className="rp-dropdown-item"
                          onClick={() => { toggleInterviewer(m); setTeamQuery(''); }}
                        >
                          {m.name}
                        </button>
                      ))
                    ) : (
                      <div className="rp-dropdown-empty">No team members found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Meeting Link */}
            <div className="col-12">
              <label className="rp-filter-label mb-2">Meeting Link</label>
              <input
                className="form-control rp-apply-input"
                placeholder="https://zoom.us/j/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="col-12">
              <label className="rp-filter-label mb-2">Interview Notes (Internal Only)</label>
              <textarea
                className="form-control rp-apply-textarea"
                rows="2"
                placeholder="Specific topics or focus areas for this session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 mt-3 small" style={{ color: 'var(--rp-text-muted)' }}>
            <i className="bi bi-magic"></i>
            AI will suggest preparation materials after scheduling.
          </div>
        </div>

        <div className="p-4 pt-0 d-flex justify-content-end gap-2">
          <button className="rp-btn-outline" onClick={() => dispatch(closeScheduleModal())}>Cancel</button>
          <button className="rp-btn-gradient" style={{ border: 'none' }} disabled={loading} onClick={handleSubmit}>
            {loading ? 'Sending...' : 'Send Invitation'}
          </button>
        </div>
      </div>
    </div>
  </>
);
}