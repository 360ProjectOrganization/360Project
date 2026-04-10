import { useEffect, useState } from "react"
import { adminApi, applicantApi, authApi, companyApi, getAuthUser } from "../../utils/api";
import UserCard from "./UserCard";
import "../common/Card.css"
import EditAdmin from "./EditAdmin";
import DeletePopup from "./DeletePopup";

export default function FindUsers({filterType, filter, loading, setLoading}){
    const [filteredCards, setFilteredCards] = useState([]);
    const [allCards, setAllCards] = useState([]);
    const [xButton, setXButton] = useState(true);
    const [editAccountInfo, setEditAccountInfo] = useState({});
    const [deletePopup, setDeletePopup] = useState(false);
    const xButtonSwitch = (()=>{
        setXButton((prev)=>!prev);
    })
    const deletePopupSwitch = (()=>{
        setDeletePopup((prev)=>!prev);
    })
    //Load all users into allCards and filteredCards
    useEffect(() => {
        const loadData = (async ()=>{
            try{
            const applicantResponse = await applicantApi.getAll();
            const applicantUsers = applicantResponse.map((user)=>({
                ...user,
                type: "applicant"
            }));
            const companyResponse = await companyApi.getAll();
            const companyUsers = companyResponse.map((user)=>({
                ...user,
                type: "company"
            }));
            const adminResponse = await adminApi.getAllAdmins();
            const adminUsers = adminResponse.map((user)=>({
                ...user,
                type: "admin"
            }));
            const allUsers = [...applicantUsers, ...companyUsers, ...adminUsers];
            setFilteredCards(allUsers);
            setAllCards(allUsers);
            console.log("Loaded users:", allUsers);
            setLoading(false);
        }catch(e){
            console.log("Error",e);
        }
        })
        loadData();
    }, []);

    const updateStatus = async(id, type, status) => {
        try{
            await adminApi.changeUserStatus(type, id, status);
        }catch(e){
            console.log("Error",e);
        }
    }


    //Search allCards for all the includes in filter based on filterType
    useEffect(()=>{
            if(!filter){
            setFilteredCards(allCards.filter((user)=>user._id !==getAuthUser()._id));
            return;
        }

        setFilteredCards(
            allCards.filter((user)=>
            user[filterType]?.toLowerCase().includes(filter.toLowerCase())&&(user._id !==getAuthUser()._id)
            )
        );
    
    }, [filter, filterType, allCards]);
    const deleteUser = async(id, type) => {
        console.log("Deleting user with id:", id, "and type:", type);
        const updated = allCards.filter((user) => user._id !== id&& allCards.filter((user)=>user._id !==getAuthUser()._id));
        setAllCards(updated);
        setFilteredCards(updated);
        try{
            if(type === 'admin'){
                await adminApi.deleteAdmin(id);
            
            }
            else if(type === 'applicant'){
                await applicantApi.deleteAccount(id);
            }
            else if(type === 'company'){
                await companyApi.deleteAccount(id);
            }
            deletePopupSwitch();
        }catch(e){
            console.log("Error",e);
        }

    }
    return(
        <>
            {!loading&& (<section className="job-postings-layout">
                {filteredCards.map((card)=>(
                    <UserCard key ={card._id} id = {card._id}email={card.email} name = {card.name} type= 
                    {card.type} status = {card.status} deletePopupSwitch={deletePopupSwitch} xButtonSwitch ={xButtonSwitch} setEditAccountInfo = {setEditAccountInfo}
                    updateStatus = {updateStatus}
                    />
                    ))}
            </section>)}
            {!xButton &&editAccountInfo&&(<EditAdmin setXButton={xButtonSwitch}  userDetails={editAccountInfo} allCards={allCards} setAllCards={setAllCards} setFilteredCards={setFilteredCards}/>)}
            {deletePopup && (<DeletePopup deletePopupSwitch={deletePopupSwitch} deleteFunction={()=>deleteUser(editAccountInfo.id, editAccountInfo.type)}/>)}
            {filteredCards.length === 0 && (<p>No Users match your search. </p>)}
            {loading &&(<p>Loading....</p>)}
        </>
    )
}