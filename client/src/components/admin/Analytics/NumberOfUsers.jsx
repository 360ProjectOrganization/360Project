import BarChart from "./AnalyticsCharts/BarChart";
import StatCard from "./StatCard";

export default function NumberOfUsers({usersByDate, numUsers}){

    return(
        <>
            <StatCard label="Total Users" value={numUsers}/>
            <BarChart barTitle="Number of Users" data={usersByDate} xAxisLabels={usersByDate.numUsersByDate} />
        </>
    )
}