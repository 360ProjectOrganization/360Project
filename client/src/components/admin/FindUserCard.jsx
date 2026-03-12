export default function FindUserCard({id,name,type,status}){
    return(
        <section className="find-user-card">
            <h1>{name}</h1>
            <p>Type: {type}</p>
            <select name="" id="">
                <option value="active">active</option>
                <option value="inactive">inactive</option>
            </select>
            <button>Edit</button>
            <button>Delete</button>
        </section>
    )
}