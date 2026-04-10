import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { applicantApi, companyApi, adminApi, getToken } from "../../utils/api.js";
import "./UploadPfpForm.css";
import { usePfp } from "../../context/ProfilePictureContext.jsx";
import { successEvent } from "../../utils/toast/successEvent.js";

function UploadPfpForm(){
    const success = successEvent("Successfully Uploaded Image");
    const [token, setToken] = useState("");
    const [id, setId] = useState("");
    const [role, setRole] = useState("");
    const [file, setFile] = useState("");
    const { refreshPfp } = usePfp();

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
    }, [token, role]);

    async function submitPfp(e){
        e.preventDefault();
        try {
            let url = ""
            switch (role) {
                case "applicant":
                    url = applicantApi.uploadPfp(id, file);
                    break;
                case "company":
                    url = companyApi.uploadPfp(id, file);
                    break;
                case "administrator":
                    url = adminApi.uploadPfp(id, file);
                    break;
                default:
                    break;
            }
            await fetch(url);
            refreshPfp();
            success();
        } catch(err) {
            console.log(err);
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
                        required
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <br />
                    <button id="submit-pfp" type="submit">
                        Submit
                    </button>
                </form>
            </div>
        </>
    )
}

export default UploadPfpForm;