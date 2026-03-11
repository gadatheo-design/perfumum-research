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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Droplets, Flame, Snowflake, Candy, Leaf } from "lucide-react";

export interface MoleculeRadarData {
  id: number;
  name: string;
  chemicalFormula?: string | null;
  radarIntensity?: number | null;
  radarFreshness?: number | null;
  radarWarmth?: number | null;
  radarSweetness?: number | null;
  radarSpiciness?: number | null;
  radarEarthiness?: number | null;
  proportion?: number;
}

interface RecipeRadarChartProps {
  molecules: MoleculeRadarData[];
  recipeName: string;
  color?: string;
  showLegend?: boolean;
  height?: number;
}

/**
 * Composant RadarChart pour afficher le profil olfactif d'une recette.
 * Calcule automatiquement les moyennes pondérées des caractéristiques radar
 * de toutes les molécules de la recette.
 */
export function RecipeRadarChart({ 
  molecules, 
  recipeName,
  color = "#8b5cf6",
  showLegend = true,
  height = 350 
}: RecipeRadarChartProps) {
  // Calculer les moyennes pondérées des caractéristiques radar
  const radarData = useMemo(() => {
    const moleculesWithRadar = molecules.filter(
      m => m.radarIntensity !== undefined && m.radarIntensity !== null
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

    // Calcul pondéré par proportion si disponible
    let totalWeight = 0;
    const sum = {
      intensity: 0,
      freshness: 0,
      warmth: 0,
      sweetness: 0,
      spiciness: 0,
      earthiness: 0,
    };

    moleculesWithRadar.forEach(m => {
      const weight = m.proportion || 1;
      totalWeight += weight;
      sum.intensity += (m.radarIntensity || 50) * weight;
      sum.freshness += (m.radarFreshness || 50) * weight;
      sum.warmth += (m.radarWarmth || 50) * weight;
      sum.sweetness += (m.radarSweetness || 50) * weight;
      sum.spiciness += (m.radarSpiciness || 50) * weight;
      sum.earthiness += (m.radarEarthiness || 50) * weight;
    });

    const divisor = totalWeight || 1;

    return [
      { subject: "Intensité", value: Math.round(sum.intensity / divisor), fullMark: 100 },
      { subject: "Fraîcheur", value: Math.round(sum.freshness / divisor), fullMark: 100 },
      { subject: "Chaleur", value: Math.round(sum.warmth / divisor), fullMark: 100 },
      { subject: "Douceur", value: Math.round(sum.sweetness / divisor), fullMark: 100 },
      { subject: "Épicé", value: Math.round(sum.spiciness / divisor), fullMark: 100 },
      { subject: "Terreux", value: Math.round(sum.earthiness / divisor), fullMark: 100 },
    ];
  }, [molecules]);

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
            name={recipeName}
            dataKey="value"
            stroke={color}
            fill={color}
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
 * Composant complet pour afficher le profil olfactif d'une recette
 * avec le graphique radar et les valeurs détaillées.
 */
interface RecipeOlfactiveProfileProps {
  molecules: MoleculeRadarData[];
  recipeName: string;
  color?: string;
}

export function RecipeOlfactiveProfile({ 
  molecules, 
  recipeName,
  color = "#8b5cf6"
}: RecipeOlfactiveProfileProps) {
  // Calculer les moyennes pour l'affichage des badges
  const averages = useMemo(() => {
    const moleculesWithRadar = molecules.filter(
      m => m.radarIntensity !== undefined && m.radarIntensity !== null
    );
    
    if (moleculesWithRadar.length === 0) {
      return {
        intensity: 50,
        freshness: 50,
        warmth: 50,
        sweetness: 50,
        spiciness: 50,
        earthiness: 50,
      };
    }

    let totalWeight = 0;
    const sum = {
      intensity: 0,
      freshness: 0,
      warmth: 0,
      sweetness: 0,
      spiciness: 0,
      earthiness: 0,
    };

    moleculesWithRadar.forEach(m => {
      const weight = m.proportion || 1;
      totalWeight += weight;
      sum.intensity += (m.radarIntensity || 50) * weight;
      sum.freshness += (m.radarFreshness || 50) * weight;
      sum.warmth += (m.radarWarmth || 50) * weight;
      sum.sweetness += (m.radarSweetness || 50) * weight;
      sum.spiciness += (m.radarSpiciness || 50) * weight;
      sum.earthiness += (m.radarEarthiness || 50) * weight;
    });

    const divisor = totalWeight || 1;

    return {
      intensity: Math.round(sum.intensity / divisor),
      freshness: Math.round(sum.freshness / divisor),
      warmth: Math.round(sum.warmth / divisor),
      sweetness: Math.round(sum.sweetness / divisor),
      spiciness: Math.round(sum.spiciness / divisor),
      earthiness: Math.round(sum.earthiness / divisor),
    };
  }, [molecules]);

  const radarAxes = [
    { key: "intensity", label: "Intensité", icon: Activity, color: "text-red-500" },
    { key: "freshness", label: "Fraîcheur", icon: Snowflake, color: "text-cyan-500" },
    { key: "warmth", label: "Chaleur", icon: Flame, color: "text-orange-500" },
    { key: "sweetness", label: "Douceur", icon: Candy, color: "text-pink-500" },
    { key: "spiciness", label: "Épicé", icon: Droplets, color: "text-amber-500" },
    { key: "earthiness", label: "Terreux", icon: Leaf, color: "text-green-500" },
  ];

  const moleculesWithRadar = molecules.filter(
    m => m.radarIntensity !== undefined && m.radarIntensity !== null
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Profil Olfactif
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Graphique Radar */}
          <div>
            <RecipeRadarChart 
              molecules={molecules} 
              recipeName={recipeName}
              color={color}
              height={300}
              showLegend={false}
            />
          </div>

          {/* Valeurs détaillées */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {radarAxes.map(({ key, label, icon: Icon, color: iconColor }) => (
                <div 
                  key={key}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">{label}</div>
                    <div className="font-semibold">
                      {averages[key as keyof typeof averages]}/100
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info sur les molécules */}
            <div className="text-sm text-muted-foreground border-t pt-4">
              <p>
                Profil calculé à partir de{" "}
                <span className="font-semibold text-foreground">
                  {moleculesWithRadar.length} molécule{moleculesWithRadar.length > 1 ? "s" : ""}
                </span>
                {moleculesWithRadar.length > 0 && (
                  <span className="block mt-1">
                    {moleculesWithRadar.slice(0, 3).map(m => m.name).join(", ")}
                    {moleculesWithRadar.length > 3 && ` et ${moleculesWithRadar.length - 3} autres`}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default RecipeRadarChart;
