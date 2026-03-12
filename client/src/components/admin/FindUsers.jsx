import { useEffect, useState } from "react"
import { applicantApi, companyApi } from "../../utils/api";
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
            const allUsers = [...applicantUsers, ...companyUsers];
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
        setFilteredCards(allCards);
        return;
    }

    setFilteredCards(
        allCards.filter((user)=>
           user[filterType]?.toLowerCase().includes(filter.toLowerCase())
        )
    );
}, [filter, filterType, allCards]);
    return(
        <>
            {!loading&& (<section className="job-postings-layout">
                {filteredCards.map((card)=>(
                    <UserCard key ={card.id} id = {card.id} name = {card.name} type= {card.type} status = {"active"}/>
                    ))}
            </section>)}
            {filteredCards.length === 0 && (<p>No Users match your search. </p>)}
            {loading && (<p>Loading....</p>)}
        </>
    )
}