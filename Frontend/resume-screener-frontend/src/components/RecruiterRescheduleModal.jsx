import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRescheduleRequest,
  confirmReschedule,
  closeRescheduleModal
} from '../store/slices/recruiterInterviewSlice';

export default function RecruiterRescheduleModal() {
  const dispatch = useDispatch();
  const { rescheduleTarget, rescheduleRequest, loading } = useSelector((s) => s.recruiterInterview);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [manualDate, setManualDate] = useState('');
  const [manualTime, setManualTime] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (rescheduleTarget) dispatch(fetchRescheduleRequest(rescheduleTarget.id));
  }, [rescheduleTarget, dispatch]);

  if (!rescheduleTarget) return null;

  const handleConfirm = () => {
    let newDate;
    if (manualDate && manualTime) {
      newDate = new Date(`${manualDate}T${manualTime}`).toISOString();
    } else if (selectedSlot) {
      newDate = selectedSlot.date;
    } else {
      alert('Please select a preferred time or set a manual date.');
      return;
    }

    dispatch(confirmReschedule({
      interviewId: rescheduleTarget.id,
      payload: {
        newDate,
        reason,
        source: manualDate ? 'manual_override' : 'candidate_preferred'
      }
    }));
  };

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => dispatch(closeRescheduleModal())}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '14px' }}>
          <div className="modal-header border-0">
            <div>
              <h5 className="modal-title fw-bold mb-0">Reschedule Interview</h5>
              <small className="text-muted">Updating schedule for {rescheduleTarget.candidateName}</small>
            </div>
            <button className="btn-close" onClick={() => dispatch(closeRescheduleModal())}></button>
          </div>

          <div className="modal-body">
            <small className="text-uppercase text-muted fw-semibold" style={{ fontSize: '0.7rem' }}>
              Candidate Preferred Times
            </small>

            <div className="mt-2 mb-3">
              {rescheduleRequest?.preferredSlots?.length > 0 ? (
                rescheduleRequest.preferredSlots.map((slot, idx) => (
                  <label
                    key={idx}
                    className={`d-flex align-items-center justify-content-between p-2 mb-2 rounded border ${
                      selectedSlot?.date === slot.date ? 'border-primary bg-primary-subtle' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => { setSelectedSlot(slot); setManualDate(''); setManualTime(''); }}
                  >
                    <div>
                      <div className="fw-semibold small">
                        {new Date(slot.date).toLocaleString('en-US', {
                          weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                        })}
                      </div>
                      <small className={slot.conflictNote ? 'text-danger' : 'text-success'}>
                        {slot.conflictNote || slot.label}
                      </small>
                    </div>
                    <input
                      type="radio"
                      className="form-check-input m-0"
                      checked={selectedSlot?.date === slot.date}
                      onChange={() => {}}
                    />
                  </label>
                ))
              ) : (
                <small className="text-muted">No preferred times submitted by candidate.</small>
              )}
            </div>

            <small className="text-uppercase text-muted fw-semibold" style={{ fontSize: '0.7rem' }}>
              Manual Override
            </small>
            <div className="d-flex gap-2 mt-2 mb-3">
              <input
                type="date"
                className="form-control"
                value={manualDate}
                onChange={(e) => { setManualDate(e.target.value); setSelectedSlot(null); }}
              />
              <input
                type="time"
                className="form-control"
                value={manualTime}
                onChange={(e) => { setManualTime(e.target.value); setSelectedSlot(null); }}
              />
            </div>

            <label className="form-label small fw-semibold">Reason for Change</label>
            <textarea
              className="form-control mb-2"
              rows="2"
              placeholder="e.g., Accommodating candidate's conflict with current work project..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            {rescheduleRequest?.aiInsight && (
              <div className="alert bg-primary-subtle text-primary small mb-0 mt-2">
                <i className="bi bi-lightbulb me-1"></i>
                <strong>AI insight:</strong> {rescheduleRequest.aiInsight}
              </div>
            )}
          </div>

          <div className="modal-footer border-0">
            <button className="btn btn-light" onClick={() => dispatch(closeRescheduleModal())}>Cancel</button>
            <button className="btn btn-primary" disabled={loading} onClick={handleConfirm}>
              {loading ? 'Confirming...' : 'Confirm New Time'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}