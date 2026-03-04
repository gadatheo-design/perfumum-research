// @ts-nocheck
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { parseOlfactiveProfile, getDimensionLabel, SENSORY_DIMENSIONS } from '@/lib/olfactiveParser';
import { getGammeFromOlfactiveProfile } from '@/lib/gammeMapping';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Molecule {
  id: number;
  name: string;
  olfactiveProfile: string | null;
}

interface OlfactiveRadarChartProps {
  molecules: Molecule[];
}

// Gamme colors mapping (with transparency for radar)
const gammeColors: Record<string, { border: string; background: string }> = {
  'pétrichor': { 
    border: 'rgba(59, 130, 246, 1)', 
    background: 'rgba(59, 130, 246, 0.2)' 
  },
  'volcanique': { 
    border: 'rgba(239, 68, 68, 1)', 
    background: 'rgba(239, 68, 68, 0.2)' 
  },
  'glaciaire': { 
    border: 'rgba(96, 165, 250, 1)', 
    background: 'rgba(96, 165, 250, 0.2)' 
  },
  'bio-lab': { 
    border: 'rgba(34, 197, 94, 1)', 
    background: 'rgba(34, 197, 94, 0.2)' 
  },
  'mossi': { 
    border: 'rgba(251, 146, 60, 1)', 
    background: 'rgba(251, 146, 60, 0.2)' 
  },
};

// Default colors for molecules without gamme
const defaultColors = [
  { border: 'rgba(139, 92, 246, 1)', background: 'rgba(139, 92, 246, 0.2)' },
  { border: 'rgba(236, 72, 153, 1)', background: 'rgba(236, 72, 153, 0.2)' },
  { border: 'rgba(14, 165, 233, 1)', background: 'rgba(14, 165, 233, 0.2)' },
  { border: 'rgba(132, 204, 22, 1)', background: 'rgba(132, 204, 22, 0.2)' },
];

export function OlfactiveRadarChart({ molecules }: OlfactiveRadarChartProps) {
  if (molecules.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border border-border">
        <p className="text-muted-foreground text-sm">
          Aucune molécule à comparer
        </p>
      </div>
    );
  }

  // Get all sensory dimensions as labels
  const labels = Object.keys(SENSORY_DIMENSIONS).map(dim => getDimensionLabel(dim as any));

  // Parse olfactive profiles for each molecule
  const datasets = molecules.map((molecule, index) => {
    const scores = parseOlfactiveProfile(molecule.olfactiveProfile);
    const gamme = getGammeFromOlfactiveProfile(molecule.olfactiveProfile);
    
    // Get color based on gamme or use default
    const colors = gamme && gammeColors[gamme] 
      ? gammeColors[gamme]
      : defaultColors[index % defaultColors.length];

    return {
      label: molecule.name,
      data: scores.map(s => s.score),
      borderColor: colors.border,
      backgroundColor: colors.background,
      borderWidth: 2,
      pointBackgroundColor: colors.border,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: colors.border,
      pointRadius: 4,
      pointHoverRadius: 6,
    };
  });

  const data = {
    labels,
    datasets,
  };

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          font: {
            size: 10,
          },
        },
        pointLabels: {
          font: {
            size: 11,
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 11,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.r;
            const dimension = labels[context.dataIndex];
            return `${label} - ${dimension}: ${value}/5`;
          },
        },
      },
    },
  };

  return (
    <div className="h-[400px] w-full flex items-center justify-center">
      <div className="w-full max-w-lg">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}
