import { adminApi } from "../../utils/api"

export default function UserCard({id,name,type,status, email, deleteUser, xButtonSwitch, setEditAccountInfo}){
    return(
        <section className="card-container">
            <h1 className="card-title">{name}</h1>
            <p className="card-body">Type: {type}</p>
            <p className="card-body">Email: {email}</p>
            <select name="" id="" className="card-actions card-selector-admin">
                <option value="active">active</option>
                <option value="inactive">inactive</option>
            </select>
            <button className="card-actions card-admin-button" onClick={() => {
                setEditAccountInfo({id, name, type, email});
                xButtonSwitch();
            }}>Edit</button>
            <button className="card-actions card-admin-button" onClick={() => deleteUser(id, type)}>Delete</button>
        </section>
    )
}