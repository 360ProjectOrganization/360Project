

export default function HomeSearchBar() {
    return (
        <header className="home-header">
            <label>Job Title</label>
            <input type="search" className="home-search" placeholder="Job Title" />

            <label>Location</label>
            <input type="search" className="home-search" placeholder="Location" />

            <select name="tags" id="tags">
                <option value="tag1">Tag1</option>
                <option value="tag2">Tag2</option>
                <option value="tag3">Tag3</option>
            </select>
        </header>
    );
}