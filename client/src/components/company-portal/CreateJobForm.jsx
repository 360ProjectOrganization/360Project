import { useState } from "react";
import { jobPostingApi } from "../../utils/api";
import { validateCreateJobForm } from "../../utils/validation/validateCreateJobForm";

export default function CreateJobForm({ companyId, onSuccess, onCancel }) {
    const [errors, setErrors] = useState({});
    const [createError, setCreateError] = useState("");
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    function handleCancel() {
        setTitle("");
        setLocation("");
        setDescription("");
        setErrors({});
        setCreateError("");
        onCancel?.();
    }
    
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
            setTitle("");
            setLocation("");
            setDescription("");
            setErrors({});
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
                    <div className="input-wrapper">
                        <input id="title" type="text" value={title} onChange={(e) => {
                            setTitle(e.target.value)
                            if (errors.title) {
                                setErrors(prev => ({ ...prev, title: undefined }));
                            }
                        }} placeholder="Title" />
                        {errors.title && <span className="error-text">{errors.title}</span>}
                    </div>
                </div>

                <div className="form-row">
                    <label>Location</label>
                    <div className="input-wrapper">
                        <input id="location" type="text" value={location} onChange={(e) => {
                            setLocation(e.target.value)
                            if (errors.location) {
                                setErrors(prev => ({ ...prev, location: undefined }));
                            }
                        }} placeholder="Location" />
                        {errors.location && <span className="error-text">{errors.location}</span>}
                
                    </div>
                </div>
                
                <div className="form-row form-row-description">
                    <label>Description</label>
                    <div className="input-wrapper">
                        <textarea id="description" value={description} onChange={(e) => {
                            setDescription(e.target.value)
                            if (errors.description) {
                                setErrors(prev => ({ ...prev, description: undefined }));
                            }
                        }} placeholder="Description" />
                        {errors.description && <span className="error-text">{errors.description}</span>}
                    </div>
                </div>
            </div>

            <div className="job-posting-form-footer">
                <button id="cancel-btn" type="reset" onClick={handleCancel}>Cancel</button>
                <button id="create-btn" type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
            </div>
        </form>
    );
}