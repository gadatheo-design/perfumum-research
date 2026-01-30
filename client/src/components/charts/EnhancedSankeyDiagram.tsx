/**
 * Diagramme Sankey amélioré avec animations, tooltips et interactions avancées
 * Visualise les flux entre catégories, familles et recettes
 */

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from "d3-sankey";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut, RotateCcw, Info } from "lucide-react";

interface SankeyNodeData {
  name: string;
  category: string;
  value?: number;
  color?: string;
}

interface SankeyLinkData {
  source: number;
  target: number;
  value: number;
  metadata?: Record<string, any>;
}

interface SankeyData {
  nodes: SankeyNodeData[];
  links: SankeyLinkData[];
}

interface TooltipData {
  type: 'node' | 'link';
  x: number;
  y: number;
  content: {
    title: string;
    subtitle?: string;
    value: number;
    details?: { label: string; value: string }[];
  };
}

interface EnhancedSankeyDiagramProps {
  data: SankeyData;
  width?: number;
  height?: number;
  nodeWidth?: number;
  nodePadding?: number;
  colorScheme?: 'default' | 'warm' | 'cool' | 'nature';
  showLabels?: boolean;
  showValues?: boolean;
  animate?: boolean;
  title?: string;
  onNodeClick?: (node: SankeyNodeData) => void;
  onLinkClick?: (link: SankeyLinkData) => void;
}

// Palettes de couleurs par catégorie
const COLOR_SCHEMES = {
  default: {
    category: "oklch(0.65 0.25 280)",
    family: "oklch(0.70 0.20 200)",
    recette: "oklch(0.75 0.15 60)",
    molecule: "oklch(0.60 0.22 150)",
    plant: "oklch(0.68 0.20 140)",
    terroir: "oklch(0.72 0.18 45)",
  },
  warm: {
    category: "oklch(0.65 0.25 30)",
    family: "oklch(0.70 0.22 50)",
    recette: "oklch(0.75 0.18 70)",
    molecule: "oklch(0.68 0.20 40)",
    plant: "oklch(0.72 0.15 60)",
    terroir: "oklch(0.60 0.25 20)",
  },
  cool: {
    category: "oklch(0.65 0.20 240)",
    family: "oklch(0.70 0.18 220)",
    recette: "oklch(0.75 0.15 200)",
    molecule: "oklch(0.60 0.22 260)",
    plant: "oklch(0.68 0.20 180)",
    terroir: "oklch(0.72 0.16 230)",
  },
  nature: {
    category: "oklch(0.55 0.20 140)",
    family: "oklch(0.60 0.22 120)",
    recette: "oklch(0.65 0.18 100)",
    molecule: "oklch(0.58 0.24 160)",
    plant: "oklch(0.62 0.26 130)",
    terroir: "oklch(0.68 0.15 80)",
  },
};

export function EnhancedSankeyDiagram({
  data,
  width = 960,
  height = 600,
  nodeWidth = 20,
  nodePadding = 12,
  colorScheme = 'default',
  showLabels = true,
  showValues = true,
  animate = true,
  title,
  onNodeClick,
  onLinkClick,
}: EnhancedSankeyDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [zoom, setZoom] = useState(1);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const colors = COLOR_SCHEMES[colorScheme];

  const getNodeColor = useCallback((category: string) => {
    return colors[category as keyof typeof colors] || colors.category;
  }, [colors]);

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
          link.download = `sankey-diagram-${Date.now()}.png`;
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

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 30, right: 150, bottom: 30, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Main group with zoom transform
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top}) scale(${zoom})`);

    // Create sankey generator
    const sankeyGenerator = sankey<SankeyNode<SankeyNodeData, SankeyLinkData>, SankeyLink<SankeyNodeData, SankeyLinkData>>()
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ]);

    // Generate sankey layout
    const graph = sankeyGenerator({
      nodes: data.nodes.map((d) => ({ ...d })),
      links: data.links.map((d) => ({ ...d })),
    });

    // Gradient definitions for links
    const defs = svg.append("defs");
    
    graph.links.forEach((link: any, i: number) => {
      const gradient = defs.append("linearGradient")
        .attr("id", `link-gradient-${i}`)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", link.source.x1)
        .attr("x2", link.target.x0);

      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", getNodeColor(link.source.category));

      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", getNodeColor(link.target.category));
    });

    // Draw links with animation
    const links = g.append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(graph.links)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d: any, i: number) => `url(#link-gradient-${i})`)
      .attr("stroke-width", (d: any) => Math.max(1, d.width))
      .attr("fill", "none")
      .attr("opacity", 0)
      .style("cursor", "pointer")
      .on("mouseover", function (event: MouseEvent, d: any) {
        d3.select(this).attr("opacity", 0.8);
        
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltip({
            type: 'link',
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            content: {
              title: `${d.source.name} → ${d.target.name}`,
              value: d.value,
              details: [
                { label: "Source", value: d.source.name },
                { label: "Cible", value: d.target.name },
                { label: "Flux", value: `${d.value} éléments` },
              ],
            },
          });
        }
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", highlightedNode ? 0.1 : 0.4);
        setTooltip(null);
      })
      .on("click", function (event: MouseEvent, d: any) {
        if (onLinkClick) {
          onLinkClick({
            source: d.source.index,
            target: d.target.index,
            value: d.value,
          });
        }
      });

    // Animate links
    if (animate) {
      links.transition()
        .duration(800)
        .delay((d: any, i: number) => i * 20)
        .attr("opacity", 0.4);
    } else {
      links.attr("opacity", 0.4);
    }

    // Draw nodes with animation
    const nodes = g.append("g")
      .attr("class", "nodes")
      .selectAll("rect")
      .data(graph.nodes)
      .join("rect")
      .attr("x", (d: any) => d.x0)
      .attr("y", (d: any) => d.y0)
      .attr("height", (d: any) => Math.max(1, d.y1 - d.y0))
      .attr("width", (d: any) => d.x1 - d.x0)
      .attr("fill", (d: any) => getNodeColor(d.category))
      .attr("stroke", "oklch(0.2 0 0)")
      .attr("stroke-width", 1)
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("opacity", 0)
      .style("cursor", "pointer")
      .on("mouseover", function (event: MouseEvent, d: any) {
        d3.select(this)
          .attr("stroke-width", 2)
          .attr("stroke", "oklch(0.5 0.2 280)");
        
        setHighlightedNode(d.name);
        
        // Highlight connected links
        links.attr("opacity", (l: any) => 
          l.source.name === d.name || l.target.name === d.name ? 0.8 : 0.1
        );

        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltip({
            type: 'node',
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            content: {
              title: d.name,
              subtitle: d.category,
              value: d.value || 0,
              details: [
                { label: "Catégorie", value: d.category },
                { label: "Valeur totale", value: `${d.value || 0}` },
                { label: "Entrées", value: `${d.targetLinks?.length || 0}` },
                { label: "Sorties", value: `${d.sourceLinks?.length || 0}` },
              ],
            },
          });
        }
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("stroke-width", 1)
          .attr("stroke", "oklch(0.2 0 0)");
        
        setHighlightedNode(null);
        links.attr("opacity", 0.4);
        setTooltip(null);
      })
      .on("click", function (event: MouseEvent, d: any) {
        if (onNodeClick) {
          onNodeClick({
            name: d.name,
            category: d.category,
            value: d.value,
          });
        }
      });

    // Animate nodes
    if (animate) {
      nodes.transition()
        .duration(600)
        .delay((d: any, i: number) => i * 30)
        .attr("opacity", 1);
    } else {
      nodes.attr("opacity", 1);
    }

    // Add labels
    if (showLabels) {
      const labels = g.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(graph.nodes)
        .join("text")
        .attr("x", (d: any) => (d.x0 < innerWidth / 2 ? d.x1 + 8 : d.x0 - 8))
        .attr("y", (d: any) => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", (d: any) => (d.x0 < innerWidth / 2 ? "start" : "end"))
        .attr("font-size", "12px")
        .attr("font-weight", "500")
        .attr("fill", "currentColor")
        .attr("opacity", 0)
        .text((d: any) => {
          const name = d.name;
          return name.length > 20 ? name.substring(0, 18) + "..." : name;
        });

      // Animate labels
      if (animate) {
        labels.transition()
          .duration(400)
          .delay((d: any, i: number) => 600 + i * 20)
          .attr("opacity", 1);
      } else {
        labels.attr("opacity", 1);
      }

      // Add value labels
      if (showValues) {
        g.append("g")
          .attr("class", "value-labels")
          .selectAll("text")
          .data(graph.nodes)
          .join("text")
          .attr("x", (d: any) => (d.x0 < innerWidth / 2 ? d.x1 + 8 : d.x0 - 8))
          .attr("y", (d: any) => (d.y1 + d.y0) / 2 + 14)
          .attr("dy", "0.35em")
          .attr("text-anchor", (d: any) => (d.x0 < innerWidth / 2 ? "start" : "end"))
          .attr("font-size", "10px")
          .attr("fill", "currentColor")
          .attr("opacity", 0.6)
          .text((d: any) => d.value ? `(${d.value})` : "");
      }
    }

    // Add title if provided
    if (title) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "600")
        .attr("fill", "currentColor")
        .text(title);
    }

  }, [data, width, height, nodeWidth, nodePadding, zoom, animate, showLabels, showValues, title, getNodeColor, highlightedNode, onNodeClick, onLinkClick]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background/80 backdrop-blur"
          onClick={() => setZoom(z => Math.min(z + 0.1, 2))}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background/80 backdrop-blur"
          onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background/80 backdrop-blur"
          onClick={() => setZoom(1)}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background/80 backdrop-blur"
          onClick={exportAsPNG}
          disabled={isExporting}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* SVG Container */}
      <div className="overflow-x-auto">
        <svg 
          ref={svgRef} 
          width={width} 
          height={height} 
          className="mx-auto"
          style={{ minWidth: width }}
        />
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute pointer-events-none z-20"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 10,
            }}
          >
            <Card className="shadow-lg border-border/50 bg-background/95 backdrop-blur">
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div>
                    <h4 className="font-semibold text-sm">{tooltip.content.title}</h4>
                    {tooltip.content.subtitle && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {tooltip.content.subtitle}
                      </Badge>
                    )}
                  </div>
                  {tooltip.content.details && (
                    <div className="space-y-1 text-xs">
                      {tooltip.content.details.map((detail, i) => (
                        <div key={i} className="flex justify-between gap-4">
                          <span className="text-muted-foreground">{detail.label}:</span>
                          <span className="font-medium">{detail.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {Object.entries(colors).map(([key, color]) => (
          <div key={key} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: color }}
            />
            <span className="capitalize text-muted-foreground">{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
