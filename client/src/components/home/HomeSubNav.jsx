import "../company-portal/CompanyPortal.css";

export default function HomeSubNav() {
    return (
        <section className="subnav-container">
            {/* TODO: switch location and job title to search inputs, change Tags to a drop down */}
            <button className="company-portal-btn">Search: Location...</button>
            <button className="company-portal-btn">Search: Job Title...</button>
            <button className="company-portal-btn">Drop-down: Tags</button>
        </section>
    );
}   