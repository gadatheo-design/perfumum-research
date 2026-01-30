import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Leaf, FlaskConical, BarChart3, Radar, Info } from "lucide-react";
import * as d3 from "d3";

// Couleurs pour les landraces
const LANDRACE_COLORS: Record<string, string> = {
  "Basma": "#E91E63",
  "Latakia": "#795548",
  "Perique": "#9C27B0",
  "Corojo Original": "#FF5722",
  "Virginia": "#FFC107",
  "Izmir": "#00BCD4",
  "Yenidje": "#4CAF50",
  "Estelí": "#3F51B5",
  "Cameroun": "#FF9800",
  "Sumatra": "#607D8B",
  "Connecticut": "#8BC34A",
  "Djebel": "#009688"
};

// Catégories de terpènes
const TERPENE_CATEGORIES = [
  { id: "all", name: "Tous", color: "#6366f1" },
  { id: "monoterpene", name: "Monoterpènes", color: "#22c55e" },
  { id: "sesquiterpene", name: "Sesquiterpènes", color: "#f59e0b" },
  { id: "norisoprenoid", name: "Norisoprénoïdes", color: "#ec4899" },
  { id: "phenol", name: "Phénols", color: "#8b5cf6" },
  { id: "lactone", name: "Lactones", color: "#06b6d4" },
  { id: "indole", name: "Indoles", color: "#ef4444" }
];

interface TerpeneProfile {
  id: number;
  landrace_name: string;
  terpene_name: string;
  terpene_category: string;
  concentration_ppm: number;
  relative_abundance: number;
  olfactory_contribution: string;
}

// Composant Radar Chart D3.js
function RadarChart({ 
  data, 
  selectedLandraces,
  width = 500, 
  height = 500 
}: { 
  data: TerpeneProfile[];
  selectedLandraces: string[];
  width?: number;
  height?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0 || selectedLandraces.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = 80;
    const radius = Math.min(width, height) / 2 - margin;
    const centerX = width / 2;
    const centerY = height / 2;

    // Obtenir tous les terpènes uniques
    const allTerpenes = [...new Set(data.map(d => d.terpene_name))];
    const angleSlice = (Math.PI * 2) / allTerpenes.length;

    // Échelle radiale
    const maxValue = d3.max(data, d => d.relative_abundance) || 30;
    const rScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, radius]);

    // Groupe principal
    const g = svg.append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    // Grille circulaire
    const levels = 5;
    for (let level = 1; level <= levels; level++) {
      const levelRadius = (radius / levels) * level;
      g.append("circle")
        .attr("r", levelRadius)
        .attr("fill", "none")
        .attr("stroke", "#374151")
        .attr("stroke-width", 0.5)
        .attr("stroke-dasharray", "3,3");

      // Labels de niveau
      g.append("text")
        .attr("x", 5)
        .attr("y", -levelRadius)
        .attr("fill", "#9ca3af")
        .attr("font-size", "10px")
        .text(`${Math.round((maxValue / levels) * level)}%`);
    }

    // Axes
    allTerpenes.forEach((terpene, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Ligne d'axe
      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#374151")
        .attr("stroke-width", 1);

      // Label
      const labelX = Math.cos(angle) * (radius + 20);
      const labelY = Math.sin(angle) * (radius + 20);
      
      g.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", angle > Math.PI / 2 || angle < -Math.PI / 2 ? "end" : "start")
        .attr("dominant-baseline", "middle")
        .attr("fill", "#d1d5db")
        .attr("font-size", "11px")
        .text(terpene.length > 15 ? terpene.substring(0, 15) + "..." : terpene);
    });

    // Dessiner les polygones pour chaque landrace sélectionnée
    selectedLandraces.forEach(landrace => {
      const landraceData = data.filter(d => d.landrace_name === landrace);
      if (landraceData.length === 0) return;

      const color = LANDRACE_COLORS[landrace] || "#6366f1";

      // Créer les points du polygone
      const points = allTerpenes.map((terpene, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const profile = landraceData.find(d => d.terpene_name === terpene);
        const value = profile ? profile.relative_abundance : 0;
        return {
          x: Math.cos(angle) * rScale(value),
          y: Math.sin(angle) * rScale(value)
        };
      });

      // Ligne du polygone
      const lineGenerator = d3.lineRadial<{ x: number; y: number }>()
        .angle((_, i) => angleSlice * i)
        .radius(d => Math.sqrt(d.x * d.x + d.y * d.y))
        .curve(d3.curveLinearClosed);

      // Zone remplie
      g.append("path")
        .datum(points)
        .attr("d", d3.line<{ x: number; y: number }>()
          .x(d => d.x)
          .y(d => d.y)
          .curve(d3.curveLinearClosed))
        .attr("fill", color)
        .attr("fill-opacity", 0.15)
        .attr("stroke", color)
        .attr("stroke-width", 2);

      // Points
      points.forEach((point, i) => {
        const profile = landraceData.find(d => d.terpene_name === allTerpenes[i]);
        if (profile && profile.relative_abundance > 0) {
          g.append("circle")
            .attr("cx", point.x)
            .attr("cy", point.y)
            .attr("r", 4)
            .attr("fill", color)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .style("cursor", "pointer")
            .append("title")
            .text(`${landrace}\n${profile.terpene_name}: ${profile.relative_abundance}%\n${profile.concentration_ppm} ppm`);
        }
      });
    });

  }, [data, selectedLandraces, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
}

// Composant Bar Chart comparatif
function ComparisonBarChart({
  data,
  selectedLandraces,
  selectedTerpene
}: {
  data: TerpeneProfile[];
  selectedLandraces: string[];
  selectedTerpene: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !selectedTerpene) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };

    const filteredData = data.filter(d => 
      d.terpene_name === selectedTerpene && 
      selectedLandraces.includes(d.landrace_name)
    ).sort((a, b) => b.concentration_ppm - a.concentration_ppm);

    if (filteredData.length === 0) return;

    const x = d3.scaleBand()
      .domain(filteredData.map(d => d.landrace_name))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d.concentration_ppm) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("fill", "#d1d5db");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("fill", "#d1d5db");

    // Barres
    svg.selectAll(".bar")
      .data(filteredData)
      .join("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.landrace_name) || 0)
      .attr("y", d => y(d.concentration_ppm))
      .attr("width", x.bandwidth())
      .attr("height", d => height - margin.bottom - y(d.concentration_ppm))
      .attr("fill", d => LANDRACE_COLORS[d.landrace_name] || "#6366f1")
      .attr("rx", 4);

    // Labels de valeur
    svg.selectAll(".label")
      .data(filteredData)
      .join("text")
      .attr("class", "label")
      .attr("x", d => (x(d.landrace_name) || 0) + x.bandwidth() / 2)
      .attr("y", d => y(d.concentration_ppm) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#d1d5db")
      .attr("font-size", "11px")
      .text(d => `${d.concentration_ppm} ppm`);

    // Titre Y
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 15)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#9ca3af")
      .attr("font-size", "12px")
      .text("Concentration (ppm)");

  }, [data, selectedLandraces, selectedTerpene]);

  return <svg ref={svgRef} width={600} height={300} />;
}

export default function TerpeneProfiles() {
  const [selectedLandraces, setSelectedLandraces] = useState<string[]>(["Basma", "Latakia", "Perique"]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTerpene, setSelectedTerpene] = useState<string>("");
  const [activeTab, setActiveTab] = useState("radar");

  // Récupérer les profils terpéniques
  const { data: profiles, isLoading } = trpc.tobacco.getTerpeneProfiles.useQuery();

  // Filtrer par catégorie
  const filteredProfiles = profiles?.filter(p => {
    if (selectedCategory === "all") return true;
    const category = p.terpene_category?.toLowerCase() || "";
    if (selectedCategory === "monoterpene") return category.includes("monoterpène") || category.includes("monoterpene");
    if (selectedCategory === "sesquiterpene") return category.includes("sesquiterpène") || category.includes("sesquiterpene");
    if (selectedCategory === "norisoprenoid") return category.includes("norisoprénoïde") || category.includes("norisopreno");
    if (selectedCategory === "phenol") return category.includes("phénol") || category.includes("phenol");
    if (selectedCategory === "lactone") return category.includes("lactone");
    if (selectedCategory === "indole") return category.includes("indole");
    return true;
  }) || [];

  // Obtenir les landraces uniques
  const uniqueLandraces = [...new Set(profiles?.map(p => p.landrace_name) || [])];
  
  // Obtenir les terpènes uniques
  const uniqueTerpenes = [...new Set(filteredProfiles.map(p => p.terpene_name))];

  const toggleLandrace = (landrace: string) => {
    setSelectedLandraces(prev => 
      prev.includes(landrace) 
        ? prev.filter(l => l !== landrace)
        : [...prev, landrace]
    );
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
            <Leaf className="h-8 w-8 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Profils Terpéniques</h1>
            <p className="text-muted-foreground">Analyse comparative des terpènes par landrace de tabac</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
            <FlaskConical className="h-3 w-3 mr-1" />
            {profiles?.length || 0} profils
          </Badge>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
            <Leaf className="h-3 w-3 mr-1" />
            {uniqueLandraces.length} landraces
          </Badge>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
            <BarChart3 className="h-3 w-3 mr-1" />
            {uniqueTerpenes.length} terpènes
          </Badge>
        </div>
      </div>

      {/* Sélection des landraces */}
      <Card className="mb-6 bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-400" />
            Sélection des Landraces
          </CardTitle>
          <CardDescription>Cliquez pour ajouter ou retirer une landrace de la comparaison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {uniqueLandraces.map(landrace => (
              <Button
                key={landrace}
                variant={selectedLandraces.includes(landrace) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleLandrace(landrace)}
                style={{
                  backgroundColor: selectedLandraces.includes(landrace) 
                    ? LANDRACE_COLORS[landrace] || "#6366f1"
                    : "transparent",
                  borderColor: LANDRACE_COLORS[landrace] || "#6366f1",
                  color: selectedLandraces.includes(landrace) ? "#fff" : LANDRACE_COLORS[landrace] || "#6366f1"
                }}
              >
                {landrace}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtres par catégorie */}
      <Card className="mb-6 bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-purple-400" />
            Filtrer par Famille
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {TERPENE_CATEGORIES.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  backgroundColor: selectedCategory === cat.id ? cat.color : "transparent",
                  borderColor: cat.color,
                  color: selectedCategory === cat.id ? "#fff" : cat.color
                }}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visualisations */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="radar" className="flex items-center gap-2">
            <Radar className="h-4 w-4" />
            Radar Chart
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Comparaison
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Tableau
          </TabsTrigger>
        </TabsList>

        <TabsContent value="radar">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Radar Chart Comparatif</CardTitle>
              <CardDescription>
                Visualisation des profils terpéniques par landrace
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {selectedLandraces.length > 0 ? (
                <RadarChart 
                  data={filteredProfiles} 
                  selectedLandraces={selectedLandraces}
                  width={600}
                  height={600}
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Sélectionnez au moins une landrace pour afficher le radar chart
                </div>
              )}
            </CardContent>
          </Card>

          {/* Légende */}
          <Card className="mt-4 bg-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Légende</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {selectedLandraces.map(landrace => (
                  <div key={landrace} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: LANDRACE_COLORS[landrace] || "#6366f1" }}
                    />
                    <span className="text-sm">{landrace}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Comparaison par Terpène</CardTitle>
              <CardDescription>
                Sélectionnez un terpène pour comparer les concentrations entre landraces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={selectedTerpene} onValueChange={setSelectedTerpene}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Sélectionner un terpène" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueTerpenes.map(terpene => (
                      <SelectItem key={terpene} value={terpene}>
                        {terpene}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedTerpene ? (
                <div className="flex justify-center">
                  <ComparisonBarChart 
                    data={filteredProfiles}
                    selectedLandraces={selectedLandraces}
                    selectedTerpene={selectedTerpene}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Sélectionnez un terpène pour afficher la comparaison
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Données Détaillées</CardTitle>
              <CardDescription>
                Tableau complet des profils terpéniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4">Landrace</th>
                      <th className="text-left py-3 px-4">Terpène</th>
                      <th className="text-left py-3 px-4">Catégorie</th>
                      <th className="text-right py-3 px-4">Concentration (ppm)</th>
                      <th className="text-right py-3 px-4">Abondance (%)</th>
                      <th className="text-left py-3 px-4">Contribution Olfactive</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProfiles
                      .filter(p => selectedLandraces.includes(p.landrace_name))
                      .sort((a, b) => b.concentration_ppm - a.concentration_ppm)
                      .map((profile, idx) => (
                        <tr key={idx} className="border-b border-border/30 hover:bg-muted/30">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: LANDRACE_COLORS[profile.landrace_name] || "#6366f1" }}
                              />
                              {profile.landrace_name}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">{profile.terpene_name}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-xs">
                              {profile.terpene_category}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            {profile.concentration_ppm?.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            {profile.relative_abundance?.toFixed(1)}%
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-xs max-w-xs truncate">
                            {profile.olfactory_contribution}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
