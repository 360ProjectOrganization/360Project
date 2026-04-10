import { adminApi } from "../../utils/api"

export default function UserCard({id,name,type,status, email, xButtonSwitch, setEditAccountInfo, updateStatus,deletePopupSwitch }){
    return(
        <section className="card-container">
            <h1 className="card-title">{name}</h1>
            <p className="card-body">Type: {type}</p>
            <p className="card-body">Email: {email}</p>
            <select name="" id="" className="card-actions card-selector-admin" onChange={(e)=>updateStatus(id, type, e.target.value)} defaultValue={status}>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
            </select>
            <button className="card-actions card-admin-button" onClick={() => {
                setEditAccountInfo({id, name, type, email});
                xButtonSwitch();
            }}>Edit</button>
            <button className="card-actions card-admin-button" onClick={() => {
                setEditAccountInfo({id, name, type, email})
                deletePopupSwitch();
                }}>Delete</button>
        </section>
    )
}