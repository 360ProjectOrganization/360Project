import {useEffect, useState } from "react";
import Card from "../common/Card.jsx";
import Modal from "../common/Modal.jsx";
import { jwtDecode } from "jwt-decode";
import {getToken, companyApi } from "../../utils/api.js";
import { formatDate } from "../../utils/formatHelpers.js";

import JobDetailsForm from "./JobDetailsForm.jsx";

export default function HomeJobPostings() {
    const [id, setId] = useState("");
    const [role, setRole] = useState("");

    const [jobPostings, setJobPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
    const [selectedPosting, setSelectedPosting] = useState(null);

    const openJobDetails = (posting) => {
        setSelectedPosting(posting);
        setIsJobDetailsOpen(true);
    }
    const closeJobDetails = () => {
        setIsJobDetailsOpen(false);
        setSelectedPosting(null);
    }

    //get token, decode token, then extract the values
    useEffect(() => {
        const token = getToken();
        if (!token) return; // TODO: user needs to be redirected to the login, and then taken back to the job posting Apply/Details modal
        
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setId(decoded.id);
    }, []);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setLoadError(null);

                const companies = await companyApi.getAll();

                const postingsByCompany = await Promise.all(
                    companies.map(async (company) => {
                        const postings = await companyApi.getJobPostings(company._id);

                        return postings.map((posting) => ({
                            ...posting,
                            companyName: company.name,
                            companyId: company._id,
                        }));
                    })
                );

                const postings = postingsByCompany.flat();
                postings.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

                setJobPostings(postings);
            }
            catch (err) {
                console.error("Failed to load job postings: ", err);
                setLoadError(err?.message || "Failed to load job postings");
                setJobPostings([]);
            }
            finally {
                setLoading(false);
            }
        }

       load();
    }, []);

    if (loading) return <div style={{ padding: "20px" }}>Loading job postings...</div>;
    if (loadError) return <div style={{ padding: "20px" }} className="error-text">{loadError}</div>;

    if (jobPostings.length === 0) {
        return (
            <div style={{ padding: "20px" }}>
                No job postings for {companyName}.
            </div>
        );
    }
    
    return (
        <section className="job-postings-container">
            <section className="job-postings-layout">
                {jobPostings.map((p) => {
                    return (
                        <Card key={p._id} title={p.title} footer={
                            <div className="card-actions">
                                <button className="home-apply-details-btn" onClick={() => openJobDetails(p)}>{(role === 'applicant') ? "Apply" : "Details"}</button>
                            </div>
                        }>
                            <p className="job-info">Company: {p.companyName}</p>
                            <p className="job-info">Location: {p.location}</p>
                            <p className="job-description">Description: {p.description}</p>
                            <p className="home-jp-date">Posted: {formatDate(p.publishedAt)}</p>
                        </Card>
                    );
                })}
            </section>

            <Modal isOpen={isJobDetailsOpen} onClose={closeJobDetails} title={selectedPosting?.title}>
                <JobDetailsForm posting={selectedPosting} role={role} userId={id} onCancel={closeJobDetails} onSuccess={(updatedValues) => {
                        const id = selectedPosting?._id;
                        closeJobDetails();
                        if (!id) return;
                        setJobPostings((prev) =>
                            prev.map((jobpost) =>
                                jobpost._id === id ? { ...jobpost, ...updatedValues } : jobpost
                            )
                        );
                    }}
                />
            </Modal>
        </section>
    );
}