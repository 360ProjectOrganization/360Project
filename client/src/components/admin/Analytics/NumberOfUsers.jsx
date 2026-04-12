import { useState } from "react";
import BarChart from "./AnalyticsCharts/BarChart";
import StatCard from "./StatCard";
import SetDateForAnalytics from "./SetDateForAnalytics";

export default function NumberOfUsers({usersByDate, numUsers}){
    const [dateRange, setDateRange] = useState([]);
    return(
        <>
            <StatCard label="Total Users" value={numUsers}/>
            <SetDateForAnalytics setDatesRange={setDateRange}/>
            <BarChart barTitle="Number of Users" data={usersByDate} xAxisLabels={ usersByDate.numUsersByDate} dataNames={["Number of All Users","Admin Accounts","Company Accounts","Applicant Accounts"]}/>
        </>
    )
}