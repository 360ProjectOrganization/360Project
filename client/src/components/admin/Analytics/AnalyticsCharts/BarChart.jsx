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
export default function BarChart({barTitle, data}) {
    const dataForGraph = {
        labels: data.map(row => row.date), // x axis data
        datasets: [
        {
            label: barTitle,
            data: data.map(row => row.count), //y axis data
            backgroundColor: "#7b4a2e",
        },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
        legend: { position: "top" },
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