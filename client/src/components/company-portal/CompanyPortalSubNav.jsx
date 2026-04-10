import { useNavigate } from "react-router-dom";
import "./CompanyPortal.css";

export default function CompanyPortalSubNav({ isCreateActive = false, onCreateClick }) {
    const navigate = useNavigate();

    return (
        <section className="subnav-container" aria-label="Company portal">
            <h1 className="company-portal-page-title">Company Job Postings</h1>
            <div className="company-portal-subnav-actions">
                <button type="button" className="company-portal-btn" onClick={() => navigate("/profile")}>
                    Company profile
                </button>
                <button type="button" className={`company-portal-btn${isCreateActive ? " active" : ""}`} onClick={onCreateClick}>
                    Create New Job Posting
                </button>
            </div>
        </section>
    );
}