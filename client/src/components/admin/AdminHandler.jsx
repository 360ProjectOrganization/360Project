import { useState } from "react";
import AdminDropDown from "./AdminDropDown";
import CreateNewAdminForm from "./CreateNewAdminForm"
import FindUserSearch from "./FindUserSearch";
import FindUsers from "./FindUsers";
import Analytics from "./Analytics/Analytics"
import "./admin.css"
import "../home/Home.css"
import FindJobs from "./FindJobs";

export default function AdminHandler(){
    const[page, setPage] = useState("Find Users");
    const[filterType, setFilterType] = useState("name")
    const[filter, setFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [whichAnalyticsData, setWhichAnalyticsData] = useState("jobPostings");

    const handleAnalyticsChange = (e) => {
        setWhichAnalyticsData(e.target.value);
    }
    return(
        <section>
            
            <section className="subnav-container-admin">
                <h2 className="master-text-admin">Admin Portal</h2>
                <AdminDropDown setPage={setPage} setWhichAnalyticsData ={setWhichAnalyticsData} setFilterType = {setFilterType}/>
                {page === "Find Users" && loading === false && (<FindUserSearch setFilter = {setFilter} setFilterType={setFilterType}
                fields = {[
                    {name: "Username", value:"name"},
                    {name:"Type", value:"type"},
                    {name: "Email", value:"email"}
                ]}
                />)}
                {page === "Job Postings" && loading === false && (<FindUserSearch setFilter = {setFilter} setFilterType={setFilterType}
                fields = {[
                    {name: "Title", value:"title"},
                    {name: "Author", value: "author"},
                    {name:"Status", value:"status"},
                    {name: "Location", value:"location"}
                ]}
                />)}
                {page === "Analytics" && loading === false && (
                     <section className="master-text-admin admin-selector-row-container">
                        <h3 htmlFor="analytics-select" >Select Analytics Data:</h3>
                        <select name="analytics-select" id="analytics-select" className="spacing-betteween-input-admin selectors-admin"onChange={handleAnalyticsChange}>
                            <option value="jobPostings">Job Postings</option>
                            <option value="jobFillRate">Job Posting Fill Rate</option>
                            <option value="numUsers">Number of Usters</option>
                        </select>
                    </section>

                )}
            </section>
            <section>
                {page === "Find Users"&& (<FindUsers filter = {filter} filterType={filterType}  setFilter = {setFilter} setFilterType={setFilterType} loading={loading} setLoading={setLoading}/>)}
                {page === "New Admin"&& (<CreateNewAdminForm/>)}
                {page === "Analytics"&& (<Analytics whichAnalyticsData={whichAnalyticsData}/>)}
                {page === "Job Postings"&& (<FindJobs filter={filter} filterType={filterType} setFilter = {setFilter} useFilterType = {setFilterType} loading = {loading} setLoading={setLoading}/>)}
            </section>
            
        </section>
    )
}