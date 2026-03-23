import { useEffect, useState } from "react";
import { validateCreateJobForm } from "../../utils/validation/validateCreateJobForm.js";

export default function JobPostingForm({
    initialValues = { title: "", location: "", description: "" },
    submitLabel = "Save",
    submittingLabel = "Saving...",
    showStatusField = false,
    showTagsField = false,
    statusResetTrigger = 0,
    onStatusChange,
    onSubmit,
    onCancel
}) {
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("ACTIVE");
    const [tagsInput, setTagsInput] = useState("");

    useEffect(() => {
        setTitle(initialValues.title ?? "");
        setLocation(initialValues.location ?? "");
        setDescription(initialValues.description ?? "");
        if (showStatusField) setStatus(initialValues.status ?? "ACTIVE");
        if (showTagsField) setTagsInput(Array.isArray(initialValues.tags) ? initialValues.tags.join(", ") : "");
        setErrors({});
        setSubmitError("");
    }, [initialValues.title, initialValues.location, initialValues.description, initialValues.status, initialValues.tags, showStatusField, showTagsField]);

    useEffect(() => {
        if (showStatusField) setStatus(initialValues.status ?? "ACTIVE");
    }, [statusResetTrigger, initialValues.status, showStatusField]);

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
            const payload = { title, location, description };
            if (showStatusField) payload.status = status;
            if (showTagsField) payload.tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
            await onSubmit?.(payload);
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

                {showStatusField && (
                    <div className="form-row">
                        <label>Status</label>
                        <div className="input-wrapper">
                            <select className={`pstatus ${(status || "").toLowerCase()}`} value={status} onChange={(e) => {
                                const newStatus = e.target.value;
                                setStatus(newStatus);
                                onStatusChange?.(newStatus);
                            }}>
                                <option value="ACTIVE">Active</option>
                                <option value="UNPUBLISHED">Unpublished</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>
                    </div>
                )}

                {showTagsField && (
                    <div className="form-row">
                        <label>Tags</label>
                        <div className="input-wrapper">
                            <input id="tags" type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="e.g. React, JavaScript, Remote"/>
                        </div>
                    </div>
                )}

                {submitError && <div className="error-text">{submitError}</div>}
            </div>

            <div className="job-posting-form-footer">
                <button id="cancel-btn" type="button" onClick={handleCancel}>Cancel</button>
                <button id="create-btn" type="submit" disabled={loading}>{loading ? submittingLabel : submitLabel}</button>
            </div>
        </form>
    )
}