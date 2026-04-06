import "./Row.css";
import { useEffect, useState } from "react";
import { applicantApi } from "../../utils/api";
import Modal from "./Modal";
import ViewResumeForm from "../company-portal/ViewResumeForm";

export default function Row({ name, id }){
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
                <img src={image} alt="pfp"/>
                <h3>{name}</h3>
                <button id="row-resume-btn" onClick={() => setResumeOptions(true)}>View Resume</button>
            </section>
            <Modal isOpen={resumeOptions} onClose={() => setResumeOptions(false)} title={"Viewing Options"} size={"small"}>
                <ViewResumeForm applicantId={id} />
            </Modal>
        </>
    )
}