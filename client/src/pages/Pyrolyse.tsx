import React, { useState, useMemo, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Link } from "wouter";
import {
  Flame, Search, ArrowRight, AlertTriangle, Filter, X,
  FlaskConical, Thermometer, ChevronDown, ChevronUp, ExternalLink,
  BarChart3, Network, List
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================
interface PyrolysisTransformation {
  id: number;
  source_molecule: string;
  product_molecule: string;
  temperature_range: string | null;
  mechanism: string | null;
  toxicity_level: "low" | "moderate" | "high" | "very_high" | null;
  notes: string | null;
  created_at: string;
}

// ============================================================================
// HELPERS
// ============================================================================
const TOXICITY_CONFIG = {
  low: { label: "Faible", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", dot: "bg-emerald-500", order: 1 },
  moderate: { label: "Modérée", color: "bg-amber-500/10 text-amber-600 border-amber-500/30", dot: "bg-amber-500", order: 2 },
  high: { label: "Élevée", color: "bg-orange-500/10 text-orange-600 border-orange-500/30", dot: "bg-orange-500", order: 3 },
  very_high: { label: "Très élevée", color: "bg-red-500/10 text-red-600 border-red-500/30", dot: "bg-red-500", order: 4 },
};

function ToxicityBadge({ level }: { level: string | null }) {
  if (!level) return null;
  const cfg = TOXICITY_CONFIG[level as keyof typeof TOXICITY_CONFIG];
  if (!cfg) return null;
  return (
    <Badge variant="outline" className={`text-xs ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1.5 inline-block`} />
      {cfg.label}
    </Badge>
  );
}

// ============================================================================
// COMPOSANT GRAPHE SVG (force-directed simplifié)
// ============================================================================
function PyrolysisGraph({ data }: { data: PyrolysisTransformation[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  // Construire les nœuds et liens
  const { nodes, links } = useMemo(() => {
    const nodeMap = new Map<string, { id: string; type: "source" | "product" | "both"; count: number; maxTox: number }>();

    data.forEach(t => {
      const toxOrder = TOXICITY_CONFIG[t.toxicity_level as keyof typeof TOXICITY_CONFIG]?.order || 0;

      if (!nodeMap.has(t.source_molecule)) {
        nodeMap.set(t.source_molecule, { id: t.source_molecule, type: "source", count: 0, maxTox: 0 });
      }
      const src = nodeMap.get(t.source_molecule)!;
      src.count++;
      src.maxTox = Math.max(src.maxTox, toxOrder);

      if (!nodeMap.has(t.product_molecule)) {
        nodeMap.set(t.product_molecule, { id: t.product_molecule, type: "product", count: 0, maxTox: 0 });
      }
      const prod = nodeMap.get(t.product_molecule)!;
      prod.maxTox = Math.max(prod.maxTox, toxOrder);

      // Si une molécule est à la fois source et produit
      if (nodeMap.has(t.product_molecule) && data.some(d => d.source_molecule === t.product_molecule)) {
        nodeMap.get(t.product_molecule)!.type = "both";
      }
    });

    const nodeList = Array.from(nodeMap.values());
    const W = 900, H = 600;
    const cx = W / 2, cy = H / 2;

    // Disposition en cercle concentrique : sources au centre, produits à l'extérieur
    const sources = nodeList.filter(n => n.type === "source" || n.type === "both");
    const products = nodeList.filter(n => n.type === "product");

    sources.forEach((n, i) => {
      const angle = (i / sources.length) * 2 * Math.PI;
      const r = Math.min(sources.length * 15, 180);
      (n as any).x = cx + r * Math.cos(angle);
      (n as any).y = cy + r * Math.sin(angle);
    });

    products.forEach((n, i) => {
      const angle = (i / products.length) * 2 * Math.PI;
      const r = Math.min(products.length * 8, 280);
      (n as any).x = cx + r * Math.cos(angle);
      (n as any).y = cy + r * Math.sin(angle);
    });

    const links = data.map(t => ({
      source: t.source_molecule,
      target: t.product_molecule,
      toxicity: t.toxicity_level,
      mechanism: t.mechanism,
      temp: t.temperature_range,
    }));

    return { nodes: nodeList as (typeof nodeList[0] & { x: number; y: number })[], links };
  }, [data]);

  const getNodeColor = (node: typeof nodes[0]) => {
    if (selectedNode && node.id !== selectedNode &&
      !links.some(l => l.source === selectedNode && l.target === node.id) &&
      !links.some(l => l.target === selectedNode && l.source === node.id)) {
      return "opacity-20";
    }
    if (node.type === "source") return "fill-violet-500";
    if (node.type === "both") return "fill-amber-500";
    const toxColors = ["fill-emerald-500", "fill-amber-500", "fill-orange-500", "fill-red-500"];
    return toxColors[node.maxTox - 1] || "fill-slate-400";
  };

  const getLinkColor = (link: typeof links[0]) => {
    if (selectedNode && link.source !== selectedNode && link.target !== selectedNode) return "opacity-5";
    const colors = { low: "#10b981", moderate: "#f59e0b", high: "#f97316", very_high: "#ef4444" };
    return colors[link.toxicity as keyof typeof colors] || "#94a3b8";
  };

  const getNodePos = (id: string) => nodes.find(n => n.id === id);

  return (
    <div className="relative">
      {/* Légende */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-violet-500 inline-block" /> Molécule source</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Source & produit</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Produit — faible toxicité</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block" /> Produit — toxicité élevée</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Produit — très toxique</div>
      </div>
      <div className="text-xs text-muted-foreground mb-3">Cliquez sur un nœud pour mettre en évidence ses connexions.</div>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <svg
          ref={svgRef}
          viewBox="0 0 900 600"
          className="w-full h-auto"
          style={{ maxHeight: "500px" }}
          onClick={() => setSelectedNode(null)}
        >
          <defs>
            <marker id="arrow-low" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#10b981" />
            </marker>
            <marker id="arrow-moderate" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" />
            </marker>
            <marker id="arrow-high" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#f97316" />
            </marker>
            <marker id="arrow-very_high" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" />
            </marker>
          </defs>

          {/* Liens */}
          {links.map((link, i) => {
            const src = getNodePos(link.source);
            const tgt = getNodePos(link.target);
            if (!src || !tgt) return null;
            const color = getLinkColor(link);
            const markerId = `arrow-${link.toxicity || 'low'}`;
            return (
              <line
                key={i}
                x1={src.x} y1={src.y}
                x2={tgt.x} y2={tgt.y}
                stroke={color}
                strokeWidth={selectedNode === link.source || selectedNode === link.target ? 2 : 1}
                strokeOpacity={selectedNode ? (link.source === selectedNode || link.target === selectedNode ? 0.9 : 0.05) : 0.4}
                markerEnd={`url(#${markerId})`}
              />
            );
          })}

          {/* Nœuds */}
          {nodes.map(node => {
            const r = node.type === "source" || node.type === "both" ? 8 + Math.min(node.count * 2, 12) : 6;
            const isSelected = selectedNode === node.id;
            const isConnected = selectedNode && (
              links.some(l => l.source === selectedNode && l.target === node.id) ||
              links.some(l => l.target === selectedNode && l.source === node.id)
            );
            const opacity = selectedNode ? (isSelected || isConnected ? 1 : 0.15) : 1;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x},${node.y})`}
                className="cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setSelectedNode(isSelected ? null : node.id); }}
                onMouseEnter={(e) => {
                  const svg = svgRef.current;
                  if (!svg) return;
                  const rect = svg.getBoundingClientRect();
                  const scaleX = 900 / rect.width;
                  const scaleY = 600 / rect.height;
                  setTooltip({
                    x: node.x / scaleX,
                    y: node.y / scaleY - 20,
                    text: node.id
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
                style={{ opacity }}
              >
                <circle
                  r={r}
                  className={getNodeColor(node)}
                  stroke={isSelected ? "white" : "transparent"}
                  strokeWidth={isSelected ? 2 : 0}
                />
                {(node.type === "source" || node.type === "both" || isSelected) && (
                  <text
                    dy={-r - 3}
                    textAnchor="middle"
                    fontSize={isSelected ? 11 : 9}
                    className="fill-foreground"
                    fontWeight={isSelected ? "bold" : "normal"}
                  >
                    {node.id.length > 18 ? node.id.slice(0, 16) + "…" : node.id}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Panneau de détail du nœud sélectionné */}
      {selectedNode && (
        <div className="mt-4 p-4 border border-border rounded-lg bg-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-violet-500" />
              {selectedNode}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {/* Produits de cette molécule */}
            {links.filter(l => l.source === selectedNode).length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Produits de pyrolyse ({links.filter(l => l.source === selectedNode).length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {links.filter(l => l.source === selectedNode).map((l, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-sm">
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{l.target}</span>
                      <ToxicityBadge level={l.toxicity} />
                      {l.temp && <span className="text-xs text-muted-foreground">{l.temp}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Sources qui produisent cette molécule */}
            {links.filter(l => l.target === selectedNode).length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Produit à partir de ({links.filter(l => l.target === selectedNode).length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {links.filter(l => l.target === selectedNode).map((l, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-sm">
                      <span className="font-medium text-violet-500">{l.source}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <ToxicityBadge level={l.toxicity} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMPOSANT LISTE DÉTAILLÉE
// ============================================================================
function PyrolysisTable({ data }: { data: PyrolysisTransformation[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  // Grouper par molécule source
  const grouped = useMemo(() => {
    const map = new Map<string, PyrolysisTransformation[]>();
    data.forEach(t => {
      if (!map.has(t.source_molecule)) map.set(t.source_molecule, []);
      map.get(t.source_molecule)!.push(t);
    });
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [data]);

  return (
    <div className="space-y-2">
      {grouped.map(([source, transforms], idx) => {
        const isOpen = expanded === idx;
        const maxTox = transforms.reduce((max, t) => {
          const order = TOXICITY_CONFIG[t.toxicity_level as keyof typeof TOXICITY_CONFIG]?.order || 0;
          return Math.max(max, order);
        }, 0);
        const worstTox = Object.entries(TOXICITY_CONFIG).find(([, v]) => v.order === maxTox)?.[0] || null;

        return (
          <div key={source} className="border border-border rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors text-left"
              onClick={() => setExpanded(isOpen ? null : idx)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="h-4 w-4 text-violet-500" />
                </div>
                <div>
                  <p className="font-semibold">{source}</p>
                  <p className="text-xs text-muted-foreground">{transforms.length} produit{transforms.length > 1 ? 's' : ''} de pyrolyse</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {worstTox && <ToxicityBadge level={worstTox} />}
                {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-border divide-y divide-border">
                {transforms.map(t => (
                  <div key={t.id} className="p-4 bg-muted/20">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{t.product_molecule}</p>
                          {t.mechanism && (
                            <p className="text-xs text-muted-foreground mt-0.5">{t.mechanism}</p>
                          )}
                          {t.notes && (
                            <p className="text-xs text-muted-foreground mt-1 italic">{t.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <ToxicityBadge level={t.toxicity_level} />
                        {t.temperature_range && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Thermometer className="h-3 w-3" />
                            {t.temperature_range}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// COMPOSANT STATISTIQUES
// ============================================================================
function PyrolysisStats({ data }: { data: PyrolysisTransformation[] }) {
  const stats = useMemo(() => {
    const sources = new Set(data.map(t => t.source_molecule));
    const products = new Set(data.map(t => t.product_molecule));
    const byTox = { low: 0, moderate: 0, high: 0, very_high: 0 };
    const byMech = new Map<string, number>();

    data.forEach(t => {
      if (t.toxicity_level) byTox[t.toxicity_level]++;
      if (t.mechanism) {
        // Normaliser les mécanismes (regrouper les variantes)
        const mech = t.mechanism.length > 40 ? t.mechanism.slice(0, 40) + "…" : t.mechanism;
        byMech.set(mech, (byMech.get(mech) || 0) + 1);
      }
    });

    const topMechs = Array.from(byMech.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);

    return { sources: sources.size, products: products.size, total: data.length, byTox, topMechs };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Chiffres clés */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-violet-500">{stats.total}</p>
            <p className="text-sm text-muted-foreground mt-1">Transformations documentées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-500">{stats.sources}</p>
            <p className="text-sm text-muted-foreground mt-1">Molécules sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-emerald-500">{stats.products}</p>
            <p className="text-sm text-muted-foreground mt-1">Produits de pyrolyse</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-red-500">{stats.byTox.very_high + stats.byTox.high}</p>
            <p className="text-sm text-muted-foreground mt-1">Produits à haute toxicité</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution toxicité */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Distribution par niveau de toxicité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(TOXICITY_CONFIG).map(([level, cfg]) => {
            const count = stats.byTox[level as keyof typeof stats.byTox];
            const pct = Math.round(count / stats.total * 100);
            return (
              <div key={level} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                  <span className="text-muted-foreground">{count} ({pct}%)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cfg.dot} rounded-full transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Top mécanismes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-violet-500" />
            Principaux mécanismes de transformation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.topMechs.map(([mech, count]) => (
              <div key={mech} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground truncate flex-1 mr-4">{mech}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// PAGE PRINCIPALE
// ============================================================================
export default function Pyrolyse() {
  const [search, setSearch] = useState("");
  const [toxFilter, setToxFilter] = useState<string | null>(null);
  const [mechFilter, setMechFilter] = useState<string | null>(null);

  const { data: allData, isLoading } = trpc.molecules.listAllPyrolysis.useQuery({});

  const filteredData = useMemo(() => {
    if (!allData) return [];
    let result = allData as PyrolysisTransformation[];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.source_molecule.toLowerCase().includes(q) ||
        t.product_molecule.toLowerCase().includes(q) ||
        t.mechanism?.toLowerCase().includes(q) ||
        t.notes?.toLowerCase().includes(q)
      );
    }

    if (toxFilter) {
      result = result.filter(t => t.toxicity_level === toxFilter);
    }

    if (mechFilter) {
      result = result.filter(t => t.mechanism?.toLowerCase().includes(mechFilter.toLowerCase()));
    }

    return result;
  }, [allData, search, toxFilter, mechFilter]);

  const hasFilters = search || toxFilter || mechFilter;

  return (
    <div className="container max-w-7xl py-8 space-y-8">
      <Breadcrumbs currentLabel="Transformations pyrolytiques" />

      {/* En-tête */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Transformations pyrolytiques</h1>
            <p className="text-muted-foreground">
              Cartographie des molécules produites par combustion et pyrolyse
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          La pyrolyse est la décomposition thermique de molécules organiques en l'absence ou présence limitée d'oxygène.
          Dans le contexte du tabac, du cannabis et des plantes aromatiques, elle génère des centaines de composés secondaires
          aux propriétés olfactives et toxicologiques distinctes de leurs précurseurs.
        </p>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une molécule, un mécanisme..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(TOXICITY_CONFIG).map(([level, cfg]) => (
                <Button
                  key={level}
                  variant={toxFilter === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setToxFilter(toxFilter === level ? null : level)}
                  className="text-xs"
                >
                  <span className={`w-2 h-2 rounded-full ${cfg.dot} mr-1.5`} />
                  {cfg.label}
                </Button>
              ))}
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSearch(""); setToxFilter(null); setMechFilter(null); }}
                  className="text-xs text-muted-foreground"
                >
                  <X className="h-3 w-3 mr-1" />
                  Effacer
                </Button>
              )}
            </div>
          </div>
          {filteredData.length !== (allData?.length || 0) && (
            <p className="text-xs text-muted-foreground mt-2">
              {filteredData.length} transformation{filteredData.length > 1 ? 's' : ''} sur {allData?.length || 0}
            </p>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <Tabs defaultValue="graph" className="space-y-6">
          <TabsList>
            <TabsTrigger value="graph" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Graphe
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Liste détaillée
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="graph">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-violet-500" />
                  Graphe des transformations
                  {filteredData.length > 0 && (
                    <Badge variant="secondary">{filteredData.length} liens</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Violet = molécule source · Couleur = toxicité du produit · Taille = nombre de produits
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredData.length > 0 ? (
                  <PyrolysisGraph data={filteredData} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Aucune transformation ne correspond aux filtres sélectionnés.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-4">
              {filteredData.length > 0 ? (
                <PyrolysisTable data={filteredData} />
              ) : (
                <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
                  Aucune transformation ne correspond aux filtres sélectionnés.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <PyrolysisStats data={filteredData.length > 0 ? filteredData : (allData as PyrolysisTransformation[] || [])} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
