import { useMemo } from "react";

interface MiniRadarChartProps {
  data: {
    intensity?: number | null;
    freshness?: number | null;
    warmth?: number | null;
    sweetness?: number | null;
    spiciness?: number | null;
    earthiness?: number | null;
  };
  size?: number;
  className?: string;
}

export function MiniRadarChart({ data, size = 80, className = "" }: MiniRadarChartProps) {
  const values = useMemo(() => [
    data.intensity ?? 0,
    data.freshness ?? 0,
    data.warmth ?? 0,
    data.sweetness ?? 0,
    data.spiciness ?? 0,
    data.earthiness ?? 0,
  ], [data]);

  // Calculate polygon points for radar chart
  const points = useMemo(() => {
    const center = size / 2;
    const radius = (size / 2) - 5;
    const angleStep = (Math.PI * 2) / 6;
    
    return values.map((value, index) => {
      const angle = angleStep * index - Math.PI / 2; // Start from top
      const distance = (value / 100) * radius;
      const x = center + distance * Math.cos(angle);
      const y = center + distance * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  }, [values, size]);

  // Calculate background hexagon points (100% scale)
  const backgroundPoints = useMemo(() => {
    const center = size / 2;
    const radius = (size / 2) - 5;
    const angleStep = (Math.PI * 2) / 6;
    
    return Array.from({ length: 6 }, (_, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  }, [size]);

  // Check if all values are 0
  const hasData = values.some(v => v > 0);

  if (!hasData) {
    return null; // Don't render if no data
  }

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      {/* Background hexagon */}
      <polygon
        points={backgroundPoints}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.2"
      />
      
      {/* Data polygon */}
      <polygon
        points={points}
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      
      {/* Center dot */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r="1.5"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}
