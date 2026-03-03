import { useState } from "react";
import { jobPostingApi } from "../../utils/api";


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
        <>
            
        </>
    );
}