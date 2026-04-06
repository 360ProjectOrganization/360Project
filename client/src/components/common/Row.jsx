import "./Row.css";
import { useEffect, useState } from "react";
import { applicantApi } from "../../utils/api";
import Modal from "./Modal";
import ViewResumeForm from "../company-portal/ViewResumeForm";

export default function Row({ name, id, email, status }){
    const [image, setImage] = useState("");
    const [resumeOptions, setResumeOptions] = useState(false);
    useEffect(() => {
        async function getApplicantPfp(){
            if(id){
                const url = applicantApi.getPfpUrl(id);
                let response = await fetch(url, {
                    method: "GET"
                });
            
                if(response.status === 200){
                    const imageBlob = await response.blob();
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    setImage(imageObjectURL);
                }
            }
        }
        getApplicantPfp();
    }, []);

    return(
        <>
            <section className="row-container">
                <div id="important-row-info">
                    <img src={image} alt="pfp"/>
                    <h3>{name}</h3>
                </div>
                <div id="row-info-email">
                    <p>{email}</p>
                </div>
                <div id="row-info-status">
                    <p>{status}</p>
                </div>
                <div id="row-resume">
                    <button id="row-resume-btn" onClick={() => setResumeOptions(true)}>View Resume</button>
                </div>
            </section>
            <Modal isOpen={resumeOptions} onClose={() => setResumeOptions(false)} title={"Viewing Options"} size={"small"}>
                <ViewResumeForm applicantId={id} />
            </Modal>
        </>
    )
}