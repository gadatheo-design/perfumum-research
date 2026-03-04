// @ts-nocheck
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from "d3-sankey";

interface SankeyData {
  nodes: { name: string; category: string }[];
  links: { source: number; target: number; value: number }[];
}

interface SankeyDiagramProps {
  data: SankeyData;
  width?: number;
  height?: number;
}

export function SankeyDiagram({ data, width = 960, height = 600 }: SankeyDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create sankey generator
    const sankeyGenerator = sankey<SankeyNode<any, any>, SankeyLink<any, any>>()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ]);

    // Generate sankey layout
    const graph = sankeyGenerator({
      nodes: data.nodes.map((d) => ({ ...d })),
      links: data.links.map((d) => ({ ...d })),
    });

    // Color scale by category
    const colorScale = d3.scaleOrdinal<string>()
      .domain(["category", "recette"])
      .range(["oklch(0.65 0.25 280)", "oklch(0.75 0.15 60)"]);

    // Draw links
    g.append("g")
      .selectAll("path")
      .data(graph.links)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d: any) => {
        const sourceCategory = (d.source as any).category;
        return colorScale(sourceCategory);
      })
      .attr("stroke-width", (d: any) => Math.max(1, d.width))
      .attr("fill", "none")
      .attr("opacity", 0.3)
      .on("mouseover", function () {
        d3.select(this).attr("opacity", 0.6);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 0.3);
      })
      .append("title")
      .text((d: any) => `${d.source.name} → ${d.target.name}\n${d.value} recettes`);

    // Draw nodes
    const node = g
      .append("g")
      .selectAll("rect")
      .data(graph.nodes)
      .join("rect")
      .attr("x", (d: any) => d.x0)
      .attr("y", (d: any) => d.y0)
      .attr("height", (d: any) => d.y1 - d.y0)
      .attr("width", (d: any) => d.x1 - d.x0)
      .attr("fill", (d: any) => colorScale(d.category))
      .attr("stroke", "oklch(0.2 0 0)")
      .attr("stroke-width", 1);

    node.append("title").text((d: any) => `${d.name}\n${d.value} recettes`);

    // Add labels
    g.append("g")
      .selectAll("text")
      .data(graph.nodes)
      .join("text")
      .attr("x", (d: any) => (d.x0 < innerWidth / 2 ? d.x1 + 6 : d.x0 - 6))
      .attr("y", (d: any) => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d: any) => (d.x0 < innerWidth / 2 ? "start" : "end"))
      .attr("font-size", "12px")
      .attr("fill", "currentColor")
      .text((d: any) => d.name);
  }, [data, width, height]);

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} width={width} height={height} className="mx-auto" />
    </div>
  );
}
