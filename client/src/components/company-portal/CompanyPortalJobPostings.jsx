import { useEffect, useState } from "react";
import { companyApi } from "../../utils/api.js";
import Card from "../common/Card.jsx";

export default function CompanyPostalJobPostings({ companyId, companyName, refreshKey }) {
    const [jobPostings, setJobPostings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!companyId) return;

        async function load() {
            try {
                setLoading(true);
                const data = await companyApi.getJobPostings(companyId);
                setJobPostings(data);
            }
            catch (err) {
                console.error("Failed to load job postings: ", err);
                setJobPostings([]);
            }
            finally {
                setLoading(false);
            }
        }

        load();
    }, [companyId, refreshKey]);

    if (!companyId) return <div style={{ padding: "20px" }}>Missing company id.</div>;
    if (loading) return <div style={{ padding: "20px" }}>Loading job postings...</div>;
    if (!companyName) companyName = "NULL";
    
    if (jobPostings.length === 0) {
        return (
            <div style={{ padding: "20px" }}>
                No job postings for {companyName}.
            </div>
        );
    }

    return (
        <section className="job-postings-container">
            <h2>{companyName}'s Current Postings</h2>

            <section className="job-postings-layout">
                {jobPostings.map((p) => (
                    <Card key={p._id} title={p.title} footer={
                        <div className="card-actions">
                            <button className="job-card-edit-btn">Edit</button>
                            <button className="job-card-delete-btn">Delete</button>
                        </div>
                    }>
                        <p><strong>Location: </strong>{p.location}</p>
                        <p><strong>Description: </strong>{p.description}</p>
                        <p><strong>Status: </strong>{p.status}</p>
                    </Card>
                ))}
            </section>
        </section>
    );
}