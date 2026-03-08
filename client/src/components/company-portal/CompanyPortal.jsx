import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyPortalSubNav from "./CompanyPortalSubNav.jsx";
import CompanyPortalJobPostings from "./CompanyPortalJobPostings.jsx";
import CreateJobForm from "./CreateJobForm.jsx";
import Modal from "../common/Modal.jsx";

export default function CompanyPortal() {
    const navigate = useNavigate();
    const [activeView, setActiveview] = useState("postings"); //default view is postings
    const [openModal, setOpenModal] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    
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
        navigate("/profile");
    };

    return (
        <>
            <CompanyPortalSubNav
                onPostingsClick={handlePostingsClick}
                onCreateClick={handleCreateJobPostingClick}
                onProfileClick={handleProfileClick}
            />
            
            {activeView === "postings" && <CompanyPortalJobPostings companyId={companyId} companyName={companyName} refreshKey={refreshKey} />}

            <Modal isOpen={openModal === "open-modal"} onClose={() => setOpenModal(false)} title="Create New Job Posting">
                <CreateJobForm companyId={companyId} onSuccess={() => { setOpenModal(false); setRefreshKey((k) => k + 1); }} onCancel={() => setOpenModal(false)}/>
            </Modal>
        </>
    );
}