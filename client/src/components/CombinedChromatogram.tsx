import { useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, Info, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SpectrumData {
  id: number;
  compound_name: string;
  cas_number?: string;
  molecular_formula?: string;
  molecular_weight?: string;
  spectrum_data?: {
    peaks: Array<{ mz: number; intensity: number }>;
  };
  moleculeName?: string;
  percentage?: string;
  retention_index?: string;
}

interface CombinedChromatogramProps {
  spectra: SpectrumData[];
  materialName: string;
  isLoading?: boolean;
}

// Couleurs pour les différents composés
const COMPOUND_COLORS = [
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
  "#14b8a6", "#a855f7", "#f43f5e", "#22c55e", "#0ea5e9",
];

export function CombinedChromatogram({ spectra, materialName, isLoading }: CombinedChromatogramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Combiner tous les pics en pondérant par le pourcentage
  const combinedPeaks = useMemo(() => {
    if (!spectra || spectra.length === 0) return [];

    const peakMap: Record<number, { mz: number; intensity: number; compounds: string[] }> = {};

    spectra.forEach((spectrum, index) => {
      const percentage = parseFloat(spectrum.percentage || "10") / 100;
      const peaks = spectrum.spectrum_data?.peaks || [];
      const compoundName = spectrum.compound_name || spectrum.moleculeName || `Composé ${index + 1}`;

      peaks.forEach(peak => {
        // Arrondir m/z pour regrouper les pics proches
        const roundedMz = Math.round(peak.mz);
        
        if (!peakMap[roundedMz]) {
          peakMap[roundedMz] = { mz: roundedMz, intensity: 0, compounds: [] };
        }
        
        // Pondérer l'intensité par le pourcentage du composé
        peakMap[roundedMz].intensity += peak.intensity * percentage;
        if (!peakMap[roundedMz].compounds.includes(compoundName)) {
          peakMap[roundedMz].compounds.push(compoundName);
        }
      });
    });

    // Normaliser les intensités à 100
    const peaks = Object.values(peakMap);
    const maxIntensity = Math.max(...peaks.map(p => p.intensity), 1);
    
    return peaks
      .map(p => ({
        ...p,
        intensity: (p.intensity / maxIntensity) * 100,
      }))
      .sort((a, b) => a.mz - b.mz);
  }, [spectra]);

  // Dessiner le chromatogramme
  useEffect(() => {
    if (!svgRef.current || combinedPeaks.length === 0) return;

    const svg = svgRef.current;
    const width = svg.clientWidth || 800;
    const height = svg.clientHeight || 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Clear previous content
    svg.innerHTML = "";

    // Create main group
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${margin.left},${margin.top})`);
    svg.appendChild(g);

    // Scales
    const minMz = Math.min(...combinedPeaks.map(p => p.mz), 30);
    const maxMz = Math.max(...combinedPeaks.map(p => p.mz), 300);
    const xScale = (mz: number) => ((mz - minMz) / (maxMz - minMz)) * chartWidth;
    const yScale = (intensity: number) => chartHeight - (intensity / 100) * chartHeight;

    // Draw axes
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", "0");
    xAxis.setAttribute("y1", String(chartHeight));
    xAxis.setAttribute("x2", String(chartWidth));
    xAxis.setAttribute("y2", String(chartHeight));
    xAxis.setAttribute("stroke", "#374151");
    xAxis.setAttribute("stroke-width", "1");
    g.appendChild(xAxis);

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", "0");
    yAxis.setAttribute("y1", "0");
    yAxis.setAttribute("x2", "0");
    yAxis.setAttribute("y2", String(chartHeight));
    yAxis.setAttribute("stroke", "#374151");
    yAxis.setAttribute("stroke-width", "1");
    g.appendChild(yAxis);

    // X-axis labels
    const xTicks = [50, 100, 150, 200, 250, 300].filter(t => t >= minMz && t <= maxMz);
    xTicks.forEach(tick => {
      const x = xScale(tick);
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", String(x));
      label.setAttribute("y", String(chartHeight + 20));
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("fill", "#9ca3af");
      label.setAttribute("font-size", "12");
      label.textContent = String(tick);
      g.appendChild(label);
    });

    // X-axis title
    const xTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xTitle.setAttribute("x", String(chartWidth / 2));
    xTitle.setAttribute("y", String(chartHeight + 35));
    xTitle.setAttribute("text-anchor", "middle");
    xTitle.setAttribute("fill", "#9ca3af");
    xTitle.setAttribute("font-size", "12");
    xTitle.textContent = "m/z";
    g.appendChild(xTitle);

    // Y-axis labels
    [0, 25, 50, 75, 100].forEach(tick => {
      const y = yScale(tick);
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", "-10");
      label.setAttribute("y", String(y + 4));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("fill", "#9ca3af");
      label.setAttribute("font-size", "10");
      label.textContent = String(tick);
      g.appendChild(label);

      // Grid line
      const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      gridLine.setAttribute("x1", "0");
      gridLine.setAttribute("y1", String(y));
      gridLine.setAttribute("x2", String(chartWidth));
      gridLine.setAttribute("y2", String(y));
      gridLine.setAttribute("stroke", "#1f2937");
      gridLine.setAttribute("stroke-width", "0.5");
      g.appendChild(gridLine);
    });

    // Draw peaks as bars
    combinedPeaks.forEach((peak, index) => {
      const x = xScale(peak.mz);
      const barWidth = Math.max(2, chartWidth / (maxMz - minMz) * 0.8);
      const barHeight = chartHeight - yScale(peak.intensity);

      // Determine color based on intensity
      const color = peak.intensity > 80 ? "#10b981" : 
                   peak.intensity > 50 ? "#3b82f6" : 
                   peak.intensity > 25 ? "#8b5cf6" : "#6b7280";

      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(x - barWidth / 2));
      rect.setAttribute("y", String(yScale(peak.intensity)));
      rect.setAttribute("width", String(barWidth));
      rect.setAttribute("height", String(barHeight));
      rect.setAttribute("fill", color);
      rect.setAttribute("opacity", "0.8");
      rect.setAttribute("class", "cursor-pointer hover:opacity-100 transition-opacity");
      
      // Tooltip data
      rect.setAttribute("data-mz", String(peak.mz));
      rect.setAttribute("data-intensity", String(peak.intensity.toFixed(1)));
      rect.setAttribute("data-compounds", peak.compounds.join(", "));
      
      g.appendChild(rect);

      // Label for major peaks
      if (peak.intensity > 30) {
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", String(x));
        label.setAttribute("y", String(yScale(peak.intensity) - 5));
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("fill", "#d1d5db");
        label.setAttribute("font-size", "9");
        label.textContent = String(peak.mz);
        g.appendChild(label);
      }
    });

  }, [combinedPeaks]);

  // Export as PNG
  const handleExport = () => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    canvas.width = svg.clientWidth * 2;
    canvas.height = svg.clientHeight * 2;
    
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement("a");
        link.download = `chromatogramme-${materialName.replace(/\s+/g, "-").toLowerCase()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!spectra || spectra.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Profil chromatographique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun spectre MS disponible pour cette matière première</p>
            <p className="text-sm mt-2">
              Les spectres seront affichés lorsque les molécules seront liées à des données MS
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              Profil chromatographique combiné
            </CardTitle>
            <CardDescription>
              Spectre de masse combiné de {spectra.length} composé{spectra.length > 1 ? "s" : ""} — {materialName}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Ce chromatogramme combine les spectres MS de toutes les molécules identifiées,
                    pondérés par leur pourcentage dans la matière première.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Exporter PNG
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Graphique SVG */}
        <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
          <svg
            ref={svgRef}
            width="100%"
            height="300"
            className="w-full"
            style={{ minHeight: "300px" }}
          />
        </div>

        {/* Légende des composés */}
        <div className="flex flex-wrap gap-2">
          {spectra.map((spectrum, index) => (
            <Badge
              key={spectrum.id || index}
              variant="outline"
              className="text-xs"
              style={{ borderColor: COMPOUND_COLORS[index % COMPOUND_COLORS.length] }}
            >
              <span
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: COMPOUND_COLORS[index % COMPOUND_COLORS.length] }}
              />
              {spectrum.compound_name || spectrum.moleculeName}
              {spectrum.percentage && ` (${parseFloat(spectrum.percentage).toFixed(1)}%)`}
            </Badge>
          ))}
        </div>

        {/* Statistiques */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold text-emerald-500">{combinedPeaks.length}</p>
            <p className="text-xs text-muted-foreground">Pics m/z</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold text-blue-500">{spectra.length}</p>
            <p className="text-xs text-muted-foreground">Composés</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold text-violet-500">
              {combinedPeaks.filter(p => p.intensity > 50).length}
            </p>
            <p className="text-xs text-muted-foreground">Pics majeurs</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
