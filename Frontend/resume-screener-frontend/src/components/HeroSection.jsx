import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleToggle from "./RoleToggle";

export default function HeroSection() {
  const navigate = useNavigate();
  const [role, setRole] = useState("candidate");

  const handleGetStarted = () => {
    navigate(role === "candidate" ? "/signup" : "/signup");
    // Both go to signup for now — SignupPage already has a role selector.
  };

  return (
    <section className="rp-hero" id="top">
      <div className="rp-blob rp-blob-1" />
      <div className="rp-blob rp-blob-2" />

      <div className="container position-relative">
        <h1 className="mb-3">
          The Future of Recruitment is
          <br />
          <span className="rp-hero-gradient-text">AI-Powered.</span>
        </h1>
        <p className="lead">
          RecruitPro connects top-tier talent with world-class companies using
          advanced AI matching algorithms that see beyond the resume.
        </p>

        {/* <div className="mb-4">
          <RoleToggle role={role} onChange={setRole} />
        </div> */}

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button className="rp-btn-gradient" onClick={handleGetStarted}>
            Get Started
          </button>
          <button
            className="rp-btn-outline"
            onClick={() => navigate("/jobs")}
          >
            Live Demo
          </button>
        </div>

        <div className="mt-5">
          <i className="bi bi-chevron-double-down rp-scroll-cue fs-5" />
        </div>
      </div>
    </section>
  );
}
