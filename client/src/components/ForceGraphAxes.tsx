// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, ZoomIn, ZoomOut, Maximize2, RefreshCw, Info } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface GraphNode {
  id: string;
  numericId: number;
  type: "axis" | "reference";
  code: string;
  name: string;
  metaAxis?: string;
  color: string;
  size: number;
  // Axis specific
  description?: string;
  outputTypes?: string;
  // Reference specific
  author?: string;
  year?: number;
  axisPrimaryCode?: string;
  relevanceScore?: number;
  readStatus?: string;
  // D3 simulation properties
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  strength: number;
  type: "primary" | "secondary";
}

interface ForceGraphAxesProps {
  width?: number;
  height?: number;
  className?: string;
}

const META_AXIS_LABELS: Record<string, string> = {
  meta_a: "Heritage & Archives",
  meta_b: "Arts & Chimie",
  meta_c: "Digital & Datasets",
  other: "Autre",
};

const META_AXIS_COLORS: Record<string, string> = {
  meta_a: "#f59e0b",
  meta_b: "#8b5cf6",
  meta_c: "#06b6d4",
  other: "#6b7280",
};

export function ForceGraphAxes({ width = 900, height = 600, className }: ForceGraphAxesProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [metaAxisFilter, setMetaAxisFilter] = useState<string>("all");
  const [includeReferences, setIncludeReferences] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const { data, isLoading, refetch } = trpc.forceGraph.getReferencesAxesData.useQuery({
    includeReferences,
    metaAxisFilter: metaAxisFilter === "all" ? undefined : metaAxisFilter,
  });

  // Handle container resize
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

  // Initialize and update D3 visualization
  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width: w, height: h } = dimensions;

    // Create container group for zoom
    const g = svg.append("g").attr("class", "graph-container");

    // Setup zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Prepare nodes and links
    const nodes: GraphNode[] = data.nodes.map((n: any) => ({ ...n }));
    const links: GraphLink[] = data.links.map((l: any) => ({ ...l }));

    // Create force simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links)
        .id((d) => d.id)
        .distance((d) => d.type === "primary" ? 100 : 150)
        .strength((d) => d.strength * 0.5))
      .force("charge", d3.forceManyBody()
        .strength((d: any) => d.type === "axis" ? -300 : -50))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collision", d3.forceCollide()
        .radius((d: any) => d.size + 5));

    simulationRef.current = simulation;

    // Create arrow marker for directed links
    svg.append("defs").selectAll("marker")
      .data(["primary", "secondary"])
      .join("marker")
      .attr("id", (d) => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", (d) => d === "primary" ? "#64748b" : "#94a3b8")
      .attr("d", "M0,-5L10,0L0,5");

    // Create links
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => d.type === "primary" ? "#64748b" : "#cbd5e1")
      .attr("stroke-opacity", (d) => d.type === "primary" ? 0.8 : 0.4)
      .attr("stroke-width", (d) => d.strength * 2)
      .attr("marker-end", (d) => `url(#arrow-${d.type})`);

    // Create node groups
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event: any, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any);

    // Add circles for nodes
    node.append("circle")
      .attr("r", (d) => d.size)
      .attr("fill", (d) => d.color)
      .attr("stroke", (d) => d.type === "axis" ? "#1e293b" : "#64748b")
      .attr("stroke-width", (d) => d.type === "axis" ? 3 : 1.5)
      .attr("opacity", 0.9);

    // Add labels for axis nodes
    node.filter((d) => d.type === "axis")
      .append("text")
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", "11px")
      .attr("font-weight", "bold")
      .text((d) => d.code);

    // Add hover effects
    node.on("mouseover", function(event, d) {
      d3.select(this).select("circle")
        .transition()
        .duration(200)
        .attr("r", d.size * 1.3)
        .attr("stroke-width", d.type === "axis" ? 4 : 2.5);

      // Highlight connected links
      link.attr("stroke-opacity", (l: any) => {
        const sourceId = typeof l.source === "object" ? l.source.id : l.source;
        const targetId = typeof l.target === "object" ? l.target.id : l.target;
        return sourceId === d.id || targetId === d.id ? 1 : 0.1;
      });
    })
    .on("mouseout", function(event, d) {
      d3.select(this).select("circle")
        .transition()
        .duration(200)
        .attr("r", d.size)
        .attr("stroke-width", d.type === "axis" ? 3 : 1.5);

      link.attr("stroke-opacity", (l: any) => l.type === "primary" ? 0.8 : 0.4);
    })
    .on("click", (event, d) => {
      event.stopPropagation();
      setSelectedNode(d);
    });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Click on background to deselect
    svg.on("click", () => setSelectedNode(null));

    return () => {
      simulation.stop();
    };
  }, [data, dimensions]);

  const handleZoomIn = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 1.3);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 0.7);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(500)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
    if (simulationRef.current) {
      simulationRef.current.alpha(1).restart();
    }
  }, []);

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">Graphe de Force — Axes & Références</span>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={metaAxisFilter} onValueChange={setMetaAxisFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par méta-axe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les axes</SelectItem>
                <SelectItem value="meta_a">Heritage & Archives</SelectItem>
                <SelectItem value="meta_b">Arts & Chimie</SelectItem>
                <SelectItem value="meta_c">Digital & Datasets</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Switch
                id="include-refs"
                checked={includeReferences}
                onCheckedChange={setIncludeReferences}
              />
              <Label htmlFor="include-refs" className="text-sm">Références</Label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats bar */}
        {data?.stats && 'axesByMetaAxis' in data.stats && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
              {data.stats.axesByMetaAxis?.meta_a || 0} axes Heritage
            </Badge>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
              {data.stats.axesByMetaAxis?.meta_b || 0} axes Arts
            </Badge>
            <Badge variant="outline" className="bg-cyan-500/10 text-cyan-600 border-cyan-500/30">
              {data.stats.axesByMetaAxis?.meta_c || 0} axes Digital
            </Badge>
            <Badge variant="secondary">
              {data.stats.totalReferences || 0} références
            </Badge>
            <Badge variant="secondary">
              {data.stats.totalLinks || 0} connexions
            </Badge>
          </div>
        )}

        {/* Graph container */}
        <div 
          ref={containerRef} 
          className="relative bg-slate-950/50 rounded-lg border border-slate-800 overflow-hidden"
          style={{ minHeight: "500px" }}
        >
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full"
          />

          {/* Zoom controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button size="icon" variant="secondary" onClick={handleZoomIn} title="Zoom avant">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={handleZoomOut} title="Zoom arrière">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={handleReset} title="Réinitialiser">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={() => refetch()} title="Actualiser">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Zoom indicator */}
          <div className="absolute bottom-4 right-4 bg-slate-900/80 px-2 py-1 rounded text-xs text-slate-400">
            Zoom: {Math.round(zoomLevel * 100)}%
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 p-3 rounded-lg text-xs">
            <div className="font-semibold mb-2 text-slate-300">Légende</div>
            <div className="space-y-1">
              {Object.entries(META_AXIS_COLORS).map(([key, color]) => (
                <div key={key} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full border-2 border-slate-700" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-slate-400">{META_AXIS_LABELS[key]}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700">
                <div className="w-3 h-3 rounded-full bg-slate-500" />
                <span className="text-slate-400">Référence</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected node details */}
        {selectedNode && (
          <Card className="mt-4 bg-slate-900/50 border-slate-700">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      style={{ backgroundColor: selectedNode.color }}
                      className="text-white"
                    >
                      {selectedNode.type === "axis" ? "Axe" : "Référence"}
                    </Badge>
                    <span className="font-mono text-sm text-slate-400">{selectedNode.code}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100">{selectedNode.name}</h3>
                  {selectedNode.type === "reference" && selectedNode.author && (
                    <p className="text-sm text-slate-400 mt-1">
                      {selectedNode.author} {selectedNode.year && `(${selectedNode.year})`}
                    </p>
                  )}
                  {selectedNode.type === "axis" && selectedNode.description && (
                    <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                      {selectedNode.description}
                    </p>
                  )}
                  {selectedNode.type === "reference" && selectedNode.axisPrimaryCode && (
                    <p className="text-sm text-slate-500 mt-2">
                      <Info className="inline h-3 w-3 mr-1" />
                      Axe principal: {selectedNode.axisPrimaryCode}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>
                  ✕
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

export default ForceGraphAxes;
