import { useMemo } from "react";

export interface RadarDataPoint {
  label: string;
  value: number;
}

interface SVGRadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  color?: string;
  fillOpacity?: number;
  showLabels?: boolean;
  showValues?: boolean;
  maxValue?: number;
}

/**
 * Composant SVG RadarChart personnalisé sans dépendance externe.
 * Compatible avec React 19.
 */
export function SVGRadarChart({
  data,
  size = 300,
  color = "#8b5cf6",
  fillOpacity = 0.3,
  showLabels = true,
  showValues = false,
  maxValue = 100,
}: SVGRadarChartProps) {
  const center = size / 2;
  const radius = (size / 2) * 0.75;
  const angleStep = (2 * Math.PI) / data.length;

  // Calculer les points du polygone
  const points = useMemo(() => {
    return data.map((point, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const normalizedValue = Math.min(point.value, maxValue) / maxValue;
      const x = center + radius * normalizedValue * Math.cos(angle);
      const y = center + radius * normalizedValue * Math.sin(angle);
      return { x, y, value: point.value, label: point.label };
    });
  }, [data, center, radius, angleStep, maxValue]);

  // Générer les lignes de la grille
  const gridLines = useMemo(() => {
    const levels = [0.25, 0.5, 0.75, 1];
    return levels.map((level) => {
      const levelPoints = data.map((_, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = center + radius * level * Math.cos(angle);
        const y = center + radius * level * Math.sin(angle);
        return `${x},${y}`;
      });
      return levelPoints.join(" ");
    });
  }, [data, center, radius, angleStep]);

  // Générer les axes
  const axes = useMemo(() => {
    return data.map((point, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      const labelX = center + (radius + 20) * Math.cos(angle);
      const labelY = center + (radius + 20) * Math.sin(angle);
      return { x, y, labelX, labelY, label: point.label };
    });
  }, [data, center, radius, angleStep]);

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grille de fond */}
      {gridLines.map((line, index) => (
        <polygon
          key={index}
          points={line}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          opacity={0.5}
        />
      ))}

      {/* Axes */}
      {axes.map((axis, index) => (
        <g key={index}>
          <line
            x1={center}
            y1={center}
            x2={axis.x}
            y2={axis.y}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity={0.5}
          />
          {showLabels && (
            <text
              x={axis.labelX}
              y={axis.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize="12"
            >
              {axis.label}
            </text>
          )}
        </g>
      ))}

      {/* Polygone des données */}
      <polygon
        points={polygonPoints}
        fill={color}
        fillOpacity={fillOpacity}
        stroke={color}
        strokeWidth="2"
      />

      {/* Points */}
      {points.map((point, index) => (
        <g key={index}>
          <circle
            cx={point.x}
            cy={point.y}
            r="4"
            fill={color}
            stroke="white"
            strokeWidth="2"
          />
          {showValues && (
            <text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              fill="hsl(var(--foreground))"
              fontSize="10"
              fontWeight="bold"
            >
              {point.value}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/**
 * Composant pour comparer plusieurs profils radar superposés
 */
export interface CompareRadarProfile {
  name: string;
  color: string;
  data: RadarDataPoint[];
}

interface SVGCompareRadarChartProps {
  profiles: CompareRadarProfile[];
  size?: number;
  showLabels?: boolean;
  maxValue?: number;
}

export function SVGCompareRadarChart({
  profiles,
  size = 400,
  showLabels = true,
  maxValue = 100,
}: SVGCompareRadarChartProps) {
  if (profiles.length === 0) return null;

  const center = size / 2;
  const radius = (size / 2) * 0.7;
  const data = profiles[0].data;
  const angleStep = (2 * Math.PI) / data.length;

  // Générer les lignes de la grille
  const gridLines = useMemo(() => {
    const levels = [0.25, 0.5, 0.75, 1];
    return levels.map((level) => {
      const levelPoints = data.map((_, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = center + radius * level * Math.cos(angle);
        const y = center + radius * level * Math.sin(angle);
        return `${x},${y}`;
      });
      return levelPoints.join(" ");
    });
  }, [data, center, radius, angleStep]);

  // Générer les axes
  const axes = useMemo(() => {
    return data.map((point, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      const labelX = center + (radius + 25) * Math.cos(angle);
      const labelY = center + (radius + 25) * Math.sin(angle);
      return { x, y, labelX, labelY, label: point.label };
    });
  }, [data, center, radius, angleStep]);

  // Calculer les polygones pour chaque profil
  const polygons = useMemo(() => {
    return profiles.map((profile) => {
      const points = profile.data.map((point, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const normalizedValue = Math.min(point.value, maxValue) / maxValue;
        const x = center + radius * normalizedValue * Math.cos(angle);
        const y = center + radius * normalizedValue * Math.sin(angle);
        return { x, y };
      });
      return {
        name: profile.name,
        color: profile.color,
        points: points.map((p) => `${p.x},${p.y}`).join(" "),
        pointsArray: points,
      };
    });
  }, [profiles, center, radius, angleStep, maxValue]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grille de fond */}
      {gridLines.map((line, index) => (
        <polygon
          key={index}
          points={line}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          opacity={0.5}
        />
      ))}

      {/* Axes */}
      {axes.map((axis, index) => (
        <g key={index}>
          <line
            x1={center}
            y1={center}
            x2={axis.x}
            y2={axis.y}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity={0.5}
          />
          {showLabels && (
            <text
              x={axis.labelX}
              y={axis.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize="12"
            >
              {axis.label}
            </text>
          )}
        </g>
      ))}

      {/* Polygones des profils */}
      {polygons.map((polygon, index) => (
        <g key={index}>
          <polygon
            points={polygon.points}
            fill={polygon.color}
            fillOpacity={0.15}
            stroke={polygon.color}
            strokeWidth="2"
          />
          {/* Points */}
          {polygon.pointsArray.map((point, pIndex) => (
            <circle
              key={pIndex}
              cx={point.x}
              cy={point.y}
              r="3"
              fill={polygon.color}
              stroke="white"
              strokeWidth="1"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

export default SVGRadarChart;
