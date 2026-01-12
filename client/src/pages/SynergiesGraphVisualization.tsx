/**
 * SynergiesGraphVisualization - Interactive D3.js force-directed graph
 * Visualizes molecular synergies as an interactive network
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Network,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Download,
  Filter,
  Info,
  Zap,
  Shield,
  Eye,
  Sparkles,
  ArrowLeft,
  X,
} from "lucide-react";
import { Link } from "wouter";
import * as d3 from "d3";

// Types for D3 graph
interface GraphNode {
  id: number;
  name: string;
  family: string | null;
  chemicalClass: string | null;
  olfactiveProfile: string | null;
  connectionCount: number;
  radar: {
    intensity: number;
    freshness: number;
    warmth: number;
    sweetness: number;
    spiciness: number;
    earthiness: number;
  };
  // D3 simulation properties
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  id: string;
  source: number | GraphNode;
  target: number | GraphNode;
  type: string;
  compatibilityScore: number;
  description: string | null;
  applications: string | null;
}

// Synergy type configuration
const SYNERGY_TYPE_CONFIG: Record<string, { label: string; color: string; icon: typeof Zap }> = {
  potentialisation: {
    label: "Potentialisation",
    color: "#22c55e",
    icon: Zap,
  },
  stabilisation: {
    label: "Stabilisation",
    color: "#3b82f6",
    icon: Shield,
  },
  transformation: {
    label: "Transformation",
    color: "#a855f7",
    icon: Sparkles,
  },
  masquage: {
    label: "Masquage",
    color: "#f59e0b",
    icon: Eye,
  },
};

// Chemical class colors
const CHEMICAL_CLASS_COLORS: Record<string, string> = {
  terpene: "#22c55e",
  sesquiterpene: "#16a34a",
  monoterpene: "#4ade80",
  diterpene: "#15803d",
  aldehyde: "#f59e0b",
  ketone: "#d97706",
  alcohol: "#3b82f6",
  ester: "#8b5cf6",
  ether: "#a855f7",
  phenol: "#ec4899",
  lactone: "#f43f5e",
  coumarin: "#ef4444",
  musk: "#6366f1",
  nitrile: "#06b6d4",
  sulfur_compound: "#eab308",
  heterocyclic: "#14b8a6",
  aromatic: "#f97316",
  aliphatic: "#64748b",
  other: "#94a3b8",
};

export default function SynergiesGraphVisualization() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedLink, setSelectedLink] = useState<GraphLink | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterChemicalClass, setFilterChemicalClass] = useState<string>("all");
  const [minScore, setMinScore] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [linkStrength, setLinkStrength] = useState(50);
  const [nodeSize, setNodeSize] = useState(50);
  
  // Fetch data
  const { data: graphData, isLoading, error } = trpc.synergies.getGraphVisualizationData.useQuery();
  
  // Filter data
  const filteredData = useMemo(() => {
    if (!graphData) return { nodes: [], links: [] };
    
    let filteredLinks = graphData.links.filter((link: GraphLink) => {
      const matchesType = filterType === "all" || link.type === filterType;
      const matchesScore = link.compatibilityScore >= minScore;
      return matchesType && matchesScore;
    });
    
    // Get node IDs that are connected by filtered links
    const connectedNodeIds = new Set<number>();
    filteredLinks.forEach((link: GraphLink) => {
      connectedNodeIds.add(typeof link.source === 'number' ? link.source : link.source.id);
      connectedNodeIds.add(typeof link.target === 'number' ? link.target : link.target.id);
    });
    
    let filteredNodes = graphData.nodes.filter((node: GraphNode) => {
      const isConnected = connectedNodeIds.has(node.id);
      const matchesChemicalClass = filterChemicalClass === "all" || node.chemicalClass === filterChemicalClass;
      const matchesSearch = !searchQuery || 
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.family?.toLowerCase().includes(searchQuery.toLowerCase());
      return isConnected && matchesChemicalClass && matchesSearch;
    });
    
    // If search is active, also filter links to only show connections of matching nodes
    if (searchQuery) {
      const matchingNodeIds = new Set(filteredNodes.map((n: GraphNode) => n.id));
      filteredLinks = filteredLinks.filter((link: GraphLink) => {
        const sourceId = typeof link.source === 'number' ? link.source : link.source.id;
        const targetId = typeof link.target === 'number' ? link.target : link.target.id;
        return matchingNodeIds.has(sourceId) || matchingNodeIds.has(targetId);
      });
    }
    
    return { nodes: filteredNodes, links: filteredLinks };
  }, [graphData, filterType, filterChemicalClass, minScore, searchQuery]);
  
  // Get unique chemical classes for filter
  const chemicalClasses = useMemo(() => {
    if (!graphData) return [];
    const classes = new Set(graphData.nodes.map((n: GraphNode) => n.chemicalClass).filter(Boolean));
    return Array.from(classes) as string[];
  }, [graphData]);
  
  // D3 visualization
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || filteredData.nodes.length === 0) return;
    
    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 600;
    
    // Clear previous content
    svg.selectAll("*").remove();
    
    // Set up SVG
    svg.attr("width", width).attr("height", height);
    
    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom);
    
    // Create main group for zoom/pan
    const g = svg.append("g");
    
    // Create arrow markers for directed edges
    svg.append("defs").selectAll("marker")
      .data(Object.keys(SYNERGY_TYPE_CONFIG))
      .join("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", d => SYNERGY_TYPE_CONFIG[d]?.color || "#999")
      .attr("d", "M0,-5L10,0L0,5");
    
    // Create simulation
    const simulation = d3.forceSimulation(filteredData.nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(filteredData.links)
        .id((d: any) => d.id)
        .distance(100 + (100 - linkStrength))
        .strength(0.5))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => getNodeRadius(d) + 5));
    
    // Helper function for node radius
    function getNodeRadius(d: GraphNode) {
      const baseSize = 8 + (nodeSize / 10);
      return baseSize + Math.sqrt(d.connectionCount) * 2;
    }
    
    // Helper function for node color
    function getNodeColor(d: GraphNode) {
      if (d.chemicalClass) {
        return CHEMICAL_CLASS_COLORS[d.chemicalClass] || CHEMICAL_CLASS_COLORS.other;
      }
      return CHEMICAL_CLASS_COLORS.other;
    }
    
    // Create links
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(filteredData.links)
      .join("line")
      .attr("stroke", (d: GraphLink) => SYNERGY_TYPE_CONFIG[d.type]?.color || "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: GraphLink) => Math.max(1, d.compatibilityScore / 25))
      .attr("marker-end", (d: GraphLink) => `url(#arrow-${d.type})`)
      .style("cursor", "pointer")
      .on("click", (event, d: GraphLink) => {
        event.stopPropagation();
        setSelectedLink(d);
        setSelectedNode(null);
      })
      .on("mouseover", function() {
        d3.select(this).attr("stroke-opacity", 1).attr("stroke-width", function(d: any) {
          return Math.max(2, d.compatibilityScore / 20);
        });
      })
      .on("mouseout", function() {
        d3.select(this).attr("stroke-opacity", 0.6).attr("stroke-width", function(d: any) {
          return Math.max(1, d.compatibilityScore / 25);
        });
      });
    
    // Create node groups
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(filteredData.nodes)
      .join("g")
      .style("cursor", "pointer")
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any)
      .on("click", (event, d: GraphNode) => {
        event.stopPropagation();
        setSelectedNode(d);
        setSelectedLink(null);
      });
    
    // Add circles to nodes
    node.append("circle")
      .attr("r", (d: GraphNode) => getNodeRadius(d))
      .attr("fill", (d: GraphNode) => getNodeColor(d))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("mouseover", function() {
        d3.select(this).attr("stroke-width", 3);
      })
      .on("mouseout", function() {
        d3.select(this).attr("stroke-width", 2);
      });
    
    // Add labels to nodes
    if (showLabels) {
      node.append("text")
        .text((d: GraphNode) => d.name.length > 15 ? d.name.slice(0, 15) + "..." : d.name)
        .attr("x", (d: GraphNode) => getNodeRadius(d) + 5)
        .attr("y", 4)
        .attr("font-size", "11px")
        .attr("fill", "#374151")
        .attr("pointer-events", "none");
    }
    
    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
    
    // Click on background to deselect
    svg.on("click", () => {
      setSelectedNode(null);
      setSelectedLink(null);
    });
    
    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [filteredData, showLabels, linkStrength, nodeSize]);
  
  // Handle zoom controls
  const handleZoom = (direction: "in" | "out" | "reset") => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>();
    
    if (direction === "reset") {
      svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
    } else {
      const scale = direction === "in" ? 1.5 : 0.67;
      svg.transition().duration(300).call(zoom.scaleBy, scale);
    }
  };
  
  // Export graph as SVG
  const handleExport = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `synergies-graph-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="py-8 text-center">
              <p className="text-destructive">Erreur: {error.message}</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <Link href="/synergies">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux synergies
              </Button>
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <Network className="w-4 h-4 mr-2" />
                Visualisation Interactive
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-foreground">
                Graphe des Synergies Moléculaires
              </h1>
              <p className="text-muted-foreground">
                Explorez les connexions entre molécules à travers un graphe de force interactif.
                Chaque nœud représente une molécule, chaque lien une synergie documentée.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-8">
          <div className="container">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Controls Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                {/* Search */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Recherche</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher une molécule..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Filters */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filtres
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Type de synergie</Label>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les types</SelectItem>
                          {Object.entries(SYNERGY_TYPE_CONFIG).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Classe chimique</Label>
                      <Select value={filterChemicalClass} onValueChange={setFilterChemicalClass}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les classes</SelectItem>
                          {chemicalClasses.map(cls => (
                            <SelectItem key={cls} value={cls}>
                              {cls.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Score minimum</Label>
                        <span className="text-sm text-muted-foreground">{minScore}%</span>
                      </div>
                      <Slider
                        value={[minScore]}
                        onValueChange={([v]) => setMinScore(v)}
                        min={0}
                        max={100}
                        step={5}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Display Options */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Affichage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Afficher les noms</Label>
                      <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Force des liens</Label>
                        <span className="text-sm text-muted-foreground">{linkStrength}</span>
                      </div>
                      <Slider
                        value={[linkStrength]}
                        onValueChange={([v]) => setLinkStrength(v)}
                        min={10}
                        max={100}
                        step={5}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Taille des nœuds</Label>
                        <span className="text-sm text-muted-foreground">{nodeSize}</span>
                      </div>
                      <Slider
                        value={[nodeSize]}
                        onValueChange={([v]) => setNodeSize(v)}
                        min={20}
                        max={100}
                        step={5}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Stats */}
                {graphData?.stats && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Statistiques</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Molécules</span>
                        <span className="font-medium">{filteredData.nodes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Synergies</span>
                        <span className="font-medium">{filteredData.links.length}</span>
                      </div>
                      {Object.entries(graphData.stats.byType || {}).map(([type, count]) => (
                        <div key={type} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">{type}</span>
                          <Badge variant="outline" style={{ borderColor: SYNERGY_TYPE_CONFIG[type]?.color }}>
                            {count as number}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Graph Area */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Graphe de Force</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleZoom("out")}>
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleZoom("in")}>
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleZoom("reset")}>
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExport}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="h-[600px] flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto" />
                          <p className="text-muted-foreground">Chargement du graphe...</p>
                        </div>
                      </div>
                    ) : filteredData.nodes.length === 0 ? (
                      <div className="h-[600px] flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <Network className="h-16 w-16 text-muted-foreground/30 mx-auto" />
                          <div>
                            <p className="font-medium">Aucune donnée à afficher</p>
                            <p className="text-sm text-muted-foreground">
                              Ajustez les filtres ou ajoutez des synergies à la base de données.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div ref={containerRef} className="w-full h-[600px] overflow-hidden">
                        <svg ref={svgRef} className="w-full h-full" />
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Legend */}
                <Card className="mt-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Légende</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Types de synergies (liens)</h4>
                        <div className="space-y-1">
                          {Object.entries(SYNERGY_TYPE_CONFIG).map(([key, config]) => (
                            <div key={key} className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-0.5" style={{ backgroundColor: config.color }} />
                              <span>{config.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Classes chimiques (nœuds)</h4>
                        <div className="grid grid-cols-2 gap-1">
                          {Object.entries(CHEMICAL_CLASS_COLORS).slice(0, 10).map(([cls, color]) => (
                            <div key={cls} className="flex items-center gap-2 text-sm">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                              <span className="capitalize truncate">{cls.replace(/_/g, " ")}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Selected Node/Link Info */}
                {(selectedNode || selectedLink) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <Card className="border-primary/30">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            {selectedNode ? "Molécule sélectionnée" : "Synergie sélectionnée"}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedNode(null);
                              setSelectedLink(null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {selectedNode && (
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-lg font-semibold">{selectedNode.name}</h3>
                              <div className="flex gap-2 mt-1">
                                {selectedNode.chemicalClass && (
                                  <Badge variant="outline">{selectedNode.chemicalClass.replace(/_/g, " ")}</Badge>
                                )}
                                {selectedNode.family && (
                                  <Badge variant="secondary">{selectedNode.family}</Badge>
                                )}
                              </div>
                            </div>
                            {selectedNode.olfactiveProfile && (
                              <p className="text-sm text-muted-foreground">{selectedNode.olfactiveProfile}</p>
                            )}
                            <div className="text-sm">
                              <span className="text-muted-foreground">Connexions : </span>
                              <span className="font-medium">{selectedNode.connectionCount}</span>
                            </div>
                            <Link href={`/molecules/${selectedNode.id}`}>
                              <Button size="sm" className="w-full">
                                Voir la fiche complète
                              </Button>
                            </Link>
                          </div>
                        )}
                        {selectedLink && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {typeof selectedLink.source === 'object' ? selectedLink.source.name : `#${selectedLink.source}`}
                              </span>
                              <span className="text-muted-foreground">↔</span>
                              <span className="font-medium">
                                {typeof selectedLink.target === 'object' ? selectedLink.target.name : `#${selectedLink.target}`}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Badge style={{ backgroundColor: SYNERGY_TYPE_CONFIG[selectedLink.type]?.color + "20", color: SYNERGY_TYPE_CONFIG[selectedLink.type]?.color }}>
                                {SYNERGY_TYPE_CONFIG[selectedLink.type]?.label || selectedLink.type}
                              </Badge>
                              <Badge variant="outline">{selectedLink.compatibilityScore}%</Badge>
                            </div>
                            {selectedLink.description && (
                              <p className="text-sm text-muted-foreground">{selectedLink.description}</p>
                            )}
                            {selectedLink.applications && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">Applications : </span>
                                <span>{selectedLink.applications}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Info Section */}
        <section className="py-8 border-t">
          <div className="container">
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Comment utiliser ce graphe ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Navigation</strong> : Utilisez la molette pour zoomer, cliquez et glissez pour vous déplacer dans le graphe.</p>
                <p><strong className="text-foreground">Interaction</strong> : Cliquez sur un nœud pour voir les détails d'une molécule, ou sur un lien pour voir les détails d'une synergie.</p>
                <p><strong className="text-foreground">Filtres</strong> : Utilisez les filtres à gauche pour affiner l'affichage par type de synergie, classe chimique ou score minimum.</p>
                <p><strong className="text-foreground">Réorganisation</strong> : Glissez les nœuds pour réorganiser le graphe selon vos besoins.</p>
                <p><strong className="text-foreground">Export</strong> : Téléchargez le graphe au format SVG pour l'utiliser dans vos documents.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
