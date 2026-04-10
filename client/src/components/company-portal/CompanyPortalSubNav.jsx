import "./CompanyPortal.css";

export default function CompanyPortalSubNav({activeTab = "postings", onPostingsClick, onCreateClick, onProfileClick,}) {
    return (
        <section className="subnav-container">
            <button className = {`company-portal-btn${activeTab === "postings" ? " active" : ""}`} onClick={onPostingsClick}>Company Job Postings</button>
            <button className = {`company-portal-btn${activeTab === "create" ? " active" : ""}`} onClick={onCreateClick}>Create New Job Posting</button>
            <button className={`company-portal-btn${activeTab === "profile" ? " active" : ""}`} onClick={onProfileClick}>Company Profile</button>
        </section>
    );
}