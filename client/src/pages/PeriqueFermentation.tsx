import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Thermometer, 
  Droplets, 
  FlaskConical, 
  Leaf, 
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";
import * as d3 from "d3";

// Couleurs pour les stages
const STAGE_COLORS = [
  "#22c55e", // Vert - Récolte
  "#84cc16", // Lime - Séchage initial
  "#eab308", // Jaune - Pression initiale
  "#f59e0b", // Ambre - Fermentation primaire
  "#f97316", // Orange - Fermentation secondaire
  "#ef4444", // Rouge - Maturation
  "#9333ea"  // Violet - Affinage final
];

interface FermentationStage {
  id: number;
  stage_number: number;
  stage_name: string;
  duration_months: number;
  month_start: number;
  month_end: number;
  temperature_min: number;
  temperature_max: number;
  humidity_min: number;
  humidity_max: number;
  ph_level: number;
  key_enzymes: string;
  compounds_formed: string;
  compounds_degraded: string;
  olfactory_changes: string;
  description: string;
}

// Composant Timeline D3.js
function FermentationTimeline({ 
  stages, 
  currentStage, 
  onStageClick 
}: { 
  stages: FermentationStage[];
  currentStage: number;
  onStageClick: (stage: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || stages.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 900;
    const height = 200;
    const margin = { top: 40, right: 40, bottom: 60, left: 40 };

    // Échelle X pour les mois
    const xScale = d3.scaleLinear()
      .domain([0, 12])
      .range([margin.left, width - margin.right]);

    // Groupe principal
    const g = svg.append("g");

    // Axe des mois
    const monthLabels = ["Récolte", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"];
    
    g.selectAll(".month-label")
      .data(monthLabels)
      .join("text")
      .attr("class", "month-label")
      .attr("x", (_, i) => xScale(i))
      .attr("y", height - 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#9ca3af")
      .attr("font-size", "11px")
      .text(d => d);

    // Ligne de base
    g.append("line")
      .attr("x1", margin.left)
      .attr("y1", height / 2)
      .attr("x2", width - margin.right)
      .attr("y2", height / 2)
      .attr("stroke", "#374151")
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round");

    // Barres de stages
    stages.forEach((stage, i) => {
      const x1 = xScale(stage.month_start);
      const x2 = xScale(stage.month_end);
      const isActive = stage.stage_number === currentStage;

      // Barre de stage
      g.append("rect")
        .attr("x", x1)
        .attr("y", height / 2 - 15)
        .attr("width", x2 - x1)
        .attr("height", 30)
        .attr("fill", STAGE_COLORS[i] || "#6366f1")
        .attr("fill-opacity", isActive ? 1 : 0.5)
        .attr("rx", 6)
        .attr("stroke", isActive ? "#fff" : "none")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("click", () => onStageClick(stage.stage_number))
        .append("title")
        .text(`${stage.stage_name}\nMois ${stage.month_start}-${stage.month_end}`);

      // Label du stage
      const centerX = (x1 + x2) / 2;
      g.append("text")
        .attr("x", centerX)
        .attr("y", height / 2 + 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .attr("font-size", "10px")
        .attr("font-weight", isActive ? "bold" : "normal")
        .style("pointer-events", "none")
        .text(stage.stage_name.length > 12 ? stage.stage_name.substring(0, 10) + "..." : stage.stage_name);

      // Marqueur de point
      g.append("circle")
        .attr("cx", x1)
        .attr("cy", height / 2)
        .attr("r", isActive ? 8 : 5)
        .attr("fill", STAGE_COLORS[i] || "#6366f1")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);
    });

    // Titre
    g.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#d1d5db")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text("Timeline de Fermentation du Perique — 12 Mois");

  }, [stages, currentStage, onStageClick]);

  return <svg ref={svgRef} width={900} height={200} className="w-full" />;
}

// Composant Graphique des paramètres
function ParametersChart({ stages }: { stages: FermentationStage[] }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || stages.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 300;
    const margin = { top: 30, right: 60, bottom: 50, left: 60 };

    // Échelles
    const xScale = d3.scaleLinear()
      .domain([0, 12])
      .range([margin.left, width - margin.right]);

    const yTempScale = d3.scaleLinear()
      .domain([20, 45])
      .range([height - margin.bottom, margin.top]);

    const yPhScale = d3.scaleLinear()
      .domain([3, 7])
      .range([height - margin.bottom, margin.top]);

    const g = svg.append("g");

    // Grille
    for (let i = 0; i <= 12; i++) {
      g.append("line")
        .attr("x1", xScale(i))
        .attr("y1", margin.top)
        .attr("x2", xScale(i))
        .attr("y2", height - margin.bottom)
        .attr("stroke", "#374151")
        .attr("stroke-width", 0.5)
        .attr("stroke-dasharray", "3,3");
    }

    // Axe X
    g.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(12).tickFormat(d => `M${d}`))
      .selectAll("text")
      .attr("fill", "#9ca3af");

    // Axe Y gauche (Température)
    g.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yTempScale))
      .selectAll("text")
      .attr("fill", "#ef4444");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 15)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#ef4444")
      .attr("font-size", "11px")
      .text("Température (°C)");

    // Axe Y droite (pH)
    g.append("g")
      .attr("transform", `translate(${width - margin.right},0)`)
      .call(d3.axisRight(yPhScale))
      .selectAll("text")
      .attr("fill", "#22c55e");

    g.append("text")
      .attr("transform", "rotate(90)")
      .attr("y", -width + 15)
      .attr("x", height / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#22c55e")
      .attr("font-size", "11px")
      .text("pH");

    // Données pour les courbes
    const tempData = stages.map(s => ({
      month: (s.month_start + s.month_end) / 2,
      value: (s.temperature_min + s.temperature_max) / 2
    }));

    const phData = stages.map(s => ({
      month: (s.month_start + s.month_end) / 2,
      value: s.ph_level
    }));

    // Ligne de température
    const tempLine = d3.line<{ month: number; value: number }>()
      .x(d => xScale(d.month))
      .y(d => yTempScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(tempData)
      .attr("fill", "none")
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 2)
      .attr("d", tempLine);

    // Points de température
    g.selectAll(".temp-point")
      .data(tempData)
      .join("circle")
      .attr("class", "temp-point")
      .attr("cx", d => xScale(d.month))
      .attr("cy", d => yTempScale(d.value))
      .attr("r", 4)
      .attr("fill", "#ef4444");

    // Ligne de pH
    const phLine = d3.line<{ month: number; value: number }>()
      .x(d => xScale(d.month))
      .y(d => yPhScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(phData)
      .attr("fill", "none")
      .attr("stroke", "#22c55e")
      .attr("stroke-width", 2)
      .attr("d", phLine);

    // Points de pH
    g.selectAll(".ph-point")
      .data(phData)
      .join("circle")
      .attr("class", "ph-point")
      .attr("cx", d => xScale(d.month))
      .attr("cy", d => yPhScale(d.value))
      .attr("r", 4)
      .attr("fill", "#22c55e");

    // Légende
    const legend = g.append("g")
      .attr("transform", `translate(${width / 2 - 80}, ${height - 15})`);

    legend.append("line")
      .attr("x1", 0).attr("y1", 0).attr("x2", 20).attr("y2", 0)
      .attr("stroke", "#ef4444").attr("stroke-width", 2);
    legend.append("text")
      .attr("x", 25).attr("y", 4)
      .attr("fill", "#9ca3af").attr("font-size", "10px")
      .text("Température");

    legend.append("line")
      .attr("x1", 100).attr("y1", 0).attr("x2", 120).attr("y2", 0)
      .attr("stroke", "#22c55e").attr("stroke-width", 2);
    legend.append("text")
      .attr("x", 125).attr("y", 4)
      .attr("fill", "#9ca3af").attr("font-size", "10px")
      .text("pH");

  }, [stages]);

  return <svg ref={svgRef} width={600} height={300} className="w-full" />;
}

export default function PeriqueFermentation() {
  const [currentStage, setCurrentStage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");

  // Récupérer les stages de fermentation
  const { data: stages, isLoading } = trpc.tobacco.getPeriqueFermentationStages.useQuery();

  // Animation automatique
  useEffect(() => {
    if (!isPlaying || !stages) return;

    const interval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev >= stages.length) {
          setIsPlaying(false);
          return 1;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, stages]);

  const currentStageData = stages?.find(s => s.stage_number === currentStage);

  const handlePrevious = () => {
    setCurrentStage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    if (stages) {
      setCurrentStage(prev => Math.min(stages.length, prev + 1));
    }
  };

  const handleReset = () => {
    setCurrentStage(1);
    setIsPlaying(false);
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
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20">
            <FlaskConical className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Fermentation du Perique</h1>
            <p className="text-muted-foreground">12 mois de transformations enzymatiques anaérobies</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
            <Clock className="h-3 w-3 mr-1" />
            12 mois
          </Badge>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
            <FlaskConical className="h-3 w-3 mr-1" />
            {stages?.length || 0} stages
          </Badge>
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
            <Leaf className="h-3 w-3 mr-1" />
            Fermentation anaérobie
          </Badge>
        </div>
      </div>

      {/* Contrôles de lecture */}
      <Card className="mb-6 bg-card/50 border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentStage <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant={isPlaying ? "destructive" : "default"} 
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext} disabled={currentStage >= (stages?.length || 0)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground ml-4">
              Stage {currentStage} / {stages?.length || 0}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="parameters" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Détails
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <Card className="bg-card/50 border-border/50 mb-6">
            <CardContent className="pt-6 overflow-x-auto">
              {stages && (
                <FermentationTimeline 
                  stages={stages} 
                  currentStage={currentStage}
                  onStageClick={setCurrentStage}
                />
              )}
            </CardContent>
          </Card>

          {/* Détails du stage actuel */}
          {currentStageData && (
            <Card className="bg-card/50 border-border/50" style={{ borderLeftColor: STAGE_COLORS[currentStage - 1], borderLeftWidth: 4 }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: STAGE_COLORS[currentStage - 1] }}
                      />
                      Stage {currentStageData.stage_number}: {currentStageData.stage_name}
                    </CardTitle>
                    <CardDescription>
                      Mois {currentStageData.month_start} à {currentStageData.month_end} ({currentStageData.duration_months} mois)
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    pH {currentStageData.ph_level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-4 w-4 text-red-400" />
                      <span className="text-sm font-medium">Température</span>
                    </div>
                    <p className="text-2xl font-bold text-red-400">
                      {currentStageData.temperature_min}-{currentStageData.temperature_max}°C
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium">Humidité</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-400">
                      {currentStageData.humidity_min}-{currentStageData.humidity_max}%
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <FlaskConical className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium">pH</span>
                    </div>
                    <p className="text-2xl font-bold text-green-400">
                      {currentStageData.ph_level}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-medium">Durée</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">
                      {currentStageData.duration_months} mois
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-amber-400" />
                      Enzymes Clés
                    </h4>
                    <p className="text-sm text-muted-foreground">{currentStageData.key_enzymes}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                      <h4 className="font-medium mb-2 text-green-400 text-sm">Composés Formés</h4>
                      <p className="text-sm text-muted-foreground">{currentStageData.compounds_formed}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                      <h4 className="font-medium mb-2 text-red-400 text-sm">Composés Dégradés</h4>
                      <p className="text-sm text-muted-foreground">{currentStageData.compounds_degraded}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-purple-400" />
                      Changements Olfactifs
                    </h4>
                    <p className="text-sm text-muted-foreground italic">{currentStageData.olfactory_changes}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{currentStageData.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="parameters">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Évolution des Paramètres</CardTitle>
              <CardDescription>Température et pH au cours des 12 mois de fermentation</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {stages && <ParametersChart stages={stages} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Tous les Stages</CardTitle>
              <CardDescription>Vue détaillée de chaque étape de fermentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stages?.map((stage, idx) => (
                  <div 
                    key={stage.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      stage.stage_number === currentStage 
                        ? "border-primary bg-primary/5" 
                        : "border-border/50 hover:border-border"
                    }`}
                    onClick={() => setCurrentStage(stage.stage_number)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: STAGE_COLORS[idx] }}
                      >
                        {stage.stage_number}
                      </div>
                      <div>
                        <h4 className="font-medium">{stage.stage_name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Mois {stage.month_start}-{stage.month_end} • {stage.duration_months} mois
                        </p>
                      </div>
                      <div className="ml-auto flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Thermometer className="h-3 w-3 mr-1" />
                          {stage.temperature_min}-{stage.temperature_max}°C
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          pH {stage.ph_level}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{stage.olfactory_changes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
