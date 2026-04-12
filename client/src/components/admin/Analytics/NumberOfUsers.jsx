import { useMemo, useState } from "react";
import BarChart from "./AnalyticsCharts/BarChart";
import StatCard from "./StatCard";
import SetDateForAnalytics from "./SetDateForAnalytics";

export default function NumberOfUsers({usersByDate, numUsers}){
    //console.log(usersByDate)
    const [dateRange, setDateRange] = useState([]);
    const filteredData = useMemo(() => {
    //console.log("dateRange:", dateRange);
    //console.log("sample date from data:", usersByDate.numUsersByDate[0]?.date);
    //THIS IS A MESS BUT IT WORKS
    
    return Object.fromEntries(
        Object.entries(usersByDate).map(([key, records]) => [
        key,
        records.filter(record => dateRange.includes(record.date))
        ])
    );
    }, [dateRange, usersByDate]);
    //console.log("dateRange:", dateRange);
    //console.log("filteredData:", filteredData);
    return(
        <>
            <StatCard label="Total Users" value={numUsers}/>
            <SetDateForAnalytics setDatesRange={setDateRange}/>
            <BarChart key={`${dateRange.join(",")}`} barTitle={"Number of Users"} data={filteredData} xAxisLabels={dateRange} dataNames={["Number of All Users","Admin Accounts","Company Accounts","Applicant Accounts"]}/>
        </>
    )
}