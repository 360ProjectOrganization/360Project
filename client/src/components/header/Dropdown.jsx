import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dropdown.css";
import { getToken, applicantApi, companyApi } from "../../utils/api.js";
import { jwtDecode } from "jwt-decode";
import ProfilePicture from "./ProfilePicture.jsx"

function Dropdown () {
    const [dropdownActivated, setDropdownActivated] = useState(false);
    const [enrolledName, setEnrolledName] = useState("");
    const [token, setToken] = useState("");
    const [role, setRole] = useState("");
    const [id, setId] = useState("");

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
            
        if(role != "administrator"){
            setId(decoded.id);
        }
    }, [token, role])
    
    
    useEffect(() => {
        async function getUserName(){
            if(role === "applicant"){
                const fetchApplicanInfo = await applicantApi.getById(id);
                let applicantName = fetchApplicanInfo.name;
                let firstName = applicantName.split(" ")[0];
                setEnrolledName(firstName);
            }else if (role === "company"){
                const fetchCompanyInfo = await companyApi.getById(id);
                let companyName = fetchCompanyInfo.name;
                setEnrolledName(companyName);
            }
        };
        getUserName();
    }, [id]);

    let dropdownItems = [
        {
            id:1,
            label: "Login",
            value: "/Login"
        },
        {
            id: 2,
            label: "Register",
            value: "/register"
        },
        {
            id:3,
            label: "Profile Page",
            value: token ? "/profile" : "/Login"
        }
    ];

    return (
        <>
            <section id="profile-section">
                {
                    token ? <ProfilePicture /> : "" 
                }
                <section id="dropdown-container"
                    onMouseEnter={() => {setDropdownActivated(true);}}
                    onMouseLeave={() => {setDropdownActivated(false);}}
                >
                    <button 
                        className="dropdown-button" 
                    >
                        {
                            role === "applicant" || role === "company" ? `Welcome, ${enrolledName}`
                            : role === "administrator" ? "Welcome, Admin"
                            : "Profile"
                        }
                    </button>
                    
                    <div className={`dropdown-options ${dropdownActivated ? "visible" : ""}`}>
                        {dropdownItems.map(option => (
                            <Link to={option.value} key={option.id} className="dropdown-option-button">
                                {option.label}
                            </Link>
                        ))}
                    </div>
                </section>

            </section>
        </>
    )
};

export default Dropdown;