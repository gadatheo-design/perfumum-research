/*
 * PhylogeneticTree.tsxx
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive phylogenetic tree visualization using D3.js
 * Supports multiple layouts (tree, radial) and interactive controls
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Search, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface TreeNode {
  id: number;
  varietyId: string;
  name: string;
  latinName?: string;
  type: string;
  yearRegistered?: number;
  breeder?: string;
  conservationStatus?: string;
  dominantMolecules?: Array<{ molecule: string; percentage: number }>;
  children?: TreeNode[];
  parent?: number;
  relationshipType?: string;
}

interface PhylogeneticTreeProps {
  data: {
    genus: string;
    species: string;
    rootNodes: TreeNode[];
    stats: {
      cultivars: number;
      hybrids: number;
      clones: number;
      landraces: number;
      wild: number;
      conservationCritical: number;
      conservationEndangered: number;
    };
  };
  layout?: "tree" | "radial";
  onNodeSelect?: (node: TreeNode) => void;
}

const COLORS = {
  cultivar: "#3b82f6",
  chemotype: "#8b5cf6",
  landrace: "#ec4899",
  hybrid: "#f59e0b",
  clone: "#10b981",
  wild: "#6b7280",
  other: "#9ca3af",
};

const CONSERVATION_COLORS = {
  critical: "#dc2626",
  endangered: "#f97316",
  vulnerable: "#eab308",
  near_threatened: "#84cc16",
  stable: "#22c55e",
  data_deficient: "#6b7280",
  unknown: "#d1d5db",
};

export const PhylogeneticTree: React.FC<PhylogeneticTreeProps> = ({
  data,
  layout = "tree",
  onNodeSelect,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [highlightedClades, setHighlightedClades] = useState<Set<number>>(new Set());

  // Color mapping for variety types
  const getNodeColor = (node: TreeNode): string => {
    return COLORS[node.type as keyof typeof COLORS] || COLORS.other;
  };

  // Filter nodes by search term
  const filterNodes = (nodes: TreeNode[], term: string): TreeNode[] => {
    if (!term) return nodes;
    return nodes.filter(
      (node) =>
        node.name.toLowerCase().includes(term.toLowerCase()) ||
        node.latinName?.toLowerCase().includes(term.toLowerCase())
    );
  };

  // Draw tree layout (vertical dendrogramme)
  const drawTreeLayout = () => {
    if (!svgRef.current || !data.rootNodes.length) return;

    const width = containerRef.current?.clientWidth || 1200;
    const height = Math.max(600, data.stats.cultivars * 30 + 200);

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid #e5e7eb")
      .style("background", "#fafafa");

    // Create group for zoom/pan
    const g = svg.append("g").attr("transform", `translate(100, 50)`);

    // Create hierarchy
    const hierarchy = d3.hierarchy<TreeNode>(data.rootNodes[0] || { children: data.rootNodes } as TreeNode);
    const tree = d3.tree<TreeNode>().size([height - 100, width - 200]);
    const root = tree(hierarchy);

    // Draw links
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkVertical<any, any>()
        .x((d) => d.x)
        .y((d) => d.y))
      .style("fill", "none")
      .style("stroke", "#cbd5e1")
      .style("stroke-width", 2);

    // Draw nodes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodes = (g as any)
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer");

    // Node circles
    nodes
      .append("circle")
      .attr("r", 6)
      .style("fill", (d: any) => getNodeColor(d.data))
      .style("stroke", "#fff")
      .style("stroke-width", 2)
      .on("click", (event: MouseEvent, d: any) => {
        event.stopPropagation();
        setSelectedNode(d.data);
        onNodeSelect?.(d.data);
      })
      // `this` doit être annoté : d3 le lie au cercle survolé, mais TypeScript
      // ne peut pas le déduire d'une fonction anonyme.
      .on("mouseover", function (this: SVGCircleElement) {
        d3.select(this).transition().duration(200).attr("r", 8);
      })
      .on("mouseout", function (this: SVGCircleElement) {
        d3.select(this).transition().duration(200).attr("r", 6);
      });

    // Node labels
    nodes
      .append("text")
      .attr("dy", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "500")
      .text((d: any) => d.data.name)
      .style("pointer-events", "none");

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    // Reset zoom button
    svg.on("dblclick.zoom", () => {
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity.translate(100, 50)
      );
      setZoomLevel(1);
    });
  };

  // Draw radial layout (circular dendrogramme)
  const drawRadialLayout = () => {
    if (!svgRef.current || !data.rootNodes.length) return;

    const width = containerRef.current?.clientWidth || 800;
    const height = Math.min(width, 800);
    const radius = Math.min(width, height) / 2 - 100;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid #e5e7eb")
      .style("background", "#fafafa");

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create hierarchy
    const hierarchy = d3.hierarchy<TreeNode>(data.rootNodes[0] || { children: data.rootNodes } as TreeNode);
    const tree = d3.tree<TreeNode>().size([2 * Math.PI, radius]);
    const root = tree(hierarchy);

    // Draw links
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkRadial<any, any>()
        .source((d) => [d.source.y, d.source.x])
        .target((d) => [d.target.y, d.target.x]))
      .style("fill", "none")
      .style("stroke", "#cbd5e1")
      .style("stroke-width", 2);

    // Draw nodes
    const nodes = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `rotate(${(d.x * 180) / Math.PI - 90})translate(${d.y},0)`)
      .style("cursor", "pointer");

    nodes
      .append("circle")
      .attr("r", 5)
      .style("fill", (d) => getNodeColor(d.data as TreeNode))
      .style("stroke", "#fff")
      .style("stroke-width", 2)
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d.data as TreeNode);
        onNodeSelect?.(d.data as TreeNode);
      });

    // Node labels
    nodes
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => (d.x < Math.PI ? 6 : -6))
      .attr("text-anchor", (d) => (d.x < Math.PI ? "start" : "end"))
      .attr("transform", (d) => `rotate(${(d.x * 180) / Math.PI + 90})`)
      .style("font-size", "10px")
      .text((d) => (d.data as TreeNode).name)
      .style("pointer-events", "none");
  };

  // Redraw when data or layout changes
  useEffect(() => {
    if (layout === "radial") {
      drawRadialLayout();
    } else {
      drawTreeLayout();
    }
  }, [data, layout, searchTerm]);

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search varieties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (svgRef.current) {
                const svg = d3.select(svgRef.current);
                svg.transition().duration(750).call(
                  d3.zoom<SVGSVGElement, unknown>().transform,
                  d3.zoomIdentity.translate(100, 50)
                );
                setZoomLevel(1);
              }
            }}
            title="Reset zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={zoomLevel >= 3}
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={zoomLevel <= 0.5}
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <Card className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs capitalize">{type}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Statistics */}
      <Card className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <div className="text-xs text-gray-500">Cultivars</div>
            <div className="text-lg font-bold">{data.stats.cultivars}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Hybrids</div>
            <div className="text-lg font-bold">{data.stats.hybrids}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Clones</div>
            <div className="text-lg font-bold">{data.stats.clones}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Landraces</div>
            <div className="text-lg font-bold">{data.stats.landraces}</div>
          </div>
        </div>
      </Card>

      {/* Tree Container */}
      <div
        ref={containerRef}
        className="w-full border border-gray-200 rounded-lg bg-white overflow-auto"
        style={{ maxHeight: "600px" }}
      >
        <svg ref={svgRef} className="w-full" />
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg">{selectedNode.name}</h3>
                {selectedNode.latinName && (
                  <p className="text-sm text-gray-600 italic">{selectedNode.latinName}</p>
                )}
              </div>
              <Badge variant="outline">{selectedNode.type}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              {selectedNode.yearRegistered && (
                <div>
                  <span className="text-gray-500">Year:</span> {selectedNode.yearRegistered}
                </div>
              )}
              {selectedNode.breeder && (
                <div>
                  <span className="text-gray-500">Breeder:</span> {selectedNode.breeder}
                </div>
              )}
              {selectedNode.conservationStatus && (
                <div>
                  <span className="text-gray-500">Conservation:</span>{" "}
                  <Badge
                    style={{
                      backgroundColor:
                        CONSERVATION_COLORS[
                          selectedNode.conservationStatus as keyof typeof CONSERVATION_COLORS
                        ],
                    }}
                    className="text-white"
                  >
                    {selectedNode.conservationStatus}
                  </Badge>
                </div>
              )}
            </div>

            {selectedNode.dominantMolecules && selectedNode.dominantMolecules.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700">Dominant Molecules:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedNode.dominantMolecules.slice(0, 5).map((mol, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {mol.molecule} ({mol.percentage}%)
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
