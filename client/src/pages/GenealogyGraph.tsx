// @ts-nocheck
import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, GitBranch, Leaf, Filter, Info, ZoomIn, ZoomOut, Maximize2, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as d3 from "d3";

interface DominantMolecule {
  molecule: string;
  percentage: number;
  role: string;
}

interface OlfactiveNotes {
  base?: string[];
  heart?: string[];
  top?: string[];
}

interface GraphNode {
  id: number;
  name: string;
  type: "landrace" | "modern";
  varietyType: string | null;
  plantName: string;
  plantCategory: string;
  country: string | null;
  dominantMolecules: DominantMolecule[] | string | null;
  molecularProfile: Record<string, unknown> | string | null;
  olfactiveNotes: OlfactiveNotes | string | null;
  // D3 simulation properties
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  id: number;
  source: number | GraphNode;
  target: number | GraphNode;
  type: string | null;
  crossDate: number | null;
  breeder: string | null;
  notes: string | null;
}

export default function GenealogyGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [plantType, setPlantType] = useState<"all" | "cannabis" | "tobacco">("cannabis");
  const [includeModern, setIncludeModern] = useState(true);
  const [includeLandraces, setIncludeLandraces] = useState(true);
  const [zoom, setZoom] = useState(1);

  const { data: graphData, isLoading, refetch } = trpc.genealogy.getGraphData.useQuery({
    plantType,
    includeModern,
    includeLandraces,
  });

  // D3 Force Simulation
  useEffect(() => {
    if (!graphData || !svgRef.current || !containerRef.current) return;
    if (graphData.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 600;

    // Clear previous content
    svg.selectAll("*").remove();

    // Create zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);

    // Create main group for zoom/pan
    const g = svg.append("g");

    // Define arrow markers for links
    svg.append("defs").selectAll("marker")
      .data(["parent", "hybrid", "clone", "mutation"])
      .join("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", d => {
        switch(d) {
          case "parent": return "#22c55e";
          case "hybrid": return "#f59e0b";
          case "clone": return "#3b82f6";
          case "mutation": return "#ef4444";
          default: return "#6b7280";
        }
      })
      .attr("d", "M0,-5L10,0L0,5");

    // Prepare data for D3
    const nodes: GraphNode[] = graphData.nodes.map(n => ({ ...n }));
    const links: GraphLink[] = graphData.links.map(l => ({ 
      ...l,
      source: l.source,
      target: l.target,
    }));

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(100)
        .strength(0.5))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // Create links
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => {
        switch(d.type) {
          case "parent": return "#22c55e";
          case "hybrid": return "#f59e0b";
          case "clone": return "#3b82f6";
          case "mutation": return "#ef4444";
          default: return "#6b7280";
        }
      })
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("marker-end", (d: any) => `url(#arrow-${d.type || 'parent'})`);

    // Create node groups
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
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

    // Add circles to nodes
    node.append("circle")
      .attr("r", (d: GraphNode) => d.type === "landrace" ? 12 : 8)
      .attr("fill", (d: GraphNode) => {
        if (d.type === "landrace") {
          // Color by region for landraces
          const country = d.country?.toLowerCase() || "";
          if (country.includes("afghan") || country.includes("hindu") || country.includes("pakistan")) return "#dc2626";
          if (country.includes("thai") || country.includes("vietnam") || country.includes("laos")) return "#16a34a";
          if (country.includes("africa") || country.includes("malawi") || country.includes("durban") || country.includes("angola")) return "#ca8a04";
          if (country.includes("jamaica") || country.includes("caribbean")) return "#0891b2";
          if (country.includes("mexico") || country.includes("colombia") || country.includes("panama") || country.includes("acapulco")) return "#7c3aed";
          if (country.includes("lebanon") || country.includes("morocco")) return "#ea580c";
          return "#059669";
        }
        return "#6366f1"; // Modern varieties
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add labels to nodes
    node.append("text")
      .attr("dx", 15)
      .attr("dy", 4)
      .attr("font-size", "11px")
      .attr("fill", "currentColor")
      .text((d: GraphNode) => d.name);

    // Node click handler
    node.on("click", (event, d: GraphNode) => {
      event.stopPropagation();
      setSelectedNode(d);
    });

    // Background click to deselect
    svg.on("click", () => setSelectedNode(null));

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [graphData]);

  // Reset zoom
  const resetZoom = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity
    );
  };

  // Export SVG
  const exportSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `genealogy-${plantType}-${new Date().toISOString().split('T')[0]}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <Breadcrumbs
            items={[
              { label: "Accueil", href: "/" },
              { label: "Variétés", href: "/varietes" },
              { label: "Arbre Généalogique" },
            ]}
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <Link href="/varietes">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <GitBranch className="h-6 w-6 text-primary" />
                  Arbre Généalogique des Variétés
                </h1>
                <p className="text-sm text-muted-foreground">
                  Visualisation interactive des relations parent-enfant entre variétés
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetZoom}>
                <Maximize2 className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={exportSVG}>
                <Download className="h-4 w-4 mr-2" />
                Export SVG
              </Button>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters & Info */}
          <div className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Type de plante</Label>
                  <Select value={plantType} onValueChange={(v: any) => setPlantType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="cannabis">Cannabis</SelectItem>
                      <SelectItem value="tobacco">Tabac</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="landraces">Landraces</Label>
                  <Switch
                    id="landraces"
                    checked={includeLandraces}
                    onCheckedChange={setIncludeLandraces}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="modern">Hybrides modernes</Label>
                  <Switch
                    id="modern"
                    checked={includeModern}
                    onCheckedChange={setIncludeModern}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            {graphData?.stats && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total variétés</span>
                    <Badge variant="secondary">{graphData.stats.totalVarieties}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Landraces</span>
                    <Badge className="bg-green-500">{graphData.stats.landraces}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hybrides</span>
                    <Badge className="bg-indigo-500">{graphData.stats.modern}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Relations</span>
                    <Badge variant="outline">{graphData.stats.relationships}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pays d'origine</span>
                    <Badge variant="outline">{graphData.stats.countries}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Legend */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Légende</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <p className="font-medium">Nœuds</p>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-600 border-2 border-white"></div>
                    <span>Landrace (grande taille)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white"></div>
                    <span>Hybride moderne</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Couleurs par région</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-600"></div>
                      <span>Hindu Kush</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      <span>Asie SE</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                      <span>Afrique</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-cyan-600"></div>
                      <span>Caraïbes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-violet-600"></div>
                      <span>Amérique latine</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                      <span>Moyen-Orient</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Liens</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-green-500"></div>
                    <span>Parent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-amber-500"></div>
                    <span>Hybride</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-blue-500"></div>
                    <span>Clone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-red-500"></div>
                    <span>Mutation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Node Info */}
            {selectedNode && (
              <Card className="border-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    {selectedNode.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedNode.type === "landrace" ? "Landrace" : "Hybride moderne"}
                    {selectedNode.country && ` • ${selectedNode.country}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {selectedNode.dominantMolecules && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Molécules dominantes</p>
                      {Array.isArray(selectedNode.dominantMolecules) ? (
                        <div className="space-y-1">
                          {(selectedNode.dominantMolecules as DominantMolecule[]).map((m, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="font-medium">{m.molecule}</span>
                              <span className="text-muted-foreground">{m.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs">{String(selectedNode.dominantMolecules)}</p>
                      )}
                    </div>
                  )}
                  {selectedNode.olfactiveNotes && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Notes olfactives</p>
                      {typeof selectedNode.olfactiveNotes === 'object' && selectedNode.olfactiveNotes !== null ? (
                        <div className="space-y-1 text-xs">
                          {(selectedNode.olfactiveNotes as OlfactiveNotes).top && (
                            <div><span className="text-muted-foreground">Tête : </span>{(selectedNode.olfactiveNotes as OlfactiveNotes).top!.join(', ')}</div>
                          )}
                          {(selectedNode.olfactiveNotes as OlfactiveNotes).heart && (
                            <div><span className="text-muted-foreground">Cœur : </span>{(selectedNode.olfactiveNotes as OlfactiveNotes).heart!.join(', ')}</div>
                          )}
                          {(selectedNode.olfactiveNotes as OlfactiveNotes).base && (
                            <div><span className="text-muted-foreground">Base : </span>{(selectedNode.olfactiveNotes as OlfactiveNotes).base!.join(', ')}</div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs">{String(selectedNode.olfactiveNotes)}</p>
                      )}
                    </div>
                  )}

                  <Link href={`/varietes/${selectedNode.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      Voir la fiche complète
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Graph Area */}
          <div className="lg:col-span-3">
            <Card className="h-[700px]">
              <CardContent className="p-0 h-full">
                <div ref={containerRef} className="relative w-full h-full">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                  {!isLoading && graphData?.nodes.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                      <GitBranch className="h-16 w-16 mb-4 opacity-50" />
                      <p className="text-lg font-medium">Aucune donnée généalogique</p>
                      <p className="text-sm">Ajustez les filtres ou importez des données</p>
                    </div>
                  )}
                  <svg
                    ref={svgRef}
                    className="w-full h-full"
                    style={{ background: "var(--background)", display: (!isLoading && (graphData?.nodes.length ?? 0) > 0) ? 'block' : 'none' }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Zoom indicator */}
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <span>Zoom: {Math.round(zoom * 100)}%</span>
              <span>Glissez pour déplacer • Cliquez sur un nœud pour plus d'infos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
