import "./CompanyPortal.css";

export default function CompanyPortalSubNav({onPostingsClick, onCreateClick, onProfileClick}) {
    return (
        <section className="subnav-container">
            <button className="company-portal-btn" onClick={onPostingsClick}>Company Job Postings</button>
            <button className="company-portal-btn" onClick={onCreateClick}>Create New Job Posting</button>
            <button className="company-portal-btn" onClick={onProfileClick}>Company Profile</button>
        </section>
    );
}