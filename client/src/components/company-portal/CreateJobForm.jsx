import { useState } from "react";
import { jobPostingApi } from "../../utils/api";
import { validateCreateJobForm } from "../../utils/validation/validateCreateJobForm";

export default function CreateJobForm({ companyId, onSuccess }) {
    const [errors, setErrors] = useState({});
    const [createError, setCreateError] = useState("");
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    async function handleCreate(e) {
        e.preventDefault();
        setCreateError("");

        const inputErrors = validateCreateJobForm({ title, location, description });
        setErrors(inputErrors);

        if (Object.keys(inputErrors).length > 0) {
            return;
        }

        setLoading(true);
        try {
            await jobPostingApi.createJobPosting(companyId, { title, location, description });
            onSuccess?.();
        }
        catch (err) {
            setCreateError(err.message || "Failed to create job posting");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <form className="job-posting-form" onSubmit={handleCreate}>
            <div className="job-posting-form-body">
                <div className="form-row">
                    <label>Title</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                </div>

                <div className="form-row">
                    <label>Location</label>
                    <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
                </div>

                <div className="form-row form-row-description">
                    <label>Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                </div>
            </div>

            <div className="job-posting-form-footer">
                <button id="cancel-btn" type="reset">Cancel</button>
                <button id="create-btn" type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
            </div>
        </form>
    );
}