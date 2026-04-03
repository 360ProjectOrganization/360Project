import BarChart from "./AnalyticsCharts/BarChart";
import StatCard from "./StatCard";

export default function NumberOfUsers({usersByDate, numUsers}){
    console.log(usersByDate.numUsersByDate)
    console.log(usersByDate.adminAccountsByDate)
    console.log(usersByDate.companyAccountsByDate)
    console.log(usersByDate.applicantAccountsByDate)
    return(
        <>
            <StatCard label="Total Users" value={numUsers}/>
            <BarChart barTitle="Number of Users" data={usersByDate} xAxisLabels={ usersByDate.numUsersByDate} dataNames={["Number of All Users","Admin Accounts","Company Accounts","Applicant Accounts"]}/>
        </>
    )
}