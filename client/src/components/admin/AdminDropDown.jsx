export default function AdminDropDown({setPage, setWhichAnalyticsData, setFilterType, pageToView}){
    const changePage = (e=>{
        if(e.target.value === "Find Users" ){
            setPage("Find Users");
            setFilterType("name");
        }else if(e.target.value === "New Admin"){
            setPage("New Admin");
        }else if(e.target.value === "Analytics"){
            setPage("Analytics");
            setWhichAnalyticsData("jobPostings");
        }else if (e.target.value === "Job Postings"){
            setPage("Job Postings");
            setFilterType("title");
        }
    });
    return(
        <section>
            <select onChange={changePage} className="selectors-admin" defaultValue={pageToView}>
                <option value="Find Users">Find Users</option>
                <option value="New Admin">New Admin</option>
                <option value="Analytics">Analytics</option>
                <option value="Job Postings">Job Postings</option>
            </select>
        </section>
    )
}