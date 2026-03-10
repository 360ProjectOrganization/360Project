import "../company-portal/CompanyPortal.css";
import "../home/Home.css";

export default function HomeSearchBar({ titleQuery, setTitleQuery, locationQuery, setLocationQuery, selectedTag, setSelectedTag, appliedFilter, setAppliedFilter}) {
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

            {/* TODO: add a filter for applied and not applied jobs, maybe just a toggle */}

            <select className="home-tags" name="tags" id="tags" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                <option value="">All Tags</option>
                <option value="tag1">bro1</option>
                <option value="tag2">bro2</option>
                <option value="tag3">bro3</option>
            </select>

            <select value={appliedFilter} onChange={(e) => setAppliedFilter(e.target.value)}>
                <option value="all">All Jobs</option>
                <option value="applied">Applied</option>
                <option value="not-applied">Not Applied</option>
            </select>
        </header>
    );
}