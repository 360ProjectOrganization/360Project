import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "../../admin.css"
import { useEffect, useRef, useState } from "react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export default function BarChart({barTitle, data, xAxisLabels, dataNames}) {
    const barColors = ["#7b4a2e", "#383533","#1c1a19", "#b9713a"]
    function setUpDataHelper(dataArray, dates, diag=false){
        //console.log("data:",dataArray)
        let result = [];
        let i = 0;
        let x = 0
        while(i < dates.length){
            if(diag)console.log(dates)
            if(diag && x < dataArray.length) console.log("data:",dataArray[x].date,"date:",dates[i]," ",dataArray[x].date< dates[i])
            if(x < dataArray.length && (dataArray[x].date ===dates[i])){
                result.push(dataArray[x].count);
                x++;
                i++;
            } else if(x < dataArray.length && (dataArray[x].date < dates[i])){
                console.log("added a 0")
                result.push(0);
                i++;
            }
            if(x >= dataArray.length || (dataArray[x].date > dates[i])){
                result.push(0);
                i++
            }

        }
        ////console.log("result",result)
        return result;
    }
    // This is terrible but it works and I don't have time to make it better...
    const setUpData = (diag=false) => {
        let datasets = [];
        let i = 0;
        const keys = Object.keys(data);
        if(diag){
            console.log("xAxisLabels in BarChart:", xAxisLabels);  // ADD
            console.log("data in BarChart:", data);}                // ADD
        while( i < keys.length){
            let dates = xAxisLabels;
            const helperResult = setUpDataHelper(
      data[keys[i]].filter(row => row.date !== null).sort((a, b) => new Date(a.date) - new Date(b.date)), 
      dates,diag
    );
     if(diag) console.log(`dataset ${keys[i]}:`, helperResult);   // ADD
            datasets.push({
                label: dataNames[i],
                data: setUpDataHelper(data[keys[i]].filter(row => row.date !== null).sort((a, b) => new Date(a.date) - new Date(b.date)), dates)
                ,
                backgroundColor: barColors[i % barColors.length],
                hidden: i > 0,
                id: `${dataNames[i]}-${xAxisLabels[0]}-${xAxisLabels[xAxisLabels.length - 1]}`
            });
            i++;
        }
        return datasets;
    }
    const [chartData, setChartData] = useState({
        labels: xAxisLabels, // x axis data
        datasets: setUpData() // y axis data
    });
    useEffect(()=>{
        console.log("ran use effect", setUpData(true))
        setChartData({
        labels: xAxisLabels, // x axis data
        datasets: setUpData() // y axis data
    });
    },[data, xAxisLabels])

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        legend: { position: "top",
            onHover: (event, legendItem, legend) => {
                const canvas = legend.chart.canvas;
                canvas.style.cursor = 'pointer';
            },
            onLeave: (event, legendItem, legend) => {
                const canvas = legend.chart.canvas;
                canvas.style.cursor = 'default';
            }

        },
        maintainAspectRatio: false,
        resizeDelay: 0,
        title: { display: true, text: barTitle, font: {font: "Source Serif Pro, Georgia, serif", size: 20}, color: "#383533" },
        },
    };

    return (
        <div className="barChart-wrapper">
            <div key={xAxisLabels.join(",")} className="barChart-container">
                <Bar data={chartData} options={options}  redraw key={JSON.stringify(chartData) + JSON.stringify(options)} />
            </div>
        </div>
        );
}