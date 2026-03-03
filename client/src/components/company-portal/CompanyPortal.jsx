import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyPortalSubNav from "./CompanyPortalSubNav.jsx";
import CompanyPortalJobPostings from "./CompanyPortalJobPostings.jsx";

export default function CompanyPortal() {
    const [activeView, setActiveview] = useState("postings"); //default view is postings

    const handlePostingsClick = () => {
        // display all job postings for a company
        setActiveview("postings");
    };

    const handleCreateClick = () => {
        // opens modal for creating a job posting
    };

    const handleProfileClick = () => {
        //TODO: once company profile is created, add navigate here
    };

    return (
        <>
            <CompanyPortalSubNav
                onPostingsClick={handlePostingsClick}
                onCreateClick={handleCreateClick}
                onProfileClick={handleProfileClick}
            />
            
            {activeView === "postings" && <CompanyPortalJobPostings/>}
        </>
    );
}