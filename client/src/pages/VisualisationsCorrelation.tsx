// @ts-nocheck
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  TrendingUp, 
  BarChart3, 
  Grid3X3,
  Info
} from "lucide-react";

// Couleurs pour les classes chimiques
const CHEMICAL_CLASS_COLORS: Record<string, string> = {
  terpene: "#22c55e",
  sesquiterpene: "#16a34a",
  diterpene: "#15803d",
  monoterpene: "#4ade80",
  aldehyde: "#f59e0b",
  ketone: "#d97706",
  alcohol: "#3b82f6",
  ester: "#8b5cf6",
  ether: "#a855f7",
  phenol: "#ec4899",
  lactone: "#f43f5e",
  coumarin: "#ef4444",
  musk: "#78716c",
  nitrile: "#06b6d4",
  sulfur_compound: "#eab308",
  heterocyclic: "#14b8a6",
  aromatic: "#f97316",
  aliphatic: "#64748b",
  other: "#94a3b8",
};

const PROPERTY_LABELS: Record<string, string> = {
  molecularWeight: "Masse moléculaire (g/mol)",
  boilingPoint: "Point d'ébullition (°C)",
  logP: "LogP (×100)",
  complexity: "Complexité",
  intensity: "Intensité olfactive",
  volatility: "Volatilité",
};

export default function VisualisationsCorrelation() {
  const [propertyX, setPropertyX] = useState<string>("molecularWeight");
  const [propertyY, setPropertyY] = useState<string>("boilingPoint");

  // Données pour le scatter plot masse vs point d'ébullition
  const { data: scatterData } = trpc.visualizations.getMolecularWeightVsBoilingPoint.useQuery();
  
  // Données pour la heatmap classe chimique vs famille olfactive
  const { data: heatmapData } = trpc.visualizations.getChemicalClassVsOlfactiveFamily.useQuery();
  
  // Données pour la corrélation personnalisée
  const { data: correlationData } = trpc.visualizations.getPropertyCorrelation.useQuery({
    propertyX: propertyX as any,
    propertyY: propertyY as any,
  });
  
  // Statistiques par classe chimique
  const { data: classStats } = trpc.visualizations.getStatsByChemicalClass.useQuery();

  // Préparer les données pour le bar chart des classes chimiques
  const classStatsArray = classStats 
    ? Object.entries(classStats).map(([name, stats]) => ({
        name,
        count: stats.count,
        avgMolecularWeight: stats.avgMolecularWeight,
        avgBoilingPoint: stats.avgBoilingPoint,
        color: CHEMICAL_CLASS_COLORS[name] || "#94a3b8",
      })).sort((a, b) => b.count - a.count)
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8 max-w-7xl">
      <div className="flex items-center gap-4 mb-8">
        <TrendingUp className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Visualisations de Corrélation</h1>
          <p className="text-muted-foreground">
            Analyser les relations entre les propriétés moléculaires
          </p>
        </div>
      </div>

      <Tabs defaultValue="scatter" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scatter" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Masse vs Ébullition
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Corrélation Personnalisée
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Classes vs Familles
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        {/* Scatter Plot: Masse moléculaire vs Point d'ébullition */}
        <TabsContent value="scatter">
          <Card>
            <CardHeader>
              <CardTitle>Masse Moléculaire vs Point d'Ébullition</CardTitle>
              <CardDescription>
                Relation entre la masse moléculaire et le point d'ébullition, coloré par classe chimique
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scatterData && scatterData.length > 0 ? (
                <>
                  <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          dataKey="molecularWeight" 
                          name="Masse moléculaire"
                          unit=" g/mol"
                          label={{ value: "Masse moléculaire (g/mol)", position: "bottom", offset: 40 }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="boilingPoint" 
                          name="Point d'ébullition"
                          unit="°C"
                          label={{ value: "Point d'ébullition (°C)", angle: -90, position: "left", offset: 40 }}
                        />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border rounded-lg p-3 shadow-lg">
                                  <p className="font-medium">{data.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Masse: {data.molecularWeight} g/mol
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Ébullition: {data.boilingPoint}°C
                                  </p>
                                  <Badge 
                                    variant="outline" 
                                    style={{ backgroundColor: CHEMICAL_CLASS_COLORS[data.chemicalClass] + "20" }}
                                  >
                                    {data.chemicalClass}
                                  </Badge>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend />
                        {Object.keys(CHEMICAL_CLASS_COLORS).map(chemClass => {
                          const classData = scatterData.filter(d => d.chemicalClass === chemClass);
                          if (classData.length === 0) return null;
                          return (
                            <Scatter
                              key={chemClass}
                              name={chemClass}
                              data={classData}
                              fill={CHEMICAL_CLASS_COLORS[chemClass]}
                            />
                          );
                        })}
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    {scatterData.length} molécules avec données complètes
                  </p>
                </>
              ) : (
                <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                  Aucune donnée disponible
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Corrélation personnalisée */}
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Corrélation Personnalisée</CardTitle>
              <CardDescription>
                Sélectionnez deux propriétés pour analyser leur corrélation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Axe X</label>
                  <Select value={propertyX} onValueChange={setPropertyX}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROPERTY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Axe Y</label>
                  <Select value={propertyY} onValueChange={setPropertyY}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROPERTY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {correlationData && correlationData.points.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Coefficient de corrélation</p>
                        <p className="text-2xl font-bold">
                          r = {correlationData.correlation}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">R² (coefficient de détermination)</p>
                        <p className="text-2xl font-bold">
                          R² = {correlationData.rSquared}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Points de données</p>
                        <p className="text-2xl font-bold">
                          {correlationData.points.length}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          dataKey="x" 
                          name={PROPERTY_LABELS[propertyX]}
                          label={{ value: PROPERTY_LABELS[propertyX], position: "bottom", offset: 40 }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="y" 
                          name={PROPERTY_LABELS[propertyY]}
                          label={{ value: PROPERTY_LABELS[propertyY], angle: -90, position: "left", offset: 40 }}
                        />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border rounded-lg p-3 shadow-lg">
                                  <p className="font-medium">{data.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {PROPERTY_LABELS[propertyX]}: {data.x}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {PROPERTY_LABELS[propertyY]}: {data.y}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter 
                          data={correlationData.points} 
                          fill="#3b82f6"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  Aucune donnée disponible pour ces propriétés
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Heatmap: Classes chimiques vs Familles olfactives */}
        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Classes Chimiques vs Familles Olfactives</CardTitle>
              <CardDescription>
                Distribution des molécules par classe chimique et famille olfactive
              </CardDescription>
            </CardHeader>
            <CardContent>
              {heatmapData && heatmapData.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="p-2 text-left font-medium">Classe / Famille</th>
                        {heatmapData.families.slice(0, 10).map(family => (
                          <th key={family} className="p-2 text-center font-medium text-xs">
                            {family.substring(0, 15)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {heatmapData.chemicalClasses.map(chemClass => (
                        <tr key={chemClass}>
                          <td className="p-2 font-medium">
                            <Badge 
                              variant="outline"
                              style={{ backgroundColor: CHEMICAL_CLASS_COLORS[chemClass] + "20" }}
                            >
                              {chemClass}
                            </Badge>
                          </td>
                          {heatmapData.families.slice(0, 10).map(family => {
                            const cell = heatmapData.data.find(
                              d => d.chemicalClass === chemClass && d.family === family
                            );
                            const count = cell?.count || 0;
                            const maxCount = Math.max(...heatmapData.data.map(d => d.count));
                            const intensity = count / maxCount;
                            
                            return (
                              <td 
                                key={family} 
                                className="p-2 text-center"
                                style={{
                                  backgroundColor: count > 0 
                                    ? `rgba(59, 130, 246, ${intensity * 0.8})` 
                                    : "transparent",
                                  color: intensity > 0.5 ? "white" : "inherit"
                                }}
                              >
                                {count > 0 ? count : "-"}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  Aucune donnée disponible
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistiques par classe chimique */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques par Classe Chimique</CardTitle>
              <CardDescription>
                Distribution et moyennes des propriétés par classe chimique
              </CardDescription>
            </CardHeader>
            <CardContent>
              {classStatsArray.length > 0 ? (
                <>
                  <div className="h-[400px] mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={classStatsArray} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end" 
                          height={80}
                          interval={0}
                        />
                        <YAxis label={{ value: "Nombre de molécules", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Bar dataKey="count" name="Nombre de molécules">
                          {classStatsArray.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classStatsArray.slice(0, 9).map(stat => (
                      <Card key={stat.name}>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: stat.color }}
                            />
                            <span className="font-medium capitalize">{stat.name}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Molécules</p>
                              <p className="font-medium">{stat.count}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Masse moy.</p>
                              <p className="font-medium">{stat.avgMolecularWeight || "N/A"} g/mol</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-muted-foreground">Ébullition moy.</p>
                              <p className="font-medium">{stat.avgBoilingPoint || "N/A"}°C</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  Aucune donnée disponible
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </main>
      <Footer />
    </div>
  );
}
