export default function StatusBadge({ status }) {
  const map = {
    Confirmed: 'bg-success-subtle text-success',
    Scheduled: 'bg-primary-subtle text-primary',
    Pending: 'bg-warning-subtle text-warning-emphasis',
    Completed: 'bg-secondary-subtle text-secondary',
    Cancelled: 'bg-danger-subtle text-danger'
  };
  return (
    <span className={`badge rounded-pill ${map[status] || 'bg-secondary-subtle text-secondary'}`}>
      {status}
    </span>
  );
}