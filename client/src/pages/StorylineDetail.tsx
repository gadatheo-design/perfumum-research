import { useState } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, BookOpen, MapPin, Calendar, Layers, AlertCircle,
  Leaf, FlaskConical, Flame, Beaker, GitBranch, Archive,
  ArrowRight, ExternalLink, ChevronRight
} from "lucide-react";

// ─── Constantes Odeuropa ────────────────────────────────────────────────────

const ODEUROPA_LEVELS: Record<string, { label: string; icon: string; color: string; description: string }> = {
  physical: {
    label: "Physique",
    icon: "🌿",
    color: "border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20",
    description: "od:L12 Smell Emission — La matière végétale comme source physique de l'odeur"
  },
  sensorial: {
    label: "Sensoriel",
    icon: "⚗️",
    color: "border-l-violet-500 bg-violet-50/50 dark:bg-violet-950/20",
    description: "od:L1 Sensory Stimulus — La molécule comme stimulus sensoriel"
  },
  olfactory: {
    label: "Olfactif",
    icon: "🎯",
    color: "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20",
    description: "od:L13 Olfactory Experience — L'expérience olfactive subjective et culturelle"
  },
};

const NARRATIVE_AXES: Record<string, { label: string; icon: React.ReactNode; color: string; description: string }> = {
  botanique: {
    label: "Botanique",
    icon: <Leaf className="w-4 h-4" />,
    color: "text-emerald-700 dark:text-emerald-400",
    description: "Les plantes sources — od:L12 Smell Emission"
  },
  chimie: {
    label: "Chimie",
    icon: <FlaskConical className="w-4 h-4" />,
    color: "text-violet-700 dark:text-violet-400",
    description: "Les molécules — od:L1 Sensory Stimulus"
  },
  rituel: {
    label: "Rituel",
    icon: <Flame className="w-4 h-4" />,
    color: "text-rose-700 dark:text-rose-400",
    description: "La tradition olfactive — od:L13 Olfactory Experience"
  },
  formulation: {
    label: "Formulation",
    icon: <Beaker className="w-4 h-4" />,
    color: "text-teal-700 dark:text-teal-400",
    description: "Les recettes — traduction contemporaine"
  },
  comparaison: {
    label: "Narrations croisées",
    icon: <GitBranch className="w-4 h-4" />,
    color: "text-orange-700 dark:text-orange-400",
    description: "Connexions inter-storylines"
  },
  patrimoine: {
    label: "Patrimoine",
    icon: <Archive className="w-4 h-4" />,
    color: "text-blue-700 dark:text-blue-400",
    description: "Archives olfactives — espèces menacées"
  },
};

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  protagonist: { label: "Protagoniste", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  context: { label: "Contexte", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  transformation: { label: "Transformation", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  symbol: { label: "Symbole", color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300" },
  source: { label: "Source", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  destination: { label: "Destination", color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300" },
  contrast: { label: "Contraste", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
};

const ENTITY_ICONS: Record<string, string> = {
  plant: "🌿",
  molecule: "⚗️",
  recipe: "📋",
  raw_material: "🧪",
  terroir: "🗺️",
  reference: "📚",
  experience: "🎯",
};

const ENTITY_LINKS: Record<string, (id: number) => string> = {
  plant: (id) => `/plants/${id}`,
  molecule: (id) => `/molecule/${id}`,
  recipe: (id) => `/recette/${id}`,
};

const CROSS_STORYLINE_LABELS: Record<number, { title: string; slug: string; color: string }> = {
  30002: { title: "Tabac Oriental", slug: "tabac-oriental", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  30003: { title: "Vétiver Haïti", slug: "vetiver-haiti", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
  30004: { title: "Cannabis Landrace", slug: "cannabis-landrace", color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300" },
};

// ─── Composant NarrativeCard ────────────────────────────────────────────────

function NarrativeCard({ element, showOdeuropa = true }: { element: any; showOdeuropa?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const roleInfo = ROLE_LABELS[element.role_in_story] ?? { label: element.role_in_story, color: "bg-muted text-muted-foreground" };
  const entityIcon = ENTITY_ICONS[element.entity_type] ?? "📌";
  const odeuropa = ODEUROPA_LEVELS[element.odeuropa_level ?? "olfactory"];
  const entityLink = ENTITY_LINKS[element.entity_type]?.(element.entity_id);

  return (
    <Card className={`border-l-4 transition-all ${odeuropa?.color ?? "border-l-primary/30"}`}>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl shrink-0">{entityIcon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-sm font-semibold truncate">
                  {element.entity_name ?? `${element.entity_type} #${element.entity_id}`}
                </CardTitle>
                {element.entity_latin_name && (
                  <span className="text-xs text-muted-foreground italic truncate">
                    {element.entity_latin_name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-muted-foreground capitalize">{element.entity_type}</span>
                {showOdeuropa && odeuropa && (
                  <span className="text-xs text-muted-foreground">
                    · {odeuropa.icon} {odeuropa.label}
                  </span>
                )}
                {element.skos_concept && (
                  <span className="text-xs font-mono text-muted-foreground/70">{element.skos_concept}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleInfo.color}`}>
              {roleInfo.label}
            </span>
          </div>
        </div>
      </CardHeader>

      {(element.narrative_note || element.odeuropa_note) && (
        <CardContent className="pb-4 px-4 pt-0">
          {element.narrative_note && (
            <p className="text-sm text-muted-foreground italic mb-2">
              "{element.narrative_note}"
            </p>
          )}
          {element.odeuropa_note && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
                {expanded ? "Masquer" : "Voir"} la note Odeuropa
              </button>
              {expanded && (
                <div className="mt-2 p-3 rounded-md bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {element.odeuropa_note}
                  </p>
                </div>
              )}
            </div>
          )}
          {entityLink && (
            <div className="mt-3">
              <Link href={entityLink}>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 px-2">
                  Voir la fiche
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ─── Composant principal ────────────────────────────────────────────────────

export default function StorylineDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [activeAxis, setActiveAxis] = useState("all");

  const { data: storyline, isLoading, error } = trpc.storylines.getBySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="container max-w-5xl py-16">
        <div className="flex flex-col gap-6 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-64 bg-muted rounded" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !storyline) {
    return (
      <div className="container max-w-4xl py-16">
        <div className="flex flex-col items-center gap-6 text-center py-24">
          <AlertCircle className="w-16 h-16 text-muted-foreground opacity-40" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Fil narratif introuvable</h1>
            <p className="text-muted-foreground max-w-md">
              Le storyline <code className="text-sm bg-muted px-1 py-0.5 rounded">{slug}</code> n'existe pas encore dans la base de données PERFUMUM.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Accueil
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/storylines">
                <BookOpen className="w-4 h-4 mr-2" />
                Gérer les Storylines
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const s = storyline as any;
  const elements: any[] = s.elements ?? [];

  // Grouper les éléments par axe narratif
  const byAxis: Record<string, any[]> = {};
  for (const el of elements) {
    const axis = el.narrative_axis ?? "autre";
    if (!byAxis[axis]) byAxis[axis] = [];
    byAxis[axis].push(el);
  }

  // Axes disponibles dans ce storyline
  const availableAxes = Object.keys(byAxis).filter(a => byAxis[a].length > 0);

  // Connexions croisées
  const crossIds: number[] = s.cross_storyline_ids
    ? JSON.parse(s.cross_storyline_ids)
    : [];

  // Statistiques par niveau Odeuropa
  const levelCounts = {
    physical: elements.filter(e => e.odeuropa_level === "physical").length,
    sensorial: elements.filter(e => e.odeuropa_level === "sensorial").length,
    olfactory: elements.filter(e => e.odeuropa_level === "olfactory").length,
  };

  const filteredElements = activeAxis === "all"
    ? elements
    : elements.filter(e => (e.narrative_axis ?? "autre") === activeAxis);

  return (
    <div className="min-h-screen">
      {/* ── Hero / Smellscape ─────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #d97706 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #78350f 0%, transparent 50%),
                              radial-gradient(circle at 60% 80%, #92400e 0%, transparent 40%)`
          }}
        />
        <div className="container max-w-5xl py-12 relative z-10">
          <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-white/70 hover:text-white hover:bg-white/10">
            <Link href="/admin/storylines">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tous les fils narratifs
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {s.odeuropa_story_type && (
              <Badge className="text-xs bg-white/10 text-white/80 border-white/20 border">
                {s.odeuropa_story_type === "materially_informed" ? "Matériellement informé" :
                 s.odeuropa_story_type === "historically_informed" ? "Historiquement informé" :
                 "Traduction artistique"}
              </Badge>
            )}
            {s.status === "active" && (
              <Badge className="text-xs bg-emerald-500/20 text-emerald-300 border-emerald-500/30 border">Actif</Badge>
            )}
            <Badge variant="outline" className="text-xs border-white/20 text-white/70">
              <BookOpen className="w-3 h-3 mr-1" />
              {s.narrative_axis ?? "Fil narratif"}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">{s.title}</h1>
          {s.subtitle && (
            <p className="text-xl text-white/70 italic mb-6">{s.subtitle}</p>
          )}

          <div className="flex flex-wrap gap-5 text-sm text-white/60 mb-8">
            {s.geographic_scope && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {s.geographic_scope}
              </span>
            )}
            {s.period_label && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {s.period_label}
                {s.period_start_year && ` (${s.period_start_year}${s.period_end_year ? `–${s.period_end_year}` : ""})`}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              {elements.length} éléments narratifs
            </span>
          </div>

          {/* Smellscape */}
          {s.smellscape_description && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3 text-amber-300">
                <span className="text-lg">🌬️</span>
                <span className="text-xs font-semibold uppercase tracking-widest">Smellscape — od:L12 Smell Emission</span>
              </div>
              <p className="text-white/80 leading-relaxed italic text-sm md:text-base">
                {s.smellscape_description}
              </p>
            </div>
          )}

          {/* Expérience sensorielle */}
          {s.sensory_experience && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3 text-amber-300">
                <span className="text-lg">🎯</span>
                <span className="text-xs font-semibold uppercase tracking-widest">Expérience olfactive — od:L13</span>
              </div>
              <p className="text-white/80 leading-relaxed text-sm">
                {s.sensory_experience}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Corps principal ───────────────────────────────────────────────── */}
      <div className="container max-w-5xl py-10">

        {/* Statistiques Odeuropa */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {Object.entries(ODEUROPA_LEVELS).map(([key, lvl]) => (
            <div key={key} className={`rounded-xl border-l-4 p-4 ${lvl.color}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{lvl.icon}</span>
                <span className="text-sm font-semibold">{lvl.label}</span>
              </div>
              <p className="text-2xl font-bold">{levelCounts[key as keyof typeof levelCounts]}</p>
              <p className="text-xs text-muted-foreground mt-1">{lvl.description}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        {s.description && (
          <div className="mb-10 prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-base">
              {s.description}
            </p>
          </div>
        )}

        <Separator className="mb-8" />

        {/* Navigation narrative multiple */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Navigation narrative</h2>
            <span className="text-sm text-muted-foreground">
              {filteredElements.length} élément{filteredElements.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Sélecteur d'axe */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveAxis("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                activeAxis === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Tous les axes
            </button>
            {availableAxes.map(axis => {
              const axisInfo = NARRATIVE_AXES[axis];
              if (!axisInfo) return null;
              return (
                <button
                  key={axis}
                  onClick={() => setActiveAxis(axis)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    activeAxis === axis
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {axisInfo.icon}
                  {axisInfo.label}
                  <span className="text-xs opacity-60">({byAxis[axis].length})</span>
                </button>
              );
            })}
          </div>

          {/* Description de l'axe actif */}
          {activeAxis !== "all" && NARRATIVE_AXES[activeAxis] && (
            <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className={NARRATIVE_AXES[activeAxis].color}>
                  {NARRATIVE_AXES[activeAxis].icon}
                </span>
                <strong className="text-foreground">{NARRATIVE_AXES[activeAxis].label}</strong>
                — {NARRATIVE_AXES[activeAxis].description}
              </p>
            </div>
          )}

          {/* Éléments filtrés */}
          {filteredElements.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredElements
                .sort((a: any, b: any) => (a.sequence_order ?? 0) - (b.sequence_order ?? 0))
                .map((element: any) => (
                  <NarrativeCard key={element.id} element={element} showOdeuropa={activeAxis === "all"} />
                ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucun élément pour cet axe narratif.</p>
            </div>
          )}
        </div>

        {/* Narrations croisées */}
        {crossIds.length > 0 && (
          <>
            <Separator className="mb-8" />
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <GitBranch className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-bold">Narrations croisées</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                Ce fil narratif partage des éléments chimiques et botaniques avec d'autres storylines PERFUMUM.
                Les connexions sont établies sur la base de molécules communes (β-Caryophyllène, Eugénol, α-Pinène, Camphre).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {crossIds.map(id => {
                  const cross = CROSS_STORYLINE_LABELS[id];
                  if (!cross) return null;
                  return (
                    <Link key={id} href={`/storyline/${cross.slug}`}>
                      <Card className="hover:border-primary/50 transition-all cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Badge className={`text-xs mb-2 ${cross.color}`}>Fil narratif connexe</Badge>
                              <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                                {cross.title}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Modèle Odeuropa */}
        <Separator className="mb-8" />
        <div className="rounded-xl bg-muted/30 border border-border/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Modèle Odeuropa — Architecture narrative
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1 flex items-center gap-1.5">
                <span>🌿</span> Niveau 1 — Physique
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>od:L12 Smell Emission</strong> — La plante comme source matérielle de l'odeur.
                Daniellia oliveri, Boswellia neglecta, Xylopia aethiopica.
              </p>
            </div>
            <div>
              <p className="font-medium mb-1 flex items-center gap-1.5">
                <span>⚗️</span> Niveau 2 — Sensoriel
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>od:L1 Sensory Stimulus</strong> — La molécule comme stimulus chimique.
                α-Pinène, β-Caryophyllène, Khusimol, Eugénol.
              </p>
            </div>
            <div>
              <p className="font-medium mb-1 flex items-center gap-1.5">
                <span>🎯</span> Niveau 3 — Olfactif
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>od:L13 Olfactory Experience</strong> — L'expérience subjective et culturelle.
                Rituels mossi, formulations contemporaines, mémoire collective.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
