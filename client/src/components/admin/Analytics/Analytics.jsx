import { useEffect, useState } from "react"
import "../admin.css"
import { adminApi } from "../../../utils/api";
import JobPostings from "./JobPostings";
import NumberOfUsers from "./NumberOfUsers";
import JobFillRate from "./JobFillRate";
export default function Analytics({whichAnalyticsData}){
    const [numJobPostings, setNumJobPostings] = useState(0);
    const [numUsersByDate, setNumUsersByDate] = useState([]);
    const [numJobFilled, setNumJobFilled] = useState(0);
    const [numJobUnfilled, setNumJobUnfilled] = useState(0);
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
            setUserNumber(data.numUsers);
            setJobPostingsByDate(data.jobPostingsByDate);
            setNumUsersByDate(data.allAccountsByDate);
            setAdminAccountsByDate(data.adminAccountsByDate);
            setCompanyAccountsByDate(data.companyAccountsByDate);
            setNumJobFilled(data.filledJobs);
            setNumJobUnfilled(data.unfilledJobs);
            setApplicantAccountsByDate(data.applicantAccountsByDate);

            setLoading(false);  

          } catch (err) {
            console.error("Error fetching analytics:", err);
          }}
        fetchAnalytics();
    }, [])

    return(
        <>
         {!loading && whichAnalyticsData === "jobPostings" && (<JobPostings jobPostingsByDate={{jobPostingsByDate: jobPostingsByDate}} numJobPostings={numJobPostings}/>)}
         {!loading && whichAnalyticsData === "numUsers" && (<NumberOfUsers usersByDate={
          {numUsersByDate: numUsersByDate,
            adminAccountsByDate: adminAccountsByDate,
            companyAccountsByDate: companyAccountsByDate,
            applicantAccountsByDate: applicantAccountsByDate
          }} numUsers={userNumber}/>)}
          {!loading && whichAnalyticsData === "jobFillRate" && (<JobFillRate jobFillRate={[numJobFilled, numJobUnfilled]}/>)}
        </>
    )
}