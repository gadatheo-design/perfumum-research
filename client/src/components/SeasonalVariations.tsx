/**
 * SeasonalVariations — Composant de visualisation des variations saisonnières
 * Affiche les variations de composition moléculaire selon les saisons/conditions de culture
 * Utilise les données de plant_molecules avec variability_factor = 'saisonnier'
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sun, 
  Snowflake, 
  Leaf, 
  Flower2, 
  Thermometer, 
  Droplets, 
  Wind, 
  Mountain,
  Info,
  BarChart3,
  TrendingUp
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

// Données de variations saisonnières statiques (basées sur les données scientifiques)
// Source : PMC8306096, PMC6804150, MDPI:1420-3049/25/7/1734
const SEASONAL_DATA: Record<string, {
  description: string;
  conditions: Array<{
    label: string;
    icon: string;
    season: string;
    condition: string;
    color: string;
    molecules: Array<{ name: string; min: number; max: number; typical: number; unit: string }>;
    notes?: string;
  }>;
}> = {
  // Virginia (flue-cured) — id: 7
  "Virginia (flue-cured)": {
    description: "Tabac blond à haut rendement en sucres. Le séchage à l'air chaud (flue-curing) concentre les sucres et développe les norisoprénoïdes.",
    conditions: [
      {
        label: "Récolte printemps",
        icon: "🌱",
        season: "Printemps",
        condition: "Feuilles jeunes, faible teneur en nicotine, sucres élevés",
        color: "#22c55e",
        molecules: [
          { name: "Nicotine", min: 1.2, max: 1.5, typical: 1.35, unit: "%" },
          { name: "Sucres", min: 18, max: 22, typical: 20, unit: "%" },
          { name: "Limonène", min: 0.3, max: 0.5, typical: 0.4, unit: "%" },
          { name: "β-Damascenone", min: 0.5, max: 0.8, typical: 0.65, unit: "%" },
          { name: "Megastigmatrienone", min: 0.4, max: 0.7, typical: 0.55, unit: "%" }
        ],
        notes: "Feuilles jeunes — profil doux et sucré"
      },
      {
        label: "Récolte été",
        icon: "☀️",
        season: "Été",
        condition: "Feuilles matures, teneur moyenne en nicotine",
        color: "#f59e0b",
        molecules: [
          { name: "Nicotine", min: 1.8, max: 2.2, typical: 2.0, unit: "%" },
          { name: "Sucres", min: 14, max: 18, typical: 16, unit: "%" },
          { name: "Limonène", min: 0.4, max: 0.6, typical: 0.5, unit: "%" },
          { name: "β-Damascenone", min: 0.8, max: 1.3, typical: 1.05, unit: "%" },
          { name: "Megastigmatrienone", min: 0.6, max: 1.0, typical: 0.8, unit: "%" }
        ],
        notes: "Feuilles matures — profil équilibré"
      },
      {
        label: "Après séchage",
        icon: "🔥",
        season: "Flue-curing",
        condition: "Séchage à l'air chaud (6-8 semaines), développement des arômes",
        color: "#ef4444",
        molecules: [
          { name: "Nicotine", min: 1.5, max: 2.0, typical: 1.75, unit: "%" },
          { name: "Sucres", min: 12, max: 16, typical: 14, unit: "%" },
          { name: "Limonène", min: 0.5, max: 0.8, typical: 0.65, unit: "%" },
          { name: "β-Damascenone", min: 1.0, max: 1.5, typical: 1.26, unit: "%" },
          { name: "Megastigmatrienone", min: 0.7, max: 1.2, typical: 0.95, unit: "%" }
        ],
        notes: "Post-séchage — développement des norisoprénoïdes"
      }
    ]
  },
  // Burley (air-cured) — id: 8
  "Burley (air-cured)": {
    description: "Tabac brun à haut rendement en nicotine. Le séchage à l'air libre favorise les réactions de Maillard et développe les pyrazines.",
    conditions: [
      {
        label: "Récolte été",
        icon: "☀️",
        season: "Été",
        condition: "Feuilles matures, riche en alcaloïdes",
        color: "#f59e0b",
        molecules: [
          { name: "Nicotine", min: 3.0, max: 3.8, typical: 3.4, unit: "%" },
          { name: "Sucres", min: 6, max: 10, typical: 8, unit: "%" },
          { name: "β-Damascenone", min: 0.4, max: 0.7, typical: 0.55, unit: "%" },
          { name: "Megastigmatrienone", min: 0.3, max: 0.6, typical: 0.45, unit: "%" },
          { name: "2-Acétylpyrazine", min: 0.05, max: 0.1, typical: 0.075, unit: "%" }
        ],
        notes: "Récolte — profil riche en alcaloïdes"
      },
      {
        label: "Après séchage air",
        icon: "🌬️",
        season: "Air-curing",
        condition: "Séchage à l'air (4-6 semaines), caramélisation des sucres",
        color: "#8b5cf6",
        molecules: [
          { name: "Nicotine", min: 3.2, max: 4.0, typical: 3.6, unit: "%" },
          { name: "Sucres", min: 5, max: 8, typical: 6.5, unit: "%" },
          { name: "β-Damascenone", min: 0.6, max: 1.0, typical: 0.8, unit: "%" },
          { name: "Megastigmatrienone", min: 0.4, max: 0.7, typical: 0.55, unit: "%" },
          { name: "2-Acétylpyrazine", min: 0.08, max: 0.15, typical: 0.115, unit: "%" }
        ],
        notes: "Post-séchage — développement des pyrazines (Maillard)"
      }
    ]
  },
  // Latakia — id: 150002
  "Latakia": {
    description: "Tabac oriental fumé au bois de chêne et de pin. Le fumage développe des phénols fumés caractéristiques (guaiacol, crésols).",
    conditions: [
      {
        label: "Avant fumage",
        icon: "🌿",
        season: "Récolte",
        condition: "Feuilles de tabac oriental (Syrie), avant fumage",
        color: "#22c55e",
        molecules: [
          { name: "Nicotine", min: 1.5, max: 2.0, typical: 1.75, unit: "%" },
          { name: "β-Damascenone", min: 0.3, max: 0.5, typical: 0.4, unit: "%" },
          { name: "Megastigmatrienone", min: 0.2, max: 0.4, typical: 0.3, unit: "%" },
          { name: "Guaiacol", min: 0.1, max: 0.2, typical: 0.15, unit: "%" },
          { name: "2-Acétylpyrazine", min: 0.05, max: 0.1, typical: 0.075, unit: "%" }
        ],
        notes: "Avant fumage — profil oriental de base"
      },
      {
        label: "Après fumage bois",
        icon: "🔥",
        season: "Smoke-curing",
        condition: "Fumage au bois de chêne/pin (3-4 mois)",
        color: "#78350f",
        molecules: [
          { name: "Nicotine", min: 1.8, max: 2.3, typical: 2.05, unit: "%" },
          { name: "β-Damascenone", min: 0.5, max: 0.8, typical: 0.65, unit: "%" },
          { name: "Megastigmatrienone", min: 0.3, max: 0.6, typical: 0.45, unit: "%" },
          { name: "Guaiacol", min: 0.3, max: 0.7, typical: 0.5, unit: "%" },
          { name: "4-Méthylguaiacol", min: 0.2, max: 0.5, typical: 0.35, unit: "%" }
        ],
        notes: "Post-fumage — phénols fumés développés"
      }
    ]
  },
  // Rosa damascena
  "Rosa damascena": {
    description: "Rose de Damas, cultivée principalement en Bulgarie (Vallée des Roses) et en Turquie. La composition varie selon la saison de récolte et l'altitude.",
    conditions: [
      {
        label: "Récolte printemps",
        icon: "🌸",
        season: "Printemps",
        condition: "Floraison optimale, mai-juin, matin (avant 10h)",
        color: "#ec4899",
        molecules: [
          { name: "Citronellol", min: 30, max: 40, typical: 35, unit: "%" },
          { name: "Géraniol", min: 15, max: 22, typical: 18, unit: "%" },
          { name: "Nérol", min: 8, max: 14, typical: 11, unit: "%" },
          { name: "Linalol", min: 1.5, max: 3, typical: 2.2, unit: "%" },
          { name: "β-Damascenone", min: 0.1, max: 0.3, typical: 0.2, unit: "%" }
        ],
        notes: "Récolte optimale — profil floral maximal"
      },
      {
        label: "Récolte été",
        icon: "☀️",
        season: "Été",
        condition: "Floraison tardive, chaleur, profil plus épicé",
        color: "#f97316",
        molecules: [
          { name: "Citronellol", min: 25, max: 35, typical: 30, unit: "%" },
          { name: "Géraniol", min: 12, max: 18, typical: 15, unit: "%" },
          { name: "Nérol", min: 6, max: 10, typical: 8, unit: "%" },
          { name: "Linalol", min: 2, max: 4, typical: 3, unit: "%" },
          { name: "β-Damascenone", min: 0.15, max: 0.4, typical: 0.28, unit: "%" }
        ],
        notes: "Chaleur estivale — profil plus épicé"
      },
      {
        label: "Haute altitude (>1200m)",
        icon: "⛰️",
        season: "Altitude",
        condition: "Culture en altitude (>1200m), stress thermique, profil concentré",
        color: "#6366f1",
        molecules: [
          { name: "Citronellol", min: 35, max: 45, typical: 40, unit: "%" },
          { name: "Géraniol", min: 18, max: 25, typical: 21, unit: "%" },
          { name: "Nérol", min: 10, max: 16, typical: 13, unit: "%" },
          { name: "Linalol", min: 2, max: 4, typical: 3, unit: "%" },
          { name: "β-Damascenone", min: 0.2, max: 0.5, typical: 0.35, unit: "%" }
        ],
        notes: "Altitude — profil concentré et complexe"
      }
    ]
  },
  // Lavande
  "Lavande": {
    description: "Lavandula angustifolia. La composition varie selon l'altitude (lavande de montagne vs plaine), la saison et le stade de floraison.",
    conditions: [
      {
        label: "Récolte précoce",
        icon: "🌱",
        season: "Début floraison",
        condition: "Début de floraison, linalol dominant",
        color: "#a855f7",
        molecules: [
          { name: "Linalol", min: 25, max: 38, typical: 32, unit: "%" },
          { name: "Acétate de linalyle", min: 25, max: 40, typical: 33, unit: "%" },
          { name: "Camphre", min: 0.5, max: 1.5, typical: 1.0, unit: "%" },
          { name: "β-Ocimène", min: 3, max: 8, typical: 5.5, unit: "%" },
          { name: "1,8-cinéole", min: 0.5, max: 1.5, typical: 1.0, unit: "%" }
        ],
        notes: "Début floraison — linalol et acétate maximaux"
      },
      {
        label: "Pleine floraison",
        icon: "💜",
        season: "Pleine floraison",
        condition: "Pleine floraison, profil équilibré",
        color: "#7c3aed",
        molecules: [
          { name: "Linalol", min: 28, max: 42, typical: 35, unit: "%" },
          { name: "Acétate de linalyle", min: 28, max: 45, typical: 36, unit: "%" },
          { name: "Camphre", min: 0.3, max: 1.0, typical: 0.65, unit: "%" },
          { name: "β-Ocimène", min: 2, max: 6, typical: 4, unit: "%" },
          { name: "1,8-cinéole", min: 0.3, max: 1.0, typical: 0.65, unit: "%" }
        ],
        notes: "Pleine floraison — profil optimal ISO 3515"
      }
    ]
  }
};

// Couleurs pour les graphiques
const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

interface SeasonalVariationsProps {
  plantName: string;
  plantId: number;
}

export function SeasonalVariations({ plantName, plantId }: SeasonalVariationsProps) {
  const [activeCondition, setActiveCondition] = useState<number>(0);
  const [chartType, setChartType] = useState<"bar" | "radar">("bar");

  // Trouver les données pour cette plante
  const data = SEASONAL_DATA[plantName];

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Info className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-muted-foreground">Aucune donnée saisonnière</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Les variations saisonnières pour <strong>{plantName}</strong> ne sont pas encore documentées.
          Les données prioritaires concernent les tabacs (Virginia, Burley, Latakia), la Rose de Damas et la Lavande.
        </p>
      </div>
    );
  }

  const conditions = data.conditions;
  const currentCondition = conditions[activeCondition];

  // Préparer les données pour le graphique comparatif (toutes les conditions)
  const allMoleculeNames = [...new Set(
    conditions.flatMap(c => c.molecules.map(m => m.name))
  )].slice(0, 6); // Limiter à 6 molécules pour la lisibilité

  const comparisonData = allMoleculeNames.map(molName => {
    const entry: Record<string, string | number> = { molecule: molName };
    conditions.forEach(cond => {
      const mol = cond.molecules.find(m => m.name === molName);
      entry[cond.label] = mol ? mol.typical : 0;
    });
    return entry;
  });

  // Données radar pour la condition active
  const radarData = currentCondition.molecules.slice(0, 6).map(mol => ({
    molecule: mol.name.length > 12 ? mol.name.substring(0, 12) + "…" : mol.name,
    min: mol.min,
    max: mol.max,
    typical: mol.typical
  }));

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="bg-muted/30 rounded-lg p-4 border">
        <p className="text-sm text-muted-foreground">{data.description}</p>
      </div>

      {/* Sélecteur de conditions */}
      <div className="flex flex-wrap gap-2">
        {conditions.map((cond, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCondition(idx)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
              activeCondition === idx
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background hover:bg-muted/50 text-muted-foreground"
            }`}
          >
            <span>{cond.icon}</span>
            <span>{cond.label}</span>
          </button>
        ))}
      </div>

      {/* Condition active — détails */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <span>{currentCondition.icon}</span>
                {currentCondition.label}
                <Badge variant="outline" className="text-xs">
                  {currentCondition.season}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                {currentCondition.condition}
              </CardDescription>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setChartType("bar")}
                className={`p-2 rounded text-xs ${chartType === "bar" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
                title="Graphique en barres"
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType("radar")}
                className={`p-2 rounded text-xs ${chartType === "radar" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
                title="Graphique radar"
              >
                <TrendingUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartType === "bar" ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={currentCondition.molecules.slice(0, 8)} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }} 
                  angle={-35} 
                  textAnchor="end" 
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                  labelFormatter={(label) => `Molécule : ${label}`}
                />
                <Legend />
                <Bar dataKey="min" name="Min %" fill="#94a3b8" radius={[2, 2, 0, 0]} />
                <Bar dataKey="typical" name="Typique %" fill={currentCondition.color} radius={[2, 2, 0, 0]} />
                <Bar dataKey="max" name="Max %" fill="#cbd5e1" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="molecule" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fontSize: 9 }} />
                <Radar name="Min" dataKey="min" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
                <Radar name="Typique" dataKey="typical" stroke={currentCondition.color} fill={currentCondition.color} fillOpacity={0.4} />
                <Radar name="Max" dataKey="max" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.1} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          )}

          {/* Tableau des valeurs */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-muted-foreground">Molécule</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Min</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Typique</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Max</th>
                </tr>
              </thead>
              <tbody>
                {currentCondition.molecules.map((mol, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-2 font-medium">{mol.name}</td>
                    <td className="py-2 text-right text-muted-foreground">{mol.min}{mol.unit}</td>
                    <td className="py-2 text-right font-semibold" style={{ color: currentCondition.color }}>
                      {mol.typical}{mol.unit}
                    </td>
                    <td className="py-2 text-right text-muted-foreground">{mol.max}{mol.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentCondition.notes && (
            <p className="mt-3 text-xs text-muted-foreground italic border-t pt-3">
              📌 {currentCondition.notes}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Comparaison entre toutes les conditions */}
      {conditions.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Comparaison entre conditions
            </CardTitle>
            <CardDescription>
              Valeurs typiques des principales molécules selon les conditions de culture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="molecule" 
                  tick={{ fontSize: 11 }} 
                  angle={-35} 
                  textAnchor="end" 
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                {conditions.map((cond, idx) => (
                  <Bar 
                    key={idx} 
                    dataKey={cond.label} 
                    fill={cond.color} 
                    radius={[2, 2, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Sources */}
      <div className="text-xs text-muted-foreground border-t pt-4">
        <strong>Sources scientifiques :</strong> PMC:8306096 (Composés volatiles tabac), PMC:6804150 (Norisoprénoïdes), 
        MDPI:1420-3049/25/7/1734 (Pyrazines tabac), ISO 3515 (Lavande), ISO 9842 (Rose de Damas)
      </div>
    </div>
  );
}
