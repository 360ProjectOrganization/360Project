import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyPortalSubNav from "./CompanyPortalSubNav.jsx";
import CompanyPortalJobPostings from "./CompanyPortalJobPostings.jsx";

export default function CompanyPortal() {
    const [activeView, setActiveview] = useState("postings"); //default view is postings
    
    //get company ID from local storage
    const storedUser = localStorage.getItem("jobly_user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const companyId = user?._id;

    const handlePostingsClick = () => {
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
            
            {activeView === "postings" && <CompanyPortalJobPostings companyId={companyId} />}
        </>
    );
}