import { useState } from "react";
import { jobPostingApi } from "../../utils/api.js";
import { formatDate } from "../../utils/formatHelpers.js";

export default function JobDetailsForm({ posting, role, userId, onSuccess, onCancel }) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!role) {
        return <>need to login / register</> // TODO: reroute and save the post they are looking at
    }

    const hasApplied = role === "applicant" && posting?.applicants?.some((aid) => String(aid) === userId);
    
    async function handleAction() {
        if (role === "applicant") {
            try {
                setError("");
                setLoading(true);

                await jobPostingApi.apply(posting._id);
                onSuccess?.({ applicants: [...(posting.applicants || []), userId] });
            }
            catch (err) {
                console.error("Apply to job failed:", err);
                const message = err.message || "Something went wrong";
                setError(message);
            }
            finally {
                setLoading(false);
            } 
        }

        if (role === "company") {
            // allow them to go to edit posting, so reroute them
        }

        if (role === "administrator") {
            // nothing
        }
    }

    return (
        <section className="job-details-container">
            <section className="job-details-info">
                <p className="job-info">Company: {posting.companyName}</p>
                <p className="job-info">Location: {posting.location}</p>
                <p className="job-description">Description: {posting.description}</p> {/* should display the full description (not cut off) */}
                <p className="job-tags">Tags: {posting.tags}</p> { /* tags are an array so need to map through them or smth */}
                <p className="home-jp-date">Posted: {formatDate(posting.publishedAt)}</p>
            </section>

            <footer className="job-details-footer">
                {error && <div className="error-message">{error}</div>}
                
                <button onClick={handleAction} disabled={loading || hasApplied} className={hasApplied ? "job-details-applied-btn" : "job-details-btn"}>
                    {(role === 'applicant') ? (hasApplied ? "Applied" : "Apply") : (role === 'company' ? "Edit Post" : "Admin Controls")}
                </button>
            </footer>
        </section>
    );
}