import { useState } from "react";
import { companyApi } from "../../utils/api";

export default function CreateJobForm() {
    const [errors, setErrors] = useState({});
    const [createError, setCreateError] = useState("");
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    const [cancel, setCancel] = useState(false);
    const [create, setCreate] = useState(false);

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
            const payload = {

            }

            const response = await companyApi.blah(payload);
            //close modal
        }
        catch (err) {
            setCreateError(err.message || "Failed to create job posting");
        }
    }

    return (
        <>
            
        </>
    );
}