import "./Profile.css";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getToken, applicantApi, companyApi, adminApi } from "../../utils/api.js";
import Card from "../common/Card.jsx";
import Modal from "../common/Modal.jsx";
import UploadResumeForm from "./UploadResumeForm.jsx";
import EditProfileForm from "./EditProfileForm.jsx";
import UploadPfpForm from "./UploadPfpForm.jsx";
import ResumeOptionsForm from "./ResumeOptionsForm.jsx";
import UserComments from "./Comments/UserComments.jsx";
import { usePfp } from "../../context/ProfilePictureContext.jsx";

function ProfilePage() {
    const [activeSection, setActiveSection] = useState("profile");

    const [token, setToken] = useState("");
    const [enrolledName, setEnrolledName] = useState("");
    const [id, setId] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const { image } = usePfp();

    const [companyId, setCompanyId] = useState([]);
    const [companyName, setCompanyName] = useState([]);
    const [jobsAppliedTo, setJobsAppliedTo] = useState([]);
    const [jobInfo, setJobInfo] = useState([]);

    const [uploadResume, setUploadResume] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [uploadPfp, setUploadPfp] = useState(false);
    const [resumeOptions, setResumeOptions] = useState(false);

    useEffect(() => {
        const available_token = getToken();
        if(available_token){
            setToken(available_token);
        };
    }, [])

    useEffect(() => {
        if(!token) return;
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setId(decoded.id)
    }, [token, role])

    useEffect(() => {
        async function getUserName(){
            switch (role){
                case "applicant":
                    const fetchApplicanInfo = await applicantApi.getById(id);
                    setEnrolledName(fetchApplicanInfo.name);
                    setEmail(fetchApplicanInfo.email);
                    let applicationIds = [];
                    const jobApplications = fetchApplicanInfo.jobsAppliedTo;
                    for(let i = 0; i < jobApplications.length; i++){
                        applicationIds.push(jobApplications[i].job);
                    }
                    setJobsAppliedTo(applicationIds);
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
        getUserName();
    }, [id])

    useEffect(() => {
        if(!jobsAppliedTo) return;
        const id_arr = [];
        const company_name = [];
        async function getCompanyIDs(){
            const allCompanies = await companyApi.getAll();
            for(let i = 0; i < allCompanies.length; i++){
                const postings = allCompanies[i].jobPostings;
                const match = (job) => jobsAppliedTo.includes(job);
                const matchExists = postings.some(match);
                if(matchExists){
                    id_arr.push(allCompanies[i]._id);
                    company_name.push(allCompanies[i].name)
                }
            }
            setCompanyId(id_arr);
            setCompanyName(company_name);
        }
        getCompanyIDs();
    }, [jobsAppliedTo])

    useEffect(() => {
        const jobs_arr = [];
        async function getJobInfo(){
            for(let i = 0; i <companyId.length; i++){
                const companyPostings = await companyApi.getJobPostings(companyId[i]);
                for(let j = 0; j <companyPostings.length; j++){
                    const postingApplicants = companyPostings[j].applicants;
                    const matchApplicant = (applicantId) => id.includes(applicantId);
                    const applicantMatchExists = postingApplicants.some(matchApplicant);
                    if(applicantMatchExists && companyPostings[j].status === "ACTIVE"){
                        jobs_arr.push({
                            id: companyPostings[j]._id,
                            company: companyName[i],
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
        <section id="profile-page-layout">
            <aside id="profile-sidebar">
                <button id="profile-btn" className={activeSection === "profile" ? "active" : ""} onClick={() => setActiveSection("profile")}>Profile</button>
                {role === "applicant" && (
                    <>
                        <button id="profile-btn" className={activeSection === "applications" ? "active" : ""} onClick={() => setActiveSection("applications")}>My Job Applications</button>
                        <button id="profile-btn" className={activeSection === "comments" ? "active" : ""} onClick={() => setActiveSection("comments")}>My Comments</button>
                    </>
                )}
            </aside>
            
            <section id="profile-main-content">
                {activeSection === "profile" && (
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
                                <button id="edit-profile" onClick={() => setEditProfile(true)}>
                                    Edit Profile
                                </button>
                                <button id="upload-profile-picture" onClick={() => setUploadPfp(true)}>
                                    Upload Profile Picture
                                </button>
                                {role === "applicant" ?
                                    <>
                                        <button id="upload-resume" onClick={() => setUploadResume(true)}>
                                            Upload Resume
                                        </button>
                                        <button id="download-resume" onClick={() => setResumeOptions(true)}>
                                            View Resume
                                        </button>
                                    </>
                                : ""}
                            </span>
                        </section>
                    </section>
                )}

                {activeSection === "applications" && role === "applicant" && (
                    <section id="applied-to-container">
                        <h2 id="applied-to-text">My Recent Job Applications</h2>
                        <div id="job-cards">
                            {jobInfo.length === 0 ? (
                                <p id="no-applications-message">You haven't applied to any jobs.</p>
                            ) : (
                                jobInfo.map((p) => {
                                    return (
                                        <Card key={p._id} title={p.title} footer={""}>
                                            <p><strong>Company: </strong>{p.company || "—"}</p>
                                            <p><strong>Location: </strong>{p.location || "—"}</p>
                                            <p><strong>Description: </strong>{p.description || "—"}</p>
                                            <p><strong>Status: </strong>{p.status}</p>
                                        </Card>
                                    )
                                })
                            )}
                        </div>
                    </section> 
                )}

                {activeSection === "comments" && (
                    <section id="comments-container">
                        <UserComments />
                    </section>
                )}
            </section>

            <Modal isOpen={uploadResume} onClose={() => setUploadResume(false)} title={"Resume"} size={"small"}>
                <UploadResumeForm onClose={() => setUploadResume(false)}/>
            </Modal>
            <Modal isOpen={editProfile} onClose={() => setEditProfile(false)} title={"Edit"}>
                <EditProfileForm />
            </Modal>
            <Modal isOpen={uploadPfp} onClose={() => setUploadPfp(false)} title={"Picture"} size={"small"}>
                <UploadPfpForm onClose={() => setUploadPfp(false)}/>
            </Modal>
            <Modal isOpen={resumeOptions} onClose={() => setResumeOptions(false)} title={"Viewing"} size={"small"}>
                <ResumeOptionsForm />
            </Modal>
        </section>
    )
};

export default ProfilePage;