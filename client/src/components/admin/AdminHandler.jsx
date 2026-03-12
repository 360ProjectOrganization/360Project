import { useState } from "react";
import AdminDropDown from "./AdminDropDown";
import CreateNewAdminForm from "./CreateNewAdminForm"
import FindUserSearch from "./FindUserSearch";
import FindUsers from "./FindUsers";
import Analytics from "./Analytics"

export default function AdminHandler(){
    const[page, setPage] = useState("Find Users");
    const[filterType, setFilterType] = useState("name")
    const[filter, setFilter] = useState("");
    const [loading, setLoading] = useState(true);
    return(
        <section>
            <section>
                
                <AdminDropDown setPage={setPage}/>
                {page === "Find Users" && loading === false && (<FindUserSearch setFilter = {setFilter} setFilterType={setFilterType}/>)}
            </section>
            <section>
                {page === "Find Users"&& (<FindUsers filter = {filter} filterType={filterType}  setFilter = {setFilter} setFilterType={setFilterType} loading={loading} setLoading={setLoading}/>)}
                {page === "New Admin"&& (<CreateNewAdminForm/>)}
                {page === "Analytics"&& (<Analytics/>)}
            </section>
            
        </section>
    )
}