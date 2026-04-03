import { useEffect, useState } from "react"
import "../admin.css"
import { adminApi } from "../../../utils/api";
import JobPostings from "./JobPostings";
import NumberOfUsers from "./NumberOfUsers";
export default function Analytics({whichAnalyticsData}){
    const [numJobPostings, setNumJobPostings] = useState(0);
    const [jobFillRate, setJobFillRate] = useState(0);
    const [numUsersByDate, setNumUsersByDate] = useState([]);
    const [userNumber, setUserNumber] = useState(0);
    const [jobPostingsByDate, setJobPostingsByDate] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminAccountsByDate, setAdminAccountsByDate] = useState([]);
    const [companyAccountsByDate, setCompanyAccountsByDate] = useState([]);
    const [applicantAccountsByDate, setApplicantAccountsByDate] = useState([]);
    useEffect(() => {
        const fetchAnalytics = async () => {
          try {
            const data = await adminApi.getAllCompanyAnalytics();
            setNumJobPostings(data.numJobPostings);
            setJobFillRate(data.jobFillRate);
            setUserNumber(data.numUsers);
            setJobPostingsByDate(data.jobPostingsByDate);
            setNumUsersByDate(data.allAccountsByDate);
            setAdminAccountsByDate(data.adminAccountsByDate);
            setCompanyAccountsByDate(data.companyAccountsByDate);
            setApplicantAccountsByDate(data.applicantAccountsByDate);
            setLoading(false);  
            console.log(data)

          } catch (err) {
            console.error("Error fetching analytics:", err);
          }}
        fetchAnalytics();
    }, [])

    return(
        <>
         {!loading && whichAnalyticsData === "jobPostings" && (<JobPostings jobPostingsByDate={jobPostingsByDate} numJobPostings={numJobPostings}/>)}
         {!loading && whichAnalyticsData === "numUsers" && (<NumberOfUsers usersByDate={
          {numUsersByDate: numUsersByDate,
            adminAccountsByDate: adminAccountsByDate,
            companyAccountsByDate: companyAccountsByDate,
            applicantAccountsByDate: applicantAccountsByDate
          }} numUsers={{userNumber}}/>)}
        </>
    )
}