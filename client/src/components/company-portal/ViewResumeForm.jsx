import { useEffect, useState } from "react";
import "../profile-page/ResumeOptionsForm.css"
import { applicantApi } from "../../utils/api.js";

function ViewResumeForm({ applicantId }){
    const [selectedViewing, setSelectedViewing] = useState("");
    const [resumeErrorMessage, setResumeErrorMessage] = useState("");
    const [id, setId] = useState("");

    useEffect(() => {
        setId(applicantId);
    }, [])

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
                setResumeErrorMessage("Applicant Has no Resume");
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

export default ViewResumeForm;