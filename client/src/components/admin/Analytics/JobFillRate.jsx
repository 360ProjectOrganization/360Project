import { Pie } from "react-chartjs-2";
import PieChart from "./AnalyticsCharts/PieChart";

export default function JobFillRate({jobFillRate}){

    return(<PieChart pieChartTitle="Job Posting Fill Rate" chartData={jobFillRate} chartLabels={["Filled Closed Job Posting","Unfilled Closed Job Posting"]} chartBackgroundColor={[ "rgb(54, 235, 54)", "rgb(255, 99, 132)"]}/>);
}