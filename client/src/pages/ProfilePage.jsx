import Header from "../components/header/Header.jsx"
import "../styles/ProfilePage.css"
import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode";
import { getToken, applicantApi, companyApi, adminApi } from "../utils/api.js"
import Card from "../components/common/Card.jsx";

function ProfilePage () {
    const [token, setToken] = useState("");
    const [enrolledName, setEnrolledName] = useState("");
    const [role, setRole] = useState("");
    const [memberSince, setMemberSince] = useState("");
    const [email, setEmail] = useState("");
    const [id, setId] = useState("");

    const [companyId, setCompanyId] = useState([]);

    const [jobsAppliedTo, setJobsAppliedTo] = useState([]);
    const [jobInfo, setJobInfo] = useState([]);
    const [image, setImage] = useState("");
    // Create array, create object in function below with ...update, push job to array
    // Map over this array later

    function convertToDate (date){
        const nonUTC = new Date(date);
        const dateString = nonUTC.toString();
        const finalDate = dateString.substring(4,15);
        return finalDate;
    }

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

    // Set Img and Name
    useEffect(() => {
        async function getUserName(){
            switch (role){
                case "applicant":
                    const fetchApplicanInfo = await applicantApi.getById(id);
                    const acctCreatedAt = convertToDate(fetchApplicanInfo.createdAt);

                    setEnrolledName(fetchApplicanInfo.name);
                    setEmail(fetchApplicanInfo.email);
                    setMemberSince(acctCreatedAt);
                    setJobsAppliedTo(fetchApplicanInfo.jobsAppliedTo);
                    break;
                case "company":
                    const fetchCompanyInfo = await companyApi.getById(id);
                    setEnrolledName(fetchCompanyInfo.name);
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
                        console.log("No role identified for pfp retrieval");
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
                function match (job) {
                    return jobsAppliedTo.includes(job)
                }
                const matchExists = postings.some(match)
                if(matchExists){
                    id_arr.push(allCompanies[i]._id)
                }
            }
            setCompanyId(id_arr)
        }
        getCompanyIDs();
    }, [jobsAppliedTo])

    useEffect(() => {
        const jobs_arr = []
        async function getJobInfo(){
            for(let i = 0; i<companyId.length; i++){
                const companyPostings = await companyApi.getJobPostings(companyId[i]);
                for(let j = 0; j<companyPostings.length; j++){
                    const postingApplicants = companyPostings[j].applicants;
                    function matchApplicant (userId){
                        return id.includes(userId)
                    }
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
                    <img
                        src={image}
                        alt="pfp"
                    />
                </section>

                <section id="profile-details">
                    <h1>{enrolledName}</h1>
                    <h2>Member Since: {memberSince} | {email}</h2>
                    <span id="profile-button-layout">
                        <button id="edit-profile">
                            <a>
                                Edit Profile
                            </a>
                        </button>
                        {
                            role != "administrator" ?
                                
                                <>
                                    <button id="upload-resume">
                                        <a>
                                            Upload Resume
                                        </a>
                                    </button>
                                    <button id="download-resume">
                                        <a>
                                            Download Resume
                                        </a>
                                    </button>
                                </>

                            :""
                        }
                    </span>

                </section>
            </section>
            
            {
                role != "administrator" ? 
                
                    <section id="applied-to-container">
                        <h2>My Recent Job Applications</h2>
                        {
                            jobInfo.map((details) => {
                                console.log(details.title)
                            })
                        }
                    </section> 

                : ""
            }
            
            
        </>
    )
};

export default ProfilePage;