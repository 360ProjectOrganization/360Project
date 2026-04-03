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
    function setUpDataHelper(dataArray, dates){
        let result = [];
        let i = 0;
        let x = 0
        while(i < dates.length){
            if(x < dataArray.length && (dataArray[x].date ===dates[i])){
                result.push(dataArray[x].count);
                x++;
            } else {
                result.push(0);
            }
            i++;
        }
        return result;
    }
    // This is terrible but it works and I don't have time to make it better...
    const setUpData = () => {
        let datasets = [];
        let i = 0;
        const keys = Object.keys(data);
        while( i < keys.length){
            let dates = xAxisLabels.map((label) => label.date).filter((date) => date !== null);
            dates.sort((a, b) => new Date(a) - new Date(b));
            datasets.push({
                label: dataNames[i],
                data: setUpDataHelper(data[keys[i]].filter(row => row.date !== null).sort((a, b) => new Date(a.date) - new Date(b.date)), dates)
                ,
                backgroundColor: barColors[i % barColors.length],
                hidden: i > 0
            });
            i++;
        }
        return datasets;
    }


    const dataForGraph = {
        labels: xAxisLabels.map((label) => label.date).sort((a, b) => new Date(a) - new Date(b)).filter((label)=>label !== null), // x axis data
        datasets: setUpData() // y axis data
    };

    const options = {
        responsive: true,
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
            <div className="barChart-container">
                <Bar data={dataForGraph} options={options} />
            </div>
        </div>
        );
}