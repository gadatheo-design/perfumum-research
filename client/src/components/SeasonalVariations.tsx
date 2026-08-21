// @ts-nocheck
/**
 * SeasonalVariations — Composant de visualisation des variations saisonnières
 * Affiche les variations de composition moléculaire selon les saisons/conditions de culture
 * Utilise les données réelles de la table seasonal_variations via tRPC
 * Fallback : données statiques pour les plantes non encore documentées en base
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Info,
  BarChart3,
  TrendingUp,
  Loader2,
  Database,
  Leaf
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
import { trpc } from "@/lib/trpc";

// Couleurs pour les graphiques
const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

const SEASON_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  printemps: { label: "Printemps", icon: "🌱", color: "#22c55e" },
  ete:       { label: "Été",       icon: "☀️", color: "#f59e0b" },
  automne:   { label: "Automne",   icon: "🍂", color: "#f97316" },
  hiver:     { label: "Hiver",     icon: "❄️", color: "#60a5fa" },
};

interface SeasonalVariationsProps {
  plantName: string;
  plantId: number;
}

export function SeasonalVariations({ plantName, plantId }: SeasonalVariationsProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [chartType, setChartType] = useState<"bar" | "radar">("bar");

  // Récupérer les données réelles depuis la base
  const { data: dbVariations, isLoading } = trpc.plants.getSeasonalVariations.useQuery(plantId, {
    enabled: !!plantId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Loader2 className="h-8 w-8 text-muted-foreground mb-4 animate-spin" />
        <p className="text-sm text-muted-foreground">Chargement des variations saisonnières…</p>
      </div>
    );
  }

  // Aucune donnée en base
  if (!dbVariations || dbVariations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Info className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-muted-foreground">Aucune donnée saisonnière</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Les variations saisonnières pour <strong>{plantName}</strong> ne sont pas encore documentées.
          Les données prioritaires concernent les tabacs (Virginia, Burley, Latakia), le Jasmin, le Vétiver et le Cannabis.
        </p>
      </div>
    );
  }

  const currentVariation = dbVariations[activeIdx] ?? dbVariations[0];
  const seasonMeta = SEASON_LABELS[currentVariation.season] ?? { label: currentVariation.season, icon: "🌿", color: "#6366f1" };

  // Préparer les données pour le graphique de la condition active
  const keyMolecules: Array<{ name: string; percentage: number; variation?: string }> = 
    Array.isArray(currentVariation.keyMolecules) ? currentVariation.keyMolecules : [];

  const barData = keyMolecules.map(mol => ({
    name: mol.name,
    percentage: mol.percentage ?? 0,
  }));

  // Données comparatives entre toutes les saisons
  const allMolNames = [...new Set(
    dbVariations.flatMap(v => 
      (Array.isArray(v.keyMolecules) ? v.keyMolecules : []).map((m: any) => m.name)
    )
  )].slice(0, 6);

  const comparisonData = allMolNames.map(molName => {
    const entry: Record<string, string | number> = { molecule: molName };
    dbVariations.forEach(v => {
      const mols = Array.isArray(v.keyMolecules) ? v.keyMolecules : [];
      const mol = mols.find((m: any) => m.name === molName);
      const meta = SEASON_LABELS[v.season] ?? { label: v.season };
      entry[meta.label] = mol ? (mol.percentage ?? 0) : 0;
    });
    return entry;
  });

  // Données radar pour la condition active
  const radarData = keyMolecules.slice(0, 6).map(mol => ({
    molecule: mol.name.length > 12 ? mol.name.substring(0, 12) + "…" : mol.name,
    percentage: mol.percentage ?? 0,
  }));

  return (
    <div className="space-y-6">
      {/* Badge source */}
      <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-3 border text-xs text-muted-foreground">
        <Database className="h-4 w-4 text-primary flex-shrink-0" />
        <span>
          <strong>{dbVariations.length} variation{dbVariations.length > 1 ? "s" : ""}</strong> documentée{dbVariations.length > 1 ? "s" : ""} en base pour <strong>{plantName}</strong>.
          {currentVariation.extractionNotes && (
            <span className="ml-1 italic">{currentVariation.extractionNotes}</span>
          )}
        </span>
      </div>

      {/* Sélecteur de saisons */}
      <div className="flex flex-wrap gap-2">
        {dbVariations.map((v, idx) => {
          const meta = SEASON_LABELS[v.season] ?? { label: v.season, icon: "🌿", color: "#6366f1" };
          return (
            <button
              key={v.id}
              onClick={() => setActiveIdx(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                activeIdx === idx
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <span>{meta.icon}</span>
              <span>{meta.label}</span>
              {v.qualityScore != null && (
                <Badge variant="secondary" className="text-xs ml-1">
                  Q: {v.qualityScore}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Détails de la saison active */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <span>{seasonMeta.icon}</span>
                {seasonMeta.label}
                {currentVariation.harvestPeriod && (
                  <Badge variant="outline" className="text-xs">
                    {currentVariation.harvestPeriod}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1 space-y-1">
                {currentVariation.temperatureRange && (
                  <span className="mr-3">🌡 {currentVariation.temperatureRange}</span>
                )}
                {currentVariation.humidityRange && (
                  <span>💧 {currentVariation.humidityRange}</span>
                )}
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
          {keyMolecules.length > 0 ? (
            <>
              {chartType === "bar" ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11 }} 
                      angle={-35} 
                      textAnchor="end" 
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, "Teneur"]}
                      labelFormatter={(label) => `Molécule : ${label}`}
                    />
                    <Bar dataKey="percentage" name="Teneur %" fill={seasonMeta.color} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="molecule" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fontSize: 9 }} unit="%" />
                    <Radar 
                      name="Teneur %" 
                      dataKey="percentage" 
                      stroke={seasonMeta.color} 
                      fill={seasonMeta.color} 
                      fillOpacity={0.4} 
                    />
                    <Legend />
                    <Tooltip formatter={(v: number) => [`${v}%`, "Teneur"]} />
                  </RadarChart>
                </ResponsiveContainer>
              )}

              {/* Tableau des molécules clés */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground">Molécule</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Teneur</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Variation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keyMolecules.map((mol: any, idx: number) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-2 font-medium">{mol.name}</td>
                        <td className="py-2 text-right font-semibold" style={{ color: seasonMeta.color }}>
                          {mol.percentage}%
                        </td>
                        <td className="py-2 text-right text-xs text-muted-foreground">
                          {mol.variation ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
              <Leaf className="h-5 w-5 mr-2 opacity-50" />
              Aucune molécule clé renseignée pour cette saison.
            </div>
          )}

          {currentVariation.notes && (
            <p className="mt-3 text-xs text-muted-foreground italic border-t pt-3">
              📌 {currentVariation.notes}
            </p>
          )}

          {currentVariation.yieldModifier != null && (
            <p className="mt-2 text-xs text-muted-foreground">
              {/* `currentVariation` est l'objet, pas le nombre : `.toFixed()`
                  dessus lève un TypeError dès qu'un modificateur est renseigné. */}
              📊 Modificateur de rendement : <strong>×{currentVariation.yieldModifier.toFixed(2)}</strong>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Comparaison entre toutes les saisons */}
      {dbVariations.length > 1 && comparisonData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Comparaison entre saisons
            </CardTitle>
            <CardDescription>
              Teneurs des principales molécules selon la saison de récolte
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
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip formatter={(v: number) => [`${v}%`, ""]} />
                <Legend />
                {dbVariations.map((v, idx) => {
                  const meta = SEASON_LABELS[v.season] ?? { label: v.season, color: COLORS[idx % COLORS.length] };
                  return (
                    <Bar 
                      key={v.id} 
                      dataKey={meta.label} 
                      fill={meta.color} 
                      radius={[2, 2, 0, 0]}
                    />
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
