import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler,
} from 'chart.js';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimelineDataPoint {
  month: string;
  count: number;
  cumulative: number;
  molecules: Array<{ id: number; name: string; family: string | null }>;
}

interface ResearchTimelineChartProps {
  data: TimelineDataPoint[];
}

export function ResearchTimelineChart({ data }: ResearchTimelineChartProps) {
  const [viewMode, setViewMode] = useState<'cumulative' | 'new'>('cumulative');

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border border-border">
        <p className="text-muted-foreground text-sm">
          Aucune donnée temporelle disponible
        </p>
      </div>
    );
  }

  // Format month labels (YYYY-MM → MMM YYYY)
  const labels = data.map(d => {
    const [year, month] = d.month.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: viewMode === 'cumulative' ? 'Molécules cumulées' : 'Nouveaux ajouts',
        data: viewMode === 'cumulative' ? data.map(d => d.cumulative) : data.map(d => d.count),
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: viewMode === 'cumulative' ? 5 : 1,
          font: {
            size: 11,
          },
        },
        title: {
          display: true,
          text: viewMode === 'cumulative' ? 'Nombre total de molécules' : 'Nouveaux ajouts',
          font: {
            size: 12,
            weight: 'bold',
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
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const dataIndex = context.dataIndex;
            const dataPoint = data[dataIndex];
            
            if (viewMode === 'cumulative') {
              return `Total: ${dataPoint.cumulative} molécules`;
            } else {
              return `+${dataPoint.count} molécule${dataPoint.count > 1 ? 's' : ''}`;
            }
          },
          afterLabel: function(context) {
            const dataIndex = context.dataIndex;
            const dataPoint = data[dataIndex];
            
            if (dataPoint.molecules.length > 0) {
              const moleculeNames = dataPoint.molecules.slice(0, 3).map(m => m.name);
              if (dataPoint.molecules.length > 3) {
                moleculeNames.push(`+${dataPoint.molecules.length - 3} autres`);
              }
              return moleculeNames;
            }
            return [];
          },
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex justify-end gap-2">
        <Button
          variant={viewMode === 'cumulative' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('cumulative')}
        >
          Cumulatif
        </Button>
        <Button
          variant={viewMode === 'new' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('new')}
        >
          Nouveaux ajouts
        </Button>
      </div>

      {/* Chart */}
      <div className="h-[350px] w-full">
        <Line data={chartData} options={options} />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{data[data.length - 1]?.cumulative || 0}</p>
          <p className="text-xs text-muted-foreground">Total molécules</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{data.length}</p>
          <p className="text-xs text-muted-foreground">Mois actifs</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {data.length > 0 ? safeToFixed(data[data.length - 1].cumulative / data.length, 1) : 0}
          </p>
          <p className="text-xs text-muted-foreground">Molécules/mois</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {Math.max(...data.map(d => d.count))}
          </p>
          <p className="text-xs text-muted-foreground">Record mensuel</p>
        </div>
      </div>
    </div>
  );
}
