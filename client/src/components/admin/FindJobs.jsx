import { useEffect, useState } from "react"
import { adminApi,jobPostingApi } from "../../utils/api";
import "../common/Card.css"
import DeletePopup from "./DeletePopup";
import JobPostingCard from "./JobPostingCard";
import EditJobs from "./EditJobs";
import CloseStatus from "../company-portal/CloseStatus";
export default function FindJobs({filterType, filter, loading, setLoading}){
        const [filteredCards, setFilteredCards] = useState([]);
        const [allCards, setAllCards] = useState([]);
        const [xButton, setXButton] = useState(true);
        const [xButtonClousre, setXButtonClousre] = useState(true);
        const [editJobsInfo, setEditJobsInfo] = useState({});
        const [deletePopup, setDeletePopup] = useState(false);
        const [eventForClousre, setEventForClousre] = useState(false);
        const [postingToClose, setPostingToClose] = useState(null);
        const xButtonSwitch = (()=>{
            setXButton((prev)=>!prev);
        })
        const deletePopupSwitch = (()=>{
            setDeletePopup((prev)=>!prev);
        })
        const xButtonClousreSwitch = (()=>{
            setXButtonClousre((prev)=>!prev);
        });
        //Load all users into allCards and filteredCards
        useEffect(() => {
            const loadData = (async ()=>{
                try{
                const response = await jobPostingApi.getAll();
                setFilteredCards(response);
                setAllCards(response);
                console.log("Loaded jobs:", response);
                setLoading(false);
            }catch(e){
                console.log("Error",e);
            }
            })
            loadData();
        }, []);
    
    
    
        //Search allCards for all the includes in filter based on filterType
        useEffect(()=>{
                if(!filter){
                setFilteredCards(allCards);
                return;
            }
            setFilteredCards(
                allCards.filter((user)=>
                user[filterType]?.toLowerCase().includes(filter.toLowerCase())
                )
            );
        
        }, [filter, filterType, allCards]);
        const deleteJob = async(id) => {
            console.log("Deleting Job with id:", id);
            const updated = allCards.filter((job) => job._id !== id);
            setAllCards(updated);
            setFilteredCards(updated);
            try{
                await jobPostingApi.delete(id);
                deletePopupSwitch();
            }catch(e){
                console.log("Error",e);
            }
    
        }
        const handleStatusChange = async (jobId, newStatus, closureReason) => {
        try {
            console.log(jobId,newStatus)
            console.log(closureReason)
            await jobPostingApi.updateStatus(jobId, newStatus, closureReason);
            const newCards = allCards.map((prev) =>
                (prev._id === jobId ? { ...prev, status: newStatus, ...(newStatus === "CLOSED" && closureReason ? { closureReason } : {}) } : prev)
            );
            console.log(newCards)
            setAllCards(newCards);
            setFilteredCards(newCards);
        }
        catch (err) {
            console.error("Failed to update status:", err);
        }
        };
        return(
            <>
                {!loading&& (<section className="job-postings-layout">
                    {filteredCards.map((card)=>(
                        <JobPostingCard key ={card._id} jobPosting={card} deletePopupSwitch={deletePopupSwitch} xButtonSwitch ={xButtonSwitch} setEditJobsInfo = {setEditJobsInfo}
                        updateStatus = {handleStatusChange} xButtonClousreSwitch={xButtonClousreSwitch} setPostingToClose ={setPostingToClose}
                        />
                        ))}
                </section>)}
                {!xButton &&editJobsInfo&&(<EditJobs setXButton={xButtonSwitch}  jobDetails={editJobsInfo} allCards={allCards} setAllCards={setAllCards} setFilteredCards={setFilteredCards}/>)}
                <CloseStatus postingToClose={postingToClose} onClose={() => setPostingToClose(null)} onClosePosting={(jobId, closureReason) => handleStatusChange(jobId, "CLOSED", closureReason)} />
                {deletePopup && (<DeletePopup deletePopupSwitch={deletePopupSwitch} deleteFunction={()=>deleteJob(editJobsInfo._id)}/>)}
                {filteredCards.length === 0 && (<p>No Users match your search. </p>)}
                {loading &&(<p>Loading....</p>)}
            </>
        )
}