import { useEffect, useState } from "react";
import { companyApi } from "../../utils/api.js";
import Card from "../common/Card.jsx";
import Modal from "../common/Modal.jsx";
import EditJobForm from "./EditJobForm.jsx";


export default function CompanyPostalJobPostings({ companyId, companyName, refreshKey }) {
    const [jobPostings, setJobPostings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedPosting, setSelectedPosting] = useState(null);

    const openEdit = (posting) => {
        setSelectedPosting(posting);
        setIsEditOpen(true);
    };
    const closeEdit = () => {
        setIsEditOpen(false);
        setSelectedPosting(null);
    };
    const openDelete = (posting) => {
        setSelectedPosting(posting);
        setIsDeleteOpen(true);
    }
    const closeDelete = () => {
        setIsDeleteOpen(false);
        setSelectedPosting(null);
    }

    const handleStatusChange = async (jobId, newStatus) => {
        //TODO: once job posting update endpoint is created, implement function here
        console.log("Updating job status not implemented yet");
    }

    useEffect(() => {
        if (!companyId) return;

        async function load() {
            try {
                setLoading(true);
                const data = await companyApi.getJobPostings(companyId);
                setJobPostings(data);
            }
            catch (err) {
                console.error("Failed to load job postings: ", err);
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
                            <button className="job-card-delete-btn" onClick={() => openDelete(p)}>Delete</button>
                        </div>
                    }>
                        {/* children */}
                        <p><strong>Location: </strong>{p.location}</p>
                        <p><strong>Description: </strong>{p.description}</p>
                        <p>
                            <strong>Status: </strong>
                            <select className={`pstatus ${p.status.toLowerCase()}`} value={p.status} onChange={(e) => handleStatusChange(p._id, e.target.value)}>
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
                <EditJobForm posting={selectedPosting} onCancel={closeEdit} onSuccess={(updatedValues) => {
                        closeEdit();
                        if (!(selectedPosting?._id)) return;
                        setJobPostings((prev) =>
                            prev.map((jobpost) =>
                                jobpost._id === id ? { ...jobpost, ...updatedValues } : jobpost
                            )
                        );
                    }}
                />
            </Modal>

            {/* delete modal */}
            <Modal isOpen={isDeleteOpen} onClose={closeDelete} title="Delete Job Posting" size="small">
                {selectedPosting && (
                    <div className="delete-modal-content">
                        <p>Are you sure you want to delete <strong>{selectedPosting.title}</strong>?</p>
                        <div className="modal-actions">
                            <button className="form-action-btn" type="button" onClick={closeDelete}>Cancel</button>
                            <button className="form-action-btn" type="button" onClick={() => {
                                    //TODO: implement API call, might look a little different from comment below
                                    // await jobPostingApi.deleteJobPosting(selectedPosting._id);
                                    closeDelete();
                                }}
                            >Confirm</button>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
}