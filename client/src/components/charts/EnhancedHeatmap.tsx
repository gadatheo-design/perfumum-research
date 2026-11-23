/**
 * Heatmap améliorée avec D3.js, animations et interactions avancées
 * Visualise les synergies moléculaires avec zoom interactif, clustering par famille chimique et export
 */

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, ZoomIn, ZoomOut, RotateCcw, Search, Filter, Grid3X3, Maximize2, Layers } from "lucide-react";

interface SynergyData {
  id: number;
  molecule1Name: string | null;
  molecule2Name: string | null;
  molecule1Family?: string | null;
  molecule2Family?: string | null;
  type: "potentialisation" | "stabilisation" | "transformation" | "masquage" | "neutralisation";
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

interface MoleculeInfo {
  name: string;
  family: string;
  synergyCount: number;
}

// Couleurs par type de synergie
const TYPE_COLORS = {
  potentialisation: { main: "oklch(0.65 0.20 142)", light: "oklch(0.85 0.10 142)" },
  stabilisation: { main: "oklch(0.60 0.20 250)", light: "oklch(0.85 0.10 250)" },
  transformation: { main: "oklch(0.65 0.20 300)", light: "oklch(0.85 0.10 300)" },
  masquage: { main: "oklch(0.65 0.20 30)", light: "oklch(0.85 0.10 30)" },
  neutralisation: { main: "oklch(0.55 0.05 0)", light: "oklch(0.85 0.03 0)" },
};

const TYPE_LABELS = {
  potentialisation: { short: "P", full: "Potentialisation" },
  stabilisation: { short: "S", full: "Stabilisation" },
  transformation: { short: "T", full: "Transformation" },
  masquage: { short: "M", full: "Masquage" },
  neutralisation: { short: "N", full: "Neutralisation" },
};

// Couleurs pour les familles chimiques
const FAMILY_COLORS: Record<string, string> = {
  "terpene": "oklch(0.70 0.15 140)",
  "alcohol": "oklch(0.70 0.15 200)",
  "aldehyde": "oklch(0.70 0.15 60)",
  "ketone": "oklch(0.70 0.15 280)",
  "ester": "oklch(0.70 0.15 320)",
  "ether": "oklch(0.70 0.15 180)",
  "phenol": "oklch(0.70 0.15 20)",
  "lactone": "oklch(0.70 0.15 100)",
  "oxide": "oklch(0.70 0.15 240)",
  "acid": "oklch(0.70 0.15 350)",
  "monoterpene": "oklch(0.65 0.18 130)",
  "sesquiterpene": "oklch(0.65 0.18 160)",
  "diterpene": "oklch(0.65 0.18 190)",
  "default": "oklch(0.75 0.05 0)",
};

function getFamilyColor(family: string | null | undefined): string {
  if (!family) return FAMILY_COLORS.default;
  const normalizedFamily = family.toLowerCase().replace(/[^a-z]/g, "");
  for (const [key, color] of Object.entries(FAMILY_COLORS)) {
    if (normalizedFamily.includes(key) || key.includes(normalizedFamily)) {
      return color;
    }
  }
  return FAMILY_COLORS.default;
}

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
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterFamily, setFilterFamily] = useState<string>("all");
  const [highlightedMolecule, setHighlightedMolecule] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [enableClustering, setEnableClustering] = useState(false);

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

    if (filterFamily !== "all") {
      filtered = filtered.filter(s => 
        s.molecule1Family?.toLowerCase().includes(filterFamily.toLowerCase()) ||
        s.molecule2Family?.toLowerCase().includes(filterFamily.toLowerCase())
      );
    }
    
    return filtered;
  }, [synergies, filterType, searchQuery, filterFamily]);

  // Extraire les molécules uniques avec leurs familles
  const moleculesWithInfo = useMemo(() => {
    const moleculeMap = new Map<string, MoleculeInfo>();
    
    filteredSynergies.forEach((s) => {
      if (s.molecule1Name) {
        const existing = moleculeMap.get(s.molecule1Name);
        if (existing) {
          existing.synergyCount++;
        } else {
          moleculeMap.set(s.molecule1Name, {
            name: s.molecule1Name,
            family: s.molecule1Family || "unknown",
            synergyCount: 1,
          });
        }
      }
      if (s.molecule2Name) {
        const existing = moleculeMap.get(s.molecule2Name);
        if (existing) {
          existing.synergyCount++;
        } else {
          moleculeMap.set(s.molecule2Name, {
            name: s.molecule2Name,
            family: s.molecule2Family || "unknown",
            synergyCount: 1,
          });
        }
      }
    });
    
    let molecules = Array.from(moleculeMap.values());
    
    // Tri par famille puis par nombre de synergies si clustering activé
    if (enableClustering) {
      molecules.sort((a, b) => {
        const familyCompare = a.family.localeCompare(b.family);
        if (familyCompare !== 0) return familyCompare;
        return b.synergyCount - a.synergyCount;
      });
    } else {
      molecules.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return molecules.slice(0, maxMolecules);
  }, [filteredSynergies, maxMolecules, enableClustering]);

  const allMolecules = useMemo(() => moleculesWithInfo.map(m => m.name), [moleculesWithInfo]);

  // Extraire les familles uniques pour le filtre
  const uniqueFamilies = useMemo(() => {
    const families = new Set<string>();
    synergies.forEach(s => {
      if (s.molecule1Family) families.add(s.molecule1Family);
      if (s.molecule2Family) families.add(s.molecule2Family);
    });
    return Array.from(families).sort();
  }, [synergies]);

  // Groupes de familles pour le clustering
  const familyGroups = useMemo(() => {
    if (!enableClustering) return [];
    
    const groups: { family: string; startIndex: number; endIndex: number; color: string }[] = [];
    let currentFamily = "";
    let startIndex = 0;
    
    moleculesWithInfo.forEach((mol, index) => {
      if (mol.family !== currentFamily) {
        if (currentFamily) {
          groups.push({
            family: currentFamily,
            startIndex,
            endIndex: index - 1,
            color: getFamilyColor(currentFamily),
          });
        }
        currentFamily = mol.family;
        startIndex = index;
      }
    });
    
    if (currentFamily) {
      groups.push({
        family: currentFamily,
        startIndex,
        endIndex: moleculesWithInfo.length - 1,
        color: getFamilyColor(currentFamily),
      });
    }
    
    return groups;
  }, [moleculesWithInfo, enableClustering]);

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

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 1.3);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 0.7);
    }
  }, []);

  const handleZoomReset = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  }, []);

  const handleZoomFit = useCallback(() => {
    if (svgRef.current && zoomRef.current && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 40;
      const containerHeight = Math.min(600, window.innerHeight - 300);
      const contentWidth = allMolecules.length * cellSize + 150;
      const contentHeight = allMolecules.length * cellSize + 150;
      
      const scale = Math.min(
        containerWidth / contentWidth,
        containerHeight / contentHeight,
        1
      ) * 0.9;
      
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.transform, d3.zoomIdentity.scale(scale));
    }
  }, [allMolecules.length, cellSize]);

  // Dessiner la heatmap avec zoom D3
  useEffect(() => {
    if (!svgRef.current || allMolecules.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 120, right: 20, bottom: 20, left: 140 };
    const width = allMolecules.length * cellSize;
    const height = allMolecules.length * cellSize;

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("cursor", "grab");

    // Groupe principal pour le zoom
    const mainGroup = svg.append("g")
      .attr("class", "main-group");

    const g = mainGroup.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Configuration du zoom D3
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on("zoom", (event) => {
        mainGroup.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      })
      .on("start", () => {
        svg.style("cursor", "grabbing");
      })
      .on("end", () => {
        svg.style("cursor", "grab");
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Créer les échelles
    const xScale = d3.scaleBand()
      .domain(allMolecules)
      .range([0, width])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(allMolecules)
      .range([0, height])
      .padding(0.05);

    // Dessiner les bandes de famille si clustering activé
    if (enableClustering && familyGroups.length > 0) {
      // Bandes horizontales (en haut)
      familyGroups.forEach(group => {
        const startX = xScale(allMolecules[group.startIndex]) || 0;
        const endX = (xScale(allMolecules[group.endIndex]) || 0) + xScale.bandwidth();
        
        g.append("rect")
          .attr("x", startX)
          .attr("y", -25)
          .attr("width", endX - startX)
          .attr("height", 20)
          .attr("fill", group.color)
          .attr("opacity", 0.6)
          .attr("rx", 3);

        // Label de famille
        if (endX - startX > 40) {
          g.append("text")
            .attr("x", startX + (endX - startX) / 2)
            .attr("y", -12)
            .attr("text-anchor", "middle")
            .attr("font-size", "9px")
            .attr("font-weight", "500")
            .attr("fill", "oklch(0.2 0 0)")
            .text(group.family.length > 10 ? group.family.substring(0, 8) + "..." : group.family);
        }
      });

      // Bandes verticales (à gauche)
      familyGroups.forEach(group => {
        const startY = yScale(allMolecules[group.startIndex]) || 0;
        const endY = (yScale(allMolecules[group.endIndex]) || 0) + yScale.bandwidth();
        
        g.append("rect")
          .attr("x", -25)
          .attr("y", startY)
          .attr("width", 20)
          .attr("height", endY - startY)
          .attr("fill", group.color)
          .attr("opacity", 0.6)
          .attr("rx", 3);
      });
    }

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
      .on("mouseover", function(event: MouseEvent, d: { mol1: string; mol2: string; synergy: SynergyData | null }) {
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
      .on("mouseout", function(_event: MouseEvent, d: { mol1: string; mol2: string; synergy: SynergyData | null }) {
        d3.select(this)
          .attr("stroke", highlightedMolecule && (d.mol1 === highlightedMolecule || d.mol2 === highlightedMolecule) 
            ? "oklch(0.3 0 0)" 
            : "oklch(0.9 0 0)")
          .attr("stroke-width", highlightedMolecule && (d.mol1 === highlightedMolecule || d.mol2 === highlightedMolecule) 
            ? 2 
            : 0.5);
        setTooltip(null);
      })
      .on("click", function(_event: MouseEvent, d: { mol1: string; mol2: string; synergy: SynergyData | null }) {
        if (d.synergy && onCellClick) {
          onCellClick(d.synergy);
        }
      });

    // Animer les cellules
    if (animate) {
      cells.transition()
        .duration(500)
        .delay((_d, i) => i * 2)
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
        .attr("y", enableClustering ? -30 : -8)
        .attr("text-anchor", "start")
        .attr("transform", d => `rotate(-45, ${(xScale(d) || 0) + xScale.bandwidth() / 2}, ${enableClustering ? -30 : -8})`)
        .attr("font-size", "10px")
        .attr("fill", "currentColor")
        .style("cursor", "pointer")
        .text(d => d.length > 12 ? d.substring(0, 10) + "..." : d)
        .on("mouseover", function(_event, d) {
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
        .attr("x", enableClustering ? -30 : -8)
        .attr("y", d => (yScale(d) || 0) + yScale.bandwidth() / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "10px")
        .attr("fill", "currentColor")
        .style("cursor", "pointer")
        .text(d => d.length > 12 ? d.substring(0, 10) + "..." : d)
        .on("mouseover", function(_event, d) {
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

  }, [allMolecules, synergyMatrix, cellSize, animate, showLabels, title, highlightedMolecule, onCellClick, enableClustering, familyGroups]);

  // Statistiques
  const stats = useMemo(() => {
    const typeCount = {
      potentialisation: 0,
      stabilisation: 0,
      transformation: 0,
      masquage: 0,
      neutralisation: 0,
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
        <div className="flex flex-wrap gap-2 items-center">
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
              <SelectItem value="neutralisation">Neutralisation</SelectItem>
            </SelectContent>
          </Select>
          {uniqueFamilies.length > 0 && (
            <Select value={filterFamily} onValueChange={setFilterFamily}>
              <SelectTrigger className="w-40">
                <Layers className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Famille" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les familles</SelectItem>
                {uniqueFamilies.map(family => (
                  <SelectItem key={family} value={family}>{family}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div className="flex gap-2 items-center">
          {/* Clustering toggle */}
          <div className="flex items-center gap-2 mr-2">
            <Switch
              id="clustering"
              checked={enableClustering}
              onCheckedChange={setEnableClustering}
            />
            <Label htmlFor="clustering" className="text-sm cursor-pointer">
              Clustering
            </Label>
          </div>
          
          {/* Zoom indicator */}
          <Badge variant="outline" className="font-mono text-xs">
            {Math.round(zoomLevel * 100)}%
          </Badge>
          
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleZoomIn}
              title="Zoom avant"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleZoomOut}
              title="Zoom arrière"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleZoomReset}
              title="Réinitialiser le zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleZoomFit}
              title="Ajuster à la vue"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={exportAsPNG}
              disabled={isExporting}
              title="Exporter en PNG"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
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

      {/* Clustering legend */}
      {enableClustering && familyGroups.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center p-2 bg-muted/30 rounded-lg">
          <span className="text-xs font-medium text-muted-foreground mr-2">Familles chimiques:</span>
          {familyGroups.map(group => (
            <Badge
              key={group.family}
              variant="outline"
              className="text-xs"
              style={{
                backgroundColor: group.color,
                borderColor: group.color,
                color: "oklch(0.2 0 0)",
              }}
            >
              {group.family} ({group.endIndex - group.startIndex + 1})
            </Badge>
          ))}
        </div>
      )}

      {/* Heatmap */}
      <div className="overflow-hidden border rounded-lg bg-background p-4">
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

      {/* Instructions */}
      <p className="text-xs text-center text-muted-foreground">
        Utilisez la molette pour zoomer, glissez pour naviguer. Cliquez sur une cellule pour voir les détails.
      </p>

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
                  {tooltip.synergy.molecule1Family && (
                    <span className="text-xs text-muted-foreground ml-1">({tooltip.synergy.molecule1Family})</span>
                  )}
                  <span className="text-muted-foreground"> ↔ </span>
                  <span className="font-semibold">{tooltip.synergy.molecule2Name}</span>
                  {tooltip.synergy.molecule2Family && (
                    <span className="text-xs text-muted-foreground ml-1">({tooltip.synergy.molecule2Family})</span>
                  )}
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
