import { useState } from "react";
import AdminDropDown from "./AdminDropDown";
import FindUserSearch from "./FindUserSearch";

export default function AdminHandler(){
    const[page, setPage] = useState("Find Users");
    const[filterType, setFilterType] = useState("Username")
    const[filter, setFilter] = useState();

    return(
        <section>
            <section>
                <AdminDropDown setPage={setPage}/>
                {page === "Find Users"&& (<FindUserSearch setFilter = {setFilter} setFilterType={setFilterType}/>)}
            </section>
            
        </section>
    )
}