/**
 * TaxonomyTree.tsx — Rapport 9
 * Arbre taxonomique visuel D3.js (tree layout horizontal)
 * Famille → Genre → Espèce cible + Espèces sœurs
 * Navigation vers les fiches plantes en un clic
 */

import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import * as d3 from "d3";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, GitBranch, ExternalLink, RefreshCw, Eye, EyeOff } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeType = "family" | "genus" | "target" | "sibling" | "other";

interface TaxonNode {
  id: string;
  name: string;
  type: NodeType;
  level: number;
  perfumumId: number | null;
  wikidataQid: string | null;
  latinName: string | null;
  children: TaxonNode[];
}

interface WikidataAncestor {
  qid: string;
  label: string;
  rank: string;
  rankLabel: string;
  parentQid?: string;
}

// ─── Couleurs par type de nœud ────────────────────────────────────────────────

const NODE_COLORS: Record<NodeType, string> = {
  family:  "#6366f1", // indigo — famille
  genus:   "#0ea5e9", // bleu ciel — genre
  target:  "#f59e0b", // ambre — espèce cible (la plante courante)
  sibling: "#10b981", // vert — espèces sœurs du même genre
  other:   "#94a3b8", // gris ardoise — autres espèces de la famille
};

const NODE_RADIUS: Record<NodeType, number> = {
  family:  14,
  genus:   11,
  target:  16,
  sibling: 9,
  other:   7,
};

// ─── Composant principal ──────────────────────────────────────────────────────

interface TaxonomyTreeProps {
  plantId: number;
  plantName: string;
}

export function TaxonomyTree({ plantId, plantName }: TaxonomyTreeProps) {
  const [, navigate] = useLocation();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [useWikidata, setUseWikidata] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<TaxonNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const { data, isLoading, error, refetch } = trpc.plants.getTaxonomyTree.useQuery(
    { plantId, useWikidata },
    { staleTime: 5 * 60 * 1000 }
  );

  // ─── Rendu D3 ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!data?.tree || !svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = Math.max(500, container.clientHeight || 500);

    // Nettoyer le SVG précédent
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Groupe principal avec zoom/pan
    const g = svg.append("g").attr("transform", "translate(60, 0)");

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
      });
    svg.call(zoom);

    // Construire la hiérarchie D3
    const root = d3.hierarchy<TaxonNode>(data.tree as TaxonNode);

    // Garde : si l'arbre n'a qu'un seul nœud (pas d'enfants), ne pas tenter le rendu D3
    if (root.descendants().length <= 1) return;

    // Layout arbre horizontal (gauche → droite)
    const treeLayout = d3.tree<TaxonNode>()
      .size([height - 80, width - 200])
      .separation((a, b) => (a.parent === b.parent ? 1.2 : 2));

    treeLayout(root);

    // ─── Liens ─────────────────────────────────────────────────────────────
    // Cast via unknown pour contourner l'incompatibilité de typage D3 HierarchyLink vs HierarchyPointLink
    const linkGenerator = d3.linkHorizontal<unknown, { x: number; y: number }>()
      .x((d) => (d as { x: number; y: number }).y)
      .y((d) => (d as { x: number; y: number }).x);

    g.selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("d", (d) => linkGenerator(d as unknown as { source: { x: number; y: number }; target: { x: number; y: number } }))
      .attr("fill", "none")
      .attr("stroke", (d) => {
        const targetType = d.target.data.type;
        if (targetType === "target") return "#f59e0b";
        if (targetType === "sibling") return "#10b981";
        if (targetType === "genus") return "#0ea5e9";
        if (targetType === "family") return "#6366f1";
        return "#cbd5e1";
      })
      .attr("stroke-width", (d) => {
        const targetType = d.target.data.type;
        return targetType === "target" ? 2.5 : targetType === "genus" ? 2 : 1.5;
      })
      .attr("stroke-opacity", (d) => {
        return d.target.data.type === "other" ? 0.4 : 0.7;
      })
      .attr("stroke-dasharray", (d) => {
        return d.target.data.type === "other" ? "4,3" : "none";
      });

    // ─── Nœuds ─────────────────────────────────────────────────────────────
    const nodes = g.selectAll(".node")
      .data(root.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`)
      .style("cursor", (d) => d.data.perfumumId ? "pointer" : "default");

    // Cercle de fond (halo pour la cible)
    nodes.filter((d) => d.data.type === "target")
      .append("circle")
      .attr("r", 22)
      .attr("fill", "#f59e0b")
      .attr("fill-opacity", 0.15)
      .attr("stroke", "#f59e0b")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.4);

    // Cercle principal
    nodes.append("circle")
      .attr("r", (d) => NODE_RADIUS[d.data.type])
      .attr("fill", (d) => NODE_COLORS[d.data.type])
      .attr("fill-opacity", (d) => d.data.type === "other" ? 0.5 : 0.9)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Label du nœud
    nodes.append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => d.children ? -18 : 18)
      .attr("text-anchor", (d) => d.children ? "end" : "start")
      .attr("font-size", (d) => {
        if (d.data.type === "target") return "13px";
        if (d.data.type === "family" || d.data.type === "genus") return "12px";
        return "10px";
      })
      .attr("font-weight", (d) => (d.data.type === "target" || d.data.type === "family") ? "700" : "400")
      .attr("fill", (d) => d.data.type === "target" ? "#f59e0b" : d.data.type === "other" ? "#94a3b8" : "#e2e8f0")
      .attr("font-style", (d) => (d.data.type === "sibling" || d.data.type === "target") ? "italic" : "normal")
      .text((d) => {
        const name = d.data.latinName || d.data.name;
        return name.length > 28 ? name.slice(0, 26) + "…" : name;
      });

    // Interactions hover + clic
    nodes
      .on("mouseover", function (event, d) {
        d3.select(this).select("circle:last-of-type")
          .attr("stroke", "#f59e0b")
          .attr("stroke-width", 3);
        setHoveredNode(d.data);
        const rect = (svgRef.current as SVGSVGElement).getBoundingClientRect();
        setTooltipPos({ x: event.clientX - rect.left + 12, y: event.clientY - rect.top - 10 });
      })
      .on("mousemove", function (event) {
        const rect = (svgRef.current as SVGSVGElement).getBoundingClientRect();
        setTooltipPos({ x: event.clientX - rect.left + 12, y: event.clientY - rect.top - 10 });
      })
      .on("mouseout", function () {
        d3.select(this).select("circle:last-of-type")
          .attr("stroke", "#fff")
          .attr("stroke-width", 2);
        setHoveredNode(null);
      })
      .on("click", (_, d) => {
        if (d.data.perfumumId) {
          navigate(`/plants/${d.data.perfumumId}`);
        }
      });

    // Centrer automatiquement sur la cible
    const targetNode = root.descendants().find((d) => d.data.type === "target");
    if (targetNode) {
      const tx = width / 2 - (targetNode as d3.HierarchyPointNode<TaxonNode>).y;
      const ty = height / 2 - (targetNode as d3.HierarchyPointNode<TaxonNode>).x;
      svg.call(zoom.transform, d3.zoomIdentity.translate(tx + 60, ty));
    }
  }, [data, navigate]);

  // ─── Légende ───────────────────────────────────────────────────────────────

  const legendItems: { type: NodeType; label: string }[] = [
    { type: "family",  label: "Famille" },
    { type: "genus",   label: "Genre" },
    { type: "target",  label: "Espèce courante" },
    { type: "sibling", label: "Espèces sœurs" },
    { type: "other",   label: "Autres espèces" },
  ];

  // ─── Rendu ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Construction de l'arbre taxonomique…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-3 text-muted-foreground">
        <p className="text-sm">Impossible de charger l'arbre taxonomique.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" /> Réessayer
        </Button>
      </div>
    );
  }

  // ─── Garde : données taxonomiques manquantes ──────────────────────────────
  if (!data) return null;

  // Garde : arbre vide ou données manquantes (plante sans latin_name/family)
  const hasTaxonomicData =
    (data.plant.family && data.plant.family.trim() !== '') ||
    (data.plant.genus && data.plant.genus.trim() !== '') ||
    (data.plant.latinName && data.plant.latinName.trim() !== '');

  if (!hasTaxonomicData) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
        <GitBranch className="h-8 w-8 opacity-30" />
        <div className="text-center">
          <p className="text-sm font-medium">Données taxonomiques manquantes</p>
          <p className="text-xs mt-1 max-w-sm">
            Cette plante ne possède pas encore de nom latin, de famille ou de genre renseignés.
            Enrichissez sa fiche pour visualiser l'arbre taxonomique.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête avec stats et contrôles */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-indigo-500 border-indigo-300">
            Famille : {data.plant.family || "—"}
          </Badge>
          <Badge variant="outline" className="text-sky-500 border-sky-300">
            Genre : {data.plant.genus || "—"}
          </Badge>
          <Badge variant="outline" className="text-emerald-500 border-emerald-300">
            {data.stats.siblingCount} espèce{data.stats.siblingCount !== 1 ? "s" : ""} sœur{data.stats.siblingCount !== 1 ? "s" : ""}
          </Badge>
          {data.stats.ancestorCount > 0 && (
            <Badge variant="outline" className="text-amber-500 border-amber-300">
              {data.stats.ancestorCount} ancêtre{data.stats.ancestorCount !== 1 ? "s" : ""} Wikidata
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUseWikidata((v) => !v)}
            className="gap-1.5"
          >
            {useWikidata ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            {useWikidata ? "Wikidata actif" : "Wikidata désactivé"}
          </Button>
          {data.plant.wikidataQid && (
            <a
              href={`https://www.wikidata.org/wiki/${data.plant.wikidataQid}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                Wikidata
              </Button>
            </a>
          )}
          {data.plant.gbifId && (
            <a
              href={`https://www.gbif.org/species/${data.plant.gbifId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                GBIF
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Graphe D3 */}
      <div
        ref={containerRef}
        className="relative w-full rounded-lg border bg-slate-950/60 overflow-hidden"
        style={{ height: "520px" }}
      >
        <svg ref={svgRef} className="w-full h-full" />

        {/* Tooltip */}
        {hoveredNode && (
          <div
            className="absolute z-10 pointer-events-none bg-popover border rounded-lg shadow-lg p-3 text-sm max-w-xs"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <p className="font-semibold text-foreground">
              {hoveredNode.latinName || hoveredNode.name}
            </p>
            {hoveredNode.latinName && hoveredNode.latinName !== hoveredNode.name && (
              <p className="text-muted-foreground text-xs">{hoveredNode.name}</p>
            )}
            <div className="flex flex-wrap gap-1 mt-1.5">
              <Badge
                variant="secondary"
                className="text-xs"
                style={{ backgroundColor: NODE_COLORS[hoveredNode.type] + "33", color: NODE_COLORS[hoveredNode.type] }}
              >
                {hoveredNode.type === "target" ? "Espèce courante"
                  : hoveredNode.type === "sibling" ? "Espèce sœur"
                  : hoveredNode.type === "genus" ? "Genre"
                  : hoveredNode.type === "family" ? "Famille"
                  : "Autre espèce"}
              </Badge>
              {hoveredNode.wikidataQid && (
                <Badge variant="outline" className="text-xs text-amber-500">
                  QID: {hoveredNode.wikidataQid}
                </Badge>
              )}
            </div>
            {hoveredNode.perfumumId && (
              <p className="text-xs text-muted-foreground mt-1.5">
                Cliquer pour ouvrir la fiche →
              </p>
            )}
          </div>
        )}

        {/* Légende */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 bg-background/80 backdrop-blur-sm rounded-md px-3 py-2 border">
          {legendItems.map(({ type, label }) => (
            <div key={type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="inline-block rounded-full"
                style={{
                  width: NODE_RADIUS[type] * 1.6,
                  height: NODE_RADIUS[type] * 1.6,
                  backgroundColor: NODE_COLORS[type],
                  opacity: type === "other" ? 0.5 : 0.9,
                }}
              />
              {label}
            </div>
          ))}
        </div>

        {/* Instruction zoom */}
        <p className="absolute top-2 right-3 text-xs text-muted-foreground/60 select-none">
          Molette pour zoomer · Glisser pour déplacer
        </p>
      </div>

      {/* Ancêtres Wikidata */}
      {data.wikidataAncestors.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-amber-500" />
              Lignée taxonomique Wikidata
            </CardTitle>
            <CardDescription className="text-xs">
              Ancêtres via la propriété P171 (parent taxon) — du rang le plus bas au plus élevé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-1.5">
              {data.wikidataAncestors.map((ancestor: WikidataAncestor, i: number) => (
                <div key={ancestor.qid} className="flex items-center gap-1.5">
                  <a
                    href={`https://www.wikidata.org/wiki/${ancestor.qid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border hover:bg-accent transition-colors"
                  >
                    <span className="text-muted-foreground">{ancestor.rankLabel} ·</span>
                    <span className="font-medium">{ancestor.label}</span>
                    <ExternalLink className="h-2.5 w-2.5 text-muted-foreground" />
                  </a>
                  {i < data.wikidataAncestors.length - 1 && (
                    <span className="text-muted-foreground/40 text-xs">→</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
