import { useEffect, useState } from "react"
import { applicantApi } from "../../utils/api";

export default function FindUsers({filterType, filter}){
    const [filteredCards, setFilteredCards] = useState();
    useEffect(() => {
        const response = applicantApi.getAll();
        
    }, [filteredCards]);

    return(
        <section>
            
        </section>
    )
}