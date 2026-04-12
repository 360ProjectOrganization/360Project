import { useMemo, useState } from "react";
import BarChart from "./AnalyticsCharts/BarChart";
import StatCard from "./StatCard";
import SetDateForAnalytics from "./SetDateForAnalytics";
export default function JobPostings({jobPostingsByDate, numJobPostings}){
        const [dateRange, setDateRange] = useState([]);
            const filteredData = useMemo(() => {
            //console.log("dateRange:", dateRange);
            //console.log("sample date from data:", usersByDate.numUsersByDate[0]?.date);
            //THIS IS A MESS BUT IT WORKS
            
            return Object.fromEntries(
                Object.entries(jobPostingsByDate).map(([key, records]) => [
                key,
                records.filter(record => dateRange.includes(record.date))
                ])
            );
        }, [dateRange, jobPostingsByDate]);
        //theres  a null hidden in the num jobPostings
    return(
        <>
            <StatCard label="Total Job Postings" value={numJobPostings-1}/>
            <SetDateForAnalytics setDatesRange={setDateRange}/>
            <BarChart key={`${dateRange.join(",")}`} barTitle={"Job Postings"} data={filteredData} xAxisLabels ={dateRange} dataNames={["Job Postings Created"]} />
        </>
    )
}