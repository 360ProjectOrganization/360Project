import { useState, useEffect } from "react";

function ViewApplicantsForm({ posting }){
    const [companyId, setCompanyId] = useState("");
    const [publishedAt, setPublishedAt] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [totalApplicants, setTotalApplicants] = useState("");
    const [jobApplicants, setJobApplicants] = useState([]);

    useEffect(() => {
        if(!posting) return;
        setCompanyId(posting._id);
        setPublishedAt(posting.publishedAt);
        setJobTitle(posting.title);
        setTotalApplicants(posting.applicants.length);
        setJobApplicants(posting.applicants);
    }, []);
    

    return(
        <>

        </>
    )
}

export default ViewApplicantsForm;