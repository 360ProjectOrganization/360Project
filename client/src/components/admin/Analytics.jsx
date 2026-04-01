import { useEffect, useState } from "react"
import "./admin.css"
import { adminApi } from "../../utils/api";
export default function Analytics(){
    const [jobPostings, setJobPostings] = useState(0);
    const [jobFillRate, setJobFillRate] = useState(0);
    const [userNumber, setUserNumber] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchAnalytics = async () => {
          try {
            const data = await adminApi.getAllCompanyAnalytics();
            setJobPostings(data.numJobPostings);
            setJobFillRate(data.jobFillRate);
            setUserNumber(data.numUsers);
            setLoading(false);  

          } catch (err) {
            console.error("Error fetching analytics:", err);
          }}
        fetchAnalytics();
    }, [])

    return(
        <>
            {!loading &&(
                <section className="analytics">
            <h1><span style={{ color: userNumber < 100 ? 'red' : 'green' }}>{userNumber}</span> <br />Users</h1>
            <h1><span style={{ color: jobPostings < 50 ? 'red' : 'green' }}>{jobPostings}</span><br />Job Postings</h1>
            <h1><span style={{ color: jobFillRate < 50 ? 'red' : 'green' }}>{jobFillRate}%</span> <br />Job Fill Rate</h1>
            </section>
             )}
        </>
    )
}