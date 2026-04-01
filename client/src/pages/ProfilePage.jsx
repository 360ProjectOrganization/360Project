import Header from "../components/header/Header.jsx";
import "../styles/ProfilePage.css";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getToken, applicantApi, companyApi, adminApi, jobPostingApi } from "../utils/api.js";
import Card from "../components/common/Card.jsx";
import Modal from "../components/common/Modal.jsx";
import UploadResumeForm from "../components/profile-page/UploadResumeForm.jsx";
import EditProfileForm from "../components/profile-page/EditProfileForm.jsx";
import UploadPfpForm from "../components/profile-page/UploadPfpForm.jsx";

function ProfilePage () {
    const [token, setToken] = useState("");
    const [enrolledName, setEnrolledName] = useState("");
    const [id, setId] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");

    const [uploadResume, setUploadResume] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [uploadPfp, setUploadPfp] = useState(false);
    const [resumeError, setResumeError] = useState("");

    const [appliedTo, setAppliedTo] = useState("");

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
        async function getAppliedTo(){
            const job_ids = []
            const jobs_arr = []
            if(id && role === "applicant"){
                const postings = await jobPostingApi.getAll();
                for(let i = 0; i < postings.length; i++){
                    const job_applicants = postings[i].applicants;
                    for(let j = 0; j < job_applicants.length; j++){
                        if(job_applicants[j] === id){
                            job_ids.push(postings[i]._id);
                            break;
                        }
                    }
                }

                for(let i = 0; i < job_ids.length; i++){
                    const job_posting_info = await jobPostingApi.getById(job_ids[i])
                    jobs_arr.push({
                        id: job_posting_info._id,
                        title: job_posting_info.title,
                        location: job_posting_info.location,
                        description: job_posting_info.description,
                        status: job_posting_info.status
                    })
                }
            }
            setAppliedTo(jobs_arr);
        }
        getUserName();
        getUserPfp();
        getAppliedTo();
    }, [id])


    async function displayResume(e){
        e.preventDefault();
        const url = applicantApi.getResumeViewUrl(id);
        try {
            const response = await fetch(url);
            if(response.status === 404){
                setResumeError("No resume available for download");
                return;
            }
            window.open(url, "_blank");
            setResumeError("");
        } catch (error) {
            console.log(error);
            setResumeError("Error occured getting resume");
        }
    }
    
    return (
        <>
            <Header />
            <section id="profile-container">
                <section id="profile-picture-section">
                    <img src={image} alt="pfp" onClick={() => setUploadPfp(true)}/>
                </section>
                <section id="profile-details">
                    <h1>{enrolledName}</h1>
                    {
                        role != "administrator" ? <p><strong>Email: </strong>{email}</p> : ""
                    }
                    <span id="profile-button-layout">
                        <button id="edit-profile" onClick={() => setEditProfile(true)}>
                            <a>Edit Profile</a>
                        </button>
                        {role === "applicant" ?
                            <>
                                <button id="upload-resume" onClick={() => setUploadResume(true)}>
                                    <a>Upload Resume</a>
                                </button>
                                <button id="download-resume" onClick={displayResume}>
                                    <a>View Resume</a>
                                </button>
                                <p>{resumeError}</p>
                            </> :""}
                    </span>
                </section>
            </section>
            {role === "applicant" ? 
                <section id="applied-to-container">
                    <h2 id="applied-to-text">My Recent Job Applications</h2>
                    <div id="job-cards">
                        {appliedTo.map((p) => {
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

            <Modal isOpen={uploadResume} onClose={() => setUploadResume(false)} title={"Upload Resume"}>
                <UploadResumeForm />
            </Modal>
            <Modal isOpen={editProfile} onClose={() => setEditProfile(false)} title={"Edit Profile"}>
                <EditProfileForm />
            </Modal>
            <Modal isOpen={uploadPfp} onClose={() => setUploadPfp(false)} title={"Edit Profile Picture"}>
                <UploadPfpForm />
            </Modal>
        </>
    )
};

export default ProfilePage;