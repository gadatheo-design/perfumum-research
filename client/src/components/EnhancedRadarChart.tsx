// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface RadarDataPoint {
  axis: string;
  value: number;
  min?: number;
  max?: number;
  avg?: number;
}

interface EnhancedRadarChartProps {
  data: RadarDataPoint[];
  width?: number;
  height?: number;
  showAverage?: boolean;
  showConfidence?: boolean;
  animate?: boolean;
  title?: string;
  color?: string;
  avgColor?: string;
}

export function EnhancedRadarChart({
  data,
  width = 400,
  height = 400,
  showAverage = false,
  showConfidence = false,
  animate = true,
  title = "",
  color = "oklch(0.65 0.25 280)",
  avgColor = "oklch(0.70 0.15 160)",
}: EnhancedRadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const radius = Math.min(width, height) / 2 - 60;
    const centerX = width / 2;
    const centerY = height / 2;

    const g = svg.append("g").attr("transform", `translate(${centerX},${centerY})`);

    // Number of axes
    const numAxes = data.length;
    const angleSlice = (Math.PI * 2) / numAxes;

    // Scale for radius
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    // Draw circular grid
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius / levels) * i;

      g.append("circle")
        .attr("r", levelRadius)
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)
        .attr("stroke-width", 1);

      g.append("text")
        .attr("x", 5)
        .attr("y", -levelRadius)
        .attr("dy", "0.4em")
        .attr("font-size", "10px")
        .attr("fill", "currentColor")
        .attr("opacity", 0.5)
        .text(`${(i * 100) / levels}`);
    }

    // Draw axes
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.2)
        .attr("stroke-width", 1);

      // Axis labels
      const labelX = Math.cos(angle) * (radius + 30);
      const labelY = Math.sin(angle) * (radius + 30);

      g.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("font-size", "12px")
        .attr("font-weight", "500")
        .attr("fill", "currentColor")
        .text(d.axis);
    });

    // Helper to calculate polygon points
    const getPolygonPoints = (values: number[]): [number, number][] => {
      return values
        .map((value, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const r = rScale(value);
          return [Math.cos(angle) * r, Math.sin(angle) * r] as [number, number];
        })
        .concat([[0, 0]] as [number, number][]);
    };

    // Draw confidence zone (min-max area)
    if (showConfidence && data.every((d) => d.min !== undefined && d.max !== undefined)) {
      const minPoints = getPolygonPoints(data.map((d) => d.min!));
      const maxPoints = getPolygonPoints(data.map((d) => d.max!));

      const confidenceArea = g.append("g").attr("class", "confidence-zone");

      // Create area between min and max
      const areaGenerator = d3
        .area<[number, number]>()
        .x((d) => d[0])
        .y0((d, i) => minPoints[i][1])
        .y1((d) => d[1])
        .curve(d3.curveLinearClosed);

      confidenceArea
        .append("path")
        .datum(maxPoints)
        .attr("d", areaGenerator as any)
        .attr("fill", avgColor)
        .attr("opacity", animate ? 0 : 0.15)
        .transition()
        .duration(animate ? 800 : 0)
        .attr("opacity", 0.15);
    }

    // Draw average line
    if (showAverage && data.every((d) => d.avg !== undefined)) {
      const avgPoints = getPolygonPoints(data.map((d) => d.avg!));
      const avgLine = d3
        .line<[number, number]>()
        .x((d) => d[0])
        .y((d) => d[1])
        .curve(d3.curveLinearClosed);

      const avgPath = g
        .append("path")
        .datum(avgPoints)
        .attr("d", avgLine)
        .attr("fill", "none")
        .attr("stroke", avgColor)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("opacity", animate ? 0 : 0.6);

      if (animate) {
        avgPath.transition().duration(800).attr("opacity", 0.6);
      }
    }

    // Draw main data polygon
    const points = getPolygonPoints(data.map((d) => d.value));
    const lineGenerator = d3
      .line<[number, number]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(d3.curveLinearClosed);

    const mainPolygon = g.append("g").attr("class", "main-polygon");

    // Fill
    const fillPath = mainPolygon
      .append("path")
      .datum(points)
      .attr("d", lineGenerator)
      .attr("fill", color)
      .attr("opacity", animate ? 0 : 0.3);

    if (animate) {
      fillPath.transition().duration(1000).attr("opacity", 0.3);
    }

    // Stroke
    const strokePath = mainPolygon
      .append("path")
      .datum(points)
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2);

    if (animate) {
      const totalLength = (strokePath.node() as SVGPathElement).getTotalLength();
      strokePath
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .attr("stroke-dashoffset", 0);
    }

    // Draw data points
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const r = rScale(d.value);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      const circle = g
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", animate ? 0 : 4)
        .attr("fill", color)
        .attr("stroke", "white")
        .attr("stroke-width", 2);

      if (animate) {
        circle.transition().delay(800).duration(300).attr("r", 4);
      }

      // Tooltip
      circle.append("title").text(`${d.axis}: ${(d).toFixed(1)}`);
    });

    // Add title if provided
    if (title) {
      g.append("text")
        .attr("x", 0)
        .attr("y", -radius - 40)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "600")
        .attr("fill", "currentColor")
        .text(title);
    }
  }, [data, width, height, showAverage, showConfidence, animate, color, avgColor, title]);

  const exportSVG = () => {
    if (!svgRef.current) return;

    setIsExporting(true);

    // Clone the SVG
    const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;

    // Get computed styles
    const computedColor = window.getComputedStyle(svgRef.current).color;
    svgClone.setAttribute("style", `color: ${computedColor}`);

    // Serialize to string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);

    // Create blob and download
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `radar-chart-${title || "export"}-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setIsExporting(false), 500);
  };

  return (
    <div className="relative">
      <svg ref={svgRef} width={width} height={height} className="mx-auto" />
      <div className="absolute top-2 right-2">
        <Button
          size="sm"
          variant="outline"
          onClick={exportSVG}
          disabled={isExporting}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Export..." : "Export SVG"}
        </Button>
      </div>
    </div>
  );
}
