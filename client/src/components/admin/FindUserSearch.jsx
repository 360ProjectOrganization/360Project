export default function({setFilter,setFilterType}){
    const changeFilterType = ((e)=>{
        setFilterType(e.target.value);
    })
    const changeFilter = ((e)=>{
        console.log(e.target.value)
        setFilter(e.target.value);
    })
    return(
        <section>
            <label htmlFor="">Search By:</label>
            <select name="" id="" onChange={changeFilterType}>
                <option value="name">Username</option>
                <option value="type">Type</option>
            </select>
            <input type="text" name="" id="searchTextInput" placeholder="..." onChange={changeFilter}/>
        </section>
    )
}