import { useEffect, useState } from "react";
import { companyApi } from "../../utils/api.js";

export default function CompanyPostalJobPostings({ companyId }) {
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
    }, [companyId]);

    if (!companyId) return <div style={{ padding: "20px" }}>Missing company id.</div>;
    if (loading) return <div style={{ padding: "20px" }}>Loading job postings...</div>;

    if (jobPostings.length === 0) {
        return (
            <div style={{ padding: "20px" }}>
                No job postings yet.
            </div>
        );
    }

    return (
        <>
        </>
    );
}