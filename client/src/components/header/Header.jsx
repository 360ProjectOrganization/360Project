import Dropdown from "./Dropdown";
import "./Header.css";
import { getToken } from "../../utils/api.js";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Logout from "./headerButtons/Logout.jsx";
import HeaderButton from "./headerButtons/HeaderButton.jsx";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs.jsx";

function Header() {
    let navigate = useNavigate();
    const [token, setToken] = useState("");
    const [role, setRole] = useState("");

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
    }, [token, role])

    return (
        <section id="header">
            <section id="header-container">
                <section id="jobly-container">
                    <span id="jobly-title" onClick={() => navigate("/")}>
                        JobLy
                    </span>
                </section>
                
                <section id="special-navigation-container">
                    {
                        token ? <HeaderButton title={"Profile Page"} link={"/profile"}/> : ""
                    }
                    {
                        role === "company" ? <HeaderButton title={"Company Portal"} link={"/company-portal"} /> : ""
                    }
                    {
                        role === "administrator" ? <HeaderButton title={"Admin Portal"} link={"/Admin"} /> : ""
                    }
                </section>
                <section id="user-navigation-conatainer">
                    <Dropdown />
                    {
                        token ? <Logout /> : ""
                    }
                </section>
            </section>
            <section id="breadcrumb-container">
                <Breadcrumbs />
            </section>
        </section>
    );
};

export default Header;