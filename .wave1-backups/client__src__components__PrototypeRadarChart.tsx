// @ts-nocheck
import { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

export interface PrototypeComposition {
  name: string;
  color: string;
  molecules: {
    name: string;
    quantity: string;
    radarIntensity?: number;
    radarFreshness?: number;
    radarWarmth?: number;
    radarSweetness?: number;
    radarSpiciness?: number;
    radarEarthiness?: number;
  }[];
}

interface PrototypeRadarChartProps {
  composition: PrototypeComposition;
  showLegend?: boolean;
  height?: number;
}

/**
 * Composant RadarChart pour afficher le profil olfactif d'un prototype.
 * Calcule automatiquement les moyennes pondérées des caractéristiques radar
 * de toutes les molécules de la composition.
 */
export function PrototypeRadarChart({ 
  composition, 
  showLegend = true,
  height = 350 
}: PrototypeRadarChartProps) {
  // Calculer les moyennes des caractéristiques radar
  const radarData = useMemo(() => {
    const moleculesWithRadar = composition.molecules.filter(
      m => m.radarIntensity !== undefined
    );
    
    if (moleculesWithRadar.length === 0) {
      // Valeurs par défaut si pas de données radar
      return [
        { subject: "Intensité", value: 50, fullMark: 100 },
        { subject: "Fraîcheur", value: 50, fullMark: 100 },
        { subject: "Chaleur", value: 50, fullMark: 100 },
        { subject: "Douceur", value: 50, fullMark: 100 },
        { subject: "Épicé", value: 50, fullMark: 100 },
        { subject: "Terreux", value: 50, fullMark: 100 },
      ];
    }

    const sum = {
      intensity: 0,
      freshness: 0,
      warmth: 0,
      sweetness: 0,
      spiciness: 0,
      earthiness: 0,
    };

    moleculesWithRadar.forEach(m => {
      sum.intensity += m.radarIntensity || 50;
      sum.freshness += m.radarFreshness || 50;
      sum.warmth += m.radarWarmth || 50;
      sum.sweetness += m.radarSweetness || 50;
      sum.spiciness += m.radarSpiciness || 50;
      sum.earthiness += m.radarEarthiness || 50;
    });

    const count = moleculesWithRadar.length;

    return [
      { subject: "Intensité", value: Math.round(sum.intensity / count), fullMark: 100 },
      { subject: "Fraîcheur", value: Math.round(sum.freshness / count), fullMark: 100 },
      { subject: "Chaleur", value: Math.round(sum.warmth / count), fullMark: 100 },
      { subject: "Douceur", value: Math.round(sum.sweetness / count), fullMark: 100 },
      { subject: "Épicé", value: Math.round(sum.spiciness / count), fullMark: 100 },
      { subject: "Terreux", value: Math.round(sum.earthiness / count), fullMark: 100 },
    ];
  }, [composition.molecules]);

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
          />
          <Radar
            name={composition.name}
            dataKey="value"
            stroke={composition.color}
            fill={composition.color}
            fillOpacity={0.3}
            strokeWidth={2}
          />
          {showLegend && <Legend />}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))", 
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px"
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Composant pour afficher la composition complète d'un prototype
 * avec le graphique radar et la liste des molécules.
 */
interface CompositionCompleteProps {
  composition: PrototypeComposition;
  description?: string;
}

export function CompositionComplete({ composition, description }: CompositionCompleteProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Graphique Radar */}
      <div className="p-4 rounded-lg border bg-card">
        <h4 className="font-semibold mb-4 text-center">Profil Olfactif</h4>
        <PrototypeRadarChart composition={composition} height={300} />
        {description && (
          <p className="text-sm text-muted-foreground text-center mt-4">{description}</p>
        )}
      </div>

      {/* Détails des molécules */}
      <div className="p-4 rounded-lg border bg-card">
        <h4 className="font-semibold mb-4">Composition Détaillée</h4>
        <div className="space-y-3">
          {composition.molecules.map((mol, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div>
                <span className="font-medium">{mol.name}</span>
                {mol.radarIntensity !== undefined && (
                  <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                    <span>Int: {mol.radarIntensity}</span>
                    <span>•</span>
                    <span>Fr: {mol.radarFreshness}</span>
                    <span>•</span>
                    <span>Ch: {mol.radarWarmth}</span>
                  </div>
                )}
              </div>
              <span className="font-mono text-sm text-muted-foreground">{mol.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PrototypeRadarChart;
