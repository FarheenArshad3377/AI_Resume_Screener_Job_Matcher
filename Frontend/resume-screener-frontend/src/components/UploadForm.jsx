import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { submitResume } from "../store/slices/candidatesSlice";

const jobOptions = [
  "Senior Product Designer",
  "Frontend Engineer",
  "Marketing Manager",
  "Backend Developer (Go)",
  "DevOps Specialist",
];

export default function UploadForm() {
  const dispatch = useDispatch();
  const { jobId } = useParams();

  const { uploadStatus, error, lastUploadResult } = useSelector(
    (state) => state.candidates
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    jobId: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a resume.");
      return;
    }

    const data = new FormData();

    data.append("name", formData.fullName);
    data.append("email", formData.email);
    data.append("jobId", jobId); // comes from URL
    data.append("resumeFile", selectedFile);

    dispatch(submitResume(data));
  };

  return (
    <div
      className="card border-0 shadow-sm p-4 mx-auto"
      style={{ maxWidth: "480px", width: "100%", borderRadius: "16px" }}
    >
      <div className="card-body">
        <h4 className="fw-bold text-primary mb-1">Submit Application</h4>

        <p className="text-muted small mb-4">
          Join our network of elite talent. Complete the form below to apply
          for your next career milestone.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small d-block mb-1">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              className="form-control bg-light border-0"
              placeholder="e.g. Ali Khan"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small d-block mb-1">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              className="form-control bg-light border-0"
              placeholder="abc@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* UI kept exactly as it was */}
          <div className="mb-3">
            <label className="form-label fw-semibold small d-block mb-1">
              Select Job
            </label>

            <select
              name="jobId"
              className="form-select bg-light border-0"
              value={formData.jobId}
              onChange={handleChange}
            >
              <option value="">Choose an open position</option>

              {jobOptions.map((job) => (
                <option key={job} value={job}>
                  {job}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small d-block mb-1">
              Resume / CV
            </label>

            <div
              className={`text-center py-4 px-3 rounded-3 ${
                isDragging ? "bg-primary-subtle" : "bg-light"
              }`}
              style={{
                border: "2px dashed #c7d2fe",
                cursor: "pointer",
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("resumeInput").click()}
            >
              <div
                className="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary"
                style={{
                  width: "44px",
                  height: "44px",
                }}
              >
                <i className="bi bi-file-earmark-arrow-up-fill"></i>
              </div>

              <div className="fw-bold text-primary">
                {selectedFile ? selectedFile.name : "Drag and Drop"}
              </div>

              <small className="text-muted">
                Upload your resume in PDF or DOCX format (Max 10MB)
              </small>

              <input
                id="resumeInput"
                type="file"
                accept=".pdf,.docx"
                className="d-none"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}

          {uploadStatus === "succeeded" && (
            <div className="alert alert-success py-2">
              {lastUploadResult?.message}
            </div>
          )}

          <button
            type="submit"
            disabled={uploadStatus === "loading"}
            className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
          >
            {uploadStatus === "loading"
              ? "Uploading..."
              : "Submit Application"}

            <i className="bi bi-play-fill"></i>
          </button>
        </form>
      </div>
    </div>
  );
}