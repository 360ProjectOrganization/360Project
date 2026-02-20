import { useEffect, useRef, useState } from "react";
import "./Dropdown.css"
import { getToken, applicantApi } from "../../utils/api.js"
import { jwtDecode } from "jwt-decode";

function Dropdown () {
    const [dropdownActivated, setDropdownActivated] = useState(false);
    const [applicantName, setApplicantName] = useState("");
    const dropdownReference = useRef(null);

    const token = getToken();
    let userId = "";
    let userRole = "";
    
    if(token){
        const decoded = jwtDecode(token);
        userRole = decoded.role;
        if(userRole === "applicant"){
            userId = decoded.id;
        }
    }
    
    useEffect(() => {
        async function getUserName(){
            if(userId != ""){
                const fetchUserInfo = await applicantApi.getById(userId);
                let name = fetchUserInfo.name;
                let firstName = name.split(" ")[0];
                setApplicantName(firstName);
            }
        }
        getUserName();
    }, [])

    useEffect(() => {
        function dropdownHandler (e) {
            if(dropdownReference.current){
                if(!dropdownReference.current.contains(e.target)){
                    setDropdownActivated(false);
                }
            }
        };
        document.addEventListener("click", dropdownHandler);
        return() => {
            document.removeEventListener("click", dropdownHandler);
        };
    });

    let dropdownItems = [
        {
            id:1,
            label: "Login",
            value: "/Login"
        },
        {
            id: 2,
            label: "Register",
            value: "/register-applicant" //TODO Update for general applicant page
        },
        {
            id:3,
            label: "Profile Page",
            value: userId ? "/profile" : "/Login"
        }
    ];

    return (
        <>
            <section id="dropdown-container" ref={dropdownReference}>
                <button className="dropdown-button" onClick={() => {
                    setDropdownActivated(!dropdownActivated);
                }}>
                    {
                        userRole === "applicant" ? `Welcome, ${applicantName}` : "Profile"
                    }
                </button>
                
                <div className={`dropdown-options ${dropdownActivated ? "visible" : ""}`}>
                    {dropdownItems.map((option) => {
                        return (
                            <a href={option.value} className="dropdown-option-button">
                                {option.label}
                            </a>
                        )
                    })}
                </div>
            </section>
        </>
    )
};

export default Dropdown;