/**
 * BiosyntheticPathwayFlow - Visualisation D3.js du chemin biosynthétique
 * Affiche le parcours: Gène TPS → Molécule → Recette
 */

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Dna, FlaskConical, BookOpen, ArrowRight } from "lucide-react";

interface PathwayGene {
  id: number;
  name: string;
  subfamily: string;
  main_product: string;
  olfactory: string;
  pathway: string;
  product_class: string;
}

interface PathwayMolecule {
  id: number;
  name: string;
  relationship: string;
  confidence: string;
  recipes: Array<{ id: number; name: string; category: string }>;
}

interface PathwayData {
  gene: PathwayGene;
  molecules: PathwayMolecule[];
}

interface BiosyntheticPathwayFlowProps {
  data: PathwayData[];
  stats?: {
    total_genes: number;
    linked_genes: number;
    linked_molecules: number;
    linked_recipes: number;
  } | null;
  isLoading?: boolean;
  onPathwayChange?: (pathway: "MEP" | "MVA" | "all") => void;
  selectedPathway?: "MEP" | "MVA" | "all";
}

interface FlowNode {
  id: string;
  type: "gene" | "molecule" | "recipe";
  name: string;
  data: any;
  x?: number;
  y?: number;
}

interface FlowLink {
  source: string;
  target: string;
  type: string;
}

export function BiosyntheticPathwayFlow({
  data,
  stats,
  isLoading = false,
  onPathwayChange,
  selectedPathway = "all",
}: BiosyntheticPathwayFlowProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: Math.max(width, 600), height: 600 });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // D3 visualization
  useEffect(() => {
    if (!svgRef.current || !data.length || isLoading) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create nodes and links from data
    const nodes: FlowNode[] = [];
    const links: FlowLink[] = [];
    const nodeMap = new Map<string, FlowNode>();

    // Process data to create flow graph
    data.slice(0, 20).forEach((pathway) => {
      const geneId = `gene-${pathway.gene.id}`;
      if (!nodeMap.has(geneId)) {
        const geneNode: FlowNode = {
          id: geneId,
          type: "gene",
          name: pathway.gene.main_product || pathway.gene.name.split(" ")[0],
          data: pathway.gene,
        };
        nodes.push(geneNode);
        nodeMap.set(geneId, geneNode);
      }

      pathway.molecules.slice(0, 3).forEach((molecule) => {
        const molId = `mol-${molecule.id}`;
        if (!nodeMap.has(molId)) {
          const molNode: FlowNode = {
            id: molId,
            type: "molecule",
            name: molecule.name,
            data: molecule,
          };
          nodes.push(molNode);
          nodeMap.set(molId, molNode);
        }
        links.push({ source: geneId, target: molId, type: molecule.relationship });

        molecule.recipes.slice(0, 2).forEach((recipe) => {
          const recipeId = `recipe-${recipe.id}`;
          if (!nodeMap.has(recipeId)) {
            const recipeNode: FlowNode = {
              id: recipeId,
              type: "recipe",
              name: recipe.name,
              data: recipe,
            };
            nodes.push(recipeNode);
            nodeMap.set(recipeId, recipeNode);
          }
          links.push({ source: molId, target: recipeId, type: "used_in" });
        });
      });
    });

    if (nodes.length === 0) return;

    // Create main group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Color scales
    const nodeColors: Record<string, string> = {
      gene: "#10b981", // emerald
      molecule: "#8b5cf6", // violet
      recipe: "#f59e0b", // amber
    };

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force("collision", d3.forceCollide().radius(40))
      .force("x", d3.forceX().x((d: any) => {
        if (d.type === "gene") return innerWidth * 0.15;
        if (d.type === "molecule") return innerWidth * 0.5;
        return innerWidth * 0.85;
      }).strength(0.3))
      .force("y", d3.forceY(innerHeight / 2).strength(0.1));

    // Add arrow markers
    svg
      .append("defs")
      .selectAll("marker")
      .data(["gene", "molecule", "recipe"])
      .join("marker")
      .attr("id", (d) => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#94a3b8")
      .attr("d", "M0,-5L10,0L0,5");

    // Create links
    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow-gene)");

    // Create node groups
    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .call(
        d3.drag<SVGGElement, FlowNode>()
          .on("start", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as any
      );

    // Add circles
    node
      .append("circle")
      .attr("r", (d) => (d.type === "gene" ? 25 : d.type === "molecule" ? 20 : 15))
      .attr("fill", (d) => nodeColors[d.type])
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("click", (_, d) => setSelectedNode(d));

    // Add icons
    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#fff")
      .attr("font-size", (d) => (d.type === "gene" ? "14px" : "12px"))
      .text((d) => {
        if (d.type === "gene") return "🧬";
        if (d.type === "molecule") return "⚗️";
        return "📖";
      });

    // Add labels
    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => (d.type === "gene" ? 40 : d.type === "molecule" ? 35 : 30))
      .attr("fill", "#e2e8f0")
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .text((d) => d.name.length > 15 ? d.name.slice(0, 15) + "..." : d.name);

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Add zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Add column labels
    const labels = [
      { x: innerWidth * 0.15, text: "Gènes TPS", icon: "🧬" },
      { x: innerWidth * 0.5, text: "Molécules", icon: "⚗️" },
      { x: innerWidth * 0.85, text: "Recettes", icon: "📖" },
    ];

    g.append("g")
      .selectAll("text")
      .data(labels)
      .join("text")
      .attr("x", (d) => d.x)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .text((d) => `${d.icon} ${d.text}`);

    return () => {
      simulation.stop();
    };
  }, [data, dimensions, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <span className="ml-2 text-slate-400">Chargement des chemins biosynthétiques...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with stats and filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select
            value={selectedPathway}
            onValueChange={(v) => onPathwayChange?.(v as "MEP" | "MVA" | "all")}
          >
            <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
              <SelectValue placeholder="Voie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les voies</SelectItem>
              <SelectItem value="MEP">Voie MEP</SelectItem>
              <SelectItem value="MVA">Voie MVA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {stats && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              <Dna className="h-3 w-3 mr-1" />
              {stats.linked_genes} gènes
            </Badge>
            <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/30">
              <FlaskConical className="h-3 w-3 mr-1" />
              {stats.linked_molecules} molécules
            </Badge>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
              <BookOpen className="h-3 w-3 mr-1" />
              {stats.linked_recipes} recettes
            </Badge>
          </div>
        )}
      </div>

      {/* Flow legend */}
      <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-emerald-500" />
          <span>Gène TPS</span>
        </div>
        <ArrowRight className="h-4 w-4" />
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-violet-500" />
          <span>Molécule</span>
        </div>
        <ArrowRight className="h-4 w-4" />
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-amber-500" />
          <span>Recette</span>
        </div>
      </div>

      {/* Visualization container */}
      <div
        ref={containerRef}
        className="relative bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden"
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full"
        />

        {/* Selected node info */}
        {selectedNode && (
          <Card className="absolute bottom-4 left-4 w-72 bg-slate-800/95 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                {selectedNode.type === "gene" && <Dna className="h-4 w-4 text-emerald-400" />}
                {selectedNode.type === "molecule" && <FlaskConical className="h-4 w-4 text-violet-400" />}
                {selectedNode.type === "recipe" && <BookOpen className="h-4 w-4 text-amber-400" />}
                {selectedNode.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-400 space-y-1">
              {selectedNode.type === "gene" && (
                <>
                  <p><strong>Sous-famille:</strong> {selectedNode.data.subfamily}</p>
                  <p><strong>Voie:</strong> {selectedNode.data.pathway}</p>
                  <p><strong>Classe:</strong> {selectedNode.data.product_class}</p>
                  <p><strong>Notes:</strong> {selectedNode.data.olfactory}</p>
                </>
              )}
              {selectedNode.type === "molecule" && (
                <>
                  <p><strong>Relation:</strong> {selectedNode.data.relationship}</p>
                  <p><strong>Confiance:</strong> {selectedNode.data.confidence}</p>
                  <p><strong>Recettes:</strong> {selectedNode.data.recipes?.length || 0}</p>
                </>
              )}
              {selectedNode.type === "recipe" && (
                <>
                  <p><strong>Catégorie:</strong> {selectedNode.data.category}</p>
                </>
              )}
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-500 hover:text-slate-300 mt-2"
              >
                Fermer
              </button>
            </CardContent>
          </Card>
        )}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p>Aucun chemin biosynthétique trouvé.</p>
          <p className="text-sm">Créez des liaisons entre gènes TPS et molécules pour voir les chemins.</p>
        </div>
      )}
    </div>
  );
}

export default BiosyntheticPathwayFlow;
