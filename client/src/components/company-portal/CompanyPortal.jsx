import { useState } from "react";
import { useLocation } from "react-router-dom";
import CompanyPortalSubNav from "./CompanyPortalSubNav.jsx";
import CompanyPortalJobPostings from "./CompanyPortalJobPostings.jsx";
import CreateJobForm from "./CreateJobForm.jsx";
import Modal from "../common/Modal.jsx";

export default function CompanyPortal() {
    const location = useLocation();
    const [selectedPosting, setSelectedPosting] = useState(null);
    const [openModal, setOpenModal] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const editPostingId = location.state?.editPostingId;

    //get company ID from local storage
    const storedUser = localStorage.getItem("jobly_user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const companyId = user?._id;
    const companyName = user?.name;

    const handleCreateJobPostingClick = () => {
        setOpenModal("open-modal");
    };

    return (
        <>
            <CompanyPortalSubNav
                isCreateActive={openModal === "open-modal"}
                onCreateClick={handleCreateJobPostingClick}
            />

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

            <Modal isOpen={openModal === "open-modal"} onClose={() => setOpenModal(false)} title="Create New Job Posting">
                <CreateJobForm companyId={companyId} onSuccess={() => { setOpenModal(false); setRefreshKey((k) => k + 1); }} onCancel={() => setOpenModal(false)}/>
            </Modal>
        </>
    );
}