import "./Row.css";
import { useState } from "react";
import { applicantApi } from "../../utils/api";

export default function Row({ name, id }){
    const [image, setImage] = useState("");
    async function getApplicantPfp(){
        if(id){
            const url = applicantApi.getPfpUrl(id);
            let response = await fetch(url, {
                method: "GET"
            });
        
            if(response.status === 200){
                const imageBlob = await response.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                console.log(imageObjectURL);
                setImage(imageObjectURL);
            }
        }
    }
    getApplicantPfp();

    return(
        <section className="row-container">
            <img src={image} alt="pfp"/>
            <h3>{name}</h3>
            <button id="row-resume-btn">View Resume</button>
        </section>
    )
}