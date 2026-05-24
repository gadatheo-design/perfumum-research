import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import {
  Search, Filter, FlaskConical, Leaf, Droplets, TreePine,
  Flower2, Wind, Package, ChevronLeft, ChevronRight,
  BarChart3, Grid3X3, List, CheckCircle2, AlertCircle, XCircle
} from "lucide-react";

// ─── Constantes ──────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  huile_essentielle: { label: "Huile essentielle", color: "bg-amber-100 text-amber-800 border-amber-200", icon: <Droplets className="w-3 h-3" /> },
  absolue:           { label: "Absolue",            color: "bg-rose-100 text-rose-800 border-rose-200",   icon: <Flower2 className="w-3 h-3" /> },
  concrete:          { label: "Concrète",            color: "bg-orange-100 text-orange-800 border-orange-200", icon: <Package className="w-3 h-3" /> },
  resinoid:          { label: "Résinoïde",           color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: <TreePine className="w-3 h-3" /> },
  teinture:          { label: "Teinture",            color: "bg-purple-100 text-purple-800 border-purple-200", icon: <FlaskConical className="w-3 h-3" /> },
  co2_extract:       { label: "Extrait CO₂",         color: "bg-cyan-100 text-cyan-800 border-cyan-200",   icon: <Wind className="w-3 h-3" /> },
  hydrolat:          { label: "Hydrolat",            color: "bg-blue-100 text-blue-800 border-blue-200",   icon: <Droplets className="w-3 h-3" /> },
  beurre:            { label: "Beurre végétal",      color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: <Leaf className="w-3 h-3" /> },
  cire:              { label: "Cire",                color: "bg-stone-100 text-stone-700 border-stone-200", icon: <Package className="w-3 h-3" /> },
  oleoresine:        { label: "Oléorésine",          color: "bg-lime-100 text-lime-800 border-lime-200",   icon: <TreePine className="w-3 h-3" /> },
  infusion:          { label: "Infusion",            color: "bg-green-100 text-green-800 border-green-200", icon: <Leaf className="w-3 h-3" /> },
  maceration:        { label: "Macération",          color: "bg-teal-100 text-teal-800 border-teal-200",   icon: <FlaskConical className="w-3 h-3" /> },
  distillat:         { label: "Distillat",           color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: <Droplets className="w-3 h-3" /> },
  accord_olfactif:   { label: "Accord olfactif",     color: "bg-violet-100 text-violet-800 border-violet-200", icon: <FlaskConical className="w-3 h-3" /> },
  molecule_isolee:   { label: "Molécule isolée",     color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: <Wind className="w-3 h-3" /> },
  matiere_animale:   { label: "Matière animale",     color: "bg-stone-100 text-stone-700 border-stone-300", icon: <Leaf className="w-3 h-3" /> },
  autre:             { label: "Autre",               color: "bg-gray-100 text-gray-700 border-gray-200",   icon: <Package className="w-3 h-3" /> },
};

// Groupes de types pour les onglets rapides
const TYPE_GROUPS = [
  { key: "all",             label: "Tout",              categories: [] },
  { key: "huile_essentielle", label: "HE",              categories: ["huile_essentielle"] },
  { key: "absolue",         label: "Absolues",          categories: ["absolue", "concrete"] },
  { key: "resinoid",        label: "Résines",           categories: ["resinoid", "oleoresine", "infusion", "maceration", "teinture"] },
  { key: "co2_extract",     label: "CO₂ / Distillats", categories: ["co2_extract", "distillat", "hydrolat"] },
  { key: "accord_olfactif", label: "Accords",           categories: ["accord_olfactif"] },
  { key: "molecule_isolee", label: "Molécules isolées", categories: ["molecule_isolee"] },
  { key: "matiere_animale", label: "Animales",          categories: ["matiere_animale"] },
];

const OLFACTIVE_FAMILIES = [
  "floral","boise","agrume","epice","herbace","balsamique",
  "musque","animal","vert","fruite","marin","terreux","fume","gourmand","aromatique",
];
const OLFACTIVE_LABELS: Record<string, string> = {
  floral:"Floral", boise:"Boisé", agrume:"Agrume", epice:"Épicé",
  herbace:"Herbacé", balsamique:"Balsamique", musque:"Musqué", animal:"Animal",
  vert:"Vert", fruite:"Fruité", marin:"Marin", terreux:"Terreux",
  fume:"Fumé", gourmand:"Gourmand", aromatique:"Aromatique",
};
const QUALITY_LABELS: Record<string, string> = {
  conventionnel:"Conventionnel", bio:"Bio", sauvage:"Sauvage",
  biodynamique:"Biodynamique", aop:"AOP", igp:"IGP", fair_trade:"Commerce équitable",
};
const PRICE_LABELS: Record<string, string> = {
  economique:"Économique", standard:"Standard", premium:"Premium", luxe:"Luxe", rare:"Rare",
};
const AVAILABILITY_LABELS: Record<string, string> = {
  disponible:"Disponible", saisonnier:"Saisonnier", rare:"Rare",
  en_rupture:"En rupture", discontinue:"Discontinué",
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MatieresPremieres() {
  const [search, setSearch]               = useState("");
  const [category, setCategory]           = useState("all");
  const [olfactiveFamily, setOlfFamily]   = useState("all");
  const [quality, setQuality]             = useState("all");
  const [availability, setAvailability]   = useState("all");
  const [priceRange, setPriceRange]       = useState("all");
  const [page, setPage]                   = useState(1);
  const [viewMode, setViewMode]           = useState<"grid"|"list">("grid");
  const [showStats, setShowStats]         = useState(false);
  const [activeTypeGroup, setActiveTypeGroup] = useState("all");

  // Dériver les catégories effectives depuis le groupe actif ou le filtre individuel
  const { effectiveCategory, effectiveCategories } = useMemo(() => {
    if (category !== "all") return { effectiveCategory: category, effectiveCategories: undefined };
    const group = TYPE_GROUPS.find(g => g.key === activeTypeGroup);
    if (!group || group.categories.length === 0) return { effectiveCategory: undefined, effectiveCategories: undefined };
    if (group.categories.length === 1) return { effectiveCategory: group.categories[0], effectiveCategories: undefined };
    return { effectiveCategory: undefined, effectiveCategories: group.categories };
  }, [category, activeTypeGroup]);

  const queryInput = useMemo(() => ({
    category:        effectiveCategory,
    categories:      effectiveCategories,
    olfactiveFamily: olfactiveFamily !== "all" ? olfactiveFamily : undefined,
    quality:         quality !== "all" ? quality : undefined,
    availability:    availability !== "all" ? availability : undefined,
    priceRange:      priceRange !== "all" ? priceRange : undefined,
    search:          search.trim() || undefined,
    page, limit: 24,
  }), [effectiveCategory, effectiveCategories, olfactiveFamily, quality, availability, priceRange, search, page]);

  const { data, isLoading } = trpc.rawMaterials.getFiltered.useQuery(queryInput);
  const { data: stats }     = trpc.rawMaterials.getStats.useQuery();

  const resetFilters = () => {
    setCategory("all"); setOlfFamily("all"); setQuality("all");
    setAvailability("all"); setPriceRange("all"); setPage(1);
    setActiveTypeGroup("all");
  };

  const handleTypeGroupClick = (groupKey: string) => {
    setActiveTypeGroup(groupKey);
    setCategory("all"); // réinitialise le filtre catégorie individuel
    setPage(1);
  };

  const activeFiltersCount = [category, olfactiveFamily, quality, availability, priceRange]
    .filter(v => v !== "all").length + (activeTypeGroup !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <FlaskConical className="w-6 h-6 text-amber-600" />
                Matières Premières
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {data?.total ?? "…"} entrées — HE, absolues, résines, accords, extraits
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowStats(!showStats)} className="gap-1.5">
                <BarChart3 className="w-4 h-4" />Stats
              </Button>
              <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}>
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}>
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une matière première…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>

          {/* Onglets de type rapide */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {TYPE_GROUPS.map(group => {
              const isActive = activeTypeGroup === group.key;
              // Compter les items par groupe via stats
              const groupCount = group.categories.length === 0
                ? (stats?.byCategory as any[])?.reduce((s: number, c: any) => s + Number(c.count), 0) ?? null
                : (stats?.byCategory as any[])?.filter((c: any) => group.categories.includes(c.category))
                    .reduce((s: number, c: any) => s + Number(c.count), 0) ?? null;
              return (
                <button
                  key={group.key}
                  onClick={() => handleTypeGroupClick(group.key)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isActive
                      ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                      : "bg-background text-muted-foreground border-border hover:border-amber-400 hover:text-amber-700"
                  }`}
                >
                  {group.label}
                  {groupCount !== null && (
                    <span className={`text-xs ${
                      isActive ? "text-amber-100" : "text-muted-foreground/60"
                    }`}>{groupCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats panel */}
        {showStats && stats && (
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { title: "Par catégorie",     rows: (stats?.byCategory as any[]),     keyField: "category",         labels: CATEGORY_LABELS },
              { title: "Famille olfactive", rows: (stats?.byOlfFamily as any[]),    keyField: "olfactiveFamily",  labels: OLFACTIVE_LABELS },
              { title: "Qualité",           rows: (stats?.byQuality as any[]),      keyField: "quality",          labels: QUALITY_LABELS },
              { title: "Disponibilité",     rows: (stats?.byAvailability as any[]), keyField: "availability",     labels: AVAILABILITY_LABELS },
            ].map(({ title, rows, keyField, labels }) => (
              <Card key={title}>
                <CardHeader className="pb-2 pt-3 px-3">
                  <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">{title}</CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3 space-y-1">
                  {rows.slice(0, 5).map((row: any) => (
                    <div key={row[keyField]} className="flex justify-between text-xs">
                      <span className="text-muted-foreground truncate">
                        {(labels as any)[row[keyField]]?.label ?? (labels as any)[row[keyField]] ?? row[keyField] ?? "—"}
                      </span>
                      <span className="font-medium ml-2">{row.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filtres */}
          <aside className="lg:w-56 shrink-0 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Filter className="w-4 h-4" />Filtres
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs">{activeFiltersCount}</Badge>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            )}
            <div className="space-y-3">
              {[
                { label: "Catégorie",        value: category,       setter: setCategory,     options: Object.entries(CATEGORY_LABELS).map(([k,v]) => ({ key: k, label: v.label })) },
                { label: "Famille olfactive",value: olfactiveFamily,setter: setOlfFamily,    options: OLFACTIVE_FAMILIES.map(f => ({ key: f, label: OLFACTIVE_LABELS[f] })) },
                { label: "Qualité",          value: quality,        setter: setQuality,      options: Object.entries(QUALITY_LABELS).map(([k,v]) => ({ key: k, label: v })) },
                { label: "Disponibilité",    value: availability,   setter: setAvailability, options: Object.entries(AVAILABILITY_LABELS).map(([k,v]) => ({ key: k, label: v })) },
                { label: "Gamme de prix",    value: priceRange,     setter: setPriceRange,   options: Object.entries(PRICE_LABELS).map(([k,v]) => ({ key: k, label: v })) },
              ].map(({ label, value, setter, options }) => (
                <div key={label}>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">{label}</label>
                  <Select value={value} onValueChange={v => { setter(v); setPage(1); }}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Tous" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      {options.map(o => <SelectItem key={o.key} value={o.key}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Accès rapide</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(CATEGORY_LABELS).map(([key, { label, color, icon }]) => (
                  <button
                    key={key}
                    onClick={() => { setCategory(key === category ? "all" : key); setPage(1); }}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all ${
                      category === key ? `${color} ring-1 ring-offset-1 ring-current` : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {icon}{label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-2"}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-28 bg-muted/40 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : !data?.items.length ? (
              <div className="text-center py-16 text-muted-foreground">
                <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-lg font-medium">Aucune matière première trouvée</p>
                <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {data.items.map((item: any) => <RawMaterialCard key={item.id} item={item} />)}
              </div>
            ) : (
              <div className="space-y-2">
                {data.items.map((item: any) => <RawMaterialRow key={item.id} item={item} />)}
              </div>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-4 border-t flex-wrap gap-3">
                <p className="text-sm text-muted-foreground">
                  Page {data.page} sur {data.totalPages} — {data.total} résultats
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="gap-1">
                    <ChevronLeft className="w-4 h-4" />Précédent
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="gap-1">
                    Suivant<ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

// ─── Indicateur de complétude ────────────────────────────────────────────────
function CompletenessIndicator({ plantId, terroirId }: { plantId?: number | null; terroirId?: number | null }) {
  const score = (plantId ? 1 : 0) + (terroirId ? 1 : 0);
  if (score === 2) return (
    <span title="Fiche complète : plante + terroir renseignés" className="flex items-center gap-0.5 text-emerald-600">
      <CheckCircle2 className="w-3.5 h-3.5" />
    </span>
  );
  if (score === 1) return (
    <span title={plantId ? "Plante renseignée — terroir manquant" : "Terroir renseigné — plante manquante"} className="flex items-center gap-0.5 text-amber-500">
      <AlertCircle className="w-3.5 h-3.5" />
    </span>
  );
  return (
    <span title="Fiche incomplète : plante et terroir manquants" className="flex items-center gap-0.5 text-red-400">
      <XCircle className="w-3.5 h-3.5" />
    </span>
  );
}

function RawMaterialCard({ item }: { item: any }) {
  const cat = CATEGORY_LABELS[item.category] ?? CATEGORY_LABELS.autre;
  return (
    <Link href={`/matieres-premieres/${item.id}`}>
      <Card className="hover:shadow-md transition-shadow group cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-amber-700 transition-colors">{item.name}</h3>
                <CompletenessIndicator plantId={item.plantId} terroirId={item.terroirId} />
              </div>
              {item.latinName && <p className="text-xs text-muted-foreground italic truncate mt-0.5">{item.latinName}</p>}
            </div>
            <Badge className={`text-xs shrink-0 border ${cat.color} flex items-center gap-1`}>
              {cat.icon}{cat.label}
            </Badge>
          </div>
          {item.olfactiveProfile && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.olfactiveProfile}</p>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {item.olfactiveFamily && (
              <Badge variant="outline" className="text-xs">{OLFACTIVE_LABELS[item.olfactiveFamily] ?? item.olfactiveFamily}</Badge>
            )}
            {item.quality && (
              <Badge variant="outline" className="text-xs">{QUALITY_LABELS[item.quality] ?? item.quality}</Badge>
            )}
            {item.availability && item.availability !== "disponible" && (
              <Badge variant="outline" className={`text-xs ${item.availability === "rare" ? "text-amber-600 border-amber-300" : item.availability === "en_rupture" ? "text-red-600 border-red-300" : ""}`}>
                {AVAILABILITY_LABELS[item.availability] ?? item.availability}
              </Badge>
            )}
          </div>
          {item.originCountry && (
            <p className="text-xs text-muted-foreground mt-2">
              <span className="opacity-60">Origine : </span>{item.originCountry}{item.originRegion ? ` — ${item.originRegion}` : ""}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function RawMaterialRow({ item }: { item: any }) {
  const cat = CATEGORY_LABELS[item.category] ?? CATEGORY_LABELS.autre;
  return (
    <Link href={`/matieres-premieres/${item.id}`}>
      <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-foreground">{item.name}</span>
            {item.latinName && <span className="text-xs text-muted-foreground italic">({item.latinName})</span>}
            <CompletenessIndicator plantId={item.plantId} terroirId={item.terroirId} />
          </div>
          {item.olfactiveProfile && <p className="text-xs text-muted-foreground truncate mt-0.5">{item.olfactiveProfile}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {item.originCountry && <span className="text-xs text-muted-foreground hidden md:block">{item.originCountry}</span>}
          {item.quality && <Badge variant="outline" className="text-xs hidden sm:flex">{QUALITY_LABELS[item.quality] ?? item.quality}</Badge>}
          <Badge className={`text-xs border ${cat.color} flex items-center gap-1`}>{cat.icon}{cat.label}</Badge>
        </div>
      </div>
    </Link>
  );
}
