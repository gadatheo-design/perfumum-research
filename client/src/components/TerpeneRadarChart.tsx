/**
 * TerpeneRadarChart - Graphique radar pour visualiser les profils terpéniques
 * 
 * Affiche les concentrations relatives des terpènes sous forme de radar chart
 * avec des couleurs distinctives pour chaque terpène.
 */

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets } from "lucide-react";

interface TerpeneData {
  name: string;
  percentage: number;
  color: string;
}

interface TerpeneRadarChartProps {
  terpenes: Array<{
    terpene_name: string;
    percentage: number;
  }>;
  title?: string;
  size?: number;
}

// Couleurs pour les terpènes courants
const TERPENE_COLORS: Record<string, string> = {
  "Myrcene": "#22c55e",      // vert
  "Limonene": "#eab308",     // jaune
  "Caryophyllene": "#a855f7", // violet
  "Pinene": "#06b6d4",       // cyan
  "Linalool": "#ec4899",     // rose
  "Humulene": "#f97316",     // orange
  "Terpinolene": "#14b8a6",  // teal
  "Ocimene": "#84cc16",      // lime
  "Bisabolol": "#8b5cf6",    // indigo
  "Nerolidol": "#f43f5e",    // rouge rose
  "Guaiol": "#0ea5e9",       // bleu ciel
  "Eucalyptol": "#10b981",   // emerald
  "Geraniol": "#f472b6",     // pink
  "Borneol": "#6366f1",      // indigo
  "Camphene": "#22d3ee",     // cyan clair
};

function getColorForTerpene(name: string, index: number): string {
  // Chercher une couleur prédéfinie
  for (const [key, color] of Object.entries(TERPENE_COLORS)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }
  // Couleurs de fallback
  const fallbackColors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"];
  return fallbackColors[index % fallbackColors.length];
}

export function TerpeneRadarChart({ terpenes, title = "Profil Terpénique", size = 300 }: TerpeneRadarChartProps) {
  const chartData = useMemo(() => {
    if (!terpenes || terpenes.length === 0) return [];
    
    // Normaliser les données et ajouter les couleurs
    const maxPercentage = Math.max(...terpenes.map(t => t.percentage));
    
    return terpenes.map((t, index) => ({
      name: t.terpene_name,
      percentage: t.percentage,
      normalizedValue: maxPercentage > 0 ? (t.percentage / maxPercentage) * 100 : 0,
      color: getColorForTerpene(t.terpene_name, index),
    }));
  }, [terpenes]);

  if (chartData.length === 0) {
    return null;
  }

  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = (size / 2) - 40;
  const angleStep = (2 * Math.PI) / chartData.length;

  // Générer les points du polygone
  const polygonPoints = chartData.map((data, index) => {
    const angle = index * angleStep - Math.PI / 2; // Commencer en haut
    const radius = (data.normalizedValue / 100) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  // Générer les lignes de grille (cercles concentriques)
  const gridLevels = [20, 40, 60, 80, 100];

  // Générer les axes
  const axes = chartData.map((_, index) => {
    const angle = index * angleStep - Math.PI / 2;
    return {
      x1: centerX,
      y1: centerY,
      x2: centerX + maxRadius * Math.cos(angle),
      y2: centerY + maxRadius * Math.sin(angle),
    };
  });

  // Générer les labels
  const labels = chartData.map((data, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const labelRadius = maxRadius + 25;
    return {
      x: centerX + labelRadius * Math.cos(angle),
      y: centerY + labelRadius * Math.sin(angle),
      name: data.name,
      percentage: data.percentage,
      color: data.color,
    };
  });

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Graphique radar SVG */}
          <svg 
            width={size} 
            height={size} 
            viewBox={`0 0 ${size} ${size}`}
            className="shrink-0"
          >
            {/* Grille concentrique */}
            {gridLevels.map((level) => (
              <circle
                key={level}
                cx={centerX}
                cy={centerY}
                r={(level / 100) * maxRadius}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.1}
                strokeWidth={1}
              />
            ))}

            {/* Axes */}
            {axes.map((axis, index) => (
              <line
                key={index}
                x1={axis.x1}
                y1={axis.y1}
                x2={axis.x2}
                y2={axis.y2}
                stroke="currentColor"
                strokeOpacity={0.2}
                strokeWidth={1}
              />
            ))}

            {/* Polygone des données */}
            <polygon
              points={polygonPoints.map(p => `${p.x},${p.y}`).join(" ")}
              fill="url(#radarGradient)"
              fillOpacity={0.3}
              stroke="url(#radarStroke)"
              strokeWidth={2}
            />

            {/* Points sur le polygone */}
            {polygonPoints.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={5}
                fill={chartData[index].color}
                stroke="white"
                strokeWidth={2}
              />
            ))}

            {/* Labels des terpènes */}
            {labels.map((label, index) => (
              <g key={index}>
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] fill-muted-foreground font-medium"
                >
                  {label.name.length > 10 ? label.name.substring(0, 10) + "..." : label.name}
                </text>
              </g>
            ))}

            {/* Dégradés */}
            <defs>
              <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
              <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
            </defs>
          </svg>

          {/* Légende avec pourcentages */}
          <div className="flex-1 space-y-2">
            <h4 className="text-sm font-medium text-foreground mb-3">Composition</h4>
            {chartData.map((data, index) => (
              <div key={index} className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: data.color }}
                />
                <span className="text-sm text-muted-foreground flex-1 truncate">
                  {data.name}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {(data).toFixed(1)}%
                </span>
              </div>
            ))}
            
            {/* Total */}
            <div className="pt-2 mt-2 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total</span>
                <span className="text-sm font-bold text-foreground">
                  {chartData.reduce((sum, d) => sum + d.percentage, 0).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
