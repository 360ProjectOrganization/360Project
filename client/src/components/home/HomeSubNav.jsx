import "../company-portal/CompanyPortal.css";

export default function HomeSubNav() {
    return (
        <section className="subnav-container">
            <button className="company-portal-btn">Search: Location...</button>
            <button className="company-portal-btn">Search: Job Title...</button>
            <button className="company-portal-btn">Drop-down: Tags</button>
        </section>
    );
}   