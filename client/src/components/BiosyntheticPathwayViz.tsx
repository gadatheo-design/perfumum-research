import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Info } from "lucide-react";

interface PathwayNode {
  id: string;
  name: string;
  type: "precursor" | "intermediate" | "product" | "enzyme" | "gene";
  pathway: "MEP" | "MVA" | "shared";
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  description?: string;
  olfactoryNotes?: string;
}

interface PathwayLink {
  source: string | PathwayNode;
  target: string | PathwayNode;
  type: "conversion" | "catalysis";
}

interface TooltipData {
  node: PathwayNode;
  x: number;
  y: number;
}

// Données des voies biosynthétiques MEP et MVA
const pathwayData: { nodes: PathwayNode[]; links: PathwayLink[] } = {
  nodes: [
    // Précurseurs communs
    { id: "pyruvate", name: "Pyruvate", type: "precursor", pathway: "MEP", description: "Précurseur glycolytique" },
    { id: "g3p", name: "G3P", type: "precursor", pathway: "MEP", description: "Glycéraldéhyde-3-phosphate" },
    { id: "acetylcoa", name: "Acétyl-CoA", type: "precursor", pathway: "MVA", description: "Précurseur central du métabolisme" },
    
    // Voie MEP (Plastes)
    { id: "dxp", name: "DXP", type: "intermediate", pathway: "MEP", description: "1-désoxy-D-xylulose-5-phosphate" },
    { id: "mep", name: "MEP", type: "intermediate", pathway: "MEP", description: "2-C-méthyl-D-érythritol-4-phosphate" },
    { id: "hmbpp", name: "HMBPP", type: "intermediate", pathway: "MEP", description: "4-hydroxy-3-méthylbut-2-ényl diphosphate" },
    
    // Voie MVA (Cytosol)
    { id: "hmgcoa", name: "HMG-CoA", type: "intermediate", pathway: "MVA", description: "3-hydroxy-3-méthylglutaryl-CoA" },
    { id: "mevalonate", name: "Mévalonate", type: "intermediate", pathway: "MVA", description: "Acide mévalonique" },
    { id: "mvapp", name: "MVAPP", type: "intermediate", pathway: "MVA", description: "Mévalonate-5-pyrophosphate" },
    
    // Produits communs (précurseurs des terpènes)
    { id: "ipp", name: "IPP", type: "product", pathway: "shared", description: "Isopentényl diphosphate (C5)" },
    { id: "dmapp", name: "DMAPP", type: "product", pathway: "shared", description: "Diméthylallyl diphosphate (C5)" },
    { id: "gpp", name: "GPP", type: "product", pathway: "MEP", description: "Géranyl diphosphate (C10)", olfactoryNotes: "Précurseur des monoterpènes" },
    { id: "fpp", name: "FPP", type: "product", pathway: "MVA", description: "Farnésyl diphosphate (C15)", olfactoryNotes: "Précurseur des sesquiterpènes" },
    { id: "ggpp", name: "GGPP", type: "product", pathway: "MEP", description: "Géranylgéranyl diphosphate (C20)", olfactoryNotes: "Précurseur des diterpènes" },
    
    // Classes de terpènes (produits finaux)
    { id: "monoterpenes", name: "Monoterpènes", type: "product", pathway: "MEP", description: "C10 - Linalol, Limonène, α-Pinène...", olfactoryNotes: "Floraux, citrus, frais, pin" },
    { id: "sesquiterpenes", name: "Sesquiterpènes", type: "product", pathway: "MVA", description: "C15 - β-Caryophyllène, Germacrène D...", olfactoryNotes: "Boisés, épicés, terreux" },
    { id: "diterpenes", name: "Diterpènes", type: "product", pathway: "MEP", description: "C20 - Cis-abienol, Sclareol...", olfactoryNotes: "Ambrés, balsamiques, tabac" },
    
    // Enzymes clés
    { id: "dxs", name: "DXS", type: "enzyme", pathway: "MEP", description: "DXP synthase - Enzyme limitante de la voie MEP" },
    { id: "dxr", name: "DXR", type: "enzyme", pathway: "MEP", description: "DXP réductoisomérase" },
    { id: "hdr", name: "HDR", type: "enzyme", pathway: "MEP", description: "HMBPP réductase" },
    { id: "hmgr", name: "HMGR", type: "enzyme", pathway: "MVA", description: "HMG-CoA réductase - Enzyme limitante de la voie MVA" },
    { id: "mvk", name: "MVK", type: "enzyme", pathway: "MVA", description: "Mévalonate kinase" },
    { id: "idi", name: "IDI", type: "enzyme", pathway: "shared", description: "IPP isomérase - Interconversion IPP/DMAPP" },
    { id: "gpps", name: "GPPS", type: "enzyme", pathway: "MEP", description: "GPP synthase" },
    { id: "fpps", name: "FPPS", type: "enzyme", pathway: "MVA", description: "FPP synthase" },
    { id: "ggpps", name: "GGPPS", type: "enzyme", pathway: "MEP", description: "GGPP synthase" },
    
    // Gènes TPS représentatifs
    { id: "tps_mono", name: "TPS-b", type: "gene", pathway: "MEP", description: "Sous-famille TPS-b: 29 gènes monoterpène synthases" },
    { id: "tps_sesqui", name: "TPS-a", type: "gene", pathway: "MVA", description: "Sous-famille TPS-a: 95 gènes sesquiterpène synthases" },
    { id: "tps_di", name: "TPS-c/e/f", type: "gene", pathway: "MEP", description: "Sous-familles TPS-c et TPS-e/f: 23 gènes diterpène synthases" },
  ],
  links: [
    // Voie MEP
    { source: "pyruvate", target: "dxp", type: "conversion" },
    { source: "g3p", target: "dxp", type: "conversion" },
    { source: "dxs", target: "dxp", type: "catalysis" },
    { source: "dxp", target: "mep", type: "conversion" },
    { source: "dxr", target: "mep", type: "catalysis" },
    { source: "mep", target: "hmbpp", type: "conversion" },
    { source: "hmbpp", target: "ipp", type: "conversion" },
    { source: "hmbpp", target: "dmapp", type: "conversion" },
    { source: "hdr", target: "ipp", type: "catalysis" },
    
    // Voie MVA
    { source: "acetylcoa", target: "hmgcoa", type: "conversion" },
    { source: "hmgcoa", target: "mevalonate", type: "conversion" },
    { source: "hmgr", target: "mevalonate", type: "catalysis" },
    { source: "mevalonate", target: "mvapp", type: "conversion" },
    { source: "mvk", target: "mvapp", type: "catalysis" },
    { source: "mvapp", target: "ipp", type: "conversion" },
    { source: "mvapp", target: "dmapp", type: "conversion" },
    
    // Interconversion IPP/DMAPP
    { source: "ipp", target: "dmapp", type: "conversion" },
    { source: "idi", target: "dmapp", type: "catalysis" },
    
    // Synthèse des prényl diphosphates
    { source: "dmapp", target: "gpp", type: "conversion" },
    { source: "ipp", target: "gpp", type: "conversion" },
    { source: "gpps", target: "gpp", type: "catalysis" },
    { source: "gpp", target: "fpp", type: "conversion" },
    { source: "ipp", target: "fpp", type: "conversion" },
    { source: "fpps", target: "fpp", type: "catalysis" },
    { source: "gpp", target: "ggpp", type: "conversion" },
    { source: "ipp", target: "ggpp", type: "conversion" },
    { source: "ggpps", target: "ggpp", type: "catalysis" },
    
    // Synthèse des terpènes
    { source: "gpp", target: "monoterpenes", type: "conversion" },
    { source: "tps_mono", target: "monoterpenes", type: "catalysis" },
    { source: "fpp", target: "sesquiterpenes", type: "conversion" },
    { source: "tps_sesqui", target: "sesquiterpenes", type: "catalysis" },
    { source: "ggpp", target: "diterpenes", type: "conversion" },
    { source: "tps_di", target: "diterpenes", type: "catalysis" },
  ],
};

const nodeColors: Record<string, Record<string, string>> = {
  precursor: { MEP: "#3b82f6", MVA: "#f97316", shared: "#8b5cf6" },
  intermediate: { MEP: "#60a5fa", MVA: "#fb923c", shared: "#a78bfa" },
  product: { MEP: "#22c55e", MVA: "#eab308", shared: "#14b8a6" },
  enzyme: { MEP: "#06b6d4", MVA: "#f59e0b", shared: "#6366f1" },
  gene: { MEP: "#10b981", MVA: "#f59e0b", shared: "#8b5cf6" },
};

export default function BiosyntheticPathwayViz() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedPathway, setSelectedPathway] = useState<"all" | "MEP" | "MVA">("all");
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>();

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: Math.max(600, width - 32), height: Math.max(500, Math.min(700, width * 0.75)) });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Filtrer les données selon la voie sélectionnée
    const filteredNodes = pathwayData.nodes.filter(
      (n) => selectedPathway === "all" || n.pathway === selectedPathway || n.pathway === "shared"
    );
    const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredLinks = pathwayData.links.filter(
      (l) =>
        filteredNodeIds.has(typeof l.source === "string" ? l.source : l.source.id) &&
        filteredNodeIds.has(typeof l.target === "string" ? l.target : l.target.id)
    );

    // Créer le groupe principal avec zoom
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Définir les marqueurs de flèches
    const defs = svg.append("defs");
    
    ["MEP", "MVA", "shared", "catalysis"].forEach((type) => {
      const color = type === "catalysis" ? "#9ca3af" : 
                    type === "MEP" ? "#3b82f6" : 
                    type === "MVA" ? "#f97316" : "#8b5cf6";
      defs
        .append("marker")
        .attr("id", `arrow-${type}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", color)
        .attr("d", "M0,-5L10,0L0,5");
    });

    // Créer la simulation de force
    const simulation = d3
      .forceSimulation<PathwayNode>(filteredNodes as PathwayNode[])
      .force(
        "link",
        d3
          .forceLink<PathwayNode, PathwayLink>(filteredLinks as PathwayLink[])
          .id((d) => d.id)
          .distance(80)
          .strength(0.5)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force("collision", d3.forceCollide().radius(40))
      .force("x", d3.forceX(innerWidth / 2).strength(0.05))
      .force("y", d3.forceY(innerHeight / 2).strength(0.05));

    // Dessiner les liens avec animation d'entrée
    const link = g
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(filteredLinks)
      .join("line")
      .attr("stroke", (d) => {
        if (d.type === "catalysis") return "#9ca3af";
        const sourceNode = filteredNodes.find((n) => n.id === (typeof d.source === "string" ? d.source : d.source.id));
        return sourceNode ? nodeColors.intermediate[sourceNode.pathway] : "#6b7280";
      })
      .attr("stroke-width", (d) => (d.type === "catalysis" ? 1 : 2))
      .attr("stroke-dasharray", (d) => (d.type === "catalysis" ? "4,4" : "none"))
      .attr("marker-end", (d) => {
        if (d.type === "catalysis") return "url(#arrow-catalysis)";
        const sourceNode = filteredNodes.find((n) => n.id === (typeof d.source === "string" ? d.source : d.source.id));
        return sourceNode ? `url(#arrow-${sourceNode.pathway})` : "url(#arrow-shared)";
      })
      .attr("opacity", 0)
      .transition()
      .duration(800)
      .delay((_, i) => i * 20)
      .attr("opacity", 0.7);

    // Animation de pulsation pour les liens actifs
    g.selectAll(".links line")
      .filter((d: any) => d.type === "conversion")
      .style("animation", "pulse-link 2s ease-in-out infinite");

    // Dessiner les nœuds
    const node = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(filteredNodes)
      .join("g")
      .attr("cursor", "pointer")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .call(
        d3
          .drag<SVGGElement, PathwayNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as any
      );

    // Formes des nœuds selon le type
    node.each(function (d) {
      const el = d3.select(this);
      const color = nodeColors[d.type]?.[d.pathway] || "#6b7280";
      
      if (d.type === "enzyme" || d.type === "gene") {
        // Losange pour enzymes et gènes
        el.append("rect")
          .attr("width", 24)
          .attr("height", 24)
          .attr("x", -12)
          .attr("y", -12)
          .attr("transform", "rotate(45)")
          .attr("fill", color)
          .attr("stroke", "#1f2937")
          .attr("stroke-width", 2)
          .attr("rx", 2);
      } else if (d.type === "product") {
        // Hexagone pour produits
        const hexagonPoints = d3.range(6).map((i) => {
          const angle = (i * Math.PI) / 3 - Math.PI / 6;
          return [Math.cos(angle) * 16, Math.sin(angle) * 16];
        });
        el.append("polygon")
          .attr("points", hexagonPoints.map((p) => p.join(",")).join(" "))
          .attr("fill", color)
          .attr("stroke", "#1f2937")
          .attr("stroke-width", 2);
      } else {
        // Cercle pour précurseurs et intermédiaires
        el.append("circle")
          .attr("r", d.type === "precursor" ? 14 : 12)
          .attr("fill", color)
          .attr("stroke", "#1f2937")
          .attr("stroke-width", 2);
      }
    });

    // Labels des nœuds avec animation
    node
      .append("text")
      .attr("dy", (d) => (d.type === "product" ? 28 : 24))
      .attr("text-anchor", "middle")
      .attr("fill", "#e5e7eb")
      .attr("font-size", "10px")
      .attr("font-weight", "500")
      .attr("opacity", 0)
      .text((d) => d.name)
      .transition()
      .duration(600)
      .delay((_, i) => 400 + i * 30)
      .attr("opacity", 1);

    // Animation d'entrée pour les nœuds
    node.selectAll("circle, rect, polygon")
      .attr("transform", "scale(0)")
      .transition()
      .duration(500)
      .delay((_, i) => i * 25)
      .attr("transform", (d: any) => d.type === "enzyme" || d.type === "gene" ? "rotate(45) scale(1)" : "scale(1)")
      .ease(d3.easeElasticOut.amplitude(1).period(0.5));

    // Gestion des événements de survol avec animations améliorées
    node
      .on("mouseenter", function (event, d) {
        const [x, y] = d3.pointer(event, svgRef.current);
        setTooltip({ node: d, x: x + margin.left, y: y + margin.top });
        
        // Animation de mise en évidence du nœud
        d3.select(this).select("circle, rect, polygon")
          .transition()
          .duration(200)
          .attr("stroke", "#f59e0b")
          .attr("stroke-width", 4)
          .style("filter", "drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))");
        
        // Mise en évidence des liens connectés
        g.selectAll(".links line")
          .transition()
          .duration(200)
          .attr("opacity", (l: any) => {
            const sourceId = typeof l.source === "string" ? l.source : l.source.id;
            const targetId = typeof l.target === "string" ? l.target : l.target.id;
            return sourceId === d.id || targetId === d.id ? 1 : 0.2;
          })
          .attr("stroke-width", (l: any) => {
            const sourceId = typeof l.source === "string" ? l.source : l.source.id;
            const targetId = typeof l.target === "string" ? l.target : l.target.id;
            return sourceId === d.id || targetId === d.id ? 3 : (l.type === "catalysis" ? 1 : 2);
          });
        
        // Atténuer les autres nœuds
        g.selectAll(".nodes g")
          .filter((n: any) => n.id !== d.id)
          .transition()
          .duration(200)
          .attr("opacity", 0.4);
      })
      .on("mouseleave", function () {
        setTooltip(null);
        
        // Réinitialiser le nœud
        d3.select(this).select("circle, rect, polygon")
          .transition()
          .duration(200)
          .attr("stroke", "#1f2937")
          .attr("stroke-width", 2)
          .style("filter", "none");
        
        // Réinitialiser les liens
        g.selectAll(".links line")
          .transition()
          .duration(200)
          .attr("opacity", 0.7)
          .attr("stroke-width", (l: any) => l.type === "catalysis" ? 1 : 2);
        
        // Réinitialiser tous les nœuds
        g.selectAll(".nodes g")
          .transition()
          .duration(200)
          .attr("opacity", 1);
      });

    // Mise à jour de la simulation
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as PathwayNode).x || 0)
        .attr("y1", (d) => (d.source as PathwayNode).y || 0)
        .attr("x2", (d) => (d.target as PathwayNode).x || 0)
        .attr("y2", (d) => (d.target as PathwayNode).y || 0);

      node.attr("transform", (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    return () => {
      simulation.stop();
    };
  }, [dimensions, selectedPathway]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 0.7);
    }
  };

  const handleReset = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Voies Biosynthétiques des Terpènes
            </CardTitle>
            <CardDescription>
              Visualisation interactive des voies MEP (plastes) et MVA (cytosol)
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={selectedPathway === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPathway("all")}
              className="text-xs"
            >
              Toutes
            </Button>
            <Button
              variant={selectedPathway === "MEP" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPathway("MEP")}
              className="text-xs bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30"
            >
              MEP (Plastes)
            </Button>
            <Button
              variant={selectedPathway === "MVA" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPathway("MVA")}
              className="text-xs bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/30"
            >
              MVA (Cytosol)
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="relative">
          {/* Contrôles de zoom */}
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
            <Button variant="outline" size="icon" onClick={handleZoomIn} className="h-8 w-8 bg-card/80">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut} className="h-8 w-8 bg-card/80">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset} className="h-8 w-8 bg-card/80">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* SVG de visualisation */}
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="bg-slate-900/50 rounded-lg border border-border/30"
          />

          {/* Tooltip */}
          {tooltip && (
            <div
              className="absolute z-20 bg-slate-800/95 border border-border/50 rounded-lg p-3 shadow-xl max-w-xs pointer-events-none"
              style={{
                left: Math.min(tooltip.x + 10, dimensions.width - 200),
                top: Math.min(tooltip.y + 10, dimensions.height - 100),
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={
                    tooltip.node.pathway === "MEP"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : tooltip.node.pathway === "MVA"
                      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                  }
                >
                  {tooltip.node.pathway}
                </Badge>
                <Badge variant="outline" className="bg-slate-500/20 text-slate-300 border-slate-500/30">
                  {tooltip.node.type}
                </Badge>
              </div>
              <div className="font-semibold text-foreground">{tooltip.node.name}</div>
              {tooltip.node.description && (
                <div className="text-sm text-muted-foreground mt-1">{tooltip.node.description}</div>
              )}
              {tooltip.node.olfactoryNotes && (
                <div className="text-sm text-emerald-400 mt-1 italic">{tooltip.node.olfactoryNotes}</div>
              )}
            </div>
          )}
        </div>

        {/* Légende */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Voie MEP (Plastes)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span>Voie MVA (Cytosol)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span>Partagé</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#6b7280" /></svg>
            <span>Précurseur/Intermédiaire</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="12" height="12"><polygon points="6,0 12,6 6,12 0,6" fill="#22c55e" /></svg>
            <span>Produit</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="12" height="12"><rect x="1" y="1" width="10" height="10" fill="#06b6d4" transform="rotate(45 6 6)" /></svg>
            <span>Enzyme/Gène</span>
          </div>
        </div>

        {/* Info box */}
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-border/30">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground">
              <strong className="text-foreground">Interaction :</strong> Glissez les nœuds pour réorganiser le graphe. 
              Utilisez la molette ou les boutons pour zoomer. Survolez un nœud pour voir ses détails.
              Les lignes continues représentent les conversions métaboliques, les lignes pointillées les catalyses enzymatiques.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
