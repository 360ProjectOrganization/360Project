import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Dropdown.css";
import { getToken, applicantApi } from "../../utils/api.js";
import { jwtDecode } from "jwt-decode";

function Dropdown () {
    const [dropdownActivated, setDropdownActivated] = useState(false);
    const [applicantName, setApplicantName] = useState("");
    const [token, setToken] = useState("");
    const [role, setRole] = useState("");
    const [id, setId] = useState("");
    const dropdownReference = useRef(null);

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
            
        if(role === "applicant"){
            setId(decoded.id);
        }
    }, [token, role])
    
    
    useEffect(() => {
        async function getUserName(){
            if(id){
                const fetchUserInfo = await applicantApi.getById(id);
                let name = fetchUserInfo.name;
                let firstName = name.split(" ")[0];
                setApplicantName(firstName);
            }
        };
        getUserName();
    }, [id]);

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
            <section id="dropdown-container" ref={dropdownReference}>
                <button className="dropdown-button" onClick={() => {
                    setDropdownActivated(!dropdownActivated);
                }}>
                    {
                        role === "applicant" ? `Welcome, ${applicantName}` : "Profile"
                    }
                </button>
                
                <div className={`dropdown-options ${dropdownActivated ? "visible" : ""}`}>
                    {dropdownItems.map(option => (
                        <Link to={option.value} key={option.id} className="dropdown-option-button" onClick={() => setDropdownActivated(false)}>
                            {option.label}
                        </Link>
                    ))}
                </div>
            </section>
        </>
    )
};

export default Dropdown;