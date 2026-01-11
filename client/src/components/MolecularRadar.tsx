import { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FlaskConical, Info } from "lucide-react";

// Types pour les liaisons moléculaires
interface MoleculeLink {
  id: number;
  moleculeId: number;
  linkType: string | null;
  percentage: string | null;
  confidence: string | null;
  molecule: {
    id: number;
    name: string;
    chemicalClass: string | null;
    family: string | null;
    olfactiveProfile: string | null;
    radarIntensity: number | null;
    radarFreshness: number | null;
    radarWarmth: number | null;
    radarSweetness: number | null;
    radarSpiciness: number | null;
    radarEarthiness: number | null;
  };
}

interface MolecularRadarProps {
  moleculeLinks: MoleculeLink[];
  title?: string;
  description?: string;
  showLegend?: boolean;
  height?: number;
}

// Couleurs pour les différents types de liaison
const LINK_TYPE_COLORS: Record<string, string> = {
  dominant: "#ef4444",      // Rouge - molécule dominante
  characteristic: "#f59e0b", // Orange - caractéristique
  trace: "#6b7280",         // Gris - trace
  reconstructed: "#8b5cf6", // Violet - reconstruction
  historical: "#3b82f6",    // Bleu - historique
  hypothetical: "#10b981",  // Vert - hypothétique
  other: "#64748b",         // Slate - autre
};

// Labels français pour les axes du radar
const RADAR_AXES = [
  { key: "intensity", label: "Intensité", description: "Puissance olfactive" },
  { key: "freshness", label: "Fraîcheur", description: "Notes agrumes, menthe" },
  { key: "warmth", label: "Chaleur", description: "Notes épicées, boisées" },
  { key: "sweetness", label: "Douceur", description: "Notes florales, fruitées" },
  { key: "spiciness", label: "Épicé", description: "Notes poivre, gingembre" },
  { key: "earthiness", label: "Terreux", description: "Notes mousse, bois, terre" },
];

// Calculer le profil moléculaire agrégé
function calculateAggregatedProfile(moleculeLinks: MoleculeLink[]) {
  if (moleculeLinks.length === 0) return null;

  // Calculer les poids basés sur le type de liaison et le pourcentage
  const weightedProfile = {
    intensity: 0,
    freshness: 0,
    warmth: 0,
    sweetness: 0,
    spiciness: 0,
    earthiness: 0,
  };

  let totalWeight = 0;

  moleculeLinks.forEach((link) => {
    // Poids basé sur le type de liaison
    let typeWeight = 1;
    switch (link.linkType) {
      case "dominant": typeWeight = 3; break;
      case "characteristic": typeWeight = 2; break;
      case "trace": typeWeight = 0.5; break;
      case "reconstructed": typeWeight = 1.5; break;
      case "historical": typeWeight = 1; break;
      case "hypothetical": typeWeight = 0.7; break;
      default: typeWeight = 1;
    }

    // Poids additionnel basé sur le pourcentage si disponible
    const percentageWeight = link.percentage ? parseFloat(link.percentage) / 100 : 1;
    const weight = typeWeight * percentageWeight;

    const mol = link.molecule;
    weightedProfile.intensity += (mol.radarIntensity ?? 50) * weight;
    weightedProfile.freshness += (mol.radarFreshness ?? 50) * weight;
    weightedProfile.warmth += (mol.radarWarmth ?? 50) * weight;
    weightedProfile.sweetness += (mol.radarSweetness ?? 50) * weight;
    weightedProfile.spiciness += (mol.radarSpiciness ?? 50) * weight;
    weightedProfile.earthiness += (mol.radarEarthiness ?? 50) * weight;

    totalWeight += weight;
  });

  // Normaliser
  if (totalWeight > 0) {
    Object.keys(weightedProfile).forEach((key) => {
      weightedProfile[key as keyof typeof weightedProfile] /= totalWeight;
    });
  }

  return weightedProfile;
}

// Préparer les données pour le radar chart
function prepareRadarData(moleculeLinks: MoleculeLink[]) {
  const aggregatedProfile = calculateAggregatedProfile(moleculeLinks);
  if (!aggregatedProfile) return [];

  return RADAR_AXES.map((axis) => ({
    axis: axis.label,
    fullMark: 100,
    value: Math.round(aggregatedProfile[axis.key as keyof typeof aggregatedProfile]),
    description: axis.description,
  }));
}

// Préparer les données individuelles par molécule (pour le mode détaillé)
function prepareIndividualRadarData(moleculeLinks: MoleculeLink[]) {
  return RADAR_AXES.map((axis) => {
    const dataPoint: Record<string, number | string> = {
      axis: axis.label,
      fullMark: 100,
    };

    moleculeLinks.slice(0, 5).forEach((link) => {
      const mol = link.molecule;
      const key = axis.key as keyof typeof mol;
      const radarKey = `radar${axis.key.charAt(0).toUpperCase() + axis.key.slice(1)}` as keyof typeof mol;
      dataPoint[mol.name] = (mol[radarKey] as number) ?? 50;
    });

    return dataPoint;
  });
}

// Tooltip personnalisé
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string; payload: { axis: string; description: string } }> }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background/95 backdrop-blur border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold">{data.axis}</p>
        <p className="text-muted-foreground text-xs mb-2">{data.description}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-primary">
            {entry.name}: <span className="font-medium">{entry.value}</span>/100
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function MolecularRadar({
  moleculeLinks,
  title = "Profil moléculaire",
  description,
  showLegend = true,
  height = 350,
}: MolecularRadarProps) {
  const radarData = useMemo(() => prepareRadarData(moleculeLinks), [moleculeLinks]);
  const individualData = useMemo(() => prepareIndividualRadarData(moleculeLinks), [moleculeLinks]);

  // Stats sur les molécules
  const stats = useMemo(() => {
    const byType: Record<string, number> = {};
    moleculeLinks.forEach((link) => {
      const type = link.linkType || "other";
      byType[type] = (byType[type] || 0) + 1;
    });
    return byType;
  }, [moleculeLinks]);

  if (moleculeLinks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Info className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              Aucune molécule liée à cette variété.
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Ajoutez des liaisons moléculaires pour visualiser le profil.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Statistiques rapides */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats).map(([type, count]) => (
              <div
                key={type}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${LINK_TYPE_COLORS[type] || LINK_TYPE_COLORS.other}20`,
                  color: LINK_TYPE_COLORS[type] || LINK_TYPE_COLORS.other,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: LINK_TYPE_COLORS[type] || LINK_TYPE_COLORS.other }}
                />
                {type === "dominant" && "Dominantes"}
                {type === "characteristic" && "Caractéristiques"}
                {type === "trace" && "Traces"}
                {type === "reconstructed" && "Reconstruction"}
                {type === "historical" && "Historiques"}
                {type === "hypothetical" && "Hypothétiques"}
                {type === "other" && "Autres"}
                : {count}
              </div>
            ))}
          </div>

          {/* Radar Chart - Profil agrégé */}
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  tickCount={5}
                />
                <Radar
                  name="Profil agrégé"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomTooltip />} />
                {showLegend && <Legend />}
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Liste des molécules principales */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Molécules principales</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {moleculeLinks.slice(0, 6).map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          LINK_TYPE_COLORS[link.linkType || "other"] ||
                          LINK_TYPE_COLORS.other,
                      }}
                    />
                    <span className="text-sm font-medium truncate max-w-[150px]">
                      {link.molecule.name}
                    </span>
                  </div>
                  {link.percentage && (
                    <span className="text-xs text-muted-foreground">
                      {link.percentage}%
                    </span>
                  )}
                </div>
              ))}
            </div>
            {moleculeLinks.length > 6 && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                +{moleculeLinks.length - 6} autres molécules
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Export des utilitaires pour réutilisation
export { calculateAggregatedProfile, prepareRadarData, RADAR_AXES, LINK_TYPE_COLORS };
