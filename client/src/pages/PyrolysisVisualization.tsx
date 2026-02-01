import { useState, useEffect, useRef, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Flame, 
  Thermometer, 
  AlertTriangle,
  ChevronRight,
  Zap,
  Wind,
  Droplets,
  ArrowRight,
  Info,
  FlaskConical,
  Leaf
} from "lucide-react";
import { Link } from "wouter";
import * as d3 from "d3";

// Données des transformations pyrolytiques
const pyrolysisData = {
  molecules: [
    {
      id: "myrcene",
      name: "Myrcène",
      formula: "C₁₀H₁₆",
      category: "Monoterpène",
      boilingPoint: 167,
      color: "#22c55e",
      products: [
        { name: "Méthacroléine", toxicity: "high", temperature: 400, percentage: 35 },
        { name: "Benzène", toxicity: "very_high", temperature: 500, percentage: 25 },
        { name: "Isoprène", toxicity: "moderate", temperature: 350, percentage: 40 }
      ],
      olfactoryBefore: "Herbacé, terreux, houblon",
      olfactoryAfter: "Âcre, irritant, fumée acre"
    },
    {
      id: "limonene",
      name: "Limonène",
      formula: "C₁₀H₁₆",
      category: "Monoterpène",
      boilingPoint: 176,
      color: "#f97316",
      products: [
        { name: "Isoprène", toxicity: "moderate", temperature: 380, percentage: 45 },
        { name: "Composés aromatiques cycliques", toxicity: "moderate", temperature: 450, percentage: 35 },
        { name: "Aldéhydes", toxicity: "low", temperature: 320, percentage: 20 }
      ],
      olfactoryBefore: "Citron, orange, agrumes frais",
      olfactoryAfter: "Citrique brûlée, fumée douce"
    },
    {
      id: "caryophyllene",
      name: "β-Caryophyllène",
      formula: "C₁₅H₂₄",
      category: "Sesquiterpène",
      boilingPoint: 268,
      color: "#8b5cf6",
      products: [
        { name: "HAP (Benzo[a]pyrène)", toxicity: "very_high", temperature: 650, percentage: 30 },
        { name: "Composés aromatiques", toxicity: "high", temperature: 550, percentage: 40 },
        { name: "Sesquiterpènes oxydés", toxicity: "moderate", temperature: 450, percentage: 30 }
      ],
      olfactoryBefore: "Épicé, poivré, boisé",
      olfactoryAfter: "Épicé intense, fumée âcre"
    },
    {
      id: "humulene",
      name: "α-Humulène",
      formula: "C₁₅H₂₄",
      category: "Sesquiterpène",
      boilingPoint: 198,
      color: "#eab308",
      products: [
        { name: "HAP", toxicity: "very_high", temperature: 620, percentage: 35 },
        { name: "Composés sesquiterpéniques oxydés", toxicity: "moderate", temperature: 480, percentage: 45 },
        { name: "Aldéhydes", toxicity: "low", temperature: 380, percentage: 20 }
      ],
      olfactoryBefore: "Houblon, terreux, boisé",
      olfactoryAfter: "Boisé fumé, âcre"
    },
    {
      id: "pinene",
      name: "α-Pinène",
      formula: "C₁₀H₁₆",
      category: "Monoterpène",
      boilingPoint: 156,
      color: "#10b981",
      products: [
        { name: "Verbenone", toxicity: "low", temperature: 350, percentage: 40 },
        { name: "Composés terpéniques oxydés", toxicity: "low", temperature: 400, percentage: 45 },
        { name: "Aldéhydes", toxicity: "low", temperature: 320, percentage: 15 }
      ],
      olfactoryBefore: "Pin, résine, forêt",
      olfactoryAfter: "Pin fumé, résine brûlée"
    },
    {
      id: "linalool",
      name: "Linalol",
      formula: "C₁₀H₁₈O",
      category: "Monoterpène alcool",
      boilingPoint: 198,
      color: "#ec4899",
      products: [
        { name: "Citral", toxicity: "low", temperature: 380, percentage: 35 },
        { name: "Aldéhydes floraux", toxicity: "low", temperature: 350, percentage: 45 },
        { name: "Composés oxygénés", toxicity: "low", temperature: 400, percentage: 20 }
      ],
      olfactoryBefore: "Floral, lavande, doux",
      olfactoryAfter: "Floral fumé, douceur persistante"
    },
    {
      id: "terpinolene",
      name: "Terpinolène",
      formula: "C₁₀H₁₆",
      category: "Monoterpène",
      boilingPoint: 186,
      color: "#06b6d4",
      products: [
        { name: "Composés aromatiques cycliques", toxicity: "moderate", temperature: 420, percentage: 40 },
        { name: "Aldéhydes floraux", toxicity: "low", temperature: 360, percentage: 35 },
        { name: "Isoprène", toxicity: "moderate", temperature: 380, percentage: 25 }
      ],
      olfactoryBefore: "Floral, herbacé, pin doux",
      olfactoryAfter: "Floral fumé, herbacé brûlé"
    }
  ],
  temperatureZones: [
    { name: "Vaporisation", min: 157, max: 220, color: "#22c55e", description: "Libération des terpènes intacts" },
    { name: "Pyrolyse", min: 340, max: 482, color: "#f97316", description: "Dégradation thermique sans oxygène" },
    { name: "Combustion", min: 600, max: 900, color: "#ef4444", description: "Oxydation complète, formation HAP" }
  ],
  toxicityLevels: {
    low: { label: "Faible", color: "#22c55e", icon: "✓" },
    moderate: { label: "Modérée", color: "#eab308", icon: "⚠" },
    high: { label: "Élevée", color: "#f97316", icon: "⚠⚠" },
    very_high: { label: "Très élevée", color: "#ef4444", icon: "☠" }
  }
};

// Composant de diagramme Sankey simplifié pour les transformations
function TransformationDiagram({ molecule, temperature }: { molecule: typeof pyrolysisData.molecules[0]; temperature: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    
    // Source (molécule)
    const sourceX = margin.left + 50;
    const sourceY = height / 2;
    
    // Produits
    const productStartX = width - margin.right - 150;
    const productSpacing = height / (molecule.products.length + 1);
    
    // Dessiner la source
    svg.append("circle")
      .attr("cx", sourceX)
      .attr("cy", sourceY)
      .attr("r", 40)
      .attr("fill", molecule.color)
      .attr("opacity", 0.8);
    
    svg.append("text")
      .attr("x", sourceX)
      .attr("y", sourceY)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .attr("font-size", "12px")
      .text(molecule.name.substring(0, 8));
    
    // Dessiner les produits et les liens
    molecule.products.forEach((product, i) => {
      const productY = productSpacing * (i + 1);
      const isActive = temperature >= product.temperature;
      const toxColor = pyrolysisData.toxicityLevels[product.toxicity as keyof typeof pyrolysisData.toxicityLevels].color;
      
      // Lien (courbe de Bézier)
      const path = d3.path();
      path.moveTo(sourceX + 40, sourceY);
      path.bezierCurveTo(
        sourceX + 150, sourceY,
        productStartX - 100, productY,
        productStartX - 30, productY
      );
      
      svg.append("path")
        .attr("d", path.toString())
        .attr("fill", "none")
        .attr("stroke", isActive ? toxColor : "#374151")
        .attr("stroke-width", isActive ? (product.percentage / 10) : 2)
        .attr("opacity", isActive ? 0.8 : 0.3)
        .attr("stroke-dasharray", isActive ? "none" : "5,5");
      
      // Pourcentage sur le lien
      if (isActive) {
        svg.append("text")
          .attr("x", (sourceX + productStartX) / 2)
          .attr("y", (sourceY + productY) / 2 - 10)
          .attr("text-anchor", "middle")
          .attr("fill", toxColor)
          .attr("font-size", "11px")
          .attr("font-weight", "bold")
          .text(`${product.percentage}%`);
      }
      
      // Produit (rectangle arrondi)
      svg.append("rect")
        .attr("x", productStartX - 30)
        .attr("y", productY - 20)
        .attr("width", 180)
        .attr("height", 40)
        .attr("rx", 8)
        .attr("fill", isActive ? toxColor : "#374151")
        .attr("opacity", isActive ? 0.2 : 0.1);
      
      svg.append("rect")
        .attr("x", productStartX - 30)
        .attr("y", productY - 20)
        .attr("width", 180)
        .attr("height", 40)
        .attr("rx", 8)
        .attr("fill", "none")
        .attr("stroke", isActive ? toxColor : "#374151")
        .attr("stroke-width", 2);
      
      svg.append("text")
        .attr("x", productStartX + 60)
        .attr("y", productY - 3)
        .attr("text-anchor", "middle")
        .attr("fill", isActive ? "currentColor" : "#6b7280")
        .attr("font-size", "11px")
        .attr("font-weight", isActive ? "bold" : "normal")
        .text(product.name.substring(0, 25));
      
      svg.append("text")
        .attr("x", productStartX + 60)
        .attr("y", productY + 12)
        .attr("text-anchor", "middle")
        .attr("fill", isActive ? toxColor : "#6b7280")
        .attr("font-size", "10px")
        .text(`${product.temperature}°C • ${pyrolysisData.toxicityLevels[product.toxicity as keyof typeof pyrolysisData.toxicityLevels].label}`);
    });
    
    // Indicateur de température
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .attr("fill", temperature > 500 ? "#ef4444" : temperature > 300 ? "#f97316" : "#22c55e")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text(`Température: ${temperature}°C`);
    
  }, [molecule, temperature]);
  
  return (
    <svg 
      ref={svgRef} 
      width="100%" 
      height="300" 
      viewBox="0 0 600 300"
      className="overflow-visible"
    />
  );
}

// Composant barre de température
function TemperatureBar({ temperature, onChange }: { temperature: number; onChange: (value: number) => void }) {
  const getZoneColor = (temp: number) => {
    if (temp < 220) return "#22c55e";
    if (temp < 482) return "#f97316";
    return "#ef4444";
  };
  
  const getZoneName = (temp: number) => {
    if (temp < 220) return "Vaporisation";
    if (temp < 482) return "Pyrolyse";
    return "Combustion";
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Thermometer className="h-5 w-5" style={{ color: getZoneColor(temperature) }} />
          <span className="font-bold text-lg">{temperature}°C</span>
        </div>
        <Badge 
          style={{ backgroundColor: getZoneColor(temperature), color: "white" }}
        >
          {getZoneName(temperature)}
        </Badge>
      </div>
      
      <div className="relative">
        <Slider
          value={[temperature]}
          onValueChange={(value) => onChange(value[0])}
          min={100}
          max={900}
          step={10}
          className="w-full"
        />
        
        {/* Zones de température */}
        <div className="absolute top-6 left-0 right-0 h-2 flex rounded-full overflow-hidden">
          <div className="bg-green-500 h-full" style={{ width: "13.3%" }} title="Vaporisation" />
          <div className="bg-orange-500 h-full" style={{ width: "20%" }} title="Pyrolyse" />
          <div className="bg-red-500 h-full" style={{ width: "66.7%" }} title="Combustion" />
        </div>
        
        {/* Labels des zones */}
        <div className="flex justify-between text-xs text-muted-foreground mt-4">
          <span>100°C</span>
          <span>220°C</span>
          <span>482°C</span>
          <span>900°C</span>
        </div>
      </div>
    </div>
  );
}

// Composant carte de molécule
function MoleculeCard({ molecule, isSelected, onClick }: { 
  molecule: typeof pyrolysisData.molecules[0]; 
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: molecule.color }}
          >
            {molecule.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{molecule.name}</h4>
            <p className="text-xs text-muted-foreground">{molecule.formula} • {molecule.category}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {molecule.boilingPoint}°C
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PyrolysisVisualization() {
  const [selectedMolecule, setSelectedMolecule] = useState(pyrolysisData.molecules[0]);
  const [temperature, setTemperature] = useState(400);
  const [activeTab, setActiveTab] = useState("diagram");
  
  // Calculer les produits actifs à la température actuelle
  const activeProducts = useMemo(() => {
    return selectedMolecule.products.filter(p => temperature >= p.temperature);
  }, [selectedMolecule, temperature]);
  
  // Calculer le niveau de toxicité global
  const overallToxicity = useMemo(() => {
    if (activeProducts.length === 0) return "none";
    const toxicities = activeProducts.map(p => p.toxicity);
    if (toxicities.includes("very_high")) return "very_high";
    if (toxicities.includes("high")) return "high";
    if (toxicities.includes("moderate")) return "moderate";
    return "low";
  }, [activeProducts]);
  
  return (
    <div className="container py-8 space-y-8">
      {/* En-tête */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Accueil</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/recherche-scientifique" className="hover:text-foreground">Recherche</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Transformations Pyrolytiques</span>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Flame className="h-8 w-8 text-orange-500" />
            Transformations Pyrolytiques
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Visualisation interactive des voies de dégradation thermique des terpènes. 
            Explorez comment la température affecte la transformation des molécules aromatiques.
          </p>
        </div>
      </div>
      
      {/* Zones de température */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pyrolysisData.temperatureZones.map((zone) => (
          <Card 
            key={zone.name}
            className={`cursor-pointer transition-all ${
              temperature >= zone.min && temperature <= zone.max 
                ? 'ring-2 ring-offset-2' 
                : 'opacity-60'
            }`}
            style={{ 
              borderColor: zone.color,
              ...(temperature >= zone.min && temperature <= zone.max ? { ringColor: zone.color } : {})
            }}
            onClick={() => setTemperature(Math.round((zone.min + zone.max) / 2))}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: zone.color + "20" }}
                >
                  {zone.name === "Vaporisation" && <Wind className="h-6 w-6" style={{ color: zone.color }} />}
                  {zone.name === "Pyrolyse" && <Zap className="h-6 w-6" style={{ color: zone.color }} />}
                  {zone.name === "Combustion" && <Flame className="h-6 w-6" style={{ color: zone.color }} />}
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: zone.color }}>{zone.name}</h3>
                  <p className="text-sm text-muted-foreground">{zone.min}°C - {zone.max}°C</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{zone.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Contrôle de température */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Contrôle de température
          </CardTitle>
          <CardDescription>
            Ajustez la température pour voir les transformations moléculaires en temps réel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TemperatureBar temperature={temperature} onChange={setTemperature} />
        </CardContent>
      </Card>
      
      {/* Sélection de molécule et visualisation */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Liste des molécules */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Molécules sources
          </h3>
          <div className="space-y-2">
            {pyrolysisData.molecules.map((mol) => (
              <MoleculeCard
                key={mol.id}
                molecule={mol}
                isSelected={selectedMolecule.id === mol.id}
                onClick={() => setSelectedMolecule(mol)}
              />
            ))}
          </div>
        </div>
        
        {/* Diagramme de transformation */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: selectedMolecule.color }}
                    />
                    {selectedMolecule.name}
                    <Badge variant="outline">{selectedMolecule.formula}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Point d'ébullition: {selectedMolecule.boilingPoint}°C • {selectedMolecule.category}
                  </CardDescription>
                </div>
                
                {overallToxicity !== "none" && (
                  <Badge 
                    style={{ 
                      backgroundColor: pyrolysisData.toxicityLevels[overallToxicity as keyof typeof pyrolysisData.toxicityLevels].color,
                      color: "white"
                    }}
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Toxicité: {pyrolysisData.toxicityLevels[overallToxicity as keyof typeof pyrolysisData.toxicityLevels].label}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="diagram">Diagramme</TabsTrigger>
                  <TabsTrigger value="olfactory">Profil olfactif</TabsTrigger>
                  <TabsTrigger value="products">Produits ({activeProducts.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="diagram">
                  <TransformationDiagram molecule={selectedMolecule} temperature={temperature} />
                </TabsContent>
                
                <TabsContent value="olfactory">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-green-500/5 border-green-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                          <Leaf className="h-5 w-5" />
                          Avant combustion
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg italic">"{selectedMolecule.olfactoryBefore}"</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Profil aromatique naturel de la molécule intacte
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-red-500/5 border-red-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                          <Flame className="h-5 w-5" />
                          Après combustion
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg italic">"{selectedMolecule.olfactoryAfter}"</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Profil aromatique après dégradation thermique
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="products">
                  <div className="space-y-4">
                    {selectedMolecule.products.map((product, i) => {
                      const isActive = temperature >= product.temperature;
                      const toxInfo = pyrolysisData.toxicityLevels[product.toxicity as keyof typeof pyrolysisData.toxicityLevels];
                      
                      return (
                        <Card 
                          key={i}
                          className={`transition-all ${isActive ? '' : 'opacity-50'}`}
                          style={{ borderLeftColor: isActive ? toxInfo.color : undefined, borderLeftWidth: isActive ? 4 : 1 }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                  style={{ backgroundColor: toxInfo.color + "20" }}
                                >
                                  {toxInfo.icon}
                                </div>
                                <div>
                                  <h4 className="font-medium">{product.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Formation à partir de {product.temperature}°C
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge style={{ backgroundColor: toxInfo.color, color: "white" }}>
                                  {toxInfo.label}
                                </Badge>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {product.percentage}% du rendement
                                </p>
                              </div>
                            </div>
                            
                            {isActive && (
                              <div className="mt-3 pt-3 border-t">
                                <div className="flex items-center gap-2 text-sm">
                                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">
                                    {selectedMolecule.name} → {product.name}
                                  </span>
                                  <Badge variant="outline" className="ml-auto">
                                    Actif à {temperature}°C
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Légende de toxicité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Niveaux de toxicité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(pyrolysisData.toxicityLevels).map(([key, info]) => (
              <div 
                key={key}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: info.color + "10" }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: info.color }}
                >
                  {info.icon}
                </div>
                <div>
                  <p className="font-medium" style={{ color: info.color }}>{info.label}</p>
                  <p className="text-xs text-muted-foreground capitalize">{key.replace("_", " ")}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Liens vers d'autres pages */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/molecules">
          <Button variant="outline" className="gap-2">
            <FlaskConical className="h-4 w-4" />
            Explorer les molécules
          </Button>
        </Link>
        <Link href="/biosynthetic-pathways">
          <Button variant="outline" className="gap-2">
            <Leaf className="h-4 w-4" />
            Voies biosynthétiques
          </Button>
        </Link>
        <Link href="/tobacco-landraces">
          <Button variant="outline" className="gap-2">
            <Leaf className="h-4 w-4" />
            Landraces de tabac
          </Button>
        </Link>
      </div>
    </div>
  );
}
