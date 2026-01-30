/**
 * TransformationChainGraph - D3.js visualization of molecular transformation chains
 * Displays connected transformation sequences (e.g., limonène → p-cymène → toluène)
 */

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ZoomIn, ZoomOut, RotateCcw, Info } from "lucide-react";

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

export function TransformationChainGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transformationType, setTransformationType] = useState<string>("all");
  const [searchMolecule, setSearchMolecule] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const { data, isLoading, refetch } = trpc.research.getTransformationChains.useQuery({
    transformationType: transformationType === "all" ? undefined : transformationType,
    startMolecule: searchMolecule || undefined,
    maxDepth: 5,
  });

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
    if (!data?.success || !data.nodes.length || !svgRef.current) return;

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
    const nodes: Node[] = data.nodes.map(n => ({ ...n }));
    const links: Link[] = data.links.map(l => ({
      ...l,
      source: l.source,
      target: l.target,
    }));

    // Create force simulation
    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links)
        .id(d => d.id)
        .distance(100)
        .strength(0.5))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Draw links
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

    // Draw nodes
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

    // Node circles
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
      });

    // Node labels
    node.append("text")
      .text(d => d.name)
      .attr("x", 0)
      .attr("y", d => -(12 + Math.min(d.transformationCount * 2, 12)))
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .attr("fill", "#374151")
      .attr("pointer-events", "none");

    // Tick function
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
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
  }, [data, dimensions]);

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

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* Controls */}
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

      {/* Stats */}
      {data?.stats && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{data.stats.totalNodes} molécules</Badge>
          <Badge variant="secondary">{data.stats.totalLinks} transformations</Badge>
          <Badge variant="secondary">{data.stats.totalChains} chaînes</Badge>
          {data.stats.longestChain > 0 && (
            <Badge variant="outline">Chaîne max: {data.stats.longestChain} étapes</Badge>
          )}
        </div>
      )}

      {/* Main visualization */}
      <Card>
        <CardContent className="p-0 relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-[500px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
              className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg"
            />
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border text-xs">
            <div className="font-medium mb-2">Légende</div>
            <div className="space-y-1">
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
                  style={{ backgroundColor: NODE_COLORS[selectedNode.type] }}
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

      {/* Chains list */}
      {data?.chains && data.chains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chaînes de transformation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {data.chains.slice(0, 20).map((chain, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
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
