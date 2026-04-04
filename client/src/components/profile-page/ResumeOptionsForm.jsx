import { useState, useEffect } from "react";
import "./ResumeOptionsForm.css";
import { jwtDecode } from "jwt-decode";
import { getToken, applicantApi } from "../../utils/api.js";

function ResumeOptionsForm(){
    const [selectedViewing, setSelectedViewing] = useState("");
    const [token, setToken] = useState("");
    const [id, setId] = useState("");
    const [role, setRole] = useState("");
    const [resumeErrorMessage, setResumeErrorMessage] = useState("");

    useEffect(() => {
        const available_token = getToken();
        if(available_token){
            setToken(available_token);
        };
    }, [])
    
    useEffect(() => {
        if(!token) return;
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setId(decoded.id);
    }, [token, role])

    function handleChange (e) {
        setSelectedViewing(e.target.value);
    }

    async function displayResume(e){
        e.preventDefault();
        let url = ""
        if(selectedViewing === "browser"){
            url = applicantApi.getResumeViewUrl(id);
        }else if(selectedViewing === "download"){
            url = applicantApi.getResumeUrl(id);
        }else{
            setResumeErrorMessage("No Option Selected");
            return;
        }

        try {
            const response = await fetch(url);
            if(response.status === 404){
                setResumeErrorMessage("Upload a Resume First Before Viewing");
                return;
            }
            window.open(url, "_blank");
        } catch (error) {
            setResumeErrorMessage("Error Ocurred Retrieving Resume");
        }
    }

    return (
        <>
            <div id="resume-question-container">
                <h3>Resume Viewing Choice:</h3>
                <div id="radio-buttons-section">
                    <div className="radio-container">
                        <label className="resume-radio">
                            <input
                                className="resume-radio-options"
                                type="radio"
                                name="browser"
                                value="browser"
                                checked={selectedViewing === "browser"}
                                onChange={handleChange}
                            /> In Browser
                        </label>
                    </div>
                    <div className="radio-container">
                        <label className="resume-radio">
                            <input
                                className="resume-radio-options"
                                type="radio"
                                name="download"
                                value="download"
                                checked={selectedViewing === "download"}
                                onChange={handleChange}
                            /> Download
                        </label>
                    </div>
                </div>
                <p id="error-text">{resumeErrorMessage}</p>
                <button id="resume-choice" type="submit" onClick={displayResume}>
                    Submit
                </button>
            </div>
        </>
    )
}

export default ResumeOptionsForm;