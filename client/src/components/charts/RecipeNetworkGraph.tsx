import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface RecipeNode {
  id: string;
  name: string;
  type: "recipe" | "molecule";
  count?: number; // Pour les molécules : nombre de recettes
}

interface RecipeLink {
  source: string;
  target: string;
  value: number; // Proportion ou force du lien
}

interface RecipeNetworkGraphProps {
  nodes: RecipeNode[];
  links: RecipeLink[];
  width?: number;
  height?: number;
}

export function RecipeNetworkGraph({
  nodes,
  links,
  width = 1200,
  height = 800,
}: RecipeNetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const g = svg.append("g");

    // Zoom behavior
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);

    // Color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(["recipe", "molecule"])
      .range(["oklch(0.65 0.15 142)", "oklch(0.60 0.15 250)"]);

    // Force simulation
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Links
    const link = g
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "oklch(0.5 0 0)")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", (d) => Math.sqrt(d.value) * 2);

    // Nodes
    const node = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g") as any;
    
    node.call(
      d3
        .drag<SVGGElement, RecipeNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

    // Node circles
    node
      .append("circle")
      .attr("r", (d: RecipeNode) => (d.type === "recipe" ? 12 : 8))
      .attr("fill", (d: RecipeNode) => colorScale(d.type))
      .attr("stroke", "oklch(0.95 0 0)")
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    // Node labels
    node
      .append("text")
      .text((d: RecipeNode) => {
        const maxLength = 15;
        return d.name.length > maxLength
          ? d.name.slice(0, maxLength) + "..."
          : d.name;
      })
      .attr("x", 0)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "currentColor")
      .style("pointer-events", "none");

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "oklch(0.2 0 0)")
      .style("color", "oklch(0.95 0 0)")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000")
      .style("box-shadow", "0 4px 6px rgba(0,0,0,0.3)");

    node
      .on("mouseover", function (this: SVGGElement, event: any, d: RecipeNode) {
        tooltip.style("visibility", "visible");
        tooltip.html(
          `<strong>${d.name}</strong><br/>Type: ${d.type === "recipe" ? "Recette" : "Molécule"}${
            d.count ? `<br/>Utilisée dans ${d.count} recettes` : ""
          }`
        );
        d3.select(this).select("circle").attr("r", d.type === "recipe" ? 16 : 12);
      })
      .on("mousemove", function (this: SVGGElement, event: any) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function (this: SVGGElement, event: any, d: RecipeNode) {
        tooltip.style("visibility", "hidden");
        d3.select(this).select("circle").attr("r", d.type === "recipe" ? 12 : 8);
      });

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [nodes, links, width, height]);

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.3);
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 0.7);
  };

  const handleReset = () => {
    const svg = d3.select(svgRef.current);
    svg
      .transition()
      .duration(750)
      .call(
        d3.zoom<SVGSVGElement, unknown>().transform as any,
        d3.zoomIdentity
      );
  };

  if (nodes.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">
          Aucune donnée disponible pour le graphe de réseau
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Zoom: {(zoom * 100).toFixed(0)}%
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 items-center justify-center">
        <Badge
          variant="outline"
          style={{
            backgroundColor: "oklch(0.65 0.15 142)",
            color: "white",
            borderColor: "oklch(0.65 0.15 142)",
          }}
        >
          Recettes
        </Badge>
        <Badge
          variant="outline"
          style={{
            backgroundColor: "oklch(0.60 0.15 250)",
            color: "white",
            borderColor: "oklch(0.60 0.15 250)",
          }}
        >
          Molécules
        </Badge>
      </div>

      {/* Graph */}
      <Card className="overflow-hidden">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          style={{
            maxWidth: "100%",
            height: "auto",
            cursor: "grab",
          }}
        />
      </Card>

      {/* Instructions */}
      <p className="text-xs text-muted-foreground text-center">
        Glissez les nœuds pour réorganiser • Scroll pour zoomer • Survolez pour
        voir les détails
      </p>
    </div>
  );
}
