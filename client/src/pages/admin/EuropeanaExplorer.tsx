/**
 * PERFUMUM ↔ Europeana Explorer — Sprint 1 (v3)
 * ================================================
 * Galerie des collections muséales européennes liées aux données PERFUMUM.
 * Nouveautés Sprint 1 :
 * - 12 thèmes (6 existants + 6 nouveaux)
 * - Facettes COUNTRY / YEAR / DATA_PROVIDER / TYPE
 * - Filtres thématiques Europeana (nature, art, manuscript, map, photography)
 * - Entity API : résolution QID Wikidata → entité Europeana
 * - Recherche libre avec facettes optionnelles
 */

import React, { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  ExternalLink, Image as ImageIcon, Loader2, Search, Globe,
  FlaskConical, Leaf, AlertCircle, Info, Palette, BookOpen,
  Building2, MapPin, Calendar, BarChart2, Filter, Layers,
  Sparkles, Map, FlaskRound, TreePine, Flame, Scroll,
  Tag, MessageSquare, FileText, Link2, X, ChevronRight,
} from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EuropeanaItem {
  id: string;
  title: string;
  creator?: string;
  date?: string;
  institution?: string;
  country?: string;
  thumbnailUrl?: string;
  europeanaUrl: string;
  rights?: string;
  rightsLabel?: string;
  type?: string;
  theme?: string;
  relatedPlantId?: number;
  relatedPlantName?: string;
  relatedMoleculeId?: number;
  relatedMoleculeName?: string;
}

interface EuropeanaFacet {
  name: string;
  fields: Array<{ label: string; count: number }>;
}

// ─── Métadonnées des thèmes ───────────────────────────────────────────────────

const THEME_META: Record<string, {
  color: string; bgLight: string; bgDark: string;
  icon: string; borderColor: string; europeanaTheme?: string;
}> = {
  rose_damas:            { color: "text-rose-600",    bgLight: "bg-rose-50",    bgDark: "dark:bg-rose-950/30",    icon: "🌹", borderColor: "border-t-rose-500" },
  encens:                { color: "text-amber-600",   bgLight: "bg-amber-50",   bgDark: "dark:bg-amber-950/30",   icon: "🕯️", borderColor: "border-t-amber-500" },
  tabac_ottoman:         { color: "text-violet-600",  bgLight: "bg-violet-50",  bgDark: "dark:bg-violet-950/30",  icon: "🪄", borderColor: "border-t-violet-500" },
  houblon:               { color: "text-green-600",   bgLight: "bg-green-50",   bgDark: "dark:bg-green-950/30",   icon: "🌿", borderColor: "border-t-green-500",  europeanaTheme: "nature" },
  nard:                  { color: "text-cyan-600",    bgLight: "bg-cyan-50",    bgDark: "dark:bg-cyan-950/30",    icon: "🏺", borderColor: "border-t-cyan-500" },
  myrrhe:                { color: "text-orange-700",  bgLight: "bg-orange-50",  bgDark: "dark:bg-orange-950/30",  icon: "🌿", borderColor: "border-t-orange-700" },
  flacons_parfum:        { color: "text-purple-600",  bgLight: "bg-purple-50",  bgDark: "dark:bg-purple-950/30",  icon: "🫙", borderColor: "border-t-purple-500" },
  illustrations_botaniques: { color: "text-emerald-600", bgLight: "bg-emerald-50", bgDark: "dark:bg-emerald-950/30", icon: "🌱", borderColor: "border-t-emerald-500", europeanaTheme: "nature" },
  routes_epices:         { color: "text-yellow-700",  bgLight: "bg-yellow-50",  bgDark: "dark:bg-yellow-950/30",  icon: "🗺️", borderColor: "border-t-yellow-500", europeanaTheme: "map" },
  distillation_alchimie: { color: "text-indigo-600",  bgLight: "bg-indigo-50",  bgDark: "dark:bg-indigo-950/30",  icon: "⚗️", borderColor: "border-t-indigo-500", europeanaTheme: "manuscript" },
  jardins_botaniques:    { color: "text-teal-600",    bgLight: "bg-teal-50",    bgDark: "dark:bg-teal-950/30",    icon: "🌳", borderColor: "border-t-teal-500",   europeanaTheme: "photography" },
  rituels_olfactifs:     { color: "text-red-700",     bgLight: "bg-red-50",     bgDark: "dark:bg-red-950/30",     icon: "🔥", borderColor: "border-t-red-500" },
  libre:                 { color: "text-blue-600",    bgLight: "bg-blue-50",    bgDark: "dark:bg-blue-950/30",    icon: "🔍", borderColor: "border-t-blue-500" },
  qid:                   { color: "text-cyan-600",    bgLight: "bg-cyan-50",    bgDark: "dark:bg-cyan-950/30",    icon: "🔗", borderColor: "border-t-cyan-500" },
};

// ─── Panneau Annotations d'un item Europeana (Sprint 3 bis) ─────────────────

const ANNOTATION_TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  tagging:      { label: "Tag sémantique",  icon: <Tag className="h-3 w-3" />,           color: "text-violet-700",  bg: "bg-violet-50 dark:bg-violet-950/30 border-violet-200" },
  transcribing: { label: "Transcription",   icon: <FileText className="h-3 w-3" />,       color: "text-amber-700",   bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200" },
  describing:   { label: "Description",     icon: <MessageSquare className="h-3 w-3" />,  color: "text-blue-700",    bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200" },
  linking:      { label: "Entité liée",      icon: <Link2 className="h-3 w-3" />,          color: "text-emerald-700", bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200" },
  unknown:      { label: "Annotation",       icon: <Info className="h-3 w-3" />,           color: "text-gray-600",    bg: "bg-gray-50 dark:bg-gray-900/30 border-gray-200" },
};

function AnnotationSheet({
  item,
  open,
  onClose,
}: {
  item: EuropeanaItem | null;
  open: boolean;
  onClose: () => void;
}) {
  // Extraire le recordId depuis l'URL Europeana (ex: /9200338/BibliographicResource_xxx)
  const recordId = item?.id
    ? item.id.startsWith("/") ? item.id : `/${item.id.split("/").slice(-2).join("/")}`
    : "";

  const { data, isLoading } = trpc.europeana.getAnnotations.useQuery(
    { recordId, limit: 30 },
    { enabled: open && !!recordId }
  );

  if (!item) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="text-base leading-tight pr-6">{item.title}</SheetTitle>
          <SheetDescription className="text-xs">
            {item.institution && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {item.institution}
                {item.country && <span className="ml-1 text-muted-foreground">· {item.country}</span>}
              </span>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-4">
          {/* Lien Europeana */}
          <a
            href={item.europeanaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-cyan-600 hover:underline"
          >
            <Globe className="h-3.5 w-3.5" />
            Voir sur Europeana
            <ExternalLink className="h-3 w-3" />
          </a>

          {/* Annotations */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4 text-violet-600" />
              Annotations sémantiques
            </h3>

            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                Chargement des annotations...
              </div>
            )}

            {data && !isLoading && (
              <>
                {!data.apiAvailable && (
                  <div className="rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-3 text-xs text-amber-700 dark:text-amber-400">
                    <AlertCircle className="h-3.5 w-3.5 inline mr-1" />
                    {data.error || "Clé API Europeana non configurée."}
                    <p className="mt-1 text-muted-foreground">Ajoutez EUROPEANA_API_KEY dans les secrets du projet pour activer les annotations.</p>
                  </div>
                )}

                {data.apiAvailable && data.annotations.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <Tag className="h-6 w-6 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Aucune annotation pour cet item</p>
                    <p className="text-xs mt-1">Les annotations sont créées par les contributeurs Europeana</p>
                  </div>
                )}

                {data.apiAvailable && data.annotations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground mb-3">
                      {data.total} annotation(s) trouvée(s)
                    </p>
                    {data.annotations.map((ann, i) => {
                      const cfg = ANNOTATION_TYPE_CONFIG[ann.type] || ANNOTATION_TYPE_CONFIG.unknown;
                      return (
                        <div key={i} className={`rounded-md border p-3 text-xs space-y-1.5 ${cfg.bg}`}>
                          <div className={`flex items-center gap-1.5 font-medium ${cfg.color}`}>
                            {cfg.icon}
                            {cfg.label}
                            {ann.created && (
                              <span className="ml-auto font-normal text-muted-foreground">
                                {new Date(ann.created).toLocaleDateString("fr-FR")}
                              </span>
                            )}
                          </div>

                          {/* Corps de l'annotation */}
                          {ann.body.value && (
                            <p className="text-foreground font-medium">
                              "{ann.body.value}"
                              {ann.body.language && (
                                <Badge variant="outline" className="ml-2 text-[10px] h-4">
                                  {ann.body.language}
                                </Badge>
                              )}
                            </p>
                          )}
                          {ann.body.prefLabel && (
                            <p className="text-foreground">
                              <span className="font-medium">{ann.body.prefLabel}</span>
                              {ann.body.source && (
                                <a
                                  href={ann.body.source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 text-cyan-600 hover:underline inline-flex items-center gap-0.5"
                                >
                                  <ExternalLink className="h-2.5 w-2.5" />
                                  Entité
                                </a>
                              )}
                            </p>
                          )}
                          {!ann.body.value && !ann.body.prefLabel && ann.body.source && (
                            <a
                              href={ann.body.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-600 hover:underline flex items-center gap-1"
                            >
                              <Link2 className="h-3 w-3" />
                              {ann.body.source}
                            </a>
                          )}

                          {/* Sélecteur de cible */}
                          {ann.target.selector && (
                            <p className="text-muted-foreground text-[10px] font-mono truncate">
                              Sélecteur : {ann.target.selector}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Liens croisés PERFUMUM */}
          {(item.relatedPlantName || item.relatedMoleculeName) && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-2">Liens PERFUMUM</h3>
              <div className="flex flex-wrap gap-2">
                {item.relatedPlantName && item.relatedPlantId && (
                  <a href={`/plants/${item.relatedPlantId}`}>
                    <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-green-50">
                      <Leaf className="h-3 w-3 text-green-600" />
                      {item.relatedPlantName}
                    </Badge>
                  </a>
                )}
                {item.relatedMoleculeName && item.relatedMoleculeId && (
                  <a href={`/molecules/${item.relatedMoleculeId}`}>
                    <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-blue-50">
                      <FlaskConical className="h-3 w-3 text-blue-600" />
                      {item.relatedMoleculeName}
                    </Badge>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Carte d'œuvre Europeana ──────────────────────────────────────────────────

function EuropeanaCard({ item }: { item: EuropeanaItem }) {
  const [imgError, setImgError] = useState(false);
  const [annotationOpen, setAnnotationOpen] = useState(false);
  const meta = THEME_META[item.theme || "libre"] || THEME_META.libre;

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-200 border-t-2 ${meta.borderColor} group`}>
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        {item.thumbnailUrl && !imgError ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Palette className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
        {/* Overlay type */}
        {item.type && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs bg-black/60 text-white border-0">
              {item.type}
            </Badge>
          </div>
        )}
        {/* Droits */}
        {item.rightsLabel && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="text-xs bg-black/50 text-white border-0 max-w-[120px] truncate">
              {item.rightsLabel}
            </Badge>
          </div>
        )}
      </div>

      {/* Contenu */}
      <CardContent className="p-3 space-y-2">
        <p className="font-medium text-sm line-clamp-2 leading-tight">{item.title}</p>

        {/* Créateur + date */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {item.creator && <span className="truncate">{item.creator}</span>}
          {item.creator && item.date && <span>·</span>}
          {item.date && (
            <span className="shrink-0 flex items-center gap-0.5">
              <Calendar className="h-2.5 w-2.5" />
              {item.date}
            </span>
          )}
        </div>

        {/* Institution + pays */}
        {item.institution && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate">{item.institution}</span>
            {item.country && (
              <span className="shrink-0 flex items-center gap-0.5 ml-1">
                <MapPin className="h-2.5 w-2.5" />
                {item.country}
              </span>
            )}
          </div>
        )}

        {/* Liens croisés PERFUMUM */}
        <div className="flex flex-wrap gap-1 pt-1">
          {item.relatedPlantName && item.relatedPlantId ? (
            <Link href={`/plants/${item.relatedPlantId}`}>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-green-50 dark:hover:bg-green-950 hover:border-green-400">
                <Leaf className="h-2.5 w-2.5 mr-1 text-green-600" />
                {item.relatedPlantName}
              </Badge>
            </Link>
          ) : item.relatedPlantName ? (
            <Badge variant="outline" className="text-xs">
              <Leaf className="h-2.5 w-2.5 mr-1 text-green-600" />
              {item.relatedPlantName}
            </Badge>
          ) : null}

          {item.relatedMoleculeName && item.relatedMoleculeId ? (
            <Link href={`/molecules/${item.relatedMoleculeId}`}>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-400">
                <FlaskConical className="h-2.5 w-2.5 mr-1 text-blue-600" />
                {item.relatedMoleculeName}
              </Badge>
            </Link>
          ) : item.relatedMoleculeName ? (
            <Badge variant="outline" className="text-xs">
              <FlaskConical className="h-2.5 w-2.5 mr-1 text-blue-600" />
              {item.relatedMoleculeName}
            </Badge>
          ) : null}

          <a href={item.europeanaUrl} target="_blank" rel="noopener noreferrer">
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">
              <Globe className="h-2.5 w-2.5 mr-1 text-cyan-600" />
              Europeana
              <ExternalLink className="h-2 w-2 ml-1" />
            </Badge>
          </a>

          {/* Bouton Annotations (Sprint 3 bis) */}
          <button
            onClick={() => setAnnotationOpen(true)}
            className="inline-flex items-center gap-0.5 text-[10px] rounded-full border px-1.5 py-0.5 hover:bg-violet-50 dark:hover:bg-violet-950 hover:border-violet-400 text-muted-foreground hover:text-violet-700 transition-colors"
            title="Voir les annotations sémantiques"
          >
            <Tag className="h-2.5 w-2.5" />
            Annotations
          </button>
        </div>
      </CardContent>

      {/* Sheet Annotations */}
      <AnnotationSheet
        item={annotationOpen ? item : null}
        open={annotationOpen}
        onClose={() => setAnnotationOpen(false)}
      />
    </Card>
  );
}

// ─── Panneau de facettes ──────────────────────────────────────────────────────

function FacetsPanel({ facets }: { facets: EuropeanaFacet[] }) {
  if (!facets || facets.length === 0) return null;

  const facetIcons: Record<string, React.ReactNode> = {
    COUNTRY: <MapPin className="h-3 w-3" />,
    YEAR: <Calendar className="h-3 w-3" />,
    DATA_PROVIDER: <Building2 className="h-3 w-3" />,
    TYPE: <Layers className="h-3 w-3" />,
  };

  const facetLabels: Record<string, string> = {
    COUNTRY: "Pays",
    YEAR: "Période",
    DATA_PROVIDER: "Institutions",
    TYPE: "Types de médias",
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {facets.map((facet) => (
        <Card key={facet.name} className="border-dashed">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
              {facetIcons[facet.name] || <BarChart2 className="h-3 w-3" />}
              {facetLabels[facet.name] || facet.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-1">
            {facet.fields.slice(0, 6).map((field) => (
              <div key={field.label} className="flex items-center justify-between gap-2">
                <span className="text-xs truncate text-foreground/80">{field.label}</span>
                <Badge variant="secondary" className="text-xs shrink-0 h-4 px-1.5">
                  {field.count.toLocaleString()}
                </Badge>
              </div>
            ))}
            {facet.fields.length > 6 && (
              <p className="text-xs text-muted-foreground">+{facet.fields.length - 6} autres</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Bannière mode démonstration ──────────────────────────────────────────────

function DemoBanner({ error }: { error?: string }) {
  if (!error) return null;
  const isDemo = error.includes("démonstration") || error.includes("non configurée");
  if (!isDemo) return null;

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
      <CardContent className="p-4 flex items-start gap-3">
        <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-sm text-amber-800 dark:text-amber-300">
          <p className="font-medium mb-1">Mode démonstration — données d'exemple</p>
          <p className="text-xs">
            La clé API Europeana n'est pas encore configurée. Les œuvres affichées sont des exemples représentatifs.
            Dès que la clé sera ajoutée dans les secrets du projet, les vraies collections muséales s'afficheront automatiquement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Onglet thématique ────────────────────────────────────────────────────────

function ThematicTab({ theme }: { theme: string }) {
  const [enabled, setEnabled] = useState(false);
  const [showFacets, setShowFacets] = useState(false);
  const meta = THEME_META[theme] || THEME_META.libre;

  const { data: config } = trpc.europeana.thematicConfig.useQuery();
  const themeConfig = config?.find((t) => t.key === theme);

  const { data, isLoading, error } = trpc.europeana.thematicSearch.useQuery(
    { theme: theme as any, limit: 24 },
    { enabled }
  );

  return (
    <div className="space-y-4">
      {/* Description du thème */}
      {themeConfig && (
        <Card className={`${meta.bgLight} ${meta.bgDark} border-0`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{meta.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-sm">{themeConfig.label}</p>
                  {themeConfig.europeanaTheme && (
                    <Badge variant="outline" className="text-xs">
                      <Filter className="h-2.5 w-2.5 mr-1" />
                      theme={themeConfig.europeanaTheme}
                    </Badge>
                  )}
                  {themeConfig.facetsEnabled && (
                    <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-400">
                      <BarChart2 className="h-2.5 w-2.5 mr-1" />
                      Facettes actives
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3">{themeConfig.description}</p>
                <div className="flex flex-wrap gap-1">
                  {themeConfig.relatedPlants.map((p) => (
                    <Badge key={p} variant="outline" className="text-xs">
                      <Leaf className="h-2.5 w-2.5 mr-1 text-green-600" />
                      {p}
                    </Badge>
                  ))}
                  {themeConfig.relatedMolecules.map((m) => (
                    <Badge key={m} variant="outline" className="text-xs">
                      <FlaskConical className="h-2.5 w-2.5 mr-1 text-blue-600" />
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bouton de lancement */}
      {!enabled && (
        <div className="flex justify-center py-4">
          <Button onClick={() => setEnabled(true)} size="lg" className="gap-2">
            <Globe className="h-4 w-4" />
            Interroger les collections Europeana
          </Button>
        </div>
      )}

      {/* Chargement */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Interrogation des collections muséales européennes...
          </span>
        </div>
      )}

      {/* Erreur non-demo */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4 flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="text-sm">{error.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      {data && !isLoading && (
        <>
          <DemoBanner error={data.error} />

          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-muted-foreground">
              {data.apiAvailable
                ? `${data.total.toLocaleString()} œuvre(s) trouvée(s) dans les collections européennes`
                : `${data.items.length} exemple(s) de démonstration`}
            </p>
            <div className="flex items-center gap-2">
              {data.apiAvailable && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-400">
                  API Europeana active
                </Badge>
              )}
              {data.facets && data.facets.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 gap-1"
                  onClick={() => setShowFacets(!showFacets)}
                >
                  <BarChart2 className="h-3 w-3" />
                  {showFacets ? "Masquer" : "Afficher"} les facettes
                </Button>
              )}
            </div>
          </div>

          {/* Panneau de facettes */}
          {showFacets && data.facets && data.facets.length > 0 && (
            <FacetsPanel facets={data.facets} />
          )}

          {data.items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {data.items.map((item, i) => (
                <EuropeanaCard key={`${item.id}-${i}`} item={item} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune œuvre trouvée pour ce thème</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ─── Onglet recherche libre ───────────────────────────────────────────────────

function FreeSearchTab() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("IMAGE");
  const [withFacets, setWithFacets] = useState(false);
  const [showFacets, setShowFacets] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");

  const { data, isLoading } = trpc.europeana.freeSearch.useQuery(
    { query: currentQuery, limit: 24, typeFilter: typeFilter as any, withFacets },
    { enabled: submitted && currentQuery.length > 1 }
  );

  const handleSearch = () => {
    if (query.trim().length > 1) {
      setCurrentQuery(query.trim());
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Label>Recherche libre dans Europeana</Label>
          <Input
            placeholder="ex: Rosa damascena, oud perfume, amber resin..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div>
          <Label>Type</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IMAGE">Images</SelectItem>
              <SelectItem value="TEXT">Textes</SelectItem>
              <SelectItem value="VIDEO">Vidéos</SelectItem>
              <SelectItem value="SOUND">Sons</SelectItem>
              <SelectItem value="3D">3D</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <Button
            variant={withFacets ? "default" : "outline"}
            size="icon"
            className="h-9 w-9"
            title="Activer les facettes statistiques"
            onClick={() => setWithFacets(!withFacets)}
          >
            <BarChart2 className="h-4 w-4" />
          </Button>
          <Button onClick={handleSearch} disabled={!query.trim() || isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Rechercher
          </Button>
        </div>
      </div>

      {withFacets && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <BarChart2 className="h-3 w-3" />
          Les facettes (pays, période, institutions, types) seront affichées avec les résultats.
        </p>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Recherche dans les collections européennes...</span>
        </div>
      )}

      {data && !isLoading && (
        <>
          <DemoBanner error={data.error} />

          {data.error && !data.error.includes("démonstration") && (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="p-4 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="text-sm">{data.error}</p>
              </CardContent>
            </Card>
          )}

          {data.items.length > 0 ? (
            <>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm text-muted-foreground">
                  {data.total.toLocaleString()} résultat(s) — affichage des {data.items.length} premiers
                </p>
                {data.facets && data.facets.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 gap-1"
                    onClick={() => setShowFacets(!showFacets)}
                  >
                    <BarChart2 className="h-3 w-3" />
                    {showFacets ? "Masquer" : "Voir"} les facettes
                  </Button>
                )}
              </div>

              {showFacets && data.facets && <FacetsPanel facets={data.facets} />}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {data.items.map((item, i) => (
                  <EuropeanaCard key={`${item.id}-${i}`} item={item} />
                ))}
              </div>
            </>
          ) : submitted && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucun résultat pour "{currentQuery}"</p>
                <p className="text-xs mt-1">Essayez en anglais ou avec des termes plus généraux</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ─── Onglet IIIF Full-Text Search (Sprint 2) ────────────────────────────────

const IIIF_SUGGESTIONS = [
  "olibanum", "nardus", "rosa damascena", "myrrha", "styrax",
  "labdanum", "benzoin", "ambergris", "musk", "castoreum",
  "frankincense", "oud", "civet", "calamus", "spikenard",
];

function IiifFullTextTab() {
  const [query, setQuery] = useState("");
  const [themeFilter, setThemeFilter] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");

  const { data, isLoading } = trpc.europeana.iiifFullTextSearch.useQuery(
    { query: currentQuery, limit: 10, themeFilter },
    { enabled: submitted && currentQuery.length > 1 }
  );

  const handleSearch = () => {
    if (query.trim().length > 1) {
      setCurrentQuery(query.trim());
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Description */}
      <Card className="border-cyan-200 bg-cyan-50/50 dark:bg-cyan-950/20">
        <CardContent className="p-4 flex items-start gap-3">
          <BookOpen className="h-4 w-4 text-cyan-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-sm text-cyan-800 dark:text-cyan-200">
              IIIF Full-Text Search — Citations dans les manuscrits numérisés
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Recherche dans le texte OCR des manuscrits, herbiers et livres anciens conservés
              dans les collections européennes. Extrait les citations historiques primaires
              mentionnant vos termes olfactifs.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire */}
      <div className="flex flex-col sm:flex-row gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Label>Terme à rechercher dans les manuscrits</Label>
          <Input
            placeholder="ex: olibanum, rosa damascena, myrrha..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div>
          <Label>Thème (optionnel)</Label>
          <Select value={themeFilter || ""} onValueChange={(v) => setThemeFilter(v || undefined)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Tous les thèmes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les thèmes</SelectItem>
              <SelectItem value="distillation_alchimie">⚗️ Distillation & Alchimie</SelectItem>
              <SelectItem value="illustrations_botaniques">🌱 Illustrations botaniques</SelectItem>
              <SelectItem value="encens">🕯️ Encens & Oliban</SelectItem>
              <SelectItem value="routes_epices">🗺️ Routes des épices</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSearch} disabled={!query.trim() || isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Rechercher
        </Button>
      </div>

      {/* Suggestions */}
      {!submitted && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-muted-foreground mr-1">Suggestions :</span>
          {IIIF_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setQuery(s); }}
              className="text-xs px-2 py-0.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Chargement */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Recherche dans les manuscrits numérisés… (peut prendre 10-20s)
          </span>
        </div>
      )}

      {/* Résultats */}
      {data && !isLoading && (
        <>
          {data.error && (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="p-4 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="text-sm">{data.error}</p>
              </CardContent>
            </Card>
          )}

          {data.hits.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {data.hits.length} citation(s) trouvée(s) dans {data.total.toLocaleString()} documents textuels
              </p>
              {data.hits.map((hit, i) => (
                <Card key={`${hit.recordId}-${i}`} className="border-l-4 border-l-cyan-500">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start gap-3">
                      {hit.thumbnailUrl && (
                        <img
                          src={hit.thumbnailUrl}
                          alt={hit.title}
                          className="w-12 h-12 object-cover rounded shrink-0 bg-muted"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{hit.title}</p>
                        <div className="flex flex-wrap gap-2 mt-0.5">
                          {hit.institution && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-2.5 w-2.5" />
                              {hit.institution}
                            </span>
                          )}
                          {hit.country && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-2.5 w-2.5" />
                              {hit.country}
                            </span>
                          )}
                          {hit.date && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-2.5 w-2.5" />
                              {hit.date}
                            </span>
                          )}
                          {hit.pageLabel && (
                            <Badge variant="outline" className="text-xs h-4">
                              {hit.pageLabel}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <a href={hit.europeanaUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Voir sur Europeana">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                        <a href={hit.iiifManifestUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Manifeste IIIF">
                            <BookOpen className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      </div>
                    </div>
                    {/* Citation */}
                    <blockquote className="border-l-2 border-cyan-400 pl-3 py-1 bg-cyan-50/50 dark:bg-cyan-950/20 rounded-r">
                      <p className="text-xs italic text-foreground/80">“{hit.snippet}”</p>
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : submitted && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune citation trouvée pour « {currentQuery} »</p>
                <p className="text-xs mt-1">
                  Essayez en latin ou en anglais. Les manuscrits sont souvent en latin médiéval.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ─── Onglet statistiques ──────────────────────────────────────────────────────

function StatsTab() {
  const { data: stats, isLoading } = trpc.europeana.stats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const allThemes = stats?.themes || [];
  const existingThemes = allThemes.filter(t =>
    ["rose_damas", "encens", "tabac_ottoman", "houblon", "nard", "myrrhe"].includes(t.key)
  );
  const newThemes = allThemes.filter(t =>
    ["flacons_parfum", "illustrations_botaniques", "routes_epices", "distillation_alchimie", "jardins_botaniques", "rituels_olfactifs"].includes(t.key)
  );

  return (
    <div className="space-y-6">
      {/* Statut API */}
      <Card className={stats?.apiConfigured
        ? "border-green-200 bg-green-50 dark:bg-green-950/20"
        : "border-amber-200 bg-amber-50 dark:bg-amber-950/20"
      }>
        <CardContent className="p-4 flex items-start gap-3">
          <Info className={`h-4 w-4 mt-0.5 shrink-0 ${stats?.apiConfigured ? "text-green-600" : "text-amber-600"}`} />
          <div>
            <p className={`font-medium text-sm ${stats?.apiConfigured ? "text-green-800 dark:text-green-200" : "text-amber-800 dark:text-amber-200"}`}>
              {stats?.apiConfigured ? "API Europeana configurée et active" : "API Europeana — clé manquante"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.apiConfigured
                ? "Les requêtes interrogent les vraies collections muséales européennes en temps réel. Facettes, Entity API et filtres thématiques actifs."
                : "Mode démonstration actif. Ajoutez EUROPEANA_API_KEY dans les secrets du projet pour activer l'API. Clé gratuite sur pro.europeana.eu."
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sprint 2 — Nouvelles capacités */}
      <Card className="border-cyan-200 bg-cyan-50/50 dark:bg-cyan-950/20">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Globe className="h-4 w-4 text-cyan-600" />
            Sprint 2 — Carte géographique & Citations historiques
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Carte distribution géographique</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>IIIF Full-Text Search</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>45 pays avec coordonnées</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Citations manuscrits numérisés</span>
              </div>
            </div>
            <Link href="/europeana-map">
              <Button size="sm" className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white shrink-0">
                <Map className="h-3.5 w-3.5" />
                Ouvrir la carte
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Sprint 1 — Nouvelles capacités */}
      {stats?.sprint1 && (
        <Card className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Sprint 1 — Nouvelles capacités Europeana
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 text-xs">
                <div className={`h-2 w-2 rounded-full ${stats.sprint1.facetsEnabled ? "bg-green-500" : "bg-gray-300"}`} />
                <span>Facettes COUNTRY/YEAR</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className={`h-2 w-2 rounded-full ${stats.sprint1.entityApiEnabled ? "bg-green-500" : "bg-amber-400"}`} />
                <span>Entity API (QID→Europeana)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className={`h-2 w-2 rounded-full ${stats.sprint1.thematicFiltersEnabled ? "bg-green-500" : "bg-gray-300"}`} />
                <span>Filtres thématiques</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>{stats.sprint1.newThemes.length} nouveaux thèmes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métriques PERFUMUM */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{stats?.moleculesWithQid ?? 0}</p>
            <p className="text-sm text-muted-foreground">Molécules avec QID</p>
            <p className="text-xs text-muted-foreground">sur {stats?.totalMolecules ?? 0} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{stats?.plantsWithQid ?? 0}</p>
            <p className="text-sm text-muted-foreground">Plantes avec QID</p>
            <p className="text-xs text-muted-foreground">sur {stats?.totalPlants ?? 0} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{stats?.totalThemes ?? 12}</p>
            <p className="text-sm text-muted-foreground">Thèmes actifs</p>
            <p className="text-xs text-muted-foreground">{stats?.newThemesCount ?? 6} nouveaux (Sprint 1)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-violet-600">50M+</p>
            <p className="text-sm text-muted-foreground">Objets Europeana</p>
            <p className="text-xs text-muted-foreground">collections accessibles</p>
          </CardContent>
        </Card>
      </div>

      {/* Thèmes existants */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Palette className="h-4 w-4 text-amber-600" />
          Thèmes PERFUMUM existants
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {existingThemes.map((t) => {
            const meta = THEME_META[t.key] || THEME_META.libre;
            return (
              <Card key={t.key} className={`border-l-4 ${meta.borderColor.replace("border-t-", "border-l-")}`}>
                <CardContent className="p-3 flex items-center gap-3">
                  <span className="text-xl">{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{t.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.description.slice(0, 60)}…</p>
                    {t.facetsEnabled && (
                      <Badge variant="outline" className="text-xs mt-1 text-emerald-700 border-emerald-400">
                        <BarChart2 className="h-2.5 w-2.5 mr-1" />
                        Facettes
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Nouveaux thèmes Sprint 1 */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          Nouveaux thèmes — Sprint 1
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {newThemes.map((t) => {
            const meta = THEME_META[t.key] || THEME_META.libre;
            return (
              <Card key={t.key} className={`border-l-4 ${meta.borderColor.replace("border-t-", "border-l-")} relative`}>
                <div className="absolute top-2 right-2">
                  <Badge className="text-xs bg-indigo-600 text-white">Nouveau</Badge>
                </div>
                <CardContent className="p-3 flex items-center gap-3 pr-16">
                  <span className="text-xl">{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{t.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.description.slice(0, 60)}…</p>
                    {t.europeanaTheme && (
                      <Badge variant="outline" className="text-xs mt-1">
                        <Filter className="h-2.5 w-2.5 mr-1" />
                        {t.europeanaTheme}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <Card className="border-dashed">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Comment utiliser PERFUMUM ↔ Europeana (Sprint 1)
          </p>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Choisissez un thème dans les onglets (12 thèmes disponibles)</li>
            <li>Cliquez sur "Interroger les collections Europeana" pour lancer la recherche</li>
            <li>Activez les facettes pour voir la distribution géographique et temporelle</li>
            <li>Les badges verts/bleus sur les cartes renvoient aux fiches plantes/molécules PERFUMUM</li>
            <li>Utilisez la recherche libre avec le bouton facettes pour des analyses statistiques</li>
            <li>Les thèmes "nature", "map", "manuscript" utilisent les collections thématiques Europeana</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Onglet Annotations (recherche par terme) ───────────────────────────────

const ANNOTATION_SUGGESTIONS = [
  "Rosa damascena", "olibanum", "myrrha", "nardus", "lavandula",
  "jasmine", "frankincense", "amber", "oud", "sandalwood",
  "vetiver", "patchouli", "bergamot", "ylang", "rose",
];

function AnnotationsSearchTab() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | "tagging" | "transcribing" | "describing">("");
  const [submitted, setSubmitted] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");

  const { data, isLoading } = trpc.europeana.searchAnnotations.useQuery(
    { query: currentQuery, type: typeFilter || undefined, limit: 30 },
    { enabled: submitted && currentQuery.length > 1 }
  );

  const handleSearch = () => {
    if (query.trim().length > 1) {
      setCurrentQuery(query.trim());
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <Card className="border-violet-200 bg-violet-50/50 dark:bg-violet-950/20">
        <CardContent className="p-4">
          <p className="text-sm font-medium flex items-center gap-2 mb-1">
            <Tag className="h-4 w-4 text-violet-600" />
            Recherche dans les Annotations Europeana
          </p>
          <p className="text-xs text-muted-foreground">
            Interrogez les annotations sémantiques déposées par les contributeurs Europeana sur les collections.
            Les annotations incluent des tags, transcriptions de manuscrits et descriptions d'entités.
          </p>
        </CardContent>
      </Card>

      {/* Formulaire de recherche */}
      <div className="flex flex-col sm:flex-row gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Label>Terme à rechercher dans les annotations</Label>
          <Input
            placeholder="ex: Rosa damascena, olibanum, frankincense..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div>
          <Label>Type d'annotation</Label>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les types</SelectItem>
              <SelectItem value="tagging">Tags sémantiques</SelectItem>
              <SelectItem value="transcribing">Transcriptions</SelectItem>
              <SelectItem value="describing">Descriptions</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSearch} disabled={!query.trim() || isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
          Rechercher
        </Button>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-1.5">
        {ANNOTATION_SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setQuery(s); setCurrentQuery(s); setSubmitted(true); }}
            className="text-xs px-2 py-0.5 rounded-full border hover:bg-violet-50 dark:hover:bg-violet-950 hover:border-violet-400 text-muted-foreground hover:text-violet-700 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Chargement */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Recherche dans les annotations Europeana...</span>
        </div>
      )}

      {/* Résultats */}
      {data && !isLoading && (
        <>
          {!data.apiAvailable && (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="p-4 flex items-start gap-3 text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Annotation API non disponible</p>
                  <p className="text-xs mt-1">{data.error || "Clé API Europeana non configurée."}</p>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Ajoutez <code className="bg-amber-100 px-1 rounded">EUROPEANA_API_KEY</code> dans les secrets du projet pour activer cette fonctionnalité.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {data.apiAvailable && data.annotations.length === 0 && submitted && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                <Tag className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune annotation trouvée pour "{currentQuery}"</p>
                <p className="text-xs mt-1">Essayez un autre terme ou un type différent</p>
              </CardContent>
            </Card>
          )}

          {data.apiAvailable && data.annotations.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {data.total.toLocaleString()} annotation(s) trouvée(s) pour « {currentQuery} »
              </p>
              {data.annotations.map((ann, i) => {
                const cfg = ANNOTATION_TYPE_CONFIG[ann.type] || ANNOTATION_TYPE_CONFIG.unknown;
                return (
                  <Card key={i} className={`border ${cfg.bg}`}>
                    <CardContent className="p-4 space-y-2">
                      {/* Type + date */}
                      <div className={`flex items-center gap-2 text-xs font-medium ${cfg.color}`}>
                        {cfg.icon}
                        {cfg.label}
                        {ann.created && (
                          <span className="ml-auto font-normal text-muted-foreground">
                            {new Date(ann.created).toLocaleDateString("fr-FR")}
                          </span>
                        )}
                      </div>

                      {/* Corps */}
                      {ann.body.value && (
                        <p className="text-sm text-foreground">
                          « {ann.body.value} »
                          {ann.body.language && (
                            <Badge variant="outline" className="ml-2 text-[10px]">{ann.body.language}</Badge>
                          )}
                        </p>
                      )}
                      {ann.body.prefLabel && (
                        <p className="text-sm text-foreground font-medium">{ann.body.prefLabel}</p>
                      )}
                      {ann.body.source && (
                        <a
                          href={ann.body.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-cyan-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {ann.body.source}
                        </a>
                      )}

                      {/* Cible */}
                      {ann.target.recordId && (
                        <div className="flex items-center gap-2 pt-1 border-t">
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Item : </span>
                          <a
                            href={`https://www.europeana.eu/item${ann.target.recordId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-600 hover:underline font-mono"
                          >
                            {ann.target.recordId}
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────

export default function EuropeanaExplorer() {
  return (
    <div className="container py-6 space-y-6">
      {/* En-tête */}
      <div>
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <Globe className="h-6 w-6 text-cyan-600 shrink-0" />
          <h1 className="text-xl md:text-2xl font-bold">PERFUMUM ↔ Europeana</h1>
          <Badge variant="secondary" className="text-xs">Collections muséales européennes</Badge>
          <Badge className="text-xs bg-indigo-600 text-white">Sprint 1</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Croisement des données PERFUMUM avec les 50 millions d'objets culturels des musées européens.
          12 thèmes, facettes géographiques et temporelles, filtres par collection thématique.
        </p>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="stats">
        {/* Ligne 1 : Vue d'ensemble + thèmes existants */}
        <TabsList className="flex flex-wrap h-auto gap-1 p-1 mb-1">
          <TabsTrigger value="stats" className="text-xs">
            <Info className="h-3.5 w-3.5 mr-1" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="rose_damas" className="text-xs">🌹 Rose de Damas</TabsTrigger>
          <TabsTrigger value="encens" className="text-xs">🕯️ Encens</TabsTrigger>
          <TabsTrigger value="tabac_ottoman" className="text-xs">🪄 Tabac ottoman</TabsTrigger>
          <TabsTrigger value="houblon" className="text-xs">🌿 Houblon</TabsTrigger>
          <TabsTrigger value="nard" className="text-xs">🏺 Nard</TabsTrigger>
          <TabsTrigger value="myrrhe" className="text-xs">🌿 Myrrhe</TabsTrigger>
        </TabsList>

        {/* Ligne 2 : Nouveaux thèmes Sprint 1 + recherche libre */}
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="flacons_parfum" className="text-xs">
            <span className="mr-1">🫙</span>
            Flacons
            <Badge className="ml-1 text-[10px] bg-indigo-600 text-white h-3.5 px-1">N</Badge>
          </TabsTrigger>
          <TabsTrigger value="illustrations_botaniques" className="text-xs">
            <span className="mr-1">🌱</span>
            Botaniques
            <Badge className="ml-1 text-[10px] bg-indigo-600 text-white h-3.5 px-1">N</Badge>
          </TabsTrigger>
          <TabsTrigger value="routes_epices" className="text-xs">
            <span className="mr-1">🗺️</span>
            Routes épices
            <Badge className="ml-1 text-[10px] bg-indigo-600 text-white h-3.5 px-1">N</Badge>
          </TabsTrigger>
          <TabsTrigger value="distillation_alchimie" className="text-xs">
            <span className="mr-1">⚗️</span>
            Distillation
            <Badge className="ml-1 text-[10px] bg-indigo-600 text-white h-3.5 px-1">N</Badge>
          </TabsTrigger>
          <TabsTrigger value="jardins_botaniques" className="text-xs">
            <span className="mr-1">🌳</span>
            Jardins
            <Badge className="ml-1 text-[10px] bg-indigo-600 text-white h-3.5 px-1">N</Badge>
          </TabsTrigger>
          <TabsTrigger value="rituels_olfactifs" className="text-xs">
            <span className="mr-1">🔥</span>
            Rituels
            <Badge className="ml-1 text-[10px] bg-indigo-600 text-white h-3.5 px-1">N</Badge>
          </TabsTrigger>
          <TabsTrigger value="libre" className="text-xs">
            <Search className="h-3.5 w-3.5 mr-1" />
            Recherche libre
          </TabsTrigger>
          <TabsTrigger value="iiif_fulltext" className="text-xs">
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            Citations
            <Badge className="ml-1 text-[10px] bg-cyan-600 text-white h-3.5 px-1">S2</Badge>
          </TabsTrigger>
          <TabsTrigger value="annotations" className="text-xs">
            <Tag className="h-3.5 w-3.5 mr-1" />
            Annotations
            <Badge className="ml-1 text-[10px] bg-violet-600 text-white h-3.5 px-1">S3</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Contenu des onglets */}
        <TabsContent value="stats" className="mt-4"><StatsTab /></TabsContent>
        <TabsContent value="rose_damas" className="mt-4"><ThematicTab theme="rose_damas" /></TabsContent>
        <TabsContent value="encens" className="mt-4"><ThematicTab theme="encens" /></TabsContent>
        <TabsContent value="tabac_ottoman" className="mt-4"><ThematicTab theme="tabac_ottoman" /></TabsContent>
        <TabsContent value="houblon" className="mt-4"><ThematicTab theme="houblon" /></TabsContent>
        <TabsContent value="nard" className="mt-4"><ThematicTab theme="nard" /></TabsContent>
        <TabsContent value="myrrhe" className="mt-4"><ThematicTab theme="myrrhe" /></TabsContent>
        <TabsContent value="flacons_parfum" className="mt-4"><ThematicTab theme="flacons_parfum" /></TabsContent>
        <TabsContent value="illustrations_botaniques" className="mt-4"><ThematicTab theme="illustrations_botaniques" /></TabsContent>
        <TabsContent value="routes_epices" className="mt-4"><ThematicTab theme="routes_epices" /></TabsContent>
        <TabsContent value="distillation_alchimie" className="mt-4"><ThematicTab theme="distillation_alchimie" /></TabsContent>
        <TabsContent value="jardins_botaniques" className="mt-4"><ThematicTab theme="jardins_botaniques" /></TabsContent>
        <TabsContent value="rituels_olfactifs" className="mt-4"><ThematicTab theme="rituels_olfactifs" /></TabsContent>
        <TabsContent value="libre" className="mt-4"><FreeSearchTab /></TabsContent>
        <TabsContent value="iiif_fulltext" className="mt-4"><IiifFullTextTab /></TabsContent>
        <TabsContent value="annotations" className="mt-4"><AnnotationsSearchTab /></TabsContent>
      </Tabs>
    </div>
  );
}
