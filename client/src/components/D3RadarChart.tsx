import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface RadarDataPoint {
  axis: string;
  value: number;
}

interface D3RadarChartProps {
  data: {
    name: string;
    color: string;
    values: RadarDataPoint[];
  }[];
  width?: number;
  height?: number;
  levels?: number;
  maxValue?: number;
  labelFactor?: number;
  wrapWidth?: number;
  opacityArea?: number;
  dotRadius?: number;
  opacityCircles?: number;
  strokeWidth?: number;
  className?: string;
}

export function D3RadarChart({
  data,
  width = 400,
  height = 400,
  levels = 5,
  maxValue = 100,
  labelFactor = 1.15,
  wrapWidth = 60,
  opacityArea = 0.35,
  dotRadius = 4,
  opacityCircles = 0.1,
  strokeWidth = 2,
  className = ""
}: D3RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const radius = Math.min(chartWidth / 2, chartHeight / 2);

    // Get all axes from the first data series
    const allAxis = data[0].values.map(d => d.axis);
    const total = allAxis.length;
    const angleSlice = (Math.PI * 2) / total;

    // Scale for the radius
    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    // Create the container group
    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Draw the circular grid
    const axisGrid = g.append("g").attr("class", "axisWrapper");

    // Draw the background circles
    axisGrid.selectAll(".levels")
      .data(d3.range(1, levels + 1).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", d => (radius / levels) * d)
      .style("fill", "currentColor")
      .style("stroke", "currentColor")
      .style("fill-opacity", opacityCircles)
      .style("stroke-opacity", 0.3);

    // Draw the level labels
    axisGrid.selectAll(".axisLabel")
      .data(d3.range(1, levels + 1).reverse())
      .enter()
      .append("text")
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", d => (-d * radius) / levels)
      .attr("dy", "0.4em")
      .style("font-size", "10px")
      .style("fill", "currentColor")
      .style("opacity", 0.5)
      .text(d => Math.round((maxValue * d) / levels));

    // Draw the axes
    const axis = axisGrid.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");

    // Draw the lines
    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => rScale(maxValue * 1.05) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => rScale(maxValue * 1.05) * Math.sin(angleSlice * i - Math.PI / 2))
      .style("stroke", "currentColor")
      .style("stroke-opacity", 0.2)
      .style("stroke-width", "1px");

    // Draw the labels
    axis.append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .style("font-weight", "500")
      .style("fill", "currentColor")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => rScale(maxValue * labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => rScale(maxValue * labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d)
      .call(wrap, wrapWidth);

    // Draw the radar chart blobs
    const radarLine = d3.lineRadial<RadarDataPoint>()
      .curve(d3.curveLinearClosed)
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice);

    // Create a wrapper for the blobs
    const blobWrapper = g.selectAll(".radarWrapper")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "radarWrapper");

    // Append the backgrounds
    blobWrapper.append("path")
      .attr("class", "radarArea")
      .attr("d", d => radarLine(d.values) || "")
      .style("fill", d => d.color)
      .style("fill-opacity", opacityArea)
      .on("mouseover", function() {
        // Dim all blobs
        d3.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", 0.1);
        // Bring back the hovered over blob
        d3.select(this)
          .transition().duration(200)
          .style("fill-opacity", 0.7);
      })
      .on("mouseout", function() {
        // Bring back all blobs
        d3.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", opacityArea);
      });

    // Create the outlines
    blobWrapper.append("path")
      .attr("class", "radarStroke")
      .attr("d", d => radarLine(d.values) || "")
      .style("stroke-width", strokeWidth + "px")
      .style("stroke", d => d.color)
      .style("fill", "none");

    // Append the circles
    blobWrapper.selectAll(".radarCircle")
      .data(d => d.values.map(v => ({ ...v, color: d.color })))
      .enter()
      .append("circle")
      .attr("class", "radarCircle")
      .attr("r", dotRadius)
      .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style("fill", d => d.color)
      .style("fill-opacity", 0.8);

    // Helper function to wrap text
    function wrap(text: d3.Selection<SVGTextElement, string, SVGGElement, unknown>, width: number) {
      text.each(function() {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word;
        let line: string[] = [];
        let lineNumber = 0;
        const lineHeight = 1.1;
        const y = text.attr("y");
        const x = text.attr("x");
        const dy = parseFloat(text.attr("dy"));
        let tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if ((tspan.node()?.getComputedTextLength() || 0) > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan")
              .attr("x", x)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      });
    }

  }, [data, width, height, levels, maxValue, labelFactor, wrapWidth, opacityArea, dotRadius, opacityCircles, strokeWidth]);

  return (
    <svg 
      ref={svgRef} 
      width={width} 
      height={height}
      className={className}
    />
  );
}

// Composant de légende pour le radar chart
export function D3RadarLegend({ 
  items 
}: { 
  items: { name: string; color: string }[] 
}) {
  return (
    <div className="flex flex-wrap gap-4 justify-center mt-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm font-medium">{item.name}</span>
        </div>
      ))}
    </div>
  );
}
