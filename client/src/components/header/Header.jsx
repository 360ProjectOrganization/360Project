import Dropdown from "./Dropdown";
import "./Header.css";
import { getToken } from "../../utils/api.js";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import CompanyPortalButton from "./headerButtons/CompanyPortalButton.jsx";
import AdminPortalButton from "./headerButtons/AdminPortalButton.jsx";
import Logout from "./headerButtons/Logout.jsx";

function Header() {
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
        <>
            <section id="header-container">
                <section id="jobly-container">
                    <a href="/">JobLy</a>
                </section>

                <section id="special-navigation-container">
                    {
                        role === "company" ? <CompanyPortalButton /> : ""
                    }
                    {
                        role === "administrator" ? <AdminPortalButton /> : ""
                    }
                </section>

                <section id="user-navigation-conatainer">
                    <Dropdown />
                    {
                        token ? <Logout /> : ""
                    }
                </section>

            </section>
        </>
    );
};

export default Header;