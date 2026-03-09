import Header from "../components/header/Header.jsx"
import "../styles/ProfilePage.css"
import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode";
import { getToken, applicantApi, companyApi, adminApi } from "../utils/api.js"
import Card from "../components/common/Card.jsx";

function ProfilePage () {
    const [token, setToken] = useState("");
    const [enrolledName, setEnrolledName] = useState("");
    const [id, setId] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");

    const [companyId, setCompanyId] = useState([]);

    const [jobsAppliedTo, setJobsAppliedTo] = useState([]);
    const [jobInfo, setJobInfo] = useState([]);

    // Token
    useEffect(() => {
        const available_token = getToken();
        if(available_token){
            setToken(available_token);
        };
    }, [])

    // Set Role
    useEffect(() => {
        if(!token) return;
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setId(decoded.id)
    }, [token, role])

    // Set pfp and user details
    useEffect(() => {
        async function getUserName(){
            switch (role){
                case "applicant":
                    const fetchApplicanInfo = await applicantApi.getById(id);
                    setEnrolledName(fetchApplicanInfo.name);
                    setEmail(fetchApplicanInfo.email);
                    setJobsAppliedTo(fetchApplicanInfo.jobsAppliedTo);
                    break;
                case "company":
                    const fetchCompanyInfo = await companyApi.getById(id);
                    setEnrolledName(fetchCompanyInfo.name);
                    setEmail(fetchCompanyInfo.email);
                    break;
                case "administrator":
                    setEnrolledName("Admin");
                    break;
                default:
                    return;
            }
        };
        async function getUserPfp(){
            if(id){
                let url = ""
                switch(role){
                    case "applicant":
                        url = applicantApi.getPfpUrl(id);
                        break;
                    case "company":
                        url = companyApi.getPfpUrl(id);
                        break;
                    case "administrator":
                        url = adminApi.getPfpUrl(id);
                        break;
                    default:
                        return;
                }

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
        getUserName();
        getUserPfp();
    }, [id])

    // Narrow down application to related company
    useEffect(() => {
        if(!jobsAppliedTo) return;
        const id_arr = []
        async function getCompanyIDs(){
            const allCompanies = await companyApi.getAll();
            for(let i = 0; i < allCompanies.length; i++){
                const postings = allCompanies[i].jobPostings;
                const match = (job) => jobsAppliedTo.includes(job);
                const matchExists = postings.some(match);
                if(matchExists){
                    id_arr.push(allCompanies[i]._id);
                }
            }
            setCompanyId(id_arr)
        }
        getCompanyIDs();
    }, [jobsAppliedTo])

    // Match applicant ids with logged in id
    useEffect(() => {
        const jobs_arr = []
        async function getJobInfo(){
            for(let i = 0; i <companyId.length; i++){
                const companyPostings = await companyApi.getJobPostings(companyId[i]);
                for(let j = 0; j <companyPostings.length; j++){
                    const postingApplicants = companyPostings[j].applicants;
                    const matchApplicant = (applicantId) => id.includes(applicantId);
                    const applicantMatchExists = postingApplicants.some(matchApplicant);
                    if(applicantMatchExists){
                        jobs_arr.push({
                            ...jobInfo,
                            id: companyPostings[j]._id,
                            title: companyPostings[j].title,
                            location: companyPostings[j].location,
                            description: companyPostings[j].description,
                            status: companyPostings[j].status
                        })
                    }
                }
            }
            setJobInfo(jobs_arr);
        }
        getJobInfo();
    }, [companyId])

    return (
        <>
            <Header />
            <section id="profile-container">
                <section id="profile-picture-section">
                    <img src={image} alt="pfp"/>
                </section>
                <section id="profile-details">
                    <h1>{enrolledName}</h1>
                    {
                        role != "administrator" ? <p><strong>Email: </strong>{email}</p> : ""
                    }
                    <span id="profile-button-layout">
                        <button id="edit-profile">
                            <a>Edit Profile</a>
                        </button>
                        {role === "applicant" ?
                            <>
                                <button id="upload-resume">
                                    <a>Upload Resume</a>
                                </button>
                                <button id="download-resume">
                                    <a>Download Resume</a>
                                </button>
                            </> :""}
                    </span>
                </section>
            </section>
            {role === "applicant" ? 
                <section id="applied-to-container">
                    <h2 id="applied-to-text">My Recent Job Applications</h2>
                    <div id="job-cards">
                        {jobInfo.map((p) => {
                            return (
                                <Card key={p._id} title={p.title} footer={""}>
                                    <p><strong>Location: </strong>{p.location || "—"}</p>
                                    <p><strong>Description: </strong>{p.description || "—"}</p>
                                    <p><strong>Status: </strong>{p.status}</p>
                                </Card>
                            )
                        })}
                    </div>
                </section> : "" }
        </>
    )
};

export default ProfilePage;