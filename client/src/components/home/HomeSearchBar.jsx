import "../company-portal/CompanyPortal.css";
import "../home/Home.css";

export default function HomeSearchBar({ role, titleQuery, setTitleQuery, locationQuery, setLocationQuery, selectedTag, setSelectedTag, appliedFilter, setAppliedFilter, dateSort, setDateSort, tags}) {
    const clearFilters = () => {
        setTitleQuery("");
        setLocationQuery("");
        setSelectedTag("");
        setAppliedFilter("all");
        setDateSort("newest");
    };
    
    return (
        <header className="subnav-container home-filter-bar">
            <section className="home-search-field">
                <label>Search</label>
                <input type="search" className="home-search-input" placeholder="Job title" value={titleQuery} onChange={(e) => setTitleQuery(e.target.value)} />
            </section>

            <section className="home-search-field">
                <label>Location</label>
                <input type="search" className="home-search-input" placeholder="City, remote, hybrid" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} />
            </section>

            <section className="home-search-field">
                <label>Tags</label>
                <select className="home-filter-select" name="tags" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                    <option value="">All tags</option>
                    {tags.map((tag) => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
            </section>

            <section className="home-search-field">
                <label>Posted</label>
                <select className="home-filter-select" value={dateSort} onChange={(e) => setDateSort(e.target.value)}>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                </select>
            </section>

            {role !== "administrator" && (
                <section className="home-search-field">
                    <label>Jobs</label>
                    <select className="home-filter-select" value={appliedFilter} onChange={(e) => setAppliedFilter(e.target.value)}>
                        <option value="all">All jobs</option>

                        {(role === "applicant" || role === "") && (
                            <>
                                <option value="applied">Applied</option>
                                <option value="not-applied">Not applied</option>
                            </>
                        )}

                        {role === "company" && (
                            <>
                                <option value="mine">My jobs</option>
                                <option value="not-mine">Other jobs</option>
                            </>
                        )}
                    </select>
                </section>
            )}

            <div className="home-filter-clear">
                <button type="button" className="clear-filters-btn" onClick={clearFilters}>Clear filters</button>
            </div>
        </header>
    );
}