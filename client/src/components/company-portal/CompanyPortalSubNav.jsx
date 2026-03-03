import "./CompanyPortalSubNav.css";

export default function CompanyPortalSubNav() {
    return (
        <section className="subnav-container">
            <button className="company-portal-btn">Company Job Postings</button>
            <button className="company-portal-btn">Create New Job Posting</button>
            <button className="company-portal-btn">Company Profile</button>
        </section>
    );
}