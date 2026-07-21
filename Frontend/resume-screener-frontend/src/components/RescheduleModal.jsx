import { useState } from 'react';

export default function RescheduleModal({ interview, onClose, onSubmit, loading }) {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [reason, setReason] = useState('');

  // TODO: replace with backend-provided suggested windows if available
  const suggestedSlots = interview?.suggestedSlots || [
    { id: 's1', label: 'Monday, Oct 27', time: '2:00 PM – 3:00 PM PST' },
    { id: 's2', label: 'Tuesday, Oct 28', time: '2:00 PM – 3:00 PM PST' },
    { id: 's3', label: 'Wednesday, Oct 29', time: '11:00 AM – 12:00 PM PST' }
  ];

  const toggleSlot = (id) => {
    setSelectedSlots((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const handleSubmit = () => {
    if (selectedSlots.length === 0) return;
    onSubmit({
      interviewId: interview.id,
      payload: {
        preferredSlots: suggestedSlots.filter((s) => selectedSlots.includes(s.id)),
        reason
      }
    });
  };

  if (!interview) return null;

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '14px' }}>
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold mb-0">Request to Reschedule</h5>
              <small className="text-muted">Interview with {interview.company}</small>
            </div>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body pt-2">
            <div className="alert alert-primary-subtle bg-primary-subtle text-primary small mb-3">
              Select up to 3 preferred time slots.
            </div>

            <small className="text-uppercase text-muted fw-semibold" style={{ fontSize: '0.7rem' }}>
              Suggested Windows
            </small>

            <div className="mt-2 mb-3">
              {suggestedSlots.map((slot) => (
                <label
                  key={slot.id}
                  className={`d-flex align-items-center gap-2 p-2 mb-2 rounded border ${
                    selectedSlots.includes(slot.id) ? 'border-primary bg-primary-subtle' : 'border-light-subtle'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input m-0"
                    checked={selectedSlots.includes(slot.id)}
                    onChange={() => toggleSlot(slot.id)}
                  />
                  <div>
                    <div className="fw-semibold small">{slot.label}</div>
                    <small className="text-muted">{slot.time}</small>
                  </div>
                </label>
              ))}
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Reason for Request (optional)</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="e.g., Unforeseen scheduling conflict."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer border-0">
            <button className="btn btn-light" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary"
              disabled={selectedSlots.length === 0 || loading}
              onClick={handleSubmit}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}