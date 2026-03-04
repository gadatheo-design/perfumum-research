// @ts-nocheck
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import {
  Search,
  Beaker,
  Droplets,
  Users,
  FileText,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface SearchResult {
  id: number;
  type: "molecule" | "recette" | "civilisation" | "page";
  title: string;
  subtitle?: string;
  path: string;
  icon: React.ReactNode;
}

const STORAGE_KEY = "perfumum_search_history";
const MAX_HISTORY = 5;

// Fonction pour mettre en surbrillance le texte recherché
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-primary/20 text-primary rounded px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  // Debounce la recherche pour éviter trop de requêtes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);
  
  // Reset l'index sélectionné quand la query change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Charger l'historique depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSearchHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse search history", e);
      }
    }
  }, []);

  // Écouter l'événement custom pour ouvrir la recherche
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
      setQuery("");
    };

    window.addEventListener("open-global-search", handleOpen);
    window.addEventListener("close-overlays", handleClose);

    return () => {
      window.removeEventListener("open-global-search", handleOpen);
      window.removeEventListener("close-overlays", handleClose);
    };
  }, []);

  // Focus input quand le dialog s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Recherche dans les molécules
  const { data: molecules, isLoading: loadingMolecules } = trpc.molecules.list.useQuery(
    undefined,
    { enabled: debouncedQuery.length > 0 }
  );

  // Recherche dans les recettes (toutes les catégories)
  const { data: recettes, isLoading: loadingRecettes } = trpc.recettes.list.useQuery(
    {},
    { enabled: debouncedQuery.length > 0 }
  );
  
  // Recherche dans les accords
  const { data: accords, isLoading: loadingAccords } = trpc.accords.list.useQuery(
    undefined,
    { enabled: debouncedQuery.length > 0 }
  );

  // Filtrer les résultats selon la query
  const results: SearchResult[] = [];

  if (query.length > 0) {
    // Molécules
    const filteredMolecules = molecules?.filter((m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.family?.toLowerCase().includes(query.toLowerCase())
    ) || [];

    filteredMolecules.slice(0, 5).forEach((m) => {
      results.push({
        id: m.id,
        type: "molecule",
        title: m.name,
        subtitle: m.family || undefined,
        path: `/molecule/${m.id}`,
        icon: <Beaker className="h-4 w-4" />,
      });
    });

    // Recettes
    const filteredRecettes = recettes?.filter((r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.description?.toLowerCase().includes(query.toLowerCase())
    ) || [];

    filteredRecettes.slice(0, 5).forEach((r) => {
      results.push({
        id: r.id,
        type: "recette",
        title: r.name,
        subtitle: r.category || undefined,
        path: `/recette/${r.id}`,
        icon: <Droplets className="h-4 w-4" />,
      });
    });

    // Pages statiques
    const staticPages = [
      { title: "Graphe Molécules-Recettes", path: "/graphe-molecules-recettes", keywords: ["graphe", "visualisation", "d3"] },
      { title: "Matrice Synergies", path: "/matrice-synergies", keywords: ["synergie", "combinaison", "matrice"] },
      { title: "Comparaison Terpènes", path: "/compare-terpenes", keywords: ["comparer", "comparaison", "terpène"] },
      { title: "Comparaison Radar", path: "/compare-radar", keywords: ["radar", "profil", "olfactif"] },
      { title: "Galerie Botaniques", path: "/galerie-botaniques", keywords: ["galerie", "image", "botanique"] },
      { title: "Terpènes", path: "/terpenes", keywords: ["terpène", "molécule"] },
      { title: "Résines CBD", path: "/resines-cbd", keywords: ["résine", "cbd", "recette"] },
    ];

    staticPages.forEach((page) => {
      const matchTitle = page.title.toLowerCase().includes(query.toLowerCase());
      const matchKeywords = page.keywords.some((k) => k.includes(query.toLowerCase()));

      if (matchTitle || matchKeywords) {
        results.push({
          id: Math.random(),
          type: "page",
          title: page.title,
          path: page.path,
          icon: <FileText className="h-4 w-4" />,
        });
      }
    });
  }

  const isLoading = loadingMolecules || loadingRecettes || loadingAccords;
  
  // Liste plate de tous les résultats pour la navigation clavier
  const allResults = useMemo(() => results, [results]);
  
  // Gestion de la navigation clavier
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (allResults.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < allResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : allResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < allResults.length) {
          handleSelect(allResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setQuery("");
        break;
    }
  }, [allResults, selectedIndex]);

  const handleSelect = (result: SearchResult) => {
    // Ajouter à l'historique
    const newHistory = [result.title, ...searchHistory.filter((h) => h !== result.title)].slice(0, MAX_HISTORY);
    setSearchHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));

    // Naviguer
    setLocation(result.path);
    setIsOpen(false);
    setQuery("");
  };

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Grouper les résultats par type
  const groupedResults = {
    molecules: results.filter((r) => r.type === "molecule"),
    recettes: results.filter((r) => r.type === "recette"),
    pages: results.filter((r) => r.type === "page"),
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        {/* Header avec input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Rechercher molécules, recettes, pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">ESC</span>
          </kbd>
        </div>

        {/* Résultats */}
        <ScrollArea className="max-h-[400px]">
          <div className="p-2">
            {query.length === 0 ? (
              // Historique et suggestions
              <div className="space-y-4">
                {searchHistory.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-2 py-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Récents
                      </div>
                      <button
                        onClick={clearHistory}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Effacer
                      </button>
                    </div>
                    <div className="space-y-1">
                      {searchHistory.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleHistoryClick(item)}
                          className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-muted transition-colors text-left"
                        >
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                    Suggestions
                  </div>
                  <div className="space-y-1">
                    <Link href="/graphe-molecules-recettes">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-muted transition-colors text-left"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Graphe Molécules-Recettes</span>
                      </button>
                    </Link>
                    <Link href="/matrice-synergies">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-muted transition-colors text-left"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Matrice Synergies</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : results.length === 0 && !isLoading ? (
              // Aucun résultat
              <div className="py-12 text-center text-sm text-muted-foreground">
                Aucun résultat pour "{query}"
              </div>
            ) : (
              // Résultats groupés
              <div className="space-y-4">
                {groupedResults.molecules.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <Beaker className="h-3 w-3" />
                      Molécules ({groupedResults.molecules.length})
                    </div>
                    <div className="space-y-1">
                      {groupedResults.molecules.map((result, idx) => {
                        const globalIndex = idx;
                        return (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleSelect(result)}
                          className={`w-full flex items-center justify-between gap-3 px-2 py-2 rounded transition-colors text-left group ${selectedIndex === globalIndex ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-muted'}`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {result.icon}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                              <HighlightText text={result.title} query={query} />
                                            </div>
                              {result.subtitle && (
                                <div className="text-xs text-muted-foreground truncate">{result.subtitle}</div>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      );
                      })}
                    </div>
                  </div>
                )}

                {groupedResults.recettes.length > 0 && (
                  <div>
                    <Separator className="my-2" />
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <Droplets className="h-3 w-3" />
                      Recettes ({groupedResults.recettes.length})
                    </div>
                    <div className="space-y-1">
                      {groupedResults.recettes.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleSelect(result)}
                          className="w-full flex items-center justify-between gap-3 px-2 py-2 rounded hover:bg-muted transition-colors text-left group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {result.icon}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                              <HighlightText text={result.title} query={query} />
                                            </div>
                              {result.subtitle && (
                                <Badge variant="secondary" className="text-xs">{result.subtitle}</Badge>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {groupedResults.pages.length > 0 && (
                  <div>
                    <Separator className="my-2" />
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      Pages ({groupedResults.pages.length})
                    </div>
                    <div className="space-y-1">
                      {groupedResults.pages.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleSelect(result)}
                          className="w-full flex items-center justify-between gap-3 px-2 py-2 rounded hover:bg-muted transition-colors text-left group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {result.icon}
                            <span className="text-sm font-medium truncate">{result.title}</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border bg-background">↑↓</kbd>
              <span>Naviguer</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border bg-background">↵</kbd>
              <span>Sélectionner</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border bg-background">ESC</kbd>
            <span>Fermer</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
