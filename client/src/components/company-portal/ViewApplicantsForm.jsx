import { useState, useEffect } from "react";
import { formatDate } from "../../utils/formatHelpers.js";
import { applicantApi } from "../../utils/api";
import Row from "../common/Row.jsx";

function ViewApplicantsForm({ posting }){
    const [publishedAt, setPublishedAt] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [totalApplicants, setTotalApplicants] = useState("");
    const [jobApplicantIds, setJobApplicantsIds] = useState([]);
    const [applicantDetails, setApplicantDetails] = useState([]);

    useEffect(() => {
        if(!posting) return;
        setPublishedAt(posting.publishedAt);
        setJobTitle(posting.title);
        setTotalApplicants(posting.applicants.length);
        setJobApplicantsIds(posting.applicants);
    }, []);

    useEffect(() => {
        async function getApplicantDetails(){
            let applicants = []
            for(let i = 0; i < jobApplicantIds.length; i++){
                const details = await applicantApi.getById(jobApplicantIds[i]);
                applicants.push({
                    id: details._id,
                    name: details.name,
                    status: details.status,
                    email: details.email
                });
            }
            setApplicantDetails(applicants);
        }
        getApplicantDetails();
    }, [jobApplicantIds]);
    
    return(
        <>
            <section id="view-applicants-container">
                <section id="job-details-container">
                    <span className="view-applicants-job-details">
                        <h3>Job Title: </h3>
                        <p>{jobTitle}</p>
                    </span>
                    <span className="view-applicants-job-details">
                        <h3>Total Applicants: </h3>
                        <p><strong>{totalApplicants}</strong></p>
                    </span>
                    <span className="view-applicants-job-details">
                        <h3>Posting Published on: </h3>
                        <p>{formatDate(publishedAt)}</p>
                    </span>
                </section>
                <section id="applicants-container">
                    {
                        applicantDetails.map((p) => {
                            return(
                                <Row key={p.id} name={p.name} id={p.id} email={p.email} status={p.status}/>
                            )
                        })
                    }
                </section>
            </section>
        </>
    )
}
export default ViewApplicantsForm;