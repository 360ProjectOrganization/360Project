import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../common/Card.jsx";
import Modal from "../common/Modal.jsx";
import { jwtDecode } from "jwt-decode";
import {getToken, companyApi } from "../../utils/api.js";
import { formatDate } from "../../utils/formatHelpers.js";
import { filterJobPostings } from "../../utils/filterHelper.js";

import JobDetailsForm from "./JobDetailsForm.jsx";
import HomeSearchBar from "./HomeSearchBar.jsx";

export default function HomeJobPostings() {
    const location = useLocation();
    const navigate = useNavigate();

    const [id, setId] = useState("");
    const [role, setRole] = useState("");

    const [jobPostings, setJobPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
    const [selectedPosting, setSelectedPosting] = useState(null);

    const [titleQuery, setTitleQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [appliedFilter, setAppliedFilter] = useState("all");
    const allTags = [...new Set(jobPostings.flatMap((p) => p.tags || []))].sort(); //flatMap basically turns the set into one single array (instead of an array of arrays)

    const filteredJobPostings = filterJobPostings(jobPostings, {titleQuery, locationQuery, selectedTag, appliedFilter }, { id, role });

    const openJobDetails = (posting) => {
        setSelectedPosting(posting);
        setIsJobDetailsOpen(true);
    }
    const closeJobDetails = () => {
        setIsJobDetailsOpen(false);
        setSelectedPosting(null);
    }

    //get token, decode token, then extract the values
    useEffect(() => {
        const token = getToken();
        if (!token) {
            setIsAuthenticated(false);
            return;
        }
        
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setId(decoded.id);
        setIsAuthenticated(true);
    }, []);

    useEffect(() => {
        const openPostingId = location.state?.openPostingId;
        if (!openPostingId || jobPostings.length === 0) return;

        const postingToOpen = jobPostings.find((posting) => String(posting._id) === String(openPostingId));
        if (postingToOpen) {
            openJobDetails(postingToOpen);
            navigate(location.pathname, {
                replace: true,
                state: {},
            });
        }
    }, [location.state, jobPostings]);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setLoadError(null);

                const companies = await companyApi.getAll();

                const postingsByCompany = await Promise.all(
                    companies.map(async (company) => {
                        const postings = await companyApi.getJobPostings(company._id);

                        return postings.map((posting) => ({
                            ...posting,
                            companyName: company.name,
                            companyId: company._id,
                        }));
                    })
                );

                const postings = postingsByCompany.flat();
                postings.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

                setJobPostings(postings);
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
            <HomeSearchBar role={role} titleQuery={titleQuery} setTitleQuery={setTitleQuery} locationQuery={locationQuery} setLocationQuery={setLocationQuery} selectedTag={selectedTag} setSelectedTag={setSelectedTag} appliedFilter={appliedFilter} setAppliedFilter={setAppliedFilter} tags={allTags} />

            <section className="job-postings-layout">
                {filteredJobPostings.length === 0 ? (
                    <p className="no-results">No job postings match your search.</p>
                ) : (
                    filteredJobPostings.map((p) => {
                        const hasApplied = role === "applicant" && p.applicants?.some((val) => String(val) === id);
                        const isOwnCompanyPost = role === "company" && String(p.companyId) === String(id);

                        return (
                            <Card key={p._id} title={p.title} footer={
                                <div className="card-actions">
                                    <button className="home-apply-details-btn" onClick={() => openJobDetails(p)}>{(role === 'applicant') ? "Apply" : "Details"}</button>
                                </div>
                            }>
                                <div className="home-card-body-inner">
                                    <div>
                                        <div className="home-card-header-row">
                                            <p className="job-info">Company: {p.companyName}</p>
                                            {hasApplied && <span className="home-applied-badge">Applied</span>}
                                            {isOwnCompanyPost && <span className="home-applied-badge">Your Post</span>}
                                        </div>
                                        <p className="job-info">Location: {p.location}</p>
                                        <p className="job-description">Description: {p.description}</p>
                                    </div>
                                    <p className="home-jp-date">Posted: {formatDate(p.publishedAt)}</p>
                                </div>
                            </Card>
                        );
                    })
                )}
            </section>

            <Modal isOpen={isJobDetailsOpen} onClose={closeJobDetails} title={selectedPosting?.title}>
                <JobDetailsForm posting={selectedPosting} role={role} userId={id} isAuthenticated={isAuthenticated} onCancel={closeJobDetails} onSuccess={(updatedValues) => {
                        const id = selectedPosting?._id;
                        closeJobDetails();
                        if (!id) return;
                        setJobPostings((prev) =>
                            prev.map((jobpost) =>
                                jobpost._id === id ? { ...jobpost, ...updatedValues } : jobpost
                            )
                        );
                    }}
                />
            </Modal>
        </section>
    );
}