import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Molecule {
  id: number;
  name: string;
  family: string | null;
}

interface FamilyPieChartProps {
  molecules: Molecule[];
}

// Color palette for chemical families
const familyColors = [
  'rgba(59, 130, 246, 0.8)',   // blue
  'rgba(239, 68, 68, 0.8)',    // red
  'rgba(34, 197, 94, 0.8)',    // green
  'rgba(251, 146, 60, 0.8)',   // orange
  'rgba(139, 92, 246, 0.8)',   // purple
  'rgba(236, 72, 153, 0.8)',   // pink
  'rgba(14, 165, 233, 0.8)',   // sky
  'rgba(132, 204, 22, 0.8)',   // lime
];

export function FamilyPieChart({ molecules }: FamilyPieChartProps) {
  // Count molecules by family
  const familyCounts = molecules.reduce((acc, m) => {
    const family = m.family || 'Non spécifiée';
    acc[family] = (acc[family] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const families = Object.keys(familyCounts);
  const counts = Object.values(familyCounts);

  if (families.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border border-border">
        <p className="text-muted-foreground text-sm">
          Aucune donnée de famille chimique disponible
        </p>
      </div>
    );
  }

  const data = {
    labels: families,
    datasets: [
      {
        label: 'Nombre de molécules',
        data: counts,
        backgroundColor: familyColors.slice(0, families.length),
        borderColor: familyColors.slice(0, families.length).map(c => c.replace('0.8', '1')),
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
    <div className="h-[400px] w-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
