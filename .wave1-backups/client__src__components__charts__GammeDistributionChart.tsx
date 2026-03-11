// @ts-nocheck
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GammeDistribution {
  gamme: string;
  count: number;
}

interface GammeDistributionChartProps {
  data: GammeDistribution[];
}

// Gamme colors
const gammeColors: Record<string, string> = {
  'pétrichor': 'rgba(59, 130, 246, 0.8)',
  'volcanique': 'rgba(239, 68, 68, 0.8)',
  'glaciaire': 'rgba(96, 165, 250, 0.8)',
  'bio-lab': 'rgba(34, 197, 94, 0.8)',
  'mossi': 'rgba(251, 146, 60, 0.8)',
};

export function GammeDistributionChart({ data }: GammeDistributionChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border border-border">
        <p className="text-muted-foreground text-sm">
          Aucune donnée de gamme disponible
        </p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(d => d.gamme.charAt(0).toUpperCase() + d.gamme.slice(1)),
    datasets: [
      {
        label: 'Nombre de molécules',
        data: data.map(d => d.count),
        backgroundColor: data.map(d => gammeColors[d.gamme] || 'rgba(139, 92, 246, 0.8)'),
        borderColor: data.map(d => (gammeColors[d.gamme] || 'rgba(139, 92, 246, 0.8)').replace('0.8', '1')),
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 11,
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const total = (data.datasets[0].data as number[]).reduce((a, b) => a + b, 0);
                const percentage = ((value as number / total) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: (Array.isArray(data.datasets[0].backgroundColor) ? data.datasets[0].backgroundColor[i] : data.datasets[0].backgroundColor) as string,
                  strokeStyle: (Array.isArray(data.datasets[0].borderColor) ? data.datasets[0].borderColor[i] : data.datasets[0].borderColor) as string,
                  lineWidth: 2,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} molécule${value > 1 ? 's' : ''} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-[350px] w-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}
