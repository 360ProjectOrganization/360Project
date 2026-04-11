import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { applicantApi, companyApi, adminApi, getToken } from "../../utils/api.js";
import { validatePfpFile } from "../../utils/validation/validatePfpFile.js";
import "./UploadPfpForm.css";
import { usePfp } from "../../context/ProfilePictureContext.jsx";
import { successEvent } from "../../utils/toast/successEvent.js";

function UploadPfpForm({ onClose }){
    const success = successEvent("Successfully Uploaded Image");
    const [token, setToken] = useState("");
    const [id, setId] = useState("");
    const [role, setRole] = useState("");
    const { refreshPfp } = usePfp();
    const [file, setFile] = useState(null);
    const [pfpError, setPfpError] = useState("");
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
        setRole(decoded.role);
        setId(decoded.id);
    }, [token])

    function onFileChange(e) {
        const input = e.target;
        const chosen = input.files?.[0];
        setPfpError("");
        if (!chosen) {
            setFile(null);
            return;
        }
        const check = validatePfpFile(chosen);
        if (!check.ok) {
            setPfpError(check.message);
            input.value = "";
            setFile(null);
            return;
        }
        setFile(chosen);
    }

    async function submitPfp(e){
        e.preventDefault();
        setPfpError("");
        if (!file) {
            setPfpError("Please choose an image file.");
            return;
        }
        const check = validatePfpFile(file);
        if (!check.ok) {
            setPfpError(check.message);
            return;
        }
        setSubmitting(true);
        try {
            switch (role) {
                case "applicant":
                    await applicantApi.uploadPfp(id, file);
                    break;
                case "company":
                    await companyApi.uploadPfp(id, file);
                    break;
                case "administrator":
                    await adminApi.uploadPfp(id, file);
                    break;
                default:
                    setPfpError("Could not determine your account type. Try logging in again.");
                    setSubmitting(false);
                    return;
            }
            refreshPfp();
            success();
            onClose();
        } catch(err) {
            setPfpError(err.message || "Could not update profile picture.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <div id="upload-pfp-form">
                <form id="pfp-form" onSubmit={submitPfp}>
                    <h3>Upload Profile Picture Below:</h3>
                    <br />
                    <input 
                        type="file" 
                        id="image-input"
                        accept="image/*"
                        onChange={onFileChange}
                    />
                    {pfpError && <p className="upload-pfp-error" role="alert">{pfpError}</p>}
                    <br />
                    <button id="submit-pfp" type="submit" disabled={submitting}>
                        {submitting ? "Uploading…" : "Submit"}
                    </button>
                </form>
            </div>
        </>
    )
}

export default UploadPfpForm;