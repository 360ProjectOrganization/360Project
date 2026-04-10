import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CompanyPortalSubNav from "./CompanyPortalSubNav.jsx";
import CompanyPortalJobPostings from "./CompanyPortalJobPostings.jsx";
import CreateJobForm from "./CreateJobForm.jsx";
import Modal from "../common/Modal.jsx";

export default function CompanyPortal() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeView, setActiveview] = useState("postings"); //default view is postings
    const [selectedPosting, setSelectedPosting] = useState(null);
    const [openModal, setOpenModal] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    
    const editPostingId = location.state?.editPostingId;

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

    // Which subnav button should look selected (create modal counts as "create" tab)
    const activeSubnavTab = openModal === "open-modal" ? "create" : "postings";

    return (
        <>
            <CompanyPortalSubNav
                activeTab={activeSubnavTab}
                onPostingsClick={handlePostingsClick}
                onCreateClick={handleCreateJobPostingClick}
                onProfileClick={handleProfileClick}
            />
            
            {activeView === "postings" && (
                <CompanyPortalJobPostings
                    companyId={companyId}
                    companyName={companyName}
                    refreshKey={refreshKey}
                    editPostingId={editPostingId}
                    onEditPosting={(posting) => {
                        setSelectedPosting(posting);
                        setOpenModal("edit");
                    }}
                />
            )}

            <Modal isOpen={openModal === "open-modal"} onClose={() => setOpenModal(false)} title="Create New Job Posting">
                <CreateJobForm companyId={companyId} onSuccess={() => { setOpenModal(false); setRefreshKey((k) => k + 1); }} onCancel={() => setOpenModal(false)}/>
            </Modal>
        </>
    );
}