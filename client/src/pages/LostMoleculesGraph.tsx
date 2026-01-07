import { useState, useEffect, useRef, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  Network, 
  Beaker, 
  FlaskConical,
  BookOpen,
  ExternalLink,
  ChevronRight,
  Atom,
  Leaf,
  FileText,
  AlertTriangle,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import * as d3 from "d3";

// Types
interface GraphNode {
  id: string;
  name: string;
  moleculeClass: string | null;
  formula: string | null;
  evidenceCount: number;
  type: 'molecule';
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphEdge {
  source: string | { id: string };
  target: string | { id: string };
  evidenceId: string;
  markerType: string | null;
  confidence: string | null;
  referenceTitle: string | null;
}

// Couleurs par classe de molécule
const classColors: Record<string, string> = {
  alkaloid: "#ef4444",
  cannabinoid: "#22c55e",
  "cannabinoid-acid": "#16a34a",
  "cannabinoid-oxidation-product": "#15803d",
  terpene: "#3b82f6",
  sesquiterpene: "#6366f1",
  "sesquiterpene-alcohol": "#8b5cf6",
  "terpene-alcohol": "#a855f7",
  triterpenoid: "#d946ef",
  TSNA: "#f97316",
  "lichen depside": "#84cc16",
  "phenolic aldehyde": "#eab308",
  norisoprenoid: "#14b8a6",
  "norisoprenoid ketones": "#06b6d4",
  "macrocyclic lactone": "#0ea5e9",
  "macrocyclic ketone": "#0284c7",
  heteroaromatic: "#ec4899",
  ester: "#f472b6",
  phenylpropanoid: "#fb7185",
  lactone: "#fbbf24",
  "terpene aldehyde": "#a3e635",
  unknown: "#6b7280",
};

// Icône de confiance
function ConfidenceIcon({ level }: { level: string | null }) {
  switch (level) {
    case "high":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "medium":
      return <HelpCircle className="h-4 w-4 text-yellow-500" />;
    case "low":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <HelpCircle className="h-4 w-4 text-gray-400" />;
  }
}

// Composant principal
export default function LostMoleculesGraph() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedConfidence, setSelectedConfidence] = useState<string>("all");
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("graph");
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Fetch data
  const { data: graphData, isLoading } = trpc.lostMolecules.graphData.useQuery();
  const { data: selectedMoleculeData } = trpc.lostMolecules.molecules.getWithEvidenceByMoleculeId.useQuery(
    selectedMolecule || "",
    { enabled: !!selectedMolecule }
  );
  
  // Classes uniques
  const uniqueClasses = useMemo(() => {
    if (!graphData?.nodes) return [];
    const classes = new Set(graphData.nodes.map(n => n.moleculeClass || "unknown"));
    return Array.from(classes).sort();
  }, [graphData]);
  
  // Filtrer les nodes
  const filteredNodes = useMemo(() => {
    if (!graphData?.nodes) return [];
    return graphData.nodes.filter(node => {
      const matchesSearch = !searchTerm || 
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = selectedClass === "all" || node.moleculeClass === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [graphData, searchTerm, selectedClass]);
  
  // Filtrer les edges
  const filteredEdges = useMemo(() => {
    if (!graphData?.edges) return [] as GraphEdge[];
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return (graphData.edges as GraphEdge[]).filter(edge => {
      const sourceId = typeof edge.source === 'string' ? edge.source : (edge.source as { id: string }).id;
      const matchesNode = nodeIds.has(sourceId);
      const matchesConfidence = selectedConfidence === "all" || edge.confidence === selectedConfidence;
      return matchesNode && matchesConfidence;
    });
  }, [graphData, filteredNodes, selectedConfidence]);
  
  // D3 Force Graph
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || filteredNodes.length === 0 || activeTab !== "graph") return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const width = containerRef.current.clientWidth;
    const height = 600;
    
    svg.attr("width", width).attr("height", height);
    
    // Create a copy of nodes for D3
    const nodes: GraphNode[] = filteredNodes.map(n => ({ ...n }));
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    
    // Create entity nodes from edges
    const entityNodes: GraphNode[] = [];
    const entitySet = new Set<string>();
    filteredEdges.forEach(edge => {
      const targetId = typeof edge.target === 'string' ? edge.target : (edge.target as { id: string }).id;
      if (!nodeMap.has(targetId) && !entitySet.has(targetId) && targetId) {
        entitySet.add(targetId);
        entityNodes.push({
          id: targetId,
          name: targetId.replace(/^plant-/, '').replace(/-/g, ' '),
          moleculeClass: 'entity',
          formula: null,
          evidenceCount: 0,
          type: 'molecule',
        });
      }
    });
    
    const allNodes = [...nodes, ...entityNodes];
    const allNodeMap = new Map(allNodes.map(n => [n.id, n]));
    
    // Create links
    const links = filteredEdges.map(edge => ({
      source: allNodeMap.get(typeof edge.source === 'string' ? edge.source : (edge.source as { id: string }).id)!,
      target: allNodeMap.get(typeof edge.target === 'string' ? edge.target : (edge.target as { id: string }).id)!,
      confidence: edge.confidence,
    })).filter(l => l.source && l.target);
    
    // Force simulation
    const simulation = d3.forceSimulation(allNodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));
    
    // Zoom
    const g = svg.append("g");
    svg.call(d3.zoom<SVGSVGElement, unknown>()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      }) as any);
    
    // Links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", d => {
        switch (d.confidence) {
          case "high": return "#22c55e";
          case "medium": return "#eab308";
          case "low": return "#ef4444";
          default: return "#6b7280";
        }
      })
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5);
    
    // Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(allNodes)
      .join("g")
      .attr("cursor", "pointer")
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
        }) as any);
    
    // Node circles
    node.append("circle")
      .attr("r", d => d.moleculeClass === 'entity' ? 8 : 12 + Math.min(d.evidenceCount * 2, 10))
      .attr("fill", d => d.moleculeClass === 'entity' ? "#94a3b8" : classColors[d.moleculeClass || "unknown"])
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);
    
    // Node labels
    node.append("text")
      .text(d => d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name)
      .attr("x", 0)
      .attr("y", d => (d.moleculeClass === 'entity' ? 8 : 12 + Math.min(d.evidenceCount * 2, 10)) + 14)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#374151");
    
    // Click handler
    node.on("click", (event, d) => {
      if (d.moleculeClass !== 'entity') {
        setSelectedMolecule(d.id);
      }
    });
    
    // Simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
    
    return () => {
      simulation.stop();
    };
  }, [filteredNodes, filteredEdges, activeTab]);
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[600px] lg:col-span-2" />
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Network className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Molécules Perdues</h1>
        </div>
        <p className="text-muted-foreground">
          Graphe de connaissances des 38 molécules marqueurs et 67 liens evidence pour la cartographie des chémotypes patrimoniaux.
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Atom className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{graphData?.stats.totalMolecules || 0}</p>
                <p className="text-xs text-muted-foreground">Molécules marqueurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{graphData?.stats.totalEvidence || 0}</p>
                <p className="text-xs text-muted-foreground">Liens evidence</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{graphData?.methods.length || 0}</p>
                <p className="text-xs text-muted-foreground">Méthodes analytiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">{Object.keys(graphData?.stats.byClass || {}).length}</p>
                <p className="text-xs text-muted-foreground">Classes chimiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une molécule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Classe chimique" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les classes</SelectItem>
                {uniqueClasses.map(cls => (
                  <SelectItem key={cls} value={cls}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: classColors[cls] || classColors.unknown }}
                      />
                      {cls}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedConfidence} onValueChange={setSelectedConfidence}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Confiance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Haute
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-yellow-500" />
                    Moyenne
                  </div>
                </SelectItem>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Basse
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph / List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="graph">
                    <Network className="h-4 w-4 mr-2" />
                    Graphe
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <FileText className="h-4 w-4 mr-2" />
                    Liste
                  </TabsTrigger>
                  <TabsTrigger value="methods">
                    <Beaker className="h-4 w-4 mr-2" />
                    Méthodes
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="graph" className="mt-0">
                <div ref={containerRef} className="w-full h-[600px] border rounded-lg bg-slate-50">
                  <svg ref={svgRef} className="w-full h-full" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Cliquez sur une molécule pour voir ses détails. Glissez pour déplacer les nœuds. Zoomez avec la molette.
                </p>
              </TabsContent>
              
              <TabsContent value="list" className="mt-0">
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {filteredNodes.map(node => (
                      <Card 
                        key={node.id}
                        className={`cursor-pointer transition-colors hover:bg-accent ${selectedMolecule === node.id ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setSelectedMolecule(node.id)}
                      >
                        <CardContent className="py-3 px-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: classColors[node.moleculeClass || "unknown"] }}
                              />
                              <div>
                                <p className="font-medium">{node.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {node.formula || "—"} • {node.moleculeClass || "unknown"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{node.evidenceCount} evidence</Badge>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="methods" className="mt-0">
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {graphData?.methods.map(method => (
                      <Card key={method.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Beaker className="h-5 w-5 text-primary" />
                            {method.name}
                          </CardTitle>
                          <CardDescription>{method.modality}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {method.sampleTypes && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Types d'échantillons</p>
                              <p className="text-sm">{method.sampleTypes}</p>
                            </div>
                          )}
                          {method.strengths && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Points forts</p>
                              <p className="text-sm text-green-700">{method.strengths}</p>
                            </div>
                          )}
                          {method.limitations && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Limitations</p>
                              <p className="text-sm text-red-700">{method.limitations}</p>
                            </div>
                          )}
                          {method.typicalMarkers && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Marqueurs typiques</p>
                              <div className="flex flex-wrap gap-1">
                                {method.typicalMarkers.split(';').map((marker, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">{marker}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
        
        {/* Detail panel */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Atom className="h-5 w-5" />
                {selectedMoleculeData?.name || "Sélectionnez une molécule"}
              </CardTitle>
              {selectedMoleculeData && (
                <CardDescription>
                  {selectedMoleculeData.moleculeClass} • {selectedMoleculeData.formula || "—"}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {selectedMoleculeData ? (
                <div className="space-y-4">
                  {selectedMoleculeData.notes && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{selectedMoleculeData.notes}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Evidence ({selectedMoleculeData.evidence.length})
                    </p>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {selectedMoleculeData.evidence.map(ev => (
                          <Card key={ev.id} className="bg-slate-50">
                            <CardContent className="py-3 px-4">
                              <div className="flex items-start justify-between mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {ev.markerType || "—"}
                                </Badge>
                                <ConfidenceIcon level={ev.confidence} />
                              </div>
                              <p className="text-sm font-medium mb-1">{ev.referenceTitle}</p>
                              {ev.entityName && (
                                <p className="text-xs text-muted-foreground mb-1">
                                  <Leaf className="inline h-3 w-3 mr-1" />
                                  {ev.entityName}
                                </p>
                              )}
                              {ev.timeContext && (
                                <p className="text-xs text-muted-foreground mb-1">
                                  📅 {ev.timeContext}
                                </p>
                              )}
                              {ev.method && (
                                <p className="text-xs text-muted-foreground mb-2">
                                  <FlaskConical className="inline h-3 w-3 mr-1" />
                                  {ev.method}
                                </p>
                              )}
                              {ev.url && (
                                <Button variant="link" size="sm" className="h-auto p-0" asChild>
                                  <a href={ev.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Voir la source
                                  </a>
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Cliquez sur une molécule dans le graphe ou la liste pour voir ses détails et liens evidence.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
