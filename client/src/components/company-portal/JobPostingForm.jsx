import { useEffect, useState } from "react";
import { validateCreateJobForm } from "../../utils/validation/validateCreateJobForm.js";

export default function JobPostingForm({
    initialValues = { title: "", location: "", description: "" },
    submitLabel = "Save",
    submittingLabel = "Saving...",
    onSubmit,
    onCancel
}) {
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        setTitle(initialValues.title ?? "");
        setLocation(initialValues.location ?? "");
        setDescription(initialValues.description ?? "");
        setErrors({});
        setSubmitError("");
    }, [initialValues.title, initialValues.location, initialValues.description]);

    function handleCancel() {
        setErrors({});
        setSubmitError("");
        onCancel?.();
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitError("");

        const inputErrors = validateCreateJobForm({ title, location, description });
        setErrors(inputErrors);
        if (Object.keys(inputErrors).length > 0) {
            return;
        }

        setLoading(true);
        try {
            await onSubmit?.({ title, location, description });
        }
        catch (err) {
            setSubmitError(err?.message || "Failed to save job posting");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <form className="job-posting-form" onSubmit={handleSubmit}>
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

                {submitError && <div className="error-text">{submitError}</div>}
            </div>

            <div className="job-posting-form-footer">
                <button id="cancel-btn" type="button" onClick={handleCancel}>Cancel</button>
                <button id="create-btn" type="submit" disabled={loading}>{loading ? submittingLabel : submitLabel}</button>
            </div>
        </form>
    )
}