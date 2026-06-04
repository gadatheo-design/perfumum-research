/**
 * Cinema Smellscapes — Occurrences olfactives dans le patrimoine cinématographique
 * =================================================================================
 * Outil de recherche SPARQL Wikidata et d'enregistrement des smellscapes liés
 * au cinéma : films, réalisateurs, lieux de tournage, contextes botaniques.
 *
 * Onglets :
 * 1. Recherche — Recherche SPARQL libre et par critères (thème, réalisateur, lieu, plante)
 * 2. Requêtes — Bibliothèque de requêtes pré-construites (Tarkovski, Kiarostami, etc.)
 * 3. Enregistrer — Formulaire d'ajout d'un smellscape cinématographique
 * 4. Bibliothèque — Smellscapes enregistrés avec filtres et gestion
 */
import React, { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Film, Search, Loader2, AlertCircle, BookOpen, MapPin, User,
  Calendar, Globe, Leaf, FlaskConical, Sparkles, Save, Trash2,
  ExternalLink, Tag, MessageSquare, Library, Play, ChevronRight,
  Eye, Edit3, X, Star, Clapperboard, Wind, Flame, TreePine,
  Scroll, Plus, BarChart2, Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilmResult {
  qid: string;
  title: string;
  director?: string;
  directorQid?: string;
  year?: number | null;
  country?: string;
  genre?: string;
  location?: string;
  locationQid?: string;
  subject?: string;
  subjectQid?: string;
}

interface FilmDetails {
  qid: string;
  title: string;
  director?: string;
  directorQid?: string;
  year?: number | null;
  country?: string;
  genres: string[];
  filmingLocations: string[];
  subjects: string[];
  image?: string;
  imdbId?: string;
  wikidataUrl: string;
}

interface CinemaSmellscape {
  id: number;
  film_title: string;
  film_wikidata_qid?: string;
  director?: string;
  year?: number;
  country?: string;
  scene_description: string;
  timestamp_scene?: string;
  smell_description: string;
  smell_type: string;
  olfactory_notes?: string;
  filming_location?: string;
  cultural_context?: string;
  heritage_status: string;
  research_notes?: string;
  source_type: string;
  tags: string[];
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SMELL_TYPE_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  explicit:    { label: "Explicite",    color: "bg-amber-100 text-amber-800 border-amber-200",   icon: <MessageSquare className="w-3 h-3" /> },
  implied:     { label: "Implicite",    color: "bg-blue-100 text-blue-800 border-blue-200",      icon: <Eye className="w-3 h-3" /> },
  symbolic:    { label: "Symbolique",   color: "bg-purple-100 text-purple-800 border-purple-200",icon: <Star className="w-3 h-3" /> },
  atmospheric: { label: "Atmosphérique",color: "bg-teal-100 text-teal-800 border-teal-200",     icon: <Wind className="w-3 h-3" /> },
  narrative:   { label: "Narratif",     color: "bg-rose-100 text-rose-800 border-rose-200",     icon: <Scroll className="w-3 h-3" /> },
};

const HERITAGE_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active:        { label: "Actif",         color: "bg-green-100 text-green-800" },
  endangered:    { label: "Menacé",        color: "bg-orange-100 text-orange-800" },
  lost:          { label: "Disparu",       color: "bg-red-100 text-red-800" },
  reconstructed: { label: "Reconstruit",   color: "bg-indigo-100 text-indigo-800" },
};

const QUERY_CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Réalisateurs emblématiques": <User className="w-4 h-4 text-amber-600" />,
  "Contextes botaniques":       <TreePine className="w-4 h-4 text-green-600" />,
  "Thèmes olfactifs":           <FlaskConical className="w-4 h-4 text-purple-600" />,
  "Terroirs cinématographiques":<Globe className="w-4 h-4 text-blue-600" />,
};

// ─── Composant FilmCard ───────────────────────────────────────────────────────

function FilmCard({
  film,
  onSelect,
  onSaveSmellscape,
}: {
  film: FilmResult;
  onSelect: (film: FilmResult) => void;
  onSaveSmellscape: (film: FilmResult) => void;
}) {
  return (
    <div className="border border-border rounded-lg p-4 hover:border-amber-400/50 hover:bg-amber-50/30 dark:hover:bg-amber-950/10 transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Film className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold text-sm truncate">{film.title}</span>
            {film.year && (
              <Badge variant="outline" className="text-xs shrink-0">{film.year}</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {film.director && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />{film.director}
              </span>
            )}
            {film.country && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />{film.country}
              </span>
            )}
            {film.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />{film.location}
              </span>
            )}
            {film.subject && (
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />{film.subject}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onSelect(film)}
          >
            <Eye className="w-3 h-3 mr-1" />Détails
          </Button>
          <Button
            size="sm"
            className="h-7 px-2 text-xs bg-amber-600 hover:bg-amber-700 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onSaveSmellscape(film)}
          >
            <Plus className="w-3 h-3 mr-1" />Smellscape
          </Button>
        </div>
      </div>
      {film.qid && (
        <div className="mt-2">
          <a
            href={`https://www.wikidata.org/wiki/${film.qid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-amber-600 flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />{film.qid}
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Onglet 1 : Recherche SPARQL ──────────────────────────────────────────────

function SearchTab({ onSaveSmellscape }: { onSaveSmellscape: (film: FilmResult) => void }) {
  const [searchMode, setSearchMode] = useState<"theme" | "director" | "location" | "botanical">("theme");
  const [query, setQuery] = useState("");
  const [triggered, setTriggered] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<FilmResult | null>(null);

  const themeQuery = trpc.cinemaSmellscapes.searchFilmsByOlfactoryTheme.useQuery(
    { theme: query, limit: 20 },
    { enabled: triggered && searchMode === "theme" && query.length >= 2 }
  );
  const directorQuery = trpc.cinemaSmellscapes.searchFilmsByDirector.useQuery(
    { directorName: query, limit: 15 },
    { enabled: triggered && searchMode === "director" && query.length >= 2 }
  );
  const locationQuery = trpc.cinemaSmellscapes.searchFilmsByLocation.useQuery(
    { locationName: query, limit: 15 },
    { enabled: triggered && searchMode === "location" && query.length >= 2 }
  );
  const botanicalQuery = trpc.cinemaSmellscapes.searchFilmsByOlfactoryTheme.useQuery(
    { theme: query, limit: 15 },
    { enabled: triggered && searchMode === "botanical" && query.length >= 2 }
  );

  const filmDetailsQuery = trpc.cinemaSmellscapes.getFilmDetails.useQuery(
    { qid: selectedFilm?.qid ?? "" },
    { enabled: !!selectedFilm?.qid && /^Q\d+$/.test(selectedFilm?.qid ?? "") }
  );

  const activeQuery = searchMode === "theme" ? themeQuery
    : searchMode === "director" ? directorQuery
    : searchMode === "location" ? locationQuery
    : botanicalQuery;

  const results = (activeQuery.data as FilmResult[] | undefined) ?? [];
  const isLoading = activeQuery.isLoading;

  const handleSearch = () => {
    if (query.length >= 2) setTriggered(true);
  };

  const MODES = [
    { id: "theme",     label: "Thème olfactif",  placeholder: "parfum, rose, terre, fumée…",   icon: <FlaskConical className="w-4 h-4" /> },
    { id: "director",  label: "Réalisateur",      placeholder: "Tarkovski, Kiarostami, Varda…", icon: <User className="w-4 h-4" /> },
    { id: "location",  label: "Lieu de tournage", placeholder: "Iran, Japon, Maroc, forêt…",    icon: <MapPin className="w-4 h-4" /> },
    { id: "botanical", label: "Contexte botanique",placeholder: "fleur, forêt, jardin, herbe…", icon: <Leaf className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="flex gap-6 h-full">
      {/* Panneau gauche : filtres */}
      <div className="w-64 shrink-0 space-y-4">
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
            Mode de recherche
          </Label>
          <div className="space-y-1">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => { setSearchMode(m.id as any); setTriggered(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left ${
                  searchMode === m.id
                    ? "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
            Exemples de recherche
          </Label>
          <div className="space-y-1">
            {[
              { mode: "director" as const, q: "Tarkovski" },
              { mode: "director" as const, q: "Kiarostami" },
              { mode: "theme" as const,    q: "parfum" },
              { mode: "theme" as const,    q: "rose" },
              { mode: "location" as const, q: "Iran" },
              { mode: "botanical" as const,q: "forêt" },
            ].map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setSearchMode(ex.mode);
                  setQuery(ex.q);
                  setTriggered(true);
                }}
                className="w-full text-left px-2 py-1 text-xs text-muted-foreground hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded transition-colors flex items-center gap-1"
              >
                <ChevronRight className="w-3 h-3" />
                {ex.q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panneau principal */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Barre de recherche */}
        <div className="flex gap-2">
          <Input
            placeholder={MODES.find(m => m.id === searchMode)?.placeholder ?? "Rechercher…"}
            value={query}
            onChange={e => { setQuery(e.target.value); setTriggered(false); }}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={query.length < 2 || isLoading} className="bg-amber-600 hover:bg-amber-700 text-white">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>

        {/* Résultats */}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Interrogation de Wikidata…
          </div>
        )}

        {!isLoading && triggered && results.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
            <AlertCircle className="w-4 h-4" />
            Aucun résultat pour « {query} »
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">{results.length} résultat{results.length > 1 ? "s" : ""} · source : Wikidata SPARQL</div>
            <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
              {results.map((film, i) => (
                <FilmCard
                  key={`${film.qid}-${i}`}
                  film={film}
                  onSelect={setSelectedFilm}
                  onSaveSmellscape={onSaveSmellscape}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dialog détail film */}
      <Dialog open={!!selectedFilm} onOpenChange={o => !o && setSelectedFilm(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Film className="w-5 h-5 text-amber-600" />
              {selectedFilm?.title}
              {selectedFilm?.year && <Badge variant="outline">{selectedFilm.year}</Badge>}
            </DialogTitle>
            <DialogDescription>
              Détails Wikidata du film sélectionné
            </DialogDescription>
          </DialogHeader>
          {filmDetailsQuery.isLoading && (
            <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />Chargement…
            </div>
          )}
          {filmDetailsQuery.data && (
            <div className="space-y-4">
              {filmDetailsQuery.data.image && (
                <img
                  src={filmDetailsQuery.data.image}
                  alt={filmDetailsQuery.data.title}
                  className="w-full max-h-48 object-contain rounded-lg bg-muted"
                />
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {filmDetailsQuery.data.director && (
                  <div>
                    <span className="text-muted-foreground text-xs">Réalisateur</span>
                    <p className="font-medium">{filmDetailsQuery.data.director}</p>
                  </div>
                )}
                {filmDetailsQuery.data.country && (
                  <div>
                    <span className="text-muted-foreground text-xs">Pays</span>
                    <p className="font-medium">{filmDetailsQuery.data.country}</p>
                  </div>
                )}
                {filmDetailsQuery.data.genres.length > 0 && (
                  <div>
                    <span className="text-muted-foreground text-xs">Genres</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {filmDetailsQuery.data.genres.map(g => (
                        <Badge key={g} variant="secondary" className="text-xs">{g}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {filmDetailsQuery.data.filmingLocations.length > 0 && (
                  <div>
                    <span className="text-muted-foreground text-xs">Lieux de tournage</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {filmDetailsQuery.data.filmingLocations.map(l => (
                        <Badge key={l} variant="outline" className="text-xs">{l}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {filmDetailsQuery.data.subjects.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground text-xs">Sujets / thèmes</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {filmDetailsQuery.data.subjects.slice(0, 10).map(s => (
                        <Badge key={s} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <a
                  href={filmDetailsQuery.data.wikidataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-amber-600 flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />Wikidata
                </a>
                {filmDetailsQuery.data.imdbId && (
                  <a
                    href={`https://www.imdb.com/title/${filmDetailsQuery.data.imdbId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-amber-600 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />IMDb
                  </a>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => {
                if (selectedFilm) onSaveSmellscape(selectedFilm);
                setSelectedFilm(null);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />Enregistrer un smellscape
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Onglet 2 : Requêtes pré-construites ─────────────────────────────────────

function PrebuiltQueriesTab({ onSaveSmellscape }: { onSaveSmellscape: (film: FilmResult) => void }) {
  const { data: queries = [] } = trpc.cinemaSmellscapes.getPrebuiltQueries.useQuery();
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const executeQuery = useCallback(async (sparql: string, queryId: string) => {
    setActiveQuery(queryId);
    setIsLoading(true);
    setResults(null);
    try {
      const res = await utils.cinemaSmellscapes.executeFreeSparql.fetch({ sparql });
      setColumns(res.columns);
      setResults(res.rows);
    } catch (e: any) {
      toast({ title: "Erreur SPARQL", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [utils, toast]);

  const categories = [...new Set(queries.map(q => q.category))];

  return (
    <div className="flex gap-6 h-full">
      {/* Panneau gauche : liste des requêtes */}
      <div className="w-72 shrink-0 space-y-4 overflow-y-auto max-h-[calc(100vh-280px)]">
        {categories.map(cat => (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2">
              {QUERY_CATEGORY_ICONS[cat] ?? <BookOpen className="w-4 h-4 text-muted-foreground" />}
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{cat}</span>
            </div>
            <div className="space-y-1">
              {queries.filter(q => q.category === cat).map(q => (
                <button
                  key={q.id}
                  onClick={() => executeQuery(q.sparql, q.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeQuery === q.id
                      ? "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <div className="font-medium text-sm">{q.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{q.description}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Panneau principal : résultats */}
      <div className="flex-1 min-w-0">
        {!activeQuery && (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
            <Clapperboard className="w-12 h-12 opacity-20" />
            <p className="text-sm">Sélectionnez une requête pour explorer le patrimoine cinématographique</p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center gap-2 py-12 justify-center text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            Interrogation de Wikidata…
          </div>
        )}

        {!isLoading && results && (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">
              {results.length} résultat{results.length > 1 ? "s" : ""} · source : Wikidata SPARQL
            </div>
            <div className="overflow-x-auto max-h-[calc(100vh-320px)] overflow-y-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 bg-background">
                  <tr>
                    {columns.map(col => (
                      <th key={col} className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground border-b border-border capitalize">
                        {col.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
                      </th>
                    ))}
                    <th className="px-3 py-2 border-b border-border"></th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => {
                    const filmQid = (row.film ?? "").replace("http://www.wikidata.org/entity/", "");
                    const filmTitle = row.filmLabel ?? row.film ?? "";
                    const directorLabel = row.directorLabel ?? "";
                    const directorQid = (row.director ?? "").replace("http://www.wikidata.org/entity/", "");
                    const year = row.year ? parseInt(row.year) : undefined;
                    const country = row.countryLabel ?? "";
                    const location = row.locationLabel ?? "";
                    return (
                      <tr key={i} className="hover:bg-muted/50 border-b border-border/50 group">
                        {columns.map(col => {
                          const val = row[col] ?? "";
                          const isUrl = val.startsWith("http");
                          const isQid = val.startsWith("http://www.wikidata.org/entity/");
                          const display = isQid ? val.replace("http://www.wikidata.org/entity/", "") : val;
                          return (
                            <td key={col} className="px-3 py-2 text-xs max-w-[200px] truncate">
                              {isUrl && !isQid ? (
                                <a href={val} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" />{display.slice(0, 40)}
                                </a>
                              ) : isQid ? (
                                <a href={`https://www.wikidata.org/wiki/${display}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {display}
                                </a>
                              ) : display}
                            </td>
                          );
                        })}
                        <td className="px-2 py-1">
                          {filmQid && filmTitle && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              onClick={() => onSaveSmellscape({ qid: filmQid, title: filmTitle, director: directorLabel, directorQid, year, country, location })}
                            >
                              <Plus className="w-3 h-3 mr-1" />Smellscape
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Onglet 3 : Formulaire d'enregistrement ───────────────────────────────────

function SaveSmellscapeTab({
  prefill,
  onSaved,
}: {
  prefill?: FilmResult | null;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    filmTitle: prefill?.title ?? "",
    filmWikidataQid: prefill?.qid ?? "",
    director: prefill?.director ?? "",
    directorQid: prefill?.directorQid ?? "",
    year: prefill?.year ? String(prefill.year) : "",
    country: prefill?.country ?? "",
    sceneDescription: "",
    timestampScene: "",
    smellDescription: "",
    smellType: "atmospheric" as const,
    olfactoryNotes: "",
    filmingLocation: prefill?.location ?? "",
    filmingLocationQid: prefill?.locationQid ?? "",
    culturalContext: "",
    heritageStatus: "active" as const,
    researchNotes: "",
    sourceType: "film" as const,
    tagsInput: "",
  });

  // Sync prefill
  React.useEffect(() => {
    if (prefill) {
      setForm(f => ({
        ...f,
        filmTitle: prefill.title ?? f.filmTitle,
        filmWikidataQid: prefill.qid ?? f.filmWikidataQid,
        director: prefill.director ?? f.director,
        directorQid: prefill.directorQid ?? f.directorQid,
        year: prefill.year ? String(prefill.year) : f.year,
        country: prefill.country ?? f.country,
        filmingLocation: prefill.location ?? f.filmingLocation,
        filmingLocationQid: prefill.locationQid ?? f.filmingLocationQid,
      }));
    }
  }, [prefill]);

  const saveMutation = trpc.cinemaSmellscapes.save.useMutation({
    onSuccess: () => {
      toast({ title: "Smellscape enregistré", description: `"${form.filmTitle}" ajouté à la bibliothèque.` });
      onSaved();
      setForm(f => ({
        ...f,
        sceneDescription: "",
        timestampScene: "",
        smellDescription: "",
        olfactoryNotes: "",
        culturalContext: "",
        researchNotes: "",
        tagsInput: "",
      }));
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.filmTitle || !form.sceneDescription || !form.smellDescription) {
      toast({ title: "Champs requis", description: "Titre, description de scène et description olfactive sont obligatoires.", variant: "destructive" });
      return;
    }
    saveMutation.mutate({
      filmTitle: form.filmTitle,
      filmWikidataQid: form.filmWikidataQid || undefined,
      director: form.director || undefined,
      directorQid: form.directorQid || undefined,
      year: form.year ? parseInt(form.year) : undefined,
      country: form.country || undefined,
      sceneDescription: form.sceneDescription,
      timestampScene: form.timestampScene || undefined,
      smellDescription: form.smellDescription,
      smellType: form.smellType,
      olfactoryNotes: form.olfactoryNotes || undefined,
      filmingLocation: form.filmingLocation || undefined,
      filmingLocationQid: form.filmingLocationQid || undefined,
      culturalContext: form.culturalContext || undefined,
      heritageStatus: form.heritageStatus,
      researchNotes: form.researchNotes || undefined,
      sourceType: form.sourceType,
      tags: form.tagsInput ? form.tagsInput.split(",").map(t => t.trim()).filter(Boolean) : undefined,
    });
  };

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Section Film */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <Film className="w-4 h-4" />Identification du film
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label className="text-xs">Titre du film *</Label>
            <Input value={form.filmTitle} onChange={e => set("filmTitle", e.target.value)} placeholder="ex: Nostalghia" required />
          </div>
          <div>
            <Label className="text-xs">QID Wikidata du film</Label>
            <Input value={form.filmWikidataQid} onChange={e => set("filmWikidataQid", e.target.value)} placeholder="ex: Q1234567" />
          </div>
          <div>
            <Label className="text-xs">Réalisateur</Label>
            <Input value={form.director} onChange={e => set("director", e.target.value)} placeholder="ex: Andreï Tarkovski" />
          </div>
          <div>
            <Label className="text-xs">Année</Label>
            <Input type="number" value={form.year} onChange={e => set("year", e.target.value)} placeholder="ex: 1983" min={1888} max={2100} />
          </div>
          <div>
            <Label className="text-xs">Pays de production</Label>
            <Input value={form.country} onChange={e => set("country", e.target.value)} placeholder="ex: URSS, Italie" />
          </div>
          <div>
            <Label className="text-xs">Lieu de tournage</Label>
            <Input value={form.filmingLocation} onChange={e => set("filmingLocation", e.target.value)} placeholder="ex: Toscane, Italie" />
          </div>
          <div>
            <Label className="text-xs">Type de source</Label>
            <Select value={form.sourceType} onValueChange={v => set("sourceType", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="film">Film de fiction</SelectItem>
                <SelectItem value="documentary">Documentaire</SelectItem>
                <SelectItem value="archive">Archive filmique</SelectItem>
                <SelectItem value="interview">Interview / making-of</SelectItem>
                <SelectItem value="academic">Source académique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Section Scène */}
      <div className="space-y-3 border-t border-border pt-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <Clapperboard className="w-4 h-4" />Description de la scène
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label className="text-xs">Description de la scène *</Label>
            <Textarea
              value={form.sceneDescription}
              onChange={e => set("sceneDescription", e.target.value)}
              placeholder="Décrivez la scène, le contexte narratif, les éléments visuels pertinents…"
              rows={3}
              required
            />
          </div>
          <div>
            <Label className="text-xs">Timecode</Label>
            <Input value={form.timestampScene} onChange={e => set("timestampScene", e.target.value)} placeholder="ex: 00:34:12" />
          </div>
        </div>
      </div>

      {/* Section Olfactive */}
      <div className="space-y-3 border-t border-border pt-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <Wind className="w-4 h-4" />Occurrence olfactive
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label className="text-xs">Description olfactive *</Label>
            <Textarea
              value={form.smellDescription}
              onChange={e => set("smellDescription", e.target.value)}
              placeholder="Décrivez l'occurrence olfactive : ce qui est senti, évoqué, suggéré…"
              rows={3}
              required
            />
          </div>
          <div>
            <Label className="text-xs">Type d'occurrence</Label>
            <Select value={form.smellType} onValueChange={v => set("smellType", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="explicit">Explicite — mentionné dans les dialogues</SelectItem>
                <SelectItem value="implied">Implicite — suggéré par le contexte</SelectItem>
                <SelectItem value="symbolic">Symbolique — charge métaphorique</SelectItem>
                <SelectItem value="atmospheric">Atmosphérique — ambiance olfactive générale</SelectItem>
                <SelectItem value="narrative">Narratif — rôle dans la dramaturgie</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Statut patrimonial</Label>
            <Select value={form.heritageStatus} onValueChange={v => set("heritageStatus", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif — odeur encore présente</SelectItem>
                <SelectItem value="endangered">Menacé — odeur en voie de disparition</SelectItem>
                <SelectItem value="lost">Disparu — odeur éteinte</SelectItem>
                <SelectItem value="reconstructed">Reconstruit — reconstitution possible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label className="text-xs">Notes olfactives (molécules, accords identifiés)</Label>
            <Input value={form.olfactoryNotes} onChange={e => set("olfactoryNotes", e.target.value)} placeholder="ex: linalool, géraniol, accord rose-bois" />
          </div>
        </div>
      </div>

      {/* Section Recherche */}
      <div className="space-y-3 border-t border-border pt-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <BookOpen className="w-4 h-4" />Contexte de recherche
        </h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Contexte culturel et symbolique</Label>
            <Textarea
              value={form.culturalContext}
              onChange={e => set("culturalContext", e.target.value)}
              placeholder="Signification culturelle, références anthropologiques, traditions olfactives liées…"
              rows={2}
            />
          </div>
          <div>
            <Label className="text-xs">Notes de recherche</Label>
            <Textarea
              value={form.researchNotes}
              onChange={e => set("researchNotes", e.target.value)}
              placeholder="Hypothèses, pistes d'analyse, sources bibliographiques, questions ouvertes…"
              rows={2}
            />
          </div>
          <div>
            <Label className="text-xs">Tags (séparés par des virgules)</Label>
            <Input
              value={form.tagsInput}
              onChange={e => set("tagsInput", e.target.value)}
              placeholder="ex: eau, mémoire, sacré, orient, nature"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={saveMutation.isPending}
        className="bg-amber-600 hover:bg-amber-700 text-white w-full"
      >
        {saveMutation.isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enregistrement…</>
        ) : (
          <><Save className="w-4 h-4 mr-2" />Enregistrer le smellscape</>
        )}
      </Button>
    </form>
  );
}

// ─── Onglet 4 : Bibliothèque ──────────────────────────────────────────────────

function LibraryTab() {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const [search, setSearch] = useState("");
  const [smellType, setSmellType] = useState<string>("all");
  const [heritageStatus, setHeritageStatus] = useState<string>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const { data, isLoading } = trpc.cinemaSmellscapes.list.useQuery({
    search: search || undefined,
    smellType: (smellType !== "all" ? smellType : undefined) as any,
    heritageStatus: (heritageStatus !== "all" ? heritageStatus : undefined) as any,
    limit: 50,
  });

  const { data: stats } = trpc.cinemaSmellscapes.stats.useQuery();

  const removeMutation = trpc.cinemaSmellscapes.remove.useMutation({
    onSuccess: () => {
      utils.cinemaSmellscapes.list.invalidate();
      utils.cinemaSmellscapes.stats.invalidate();
      toast({ title: "Smellscape supprimé" });
    },
  });

  const updateNotesMutation = trpc.cinemaSmellscapes.updateNotes.useMutation({
    onSuccess: () => {
      utils.cinemaSmellscapes.list.invalidate();
      setEditingId(null);
      toast({ title: "Notes mises à jour" });
    },
  });

  const items = (data?.items ?? []) as CinemaSmellscape[];

  return (
    <div className="space-y-4">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Smellscapes", value: stats.total, icon: <Wind className="w-4 h-4 text-amber-600" /> },
            { label: "Films uniques", value: stats.uniqueFilms, icon: <Film className="w-4 h-4 text-blue-600" /> },
            { label: "Réalisateurs", value: stats.uniqueDirectors, icon: <User className="w-4 h-4 text-purple-600" /> },
            { label: "Menacés / Disparus", value: (stats.endangered ?? 0) + (stats.lost ?? 0), icon: <AlertCircle className="w-4 h-4 text-red-600" /> },
          ].map(s => (
            <div key={s.label} className="border border-border rounded-lg p-3 flex items-center gap-3">
              {s.icon}
              <div>
                <div className="text-xl font-bold">{s.value ?? 0}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filtres */}
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Rechercher film, réalisateur, odeur…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
        <Select value={smellType} onValueChange={setSmellType}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Type d'occurrence" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="explicit">Explicite</SelectItem>
            <SelectItem value="implied">Implicite</SelectItem>
            <SelectItem value="symbolic">Symbolique</SelectItem>
            <SelectItem value="atmospheric">Atmosphérique</SelectItem>
            <SelectItem value="narrative">Narratif</SelectItem>
          </SelectContent>
        </Select>
        <Select value={heritageStatus} onValueChange={setHeritageStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Statut patrimonial" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="endangered">Menacé</SelectItem>
            <SelectItem value="lost">Disparu</SelectItem>
            <SelectItem value="reconstructed">Reconstruit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste */}
      {isLoading && (
        <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />Chargement…
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <Library className="w-12 h-12 opacity-20" />
          <p className="text-sm">Aucun smellscape enregistré</p>
          <p className="text-xs">Utilisez les onglets Recherche ou Requêtes pour identifier des occurrences olfactives</p>
        </div>
      )}

      <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
        {items.map(item => {
          const smellMeta = SMELL_TYPE_LABELS[item.smell_type] ?? SMELL_TYPE_LABELS.atmospheric;
          const heritageMeta = HERITAGE_STATUS_LABELS[item.heritage_status] ?? HERITAGE_STATUS_LABELS.active;
          return (
            <div key={item.id} className="border border-border rounded-lg p-4 space-y-3 hover:border-amber-400/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Film className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-semibold text-sm">{item.film_title}</span>
                    {item.year && <Badge variant="outline" className="text-xs">{item.year}</Badge>}
                    <Badge className={`text-xs border ${smellMeta.color}`}>
                      <span className="flex items-center gap-1">{smellMeta.icon}{smellMeta.label}</span>
                    </Badge>
                    <Badge className={`text-xs ${heritageMeta.color}`}>{heritageMeta.label}</Badge>
                  </div>
                  {item.director && (
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <User className="w-3 h-3" />{item.director}
                      {item.country && <><span className="mx-1">·</span><Globe className="w-3 h-3" />{item.country}</>}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2"
                    onClick={() => {
                      setEditingId(item.id);
                      setEditNotes(item.research_notes ?? "");
                    }}
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-destructive hover:text-destructive"
                    onClick={() => removeMutation.mutate(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground font-medium">Scène</span>
                  <p className="mt-0.5 line-clamp-2">{item.scene_description}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Occurrence olfactive</span>
                  <p className="mt-0.5 line-clamp-2">{item.smell_description}</p>
                </div>
              </div>

              {item.olfactory_notes && (
                <div className="text-xs">
                  <span className="text-muted-foreground font-medium">Notes olfactives : </span>
                  <span className="text-amber-700 dark:text-amber-400">{item.olfactory_notes}</span>
                </div>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}

              {item.film_wikidata_qid && (
                <a
                  href={`https://www.wikidata.org/wiki/${item.film_wikidata_qid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-amber-600 flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />{item.film_wikidata_qid}
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Dialog édition notes */}
      <Dialog open={editingId !== null} onOpenChange={o => !o && setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Éditer les notes de recherche</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editNotes}
            onChange={e => setEditNotes(e.target.value)}
            rows={6}
            placeholder="Notes de recherche, hypothèses, pistes bibliographiques…"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingId(null)}>Annuler</Button>
            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => editingId && updateNotesMutation.mutate({ id: editingId, researchNotes: editNotes })}
              disabled={updateNotesMutation.isPending}
            >
              {updateNotesMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function CinemaSmellscapes() {
  const [activeTab, setActiveTab] = useState("search");
  const [prefillFilm, setPrefillFilm] = useState<FilmResult | null>(null);

  const handleSaveSmellscape = useCallback((film: FilmResult) => {
    setPrefillFilm(film);
    setActiveTab("save");
  }, []);

  const { data: stats } = trpc.cinemaSmellscapes.stats.useQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-amber-950/20 via-background to-background">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
              <Clapperboard className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Smellscapes Cinématographiques</h1>
              <p className="text-sm text-muted-foreground">
                Occurrences olfactives dans le patrimoine du cinéma mondial
              </p>
            </div>
            {stats && Number(stats.total) > 0 && (
              <div className="ml-auto flex gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Wind className="w-4 h-4 text-amber-600" />
                  <strong className="text-foreground">{stats.total}</strong> smellscapes
                </span>
                <span className="flex items-center gap-1">
                  <Film className="w-4 h-4 text-blue-600" />
                  <strong className="text-foreground">{stats.uniqueFilms}</strong> films
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground max-w-3xl">
            Identifiez et documentez les occurrences olfactives dans les films du patrimoine cinématographique mondial.
            Croisez les données Wikidata (films, réalisateurs, lieux de tournage) avec la base moléculaire PERFUMUM
            pour construire une archive des smellscapes filmiques.
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />Recherche SPARQL
            </TabsTrigger>
            <TabsTrigger value="prebuilt" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />Requêtes thématiques
            </TabsTrigger>
            <TabsTrigger value="save" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />Enregistrer
              {prefillFilm && (
                <Badge className="ml-1 bg-amber-600 text-white text-xs px-1.5 py-0">1</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Library className="w-4 h-4" />Bibliothèque
              {stats && Number(stats.total) > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">{stats.total}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-0">
            <SearchTab onSaveSmellscape={handleSaveSmellscape} />
          </TabsContent>

          <TabsContent value="prebuilt" className="mt-0">
            <PrebuiltQueriesTab onSaveSmellscape={handleSaveSmellscape} />
          </TabsContent>

          <TabsContent value="save" className="mt-0">
            <SaveSmellscapeTab
              prefill={prefillFilm}
              onSaved={() => {
                setPrefillFilm(null);
                setActiveTab("library");
              }}
            />
          </TabsContent>

          <TabsContent value="library" className="mt-0">
            <LibraryTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
