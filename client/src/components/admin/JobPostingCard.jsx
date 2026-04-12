import { useEffect, useState } from "react";

export default function({jobPosting, setPostingToClose,xButtonSwitch, setEditJobsInfo, updateStatus,deletePopupSwitch, xButtonClousreSwitch}){
    //const [newStatus, setNewStatus] = useState(null);
    //useEffect(()=>{

    //},[newStatus])
    return(
        <section className="card-container">
            <h1 className="card-title">{jobPosting.title}</h1>
            <p className="card-body">Auhtor: {jobPosting.author}</p>
            <p className="card-body">Location: {jobPosting.location}</p>
            <select name="" id="" className="card-actions card-selector-admin" onChange={(e)=>{
                 const newStatus=e.target.value;
                if (newStatus === 'CLOSED') setPostingToClose(jobPosting);
                else updateStatus(jobPosting._id, newStatus);
                  }} value={jobPosting.status}>
                <option value="ACTIVE">Active</option>
                <option value="UNPUBLISHED">Unpublished</option>
                <option value="CLOSED">Closed</option>
            </select>
            <button className="card-actions card-admin-button" onClick={() => {
                setEditJobsInfo(jobPosting);
                xButtonSwitch();
            }}>Edit</button>
            <button className="card-actions card-admin-button" onClick={() => {
                setEditJobsInfo(jobPosting);
                deletePopupSwitch();
                }}>Delete</button>
        </section>
)
}