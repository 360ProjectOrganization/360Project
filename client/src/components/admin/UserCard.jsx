import { adminApi } from "../../utils/api"

export default function UserCard({id,name,type,status, deleteUser}){
    return(
        <section className="card-container">
            <h1 className="card-title">{name}</h1>
            <p className="card-body">Type: {type}</p>
            <select name="" id="" className="card-actions card-selector-admin">
                <option value="active">active</option>
                <option value="inactive">inactive</option>
            </select>
            <button className="card-actions card-admin-button">Edit</button>
            <button className="card-actions card-admin-button" onClick={() => deleteUser(id, type)}>Delete</button>
        </section>
    )
}