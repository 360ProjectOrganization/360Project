import "../company-portal/CompanyPortal.css";
import "../home/Home.css";

export default function HomeSearchBar({ role, titleQuery, setTitleQuery, locationQuery, setLocationQuery, selectedTag, setSelectedTag, appliedFilter, setAppliedFilter, tags}) {
    const clearFilters = () => {
        setTitleQuery("");
        setLocationQuery("");
        setSelectedTag("");
        setAppliedFilter("all");
    };
    
    return (
        <header className="subnav-container">
            <section className="home-search">
                <label>Job Title</label>
                <input type="search" className="home-search" placeholder="Job Title" value={titleQuery} onChange={(e) => setTitleQuery(e.target.value)} />
            </section>

            <section className="home-search">
                <label>Location</label>
                <input type="search" className="home-search" placeholder="Location" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} />
            </section>

            <select className="home-tags" name="tags" id="tags" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                <option value="">All Tags</option>
                {tags.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                ))}
            </select>

            {role !== "administrator" && (
                <select value={appliedFilter} className="home-tags" onChange={(e) => setAppliedFilter(e.target.value)}>
                    <option value="all">All Jobs</option>

                    {(role === "applicant" || role === "") && (
                        <>
                            <option value="applied">Applied</option>
                            <option value="not-applied">Not Applied</option>
                        </>
                    )}

                    {role === "company" && (
                        <>
                            <option value="mine">My Jobs</option>
                            <option value="not-mine">Other Jobs</option>
                        </>
                    )}
                </select>
            )}

            <button className="clear-filters-btn" onClick={ clearFilters }>
                Clear Filters
            </button>
        </header>
    );
}