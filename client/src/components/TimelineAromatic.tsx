import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

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

export interface AromaticTimelineData {
  notesTete?: string;
  notesCoeur?: string;
  notesFond?: string;
  dureeTeteMin?: number;
  dureeCoeurMin?: number;
  dureeFondMin?: number;
}

interface TimelineAromaticProps {
  data: AromaticTimelineData;
  height?: number;
}

export function TimelineAromatic({ data, height = 300 }: TimelineAromaticProps) {
  // Durées par défaut si non spécifiées
  const dureeTete = data.dureeTeteMin || 15;
  const dureeCoeur = data.dureeCoeurMin || 45;
  const dureeFond = data.dureeFondMin || 120;
  
  // Créer timeline 0-180 minutes (3h)
  const maxTime = Math.max(dureeTete + dureeCoeur + dureeFond, 180);
  const timePoints = [];
  for (let i = 0; i <= maxTime; i += 5) {
    timePoints.push(i);
  }
  
  // Fonction intensité pour chaque phase (courbe gaussienne simplifiée)
  const getIntensity = (time: number, start: number, peak: number, end: number): number => {
    if (time < start) return 0;
    if (time > end) return 0;
    
    const midPoint = (start + peak) / 2;
    const endPoint = (peak + end) / 2;
    
    if (time <= midPoint) {
      // Montée
      return ((time - start) / (midPoint - start)) * 100;
    } else if (time <= peak) {
      // Pic
      return 100;
    } else if (time <= endPoint) {
      // Descente
      return 100 - ((time - peak) / (endPoint - peak)) * 100;
    } else {
      // Fin
      return Math.max(0, 100 - ((time - endPoint) / (end - endPoint)) * 100);
    }
  };
  
  // Calcul des courbes
  const teteData = timePoints.map(t => getIntensity(t, 0, dureeTete / 2, dureeTete));
  const coeurData = timePoints.map(t => getIntensity(t, dureeTete * 0.7, dureeTete + dureeCoeur / 2, dureeTete + dureeCoeur));
  const fondData = timePoints.map(t => getIntensity(t, dureeTete + dureeCoeur * 0.5, dureeTete + dureeCoeur + dureeFond / 2, maxTime));
  
  const chartData = {
    labels: timePoints.map(t => {
      if (t === 0) return "0";
      if (t % 30 === 0) return `${t}min`;
      return "";
    }),
    datasets: [
      {
        label: "Notes de tête",
        data: teteData,
        borderColor: "rgba(59, 130, 246, 0.8)", // bleu
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: "Notes de cœur",
        data: coeurData,
        borderColor: "rgba(139, 92, 246, 0.8)", // violet
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: "Notes de fond",
        data: fondData,
        borderColor: "rgba(251, 146, 60, 0.8)", // orange
        backgroundColor: "rgba(251, 146, 60, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${Math.round(context.parsed.y)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Temps (minutes)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Intensité (%)",
        },
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };
  
  return (
    <div style={{ height: `${height}px` }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
