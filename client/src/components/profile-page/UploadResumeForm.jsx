import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./UploadResumeForm.css";
import { applicantApi, getToken } from "../../utils/api.js";
import { successEvent } from "../../utils/toast/successEvent.js";
import { validateResumeFile } from "../../utils/validation/validateResumeFile.js";

function UploadResumeForm(){
    const success = successEvent("Successfully Uploaded Resume");
    const [token, setToken] = useState("");
    const [id, setId] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const available_token = getToken();
        if(available_token){
            setToken(available_token);
        };
    }, []);
    
    useEffect(() => {
        if(!token) return;
        const decoded = jwtDecode(token);
        setId(decoded.id);
    }, [token])

    function onFileChange(e) {
        const input = e.target;
        const chosen = input.files?.[0];
        setError("");
        if (!chosen) {
            setFile(null);
            return;
        }
        const check = validateResumeFile(chosen);
        if (!check.ok) {
            setError(check.message);
            input.value = "";
            setFile(null);
            return;
        }
        setFile(chosen);
    }

    async function submitResume(e){
        e.preventDefault();
        setError("");
        if (!file) {
            setError("Please choose a PDF file.");
            return;
        }
        const check = validateResumeFile(file);
        if (!check.ok) {
            setError(check.message);
            return;
        }
        setSubmitting(true);
        try {
            await applicantApi.uploadResume(id, file);
            success();
        } catch (err) {
            setError(err.message || "Could not upload resume.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <div id="upload-resume-form">
                <form id="resume-form" onSubmit={submitResume}>
                    <h3>Upload Resume Below:</h3>
                    <br />
                    <input 
                        type="file" 
                        id="resume-input" 
                        accept="application/pdf,.pdf" 
                        onChange={onFileChange}
                    />
                    {error && <p className="upload-resume-error" role="alert">{error}</p>}
                    <br />
                    <button id="submit-resume" type="submit" disabled={submitting}>
                        {submitting ? "Uploading…" : "Submit"}
                    </button>
                </form>
            </div>
        </>
    )
}

export default UploadResumeForm;
