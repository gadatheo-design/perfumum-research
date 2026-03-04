// @ts-nocheck
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
  Filter,
  Languages,
  FlaskRound,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  /** Score de pertinence (100 = exact, 80 = synonyme, etc.) */
  relevanceScore?: number;
  /** Type de correspondance */
  matchType?: 'exact' | 'synonym' | 'latin' | 'cas' | 'partial';
  /** Terme qui a matché */
  matchedTerm?: string;
}

/** Métadonnées d'enrichissement de la recherche */
interface SearchEnrichment {
  originalQuery: string;
  expandedTerms: string[];
  synonymsUsed: number;
  queryCategory: { category: string; confidence: number };
  olfactiveSynonyms: string[];
  scientificNames: string[];
  totalExpansions: number;
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

// Labels et couleurs pour les types de correspondance
const MATCH_TYPE_LABELS: Record<string, string> = {
  exact: "Exact",
  synonym: "Synonyme",
  latin: "Nom latin",
  cas: "N° CAS",
  partial: "Partiel",
};

const MATCH_TYPE_COLORS: Record<string, string> = {
  exact: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200",
  synonym: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200",
  latin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200",
  cas: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200",
  partial: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200",
};

const MATCH_TYPE_ICONS: Record<string, React.ReactNode> = {
  exact: <Sparkles className="h-3 w-3" />,
  synonym: <Languages className="h-3 w-3" />,
  latin: <Leaf className="h-3 w-3" />,
  cas: <FlaskRound className="h-3 w-3" />,
  partial: <Search className="h-3 w-3" />,
};

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
          {/* Indicateur de score de pertinence */}
          {result.relevanceScore && result.relevanceScore >= 95 && (
            <Sparkles className="h-3 w-3 text-amber-500" />
          )}
        </div>
        {result.description && (
          <p className="text-sm text-muted-foreground truncate">
            {result.description}
          </p>
        )}
        {/* Affichage du terme matché si différent du nom */}
        {result.matchType && result.matchType !== 'exact' && result.matchedTerm && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-muted-foreground">via</span>
            <Badge 
              variant="outline" 
              className={cn("text-xs h-5 gap-1", MATCH_TYPE_COLORS[result.matchType])}
            >
              {MATCH_TYPE_ICONS[result.matchType]}
              <span className="font-mono">{result.matchedTerm}</span>
            </Badge>
          </div>
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
        {/* Badge du type de correspondance */}
        {result.matchType && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className={cn("text-xs hidden sm:flex gap-1", MATCH_TYPE_COLORS[result.matchType])}
              >
                {MATCH_TYPE_ICONS[result.matchType]}
                {MATCH_TYPE_LABELS[result.matchType]}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Score: {result.relevanceScore || 0}%</p>
              {result.matchedTerm && <p>Matché via: {result.matchedTerm}</p>}
            </TooltipContent>
          </Tooltip>
        )}
        {result.family && (
          <Badge variant="outline" className="text-xs hidden md:flex">
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

// Composant d'indicateur d'enrichissement de la recherche
function SearchEnrichmentIndicator({ enrichment }: { enrichment: SearchEnrichment }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasOlfactiveSynonyms = enrichment.olfactiveSynonyms && enrichment.olfactiveSynonyms.length > 0;
  const hasScientificNames = enrichment.scientificNames && enrichment.scientificNames.length > 0;
  
  if (!hasOlfactiveSynonyms && !hasScientificNames) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-2 flex items-center justify-between text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-muted-foreground">
            Recherche enrichie avec <strong className="text-foreground">{enrichment.synonymsUsed}</strong> terme{enrichment.synonymsUsed > 1 ? 's' : ''} supplémentaire{enrichment.synonymsUsed > 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasOlfactiveSynonyms && (
            <Badge variant="outline" className="h-5 text-[10px] bg-blue-100 dark:bg-blue-900/30 border-blue-200">
              <Languages className="h-3 w-3 mr-1" />
              {enrichment.olfactiveSynonyms.length} synonyme{enrichment.olfactiveSynonyms.length > 1 ? 's' : ''}
            </Badge>
          )}
          {hasScientificNames && (
            <Badge variant="outline" className="h-5 text-[10px] bg-purple-100 dark:bg-purple-900/30 border-purple-200">
              <FlaskRound className="h-3 w-3 mr-1" />
              {enrichment.scientificNames.length} nom{enrichment.scientificNames.length > 1 ? 's' : ''} scientifique{enrichment.scientificNames.length > 1 ? 's' : ''}
            </Badge>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pb-3 space-y-2"
          >
            {/* Synonymes olfactifs */}
            {hasOlfactiveSynonyms && (
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Languages className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Synonymes olfactifs</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {enrichment.olfactiveSynonyms.slice(0, 8).map((syn, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] h-5 bg-blue-100/50 dark:bg-blue-900/20">
                      {syn}
                    </Badge>
                  ))}
                  {enrichment.olfactiveSynonyms.length > 8 && (
                    <Badge variant="outline" className="text-[10px] h-5">
                      +{enrichment.olfactiveSynonyms.length - 8} autres
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {/* Noms scientifiques */}
            {hasScientificNames && (
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <FlaskRound className="h-3 w-3 text-purple-500" />
                  <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Noms scientifiques (latins / CAS)</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {enrichment.scientificNames.slice(0, 8).map((name, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] h-5 font-mono bg-purple-100/50 dark:bg-purple-900/20">
                      {name}
                    </Badge>
                  ))}
                  {enrichment.scientificNames.length > 8 && (
                    <Badge variant="outline" className="text-[10px] h-5">
                      +{enrichment.scientificNames.length - 8} autres
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {/* Catégorie détectée */}
            {enrichment.queryCategory && enrichment.queryCategory.confidence > 0.5 && (
              <div className="flex items-center gap-2 pt-1 border-t border-dashed">
                <Info className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  Catégorie détectée: <strong>{enrichment.queryCategory.category}</strong>
                  <span className="opacity-60"> ({Math.round(enrichment.queryCategory.confidence * 100)}% confiance)</span>
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
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
          family: mol.metadata?.family,
          relevanceScore: mol.relevanceScore,
          matchType: mol.matchType,
          matchedTerm: mol.matchedTerm,
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
          category: rec.metadata?.category,
          relevanceScore: rec.relevanceScore,
          matchType: rec.matchType,
          matchedTerm: rec.matchedTerm,
        });
      });
    }
    
    // Glossaire
    if (searchResults.glossary) {
      searchResults.glossary.forEach((term: any) => {
        allResults.push({
          id: term.id,
          type: "glossaire",
          name: term.name,
          description: term.description?.substring(0, 100),
          relevanceScore: term.relevanceScore,
          matchType: term.matchType,
          matchedTerm: term.matchedTerm,
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
          family: plant.metadata?.family,
          relevanceScore: plant.relevanceScore,
          matchType: plant.matchType,
          matchedTerm: plant.matchedTerm,
        });
      });
    }

    // Filtrer par type si des filtres sont actifs
    if (activeFilters.length > 0) {
      return allResults.filter(r => activeFilters.includes(r.type));
    }
    
    // Trier par score de pertinence (déjà trié côté serveur, mais on s'assure)
    return allResults.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }, [searchResults, activeFilters]);

  // Extraire les métadonnées d'enrichissement
  const searchEnrichment: SearchEnrichment | null = useMemo(() => {
    return searchResults?.searchEnrichment || null;
  }, [searchResults]);

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
            {/* Indicateur d'enrichissement de la recherche */}
            {query.length >= 2 && searchEnrichment && searchEnrichment.synonymsUsed > 0 && (
              <SearchEnrichmentIndicator enrichment={searchEnrichment} />
            )}

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
