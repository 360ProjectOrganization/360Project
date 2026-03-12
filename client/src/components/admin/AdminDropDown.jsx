export default function AdminDropDown({setPage}){
    const changePage = (e=>{
        if(e.target.value === "Find Users" ){
            setPage("Find Users");
        }else if(e.target.value === "New Admin"){
            setPage("New Admin");
        }else if(e.target.value === "Analytics"){
            setPage("Analytics");
        }
    });
    return(
        <section>
            <h3>Admin Portal</h3>
            <select onChange={changePage}>
                <option value="Find Users">Find Users</option>
                <option value="New Admin">New Admin</option>
                <option value="Analytics">Analytics</option>
            </select>
        </section>
    )
}