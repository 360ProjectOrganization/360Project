import "../company-portal/CompanyPortal.css";
import "../home/Home.css";

export default function HomeSearchBar() {
    return (
        <header className="subnav-container">
            <section className="home-search">
                <label>Job Title</label>
                <input type="search" className="home-search" placeholder="Job Title" />
            </section>

            <section className="home-search">
                <label>Location</label>
                <input type="search" className="home-search" placeholder="Location" />
            </section>

            {/* TODO: add a filter for applied and not applied jobs, maybe just a toggle */}

            <select className="home-tags" name="tags" id="tags">
                <option value="tag1">bro1</option>
                <option value="tag2">bro2</option>
                <option value="tag3">bro3</option>
            </select>
        </header>
    );
}