export default function RoleToggle({ role, onChange }) {
  const isCandidate = role === "candidate";

  return (
    <div className="rp-role-toggle">
      <span
        className="rp-role-pill"
        style={{
          left: isCandidate ? "4px" : "50%",
          width: "calc(50% - 4px)",
        }}
      />
      <button
        type="button"
        className={`rp-role-btn ${isCandidate ? "active" : ""}`}
        onClick={() => onChange("candidate")}
      >
        I'm looking for a job
      </button>
      <button
        type="button"
        className={`rp-role-btn ${!isCandidate ? "active" : ""}`}
        onClick={() => onChange("recruiter")}
      >
        I'm hiring
      </button>
    </div>
  );
}
