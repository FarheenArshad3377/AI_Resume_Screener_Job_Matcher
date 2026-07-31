const STATS = [
  { value: "10k+", label: "Jobs Posted", color: "var(--rp-accent-2)" },
  { value: "50k+", label: "Candidates", color: "var(--rp-accent-cyan)" },
  { value: "98%", label: "Match Rate", color: "var(--rp-accent-1)" },
];

export default function StatsStrip() {
  return (
    <section className="rp-stats">
      <div className="container">
        <div className="row text-center g-4">
          {STATS.map((s) => (
            <div className="col-4" key={s.label}>
              <div className="rp-stat-value" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="rp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
