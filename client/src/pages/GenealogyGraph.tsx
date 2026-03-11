// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft, Loader2, GitBranch, Leaf, Filter, Info,
  Maximize2, Download, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import * as d3 from "d3";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DominantMolecule {
  molecule: string;
  percentage: number;
  role: string;
}

interface OlfactiveNotes {
  base?: string[];
  heart?: string[];
  top?: string[];
}

interface GraphNode {
  id: number;
  name: string;
  type: "landrace" | "modern";
  varietyType: string | null;
  plantName: string;
  plantCategory: string;
  country: string | null;
  dominantMolecules: DominantMolecule[] | string | null;
  molecularProfile: Record<string, unknown> | string | null;
  olfactiveNotes: OlfactiveNotes | string | null;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  id: number;
  source: number | GraphNode;
  target: number | GraphNode;
  type: string | null;
  crossDate: number | null;
  breeder: string | null;
  notes: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  cannabis: "#16a34a",
  tabac: "#b45309",
  tobacco: "#b45309",
  aromatic: "#7c3aed",
  aromatique: "#7c3aed",
  aromatic_plant: "#7c3aed",
  flower: "#db2777",
  fleur: "#db2777",
  floral: "#db2777",
  unknown: "#6b7280",
};

const CATEGORY_DISPLAY: { key: string; label: string; color: string }[] = [
  { key: "cannabis", label: "Cannabis", color: "#16a34a" },
  { key: "tobacco", label: "Tabac", color: "#b45309" },
  { key: "aromatic", label: "Aromatiques", color: "#7c3aed" },
  { key: "flower", label: "Fleurs", color: "#db2777" },
  { key: "other", label: "Autres", color: "#6b7280" },
];

const RELATIONSHIP_COLORS: Record<string, string> = {
  parent: "#22c55e",
  hybrid: "#f59e0b",
  clone: "#3b82f6",
  mutation: "#ef4444",
};

const RELATIONSHIP_LABELS: Record<string, string> = {
  parent: "Parent",
  hybrid: "Hybride",
  clone: "Clone",
  mutation: "Mutation",
};

function getCategoryColor(plantCategory: string): string {
  const cat = (plantCategory || "").toLowerCase();
  return CATEGORY_COLORS[cat] || "#6b7280";
}

function getCategoryLabel(plantCategory: string): string {
  const cat = (plantCategory || "").toLowerCase();
  if (cat === "cannabis") return "Cannabis";
  if (cat === "tabac" || cat === "tobacco") return "Tabac";
  if (cat === "aromatic" || cat === "aromatique" || cat === "aromatic_plant") return "Aromatique";
  if (cat === "flower" || cat === "fleur" || cat === "floral") return "Fleur";
  return "Autre";
}

function matchesCategory(node: GraphNode, catKey: string): boolean {
  const pName = (node.plantName || "").toLowerCase();
  const pCat = (node.plantCategory || "").toLowerCase();
  if (catKey === "cannabis") return pName.includes("cannabis") || pCat === "cannabis";
  if (catKey === "tobacco") return pName.includes("tabac") || pName.includes("tobacco") || pCat === "tabac" || pCat === "tobacco";
  if (catKey === "aromatic") return pCat === "aromatic" || pCat === "aromatique" || pCat === "aromatic_plant";
  if (catKey === "flower") return pCat === "flower" || pCat === "fleur" || pCat === "floral";
  if (catKey === "other") {
    return !pName.includes("cannabis") &&
      !pName.includes("tabac") &&
      !pName.includes("tobacco") &&
      !["cannabis", "tabac", "tobacco", "aromatic", "aromatique", "aromatic_plant", "flower", "fleur", "floral"].includes(pCat);
  }
  return true;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GenealogyGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);

  // Category filters (multi-select)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(["cannabis", "tobacco", "aromatic", "flower", "other"])
  );

  // Variety type filters
  const [includeModern, setIncludeModern] = useState(true);
  const [includeLandraces, setIncludeLandraces] = useState(true);

  // Relationship type filters
  const [selectedRelTypes, setSelectedRelTypes] = useState<Set<string>>(
    new Set(["parent", "hybrid", "clone", "mutation"])
  );

  // Color mode toggle
  const [colorByCategory, setColorByCategory] = useState(true);

  // Fetch all data (filtering done client-side for instant response)
  const { data: graphData, isLoading, refetch } = trpc.genealogy.getGraphData.useQuery({
    plantType: "all",
    includeModern,
    includeLandraces,
  });

  // ── Client-side filtering ──
  const filteredData = (() => {
    if (!graphData) return { nodes: [], links: [] };

    const filteredNodes = graphData.nodes.filter((n) => {
      // Check if node matches any selected category
      for (const cat of selectedCategories) {
        if (matchesCategory(n, cat)) return true;
      }
      return false;
    });

    const nodeIds = new Set(filteredNodes.map((n) => n.id));

    const filteredLinks = graphData.links.filter((l) => {
      const srcId = typeof l.source === "object" ? (l.source as GraphNode).id : l.source;
      const tgtId = typeof l.target === "object" ? (l.target as GraphNode).id : l.target;
      if (!nodeIds.has(srcId) || !nodeIds.has(tgtId)) return false;
      if (selectedRelTypes.size === 0) return false;
      return selectedRelTypes.has(l.type || "parent");
    });

    return { nodes: filteredNodes, links: filteredLinks };
  })();

  // ── Category statistics ──
  const categoryStats = (() => {
    const stats: Record<string, number> = {};
    for (const n of filteredData.nodes) {
      const label = getCategoryLabel(n.plantCategory);
      stats[label] = (stats[label] || 0) + 1;
    }
    return stats;
  })();

  // ── D3 Force Simulation ──
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    if (filteredData.nodes.length === 0) {
      d3.select(svgRef.current).selectAll("*").remove();
      return;
    }

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    svg.selectAll("*").remove();

    // Zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.05, 6])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoom(event.transform.k);
      });
    svg.call(zoomBehavior);

    const g = svg.append("g");

    // Arrow markers
    const defs = svg.append("defs");
    Object.entries(RELATIONSHIP_COLORS).forEach(([type, color]) => {
      defs.append("marker")
        .attr("id", `arrow-${type}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 22)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", color)
        .attr("d", "M0,-5L10,0L0,5");
    });

    // Deep-copy nodes and links for D3 mutation
    const nodes: GraphNode[] = filteredData.nodes.map((n) => ({ ...n }));
    const links: GraphLink[] = filteredData.links.map((l) => ({ ...l }));

    // Force simulation
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(120)
        .strength(0.4))
      .force("charge", d3.forceManyBody().strength(-350))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(45));

    // Links
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => RELATIONSHIP_COLORS[d.type] || "#6b7280")
      .attr("stroke-opacity", 0.65)
      .attr("stroke-width", 2)
      .attr("marker-end", (d: any) => `url(#arrow-${d.type || "parent"})`);

    // Node groups
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(d3.drag<SVGGElement, GraphNode>()
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
        }) as any);

    // Circles
    node.append("circle")
      .attr("r", (d: GraphNode) => d.type === "landrace" ? 13 : 9)
      .attr("fill", (d: GraphNode) => {
        if (colorByCategory) {
          return getCategoryColor(d.plantCategory);
        }
        // Color by geographic region (legacy)
        const country = (d.country || "").toLowerCase();
        if (country.includes("afghan") || country.includes("hindu") || country.includes("pakistan")) return "#dc2626";
        if (country.includes("thai") || country.includes("vietnam") || country.includes("laos")) return "#16a34a";
        if (country.includes("africa") || country.includes("malawi") || country.includes("durban") || country.includes("angola")) return "#ca8a04";
        if (country.includes("jamaica") || country.includes("caribbean")) return "#0891b2";
        if (country.includes("mexico") || country.includes("colombia") || country.includes("panama")) return "#7c3aed";
        if (country.includes("lebanon") || country.includes("morocco")) return "#ea580c";
        return "#6366f1";
      })
      .attr("stroke", "rgba(255,255,255,0.7)")
      .attr("stroke-width", 1.5);

    // Labels
    node.append("text")
      .attr("dx", 16)
      .attr("dy", 4)
      .attr("font-size", "11px")
      .attr("fill", "currentColor")
      .attr("pointer-events", "none")
      .text((d: GraphNode) => d.name.length > 22 ? d.name.slice(0, 20) + "…" : d.name);

    // Click handler
    node.on("click", (event, d: GraphNode) => {
      event.stopPropagation();
      setSelectedNode(d);
    });

    svg.on("click", () => setSelectedNode(null));

    // Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => { simulation.stop(); };
  }, [filteredData, colorByCategory]);

  // ── Zoom controls ──
  const resetZoom = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current)
      .transition().duration(500)
      .call(d3.zoom<SVGSVGElement, unknown>().transform as any, d3.zoomIdentity);
  };

  const exportSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `genealogy-${new Date().toISOString().split("T")[0]}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Toggle helpers ──
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const toggleRelType = (type: string) => {
    setSelectedRelTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const selectAllCategories = () => {
    setSelectedCategories(new Set(["cannabis", "tobacco", "aromatic", "flower", "other"]));
  };

  const selectAllRelTypes = () => {
    setSelectedRelTypes(new Set(["parent", "hybrid", "clone", "mutation"]));
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <Breadcrumbs
            items={[
              { label: "Accueil", href: "/" },
              { label: "Variétés", href: "/varietes" },
              { label: "Arbre Généalogique" },
            ]}
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <Link href="/varietes">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <GitBranch className="h-6 w-6 text-primary" />
                  Arbre Généalogique des Variétés
                </h1>
                <p className="text-sm text-muted-foreground">
                  Visualisation interactive des relations entre variétés
                  {" — "}
                  <span className="font-medium">{filteredData.nodes.length}</span> variétés
                  {" · "}
                  <span className="font-medium">{filteredData.links.length}</span> relations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetZoom}>
                <Maximize2 className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={exportSVG}>
                <Download className="h-4 w-4 mr-2" />
                Export SVG
              </Button>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* Category Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Catégories de plantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {CATEGORY_DISPLAY.map(({ key, label, color }) => (
                  <div key={key} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`cat-${key}`}
                      checked={selectedCategories.has(key)}
                      onCheckedChange={() => toggleCategory(key)}
                    />
                    <label
                      htmlFor={`cat-${key}`}
                      className="flex items-center gap-2 cursor-pointer text-sm select-none"
                    >
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: color }}
                      />
                      {label}
                    </label>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs mt-1 h-7"
                  onClick={selectAllCategories}
                >
                  Tout sélectionner
                </Button>
              </CardContent>
            </Card>

            {/* Relationship Type Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Types de relation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {Object.entries(RELATIONSHIP_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`rel-${key}`}
                      checked={selectedRelTypes.has(key)}
                      onCheckedChange={() => toggleRelType(key)}
                    />
                    <label
                      htmlFor={`rel-${key}`}
                      className="flex items-center gap-2 cursor-pointer text-sm select-none"
                    >
                      <span
                        className="w-6 h-0.5 flex-shrink-0"
                        style={{ background: RELATIONSHIP_COLORS[key] }}
                      />
                      {label}
                    </label>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs mt-1 h-7"
                  onClick={selectAllRelTypes}
                >
                  Tout sélectionner
                </Button>
              </CardContent>
            </Card>

            {/* Variety Type & Display Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  Affichage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="landraces" className="text-sm cursor-pointer">Landraces</Label>
                  <Switch id="landraces" checked={includeLandraces} onCheckedChange={setIncludeLandraces} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="modern" className="text-sm cursor-pointer">Hybrides modernes</Label>
                  <Switch id="modern" checked={includeModern} onCheckedChange={setIncludeModern} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="colorMode" className="text-sm cursor-pointer">Couleur par catégorie</Label>
                  <Switch id="colorMode" checked={colorByCategory} onCheckedChange={setColorByCategory} />
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            {graphData?.stats && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Variétés affichées</span>
                    <Badge variant="secondary">{filteredData.nodes.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Relations affichées</span>
                    <Badge variant="outline">{filteredData.links.length}</Badge>
                  </div>
                  {Object.keys(categoryStats).length > 0 && (
                    <>
                      <Separator />
                      {Object.entries(categoryStats).map(([cat, count]) => (
                        <div key={cat} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{cat}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </>
                  )}
                  <Separator />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total base de données</span>
                    <span>{graphData.stats.totalVarieties}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Pays d'origine</span>
                    <span>{graphData.stats.countries}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Legend */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Légende</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {colorByCategory ? (
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Catégories</p>
                    {CATEGORY_DISPLAY.map(({ color, label }) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span className="text-xs">{label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Régions</p>
                    {[
                      { color: "#dc2626", label: "Hindu Kush" },
                      { color: "#16a34a", label: "Asie SE" },
                      { color: "#ca8a04", label: "Afrique" },
                      { color: "#0891b2", label: "Caraïbes" },
                      { color: "#7c3aed", label: "Amérique latine" },
                      { color: "#ea580c", label: "Moyen-Orient" },
                    ].map(({ color, label }) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span className="text-xs">{label}</span>
                      </div>
                    ))}
                  </div>
                )}
                <Separator />
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Taille des nœuds</p>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-muted-foreground/60 border-2 border-background flex-shrink-0" />
                    <span className="text-xs">Landrace (grand)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/60 border-2 border-background flex-shrink-0" />
                    <span className="text-xs">Hybride (petit)</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Liens</p>
                  {Object.entries(RELATIONSHIP_LABELS).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className="w-6 h-0.5 flex-shrink-0" style={{ background: RELATIONSHIP_COLORS[key] }} />
                      <span className="text-xs">{label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Node Info */}
            {selectedNode && (
              <Card className="border-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    {selectedNode.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: getCategoryColor(selectedNode.plantCategory) }}
                    />
                    {getCategoryLabel(selectedNode.plantCategory)}
                    {" · "}
                    {selectedNode.type === "landrace" ? "Landrace" : "Hybride"}
                    {selectedNode.country && ` · ${selectedNode.country}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {selectedNode.plantName && selectedNode.plantName !== "Unknown" && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Espèce</p>
                      <p className="text-xs italic">{selectedNode.plantName}</p>
                    </div>
                  )}
                  {selectedNode.dominantMolecules && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Molécules dominantes</p>
                      {Array.isArray(selectedNode.dominantMolecules) ? (
                        <div className="space-y-1">
                          {(selectedNode.dominantMolecules as DominantMolecule[]).slice(0, 4).map((m, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="font-medium">{m.molecule}</span>
                              <span className="text-muted-foreground">{m.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs">{String(selectedNode.dominantMolecules)}</p>
                      )}
                    </div>
                  )}
                  {selectedNode.olfactiveNotes && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Notes olfactives</p>
                      {typeof selectedNode.olfactiveNotes === "object" && selectedNode.olfactiveNotes !== null ? (
                        <div className="space-y-1 text-xs">
                          {(selectedNode.olfactiveNotes as OlfactiveNotes).top && (
                            <div>
                              <span className="text-muted-foreground">Tête : </span>
                              {(selectedNode.olfactiveNotes as OlfactiveNotes).top!.join(", ")}
                            </div>
                          )}
                          {(selectedNode.olfactiveNotes as OlfactiveNotes).heart && (
                            <div>
                              <span className="text-muted-foreground">Cœur : </span>
                              {(selectedNode.olfactiveNotes as OlfactiveNotes).heart!.join(", ")}
                            </div>
                          )}
                          {(selectedNode.olfactiveNotes as OlfactiveNotes).base && (
                            <div>
                              <span className="text-muted-foreground">Base : </span>
                              {(selectedNode.olfactiveNotes as OlfactiveNotes).base!.join(", ")}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs">{String(selectedNode.olfactiveNotes)}</p>
                      )}
                    </div>
                  )}
                  <Link href={`/varietes/${selectedNode.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      Voir la fiche complète →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Main Graph Area ── */}
          <div className="lg:col-span-3 space-y-3">
            <Card className="h-[680px]">
              <CardContent className="p-0 h-full">
                <div ref={containerRef} className="relative w-full h-full rounded-lg overflow-hidden">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/60 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Chargement du graphe…</p>
                      </div>
                    </div>
                  )}
                  {!isLoading && filteredData.nodes.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                      <GitBranch className="h-16 w-16 mb-4 opacity-30" />
                      <p className="text-lg font-medium">Aucune variété à afficher</p>
                      <p className="text-sm">Ajustez les filtres pour voir des données</p>
                    </div>
                  )}
                  <svg
                    ref={svgRef}
                    className="w-full h-full"
                    style={{
                      background: "var(--background)",
                      display: (!isLoading && filteredData.nodes.length > 0) ? "block" : "none",
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Zoom & hint bar */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Zoom : {Math.round(zoom * 100)}%</span>
              <span>Glisser pour déplacer · Scroll pour zoomer · Cliquer sur un nœud pour les détails</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
