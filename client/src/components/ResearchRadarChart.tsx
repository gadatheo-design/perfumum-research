import { useMemo } from "react";

interface AxisData {
  axisId: string;
  titleFr: string;
  color: string;
  totalCount: number;
}

interface ResearchRadarChartProps {
  data: AxisData[];
}

export function ResearchRadarChart({ data }: ResearchRadarChartProps) {
  // Configuration du graphique
  const size = 400;
  const center = size / 2;
  const maxRadius = size / 2 - 60;
  const levels = 5;
  
  // Calculer le maximum pour normaliser
  const maxValue = useMemo(() => {
    const max = Math.max(...data.map(d => d.totalCount), 1);
    return Math.ceil(max / 5) * 5; // Arrondir au multiple de 5 supérieur
  }, [data]);
  
  // Générer les points du polygone
  const points = useMemo(() => {
    if (data.length === 0) return [];
    
    const angleStep = (2 * Math.PI) / data.length;
    return data.map((d, i) => {
      const angle = i * angleStep - Math.PI / 2; // Commencer en haut
      const normalizedValue = d.totalCount / maxValue;
      const radius = normalizedValue * maxRadius;
      return {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle),
        labelX: center + (maxRadius + 30) * Math.cos(angle),
        labelY: center + (maxRadius + 30) * Math.sin(angle),
        ...d,
      };
    });
  }, [data, maxValue, maxRadius, center]);
  
  // Générer le chemin du polygone
  const polygonPath = useMemo(() => {
    if (points.length === 0) return "";
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  }, [points]);
  
  // Générer les lignes de grille
  const gridLines = useMemo(() => {
    const lines = [];
    const angleStep = (2 * Math.PI) / (data.length || 6);
    
    // Cercles concentriques
    for (let level = 1; level <= levels; level++) {
      const radius = (level / levels) * maxRadius;
      lines.push({
        type: 'circle',
        radius,
        value: Math.round((level / levels) * maxValue),
      });
    }
    
    // Lignes radiales
    for (let i = 0; i < (data.length || 6); i++) {
      const angle = i * angleStep - Math.PI / 2;
      lines.push({
        type: 'line',
        x1: center,
        y1: center,
        x2: center + maxRadius * Math.cos(angle),
        y2: center + maxRadius * Math.sin(angle),
      });
    }
    
    return lines;
  }, [data.length, maxRadius, maxValue, center, levels]);
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        Aucune donnée disponible
      </div>
    );
  }
  
  return (
    <div className="flex flex-col lg:flex-row items-center gap-8">
      {/* Graphique SVG */}
      <svg 
        viewBox={`0 0 ${size} ${size}`} 
        className="w-full max-w-[400px] h-auto"
      >
        {/* Grille */}
        <g className="text-muted-foreground/20">
          {gridLines.map((line, i) => (
            line.type === 'circle' ? (
              <g key={`circle-${i}`}>
                <circle
                  cx={center}
                  cy={center}
                  r={line.radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                {/* Valeur sur l'axe vertical */}
                <text
                  x={center + 5}
                  y={center - (line.radius as number) + 4}
                  className="text-[10px] fill-muted-foreground"
                >
                  {line.value}
                </text>
              </g>
            ) : (
              <line
                key={`line-${i}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="currentColor"
                strokeWidth="1"
              />
            )
          ))}
        </g>
        
        {/* Polygone des données */}
        <path
          d={polygonPath}
          fill="oklch(0.7 0.15 250 / 0.3)"
          stroke="oklch(0.6 0.2 250)"
          strokeWidth="2"
        />
        
        {/* Points et labels */}
        {points.map((point, i) => (
          <g key={point.axisId}>
            {/* Point */}
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={point.color}
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer hover:r-8 transition-all"
            />
            
            {/* Label */}
            <text
              x={point.labelX}
              y={point.labelY}
              textAnchor={point.labelX > center ? 'start' : point.labelX < center ? 'end' : 'middle'}
              dominantBaseline={point.labelY > center ? 'hanging' : point.labelY < center ? 'auto' : 'middle'}
              className="text-xs fill-foreground font-medium"
            >
              {point.titleFr.length > 20 ? point.titleFr.substring(0, 18) + '...' : point.titleFr}
            </text>
            
            {/* Valeur */}
            <text
              x={point.labelX}
              y={point.labelY + (point.labelY > center ? 14 : -14)}
              textAnchor={point.labelX > center ? 'start' : point.labelX < center ? 'end' : 'middle'}
              className="text-[10px] fill-muted-foreground"
            >
              {point.totalCount} ressources
            </text>
          </g>
        ))}
      </svg>
      
      {/* Légende */}
      <div className="flex flex-col gap-3">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Légende
        </h4>
        {data.map((axis) => (
          <div key={axis.axisId} className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: axis.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{axis.titleFr}</p>
              <p className="text-xs text-muted-foreground">{axis.totalCount} ressources</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
