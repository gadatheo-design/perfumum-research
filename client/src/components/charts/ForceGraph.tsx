/**
 * Graphe de force D3.js pour visualiser les connexions entre entités PERFUMUM
 * Supporte les nœuds de différents types (molécules, recettes, accords, etc.)
 * avec interactions avancées (zoom, drag, filtres, recherche)
 */

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  Filter,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Settings2,
  Eye,
  EyeOff
} from "lucide-react";

// Types de nœuds supportés
type NodeType = 'molecule' | 'recette' | 'accord' | 'prototype' | 'family' | 'plant' | 'terroir' | 'civilization';

interface GraphNode {
  id: string;
  name: string;
  type: NodeType;
  group?: string;
  value?: number;
  metadata?: Record<string, any>;
  // D3 simulation properties
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  value?: number;
  type?: string;
  metadata?: Record<string, any>;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface TooltipData {
  x: number;
  y: number;
  node: GraphNode;
}

interface ForceGraphProps {
  data: GraphData;
  width?: number;
  height?: number;
  title?: string;
  showLegend?: boolean;
  showControls?: boolean;
  onNodeClick?: (node: GraphNode) => void;
  onLinkClick?: (link: GraphLink) => void;
}

// Couleurs par type de nœud
const NODE_COLORS: Record<NodeType, string> = {
  molecule: "oklch(0.65 0.25 280)",
  recette: "oklch(0.70 0.20 140)",
  accord: "oklch(0.68 0.22 30)",
  prototype: "oklch(0.62 0.24 200)",
  family: "oklch(0.72 0.18 60)",
  plant: "oklch(0.58 0.26 120)",
  terroir: "oklch(0.66 0.20 45)",
  civilization: "oklch(0.60 0.22 320)",
};

const NODE_LABELS: Record<NodeType, string> = {
  molecule: "Molécule",
  recette: "Recette",
  accord: "Accord",
  prototype: "Prototype",
  family: "Famille",
  plant: "Plante",
  terroir: "Terroir",
  civilization: "Civilisation",
};

export function ForceGraph({
  data,
  width = 900,
  height = 600,
  title,
  showLegend = true,
  showControls = true,
  onNodeClick,
  onLinkClick,
}: ForceGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<NodeType>>(new Set(Object.keys(NODE_COLORS) as NodeType[]));
  const [linkStrength, setLinkStrength] = useState(50);
  const [chargeStrength, setChargeStrength] = useState(50);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filtrer les données
  const filteredData = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    
    const filteredNodes = data.nodes.filter(node => {
      const matchesType = selectedTypes.has(node.type);
      const matchesSearch = !searchQuery || 
        node.name.toLowerCase().includes(searchLower) ||
        node.id.toLowerCase().includes(searchLower);
      return matchesType && matchesSearch;
    });

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    
    const filteredLinks = data.links.filter(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });

    return { nodes: filteredNodes, links: filteredLinks };
  }, [data, selectedTypes, searchQuery]);

  // Types présents dans les données
  const presentTypes = useMemo(() => {
    return new Set(data.nodes.map(n => n.type));
  }, [data]);

  // Toggle type visibility
  const toggleType = useCallback((type: NodeType) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  // Export SVG as PNG
  const exportAsPNG = useCallback(async () => {
    if (!svgRef.current) return;
    setIsExporting(true);

    try {
      const svgElement = svgRef.current;
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      canvas.width = width * 2;
      canvas.height = height * 2;

      img.onload = () => {
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const link = document.createElement("a");
          link.download = `force-graph-${Date.now()}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
        setIsExporting(false);
      };

      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error("Export failed:", error);
      setIsExporting(false);
    }
  }, [width, height]);

  // Toggle simulation
  const toggleSimulation = useCallback(() => {
    if (simulationRef.current) {
      if (isSimulationRunning) {
        simulationRef.current.stop();
      } else {
        simulationRef.current.alpha(0.3).restart();
      }
      setIsSimulationRunning(!isSimulationRunning);
    }
  }, [isSimulationRunning]);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    if (simulationRef.current) {
      simulationRef.current.alpha(1).restart();
      setIsSimulationRunning(true);
    }
  }, []);

  // Dessiner le graphe
  useEffect(() => {
    if (!svgRef.current || filteredData.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Créer les groupes
    const g = svg.append("g");

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Créer la simulation
    const simulation = d3.forceSimulation<GraphNode>(filteredData.nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(filteredData.links)
        .id(d => d.id)
        .distance(80 + (100 - linkStrength))
        .strength(linkStrength / 100)
      )
      .force("charge", d3.forceManyBody()
        .strength(-100 - (chargeStrength * 3))
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    simulationRef.current = simulation;

    // Dessiner les liens
    const links = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(filteredData.links)
      .join("line")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", d => Math.sqrt(d.value || 1))
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (onLinkClick) onLinkClick(d);
      });

    // Dessiner les nœuds
    const nodes = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(filteredData.nodes)
      .join("g")
      .style("cursor", "pointer")
      .call(d3.drag<any, GraphNode>()
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
        })
      );

    // Cercles des nœuds
    nodes.append("circle")
      .attr("r", d => 8 + (d.value || 0) * 0.5)
      .attr("fill", d => NODE_COLORS[d.type])
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .on("mouseover", function(event: MouseEvent, d: GraphNode) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 12 + (d.value || 0) * 0.5);
        
        setHighlightedNode(d.id);
        
        // Highlight connected links
        links.attr("stroke-opacity", l => {
          const sourceId = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
          const targetId = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
          return sourceId === d.id || targetId === d.id ? 0.8 : 0.1;
        }).attr("stroke-width", l => {
          const sourceId = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
          const targetId = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
          return sourceId === d.id || targetId === d.id ? 3 : Math.sqrt(l.value || 1);
        });

        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltip({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            node: d,
          });
        }
      })
      .on("mouseout", function(event: MouseEvent, d: GraphNode) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8 + (d.value || 0) * 0.5);
        
        setHighlightedNode(null);
        links.attr("stroke-opacity", 0.3)
          .attr("stroke-width", l => Math.sqrt(l.value || 1));
        setTooltip(null);
      })
      .on("click", (event, d) => {
        if (onNodeClick) onNodeClick(d);
      });

    // Labels des nœuds
    nodes.append("text")
      .attr("dx", 12)
      .attr("dy", 4)
      .attr("font-size", "10px")
      .attr("fill", "currentColor")
      .attr("pointer-events", "none")
      .text(d => d.name.length > 15 ? d.name.substring(0, 13) + "..." : d.name);

    // Tick function
    simulation.on("tick", () => {
      links
        .attr("x1", d => (d.source as GraphNode).x || 0)
        .attr("y1", d => (d.source as GraphNode).y || 0)
        .attr("x2", d => (d.target as GraphNode).x || 0)
        .attr("y2", d => (d.target as GraphNode).y || 0);

      nodes.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Title
    if (title) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "600")
        .attr("fill", "currentColor")
        .text(title);
    }

    return () => {
      simulation.stop();
    };
  }, [filteredData, width, height, linkStrength, chargeStrength, title, onNodeClick, onLinkClick]);

  // Stats
  const stats = useMemo(() => ({
    nodes: filteredData.nodes.length,
    links: filteredData.links.length,
    types: new Set(filteredData.nodes.map(n => n.type)).size,
  }), [filteredData]);

  if (data.nodes.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Filter className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Aucune donnée disponible pour le graphe
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div ref={containerRef} className={`relative space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
      {/* Controls */}
      {showControls && (
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-48"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={toggleSimulation}
              title={isSimulationRunning ? "Pause" : "Play"}
            >
              {isSimulationRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={resetSimulation}
              title="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={exportAsPNG}
              disabled={isExporting}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type filters */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Types de nœuds</h4>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(NODE_COLORS) as NodeType[]).filter(t => presentTypes.has(t)).map(type => (
                      <div
                        key={type}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleType(type)}
                      >
                        <Checkbox
                          checked={selectedTypes.has(type)}
                          className="h-4 w-4"
                        />
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: NODE_COLORS[type] }}
                        />
                        <span className="text-sm">{NODE_LABELS[type]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Force settings */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Force des liens</span>
                      <span className="text-muted-foreground">{linkStrength}%</span>
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
                    <div className="flex justify-between text-sm">
                      <span>Répulsion</span>
                      <span className="text-muted-foreground">{chargeStrength}%</span>
                    </div>
                    <Slider
                      value={[chargeStrength]}
                      onValueChange={([v]) => setChargeStrength(v)}
                      min={10}
                      max={100}
                      step={5}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{stats.nodes} nœuds</Badge>
        <Badge variant="secondary">{stats.links} liens</Badge>
        <Badge variant="secondary">{stats.types} types</Badge>
      </div>

      {/* Graph */}
      <div className="border rounded-lg bg-background overflow-hidden">
        <svg 
          ref={svgRef} 
          width={isFullscreen ? window.innerWidth - 32 : width} 
          height={isFullscreen ? window.innerHeight - 200 : height}
          className="w-full"
        />
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-4 justify-center pt-2">
          {(Object.keys(NODE_COLORS) as NodeType[]).filter(t => presentTypes.has(t)).map(type => (
            <div key={type} className="flex items-center gap-2 text-sm">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: NODE_COLORS[type] }}
              />
              <span className="text-muted-foreground">{NODE_LABELS[type]}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute pointer-events-none z-20"
            style={{
              left: Math.min(tooltip.x + 10, (containerRef.current?.clientWidth || 400) - 250),
              top: tooltip.y - 10,
            }}
          >
            <Card className="shadow-lg border-border/50 bg-background/95 backdrop-blur max-w-xs">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: NODE_COLORS[tooltip.node.type] }}
                  />
                  <Badge variant="secondary" className="text-xs">
                    {NODE_LABELS[tooltip.node.type]}
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm">{tooltip.node.name}</h4>
                {tooltip.node.group && (
                  <p className="text-xs text-muted-foreground">
                    Groupe: {tooltip.node.group}
                  </p>
                )}
                {tooltip.node.value !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    Valeur: {tooltip.node.value}
                  </p>
                )}
                {tooltip.node.metadata && Object.keys(tooltip.node.metadata).length > 0 && (
                  <div className="text-xs space-y-1 border-t pt-2 mt-2">
                    {Object.entries(tooltip.node.metadata).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-2">
                        <span className="text-muted-foreground capitalize">{key}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
