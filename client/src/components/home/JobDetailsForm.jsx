import { jobPostingApi } from "../../utils/api.js";
import { formatDate } from "../../utils/formatHelpers.js";

export default function JobDetailsForm({ posting, role, userId, onSuccess, onCancel }) {

    if (!role) {
        return <>need to login / register</> // TODO: reroute and save the post they are looking at
    }

    async function handleAction() {
        if (role === "applicant") {
            await jobPostingApi.apply(posting, userId); //idk exact api call rn
        }
        
        if (role === "company") {
            // allow them to go to edit posting, so reroute them
        }

        if (role === "administrator") {
            // nothing
        }
    }

    return (
        <>
            <p className="job-info">Company: {posting.companyName}</p>
            <p className="job-info">Location: {posting.location}</p>
            <p className="job-description">Description: {posting.description}</p> {/* should display the full description (not cut off) */}
            <p className="job-tags">Tags: {posting.tags}</p> { /* tags are an array so need to map through them or smth */}
            <p className="home-jp-date">Posted: {formatDate(posting.publishedAt)}</p>

            <button onClick={handleAction}>{(role === 'applicant') ? "Apply" : (role === 'company' ? "Edit Post" : "Admin Controls")}</button> {/* admin controls should take them to admin panel, specifically highlighting the job they were just looking at (if possible idk)*/}
        </>
    );
}