import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  X, 
  FlaskConical, 
  Beaker, 
  BookOpen,
  Leaf,
  History,
  TrendingUp,
  ArrowRight,
  Command,
  Sparkles,
  Clock,
  Star,
  Hash,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface SearchResult {
  id: number | string;
  type: "molecule" | "recette" | "glossaire" | "plante" | "accord";
  name: string;
  description?: string;
  family?: string;
  category?: string;
  matchScore?: number;
  highlights?: string[];
}

interface SearchSuggestion {
  text: string;
  type: "recent" | "popular" | "autocomplete";
  count?: number;
}

interface SmartSearchProps {
  placeholder?: string;
  className?: string;
  variant?: "default" | "hero" | "compact";
  autoFocus?: boolean;
  onResultSelect?: (result: SearchResult) => void;
  defaultFilters?: string[];
}

// Icônes par type
const TYPE_ICONS: Record<string, React.ReactNode> = {
  molecule: <FlaskConical className="h-4 w-4" />,
  recette: <Beaker className="h-4 w-4" />,
  glossaire: <BookOpen className="h-4 w-4" />,
  plante: <Leaf className="h-4 w-4" />,
  accord: <Hash className="h-4 w-4" />,
};

// Couleurs par type
const TYPE_COLORS: Record<string, string> = {
  molecule: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  recette: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  glossaire: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  plante: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  accord: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

// Labels par type
const TYPE_LABELS: Record<string, string> = {
  molecule: "Molécule",
  recette: "Recette",
  glossaire: "Glossaire",
  plante: "Plante",
  accord: "Accord",
};

// Hook personnalisé pour le debounce
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Composant de résultat de recherche
function SearchResultItem({ 
  result, 
  isSelected,
  onClick 
}: { 
  result: SearchResult; 
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer transition-colors rounded-lg",
        isSelected ? "bg-primary/10" : "hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <div className={cn("p-2 rounded-lg", TYPE_COLORS[result.type])}>
        {TYPE_ICONS[result.type]}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{result.name}</span>
          {result.matchScore && result.matchScore > 80 && (
            <Sparkles className="h-3 w-3 text-amber-500" />
          )}
        </div>
        {result.description && (
          <p className="text-sm text-muted-foreground truncate">
            {result.description}
          </p>
        )}
        {result.highlights && result.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {result.highlights.slice(0, 3).map((highlight, i) => (
              <span key={i} className="text-xs bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">
                {highlight}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        {result.family && (
          <Badge variant="outline" className="text-xs hidden sm:flex">
            {result.family}
          </Badge>
        )}
        <Badge variant="secondary" className="text-xs">
          {TYPE_LABELS[result.type]}
        </Badge>
      </div>
    </motion.div>
  );
}

// Composant de suggestion
function SuggestionItem({ 
  suggestion, 
  isSelected,
  onClick 
}: { 
  suggestion: SearchSuggestion; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon = suggestion.type === "recent" ? History 
    : suggestion.type === "popular" ? TrendingUp 
    : Search;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-center gap-3 p-2 cursor-pointer transition-colors rounded-lg",
        isSelected ? "bg-primary/10" : "hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="flex-1">{suggestion.text}</span>
      {suggestion.count && (
        <span className="text-xs text-muted-foreground">
          {suggestion.count} résultats
        </span>
      )}
    </motion.div>
  );
}

// Composant principal
export function SmartSearch({
  placeholder = "Rechercher molécules, recettes, plantes...",
  className,
  variant = "default",
  autoFocus = false,
  onResultSelect,
  defaultFilters = [],
}: SmartSearchProps) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFilters, setActiveFilters] = useState<string[]>(defaultFilters);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounceValue(query, 300);

  // Requête de recherche globale
  const { data: searchResults, isLoading } = trpc.search.global.useQuery(
    { query: debouncedQuery, limit: 10 },
    { 
      enabled: debouncedQuery.length >= 2,
      staleTime: 30000,
    }
  );

  // Suggestions populaires (statiques pour l'instant)
  const suggestions: SearchSuggestion[] = useMemo(() => {
    if (query.length > 0) return [];
    return [
      { text: "Limonène", type: "popular", count: 45 },
      { text: "Linalol", type: "popular", count: 38 },
      { text: "Pinène", type: "popular", count: 32 },
      { text: "Myrcène", type: "popular", count: 28 },
      { text: "Caryophyllène", type: "popular", count: 25 },
    ];
  }, [query]);

  // Transformer les résultats de recherche
  const results: SearchResult[] = useMemo(() => {
    if (!searchResults) return [];
    
    const allResults: SearchResult[] = [];
    
    // Molécules
    if (searchResults.molecules) {
      searchResults.molecules.forEach((mol: any) => {
        allResults.push({
          id: mol.id,
          type: "molecule",
          name: mol.name,
          description: mol.description?.substring(0, 100),
          family: mol.family,
        });
      });
    }
    
    // Recettes
    if (searchResults.recettes) {
      searchResults.recettes.forEach((rec: any) => {
        allResults.push({
          id: rec.id,
          type: "recette",
          name: rec.name,
          description: rec.description?.substring(0, 100),
          category: rec.category,
        });
      });
    }
    
    // Glossaire
    if (searchResults.glossary) {
      searchResults.glossary.forEach((term: any) => {
        allResults.push({
          id: term.id,
          type: "glossaire",
          name: term.term,
          description: term.definition?.substring(0, 100),
        });
      });
    }
    
    // Plantes
    if (searchResults.plants) {
      searchResults.plants.forEach((plant: any) => {
        allResults.push({
          id: plant.id,
          type: "plante",
          name: plant.name,
          description: plant.description?.substring(0, 100),
          family: plant.family,
        });
      });
    }

    // Filtrer par type si des filtres sont actifs
    if (activeFilters.length > 0) {
      return allResults.filter(r => activeFilters.includes(r.type));
    }
    
    return allResults;
  }, [searchResults, activeFilters]);

  // Nombre total d'éléments navigables
  const totalItems = query.length >= 2 ? results.length : suggestions.length;

  // Gestion du clavier
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, totalItems - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (query.length >= 2 && results[selectedIndex]) {
          handleResultSelect(results[selectedIndex]);
        } else if (suggestions[selectedIndex]) {
          setQuery(suggestions[selectedIndex].text);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }, [query, results, suggestions, selectedIndex, totalItems]);

  // Sélection d'un résultat
  const handleResultSelect = useCallback((result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    } else {
      // Navigation par défaut
      const routes: Record<string, string> = {
        molecule: `/molecules/${result.id}`,
        recette: `/recettes/${result.id}`,
        glossaire: `/glossaire#${result.id}`,
        plante: `/plantes/${result.id}`,
        accord: `/accords/${result.id}`,
      };
      navigate(routes[result.type] || "/");
    }
    setIsOpen(false);
    setQuery("");
  }, [navigate, onResultSelect]);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset selected index quand les résultats changent
  useEffect(() => {
    setSelectedIndex(0);
  }, [results, suggestions]);

  // Raccourci clavier global (Cmd/Ctrl + K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Filtres disponibles
  const filterOptions = [
    { value: "molecule", label: "Molécules", icon: FlaskConical },
    { value: "recette", label: "Recettes", icon: Beaker },
    { value: "glossaire", label: "Glossaire", icon: BookOpen },
    { value: "plante", label: "Plantes", icon: Leaf },
  ];

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  // Styles par variant
  const inputStyles = {
    default: "h-10",
    hero: "h-14 text-lg",
    compact: "h-8 text-sm",
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Input de recherche */}
      <div className="relative">
        <Search className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
          variant === "hero" ? "h-5 w-5" : "h-4 w-4"
        )} />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "pl-10 pr-20",
            inputStyles[variant]
          )}
        />
        
        {/* Indicateur de raccourci clavier */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>
      </div>

      {/* Dropdown de résultats */}
      <AnimatePresence>
        {isOpen && (query.length >= 2 || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-background border rounded-lg shadow-lg overflow-hidden"
          >
            {/* Filtres */}
            {query.length >= 2 && (
              <div className="p-2 border-b flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  Filtrer:
                </span>
                {filterOptions.map(filter => (
                  <Button
                    key={filter.value}
                    variant={activeFilters.includes(filter.value) ? "default" : "outline"}
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => toggleFilter(filter.value)}
                  >
                    <filter.icon className="h-3 w-3 mr-1" />
                    {filter.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Contenu */}
            <div className="max-h-[400px] overflow-y-auto p-2">
              {isLoading ? (
                <div className="space-y-2 p-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : query.length >= 2 ? (
                results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((result, index) => (
                      <SearchResultItem
                        key={`${result.type}-${result.id}`}
                        result={result}
                        isSelected={index === selectedIndex}
                        onClick={() => handleResultSelect(result)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>Aucun résultat pour "{query}"</p>
                    <p className="text-sm mt-1">Essayez avec d'autres termes</p>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  {/* Suggestions populaires */}
                  <div>
                    <div className="flex items-center gap-2 px-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Recherches populaires</span>
                    </div>
                    <div className="space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <SuggestionItem
                          key={suggestion.text}
                          suggestion={suggestion}
                          isSelected={index === selectedIndex}
                          onClick={() => setQuery(suggestion.text)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Raccourcis */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 px-2 mb-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Accès rapide</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 px-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => navigate("/molecules")}
                      >
                        <FlaskConical className="h-4 w-4 mr-2" />
                        Molécules
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => navigate("/recettes")}
                      >
                        <Beaker className="h-4 w-4 mr-2" />
                        Recettes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => navigate("/plantes")}
                      >
                        <Leaf className="h-4 w-4 mr-2" />
                        Plantes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => navigate("/glossaire")}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Glossaire
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer avec navigation clavier */}
            <div className="border-t p-2 flex items-center justify-between text-xs text-muted-foreground bg-muted/30">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-background border rounded text-[10px]">↑</kbd>
                  <kbd className="px-1 py-0.5 bg-background border rounded text-[10px]">↓</kbd>
                  naviguer
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-background border rounded text-[10px]">↵</kbd>
                  sélectionner
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-background border rounded text-[10px]">esc</kbd>
                  fermer
                </span>
              </div>
              {query.length >= 2 && results.length > 0 && (
                <span>{results.length} résultat(s)</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SmartSearch;
