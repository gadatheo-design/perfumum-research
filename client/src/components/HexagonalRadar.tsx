import { useMemo } from 'react';

interface RadarData {
  intensity: number;
  freshness: number;
  warmth: number;
  sweetness: number;
  spiciness: number;
  earthiness: number;
}

interface HexagonalRadarProps {
  data: RadarData;
  size?: number;
  color?: string;
  fillOpacity?: number;
}

export function HexagonalRadar({ 
  data, 
  size = 200, 
  color = '#f59e0b', 
  fillOpacity = 0.3 
}: HexagonalRadarProps) {
  const center = size / 2;
  const radius = size / 2 - 20;
  
  const axes = [
    { key: 'intensity', label: 'Intensité', angle: 0 },
    { key: 'freshness', label: 'Fraîcheur', angle: 60 },
    { key: 'warmth', label: 'Chaleur', angle: 120 },
    { key: 'sweetness', label: 'Douceur', angle: 180 },
    { key: 'spiciness', label: 'Épices', angle: 240 },
    { key: 'earthiness', label: 'Terreux', angle: 300 },
  ];

  const points = useMemo(() => {
    return axes.map(axis => {
      const value = data[axis.key as keyof RadarData] / 100;
      const angle = (axis.angle - 90) * (Math.PI / 180);
      const x = center + radius * value * Math.cos(angle);
      const y = center + radius * value * Math.sin(angle);
      return { x, y };
    });
  }, [data, center, radius]);

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Background circles */}
      {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
        <polygon
          key={scale}
          points={axes.map(axis => {
            const angle = (axis.angle - 90) * (Math.PI / 180);
            const x = center + radius * scale * Math.cos(angle);
            const y = center + radius * scale * Math.sin(angle);
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}

      {/* Axes */}
      {axes.map((axis, i) => {
        const angle = (axis.angle - 90) * (Math.PI / 180);
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        const labelX = center + (radius + 15) * Math.cos(angle);
        const labelY = center + (radius + 15) * Math.sin(angle);
        
        return (
          <g key={i}>
            <line
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#d1d5db"
              strokeWidth="1"
            />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium fill-stone-600"
            >
              {axis.label}
            </text>
          </g>
        );
      })}

      {/* Data polygon */}
      <path
        d={pathData}
        fill={color}
        fillOpacity={fillOpacity}
        stroke={color}
        strokeWidth="2"
      />

      {/* Data points */}
      {points.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="4"
          fill={color}
        />
      ))}
    </svg>
  );
}
