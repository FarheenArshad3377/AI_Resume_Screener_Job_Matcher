import { useState } from 'react';

export default function RecentApplicantsTable() {
    const [filterStatus, setFilterStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const applicants = [
        {
            name: 'David Chen',
            email: 'david.c@techmail.com',
            job: 'Senior Frontend Engineer',
            score: '94%',
            status: 'Screening',
            statusBg: 'success'
        },
        {
            name: 'Sarah Jenkins',
            email: 's.jenkins@designbox.io',
            job: 'Product Designer',
            score: '88%',
            status: 'Interviewing',
            statusBg: 'info'
        }
    ];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Recent Applicant Activity</h5>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-sm">
                        <i className="bi bi-funnel"></i>
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </div>
            <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Applicant</th>
                                <th>Applied Job</th>
                                <th>Score</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map((applicant, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div 
                                                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                                style={{ width: '36px', height: '36px' }}
                                            >
                                                {applicant.name.charAt(0)}
                                            </div>
                                            <div>
                                                <strong className="d-block">{applicant.name}</strong>
                                                <small className="text-muted">{applicant.email}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{applicant.job}</td>
                                    <td>
                                        <span className="badge bg-success">{applicant.score}</span>
                                    </td>
                                    <td>
                                        <span className={`badge bg-${applicant.statusBg}`}>{applicant.status}</span>
                                    </td>
                                    <td>
                                        <a href="#" className="btn btn-sm btn-link text-primary">Review</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}