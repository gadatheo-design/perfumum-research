import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Search,
  Beaker,
  Droplets,
  FileText,
  Clock,
  Loader2,
  Filter,
  X,
} from "lucide-react";

interface SearchResult {
  id: number;
  type: "molecule" | "recette" | "accord" | "page";
  title: string;
  subtitle?: string;
  path: string;
  icon: React.ReactNode;
  gamme?: string;
  famille?: string;
}

const STORAGE_KEY = "perfumum_search_history";
const MAX_HISTORY = 5;

const GAMMES = ["Volcanique", "Glaciaire", "Bio-Lab", "Pétrichor"];
const FAMILLES = ["Terpènes", "Aldéhydes", "Cétones", "Esters", "Alcools", "Phénols"];

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

export function GlobalSearchAdvanced() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  // Filtres avancés
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGammes, setSelectedGammes] = useState<string[]>([]);
  const [selectedFamilles, setSelectedFamilles] = useState<string[]>([]);
  
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
      setShowFilters(false);
      setSelectedTypes([]);
      setSelectedGammes([]);
      setSelectedFamilles([]);
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
    { enabled: debouncedQuery.length > 0 || selectedTypes.includes("molecule") || selectedGammes.length > 0 || selectedFamilles.length > 0 }
  );

  // Recherche dans les recettes
  const { data: recettes, isLoading: loadingRecettes } = trpc.recettes.list.useQuery(
    {},
    { enabled: debouncedQuery.length > 0 || selectedTypes.includes("recette") || selectedGammes.length > 0 }
  );
  
  // Recherche dans les accords
  const { data: accords, isLoading: loadingAccords } = trpc.accords.list.useQuery(
    undefined,
    { enabled: debouncedQuery.length > 0 || selectedTypes.includes("accord") }
  );

  // Filtrer les résultats selon la query et les filtres
  const results: SearchResult[] = [];

  if (query.length > 0 || selectedTypes.length > 0 || selectedGammes.length > 0 || selectedFamilles.length > 0) {
    // Molécules
    if (selectedTypes.length === 0 || selectedTypes.includes("molecule")) {
      const filteredMolecules = molecules?.filter((m) => {
        const matchQuery = query.length === 0 || 
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.family?.toLowerCase().includes(query.toLowerCase());
        
        const matchGamme = selectedGammes.length === 0 || 
          (m.gamme && selectedGammes.includes(m.gamme));
        
        const matchFamille = selectedFamilles.length === 0 || 
          (m.family && selectedFamilles.some(f => m.family?.toLowerCase().includes(f.toLowerCase())));
        
        return matchQuery && matchGamme && matchFamille;
      }) || [];

      filteredMolecules.slice(0, 10).forEach((m) => {
        results.push({
          id: m.id,
          type: "molecule",
          title: m.name,
          subtitle: m.family || undefined,
          path: `/molecule/${m.id}`,
          icon: <Beaker className="h-4 w-4" />,
          gamme: m.gamme || undefined,
          famille: m.family || undefined,
        });
      });
    }

    // Recettes
    if (selectedTypes.length === 0 || selectedTypes.includes("recette")) {
      const filteredRecettes = recettes?.filter((r) => {
        const matchQuery = query.length === 0 ||
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.description?.toLowerCase().includes(query.toLowerCase());
        
        const matchGamme = selectedGammes.length === 0 || 
          (r.gamme && selectedGammes.includes(r.gamme));
        
        return matchQuery && matchGamme;
      }) || [];

      filteredRecettes.slice(0, 10).forEach((r) => {
        results.push({
          id: r.id,
          type: "recette",
          title: r.name,
          subtitle: r.category || undefined,
          path: `/recette/${r.id}`,
          icon: <Droplets className="h-4 w-4" />,
          gamme: r.gamme || undefined,
        });
      });
    }

    // Accords
    if (selectedTypes.length === 0 || selectedTypes.includes("accord")) {
      const filteredAccords = accords?.filter((a) => {
        const matchQuery = query.length === 0 ||
          a.nom.toLowerCase().includes(query.toLowerCase()) ||
          a.description?.toLowerCase().includes(query.toLowerCase());
        
        return matchQuery;
      }) || [];

      filteredAccords.slice(0, 10).forEach((a) => {
        results.push({
          id: a.id,
          type: "accord",
          title: a.nom,
          subtitle: a.description || undefined,
          path: `/accord/${a.id}`,
          icon: <Droplets className="h-4 w-4" />,
        });
      });
    }
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

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleGamme = (gamme: string) => {
    setSelectedGammes(prev => 
      prev.includes(gamme) ? prev.filter(g => g !== gamme) : [...prev, gamme]
    );
  };

  const toggleFamille = (famille: string) => {
    setSelectedFamilles(prev => 
      prev.includes(famille) ? prev.filter(f => f !== famille) : [...prev, famille]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedGammes([]);
    setSelectedFamilles([]);
  };

  const hasActiveFilters = selectedTypes.length > 0 || selectedGammes.length > 0 || selectedFamilles.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl p-0 gap-0">
        {/* Header avec input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Rechercher molécules, recettes, accords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={hasActiveFilters ? "text-primary" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="p-4 border-b bg-muted/30 space-y-3">
            {/* Types */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2">Type</div>
              <div className="flex flex-wrap gap-2">
                {["molecule", "recette", "accord"].map((type) => (
                  <Badge
                    key={type}
                    variant={selectedTypes.includes(type) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleType(type)}
                  >
                    {type === "molecule" ? "Molécules" : type === "recette" ? "Recettes" : "Accords"}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Gammes */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2">Gamme Olfactive</div>
              <div className="flex flex-wrap gap-2">
                {GAMMES.map((gamme) => (
                  <Badge
                    key={gamme}
                    variant={selectedGammes.includes(gamme) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleGamme(gamme)}
                  >
                    {gamme}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Familles */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2">Famille Chimique</div>
              <div className="flex flex-wrap gap-2">
                {FAMILLES.map((famille) => (
                  <Badge
                    key={famille}
                    variant={selectedFamilles.includes(famille) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFamille(famille)}
                  >
                    {famille}
                  </Badge>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Effacer les filtres
              </Button>
            )}
          </div>
        )}

        {/* Résultats */}
        <ScrollArea className="max-h-[500px]">
          <div className="p-2">
            {results.length === 0 && (query.length > 0 || hasActiveFilters) ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucun résultat trouvé</p>
                {hasActiveFilters && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={clearFilters}
                    className="mt-2"
                  >
                    Effacer les filtres
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((result, index) => (
                  <Link key={`${result.type}-${result.id}`} href={result.path}>
                    <button
                      onClick={() => handleSelect(result)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                        index === selectedIndex
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex-shrink-0">{result.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          <HighlightText text={result.title} query={query} />
                        </div>
                        {result.subtitle && (
                          <div className="text-xs text-muted-foreground truncate">
                            {result.subtitle}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {result.gamme && (
                          <Badge variant="secondary" className="text-xs">
                            {result.gamme}
                          </Badge>
                        )}
                      </div>
                    </button>
                  </Link>
                ))}
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-4 pt-4 border-t text-center text-xs text-muted-foreground">
                {results.length} résultat{results.length > 1 ? "s" : ""} trouvé{results.length > 1 ? "s" : ""}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
