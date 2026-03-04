import {useState, useEffect} from "react";
import { companyApi } from "../../utils/api.js";
import Card from "../common/Card.jsx";
import Modal from "../common/Modal.jsx";

export default function HomeJobPostings() {
    const [jobPostings, setJobPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedPosting, setSelectedPosting] = useState(null);
    
    const openDetails = (posting) => {
        setSelectedPosting(posting);
        setIsDetailsOpen(true);
    };
    const closeDetails = () => {
        setIsDetailsOpen(false);
        setSelectedPosting(null);
    };

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setLoadError(null);
                // TODO: add Api call when it's implemented
                //const data = await companyApi.getJobPostings();
                setJobPostings([]); // setJobPostings(data);
            }
            catch (err) {
                console.error("Faild to load job postings: ", err);
                setLoadError(err?.message || "Failed to load job postings");
                setJobPostings([]);
            }
            finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <div style={{ padding: "20px" }}>Loading job postings...</div>;
    if (loadError) return <div style={{ padding: "20px" }} className="error-text">{loadError}</div>;

    if (jobPostings.length === 0) {
        return (
            <div style={{ padding: "20px" }}>
                No job postings.
            </div>
        );
    }

    return (
        <section className="job-postings-container">
            <section className="job-postings-layout">
                {jobPostings.map((p) => (
                    <Card key={p._id} title={p.title} footer={
                        <div className="card-actions">
                            <button className="job-card-apply-details-btn" onClick={() => openDetails(p)}>Apply / Details</button>
                        </div>
                    }>
                        <p><strong>Employer: </strong>{p.employer || "—"}</p>
                        <p><strong>Location: </strong>{p.location || "—"}</p>
                        <p><strong>Description: </strong>{p.description || "—"}</p>
                    </Card>
                ))}
            </section>

            <Modal isOpen={isDetailsOpen} onClose={closeDetails} title="Apply / Details">
                BRUH
            </Modal>
        </section>
    );
}