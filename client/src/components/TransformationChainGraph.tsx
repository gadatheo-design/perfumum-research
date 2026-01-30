/**
 * TransformationChainGraph - D3.js visualization of molecular transformation chains
 * Displays connected transformation sequences (e.g., limonène → p-cymène → toluène)
 * Includes CASCADE MODE to focus on a single molecule's complete transformation chain
 */

import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ZoomIn, ZoomOut, RotateCcw, Info, GitBranch, Network, X, ArrowRight } from "lucide-react";

interface Node {
  id: string;
  name: string;
  type: "source" | "product" | "both";
  moleculeId?: number;
  transformationCount: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string | Node;
  target: string | Node;
  transformationType: string;
  temperature?: number;
  description?: string;
  id: number;
}

interface Chain {
  path: string[];
  transformations: string[];
}

const TRANSFORMATION_COLORS: Record<string, string> = {
  pyrolysis: "#ef4444",
  oxidation: "#f97316",
  isomerization: "#eab308",
  dehydration: "#22c55e",
  cyclization: "#06b6d4",
  ring_opening: "#3b82f6",
  polymerization: "#8b5cf6",
  degradation: "#ec4899",
  maillard: "#a16207",
  caramelization: "#d97706",
  other: "#6b7280",
};

const NODE_COLORS = {
  source: "#22c55e",
  product: "#ef4444",
  both: "#8b5cf6",
};

type ViewMode = "network" | "cascade";

export function TransformationChainGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transformationType, setTransformationType] = useState<string>("all");
  const [searchMolecule, setSearchMolecule] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // CASCADE MODE state
  const [viewMode, setViewMode] = useState<ViewMode>("network");
  const [cascadeMolecule, setCascadeMolecule] = useState<string>("");
  const [cascadeDirection, setCascadeDirection] = useState<"downstream" | "upstream" | "both">("downstream");

  const { data, isLoading, refetch } = trpc.research.getTransformationChains.useQuery({
    transformationType: transformationType === "all" ? undefined : transformationType,
    startMolecule: searchMolecule || undefined,
    maxDepth: 5,
  });

  // Get unique source molecules for cascade mode dropdown
  const sourceMolecules = useMemo(() => {
    if (!data?.nodes) return [];
    return data.nodes
      .filter(n => n.type === "source" || n.type === "both")
      .map(n => n.name)
      .sort((a, b) => a.localeCompare(b));
  }, [data?.nodes]);

  // Filter data for cascade mode
  const cascadeData = useMemo(() => {
    if (viewMode !== "cascade" || !cascadeMolecule || !data?.nodes || !data?.links) {
      return null;
    }

    const cascadeMoleculeLower = cascadeMolecule.toLowerCase();
    
    // Build adjacency lists
    const downstream = new Map<string, Set<string>>();
    const upstream = new Map<string, Set<string>>();
    const linkMap = new Map<string, Link>();
    
    for (const link of data.links) {
      const sourceId = typeof link.source === "string" ? link.source : link.source.id;
      const targetId = typeof link.target === "string" ? link.target : link.target.id;
      
      if (!downstream.has(sourceId)) downstream.set(sourceId, new Set());
      downstream.get(sourceId)!.add(targetId);
      
      if (!upstream.has(targetId)) upstream.set(targetId, new Set());
      upstream.get(targetId)!.add(sourceId);
      
      linkMap.set(`${sourceId}->${targetId}`, link);
    }

    // BFS to find all connected nodes
    const connectedNodes = new Set<string>();
    const connectedLinks = new Set<string>();
    const queue: string[] = [cascadeMoleculeLower];
    connectedNodes.add(cascadeMoleculeLower);

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      // Downstream (products)
      if (cascadeDirection === "downstream" || cascadeDirection === "both") {
        const downstreamNodes = downstream.get(current) || new Set();
        for (const next of downstreamNodes) {
          connectedLinks.add(`${current}->${next}`);
          if (!connectedNodes.has(next)) {
            connectedNodes.add(next);
            queue.push(next);
          }
        }
      }
      
      // Upstream (sources)
      if (cascadeDirection === "upstream" || cascadeDirection === "both") {
        const upstreamNodes = upstream.get(current) || new Set();
        for (const prev of upstreamNodes) {
          connectedLinks.add(`${prev}->${current}`);
          if (!connectedNodes.has(prev)) {
            connectedNodes.add(prev);
            queue.push(prev);
          }
        }
      }
    }

    // Filter nodes and links
    const filteredNodes = data.nodes.filter(n => connectedNodes.has(n.id));
    const filteredLinks = data.links.filter(l => {
      const sourceId = typeof l.source === "string" ? l.source : l.source.id;
      const targetId = typeof l.target === "string" ? l.target : l.target.id;
      return connectedLinks.has(`${sourceId}->${targetId}`);
    });

    // Build chain path
    const chainPath: string[] = [];
    const visited = new Set<string>();
    
    function buildPath(nodeId: string) {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      chainPath.push(nodeId);
      
      const nextNodes = downstream.get(nodeId) || new Set();
      for (const next of nextNodes) {
        if (connectedNodes.has(next)) {
          buildPath(next);
        }
      }
    }
    
    // Find root nodes (no upstream in our filtered set)
    const rootNodes = filteredNodes.filter(n => {
      const upstreamNodes = upstream.get(n.id) || new Set();
      return ![...upstreamNodes].some(u => connectedNodes.has(u));
    });
    
    for (const root of rootNodes) {
      buildPath(root.id);
    }

    return {
      nodes: filteredNodes,
      links: filteredLinks,
      chainPath,
      stats: {
        totalNodes: filteredNodes.length,
        totalLinks: filteredLinks.length,
        depth: chainPath.length,
      },
    };
  }, [viewMode, cascadeMolecule, cascadeDirection, data]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(rect.width - 32, 400),
          height: Math.max(rect.height - 100, 400),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // D3 visualization
  useEffect(() => {
    const displayData = viewMode === "cascade" && cascadeData ? cascadeData : data;
    
    if (!displayData?.nodes?.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create main group for zoom/pan
    const g = svg.append("g");

    // Arrow marker for directed edges
    svg.append("defs").selectAll("marker")
      .data(Object.keys(TRANSFORMATION_COLORS))
      .join("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", d => TRANSFORMATION_COLORS[d] || "#6b7280")
      .attr("d", "M0,-5L10,0L0,5");

    // Prepare data
    const nodes: Node[] = displayData.nodes.map(n => ({ ...n }));
    const links: Link[] = displayData.links.map(l => ({
      ...l,
      source: typeof l.source === "string" ? l.source : l.source.id,
      target: typeof l.target === "string" ? l.target : l.target.id,
    }));

    // Different layout for cascade mode
    if (viewMode === "cascade" && cascadeData) {
      // Hierarchical layout for cascade
      const simulation = d3.forceSimulation<Node>(nodes)
        .force("link", d3.forceLink<Node, Link>(links)
          .id(d => d.id)
          .distance(120)
          .strength(1))
        .force("charge", d3.forceManyBody().strength(-500))
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height / 2).strength(0.1))
        .force("collision", d3.forceCollide().radius(40));

      // Draw links with animation
      const link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", d => TRANSFORMATION_COLORS[d.transformationType] || "#6b7280")
        .attr("stroke-width", 3)
        .attr("stroke-opacity", 0.8)
        .attr("marker-end", d => `url(#arrow-${d.transformationType})`)
        .style("cursor", "pointer")
        .on("click", (event, d) => {
          event.stopPropagation();
          setSelectedLink(d);
          setSelectedNode(null);
        });

      // Draw nodes with highlight for cascade molecule
      const node = g.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .style("cursor", "pointer")
        .call(d3.drag<SVGGElement, Node>()
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
          }));

      // Node circles with special styling for cascade source
      node.append("circle")
        .attr("r", d => d.id === cascadeMolecule.toLowerCase() ? 20 : 12 + Math.min(d.transformationCount * 2, 8))
        .attr("fill", d => d.id === cascadeMolecule.toLowerCase() ? "#fbbf24" : NODE_COLORS[d.type])
        .attr("stroke", d => d.id === cascadeMolecule.toLowerCase() ? "#f59e0b" : "#fff")
        .attr("stroke-width", d => d.id === cascadeMolecule.toLowerCase() ? 4 : 2)
        .on("click", (event, d) => {
          event.stopPropagation();
          setSelectedNode(d);
          setSelectedLink(null);
        });

      // Node labels
      node.append("text")
        .text(d => d.name)
        .attr("x", 0)
        .attr("y", d => -(16 + Math.min(d.transformationCount * 2, 8)))
        .attr("text-anchor", "middle")
        .attr("font-size", d => d.id === cascadeMolecule.toLowerCase() ? "13px" : "11px")
        .attr("font-weight", d => d.id === cascadeMolecule.toLowerCase() ? "700" : "500")
        .attr("fill", "#374151")
        .attr("pointer-events", "none");

      simulation.on("tick", () => {
        link
          .attr("x1", d => (d.source as Node).x!)
          .attr("y1", d => (d.source as Node).y!)
          .attr("x2", d => (d.target as Node).x!)
          .attr("y2", d => (d.target as Node).y!);

        node.attr("transform", d => `translate(${d.x},${d.y})`);
      });

      return () => simulation.stop();
    } else {
      // Standard force-directed layout
      const simulation = d3.forceSimulation<Node>(nodes)
        .force("link", d3.forceLink<Node, Link>(links)
          .id(d => d.id)
          .distance(100)
          .strength(0.5))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(30));

      const link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", d => TRANSFORMATION_COLORS[d.transformationType] || "#6b7280")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.7)
        .attr("marker-end", d => `url(#arrow-${d.transformationType})`)
        .style("cursor", "pointer")
        .on("click", (event, d) => {
          event.stopPropagation();
          setSelectedLink(d);
          setSelectedNode(null);
        })
        .on("mouseover", function() {
          d3.select(this).attr("stroke-width", 4).attr("stroke-opacity", 1);
        })
        .on("mouseout", function() {
          d3.select(this).attr("stroke-width", 2).attr("stroke-opacity", 0.7);
        });

      const node = g.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .style("cursor", "pointer")
        .call(d3.drag<SVGGElement, Node>()
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
          }));

      node.append("circle")
        .attr("r", d => 8 + Math.min(d.transformationCount * 2, 12))
        .attr("fill", d => NODE_COLORS[d.type])
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .on("click", (event, d) => {
          event.stopPropagation();
          setSelectedNode(d);
          setSelectedLink(null);
        })
        .on("mouseover", function() {
          d3.select(this).attr("stroke-width", 4);
        })
        .on("mouseout", function() {
          d3.select(this).attr("stroke-width", 2);
        })
        .on("dblclick", (event, d) => {
          // Double-click to enter cascade mode
          event.stopPropagation();
          setCascadeMolecule(d.name);
          setViewMode("cascade");
        });

      node.append("text")
        .text(d => d.name)
        .attr("x", 0)
        .attr("y", d => -(12 + Math.min(d.transformationCount * 2, 12)))
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("font-weight", "500")
        .attr("fill", "#374151")
        .attr("pointer-events", "none");

      simulation.on("tick", () => {
        link
          .attr("x1", d => (d.source as Node).x!)
          .attr("y1", d => (d.source as Node).y!)
          .attr("x2", d => (d.target as Node).x!)
          .attr("y2", d => (d.target as Node).y!);

        node.attr("transform", d => `translate(${d.x},${d.y})`);
      });

      svg.on("click", () => {
        setSelectedNode(null);
        setSelectedLink(null);
      });

      return () => simulation.stop();
    }
  }, [data, cascadeData, viewMode, cascadeMolecule, dimensions]);

  const handleZoomIn = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
        1.5
      );
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
        0.67
      );
    }
  };

  const handleReset = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().call(
        d3.zoom<SVGSVGElement, unknown>().transform as any,
        d3.zoomIdentity
      );
    }
  };

  const handleExitCascade = () => {
    setViewMode("network");
    setCascadeMolecule("");
    setSelectedNode(null);
    setSelectedLink(null);
  };

  const displayStats = viewMode === "cascade" && cascadeData ? cascadeData.stats : data?.stats;

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* Mode Toggle */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "network" ? "default" : "outline"}
            size="sm"
            onClick={() => handleExitCascade()}
            className="gap-2"
          >
            <Network className="h-4 w-4" />
            Réseau complet
          </Button>
          <Button
            variant={viewMode === "cascade" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cascade")}
            className="gap-2"
          >
            <GitBranch className="h-4 w-4" />
            Mode Cascade
          </Button>
        </div>
        
        {viewMode === "cascade" && cascadeMolecule && (
          <Badge variant="secondary" className="gap-2 py-1 px-3">
            <span>Cascade: {cascadeMolecule}</span>
            <X className="h-3 w-3 cursor-pointer" onClick={handleExitCascade} />
          </Badge>
        )}
      </div>

      {/* Cascade Mode Controls */}
      {viewMode === "cascade" && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-amber-600" />
              Mode Cascade — Chaîne de transformation
            </CardTitle>
            <CardDescription>
              Sélectionnez une molécule source pour afficher sa chaîne de transformation complète
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-1.5 block">Molécule source</label>
                <Select value={cascadeMolecule} onValueChange={setCascadeMolecule}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une molécule..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceMolecules.map(mol => (
                      <SelectItem key={mol} value={mol}>{mol}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-[180px]">
                <label className="text-sm font-medium mb-1.5 block">Direction</label>
                <Select value={cascadeDirection} onValueChange={(v) => setCascadeDirection(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="downstream">Produits (aval)</SelectItem>
                    <SelectItem value="upstream">Sources (amont)</SelectItem>
                    <SelectItem value="both">Les deux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={handleExitCascade} className="gap-2">
                <X className="h-4 w-4" />
                Quitter le mode cascade
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Standard Controls (Network mode) */}
      {viewMode === "network" && (
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Rechercher une molécule..."
              value={searchMolecule}
              onChange={(e) => setSearchMolecule(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={transformationType} onValueChange={setTransformationType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type de transformation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="pyrolysis">Pyrolyse</SelectItem>
              <SelectItem value="oxidation">Oxydation</SelectItem>
              <SelectItem value="isomerization">Isomérisation</SelectItem>
              <SelectItem value="dehydration">Déshydratation</SelectItem>
              <SelectItem value="cyclization">Cyclisation</SelectItem>
              <SelectItem value="ring_opening">Ouverture de cycle</SelectItem>
              <SelectItem value="degradation">Dégradation</SelectItem>
              <SelectItem value="maillard">Maillard</SelectItem>
              <SelectItem value="caramelization">Caramélisation</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom avant">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom arrière">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset} title="Réinitialiser">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Stats */}
      {displayStats && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{displayStats.totalNodes} molécules</Badge>
          <Badge variant="secondary">{displayStats.totalLinks} transformations</Badge>
          {viewMode === "cascade" && cascadeData?.stats?.depth && (
            <Badge variant="outline" className="border-amber-400 text-amber-700">
              Profondeur: {cascadeData.stats.depth} étapes
            </Badge>
          )}
          {viewMode === "network" && data?.stats?.totalChains && (
            <Badge variant="secondary">{data.stats.totalChains} chaînes</Badge>
          )}
          {viewMode === "network" && data?.stats?.longestChain && data.stats.longestChain > 0 && (
            <Badge variant="outline">Chaîne max: {data.stats.longestChain} étapes</Badge>
          )}
        </div>
      )}

      {/* Cascade Chain Path */}
      {viewMode === "cascade" && cascadeData && cascadeData.chainPath.length > 0 && (
        <Card className="border-amber-200">
          <CardContent className="py-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-amber-700">Chaîne:</span>
              {cascadeData.chainPath.map((mol, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span 
                    className={`font-medium ${mol.toLowerCase() === cascadeMolecule.toLowerCase() ? 'text-amber-600 bg-amber-100 px-2 py-0.5 rounded' : ''}`}
                  >
                    {mol}
                  </span>
                  {i < cascadeData.chainPath.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main visualization */}
      <Card>
        <CardContent className="p-0 relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-[500px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : viewMode === "cascade" && !cascadeMolecule ? (
            <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
              <GitBranch className="h-16 w-16 text-amber-500/30 mb-4" />
              <p className="text-lg font-medium">Sélectionnez une molécule source</p>
              <p className="text-sm">pour afficher sa chaîne de transformation complète</p>
            </div>
          ) : viewMode === "cascade" && cascadeData && cascadeData.nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
              <Info className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium">Aucune transformation trouvée</p>
              <p className="text-sm">pour cette molécule dans la direction sélectionnée</p>
            </div>
          ) : !data?.success ? (
            <div className="flex items-center justify-center h-[500px] text-muted-foreground">
              Erreur lors du chargement des données
            </div>
          ) : data.nodes.length === 0 ? (
            <div className="flex items-center justify-center h-[500px] text-muted-foreground">
              Aucune transformation trouvée
            </div>
          ) : (
            <svg
              ref={svgRef}
              width={dimensions.width}
              height={dimensions.height}
              className={`rounded-lg ${viewMode === "cascade" ? "bg-gradient-to-br from-amber-50 to-orange-50" : "bg-gradient-to-br from-slate-50 to-slate-100"}`}
            />
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border text-xs">
            <div className="font-medium mb-2">Légende</div>
            <div className="space-y-1">
              {viewMode === "cascade" && (
                <div className="flex items-center gap-2 pb-1 border-b mb-1">
                  <div className="w-3 h-3 rounded-full bg-amber-400 border-2 border-amber-500" />
                  <span className="font-medium">Molécule sélectionnée</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS.source }} />
                <span>Molécule source</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS.product }} />
                <span>Produit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS.both }} />
                <span>Source & Produit</span>
              </div>
            </div>
            <div className="border-t mt-2 pt-2 space-y-1">
              {Object.entries(TRANSFORMATION_COLORS).slice(0, 5).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="w-4 h-0.5" style={{ backgroundColor: color }} />
                  <span className="capitalize">{type.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Zoom controls for cascade mode */}
          {viewMode === "cascade" && (
            <div className="absolute top-4 right-4 flex gap-1">
              <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom avant" className="bg-white/90">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom arrière" className="bg-white/90">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleReset} title="Réinitialiser" className="bg-white/90">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected info panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedNode && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedNode.id === cascadeMolecule.toLowerCase() ? "#fbbf24" : NODE_COLORS[selectedNode.type] }}
                />
                {selectedNode.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline">
                    {selectedNode.type === "source" ? "Source" : selectedNode.type === "product" ? "Produit" : "Source & Produit"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transformations:</span>
                  <span className="font-medium">{selectedNode.transformationCount}</span>
                </div>
                {selectedNode.moleculeId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID Molécule:</span>
                    <span className="font-mono text-xs">{selectedNode.moleculeId}</span>
                  </div>
                )}
                {viewMode === "network" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 gap-2"
                    onClick={() => {
                      setCascadeMolecule(selectedNode.name);
                      setViewMode("cascade");
                    }}
                  >
                    <GitBranch className="h-4 w-4" />
                    Voir la cascade
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedLink && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-4 w-4" />
                Transformation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">De:</span>
                  <span className="font-medium">
                    {typeof selectedLink.source === "string" ? selectedLink.source : selectedLink.source.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Vers:</span>
                  <span className="font-medium">
                    {typeof selectedLink.target === "string" ? selectedLink.target : selectedLink.target.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge style={{ backgroundColor: TRANSFORMATION_COLORS[selectedLink.transformationType] }}>
                    {selectedLink.transformationType.replace("_", " ")}
                  </Badge>
                </div>
                {selectedLink.temperature && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Température:</span>
                    <span className="font-medium">{selectedLink.temperature}°C</span>
                  </div>
                )}
                {selectedLink.description && (
                  <div className="pt-2 border-t">
                    <span className="text-muted-foreground">Description:</span>
                    <p className="mt-1 text-xs">{selectedLink.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chains list (only in network mode) */}
      {viewMode === "network" && data?.chains && data.chains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chaînes de transformation</CardTitle>
            <CardDescription>
              Double-cliquez sur une molécule pour voir sa cascade complète
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {data.chains.slice(0, 20).map((chain, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
                  onClick={() => {
                    setCascadeMolecule(chain.path[0]);
                    setViewMode("cascade");
                  }}
                >
                  <div className="flex flex-wrap items-center gap-1 text-sm">
                    {chain.path.map((molecule, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span className="font-medium">{molecule}</span>
                        {i < chain.path.length - 1 && (
                          <span className="text-muted-foreground mx-1">→</span>
                        )}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {chain.transformations.map((type, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: TRANSFORMATION_COLORS[type] || "#6b7280" }}
                      >
                        {type.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default TransformationChainGraph;
