import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export interface RadarProfile {
  label: string;
  intensity: number;
  freshness: number;
  warmth: number;
  sweetness: number;
  spiciness: number;
  earthiness: number;
  color?: string;
}

interface RadarChartProps {
  profiles: RadarProfile[];
  height?: number;
}

export function RadarChart({ profiles, height = 400 }: RadarChartProps) {
  const chartRef = useRef<ChartJS<"radar">>(null);
  
  const labels = [
    "Intensité",
    "Fraîcheur",
    "Chaleur",
    "Douceur",
    "Piquant",
    "Terreux"
  ];
  
  const colors = [
    "rgba(139, 92, 246, 0.6)",  // violet
    "rgba(16, 185, 129, 0.6)",  // vert
    "rgba(251, 146, 60, 0.6)",  // orange
    "rgba(59, 130, 246, 0.6)",  // bleu
  ];
  
  const datasets = profiles.map((profile, idx) => ({
    label: profile.label,
    data: [
      profile.intensity,
      profile.freshness,
      profile.warmth,
      profile.sweetness,
      profile.spiciness,
      profile.earthiness
    ],
    backgroundColor: profile.color || colors[idx % colors.length],
    borderColor: (profile.color || colors[idx % colors.length]).replace('0.6', '1'),
    borderWidth: 2,
    pointBackgroundColor: (profile.color || colors[idx % colors.length]).replace('0.6', '1'),
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: (profile.color || colors[idx % colors.length]).replace('0.6', '1'),
  }));
  
  const data = {
    labels,
    datasets
  };
  
  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          font: {
            size: 13,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.r}/100`;
          }
        }
      }
    }
  };
  
  return (
    <div style={{ height: `${height}px`, position: 'relative' }}>
      <Radar ref={chartRef} data={data} options={options} />
    </div>
  );
}
