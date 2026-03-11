import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FamilyDistribution {
  family: string | null;
  count: number;
}

interface FamilyRankingChartProps {
  data: FamilyDistribution[];
  topN?: number;
}

export function FamilyRankingChart({ data, topN = 10 }: FamilyRankingChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border border-border">
        <p className="text-muted-foreground text-sm">
          Aucune donnée de famille disponible
        </p>
      </div>
    );
  }

  // Sort by count and take top N
  const sortedData = [...data]
    .filter(d => d.family !== null)
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);

  const chartData = {
    labels: sortedData.map(d => d.family),
    datasets: [
      {
        label: 'Nombre de molécules',
        data: sortedData.map(d => d.count),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Nombre de molécules',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.x || 0;
            return `${value} molécule${value > 1 ? 's' : ''}`;
          },
        },
      },
    },
  };

  return (
    <div className="h-[350px] w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}
