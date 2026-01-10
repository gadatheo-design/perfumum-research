/**
 * Heatmap améliorée avec D3.js, animations et interactions avancées
 * Visualise les synergies moléculaires avec zoom, filtres et export
 */

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, ZoomIn, ZoomOut, RotateCcw, Search, Filter, Grid3X3 } from "lucide-react";

interface SynergyData {
  id: number;
  molecule1Name: string | null;
  molecule2Name: string | null;
  type: "potentialisation" | "stabilisation" | "transformation" | "masquage";
  description: string;
  applications?: string | null;
  intensity?: number;
}

interface EnhancedHeatmapProps {
  synergies: SynergyData[];
  maxMolecules?: number;
  cellSize?: number;
  showLabels?: boolean;
  animate?: boolean;
  title?: string;
  onCellClick?: (synergy: SynergyData) => void;
}

interface TooltipData {
  x: number;
  y: number;
  synergy: SynergyData;
}

// Couleurs par type de synergie
const TYPE_COLORS = {
  potentialisation: { main: "oklch(0.65 0.20 142)", light: "oklch(0.85 0.10 142)" },
  stabilisation: { main: "oklch(0.60 0.20 250)", light: "oklch(0.85 0.10 250)" },
  transformation: { main: "oklch(0.65 0.20 300)", light: "oklch(0.85 0.10 300)" },
  masquage: { main: "oklch(0.65 0.20 30)", light: "oklch(0.85 0.10 30)" },
};

const TYPE_LABELS = {
  potentialisation: { short: "P", full: "Potentialisation" },
  stabilisation: { short: "S", full: "Stabilisation" },
  transformation: { short: "T", full: "Transformation" },
  masquage: { short: "M", full: "Masquage" },
};

export function EnhancedHeatmap({
  synergies,
  maxMolecules = 30,
  cellSize = 24,
  showLabels = true,
  animate = true,
  title,
  onCellClick,
}: EnhancedHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [zoom, setZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [highlightedMolecule, setHighlightedMolecule] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filtrer les synergies
  const filteredSynergies = useMemo(() => {
    let filtered = synergies;
    
    if (filterType !== "all") {
      filtered = filtered.filter(s => s.type === filterType);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.molecule1Name?.toLowerCase().includes(query) ||
        s.molecule2Name?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [synergies, filterType, searchQuery]);

  // Extraire les molécules uniques
  const allMolecules = useMemo(() => {
    const moleculeSet = new Set<string>();
    filteredSynergies.forEach((s) => {
      if (s.molecule1Name) moleculeSet.add(s.molecule1Name);
      if (s.molecule2Name) moleculeSet.add(s.molecule2Name);
    });
    return Array.from(moleculeSet).sort().slice(0, maxMolecules);
  }, [filteredSynergies, maxMolecules]);

  // Créer la matrice de synergies
  const synergyMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, SynergyData | null>> = {};
    
    allMolecules.forEach((mol1) => {
      matrix[mol1] = {};
      allMolecules.forEach((mol2) => {
        matrix[mol1][mol2] = null;
      });
    });

    filteredSynergies.forEach((synergy) => {
      if (
        synergy.molecule1Name &&
        synergy.molecule2Name &&
        allMolecules.includes(synergy.molecule1Name) &&
        allMolecules.includes(synergy.molecule2Name)
      ) {
        matrix[synergy.molecule1Name][synergy.molecule2Name] = synergy;
        matrix[synergy.molecule2Name][synergy.molecule1Name] = synergy;
      }
    });

    return matrix;
  }, [filteredSynergies, allMolecules]);

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

      const svgWidth = allMolecules.length * cellSize + 150;
      const svgHeight = allMolecules.length * cellSize + 150;
      
      canvas.width = svgWidth * 2;
      canvas.height = svgHeight * 2;

      img.onload = () => {
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const link = document.createElement("a");
          link.download = `heatmap-synergies-${Date.now()}.png`;
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
  }, [allMolecules.length, cellSize]);

  // Dessiner la heatmap
  useEffect(() => {
    if (!svgRef.current || allMolecules.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 100, right: 20, bottom: 20, left: 120 };
    const width = allMolecules.length * cellSize;
    const height = allMolecules.length * cellSize;

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top}) scale(${zoom})`);

    // Créer les échelles
    const xScale = d3.scaleBand()
      .domain(allMolecules)
      .range([0, width])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(allMolecules)
      .range([0, height])
      .padding(0.05);

    // Dessiner les cellules
    const cells = g.selectAll("rect.cell")
      .data(allMolecules.flatMap(mol1 => 
        allMolecules.map(mol2 => ({
          mol1,
          mol2,
          synergy: synergyMatrix[mol1]?.[mol2],
        }))
      ))
      .join("rect")
      .attr("class", "cell")
      .attr("x", d => xScale(d.mol1) || 0)
      .attr("y", d => yScale(d.mol2) || 0)
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("fill", d => {
        if (!d.synergy) return "oklch(0.95 0 0)";
        return TYPE_COLORS[d.synergy.type].main;
      })
      .attr("stroke", d => {
        if (highlightedMolecule && (d.mol1 === highlightedMolecule || d.mol2 === highlightedMolecule)) {
          return "oklch(0.3 0 0)";
        }
        return "oklch(0.9 0 0)";
      })
      .attr("stroke-width", d => {
        if (highlightedMolecule && (d.mol1 === highlightedMolecule || d.mol2 === highlightedMolecule)) {
          return 2;
        }
        return 0.5;
      })
      .attr("opacity", 0)
      .style("cursor", d => d.synergy ? "pointer" : "default")
      .on("mouseover", function(event: MouseEvent, d: any) {
        if (d.synergy) {
          d3.select(this)
            .attr("stroke", "oklch(0.3 0 0)")
            .attr("stroke-width", 2);
          
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            setTooltip({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              synergy: d.synergy,
            });
          }
        }
      })
      .on("mouseout", function(event: MouseEvent, d: any) {
        d3.select(this)
          .attr("stroke", highlightedMolecule && (d.mol1 === highlightedMolecule || d.mol2 === highlightedMolecule) 
            ? "oklch(0.3 0 0)" 
            : "oklch(0.9 0 0)")
          .attr("stroke-width", highlightedMolecule && (d.mol1 === highlightedMolecule || d.mol2 === highlightedMolecule) 
            ? 2 
            : 0.5);
        setTooltip(null);
      })
      .on("click", function(event: MouseEvent, d: any) {
        if (d.synergy && onCellClick) {
          onCellClick(d.synergy);
        }
      });

    // Animer les cellules
    if (animate) {
      cells.transition()
        .duration(500)
        .delay((d, i) => i * 2)
        .attr("opacity", 1);
    } else {
      cells.attr("opacity", 1);
    }

    // Ajouter les labels de type dans les cellules
    g.selectAll("text.cell-label")
      .data(allMolecules.flatMap(mol1 => 
        allMolecules.map(mol2 => ({
          mol1,
          mol2,
          synergy: synergyMatrix[mol1]?.[mol2],
        }))
      ).filter(d => d.synergy))
      .join("text")
      .attr("class", "cell-label")
      .attr("x", d => (xScale(d.mol1) || 0) + xScale.bandwidth() / 2)
      .attr("y", d => (yScale(d.mol2) || 0) + yScale.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", Math.min(cellSize * 0.5, 12))
      .attr("font-weight", "600")
      .attr("fill", "white")
      .attr("pointer-events", "none")
      .text(d => TYPE_LABELS[d.synergy!.type].short);

    // Labels des axes (molécules)
    if (showLabels) {
      // Labels horizontaux (en haut)
      g.selectAll("text.x-label")
        .data(allMolecules)
        .join("text")
        .attr("class", "x-label")
        .attr("x", d => (xScale(d) || 0) + xScale.bandwidth() / 2)
        .attr("y", -8)
        .attr("text-anchor", "start")
        .attr("transform", d => `rotate(-45, ${(xScale(d) || 0) + xScale.bandwidth() / 2}, -8)`)
        .attr("font-size", "10px")
        .attr("fill", "currentColor")
        .style("cursor", "pointer")
        .text(d => d.length > 12 ? d.substring(0, 10) + "..." : d)
        .on("mouseover", function(event, d) {
          setHighlightedMolecule(d);
          d3.select(this).attr("font-weight", "bold");
        })
        .on("mouseout", function() {
          setHighlightedMolecule(null);
          d3.select(this).attr("font-weight", "normal");
        });

      // Labels verticaux (à gauche)
      g.selectAll("text.y-label")
        .data(allMolecules)
        .join("text")
        .attr("class", "y-label")
        .attr("x", -8)
        .attr("y", d => (yScale(d) || 0) + yScale.bandwidth() / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "10px")
        .attr("fill", "currentColor")
        .style("cursor", "pointer")
        .text(d => d.length > 12 ? d.substring(0, 10) + "..." : d)
        .on("mouseover", function(event, d) {
          setHighlightedMolecule(d);
          d3.select(this).attr("font-weight", "bold");
        })
        .on("mouseout", function() {
          setHighlightedMolecule(null);
          d3.select(this).attr("font-weight", "normal");
        });
    }

    // Titre
    if (title) {
      svg.append("text")
        .attr("x", (width + margin.left + margin.right) / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "600")
        .attr("fill", "currentColor")
        .text(title);
    }

  }, [allMolecules, synergyMatrix, cellSize, zoom, animate, showLabels, title, highlightedMolecule, onCellClick]);

  // Statistiques
  const stats = useMemo(() => {
    const typeCount = {
      potentialisation: 0,
      stabilisation: 0,
      transformation: 0,
      masquage: 0,
    };
    
    filteredSynergies.forEach(s => {
      typeCount[s.type]++;
    });
    
    return {
      total: filteredSynergies.length,
      molecules: allMolecules.length,
      ...typeCount,
    };
  }, [filteredSynergies, allMolecules]);

  if (allMolecules.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <Grid3X3 className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            Aucune synergie moléculaire disponible pour les filtres sélectionnés
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div ref={containerRef} className="relative space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une molécule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-48"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="potentialisation">Potentialisation</SelectItem>
              <SelectItem value="stabilisation">Stabilisation</SelectItem>
              <SelectItem value="transformation">Transformation</SelectItem>
              <SelectItem value="masquage">Masquage</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom(z => Math.min(z + 0.1, 2))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
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
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 items-center">
        <Badge variant="secondary">{stats.molecules} molécules</Badge>
        <Badge variant="secondary">{stats.total} synergies</Badge>
        <div className="flex gap-2">
          {Object.entries(TYPE_LABELS).map(([type, labels]) => (
            <Badge
              key={type}
              variant="outline"
              style={{
                backgroundColor: TYPE_COLORS[type as keyof typeof TYPE_COLORS].light,
                borderColor: TYPE_COLORS[type as keyof typeof TYPE_COLORS].main,
              }}
            >
              {labels.short}: {stats[type as keyof typeof stats]}
            </Badge>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-auto border rounded-lg bg-background p-4">
        <svg ref={svgRef} />
      </div>

      {/* Légende */}
      <div className="flex flex-wrap gap-4 justify-center pt-2">
        {Object.entries(TYPE_LABELS).map(([type, labels]) => (
          <div key={type} className="flex items-center gap-2 text-sm">
            <div 
              className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-semibold"
              style={{ backgroundColor: TYPE_COLORS[type as keyof typeof TYPE_COLORS].main }}
            >
              {labels.short}
            </div>
            <span className="text-muted-foreground">{labels.full}</span>
          </div>
        ))}
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
              left: Math.min(tooltip.x + 10, (containerRef.current?.clientWidth || 400) - 280),
              top: tooltip.y - 10,
            }}
          >
            <Card className="shadow-lg border-border/50 bg-background/95 backdrop-blur max-w-xs">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge 
                    style={{ 
                      backgroundColor: TYPE_COLORS[tooltip.synergy.type].main,
                      color: "white"
                    }}
                  >
                    {TYPE_LABELS[tooltip.synergy.type].full}
                  </Badge>
                </div>
                <div className="text-sm">
                  <span className="font-semibold">{tooltip.synergy.molecule1Name}</span>
                  <span className="text-muted-foreground"> ↔ </span>
                  <span className="font-semibold">{tooltip.synergy.molecule2Name}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {tooltip.synergy.description}
                </p>
                {tooltip.synergy.applications && (
                  <p className="text-xs text-primary">
                    Applications: {tooltip.synergy.applications}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
