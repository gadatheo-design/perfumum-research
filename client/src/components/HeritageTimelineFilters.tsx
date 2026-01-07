import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Filter, 
  Globe, 
  Calendar, 
  Beaker, 
  X,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types pour les données de la timeline
interface HeritageTimelineEntry {
  id: number;
  periodCode: string;
  periodName: string;
  startYear: number | null;
  endYear: number | null;
  regionCode: string | null;
  regionName: string | null;
  chemotypeClass: string | null;
  description: string | null;
  historicalContext: string | null;
  evidenceCount: number | null;
  color: string | null;
  displayOrder: number | null;
}

// Définition des continents et leurs régions associées
const continentMapping: Record<string, { name: string; regions: string[] }> = {
  EUROPE: {
    name: "Europe",
    regions: ["GREECE", "ROME", "EUROPE_MEDIEVAL", "ITALY_RENAISSANCE", "GRASSE", "EUROPE_INDUSTRIAL", "FRANCE_MODERN", "GLOBAL"],
  },
  ASIA: {
    name: "Asie",
    regions: ["MESOPOTAMIA", "INDIA", "CHINA", "ARAB_WORLD", "CENTRAL_ASIA", "INDIA_PACIFIC", "SOUTH_ARABIA"],
  },
  AFRICA: {
    name: "Afrique",
    regions: ["EGYPT"],
  },
  AMERICAS: {
    name: "Amériques",
    regions: ["AMERICAS", "HAITI_REUNION"],
  },
  OCEANIA: {
    name: "Océanie",
    regions: [],
  },
};

// Définition des périodes historiques
const periodRanges: Record<string, { name: string; startYear: number; endYear: number }> = {
  ANTIQUITY: {
    name: "Antiquité",
    startYear: -5000,
    endYear: 500,
  },
  MEDIEVAL: {
    name: "Moyen Âge",
    startYear: 500,
    endYear: 1500,
  },
  MODERN: {
    name: "Époque moderne",
    startYear: 1500,
    endYear: 1900,
  },
  CONTEMPORARY: {
    name: "Époque contemporaine",
    startYear: 1900,
    endYear: 2100,
  },
};

// Couleurs par classe de chémotype
const chemotypeColors: Record<string, string> = {
  alkaloid: "#ef4444",
  cannabinoid: "#22c55e",
  terpene: "#3b82f6",
  sesquiterpene: "#6366f1",
  monoterpene: "#8b5cf6",
  phenolic: "#f97316",
  flavonoid: "#eab308",
  other: "#6b7280",
};

export interface FilterState {
  continents: string[];
  periods: string[];
  chemotypes: string[];
}

interface HeritageTimelineFiltersProps {
  timelineData: HeritageTimelineEntry[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

export function HeritageTimelineFilters({
  timelineData,
  filters,
  onFiltersChange,
  className,
}: HeritageTimelineFiltersProps) {
  // Extraire les classes de chémotypes uniques des données
  const availableChemotypes = useMemo(() => {
    const chemotypes = new Set<string>();
    timelineData.forEach((entry) => {
      if (entry.chemotypeClass) {
        chemotypes.add(entry.chemotypeClass);
      }
    });
    return Array.from(chemotypes).sort();
  }, [timelineData]);

  // Compter les entrées par continent
  const continentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(continentMapping).forEach((continent) => {
      counts[continent] = timelineData.filter((entry) =>
        entry.regionCode && continentMapping[continent].regions.includes(entry.regionCode)
      ).length;
    });
    return counts;
  }, [timelineData]);

  // Compter les entrées par période
  const periodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(periodRanges).forEach((period) => {
      const range = periodRanges[period];
      counts[period] = timelineData.filter((entry) => {
        const startYear = entry.startYear || 0;
        return startYear >= range.startYear && startYear < range.endYear;
      }).length;
    });
    return counts;
  }, [timelineData]);

  // Compter les entrées par chémotype
  const chemotypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    timelineData.forEach((entry) => {
      if (entry.chemotypeClass) {
        counts[entry.chemotypeClass] = (counts[entry.chemotypeClass] || 0) + 1;
      }
    });
    return counts;
  }, [timelineData]);

  // Toggle un filtre de continent
  const toggleContinent = (continent: string) => {
    const newContinents = filters.continents.includes(continent)
      ? filters.continents.filter((c) => c !== continent)
      : [...filters.continents, continent];
    onFiltersChange({ ...filters, continents: newContinents });
  };

  // Toggle un filtre de période
  const togglePeriod = (period: string) => {
    const newPeriods = filters.periods.includes(period)
      ? filters.periods.filter((p) => p !== period)
      : [...filters.periods, period];
    onFiltersChange({ ...filters, periods: newPeriods });
  };

  // Toggle un filtre de chémotype
  const toggleChemotype = (chemotype: string) => {
    const newChemotypes = filters.chemotypes.includes(chemotype)
      ? filters.chemotypes.filter((c) => c !== chemotype)
      : [...filters.chemotypes, chemotype];
    onFiltersChange({ ...filters, chemotypes: newChemotypes });
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    onFiltersChange({ continents: [], periods: [], chemotypes: [] });
  };

  // Nombre total de filtres actifs
  const activeFiltersCount = filters.continents.length + filters.periods.length + filters.chemotypes.length;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres géographiques
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 px-2 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Réinitialiser ({activeFiltersCount})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtres par continent */}
        <div>
          <Label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-blue-500" />
            Par continent
          </Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(continentMapping).map(([code, { name }]) => {
              const count = continentCounts[code] || 0;
              const isActive = filters.continents.includes(code);
              return (
                <Button
                  key={code}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => toggleContinent(code)}
                  disabled={count === 0}
                >
                  {name}
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-1 h-4 px-1 text-[10px]",
                      isActive && "bg-primary-foreground text-primary"
                    )}
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Filtres par période */}
        <div>
          <Label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-amber-500" />
            Par période historique
          </Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(periodRanges).map(([code, { name }]) => {
              const count = periodCounts[code] || 0;
              const isActive = filters.periods.includes(code);
              return (
                <Button
                  key={code}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => togglePeriod(code)}
                  disabled={count === 0}
                >
                  {name}
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-1 h-4 px-1 text-[10px]",
                      isActive && "bg-primary-foreground text-primary"
                    )}
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Filtres par classe de chémotype */}
        <div>
          <Label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Beaker className="h-4 w-4 text-green-500" />
            Par classe de chémotype
          </Label>
          <div className="flex flex-wrap gap-2">
            {availableChemotypes.map((chemotype) => {
              const count = chemotypeCounts[chemotype] || 0;
              const isActive = filters.chemotypes.includes(chemotype);
              const color = chemotypeColors[chemotype] || chemotypeColors.other;
              return (
                <Button
                  key={chemotype}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs capitalize"
                  style={{
                    borderColor: color,
                    ...(isActive && {
                      backgroundColor: color,
                      color: "white",
                    }),
                  }}
                  onClick={() => toggleChemotype(chemotype)}
                >
                  {chemotype}
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-1 h-4 px-1 text-[10px]",
                      isActive && "bg-white/20 text-white"
                    )}
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Résumé des filtres actifs */}
        {activeFiltersCount > 0 && (
          <div className="pt-2 border-t">
            <div className="flex flex-wrap gap-1">
              {filters.continents.map((c) => (
                <Badge key={c} variant="secondary" className="text-xs">
                  {continentMapping[c]?.name}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => toggleContinent(c)}
                  />
                </Badge>
              ))}
              {filters.periods.map((p) => (
                <Badge key={p} variant="secondary" className="text-xs">
                  {periodRanges[p]?.name}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => togglePeriod(p)}
                  />
                </Badge>
              ))}
              {filters.chemotypes.map((c) => (
                <Badge
                  key={c}
                  variant="secondary"
                  className="text-xs capitalize"
                  style={{ backgroundColor: chemotypeColors[c], color: "white" }}
                >
                  {c}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => toggleChemotype(c)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Fonction utilitaire pour filtrer les données de la timeline
export function filterTimelineData(
  data: HeritageTimelineEntry[],
  filters: FilterState
): HeritageTimelineEntry[] {
  return data.filter((entry) => {
    // Filtre par continent
    if (filters.continents.length > 0) {
      const entryContinent = Object.entries(continentMapping).find(([_, { regions }]) =>
        entry.regionCode && regions.includes(entry.regionCode)
      );
      if (!entryContinent || !filters.continents.includes(entryContinent[0])) {
        return false;
      }
    }

    // Filtre par période
    if (filters.periods.length > 0) {
      const startYear = entry.startYear || 0;
      const matchesPeriod = filters.periods.some((period) => {
        const range = periodRanges[period];
        return startYear >= range.startYear && startYear < range.endYear;
      });
      if (!matchesPeriod) {
        return false;
      }
    }

    // Filtre par chémotype
    if (filters.chemotypes.length > 0) {
      if (!entry.chemotypeClass || !filters.chemotypes.includes(entry.chemotypeClass)) {
        return false;
      }
    }

    return true;
  });
}

// Export des constantes pour utilisation externe
export { continentMapping, periodRanges, chemotypeColors };
