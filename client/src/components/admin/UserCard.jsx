export default function UserCard({id,name,type,status}){
    return(
        <section className="card-container">
            <h1 className="card-title">{name}</h1>
            <p className="card-body">Type: {type}</p>
            <select name="" id="" className="card-actions">
                <option value="active">active</option>
                <option value="inactive">inactive</option>
            </select>
            <button className="card-actions">Edit</button>
            <button className="card-actions">Delete</button>
        </section>
    )
}