/**
 * Radar Chart multi-données avec comparaison, animations et interactions avancées
 * Permet de comparer plusieurs profils olfactifs sur le même graphique
 */

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Layers } from "lucide-react";

interface RadarDataPoint {
  axis: string;
  value: number;
  min?: number;
  max?: number;
  avg?: number;
}

interface RadarDataSet {
  id: string;
  name: string;
  data: RadarDataPoint[];
  color: string;
  visible?: boolean;
}

interface TooltipData {
  x: number;
  y: number;
  axis: string;
  values: { name: string; value: number; color: string }[];
}

interface MultiRadarChartProps {
  datasets: RadarDataSet[];
  width?: number;
  height?: number;
  levels?: number;
  maxValue?: number;
  showLegend?: boolean;
  showValues?: boolean;
  showConfidence?: boolean;
  animate?: boolean;
  title?: string;
  onDatasetToggle?: (id: string, visible: boolean) => void;
  onAxisClick?: (axis: string) => void;
}

// Palette de couleurs pour les datasets
const DEFAULT_COLORS = [
  "oklch(0.65 0.25 280)",
  "oklch(0.70 0.20 140)",
  "oklch(0.68 0.22 30)",
  "oklch(0.62 0.24 200)",
  "oklch(0.72 0.18 60)",
  "oklch(0.58 0.26 320)",
  "oklch(0.66 0.20 100)",
  "oklch(0.60 0.22 240)",
];

export function MultiRadarChart({
  datasets,
  width = 500,
  height = 500,
  levels = 5,
  maxValue = 100,
  showLegend = true,
  showValues = true,
  showConfidence = false,
  animate = true,
  title,
  onDatasetToggle,
  onAxisClick,
}: MultiRadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [zoom, setZoom] = useState(1);
  const [visibleDatasets, setVisibleDatasets] = useState<Set<string>>(
    new Set(datasets.map(d => d.id))
  );
  const [highlightedDataset, setHighlightedDataset] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Extraire tous les axes uniques
  const allAxes = useMemo(() => {
    const axesSet = new Set<string>();
    datasets.forEach(ds => {
      ds.data.forEach(d => axesSet.add(d.axis));
    });
    return Array.from(axesSet);
  }, [datasets]);

  // Filtrer les datasets visibles
  const activeDatasets = useMemo(() => {
    return datasets.filter(ds => visibleDatasets.has(ds.id));
  }, [datasets, visibleDatasets]);

  // Toggle dataset visibility
  const toggleDataset = useCallback((id: string) => {
    setVisibleDatasets(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    if (onDatasetToggle) {
      onDatasetToggle(id, !visibleDatasets.has(id));
    }
  }, [visibleDatasets, onDatasetToggle]);

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
          link.download = `radar-chart-${Date.now()}.png`;
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

  // Dessiner le radar chart
  useEffect(() => {
    if (!svgRef.current || allAxes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = 80;
    const radius = (Math.min(width, height) / 2 - margin) * zoom;
    const centerX = width / 2;
    const centerY = height / 2;

    const g = svg.append("g").attr("transform", `translate(${centerX},${centerY})`);

    const numAxes = allAxes.length;
    const angleSlice = (Math.PI * 2) / numAxes;

    // Scale for radius
    const rScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]);

    // Draw circular grid
    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius / levels) * i;

      g.append("circle")
        .attr("r", levelRadius)
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)
        .attr("stroke-width", 1);

      // Level labels
      g.append("text")
        .attr("x", 5)
        .attr("y", -levelRadius)
        .attr("dy", "0.4em")
        .attr("font-size", "9px")
        .attr("fill", "currentColor")
        .attr("opacity", 0.4)
        .text(`${Math.round((i * maxValue) / levels)}`);
    }

    // Draw axes
    allAxes.forEach((axis, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Axis line
      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.15)
        .attr("stroke-width", 1);

      // Axis labels
      const labelRadius = radius + 25;
      const labelX = Math.cos(angle) * labelRadius;
      const labelY = Math.sin(angle) * labelRadius;

      const label = g.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "11px")
        .attr("font-weight", "500")
        .attr("fill", "currentColor")
        .style("cursor", onAxisClick ? "pointer" : "default")
        .text(axis.length > 12 ? axis.substring(0, 10) + "..." : axis);

      if (onAxisClick) {
        label.on("click", () => onAxisClick(axis));
      }

      // Axis hover area for tooltip
      const hoverArea = g.append("circle")
        .attr("cx", Math.cos(angle) * (radius * 0.9))
        .attr("cy", Math.sin(angle) * (radius * 0.9))
        .attr("r", 20)
        .attr("fill", "transparent")
        .style("cursor", "pointer")
        .on("mouseover", (event: MouseEvent) => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            const values = activeDatasets.map(ds => {
              const point = ds.data.find(d => d.axis === axis);
              return {
                name: ds.name,
                value: point?.value || 0,
                color: ds.color,
              };
            });
            
            setTooltip({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              axis,
              values,
            });
          }
        })
        .on("mouseout", () => setTooltip(null));
    });

    // Helper to calculate polygon points
    const getPolygonPoints = (data: RadarDataPoint[]): [number, number][] => {
      return allAxes.map((axis, i) => {
        const point = data.find(d => d.axis === axis);
        const value = point?.value || 0;
        const angle = angleSlice * i - Math.PI / 2;
        const r = rScale(value);
        return [Math.cos(angle) * r, Math.sin(angle) * r] as [number, number];
      });
    };

    // Draw confidence zones if enabled
    if (showConfidence) {
      activeDatasets.forEach((dataset, dsIndex) => {
        if (dataset.data.every(d => d.min !== undefined && d.max !== undefined)) {
          const minData = dataset.data.map(d => ({ ...d, value: d.min! }));
          const maxData = dataset.data.map(d => ({ ...d, value: d.max! }));
          
          const minPoints = getPolygonPoints(minData);
          const maxPoints = getPolygonPoints(maxData);

          // Create area between min and max
          const confidencePoints = [...maxPoints, ...minPoints.reverse()];
          
          g.append("polygon")
            .attr("points", confidencePoints.map(p => p.join(",")).join(" "))
            .attr("fill", dataset.color)
            .attr("opacity", animate ? 0 : 0.1)
            .transition()
            .duration(animate ? 600 : 0)
            .delay(dsIndex * 100)
            .attr("opacity", 0.1);
        }
      });
    }

    // Draw data polygons
    activeDatasets.forEach((dataset, dsIndex) => {
      const points = getPolygonPoints(dataset.data);
      const isHighlighted = highlightedDataset === dataset.id;
      const isOther = highlightedDataset && highlightedDataset !== dataset.id;

      const lineGenerator = d3.line<[number, number]>()
        .x(d => d[0])
        .y(d => d[1])
        .curve(d3.curveLinearClosed);

      // Fill
      const fillPath = g.append("path")
        .datum(points)
        .attr("d", lineGenerator)
        .attr("fill", dataset.color)
        .attr("opacity", animate ? 0 : (isOther ? 0.1 : 0.25));

      if (animate) {
        fillPath.transition()
          .duration(800)
          .delay(dsIndex * 150)
          .attr("opacity", isOther ? 0.1 : 0.25);
      }

      // Stroke
      const strokePath = g.append("path")
        .datum(points)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", dataset.color)
        .attr("stroke-width", isHighlighted ? 3 : 2)
        .attr("opacity", isOther ? 0.3 : 1);

      if (animate) {
        const totalLength = (strokePath.node() as SVGPathElement)?.getTotalLength() || 0;
        strokePath
          .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(1000)
          .delay(dsIndex * 150)
          .attr("stroke-dashoffset", 0);
      }

      // Data points
      points.forEach((point, i) => {
        const circle = g.append("circle")
          .attr("cx", point[0])
          .attr("cy", point[1])
          .attr("r", animate ? 0 : (isHighlighted ? 5 : 4))
          .attr("fill", dataset.color)
          .attr("stroke", "white")
          .attr("stroke-width", 2)
          .attr("opacity", isOther ? 0.3 : 1)
          .style("cursor", "pointer");

        if (animate) {
          circle.transition()
            .delay(800 + dsIndex * 150)
            .duration(300)
            .attr("r", isHighlighted ? 5 : 4);
        }

        // Point tooltip
        const dataPoint = dataset.data.find(d => d.axis === allAxes[i]);
        if (dataPoint) {
          circle.append("title")
            .text(`${dataset.name}\n${dataPoint.axis}: ${dataPoint.value.toFixed(1)}`);
        }
      });
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

  }, [datasets, activeDatasets, allAxes, width, height, levels, maxValue, zoom, animate, showConfidence, showValues, title, highlightedDataset, onAxisClick]);

  return (
    <div ref={containerRef} className="relative space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom(z => Math.min(z + 0.1, 1.5))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom(z => Math.max(z - 0.1, 0.6))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom(1)}
          >
            <RotateCcw className="h-4 w-4" />
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

        <Badge variant="secondary" className="gap-1">
          <Layers className="w-3 h-3" />
          {activeDatasets.length} / {datasets.length} profils
        </Badge>
      </div>

      {/* SVG Container */}
      <div className="flex justify-center overflow-hidden">
        <svg ref={svgRef} width={width} height={height} />
      </div>

      {/* Legend */}
      {showLegend && datasets.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center pt-2 border-t">
          {datasets.map((dataset, i) => (
            <div
              key={dataset.id}
              className="flex items-center gap-2 cursor-pointer group"
              onMouseEnter={() => setHighlightedDataset(dataset.id)}
              onMouseLeave={() => setHighlightedDataset(null)}
              onClick={() => toggleDataset(dataset.id)}
            >
              <Checkbox
                checked={visibleDatasets.has(dataset.id)}
                className="h-4 w-4"
                style={{ 
                  borderColor: dataset.color,
                  backgroundColor: visibleDatasets.has(dataset.id) ? dataset.color : 'transparent'
                }}
              />
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dataset.color }}
              />
              <span className={`text-sm ${visibleDatasets.has(dataset.id) ? '' : 'text-muted-foreground line-through'}`}>
                {dataset.name}
              </span>
              {visibleDatasets.has(dataset.id) ? (
                <Eye className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              ) : (
                <EyeOff className="w-3 h-3 text-muted-foreground" />
              )}
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
              left: Math.min(tooltip.x + 10, (containerRef.current?.clientWidth || 400) - 200),
              top: tooltip.y - 10,
            }}
          >
            <Card className="shadow-lg border-border/50 bg-background/95 backdrop-blur">
              <CardContent className="p-3 space-y-2">
                <h4 className="font-semibold text-sm">{tooltip.axis}</h4>
                <div className="space-y-1">
                  {tooltip.values.map((v, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: v.color }}
                        />
                        <span className="text-muted-foreground">{v.name}</span>
                      </div>
                      <span className="font-medium">{v.value.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Export a simple wrapper for single dataset
export function SingleRadarChart({
  data,
  name = "Profil",
  color = DEFAULT_COLORS[0],
  ...props
}: Omit<MultiRadarChartProps, 'datasets'> & {
  data: RadarDataPoint[];
  name?: string;
  color?: string;
}) {
  const datasets: RadarDataSet[] = [{
    id: 'main',
    name,
    data,
    color,
  }];

  return <MultiRadarChart datasets={datasets} showLegend={false} {...props} />;
}
