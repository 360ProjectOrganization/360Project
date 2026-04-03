import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
//https://react-chartjs-2.js.org/examples/pie-chart
ChartJS.register(ArcElement, Tooltip, Legend);
export default function PieChart({pieChartTitle,chartData, chartLabels, chartBackgroundColor}) {
    const data = {
    labels: chartLabels,
    datasets: [{
        data: chartData,
        backgroundColor: chartBackgroundColor,
        borderWidth: 1,
        hoverOffset: 4
    }]
    };
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            datalabels: {
                color: '#fff',
                font: {
                    weight: 'bold',
                    size: 16
                },
                formatter: (value, context) => {
                    // Calculate total
                    const dataPoints = context.chart.data.datasets[0].data;
                    const total = dataPoints.reduce((total, val) => total + val, 0);
                    
                    // Prevent division by zero if data is empty
                    if (total === 0) return "0%";
                    
                    return ((value * 100) / total).toFixed(1) + "%"; 
                },
                anchor: 'center',
                align: 'center',
            },
            legend: { position: "top" },
            title: { display: true, text: pieChartTitle, font: {font: "Source Serif Pro, Georgia, serif", size: 20}, color: "#383533" },
        },
    };
    return(
            <div className="pieChart-container">
                <Pie data={data} options={options} plugins={[ChartDataLabels]}/>;
            </div>

    )
}