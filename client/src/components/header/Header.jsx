import Dropdown from "./Dropdown";
import "./Header.css"
import { getToken } from "../../utils/api.js"
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import CompanyPortalButton from "./headerButtons/CompanyPortalButton.jsx";
import AdminPortalButton from "./headerButtons/AdminPortalButton.jsx";

function Header() {
    const [hideAdminPortal, setHideAdminPortal] = useState(false);
    const [hideCompanyPortal, setHideCompanyPortal] = useState(false);

    const token = getToken();
    const decoded = jwtDecode(token);
    let userId = decoded.id;
    let userRole = decoded.role;  //applicant, company, administrator
    

    return (
        <>
            <section id="header-container">
                <section id="jobly-container">
                    <a href="/">JobLy</a>
                </section>

                <section id="navigation-container">
                    {
                        userRole === "administrator" ? <CompanyPortalButton /> : ""
                    }
                    {
                        userRole === "company" ? <AdminPortalButton /> : ""
                    }
                </section>

                <section id="user-profile">
                    <Dropdown />
                </section>
            </section>
        </>
    );
};

export default Header;