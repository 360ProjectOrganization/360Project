import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./UploadResumeForm.css"
import { applicantApi, getToken } from "../../utils/api.js";

function UploadResumeForm(){
    const [token, setToken] = useState("");
    const [id, setId] = useState("");
    const [file, setFile] = useState("")

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
        const url = applicantApi.uploadResume(id, file);
        let response = await fetch(url);
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
                </form>
            </div>
        </>
    )
}

export default UploadResumeForm;