import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { getGammeFromOlfactiveProfile } from '@/lib/gammeMapping';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Molecule {
  id: number;
  name: string;
  concentration: string | null;
  olfactiveProfile: string | null;
}

interface ConcentrationBarChartProps {
  molecules: Molecule[];
}

// Parse concentration string to number (handle various formats)
function parseConcentration(concentration: string | null): number | null {
  if (!concentration) return null;
  
  // Remove spaces and convert to lowercase
  const cleaned = concentration.toLowerCase().replace(/\s/g, '');
  
  // Try to extract percentage (e.g., "0.01%", "0.001-0.01%")
  const percentMatch = cleaned.match(/([\d.]+)%/);
  if (percentMatch) {
    return parseFloat(percentMatch[1]);
  }
  
  // Try to extract ppm (e.g., "10ppm", "5-10ppm")
  const ppmMatch = cleaned.match(/([\d.]+)ppm/);
  if (ppmMatch) {
    return parseFloat(ppmMatch[1]) / 10000; // Convert ppm to percentage
  }
  
  // Try to parse as plain number
  const numberMatch = cleaned.match(/^([\d.]+)/);
  if (numberMatch) {
    return parseFloat(numberMatch[1]);
  }
  
  return null;
}

// Gamme colors mapping
const gammeColors: Record<string, string> = {
  'pétrichor': 'rgba(59, 130, 246, 0.8)', // blue
  'volcanique': 'rgba(239, 68, 68, 0.8)', // red
  'glaciaire': 'rgba(96, 165, 250, 0.8)', // light blue
  'bio-lab': 'rgba(34, 197, 94, 0.8)', // green
  'mossi': 'rgba(251, 146, 60, 0.8)', // orange
};

export function ConcentrationBarChart({ molecules }: ConcentrationBarChartProps) {
  // Parse concentrations and filter out molecules without valid concentrations
  const dataPoints = molecules
    .map(m => ({
      name: m.name,
      concentration: parseConcentration(m.concentration),
      gamme: getGammeFromOlfactiveProfile(m.olfactiveProfile),
    }))
    .filter(d => d.concentration !== null && d.concentration > 0);

  if (dataPoints.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border border-border">
        <p className="text-muted-foreground text-sm">
          Aucune donnée de concentration disponible
        </p>
      </div>
    );
  }

  // Check if we need logarithmic scale (if max/min ratio > 100)
  const concentrations = dataPoints.map(d => d.concentration!);
  const maxConc = Math.max(...concentrations);
  const minConc = Math.min(...concentrations);
  const useLogScale = maxConc / minConc > 100;

  const data = {
    labels: dataPoints.map(d => d.name),
    datasets: [
      {
        label: 'Concentration recommandée (%)',
        data: dataPoints.map(d => d.concentration),
        backgroundColor: dataPoints.map(d => 
          d.gamme ? gammeColors[d.gamme] || 'rgba(139, 92, 246, 0.8)' : 'rgba(139, 92, 246, 0.8)'
        ),
        borderColor: dataPoints.map(d => 
          d.gamme ? gammeColors[d.gamme]?.replace('0.8', '1') || 'rgba(139, 92, 246, 1)' : 'rgba(139, 92, 246, 1)'
        ),
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
        type: useLogScale ? 'logarithmic' : 'linear',
        title: {
          display: true,
          text: useLogScale ? 'Concentration (%, échelle log)' : 'Concentration (%)',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
        ticks: {
          callback: function(value) {
            return value + '%';
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
            return `${context.parsed.x}%`;
          },
        },
      },
    },
  };

  return (
    <div className="h-[400px] w-full">
      <Bar data={data} options={options} />
    </div>
  );
}
