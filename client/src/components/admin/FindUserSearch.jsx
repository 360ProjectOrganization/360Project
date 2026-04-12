export default function({setFilter,setFilterType, fields}){
    const changeFilterType = ((e)=>{
        setFilterType(e.target.value);
    })
    const changeFilter = ((e)=>{
        setFilter(e.target.value);
    })
    return(
        <section className="master-text-admin admin-selector-row-container">
            <h3>Search By:</h3>
            <select name="" id="" onChange={changeFilterType} className="spacing-betteween-input-admin selectors-admin">
                {fields.map((field)=>(
                    <option id ={field.value} value={field.value}>{field.name}</option>
                ))}
            </select>
            <input type="text" name="" id="searchTextInput" placeholder="..." onChange={changeFilter} className="spacing-betteween-input-admin input-box-admin"/>
        </section>
    )
}