import Dropdown from "./Dropdown";
import "./Header.css";
import { getToken } from "../../utils/api.js";
import { jwtDecode } from "jwt-decode";
import CompanyPortalButton from "./headerButtons/CompanyPortalButton.jsx";
import AdminPortalButton from "./headerButtons/AdminPortalButton.jsx";
import Logout from "./headerButtons/Logout.jsx";

function Header() {
    const token = getToken();
    let userId = "";
    let userRole = "";

    if(token){
        const decoded = jwtDecode(token);
        userId = decoded.id;
        userRole = decoded.role;  //roles = applicant, company, administrator
    }

    return (
        <>
            <section id="header-container">
                <section id="jobly-container">
                    <a href="/">JobLy</a>
                </section>

                <section id="navigation-container">
                    {
                        userRole === "company" ? <CompanyPortalButton /> : ""
                    }
                    {
                        userRole === "administrator" ? <AdminPortalButton /> : ""
                    }
                </section>

                <section id="user-profile">
                    <Dropdown />
                </section>

                <section id="header-logout">
                    {
                        userId != "" ? <Logout /> : ""
                    }
                </section>
            </section>
        </>
    );
};

export default Header;