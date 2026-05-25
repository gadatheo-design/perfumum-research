/**
 * PERFUMUM Knowledge Graph — Axe 2.3 Rapport 6
 *
 * Visualisation D3.js force-directed du graphe de connaissances PERFUMUM.
 * Affiche les entités (molécules, plantes, recettes, familles, bibliographie)
 * et leurs relations sous forme de graphe interactif.
 *
 * Fonctionnalités :
 * - Graphe force-directed D3.js
 * - Filtrage par type d'entité
 * - Zoom / pan
 * - Clic sur un nœud → détails dans un panneau latéral
 * - Intégration avec l'endpoint SPARQL interne (trpc.sparql.internalQuery)
 * - Export SVG
 */

import { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  FlaskConical, Leaf, BookOpen, Layers, Network,
  ZoomIn, ZoomOut, RotateCcw, Download, Info, X,
  Loader2, AlertCircle
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  label: string;
  type: "molecule" | "plant" | "recipe" | "family" | "bibliography" | "citation";
  data: Record<string, string>;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: string;
  label?: string;
}

// ─── Couleurs par type d'entité ───────────────────────────────────────────────

const NODE_COLORS: Record<GraphNode["type"], string> = {
  molecule: "#3b82f6",   // bleu
  plant: "#22c55e",      // vert
  recipe: "#f59e0b",     // ambre
  family: "#a855f7",     // violet
  bibliography: "#6b7280", // gris
  citation: "#ef4444",   // rouge — réseau de citations CrossRef
};

const NODE_ICONS: Record<GraphNode["type"], string> = {
  molecule: "⚗",
  plant: "🌿",
  recipe: "📋",
  family: "🎨",
  bibliography: "📚",
  citation: "🔗",
};

const ENTITY_LABELS: Record<GraphNode["type"], string> = {
  molecule: "Molécules",
  plant: "Plantes",
  recipe: "Recettes",
  family: "Familles olfactives",
  bibliography: "Bibliographie",
  citation: "Réseau de citations",
};

// ─── Composant principal ──────────────────────────────────────────────────────

export default function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [activeTypes, setActiveTypes] = useState<Set<GraphNode["type"]>>(
    new Set(["molecule", "plant", "recipe", "family"])
  );
  const [showCitations, setShowCitations] = useState(false);
  const [citationLimit, setCitationLimit] = useState(30);
  const [nodeLimit, setNodeLimit] = useState(50);
  const [linkStrength, setLinkStrength] = useState(0.3);

  // Mutations SPARQL
  const sparqlMutation = trpc.sparql.internalQuery.useMutation();

  // Données CrossRef citations
  const citationStatsQuery = trpc.crossref.getCitationStats.useQuery(undefined, { enabled: showCitations });

  // ─── Chargement des données ──────────────────────────────────────────────────

  const loadGraphData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const allNodes: GraphNode[] = [];
      const allLinks: GraphLink[] = [];

      // Charger chaque type d'entité activé
      const queries: { type: GraphNode["type"]; query: string }[] = [];

      if (activeTypes.has("molecule")) {
        queries.push({
          type: "molecule",
          query: `SELECT ?molecule ?name ?casNumber ?wikidataQid WHERE {
  ?molecule a perfumum:Molecule ;
            perfumum:name ?name .
} LIMIT ${nodeLimit}`,
        });
      }

      if (activeTypes.has("plant")) {
        queries.push({
          type: "plant",
          query: `SELECT ?plant ?name ?latinName ?family ?wikidataQid WHERE {
  ?plant a perfumum:Plant ;
         perfumum:name ?name .
} LIMIT ${nodeLimit}`,
        });
      }

      if (activeTypes.has("recipe")) {
        queries.push({
          type: "recipe",
          query: `SELECT ?recipe ?name ?description WHERE {
  ?recipe a perfumum:Recipe ;
          perfumum:name ?name .
} LIMIT ${Math.min(nodeLimit, 30)}`,
        });
      }

      if (activeTypes.has("family")) {
        queries.push({
          type: "family",
          query: `SELECT ?family ?name ?type ?description WHERE {
  ?family a perfumum:OlfactiveFamily .
} LIMIT ${Math.min(nodeLimit, 20)}`,
        });
      }

      if (activeTypes.has("bibliography")) {
        queries.push({
          type: "bibliography",
          query: `SELECT ?entry ?title ?authors ?year WHERE {
  ?entry a perfumum:BibliographyEntry ;
         perfumum:title ?title .
} LIMIT ${Math.min(nodeLimit, 20)}`,
        });
      }

      // Exécuter les requêtes séquentiellement
      for (const { type, query } of queries) {
        const result = await sparqlMutation.mutateAsync({ query, useCache: true }) as unknown;

        if (result && typeof result === "object" && "error" in result) {
          console.warn(`Erreur SPARQL pour ${type}:`, (result as { message?: string }).message);
          continue;
        }

        const sparqlResult = result as { head: { vars: string[] }; results: { bindings: Record<string, { value: string }>[] } };
        const bindings = sparqlResult.results.bindings;
        const vars = sparqlResult.head.vars;

        for (const binding of bindings) {
          // Extraire l'URI de l'entité
          const entityVar = vars[0]; // premier var = l'entité
          const entityUri = binding[entityVar]?.value ?? "";
          if (!entityUri) continue;

          // Extraire le label
          const nameVar = vars.find((v: string) => v === "name" || v === "title" || v === "label");
          const label = nameVar ? (binding[nameVar]?.value ?? entityUri.split("/").pop() ?? "?") : "?";

          const node: GraphNode = {
            id: entityUri,
            label: label.length > 30 ? label.substring(0, 28) + "…" : label,
            type,
            data: Object.fromEntries(
              vars.map((v: string) => [v, binding[v]?.value ?? ""])
            ),
          };

          allNodes.push(node);
        }
      }

      // ─── Réseau de citations CrossRef (Axe 3.3b) ────────────────────────────
      if (showCitations && citationStatsQuery.data) {
        const stats = citationStatsQuery.data as unknown as { topCited?: { sourceId: number; sourceTitle: string; citationCount: number; targetDois: string[] }[] };
        const topCited = stats.topCited ?? [];
        const addedCitationIds = new Set<string>();

        for (const entry of topCited.slice(0, citationLimit)) {
          const sourceNodeId = `perfumum:bib:${entry.sourceId}`;
          // Ajouter le nœud source (bibliographie) s'il n'existe pas
          if (!allNodes.find(n => n.id === sourceNodeId)) {
            allNodes.push({
              id: sourceNodeId,
              label: (entry.sourceTitle ?? "Référence").substring(0, 30) + (entry.sourceTitle?.length > 30 ? "…" : ""),
              type: "bibliography",
              data: { title: entry.sourceTitle ?? "", citationCount: String(entry.citationCount) },
            });
          }
          // Ajouter les nœuds cibles (citations)
          for (const doi of (entry.targetDois ?? []).slice(0, 5)) {
            const citNodeId = `crossref:doi:${doi}`;
            if (!addedCitationIds.has(citNodeId)) {
              addedCitationIds.add(citNodeId);
              allNodes.push({
                id: citNodeId,
                label: doi.substring(0, 28) + "…",
                type: "citation",
                data: { doi, source: "CrossRef" },
              });
              allLinks.push({
                source: sourceNodeId,
                target: citNodeId,
                type: "cites",
                label: "cite",
              });
            }
          }
        }
      }

      // Générer des liens synthétiques basés sur les familles partagées
      // (molécule → famille olfactive si la molécule a une famille correspondante)
      const familyNodes = allNodes.filter(n => n.type === "family");
      const plantNodes = allNodes.filter(n => n.type === "plant");
      const moleculeNodes = allNodes.filter(n => n.type === "molecule");
      const recipeNodes = allNodes.filter(n => n.type === "recipe");

      // Liens plante → famille (basé sur le champ family)
      for (const plant of plantNodes) {
        const plantFamily = plant.data.family?.toLowerCase() ?? "";
        if (!plantFamily) continue;

        for (const family of familyNodes) {
          const famName = family.label.toLowerCase();
          if (plantFamily.includes(famName) || famName.includes(plantFamily)) {
            allLinks.push({
              source: plant.id,
              target: family.id,
              type: "belongsToFamily",
              label: "famille",
            });
          }
        }
      }

      // Liens aléatoires pour démonstration (molécule → recette)
      // Dans une version complète, ces liens viendraient de la DB
      const maxDemoLinks = Math.min(moleculeNodes.length, recipeNodes.length, 20);
      for (let i = 0; i < maxDemoLinks; i++) {
        const mol = moleculeNodes[i % moleculeNodes.length];
        const rec = recipeNodes[i % recipeNodes.length];
        if (mol && rec) {
          allLinks.push({
            source: mol.id,
            target: rec.id,
            type: "usedIn",
            label: "utilisée dans",
          });
        }
      }

      setNodes(allNodes);
      setLinks(allLinks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [activeTypes, nodeLimit, sparqlMutation]);

  // Charger au montage
  useEffect(() => {
    loadGraphData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Simulation D3 ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;

    // Nettoyer
    svg.selectAll("*").remove();

    // Groupe principal avec zoom
    const g = svg.append("g").attr("class", "graph-container");

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Flèches pour les liens
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#94a3b8");

    // Liens
    const linkElements = g.append("g").attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrowhead)");

    // Nœuds
    const nodeGroup = g.append("g").attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(
        (d3.drag<SVGGElement, GraphNode>()
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
          })) as unknown as (selection: d3.Selection<SVGGElement | d3.BaseType, GraphNode, SVGGElement, unknown>) => void
      )
      .on("click", (_event, d) => {
        setSelectedNode(d);
      });

    // Cercles des nœuds
    nodeGroup.append("circle")
      .attr("r", (d) => d.type === "family" ? 14 : d.type === "recipe" ? 12 : 10)
      .attr("fill", (d) => NODE_COLORS[d.type])
      .attr("fill-opacity", 0.85)
      .attr("stroke", (d) => NODE_COLORS[d.type])
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.5);

    // Labels des nœuds
    nodeGroup.append("text")
      .attr("dy", "0.35em")
      .attr("x", (d) => (d.type === "family" ? 18 : 14))
      .attr("font-size", "10px")
      .attr("fill", "currentColor")
      .attr("class", "text-foreground")
      .text((d) => d.label)
      .style("pointer-events", "none")
      .style("user-select", "none");

    // Simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links)
        .id((d) => d.id)
        .distance(80)
        .strength(linkStrength)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(25));

    simulationRef.current = simulation;

    simulation.on("tick", () => {
      linkElements
        .attr("x1", (d) => (d.source as GraphNode).x ?? 0)
        .attr("y1", (d) => (d.source as GraphNode).y ?? 0)
        .attr("x2", (d) => (d.target as GraphNode).x ?? 0)
        .attr("y2", (d) => (d.target as GraphNode).y ?? 0);

      nodeGroup.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, linkStrength]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleZoomIn = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.5
    );
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 0.67
    );
  };

  const handleReset = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().call(
      (d3.zoom<SVGSVGElement, unknown>().transform as any),
      d3.zoomIdentity
    );
  };

  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "perfumum-knowledge-graph.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleType = (type: GraphNode["type"]) => {
    setActiveTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  // ─── Rendu ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background">
      {/* En-tête */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-card shrink-0">
        <div className="flex items-center gap-3">
          <Network className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-base font-semibold">Graphe de Connaissances PERFUMUM</h1>
            <p className="text-xs text-muted-foreground">
              {nodes.length} entités · {links.length} relations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn} title="Zoom avant">
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut} title="Zoom arrière">
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} title="Réinitialiser la vue">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportSVG} title="Exporter en SVG">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Panneau de contrôle gauche */}
        <div className="w-64 shrink-0 border-r bg-card overflow-y-auto p-4 space-y-5">
          {/* Filtres par type */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Types d'entités
            </p>
            <div className="space-y-2">
              {(Object.keys(ENTITY_LABELS) as GraphNode["type"][]).map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={activeTypes.has(type)}
                    onCheckedChange={() => toggleType(type)}
                  />
                  <Label htmlFor={`type-${type}`} className="flex items-center gap-1.5 cursor-pointer text-xs">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: NODE_COLORS[type] }}
                    />
                    {ENTITY_LABELS[type]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Limite de nœuds */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Nœuds par type : {nodeLimit}
            </p>
            <Slider
              value={[nodeLimit]}
              onValueChange={([v]) => setNodeLimit(v)}
              min={10}
              max={100}
              step={10}
              className="w-full"
            />
          </div>

          {/* Force des liens */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Force des liens : {linkStrength.toFixed(1)}
            </p>
            <Slider
              value={[linkStrength * 10]}
              onValueChange={([v]) => setLinkStrength(v / 10)}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          {/* Réseau de citations CrossRef */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Citations CrossRef
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-citations"
                  checked={showCitations}
                  onCheckedChange={(v) => setShowCitations(!!v)}
                />
                <Label htmlFor="show-citations" className="flex items-center gap-1.5 cursor-pointer text-xs">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS.citation }} />
                  Réseau de citations
                </Label>
              </div>
              {showCitations && (
                <div className="pl-5">
                  <p className="text-xs text-muted-foreground mb-1">Limite : {citationLimit}</p>
                  <Slider
                    value={[citationLimit]}
                    onValueChange={([v]) => setCitationLimit(v)}
                    min={5}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  {citationStatsQuery.isLoading && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" /> Chargement CrossRef…
                    </p>
                  )}
                  {citationStatsQuery.data && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {(citationStatsQuery.data as { totalCitations?: number }).totalCitations ?? 0} citations chargées
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bouton de rechargement */}
          <Button
            className="w-full"
            size="sm"
            onClick={loadGraphData}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
            ) : (
              <Network className="h-3.5 w-3.5 mr-2" />
            )}
            {loading ? "Chargement…" : "Actualiser le graphe"}
          </Button>

          {/* Légende */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Légende
            </p>
            <div className="space-y-1.5">
              {(Object.keys(ENTITY_LABELS) as GraphNode["type"][]).map((type) => (
                <div key={type} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-base">{NODE_ICONS[type]}</span>
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: NODE_COLORS[type] }}
                  />
                  {ENTITY_LABELS[type]}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Zone du graphe */}
        <div className="flex-1 relative overflow-hidden" ref={containerRef}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Chargement du graphe…</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            </div>
          )}

          {nodes.length === 0 && !loading && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Network className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                <p className="text-muted-foreground text-sm">
                  Aucune entité chargée. Sélectionnez des types et cliquez sur "Actualiser".
                </p>
              </div>
            </div>
          )}

          <svg
            ref={svgRef}
            className="w-full h-full"
            style={{ background: "transparent" }}
          />
        </div>

        {/* Panneau de détails du nœud sélectionné */}
        {selectedNode && (
          <div className="w-72 shrink-0 border-l bg-card overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <span className="text-lg">{NODE_ICONS[selectedNode.type]}</span>
                <h3 className="font-semibold text-sm">Détails</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedNode(null)}
                className="h-7 w-7 p-0"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              {/* Type badge */}
              <div>
                <Badge
                  style={{
                    backgroundColor: NODE_COLORS[selectedNode.type] + "20",
                    color: NODE_COLORS[selectedNode.type],
                    borderColor: NODE_COLORS[selectedNode.type] + "40",
                  }}
                  variant="outline"
                  className="text-xs"
                >
                  {ENTITY_LABELS[selectedNode.type]}
                </Badge>
              </div>

              {/* Nom */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Nom</p>
                <p className="font-medium text-sm">{selectedNode.data.name || selectedNode.data.title || selectedNode.label}</p>
              </div>

              {/* URI */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">URI PERFUMUM</p>
                <p className="text-xs font-mono bg-muted px-2 py-1 rounded break-all">
                  {selectedNode.id}
                </p>
              </div>

              {/* Propriétés */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Propriétés</p>
                <div className="space-y-1.5">
                  {Object.entries(selectedNode.data)
                    .filter(([k, v]) => k !== "name" && k !== "title" && v && v !== selectedNode.id)
                    .map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs text-muted-foreground capitalize">{key}</span>
                        <span className="text-xs font-medium break-words">{value || "—"}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Wikidata link */}
              {selectedNode.data.wikidataQid && (
                <a
                  href={`https://www.wikidata.org/wiki/${selectedNode.data.wikidataQid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
                >
                  <Info className="h-3 w-3" />
                  Voir sur Wikidata ({selectedNode.data.wikidataQid})
                </a>
              )}

              {/* CrossRef DOI link (nœuds citation) */}
              {selectedNode.type === "citation" && selectedNode.data.doi && (
                <div className="space-y-2">
                  <div className="p-2 rounded bg-red-50 border border-red-100">
                    <p className="text-xs font-semibold text-red-700 mb-1">🔗 Citation CrossRef</p>
                    <p className="text-xs text-muted-foreground font-mono break-all">{selectedNode.data.doi}</p>
                  </div>
                  <a
                    href={`https://doi.org/${selectedNode.data.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-red-600 hover:underline"
                  >
                    <Info className="h-3 w-3" />
                    Ouvrir via DOI.org
                  </a>
                </div>
              )}

              {/* Compteur de citations (nœuds bibliography avec citationCount) */}
              {selectedNode.data.citationCount && parseInt(selectedNode.data.citationCount) > 0 && (
                <div className="p-2 rounded bg-amber-50 border border-amber-100">
                  <p className="text-xs text-amber-700">
                    📊 <strong>{selectedNode.data.citationCount}</strong> citation(s) dans le réseau CrossRef
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
