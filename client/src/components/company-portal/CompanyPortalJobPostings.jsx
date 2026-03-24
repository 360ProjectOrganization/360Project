import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { companyApi, jobPostingApi } from "../../utils/api.js";
import Card from "../common/Card.jsx";
import Modal from "../common/Modal.jsx";
import EditJobForm from "./EditJobForm.jsx";
import CloseStatus from "./CloseStatus.jsx";

export default function CompanyPostalJobPostings({ companyId, companyName, refreshKey, editPostingId, onEditPosting }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [jobPostings, setJobPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedPosting, setSelectedPosting] = useState(null);

    const openEdit = (posting) => {
        setSelectedPosting(posting);
        setIsEditOpen(true);
    };
    const closeEdit = () => {
        setIsEditOpen(false);
        setSelectedPosting(null);
    };

    const [postingToClose, setPostingToClose] = useState(null);

    const handleStatusChange = async (jobId, newStatus, closureReason) => {
        try {
            await jobPostingApi.updateStatus(jobId, newStatus, closureReason);
            if (newStatus === "CLOSED") {
                window.location.reload();
                return;
            }
            setJobPostings((prev) =>
                prev.map((p) => (p._id === jobId ? { ...p, status: newStatus, ...(newStatus === "CLOSED" && closureReason ? { closureReason } : {}) } : p))
            );
        }
        catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    useEffect(() => {
        if (!editPostingId || !jobPostings.length) return;

        const postingToEdit = jobPostings.find(
            (posting) => String(posting._id) === String(editPostingId)
        );

        if (postingToEdit) {
            openEdit(postingToEdit);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [editPostingId, jobPostings]);

    useEffect(() => {
        if (!companyId) return;

        async function load() {
            try {
                setLoading(true);
                setLoadError(null);
                const data = await companyApi.getJobPostings(companyId);
                setJobPostings(data);
            }
            catch (err) {
                console.error("Failed to load job postings: ", err);
                setLoadError(err?.message || "Failed to load job postings");
                setJobPostings([]);
            }
            finally {
                setLoading(false);
            }
        }

        load();
    }, [companyId, refreshKey]);

    if (!companyId) return <div style={{ padding: "20px" }}>Missing company id.</div>;
    if (loading) return <div style={{ padding: "20px" }}>Loading job postings...</div>;
    if (loadError) return <div style={{ padding: "20px" }} className="error-text">{loadError}</div>;
    if (!companyName) companyName = "NULL";
    
    if (jobPostings.length === 0) {
        return (
            <div style={{ padding: "20px" }}>
                No job postings for {companyName}.
            </div>
        );
    }

    return (
        <section className="job-postings-container">
            <h2>{companyName}'s Current Postings</h2>

            <section className="job-postings-layout">
                {jobPostings.map((p) => (
                    <Card key={p._id} title={p.title} footer={
                        <div className="card-actions">
                            <button className="job-card-edit-btn" onClick={() => openEdit(p)}>Edit</button>
                        </div>
                    }>
                        <p><strong>Location: </strong>{p.location || "—"}</p>
                        <p><strong>Description: </strong>{p.description || "—"}</p>
                        <p>
                            <strong>Status: </strong>
                            <select className={`pstatus ${p.status.toLowerCase()}`} value={p.status} onChange={(e) => {
                                const newStatus = e.target.value;
                                if (newStatus === 'CLOSED') setPostingToClose(p);
                                else handleStatusChange(p._id, newStatus);
                            }}>
                                <option value="ACTIVE">Active</option>
                                <option value="UNPUBLISHED">Unpublished</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </p>
                    </Card>
                ))}
            </section>

            {/* edit modal */}
            <Modal isOpen={isEditOpen} onClose={closeEdit} title="Edit Job Posting">
                <EditJobForm
                    posting={selectedPosting}
                    onClosePosting={async (jobId, closureReason) => {
                        await handleStatusChange(jobId, "CLOSED", closureReason);
                        if (jobId === selectedPosting?._id) {
                            setSelectedPosting((prev) => prev ? { ...prev, status: "CLOSED", closureReason } : null);
                        }
                    }}
                    onCancel={closeEdit}
                    onSuccess={(updatedValues) => {
                        const id = selectedPosting?._id;
                        closeEdit();
                        if (!id) return;
                        setJobPostings((prev) =>
                            prev.map((jobpost) =>
                                jobpost._id === id ? { ...jobpost, ...updatedValues } : jobpost
                            )
                        );
                    }}
                />
            </Modal>

            {/* close posting modal */}
            <CloseStatus postingToClose={postingToClose} onClose={() => setPostingToClose(null)} onClosePosting={(jobId, closureReason) => handleStatusChange(jobId, "CLOSED", closureReason)} />
            
        </section>
    );
}