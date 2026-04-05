import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./UploadResumeForm.css";
import { applicantApi, getToken } from "../../utils/api.js";
import { successEvent } from "../../utils/toast/successEvent.js";

function UploadResumeForm({successfulUpload}){
    const success = successEvent("Successfully Uploaded Resume");
    const [token, setToken] = useState("");
    const [id, setId] = useState("");
    const [file, setFile] = useState("");

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
    }, [token, id]);

    async function submitResume(e){
        e.preventDefault();
        try {
            const url = applicantApi.uploadResume(id, file);
            await fetch(url);
            successfulUpload(true);
            success();
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <>
            <div id="upload-resume-form">
                <form id="resume-form" onSubmit={submitResume}>
                    <h3>Please Upload Resume Below:</h3>
                    <br />
                    <input 
                        type="file" 
                        id="resume-input" 
                        accept="application/pdf" 
                        required
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <br />
                    <button id="submit-resume" type="submit">
                        Submit
                    </button>
                </form>
            </div>
        </>
    )
}

export default UploadResumeForm;