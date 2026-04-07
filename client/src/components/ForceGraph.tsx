// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RefreshCw,
  Filter,
  X,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";

// Types pour les nœuds et les liens
export interface GraphNode {
  id: string;
  label: string;
  type: "axis" | "reference" | "plant" | "molecule" | "terroir" | "recette";
  category?: string;
  color?: string;
  size?: number;
  url?: string;
  metadata?: Record<string, any>;
}

export interface GraphLink {
  source: string;
  target: string;
  type?: string;
  strength?: number;
}

interface ForceGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
  width?: number;
  height?: number;
  className?: string;
  onNodeClick?: (node: GraphNode) => void;
}

// Couleurs par type de nœud
const nodeColors: Record<string, string> = {
  axis: "#f59e0b",      // Amber pour les axes
  reference: "#3b82f6", // Blue pour les références
  plant: "#22c55e",     // Green pour les plantes
  molecule: "#8b5cf6",  // Purple pour les molécules
  terroir: "#ef4444",   // Red pour les terroirs
  recette: "#ec4899",   // Pink pour les recettes
};

// Tailles par type de nœud
const nodeSizes: Record<string, number> = {
  axis: 25,
  reference: 15,
  plant: 18,
  molecule: 16,
  terroir: 20,
  recette: 18,
};

// Labels pour les types
const typeLabels: Record<string, string> = {
  axis: "Axes thématiques",
  reference: "Références",
  plant: "Plantes",
  molecule: "Molécules",
  terroir: "Terroirs",
  recette: "Recettes",
};

export function ForceGraph({ 
  nodes, 
  links, 
  width = 900, 
  height = 600,
  className,
  onNodeClick 
}: ForceGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [visibleTypes, setVisibleTypes] = useState<Set<string>>(
    new Set(["axis", "reference", "plant", "molecule", "terroir", "recette"])
  );
  const [linkStrength, setLinkStrength] = useState(0.5);
  const [chargeStrength, setChargeStrength] = useState(-300);
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Filtrer les nœuds et liens visibles
  const filteredNodes = nodes.filter(n => visibleTypes.has(n.type));
  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredLinks = links.filter(
    l => filteredNodeIds.has(l.source as string) && filteredNodeIds.has(l.target as string)
  );

  // Toggle visibility d'un type
  const toggleType = (type: string) => {
    setVisibleTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  // Zoom controls
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

  // Créer et mettre à jour le graphe
  useEffect(() => {
    if (!svgRef.current || filteredNodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Créer le groupe principal pour le zoom
    const g = svg.append("g").attr("class", "graph-container");

    // Configurer le zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Créer les données pour la simulation
    const nodeData = filteredNodes.map(n => ({
      ...n,
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2 + (Math.random() - 0.5) * 100,
    }));

    const linkData = filteredLinks.map(l => ({
      source: l.source,
      target: l.target,
      strength: l.strength || 1,
    }));

    // Créer la simulation
    const simulation = d3.forceSimulation(nodeData)
      .force("link", d3.forceLink(linkData)
        .id((d: any) => d.id)
        .distance(100)
        .strength(linkStrength))
      .force("charge", d3.forceManyBody().strength(chargeStrength))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => (nodeSizes[d.type] || 15) + 5));

    simulationRef.current = simulation;

    // Définir les marqueurs pour les flèches
    svg.append("defs").selectAll("marker")
      .data(["arrow"])
      .enter().append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#999")
      .attr("d", "M0,-5L10,0L0,5");

    // Créer les liens
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(linkData)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", (d: any) => Math.sqrt(d.strength || 1));

    // Créer les nœuds
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodeData)
      .enter().append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(d3.drag<SVGGElement, any>()
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

    // Ajouter les cercles
    node.append("circle")
      .attr("r", (d: any) => nodeSizes[d.type] || 15)
      .attr("fill", (d: any) => d.color || nodeColors[d.type] || "#666")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("mouseover", function(event, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", (nodeSizes[d.type] || 15) * 1.3);
      })
      .on("mouseout", function(event, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", nodeSizes[d.type] || 15);
      })
      .on("click", (event, d: any) => {
        event.stopPropagation();
        setSelectedNode(d);
        onNodeClick?.(d);
      });

    // Ajouter les labels
    node.append("text")
      .text((d: any) => d.label.length > 15 ? d.label.substring(0, 15) + "..." : d.label)
      .attr("x", 0)
      .attr("y", (d: any) => (nodeSizes[d.type] || 15) + 14)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "currentColor")
      .attr("pointer-events", "none");

    // Mettre à jour les positions à chaque tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Clic sur le fond pour désélectionner
    svg.on("click", () => {
      setSelectedNode(null);
    });

    return () => {
      simulation.stop();
    };
  }, [filteredNodes, filteredLinks, width, height, linkStrength, chargeStrength, onNodeClick]);

  // Compter les nœuds par type
  const typeCounts = nodes.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={`relative ${className}`}>
      {/* Contrôles */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Card className="shadow-lg">
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtres</span>
            </div>
            <div className="space-y-2">
              {Object.entries(typeLabels).map(([type, label]) => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox
                    id={`filter-${type}`}
                    checked={visibleTypes.has(type)}
                    onCheckedChange={() => toggleType(type)}
                  />
                  <Label 
                    htmlFor={`filter-${type}`} 
                    className="text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: nodeColors[type] }}
                    />
                    {label}
                    <Badge variant="secondary" className="text-[10px] px-1">
                      {typeCounts[type] || 0}
                    </Badge>
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contrôles de zoom */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
        <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom avant">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom arrière">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset} title="Réinitialiser">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Paramètres de simulation */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="shadow-lg w-64">
          <CardContent className="p-3 space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Force des liens: {safeToFixed(linkStrength, 2)}</Label>
              <Slider
                value={[linkStrength]}
                onValueChange={([v]) => setLinkStrength(v)}
                min={0.1}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Répulsion: {Math.abs(chargeStrength)}</Label>
              <Slider
                value={[Math.abs(chargeStrength)]}
                onValueChange={([v]) => setChargeStrength(-v)}
                min={100}
                max={800}
                step={50}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info du nœud sélectionné */}
      {selectedNode && (
        <Card className="absolute bottom-4 right-4 z-10 w-72 shadow-xl animate-in slide-in-from-right-2">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: nodeColors[selectedNode.type] }}
                />
                <CardTitle className="text-base">{selectedNode.label}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setSelectedNode(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              {typeLabels[selectedNode.type]}
              {selectedNode.category && ` • ${selectedNode.category}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedNode.metadata && Object.entries(selectedNode.metadata).map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="text-muted-foreground">{key}:</span>{" "}
                <span>{String(value)}</span>
              </div>
            ))}
            {selectedNode.url && (
              <Link href={selectedNode.url}>
                <Button variant="default" size="sm" className="w-full mt-2">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Voir les détails
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Légende */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-4 bg-background/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border">
          {Object.entries(typeLabels).filter(([type]) => visibleTypes.has(type)).map(([type, label]) => (
            <div key={type} className="flex items-center gap-1.5 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: nodeColors[type] }}
              />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG du graphe */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-muted/20 rounded-lg border"
        style={{ minHeight: "500px" }}
      />

      {/* Message si pas de données */}
      {filteredNodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">Aucun nœud à afficher</p>
            <p className="text-sm">Activez au moins un type de nœud dans les filtres</p>
          </div>
        </div>
      )}
    </div>
  );
}
