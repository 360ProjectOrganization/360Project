import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./UploadResumeForm.css"
import { applicantApi, getToken } from "../../utils/api.js";

function UploadResumeForm(){
    const [token, setToken] = useState("");
    const [id, setId] = useState("");
    const [file, setFile] = useState("")
    const [resumeError, setResumeError] = useState("");

        useEffect(() => {
            const available_token = getToken();
            if(available_token){
                setToken(available_token);
            };
        }, [])
    
        useEffect(() => {
            if(!token) return;
            const decoded = jwtDecode(token);
            setId(decoded.id)
        }, [token, id])

    async function submitResume(e){
        e.preventDefault();

        if(id === ""){
            setResumeError("No ID found");
            return;
        }else if(file === ""){
            setResumeError("No file attached");
            return;
        }

        try {
            const url = applicantApi.uploadResume(id, file);
            await fetch(url);
        } catch(err) {
            console.log(err);
            setResumeError("Error Uploading Resume");
        }
    }

    return (
        <>
            <div id="upload-resume-form">
                <form id="resume-form" onSubmit={submitResume}>
                    <h2>Please Upload Resume in Box Below:</h2>
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
                    <p id="error-text">{resumeError}</p>
                </form>
            </div>
        </>
    )
}

export default UploadResumeForm;