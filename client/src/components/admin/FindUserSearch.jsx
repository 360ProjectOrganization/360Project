export default function(setFilter,setFilterType){
    return(
        <section>
            <label htmlFor="">Search By:</label>
            <select name="" id="">
                <option value="Username">Username</option>
                <option value="Type">Type</option>
            </select>
            <input type="text" name="" id="searchTextInput" placeholder="..."/>
        </section>
    )
}