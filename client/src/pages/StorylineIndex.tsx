import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen, Globe, Layers, ArrowRight, Search, Filter,
  Network, Leaf, FlaskConical, Flame, Compass, Archive, Sparkles
} from "lucide-react";

// ─── Axes narratifs ───────────────────────────────────────────────────────────
const AXES = [
  { key: "all", label: "Tous les fils", icon: Layers, color: "text-stone-400" },
  { key: "pyrolyse_rituelle", label: "Pyrolyse & Rituel", icon: Flame, color: "text-amber-500" },
  { key: "route_encens", label: "Routes de l'Encens", icon: Compass, color: "text-yellow-600" },
  { key: "tabac_rituel", label: "Tabac & Rituel", icon: Archive, color: "text-stone-500" },
  { key: "plantes_menacees", label: "Plantes Menacées", icon: Leaf, color: "text-green-600" },
  { key: "atlas_mnemosyne", label: "Atlas Mnémosyne", icon: BookOpen, color: "text-violet-500" },
  { key: "combustion", label: "Combustion", icon: Flame, color: "text-orange-500" },
  { key: "terroir", label: "Terroir", icon: Globe, color: "text-emerald-600" },
  { key: "heritage", label: "Héritage Terpénique", icon: FlaskConical, color: "text-cyan-600" },
];

// ─── Connexions inter-storylines ─────────────────────────────────────────────
const CONNECTIONS: Record<string, { to: string; molecule: string; color: string }[]> = {
  "burkina-faso-combustion-lente": [
    { to: "tabac-oriental", molecule: "Eugénol", color: "#f59e0b" },
    { to: "cannabis-landrace", molecule: "Camphre", color: "#10b981" },
    { to: "route-encens", molecule: "α-Pinène", color: "#f59e0b" },
  ],
  "tabac-oriental": [
    { to: "burkina-faso-combustion-lente", molecule: "Eugénol", color: "#f59e0b" },
    { to: "tabac-rituel-amerindien", molecule: "Solanone", color: "#78716c" },
  ],
  "cannabis-landrace": [
    { to: "burkina-faso-combustion-lente", molecule: "Camphre", color: "#10b981" },
    { to: "vetiver-haiti", molecule: "Myrcène", color: "#06b6d4" },
  ],
  "vetiver-haiti": [
    { to: "cannabis-landrace", molecule: "Myrcène", color: "#06b6d4" },
    { to: "nardostachys-nard-perdu", molecule: "Patchoulol", color: "#8b5cf6" },
  ],
  "route-encens": [
    { to: "burkina-faso-combustion-lente", molecule: "α-Pinène", color: "#f59e0b" },
    { to: "nardostachys-nard-perdu", molecule: "Boswellic acids", color: "#8b5cf6" },
  ],
};

// ─── Couleurs par axe ─────────────────────────────────────────────────────────
const AXIS_COLORS: Record<string, string> = {
  pyrolyse_rituelle: "bg-amber-500/10 border-amber-500/30 text-amber-600",
  route_encens: "bg-yellow-500/10 border-yellow-500/30 text-yellow-700",
  tabac_rituel: "bg-stone-500/10 border-stone-500/30 text-stone-600",
  plantes_menacees: "bg-green-500/10 border-green-500/30 text-green-700",
  atlas_mnemosyne: "bg-violet-500/10 border-violet-500/30 text-violet-600",
  combustion: "bg-orange-500/10 border-orange-500/30 text-orange-600",
  terroir: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700",
  heritage: "bg-cyan-500/10 border-cyan-500/30 text-cyan-700",
};

const AXIS_LABELS: Record<string, string> = {
  pyrolyse_rituelle: "Pyrolyse & Rituel",
  route_encens: "Routes de l'Encens",
  tabac_rituel: "Tabac & Rituel",
  plantes_menacees: "Plantes Menacées",
  atlas_mnemosyne: "Atlas Mnémosyne",
  combustion: "Combustion",
  terroir: "Terroir",
  heritage: "Héritage Terpénique",
};

const ODEUROPA_TYPES: Record<string, { label: string; color: string }> = {
  materially_informed: { label: "Matériellement informé", color: "bg-amber-100 text-amber-800 border-amber-200" },
  historically_grounded: { label: "Ancré historiquement", color: "bg-blue-100 text-blue-800 border-blue-200" },
  culturally_embedded: { label: "Culturellement ancré", color: "bg-violet-100 text-violet-800 border-violet-200" },
  sensory_experience: { label: "Expérience sensorielle", color: "bg-green-100 text-green-800 border-green-200" },
};

// ─── Composant carte storyline ────────────────────────────────────────────────
function StorylineCard({ storyline, allSlugs }: { storyline: any; allSlugs: string[] }) {
  const axisColor = AXIS_COLORS[storyline.narrative_axis] || "bg-stone-100 border-stone-200 text-stone-600";
  const axisLabel = AXIS_LABELS[storyline.narrative_axis] || storyline.narrative_axis;
  const connections = CONNECTIONS[storyline.slug] || [];
  const odeuropa = storyline.odeuropa_story_type && storyline.odeuropa_story_type !== "NULL"
    ? ODEUROPA_TYPES[storyline.odeuropa_story_type]
    : null;

  return (
    <div className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300">
      {/* Bande colorée par axe */}
      <div className={`h-1 w-full ${
        storyline.narrative_axis === "pyrolyse_rituelle" ? "bg-amber-500" :
        storyline.narrative_axis === "route_encens" ? "bg-yellow-500" :
        storyline.narrative_axis === "tabac_rituel" ? "bg-stone-500" :
        storyline.narrative_axis === "plantes_menacees" ? "bg-green-500" :
        storyline.narrative_axis === "atlas_mnemosyne" ? "bg-violet-500" :
        storyline.narrative_axis === "combustion" ? "bg-orange-500" :
        storyline.narrative_axis === "terroir" ? "bg-emerald-500" :
        storyline.narrative_axis === "heritage" ? "bg-cyan-500" :
        "bg-primary"
      }`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-foreground leading-tight group-hover:text-primary transition-colors">
              {storyline.title}
            </h3>
            {storyline.subtitle && storyline.subtitle !== "NULL" && (
              <p className="text-xs text-muted-foreground mt-0.5 italic line-clamp-1">
                {storyline.subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {storyline.element_count} éléments
            </span>
          </div>
        </div>

        {/* Description */}
        {storyline.description && storyline.description !== "NULL" && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {storyline.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${axisColor}`}>
            {axisLabel}
          </span>
          {odeuropa && (
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${odeuropa.color}`}>
              ◉ {odeuropa.label}
            </span>
          )}
        </div>

        {/* Géographie */}
        {storyline.geographic_scope && storyline.geographic_scope !== "NULL" && (
          <div className="flex items-start gap-1.5 mb-3">
            <Globe className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
            <span className="text-xs text-muted-foreground line-clamp-1">
              {storyline.geographic_scope}
            </span>
          </div>
        )}

        {/* Connexions croisées */}
        {connections.length > 0 && (
          <div className="border-t border-border pt-3 mt-3">
            <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
              <Network className="h-3 w-3" />
              Narrations croisées
            </p>
            <div className="flex flex-wrap gap-1">
              {connections.map((conn) => (
                allSlugs.includes(conn.to) ? (
                  <Link key={conn.to} href={`/storyline/${conn.to}`}>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/5 border border-primary/20 text-primary hover:bg-primary/10 transition-colors cursor-pointer">
                      ⟷ {conn.molecule}
                    </span>
                  </Link>
                ) : (
                  <span key={conn.to} className="text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                    ⟷ {conn.molecule}
                  </span>
                )
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-4">
          <Link href={`/storyline/${storyline.slug}`}>
            <Button variant="outline" size="sm" className="w-full group/btn">
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              Lire le fil narratif
              <ArrowRight className="h-3.5 w-3.5 ml-auto group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Carte de connexions SVG ──────────────────────────────────────────────────
function ConnectionMap({ storylines }: { storylines: any[] }) {
  const slugToTitle: Record<string, string> = {};
  storylines.forEach(s => { slugToTitle[s.slug] = s.title; });

  // Positions en cercle
  const n = storylines.length;
  const cx = 300, cy = 200, r = 150;
  const positions: Record<string, { x: number; y: number }> = {};
  storylines.forEach((s, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    positions[s.slug] = {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  // Connexions uniques
  const drawnConnections = new Set<string>();
  const lines: { x1: number; y1: number; x2: number; y2: number; molecule: string; color: string }[] = [];
  Object.entries(CONNECTIONS).forEach(([from, conns]) => {
    if (!positions[from]) return;
    conns.forEach(conn => {
      if (!positions[conn.to]) return;
      const key = [from, conn.to].sort().join("--");
      if (drawnConnections.has(key)) return;
      drawnConnections.add(key);
      lines.push({
        x1: positions[from].x,
        y1: positions[from].y,
        x2: positions[conn.to].x,
        y2: positions[conn.to].y,
        molecule: conn.molecule,
        color: conn.color,
      });
    });
  });

  const AXIS_DOT_COLORS: Record<string, string> = {
    pyrolyse_rituelle: "#f59e0b",
    route_encens: "#ca8a04",
    tabac_rituel: "#78716c",
    plantes_menacees: "#16a34a",
    atlas_mnemosyne: "#7c3aed",
    combustion: "#ea580c",
    terroir: "#059669",
    heritage: "#0891b2",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Network className="h-4 w-4 text-primary" />
        Carte des connexions moléculaires
      </h3>
      <svg viewBox="0 0 600 400" className="w-full h-auto" style={{ maxHeight: 320 }}>
        {/* Connexions */}
        {lines.map((line, i) => (
          <g key={i}>
            <line
              x1={line.x1} y1={line.y1}
              x2={line.x2} y2={line.y2}
              stroke={line.color}
              strokeWidth="1.5"
              strokeOpacity="0.4"
              strokeDasharray="4 3"
            />
            {/* Label molécule au milieu */}
            <text
              x={(line.x1 + line.x2) / 2}
              y={(line.y1 + line.y2) / 2 - 4}
              textAnchor="middle"
              fontSize="8"
              fill={line.color}
              opacity="0.8"
              fontFamily="monospace"
            >
              {line.molecule}
            </text>
          </g>
        ))}
        {/* Nœuds */}
        {storylines.map((s) => {
          const pos = positions[s.slug];
          if (!pos) return null;
          const dotColor = AXIS_DOT_COLORS[s.narrative_axis] || "#94a3b8";
          const hasConnections = !!CONNECTIONS[s.slug];
          return (
            <g key={s.slug}>
              <circle
                cx={pos.x} cy={pos.y} r={hasConnections ? 10 : 7}
                fill={dotColor}
                fillOpacity="0.2"
                stroke={dotColor}
                strokeWidth="2"
              />
              <circle cx={pos.x} cy={pos.y} r="3" fill={dotColor} />
              <text
                x={pos.x}
                y={pos.y + 20}
                textAnchor="middle"
                fontSize="9"
                fill="currentColor"
                opacity="0.7"
                fontFamily="sans-serif"
                className="fill-foreground"
              >
                {s.title.split(" — ")[0].substring(0, 18)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function StorylineIndex() {
  const [selectedAxis, setSelectedAxis] = useState("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = trpc.storylines.list.useQuery({
    status: "active",
    limit: 50,
  });

  const storylines = (data?.storylines ?? []) as any[];
  const allSlugs = storylines.map((s: any) => s.slug);

  const filtered = useMemo(() => {
    return storylines.filter((s: any) => {
      const matchAxis = selectedAxis === "all" || s.narrative_axis === selectedAxis;
      const matchSearch = !search || 
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase()) ||
        s.geographic_scope?.toLowerCase().includes(search.toLowerCase());
      return matchAxis && matchSearch;
    });
  }, [storylines, selectedAxis, search]);

  // Stats globales
  const totalElements = storylines.reduce((acc: number, s: any) => acc + (parseInt(s.element_count) || 0), 0);
  const activeAxes = [...new Set(storylines.map((s: any) => s.narrative_axis))].length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-b from-stone-950 to-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="flex items-center gap-2 text-amber-500/80 text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="font-mono uppercase tracking-widest text-xs">Fils narratifs</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Atlas des Storylines
          </h1>
          <p className="text-stone-400 text-lg max-w-2xl mb-8 leading-relaxed">
            Chaque fil narratif est une porte d'entrée dans la recherche olfactive PERFUMUM. 
            Les connexions moléculaires tissent des narrations croisées entre les territoires, 
            les pratiques et les savoirs.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-3xl font-bold text-white">{storylines.length}</p>
              <p className="text-stone-400 text-sm">fils narratifs</p>
            </div>
            <div className="w-px bg-stone-700" />
            <div>
              <p className="text-3xl font-bold text-white">{totalElements}</p>
              <p className="text-stone-400 text-sm">éléments narratifs</p>
            </div>
            <div className="w-px bg-stone-700" />
            <div>
              <p className="text-3xl font-bold text-white">{activeAxes}</p>
              <p className="text-stone-400 text-sm">axes thématiques</p>
            </div>
            <div className="w-px bg-stone-700" />
            <div>
              <p className="text-3xl font-bold text-amber-400">
                {Object.values(CONNECTIONS).reduce((acc, c) => acc + c.length, 0)}
              </p>
              <p className="text-stone-400 text-sm">connexions croisées</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filtres et recherche */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un fil narratif, territoire, plante..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground shrink-0">Axe :</span>
          </div>
        </div>

        {/* Sélecteur d'axe */}
        <div className="flex flex-wrap gap-2 mb-8">
          {AXES.map((axis) => {
            const Icon = axis.icon;
            const count = axis.key === "all"
              ? storylines.length
              : storylines.filter((s: any) => s.narrative_axis === axis.key).length;
            if (count === 0 && axis.key !== "all") return null;
            return (
              <button
                key={axis.key}
                onClick={() => setSelectedAxis(axis.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                  selectedAxis === axis.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {axis.label}
                <span className="text-xs opacity-60 ml-0.5">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grille des storylines */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>Aucun fil narratif pour cet axe.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((s: any) => (
                  <StorylineCard key={s.id} storyline={s} allSlugs={allSlugs} />
                ))}
              </div>
            )}
          </div>

          {/* Colonne latérale : carte + légende */}
          <div className="space-y-4">
            {storylines.length > 0 && (
              <ConnectionMap storylines={storylines} />
            )}

            {/* Légende Odeuropa */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Modèle Odeuropa
              </h3>
              <div className="space-y-2">
                {[
                  { level: "L1 Physical", desc: "Objet matériel (plante, résine, molécule)", color: "bg-blue-100 text-blue-800" },
                  { level: "L2 Sensorial", desc: "Stimulus olfactif généré", color: "bg-yellow-100 text-yellow-800" },
                  { level: "L3 Olfactory", desc: "Expérience perçue & mémoire", color: "bg-green-100 text-green-800" },
                ].map(item => (
                  <div key={item.level} className="flex items-start gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-mono shrink-0 ${item.color}`}>
                      {item.level}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <p className="text-xs text-muted-foreground italic">
                Chaque élément narratif est ancré dans l'un des 3 niveaux du modèle 
                CIDOC-CRM étendu par le projet Odeuropa (2021–2024).
              </p>
            </div>

            {/* Accès rapide */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Accès direct
              </h3>
              <div className="space-y-1">
                {storylines.slice(0, 6).map((s: any) => (
                  <Link key={s.slug} href={`/storyline/${s.slug}`}>
                    <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted transition-colors cursor-pointer group">
                      <span className="text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {s.title}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0 ml-2" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
