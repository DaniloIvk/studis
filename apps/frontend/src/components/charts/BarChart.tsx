import { Bar } from 'react-chartjs-2';

interface BarChartProps {
	title: string;
	labels: string[];
	data: number[];
	color?: string;
}

function BarChart({ title, labels, data, color = 'rgba(99, 102, 241, 0.8)' }: BarChartProps) {
	const chartData = {
		labels,
		datasets: [
			{
				data,
				backgroundColor: color,
				borderRadius: 6,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			title: {
				display: true,
				text: title,
				font: { size: 16, weight: 'bold' as const },
				color: '#6366f1',
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: { precision: 0 },
			},
		},
	};

	return (
		<div className="h-64 w-full">
			<Bar data={chartData} options={options} />
		</div>
	);
}

export default BarChart;
