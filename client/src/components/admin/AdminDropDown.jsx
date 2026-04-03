export default function AdminDropDown({setPage, setWhichAnalyticsData, setFilterType}){
    const changePage = (e=>{
        if(e.target.value === "Find Users" ){
            setPage("Find Users");
            setFilterType("name");
        }else if(e.target.value === "New Admin"){
            setPage("New Admin");
        }else if(e.target.value === "Analytics"){
            setPage("Analytics");
            setWhichAnalyticsData("jobPostings");
        }
    });
    return(
        <section>
            <select onChange={changePage} className="selectors-admin">
                <option value="Find Users">Find Users</option>
                <option value="New Admin">New Admin</option>
                <option value="Analytics">Analytics</option>
            </select>
        </section>
    )
}