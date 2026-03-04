/**
 * GlobalSearchAdvanced — Recherche unifiée PERFUMUM
 * Utilise l'endpoint search.global (côté serveur) pour une recherche
 * performante sur plantes, molécules, recettes, accords, glossaire et civilisations.
 * S'ouvre via l'événement custom "open-global-search" ou le raccourci Cmd/Ctrl+K.
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Search,
  Beaker,
  Droplets,
  Leaf,
  Sparkles,
  BookOpen,
  Globe,
  Filter,
  X,
  Loader2,
  Clock,
} from "lucide-react";

type ResultType = "molecule" | "plante" | "recette" | "accord" | "glossaire" | "civilisation" | "finalRecipe";

interface SearchResult {
  id: number;
  type: ResultType;
  title: string;
  subtitle?: string;
  path: string;
  icon: React.ReactNode;
}

const STORAGE_KEY = "perfumum_search_history_v3";
const MAX_HISTORY = 6;

const TYPE_LABELS: Record<ResultType, string> = {
  molecule: "Molécule",
  plante: "Plante",
  recette: "Recette",
  accord: "Accord",
  glossaire: "Glossaire",
  civilisation: "Civilisation",
  finalRecipe: "Recette finale",
};

const TYPE_ICONS: Record<ResultType, React.ReactNode> = {
  molecule: <Beaker className="h-3.5 w-3.5" />,
  plante: <Leaf className="h-3.5 w-3.5" />,
  recette: <Droplets className="h-3.5 w-3.5" />,
  accord: <Sparkles className="h-3.5 w-3.5" />,
  glossaire: <BookOpen className="h-3.5 w-3.5" />,
  civilisation: <Globe className="h-3.5 w-3.5" />,
  finalRecipe: <Droplets className="h-3.5 w-3.5" />,
};

const TYPE_COLORS: Record<ResultType, string> = {
  molecule: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  plante: "bg-green-500/10 text-green-600 dark:text-green-400",
  recette: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  accord: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  glossaire: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  civilisation: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  finalRecipe: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

const TYPE_PATHS: Record<string, (id: number) => string> = {
  molecule: (id) => `/molecule/${id}`,
  plant: (id) => `/plant/${id}`,
  recette: (id) => `/recette/${id}`,
  accord: (id) => `/accord/${id}`,
  glossary: (id) => `/glossaire#term-${id}`,
  civilisation: (id) => `/civilisation/${id}`,
  finalRecipe: (id) => `/recette-finale/${id}`,
};

// Normaliser le type retourné par l'API
function normalizeType(apiType: string): ResultType {
  const map: Record<string, ResultType> = {
    molecule: "molecule",
    plant: "plante",
    recette: "recette",
    accord: "accord",
    glossary: "glossaire",
    civilisation: "civilisation",
    finalRecipe: "finalRecipe",
  };
  return map[apiType] || "molecule";
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/20 text-primary rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function GlobalSearchAdvanced() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<ResultType[]>([]);

  // Debounce 200ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => { setSelectedIndex(-1); }, [debouncedQuery]);

  // Historique localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setSearchHistory(JSON.parse(stored)); } catch {}
    }
  }, []);

  // Écouter l'événement d'ouverture
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
      setIsOpen(false);
      setQuery("");
      setShowFilters(false);
      setSelectedTypes([]);
    };
    window.addEventListener("open-global-search", handleOpen);
    window.addEventListener("close-overlays", handleClose);
    return () => {
      window.removeEventListener("open-global-search", handleOpen);
      window.removeEventListener("close-overlays", handleClose);
    };
  }, []);

  // Focus à l'ouverture
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Recherche côté serveur
  const { data: searchData, isLoading } = trpc.search.global.useQuery(
    { query: debouncedQuery, limit: 30 },
    { enabled: debouncedQuery.length >= 2 }
  );

  // Construire les résultats à partir des données API
  const results: SearchResult[] = useMemo(() => {
    if (!searchData || debouncedQuery.length < 2) return [];

    const allItems: SearchResult[] = [];

    const addItems = (items: any[], apiType: string) => {
      if (!items) return;
      const type = normalizeType(apiType);
      const pathFn = TYPE_PATHS[apiType];
      if (!pathFn) return;

      items.forEach((item: any) => {
        allItems.push({
          id: item.id,
          type,
          title: item.name,
          subtitle: item.description
            ? item.description.substring(0, 80).replace(/\n/g, " ") + (item.description.length > 80 ? "…" : "")
            : undefined,
          path: pathFn(item.id),
          icon: TYPE_ICONS[type],
        });
      });
    };

    addItems(searchData.molecules || [], "molecule");
    addItems(searchData.plants || [], "plant");
    addItems(searchData.recettes || [], "recette");
    addItems(searchData.accords || [], "accord");
    addItems(searchData.glossary || [], "glossary");
    addItems(searchData.civilisations || [], "civilisation");
    addItems(searchData.finalRecipes || [], "finalRecipe");

    // Filtrer par type si des filtres sont actifs
    if (selectedTypes.length > 0) {
      return allItems.filter((r) => selectedTypes.includes(r.type));
    }

    return allItems;
  }, [searchData, debouncedQuery, selectedTypes]);

  // Navigation clavier
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (results.length === 0) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            handleSelect(results[selectedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setQuery("");
          break;
      }
    },
    [results, selectedIndex]
  );

  const handleSelect = (result: SearchResult) => {
    const newHistory = [
      result.title,
      ...searchHistory.filter((h) => h !== result.title),
    ].slice(0, MAX_HISTORY);
    setSearchHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    setLocation(result.path);
    setIsOpen(false);
    setQuery("");
  };

  const toggleType = (type: ResultType) =>
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  // Grouper les résultats par type
  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    for (const r of results) {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    }
    return groups;
  }, [results]);

  const hasActiveFilters = selectedTypes.length > 0;
  const showEmpty = debouncedQuery.length >= 2 && !isLoading && results.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Recherche globale PERFUMUM</DialogTitle>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <Input
            ref={inputRef}
            placeholder="Plantes, molécules, recettes, accords, glossaire…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
          />
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground flex-shrink-0" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-shrink-0 ${hasActiveFilters ? "text-primary" : ""}`}
            aria-label="Filtres"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filtres */}
        {showFilters && (
          <div className="px-4 py-3 border-b bg-muted/30">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              Filtrer par type
            </div>
            <div className="flex flex-wrap gap-2">
              {(["molecule", "plante", "recette", "accord", "glossaire", "civilisation"] as ResultType[]).map(
                (type) => (
                  <Badge
                    key={type}
                    variant={selectedTypes.includes(type) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleType(type)}
                  >
                    {TYPE_LABELS[type]}
                  </Badge>
                )
              )}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTypes([])}
                  className="h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Effacer
                </Button>
              )}
            </div>
          </div>
        )}

        <ScrollArea className="max-h-[480px]">
          <div className="p-2">
            {/* Historique (quand pas de query) */}
            {debouncedQuery.length < 2 && searchHistory.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Recherches récentes
                </div>
                {searchHistory.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(h)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-left text-sm"
                  >
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {h}
                  </button>
                ))}
              </div>
            )}

            {/* Hint de saisie */}
            {debouncedQuery.length === 1 && (
              <div className="text-center py-6 text-muted-foreground text-sm">
                Continuez à saisir…
              </div>
            )}

            {/* Aucun résultat */}
            {showEmpty && (
              <div className="text-center py-10 text-muted-foreground text-sm">
                Aucun résultat pour «&nbsp;{query}&nbsp;»
              </div>
            )}

            {/* Résultats groupés */}
            {results.length > 0 && (
              <div className="space-y-1">
                {Object.entries(grouped).map(([type, items]) => (
                  <div key={type}>
                    <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {TYPE_LABELS[type as ResultType]} ({items.length})
                    </div>
                    {items.map((result) => {
                      const globalIndex = results.indexOf(result);
                      return (
                        <Link key={`${result.type}-${result.id}`} href={result.path}>
                          <button
                            onClick={() => handleSelect(result)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                              globalIndex === selectedIndex
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted"
                            }`}
                          >
                            <div
                              className={`flex-shrink-0 p-1.5 rounded-md ${
                                TYPE_COLORS[result.type as ResultType]
                              }`}
                            >
                              {result.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate text-sm">
                                <HighlightText text={result.title} query={query} />
                              </div>
                              {result.subtitle && (
                                <div className="text-xs text-muted-foreground truncate">
                                  {result.subtitle}
                                </div>
                              )}
                            </div>
                          </button>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-3 pt-3 border-t text-center text-xs text-muted-foreground">
                {results.length} résultat{results.length > 1 ? "s" : ""} — ↑↓ naviguer · Entrée ouvrir · Échap fermer
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
