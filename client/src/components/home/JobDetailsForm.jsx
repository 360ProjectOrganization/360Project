import { useState } from "react";
import { jobPostingApi } from "../../utils/api.js";
import { formatDate, getTagColor } from "../../utils/formatHelpers.js";

export default function JobDetailsForm({ posting, role, userId, onSuccess, onCancel }) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
            // TODO: allow them to go to edit posting, so reroute them
        }

        if (role === "administrator") {
            // TODO: figure out if the admin should get something special, if not they get no button
        }
    }

    return (
        <section className="job-details-container">
            <section className="job-details-info">
                <p className="job-info-modal"><strong>Company:</strong> {posting.companyName}</p>
                <p className="job-info-modal"><strong>Location:</strong> {posting.location}</p>
                <p className="job-description-modal"><strong>Description:</strong> {posting.description}</p> {/* should display the full description (not cut off) */}
                <p className="job-tags">
                    <strong>Tags:</strong> {posting.tags?.length ? posting.tags.map((tag) => {
                        const { bg, text } = getTagColor(tag);
                        return (
                            <span key={tag} className="tag" style={{ backgroundColor: bg, color: text }}>{tag}</span>
                        );
                    }) : "—"}
                </p>
            </section>

            <div className="job-details-bottom">
                <p className="home-jp-date">Posted: {formatDate(posting.publishedAt)}</p>
                {role && (
                <footer className="job-details-footer">
                    {error && <div className="error-message">{error}</div>}
                    
                    <button onClick={handleAction} disabled={loading || hasApplied} className={hasApplied ? "job-details-applied-btn" : "job-details-btn"}>
                        {(role === 'applicant') ? (hasApplied ? "Applied" : "Apply") : (role === 'company' ? "Edit Post" : "")}
                    </button>
                </footer>
                )}
            </div>
        </section>
    );
}