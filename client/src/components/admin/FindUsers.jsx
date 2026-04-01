import { useEffect, useState } from "react"
import { adminApi, applicantApi, companyApi, getAuthUser } from "../../utils/api";
import UserCard from "./UserCard";
import "../common/Card.css"

export default function FindUsers({filterType, filter, loading, setLoading}){
    const [filteredCards, setFilteredCards] = useState([]);
    const [allCards, setAllCards] = useState([]);
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
            setAllCards(allUsers)
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
        console.log("delete user", id, type);
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
        }catch(e){
            console.log("Error",e);
        }

    }
    return(
        <>
            {!loading&& (<section className="job-postings-layout">
                {filteredCards.map((card)=>(
                    <UserCard key ={card._id} id = {card._id} name = {card.name} type= {card.type} status = {"active"} deleteUser={deleteUser}/>
                    ))}
            </section>)}
            {filteredCards.length === 0 && (<p>No Users match your search. </p>)}
            {loading && (<p>Loading....</p>)}
        </>
    )
}