import Header from "../components/header/Header.jsx"
import "../styles/ProfilePage.css"
import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode";
import { getToken, applicantApi, companyApi, adminApi } from "../utils/api.js"

function ProfilePage () {
    const [token, setToken] = useState("");
    const [enrolledName, setEnrolledName] = useState("");
    const [role, setRole] = useState("");
    const [id, setId] = useState("");
    const [image, setImage] = useState("");

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
            if(role === "applicant"){
                const fetchApplicanInfo = await applicantApi.getById(id);
                const applicantName = fetchApplicanInfo.name;
                setEnrolledName(applicantName);
            }else if (role === "company"){
                const fetchCompanyInfo = await companyApi.getById(id);
                let companyName = fetchCompanyInfo.name;
                setEnrolledName(companyName);
            }else if(role === "administrator"){
                setEnrolledName("Admin");
            }else{
                console.log("No role identified for setting name")
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
                    <h2>{role}</h2>
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
                    </section> 
                

                : ""
            }
            
            
        </>
    )
};

export default ProfilePage;