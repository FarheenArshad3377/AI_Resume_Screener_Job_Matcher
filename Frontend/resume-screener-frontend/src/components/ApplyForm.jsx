import { useState } from 'react';

export default function ApplyForm() {
    const [formData, setFormData] = useState({
        fullName: 'John Doe',
        email: 'john@example.com',
        resume: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            resume: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting application:', formData);
    };

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body">
                <h5 className="card-title mb-4">Apply with Resume</h5>

                {/* Resume Upload */}
                <div className="mb-4">
                    <label className="form-label fw-bold">Upload Resume</label>
                    <div 
                        className="border-2 border-dashed rounded p-5 text-center"
                        style={{ borderColor: '#dee2e6', cursor: 'pointer' }}
                    >
                        <div className="mb-3">
                            <i 
                                className="bi bi-cloud-arrow-up" 
                                style={{ fontSize: '32px', color: '#0066cc' }}
                            ></i>
                        </div>
                        <p className="text-muted mb-1">Drop CV here or browse</p>
                        <small className="text-muted">PDF, DOCX (Max 5MB)</small>
                        <input
                            type="file"
                            accept=".pdf,.docx,.doc"
                            onChange={handleFileChange}
                            style={{
                                position: 'absolute',
                                opacity: '0',
                                width: '100%',
                                height: '100%',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>

                {/* Full Name */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Email Address */}
                <div className="mb-4">
                    <label className="form-label fw-bold">Email Address</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Submit Button */}
                <button 
                    className="btn btn-primary w-100 mb-2"
                    onClick={handleSubmit}
                >
                    Submit Application
                </button>

                {/* Terms */}
                <small className="text-muted d-block text-center">
                    By applying, you agree to our <a href="#" className="text-decoration-none">Terms of Service</a> and <a href="#" className="text-decoration-none">Privacy Policy</a>
                </small>
            </div>
        </div>
    );
}