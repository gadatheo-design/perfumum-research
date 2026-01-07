import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Clock,
  MapPin,
  Beaker,
  Filter,
  ChevronRight,
  Globe,
  Calendar,
  FlaskConical,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Atom,
  Map,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  Ruler,
} from "lucide-react";
import { Link } from "wouter";
import { HeritageTimelineMap } from "@/components/HeritageTimelineMap";
import { HeritageTimelineFilters, FilterState, filterTimelineData, chemotypeColors as filterChemotypeColors } from "@/components/HeritageTimelineFilters";
import { cn } from "@/lib/utils";

// Composant pour afficher les molécules liées à une période heritage
function LinkedMoleculesSection({ periodId }: { periodId: number }) {
  const { data: timelineWithMolecules, isLoading } = trpc.lostMolecules.heritageTimeline.getWithMolecules.useQuery(periodId);
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    );
  }
  
  if (!timelineWithMolecules) return null;
  
  const hasLostMolecules = timelineWithMolecules.linkedLostMolecules && timelineWithMolecules.linkedLostMolecules.length > 0;
  const hasMainMolecules = timelineWithMolecules.linkedMainMolecules && timelineWithMolecules.linkedMainMolecules.length > 0;
  
  if (!hasLostMolecules && !hasMainMolecules) return null;
  
  return (
    <div className="space-y-4 pt-4 border-t">
      {/* Molécules perdues liées */}
      {hasLostMolecules && (
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Atom className="h-4 w-4 text-primary" />
            Molécules perdues associées
            <Badge variant="secondary" className="text-xs">
              {timelineWithMolecules.linkedLostMolecules.length}
            </Badge>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {timelineWithMolecules.linkedLostMolecules.map((mol) => (
              <Link key={mol.id} href={`/lost-molecules-graph?molecule=${mol.moleculeId}`}>
                <Card className="p-3 hover:bg-accent cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{mol.name}</p>
                      {mol.formula && (
                        <p className="text-xs text-muted-foreground font-mono">{mol.formula}</p>
                      )}
                      {mol.moleculeClass && (
                        <Badge 
                          variant="outline" 
                          className="text-xs mt-1 capitalize"
                          style={{ 
                            borderColor: chemotypeColors[mol.moleculeClass] || chemotypeColors.other,
                            color: chemotypeColors[mol.moleculeClass] || chemotypeColors.other 
                          }}
                        >
                          {mol.moleculeClass}
                        </Badge>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Molécules principales liées */}
      {hasMainMolecules && (
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Beaker className="h-4 w-4 text-primary" />
            Molécules de référence
            <Badge variant="secondary" className="text-xs">
              {timelineWithMolecules.linkedMainMolecules.length}
            </Badge>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {timelineWithMolecules.linkedMainMolecules.map((mol) => (
              <Link key={mol.id} href={`/molecules/${mol.id}`}>
                <Card className="p-3 hover:bg-accent cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{mol.name}</p>
                      {mol.formula && (
                        <p className="text-xs text-muted-foreground font-mono">{mol.formula}</p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Lien vers le graphe complet */}
      <div className="flex justify-end">
        <Link href="/lost-molecules-graph">
          <Button variant="outline" size="sm">
            <Atom className="h-4 w-4 mr-2" />
            Voir le graphe complet
          </Button>
        </Link>
      </div>
    </div>
  );
}

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

// Icône de confiance
function ConfidenceIcon({ level }: { level: string }) {
  switch (level) {
    case "high":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "medium":
      return <HelpCircle className="h-4 w-4 text-yellow-500" />;
    case "low":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <HelpCircle className="h-4 w-4 text-gray-400" />;
  }
}

// Composant de carte pour une période (timeline evidence-based)
function TimelinePeriodCard({
  entry,
  isSelected,
  onClick,
}: {
  entry: {
    timeContext: string;
    regionContext: string | null;
    moleculeClass: string | null;
    molecules: { id: number; moleculeId: string; name: string; formula: string | null }[];
    evidenceCount: number;
    confidence: "low" | "medium" | "high";
    methods: string[];
  };
  isSelected: boolean;
  onClick: () => void;
}) {
  const color = entry.moleculeClass ? chemotypeColors[entry.moleculeClass] || chemotypeColors.other : chemotypeColors.other;

  return (
    <Card
      className={`min-w-[280px] max-w-[320px] cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">{entry.timeContext}</CardTitle>
          </div>
          <ConfidenceIcon level={entry.confidence} />
        </div>
        {entry.regionContext && (
          <CardDescription className="flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {entry.regionContext}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {entry.moleculeClass && (
          <Badge
            style={{ backgroundColor: color, color: "white" }}
            className="capitalize"
          >
            {entry.moleculeClass}
          </Badge>
        )}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {entry.molecules.length} molécule{entry.molecules.length > 1 ? "s" : ""} • {entry.evidenceCount} évidence{entry.evidenceCount > 1 ? "s" : ""}
          </p>
          <div className="flex flex-wrap gap-1">
            {entry.molecules.slice(0, 3).map((mol) => (
              <Badge key={mol.id} variant="outline" className="text-xs">
                {mol.name}
              </Badge>
            ))}
            {entry.molecules.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{entry.molecules.length - 3}
              </Badge>
            )}
          </div>
        </div>
        {entry.methods.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FlaskConical className="h-3 w-3" />
            {entry.methods.slice(0, 2).join(", ")}
            {entry.methods.length > 2 && ` +${entry.methods.length - 2}`}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Composant de carte pour une période historique (heritage timeline)
function HeritageTimelineCard({
  entry,
  isSelected,
  onClick,
}: {
  entry: {
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
  };
  isSelected: boolean;
  onClick: () => void;
}) {
  const color = entry.color || (entry.chemotypeClass ? chemotypeColors[entry.chemotypeClass] || chemotypeColors.other : chemotypeColors.other);

  const formatYearRange = () => {
    if (!entry.startYear && !entry.endYear) return "Période inconnue";
    
    const formatYear = (year: number) => {
      if (year < 0) return `${Math.abs(year)} av. J.-C.`;
      return `${year}`;
    };
    
    if (entry.startYear && entry.endYear) {
      return `${formatYear(entry.startYear)} — ${formatYear(entry.endYear)}`;
    }
    if (entry.startYear) return `Depuis ${formatYear(entry.startYear)}`;
    if (entry.endYear) return `Jusqu'à ${formatYear(entry.endYear)}`;
    return "";
  };

  return (
    <Card
      className={`min-w-[300px] max-w-[350px] cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-medium">{entry.periodName}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3" />
              {formatYearRange()}
            </CardDescription>
          </div>
          {entry.chemotypeClass && (
            <Badge
              style={{ backgroundColor: color, color: "white" }}
              className="capitalize text-xs"
            >
              {entry.chemotypeClass}
            </Badge>
          )}
        </div>
        {entry.regionName && (
          <CardDescription className="flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {entry.regionName}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {entry.description && (
          <p className="text-xs text-muted-foreground line-clamp-3">
            {entry.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Beaker className="h-3 w-3" />
          <span>{entry.evidenceCount || 0} évidences documentées</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant de frise chronologique interactive
interface InteractiveTimelineProps {
  data: {
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
  }[];
  selectedPeriod: string | null;
  onPeriodSelect: (periodCode: string | null) => void;
}

function InteractiveTimeline({ data, selectedPeriod, onPeriodSelect }: InteractiveTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = millénaire, 2 = siècle, 3 = décennie
  const [viewStart, setViewStart] = useState(-3500);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [hoveredPeriod, setHoveredPeriod] = useState<string | null>(null);

  // Calcul de la plage visible en fonction du zoom
  const getViewRange = useCallback(() => {
    const ranges = {
      1: 5500, // Vue millénaire: -3500 à 2000
      2: 1000, // Vue siècle: 1000 ans
      3: 200,  // Vue décennie: 200 ans
    };
    return ranges[zoomLevel as keyof typeof ranges] || 5500;
  }, [zoomLevel]);

  const viewRange = getViewRange();
  const viewEnd = viewStart + viewRange;

  // Formater une année pour l'affichage
  const formatYear = (year: number) => {
    if (year < 0) return `${Math.abs(year)} av. J.-C.`;
    return `${year}`;
  };

  // Calculer la position X d'une année sur la frise
  const yearToX = (year: number, width: number) => {
    const normalizedYear = Math.max(viewStart, Math.min(viewEnd, year));
    return ((normalizedYear - viewStart) / viewRange) * width;
  };

  // Générer les marqueurs d'échelle
  const getScaleMarkers = () => {
    const markers: number[] = [];
    let step: number;
    
    switch (zoomLevel) {
      case 1:
        step = 500; // Tous les 500 ans
        break;
      case 2:
        step = 100; // Tous les 100 ans
        break;
      case 3:
        step = 20; // Tous les 20 ans
        break;
      default:
        step = 500;
    }
    
    const start = Math.ceil(viewStart / step) * step;
    for (let year = start; year <= viewEnd; year += step) {
      markers.push(year);
    }
    return markers;
  };

  // Gestion du zoom
  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      const newZoom = zoomLevel + 1;
      const newRange = getViewRange();
      // Centrer sur la vue actuelle
      const center = viewStart + viewRange / 2;
      const newStart = center - newRange / 2;
      setZoomLevel(newZoom);
      setViewStart(Math.max(-5000, Math.min(2100 - newRange, newStart)));
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 1) {
      const newZoom = zoomLevel - 1;
      setZoomLevel(newZoom);
      // Réajuster la vue
      if (newZoom === 1) {
        setViewStart(-3500);
      }
    }
  };

  const handleReset = () => {
    setZoomLevel(1);
    setViewStart(-3500);
  };

  // Gestion du drag pour la navigation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart(e.clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current) {
      const width = containerRef.current.clientWidth;
      const dx = e.clientX - dragStart;
      const yearDelta = (dx / width) * viewRange;
      const newStart = viewStart - yearDelta;
      setViewStart(Math.max(-5000, Math.min(2100 - viewRange, newStart)));
      setDragStart(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Filtrer les données visibles
  const visibleData = data.filter((entry) => {
    const start = entry.startYear || -5000;
    const end = entry.endYear || 2100;
    return end >= viewStart && start <= viewEnd;
  });

  // Niveaux de la frise (pour éviter les chevauchements)
  const assignLevels = (entries: typeof data) => {
    const levels: { entry: typeof entries[0]; level: number }[] = [];
    const occupied: { start: number; end: number; level: number }[] = [];

    entries
      .sort((a, b) => (a.startYear || -5000) - (b.startYear || -5000))
      .forEach((entry) => {
        const start = entry.startYear || -5000;
        const end = entry.endYear || 2100;
        
        // Trouver le premier niveau disponible
        let level = 0;
        while (occupied.some((o) => o.level === level && !(end < o.start || start > o.end))) {
          level++;
        }
        
        levels.push({ entry, level });
        occupied.push({ start, end, level });
      });

    return levels;
  };

  const leveledData = assignLevels(visibleData);
  const maxLevel = Math.max(0, ...leveledData.map((d) => d.level));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Frise chronologique interactive
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {formatYear(viewStart)} — {formatYear(viewEnd)}
            </Badge>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleReset}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        <CardDescription className="text-xs">
          {zoomLevel === 1 && "Vue millénaire • Cliquez pour zoomer"}
          {zoomLevel === 2 && "Vue siècle • Glissez pour naviguer"}
          {zoomLevel === 3 && "Vue décennie • Glissez pour naviguer"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={containerRef}
          className={cn(
            "relative h-[300px] bg-muted/30 overflow-hidden select-none",
            zoomLevel > 1 && "cursor-grab",
            isDragging && "cursor-grabbing"
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Échelle temporelle */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-background border-t flex items-center">
            {getScaleMarkers().map((year) => {
              const x = yearToX(year, containerRef.current?.clientWidth || 800);
              return (
                <div
                  key={year}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${x}px`, transform: "translateX(-50%)" }}
                >
                  <div className="h-2 w-px bg-muted-foreground/50" />
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {formatYear(year)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Lignes de grille */}
          <div className="absolute inset-0 bottom-8">
            {getScaleMarkers().map((year) => {
              const x = yearToX(year, containerRef.current?.clientWidth || 800);
              return (
                <div
                  key={`grid-${year}`}
                  className="absolute top-0 bottom-0 w-px bg-muted-foreground/10"
                  style={{ left: `${x}px` }}
                />
              );
            })}
          </div>

          {/* Barres des périodes */}
          <TooltipProvider>
            <div className="absolute inset-0 bottom-8 p-4">
              {leveledData.map(({ entry, level }) => {
                const start = entry.startYear || -5000;
                const end = entry.endYear || 2100;
                const width = containerRef.current?.clientWidth || 800;
                const x1 = yearToX(start, width);
                const x2 = yearToX(end, width);
                const barWidth = Math.max(20, x2 - x1);
                const color = entry.color || chemotypeColors[entry.chemotypeClass || "other"] || chemotypeColors.other;
                const isSelected = selectedPeriod === entry.periodCode;
                const isHovered = hoveredPeriod === entry.periodCode;

                return (
                  <Tooltip key={entry.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "absolute rounded-md cursor-pointer transition-all",
                          isSelected && "ring-2 ring-primary ring-offset-2",
                          isHovered && "brightness-110"
                        )}
                        style={{
                          left: `${x1}px`,
                          width: `${barWidth}px`,
                          top: `${level * 40 + 8}px`,
                          height: "32px",
                          backgroundColor: color,
                          opacity: isSelected || isHovered ? 1 : 0.8,
                        }}
                        onClick={() => onPeriodSelect(isSelected ? null : entry.periodCode)}
                        onMouseEnter={() => setHoveredPeriod(entry.periodCode)}
                        onMouseLeave={() => setHoveredPeriod(null)}
                      >
                        <div className="h-full flex items-center px-2 overflow-hidden">
                          <span className="text-white text-xs font-medium truncate">
                            {entry.periodName}
                          </span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-medium">{entry.periodName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatYear(start)} — {formatYear(end)}
                        </p>
                        {entry.regionName && (
                          <p className="text-xs flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {entry.regionName}
                          </p>
                        )}
                        {entry.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {entry.description}
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>

          {/* Indicateur de navigation */}
          {zoomLevel > 1 && (
            <div className="absolute top-2 left-2 right-2 flex justify-between pointer-events-none">
              <div className="bg-background/80 rounded px-2 py-1 text-xs text-muted-foreground flex items-center gap-1">
                <ChevronLeft className="h-3 w-3" />
                {viewStart > -3500 && "Glissez pour voir plus"}
              </div>
              <div className="bg-background/80 rounded px-2 py-1 text-xs text-muted-foreground flex items-center gap-1">
                {viewEnd < 2100 && "Glissez pour voir plus"}
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant principal
export default function HeritageTimeline() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("map");
  const [filters, setFilters] = useState<FilterState>({
    continents: [],
    periods: [],
    chemotypes: [],
  });

  // Requêtes tRPC - Timeline basée sur les évidences
  const { data: timelineData, isLoading: isLoadingTimeline } = trpc.lostMolecules.timeline.getData.useQuery(
    selectedRegion !== "all" || selectedClass !== "all"
      ? {
          regionContext: selectedRegion !== "all" ? selectedRegion : undefined,
          moleculeClass: selectedClass !== "all" ? selectedClass : undefined,
        }
      : undefined
  );

  // Requêtes tRPC - Timeline historique enrichie
  const { data: heritageTimelineData, isLoading: isLoadingHeritage } = trpc.lostMolecules.heritageTimeline.list.useQuery();

  const { data: timeContexts } = trpc.lostMolecules.timeline.getTimeContexts.useQuery();
  const { data: regionContexts } = trpc.lostMolecules.timeline.getRegionContexts.useQuery();
  const { data: bibStats } = trpc.lostMolecules.bibliography.getStats.useQuery();

  // Filtrer les données heritage avec les filtres géographiques
  const filteredHeritageData = useMemo(() => {
    if (!heritageTimelineData) return [];
    return filterTimelineData(heritageTimelineData, filters);
  }, [heritageTimelineData, filters]);

  // Classes uniques
  const uniqueClasses = useMemo(() => {
    if (!timelineData) return [];
    const classes = new Set<string>();
    timelineData.forEach((entry) => {
      if (entry.moleculeClass) classes.add(entry.moleculeClass);
    });
    return Array.from(classes);
  }, [timelineData]);

  // Entrée sélectionnée (evidence-based)
  const selectedEntryData = useMemo(() => {
    if (selectedEntry === null || !timelineData) return null;
    return timelineData[selectedEntry];
  }, [selectedEntry, timelineData]);

  // Entrée sélectionnée (heritage timeline)
  const selectedHeritageEntry = useMemo(() => {
    if (!selectedPeriod || !filteredHeritageData) return null;
    return filteredHeritageData.find(e => e.periodCode === selectedPeriod);
  }, [selectedPeriod, filteredHeritageData]);

  // Grouper les entrées heritage par ère
  const heritageByEra = useMemo(() => {
    if (!filteredHeritageData) return {};
    
    const eras: Record<string, typeof filteredHeritageData> = {
      "Antiquité": [],
      "Moyen Âge": [],
      "Époque moderne": [],
      "Époque contemporaine": [],
      "Régions spécifiques": [],
    };
    
    filteredHeritageData.forEach(entry => {
      const startYear = entry.startYear || 0;
      
      // Régions spécifiques (cannabis, tabac, encens, santal, vétiver)
      if (['CENTRAL_ASIA', 'AMERICAS', 'SOUTH_ARABIA', 'INDIA_PACIFIC', 'HAITI_REUNION'].includes(entry.regionCode || '')) {
        eras["Régions spécifiques"].push(entry);
      } else if (startYear < 500) {
        eras["Antiquité"].push(entry);
      } else if (startYear < 1500) {
        eras["Moyen Âge"].push(entry);
      } else if (startYear < 1900) {
        eras["Époque moderne"].push(entry);
      } else {
        eras["Époque contemporaine"].push(entry);
      }
    });
    
    return eras;
  }, [filteredHeritageData]);

  return (
    <div className="container py-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="h-8 w-8 text-primary" />
            Timeline Historique des Chémotypes
          </h1>
          <p className="text-muted-foreground mt-1">
            Évolution des chémotypes patrimoniaux par période et région géographique
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/lost-molecules-graph">
            <Button variant="outline" size="sm">
              <Atom className="h-4 w-4 mr-2" />
              Graphe des molécules
            </Button>
          </Link>
          <Link href="/bibliographie">
            <Button variant="outline" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Bibliographie
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Périodes historiques</CardDescription>
            <CardTitle className="text-2xl">{heritageTimelineData?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Contextes temporels</CardDescription>
            <CardTitle className="text-2xl">{timeContexts?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Régions géographiques</CardDescription>
            <CardTitle className="text-2xl">{regionContexts?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Références bibliographiques</CardDescription>
            <CardTitle className="text-2xl">{bibStats?.totalReferences || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Liées aux évidences</CardDescription>
            <CardTitle className="text-2xl">{bibStats?.linkedToEvidence || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Carte géographique
          </TabsTrigger>
          <TabsTrigger value="frise" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Frise chronologique
          </TabsTrigger>
          <TabsTrigger value="heritage">Timeline historique</TabsTrigger>
          <TabsTrigger value="timeline">Évidences scientifiques</TabsTrigger>
          <TabsTrigger value="regions">Par région</TabsTrigger>
        </TabsList>

        {/* Carte géographique */}
        <TabsContent value="map" className="mt-4">
          {isLoadingHeritage ? (
            <Skeleton className="h-[500px] w-full" />
          ) : heritageTimelineData && heritageTimelineData.length > 0 ? (
            <div className="space-y-4">
              {/* Filtres géographiques */}
              <HeritageTimelineFilters
                timelineData={heritageTimelineData}
                filters={filters}
                onFiltersChange={setFilters}
              />

              {/* Carte avec données filtrées */}
              <HeritageTimelineMap
                timelineData={filteredHeritageData}
                isLoading={isLoadingHeritage}
                selectedPeriod={selectedPeriod}
                onPeriodSelect={setSelectedPeriod}
              />
              
              {/* Détails de la période sélectionnée */}
              {selectedHeritageEntry && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {selectedHeritageEntry.periodName}
                      {selectedHeritageEntry.regionName && (
                        <Badge variant="outline" className="ml-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {selectedHeritageEntry.regionName}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {selectedHeritageEntry.startYear && selectedHeritageEntry.endYear && (
                        <>
                          {selectedHeritageEntry.startYear < 0 
                            ? `${Math.abs(selectedHeritageEntry.startYear)} av. J.-C.`
                            : selectedHeritageEntry.startYear
                          }
                          {" — "}
                          {selectedHeritageEntry.endYear < 0 
                            ? `${Math.abs(selectedHeritageEntry.endYear)} av. J.-C.`
                            : selectedHeritageEntry.endYear
                          }
                        </>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedHeritageEntry.chemotypeClass && (
                      <Badge
                        style={{
                          backgroundColor: selectedHeritageEntry.color || chemotypeColors[selectedHeritageEntry.chemotypeClass] || chemotypeColors.other,
                          color: "white",
                        }}
                        className="capitalize"
                      >
                        {selectedHeritageEntry.chemotypeClass}
                      </Badge>
                    )}
                    
                    {selectedHeritageEntry.description && (
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedHeritageEntry.description}
                        </p>
                      </div>
                    )}
                    
                    {selectedHeritageEntry.historicalContext && (
                      <div>
                        <h4 className="font-medium mb-2">Contexte historique</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedHeritageEntry.historicalContext}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Beaker className="h-4 w-4" />
                        {selectedHeritageEntry.evidenceCount || 0} évidences
                      </span>
                    </div>
                    
                    {/* Liens vers les molécules perdues */}
                    <LinkedMoleculesSection periodId={selectedHeritageEntry.id} />
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Aucune donnée géographique disponible.
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Frise chronologique interactive */}
        <TabsContent value="frise" className="mt-4">
          {isLoadingHeritage ? (
            <Skeleton className="h-[400px] w-full" />
          ) : heritageTimelineData && heritageTimelineData.length > 0 ? (
            <div className="space-y-4">
              {/* Filtres géographiques */}
              <HeritageTimelineFilters
                timelineData={heritageTimelineData}
                filters={filters}
                onFiltersChange={setFilters}
              />

              {/* Frise chronologique */}
              <InteractiveTimeline
                data={filteredHeritageData}
                selectedPeriod={selectedPeriod}
                onPeriodSelect={setSelectedPeriod}
              />

              {/* Détails de la période sélectionnée */}
              {selectedHeritageEntry && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {selectedHeritageEntry.periodName}
                    </CardTitle>
                    <CardDescription>
                      {selectedHeritageEntry.startYear && selectedHeritageEntry.endYear && (
                        <>
                          {selectedHeritageEntry.startYear < 0 
                            ? `${Math.abs(selectedHeritageEntry.startYear)} av. J.-C.`
                            : selectedHeritageEntry.startYear
                          }
                          {" — "}
                          {selectedHeritageEntry.endYear < 0 
                            ? `${Math.abs(selectedHeritageEntry.endYear)} av. J.-C.`
                            : selectedHeritageEntry.endYear
                          }
                        </>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedHeritageEntry.chemotypeClass && (
                      <Badge
                        style={{
                          backgroundColor: selectedHeritageEntry.color || chemotypeColors[selectedHeritageEntry.chemotypeClass] || chemotypeColors.other,
                          color: "white",
                        }}
                        className="capitalize"
                      >
                        {selectedHeritageEntry.chemotypeClass}
                      </Badge>
                    )}
                    
                    {selectedHeritageEntry.description && (
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedHeritageEntry.description}
                        </p>
                      </div>
                    )}
                    
                    {selectedHeritageEntry.historicalContext && (
                      <div>
                        <h4 className="font-medium mb-2">Contexte historique</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedHeritageEntry.historicalContext}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Beaker className="h-4 w-4" />
                        {selectedHeritageEntry.evidenceCount || 0} évidences
                      </span>
                      {selectedHeritageEntry.regionName && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedHeritageEntry.regionName}
                        </span>
                      )}
                    </div>
                    
                    {/* Liens vers les molécules perdues */}
                    <LinkedMoleculesSection periodId={selectedHeritageEntry.id} />
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Ruler className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Aucune donnée de timeline disponible.
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Timeline historique enrichie */}
        <TabsContent value="heritage" className="mt-4">
          {isLoadingHeritage ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : filteredHeritageData && filteredHeritageData.length > 0 ? (
            <div className="space-y-8">
              {/* Filtres */}
              <HeritageTimelineFilters
                timelineData={heritageTimelineData || []}
                filters={filters}
                onFiltersChange={setFilters}
              />

              {Object.entries(heritageByEra).map(([era, entries]) => {
                if (entries.length === 0) return null;
                return (
                  <div key={era}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      {era}
                      <Badge variant="secondary">{entries.length}</Badge>
                    </h3>
                    <ScrollArea className="w-full whitespace-nowrap">
                      <div className="flex gap-4 pb-4">
                        {entries
                          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                          .map((entry) => (
                            <HeritageTimelineCard
                              key={entry.id}
                              entry={entry}
                              isSelected={selectedPeriod === entry.periodCode}
                              onClick={() => setSelectedPeriod(selectedPeriod === entry.periodCode ? null : entry.periodCode)}
                            />
                          ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                );
              })}
              
              {/* Détails de la période sélectionnée */}
              {selectedHeritageEntry && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {selectedHeritageEntry.periodName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedHeritageEntry.historicalContext && (
                      <div>
                        <h4 className="font-medium mb-2">Contexte historique</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedHeritageEntry.historicalContext}
                        </p>
                      </div>
                    )}
                    
                    {/* Liens vers les molécules perdues */}
                    <LinkedMoleculesSection periodId={selectedHeritageEntry.id} />
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {filters.continents.length > 0 || filters.periods.length > 0 || filters.chemotypes.length > 0
                  ? "Aucune donnée ne correspond aux filtres sélectionnés."
                  : "Aucune donnée de timeline historique disponible."
                }
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Évidences scientifiques (timeline originale) */}
        <TabsContent value="timeline" className="mt-4">
          {/* Filtres */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="w-full md:w-auto">
                  <label className="text-sm font-medium mb-1 block">Région géographique</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Toutes les régions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les régions</SelectItem>
                      {regionContexts?.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-auto">
                  <label className="text-sm font-medium mb-1 block">Classe de chémotype</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Toutes les classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les classes</SelectItem>
                      {uniqueClasses.map((cls) => (
                        <SelectItem key={cls} value={cls}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: chemotypeColors[cls] || chemotypeColors.other }}
                            />
                            <span className="capitalize">{cls}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoadingTimeline ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="min-w-[280px] h-[200px]" />
              ))}
            </div>
          ) : timelineData && timelineData.length > 0 ? (
            <div className="space-y-4">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-4 pb-4">
                  {timelineData.map((entry, index) => (
                    <TimelinePeriodCard
                      key={`${entry.timeContext}-${entry.regionContext}-${index}`}
                      entry={entry}
                      isSelected={selectedEntry === index}
                      onClick={() => setSelectedEntry(selectedEntry === index ? null : index)}
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Détails de l'entrée sélectionnée */}
              {selectedEntryData && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {selectedEntryData.timeContext}
                      {selectedEntryData.regionContext && (
                        <Badge variant="outline" className="ml-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {selectedEntryData.regionContext}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Molécules identifiées</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {selectedEntryData.molecules.map((mol) => (
                          <Link key={mol.id} href={`/molecules/${mol.id}`}>
                            <Card className="p-3 hover:bg-accent cursor-pointer">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{mol.name}</p>
                                  {mol.formula && (
                                    <p className="text-xs text-muted-foreground">{mol.formula}</p>
                                  )}
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {selectedEntryData.methods.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Méthodes analytiques</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedEntryData.methods.map((method, i) => (
                            <Badge key={i} variant="secondary">
                              <FlaskConical className="h-3 w-3 mr-1" />
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Aucune donnée de timeline disponible pour les filtres sélectionnés.
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Par région */}
        <TabsContent value="regions" className="mt-4">
          {regionContexts && regionContexts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regionContexts.map((region) => {
                const regionData = timelineData?.filter((e) => e.regionContext === region) || [];
                const moleculeCount = new Set(regionData.flatMap((e) => e.molecules.map((m) => m.id))).size;
                return (
                  <Card
                    key={region}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setSelectedRegion(region);
                      setActiveTab("timeline");
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        {region}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>{regionData.length} période{regionData.length > 1 ? "s" : ""} historique{regionData.length > 1 ? "s" : ""}</p>
                        <p>{moleculeCount} molécule{moleculeCount > 1 ? "s" : ""} unique{moleculeCount > 1 ? "s" : ""}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune région disponible.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
