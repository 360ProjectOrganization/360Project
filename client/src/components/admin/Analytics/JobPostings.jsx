import BarChart from "./AnalyticsCharts/BarChart";
import StatCard from "./StatCard";
export default function JobPostings({jobPostingsByDate, numJobPostings}){
    return(
        <>
            <StatCard label="Total Job Postings" value={numJobPostings}/>
            <BarChart barTitle="Job Postings" data={jobPostingsByDate} xAxisLabels ={jobPostingsByDate.jobPostingsByDate} dataNames={["Job Postings"]} />
        </>
    )
}
