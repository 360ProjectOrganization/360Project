import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyPortalSubNav from "./CompanyPortalSubNav.jsx";
import CompanyPortalJobPostings from "./CompanyPortalJobPostings.jsx";
import CreateJobForm from "./CreateJobForm.jsx";
import Modal from "../common/Modal.jsx";

export default function CompanyPortal() {
    const [activeView, setActiveview] = useState("postings"); //default view is postings
    const [openModal, setOpenModal] = useState(null);
    
    //get company ID from local storage
    const storedUser = localStorage.getItem("jobly_user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const companyId = user?._id;
    const companyName = user?.name;

    const handlePostingsClick = () => {
        setActiveview("postings");
    };

    const handleCreateJobPostingClick = () => {
        setOpenModal("open-modal");
    };

    const handleProfileClick = () => {
        //TODO: once company profile is created, add navigation here
    };

    return (
        <>
            <CompanyPortalSubNav
                onPostingsClick={handlePostingsClick}
                onCreateClick={handleCreateJobPostingClick}
                onProfileClick={handleProfileClick}
            />
            
            {activeView === "postings" && <CompanyPortalJobPostings companyId={companyId} companyName={companyName} />}

            <Modal isOpen={openModal === "open-modal"} onClose={() => setOpenModal(false)} title="Create New Job Posting">
                <CreateJobForm companyId={companyId} onSuccess={() => {setOpenModal(false)}} onCancel={() => setOpenModal(false)}/>
            </Modal>
        </>
    );
}