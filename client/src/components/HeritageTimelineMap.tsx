import { useEffect, useRef, useState, useMemo } from "react";
import { MapView } from "./Map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Beaker, ChevronRight, X, Maximize2, Minimize2 } from "lucide-react";
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

// Coordonnées géographiques pour les régions
const regionCoordinates: Record<string, { lat: number; lng: number; zoom: number }> = {
  // Période antique
  EGYPT: { lat: 26.8206, lng: 30.8025, zoom: 5 },
  MESOPOTAMIA: { lat: 33.3152, lng: 44.3661, zoom: 5 },
  GREECE: { lat: 37.9838, lng: 23.7275, zoom: 6 },
  ROME: { lat: 41.9028, lng: 12.4964, zoom: 5 },
  INDIA: { lat: 20.5937, lng: 78.9629, zoom: 4 },
  CHINA: { lat: 35.8617, lng: 104.1954, zoom: 4 },
  
  // Période médiévale
  ARAB_WORLD: { lat: 33.3128, lng: 44.3615, zoom: 4 },
  EUROPE_MEDIEVAL: { lat: 48.8566, lng: 2.3522, zoom: 4 },
  
  // Période moderne
  ITALY_RENAISSANCE: { lat: 43.7696, lng: 11.2558, zoom: 6 },
  GRASSE: { lat: 43.6590, lng: 6.9230, zoom: 10 },
  EUROPE_INDUSTRIAL: { lat: 48.8566, lng: 2.3522, zoom: 5 },
  FRANCE_MODERN: { lat: 48.8566, lng: 2.3522, zoom: 5 },
  
  // Régions spécifiques
  CENTRAL_ASIA: { lat: 43.2551, lng: 76.9126, zoom: 4 },
  AMERICAS: { lat: -13.5319, lng: -71.9675, zoom: 3 },
  SOUTH_ARABIA: { lat: 17.0151, lng: 54.0924, zoom: 5 },
  INDIA_PACIFIC: { lat: 12.2958, lng: 76.6394, zoom: 4 },
  HAITI_REUNION: { lat: 18.9712, lng: -72.2852, zoom: 5 },
  
  // Global (centre du monde)
  GLOBAL: { lat: 20, lng: 0, zoom: 2 },
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

interface HeritageTimelineMapProps {
  timelineData: HeritageTimelineEntry[];
  isLoading?: boolean;
  selectedPeriod?: string | null;
  onPeriodSelect?: (periodCode: string | null) => void;
  className?: string;
}

export function HeritageTimelineMap({
  timelineData,
  isLoading = false,
  selectedPeriod,
  onPeriodSelect,
  className,
}: HeritageTimelineMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredPeriod, setHoveredPeriod] = useState<string | null>(null);

  // Filtrer les entrées avec des coordonnées valides
  const mappableEntries = useMemo(() => {
    return timelineData.filter(entry => 
      entry.regionCode && regionCoordinates[entry.regionCode]
    );
  }, [timelineData]);

  // Créer les marqueurs sur la carte
  const createMarkers = (map: google.maps.Map) => {
    // Supprimer les anciens marqueurs
    markersRef.current.forEach(marker => {
      marker.map = null;
    });
    markersRef.current = [];

    // Créer les nouveaux marqueurs
    mappableEntries.forEach(entry => {
      const coords = regionCoordinates[entry.regionCode!];
      if (!coords) return;

      const color = entry.color || chemotypeColors[entry.chemotypeClass || 'other'] || '#6b7280';
      const isSelected = selectedPeriod === entry.periodCode;
      const isHovered = hoveredPeriod === entry.periodCode;

      // Créer un élément personnalisé pour le marqueur
      const markerElement = document.createElement('div');
      markerElement.className = 'heritage-marker';
      markerElement.innerHTML = `
        <div style="
          width: ${isSelected || isHovered ? '40px' : '32px'};
          height: ${isSelected || isHovered ? '40px' : '32px'};
          background-color: ${color};
          border: 3px solid ${isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)'};
          border-radius: 50%;
          box-shadow: ${isSelected ? '0 0 20px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)'};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
        ">
          <span style="color: white; font-size: 12px; font-weight: bold;">
            ${entry.evidenceCount || '?'}
          </span>
        </div>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: coords.lat, lng: coords.lng },
        title: entry.periodName,
        content: markerElement,
      });

      // Événements du marqueur
      marker.addListener('click', () => {
        onPeriodSelect?.(entry.periodCode);
        map.panTo({ lat: coords.lat, lng: coords.lng });
        map.setZoom(coords.zoom);
      });

      markersRef.current.push(marker);
    });
  };

  // Mettre à jour les marqueurs quand les données changent
  useEffect(() => {
    if (mapRef.current && mappableEntries.length > 0) {
      createMarkers(mapRef.current);
    }
  }, [mappableEntries, selectedPeriod, hoveredPeriod]);

  // Centrer sur la période sélectionnée
  useEffect(() => {
    if (mapRef.current && selectedPeriod) {
      const entry = timelineData.find(e => e.periodCode === selectedPeriod);
      if (entry?.regionCode && regionCoordinates[entry.regionCode]) {
        const coords = regionCoordinates[entry.regionCode];
        mapRef.current.panTo({ lat: coords.lat, lng: coords.lng });
        mapRef.current.setZoom(coords.zoom);
      }
    }
  }, [selectedPeriod, timelineData]);

  // Entrée sélectionnée
  const selectedEntry = useMemo(() => {
    return timelineData.find(e => e.periodCode === selectedPeriod);
  }, [timelineData, selectedPeriod]);

  // Formater les années
  const formatYearRange = (startYear: number | null, endYear: number | null) => {
    if (!startYear && !endYear) return "Période inconnue";
    
    const formatYear = (year: number) => {
      if (year < 0) return `${Math.abs(year)} av. J.-C.`;
      return `${year} ap. J.-C.`;
    };
    
    if (startYear && endYear) {
      return `${formatYear(startYear)} — ${formatYear(endYear)}`;
    }
    if (startYear) return `Depuis ${formatYear(startYear)}`;
    if (endYear) return `Jusqu'à ${formatYear(endYear)}`;
    return "";
  };

  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-0">
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", isExpanded && "fixed inset-4 z-50", className)}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Carte des chémotypes patrimoniaux
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{mappableEntries.length} régions</Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 relative">
        <MapView
          className={cn("w-full", isExpanded ? "h-[calc(100vh-200px)]" : "h-[400px]")}
          initialCenter={{ lat: 30, lng: 20 }}
          initialZoom={2}
          onMapReady={(map) => {
            mapRef.current = map;
            if (mappableEntries.length > 0) {
              createMarkers(map);
            }
          }}
        />

        {/* Légende */}
        <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
          <h4 className="text-sm font-medium mb-2">Classes de chémotypes</h4>
          <div className="grid grid-cols-2 gap-1">
            {Object.entries(chemotypeColors).map(([key, color]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs capitalize">{key}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panneau de détails de la période sélectionnée */}
        {selectedEntry && (
          <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium">{selectedEntry.periodName}</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onPeriodSelect?.(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatYearRange(selectedEntry.startYear, selectedEntry.endYear)}</span>
              </div>
              
              {selectedEntry.regionName && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedEntry.regionName}</span>
                </div>
              )}
              
              {selectedEntry.chemotypeClass && (
                <Badge
                  style={{
                    backgroundColor: chemotypeColors[selectedEntry.chemotypeClass] || chemotypeColors.other,
                    color: "white",
                  }}
                  className="capitalize"
                >
                  {selectedEntry.chemotypeClass}
                </Badge>
              )}
              
              {selectedEntry.description && (
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {selectedEntry.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Beaker className="h-3 w-3" />
                <span>{selectedEntry.evidenceCount || 0} évidences</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Liste des périodes en bas */}
      <div className="border-t p-2 max-h-32 overflow-y-auto">
        <div className="flex flex-wrap gap-1">
          {timelineData.map(entry => (
            <Button
              key={entry.periodCode}
              variant={selectedPeriod === entry.periodCode ? "default" : "outline"}
              size="sm"
              className="text-xs h-7"
              style={{
                borderColor: entry.color || chemotypeColors[entry.chemotypeClass || 'other'],
                ...(selectedPeriod === entry.periodCode && {
                  backgroundColor: entry.color || chemotypeColors[entry.chemotypeClass || 'other'],
                }),
              }}
              onClick={() => onPeriodSelect?.(entry.periodCode)}
              onMouseEnter={() => setHoveredPeriod(entry.periodCode)}
              onMouseLeave={() => setHoveredPeriod(null)}
            >
              {entry.periodName}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
