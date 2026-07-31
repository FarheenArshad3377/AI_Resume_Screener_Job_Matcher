export default function LandingFooter() {
  return (
    <footer className="rp-footer">
      <div className="container d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div style={{ maxWidth: "340px" }}>
          <div className="rp-logo mb-2" style={{ fontSize: "1.1rem" }}>
            RecruitPro AI
          </div>
          <p className="text-muted small mb-0">
            Empowering the next generation of global talent through intelligent
            matching and seamless workflows.
          </p>
        </div>

        <div>
          <a href="#top" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          <a href="#top" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          <a href="#top" onClick={(e) => e.preventDefault()}>Help Center</a>
          <a href="#top" onClick={(e) => e.preventDefault()}>API Documentation</a>
        </div>

        <div className="text-muted small">
          © 2026 RecruitPro AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
