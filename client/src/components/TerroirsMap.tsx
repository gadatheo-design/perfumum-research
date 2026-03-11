import { useRef, useCallback, useState } from "react";
import { MapView } from "@/components/Map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  MapPin, 
  Thermometer, 
  Mountain, 
  Leaf,
  ExternalLink,
  X
} from "lucide-react";

// Types
interface Terroir {
  id: number;
  terroirId: string;
  name: string;
  country: string;
  region?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  climateType?: string | null;
  soilType?: string | null;
  altitude?: string | null;
  qualityRating?: string | null;
  reputation?: string | null;
  mainCrops?: string[] | null;
}

interface TerroirsMapProps {
  terroirs: Terroir[];
  className?: string;
  onTerroirSelect?: (terroir: Terroir) => void;
}

// Mapping des types de climat vers des couleurs de marqueur
const climateColors: Record<string, string> = {
  tropical: "#f97316",
  subtropical: "#eab308",
  mediterranean: "#f59e0b",
  oceanic: "#3b82f6",
  continental: "#6b7280",
  arid: "#ef4444",
  semi_arid: "#fb923c",
  alpine: "#93c5fd",
  equatorial: "#22c55e",
  other: "#8b5cf6",
};

// Mapping des qualités vers des couleurs
const qualityColors: Record<string, string> = {
  exceptional: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  excellent: "bg-green-500/10 text-green-600 border-green-500/30",
  good: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  standard: "bg-gray-500/10 text-gray-600 border-gray-500/30",
  variable: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  unknown: "bg-gray-500/10 text-gray-500 border-gray-500/30",
};

export function TerroirsMap({ terroirs, className, onTerroirSelect }: TerroirsMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [selectedTerroir, setSelectedTerroir] = useState<Terroir | null>(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState<{ x: number; y: number } | null>(null);

  // Filtrer les terroirs avec des coordonnées valides
  const terroirsWithCoords = terroirs.filter(
    (t) => t.latitude && t.longitude && 
           !isNaN(parseFloat(t.latitude)) && 
           !isNaN(parseFloat(t.longitude))
  );

  // Calculer le centre de la carte basé sur les terroirs
  const getMapCenter = useCallback(() => {
    if (terroirsWithCoords.length === 0) {
      return { lat: 43.5528, lng: 7.0174 }; // Grasse, France par défaut
    }
    
    const sumLat = terroirsWithCoords.reduce((sum, t) => sum + parseFloat(t.latitude!), 0);
    const sumLng = terroirsWithCoords.reduce((sum, t) => sum + parseFloat(t.longitude!), 0);
    
    return {
      lat: sumLat / terroirsWithCoords.length,
      lng: sumLng / terroirsWithCoords.length,
    };
  }, [terroirsWithCoords]);

  // Créer un marqueur personnalisé
  const createMarkerContent = (terroir: Terroir, isSelected: boolean) => {
    const color = climateColors[terroir.climateType || "other"] || "#8b5cf6";
    const size = isSelected ? 40 : 32;
    
    const container = document.createElement("div");
    container.className = "marker-container";
    container.style.cssText = `
      cursor: pointer;
      transition: transform 0.2s ease;
      transform: ${isSelected ? "scale(1.2)" : "scale(1)"};
    `;
    
    container.innerHTML = `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <div style="
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid ${color};
      "></div>
    `;
    
    return container;
  };

  // Initialiser les marqueurs quand la carte est prête
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // Nettoyer les anciens marqueurs
    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    // Créer les nouveaux marqueurs
    terroirsWithCoords.forEach((terroir) => {
      const position = {
        lat: parseFloat(terroir.latitude!),
        lng: parseFloat(terroir.longitude!),
      };

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        title: terroir.name,
        content: createMarkerContent(terroir, false),
      });

      // Ajouter l'événement de clic
      marker.addListener("click", () => {
        // Mettre à jour le marqueur sélectionné
        markersRef.current.forEach((m, idx) => {
          const t = terroirsWithCoords[idx];
          if (m.content instanceof HTMLElement) {
            m.content.innerHTML = createMarkerContent(t, t.id === terroir.id).innerHTML;
          }
        });

        setSelectedTerroir(terroir);
        onTerroirSelect?.(terroir);

        // Centrer la carte sur le terroir
        map.panTo(position);
      });

      markersRef.current.push(marker);
    });

    // Ajuster le zoom pour voir tous les marqueurs
    if (terroirsWithCoords.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      terroirsWithCoords.forEach((t) => {
        bounds.extend({
          lat: parseFloat(t.latitude!),
          lng: parseFloat(t.longitude!),
        });
      });
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }
  }, [terroirsWithCoords, onTerroirSelect]);

  const closeInfoCard = () => {
    setSelectedTerroir(null);
    // Réinitialiser tous les marqueurs
    markersRef.current.forEach((marker, idx) => {
      const t = terroirsWithCoords[idx];
      if (marker.content instanceof HTMLElement) {
        marker.content.innerHTML = createMarkerContent(t, false).innerHTML;
      }
    });
  };

  return (
    <div className={`relative ${className}`}>
      <MapView
        className="w-full h-[500px] rounded-lg overflow-hidden"
        initialCenter={getMapCenter()}
        initialZoom={terroirsWithCoords.length > 0 ? 4 : 5}
        onMapReady={handleMapReady}
      />

      {/* Légende */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border max-w-[200px]">
        <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
          Climat
        </h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {Object.entries(climateColors).slice(0, 8).map(([climate, color]) => (
            <div key={climate} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize text-muted-foreground">
                {climate.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques */}
      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {terroirsWithCoords.length} terroir{terroirsWithCoords.length > 1 ? "s" : ""} sur la carte
          </span>
        </div>
        {terroirs.length - terroirsWithCoords.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {terroirs.length - terroirsWithCoords.length} sans coordonnées
          </p>
        )}
      </div>

      {/* Carte d'information du terroir sélectionné */}
      {selectedTerroir && (
        <Card className="absolute top-4 right-4 w-80 shadow-xl border-2 animate-in slide-in-from-right-2 duration-200">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {selectedTerroir.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedTerroir.region && `${selectedTerroir.region}, `}
                  {selectedTerroir.country}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={closeInfoCard}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {selectedTerroir.qualityRating && selectedTerroir.qualityRating !== "unknown" && (
                <Badge className={qualityColors[selectedTerroir.qualityRating]}>
                  {selectedTerroir.qualityRating}
                </Badge>
              )}
              {selectedTerroir.climateType && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3" />
                  {selectedTerroir.climateType.replace(/_/g, " ")}
                </Badge>
              )}
              {selectedTerroir.soilType && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Mountain className="h-3 w-3" />
                  {selectedTerroir.soilType}
                </Badge>
              )}
            </div>

            {/* Réputation */}
            {selectedTerroir.reputation && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {selectedTerroir.reputation}
              </p>
            )}

            {/* Cultures principales */}
            {selectedTerroir.mainCrops && selectedTerroir.mainCrops.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Cultures principales
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedTerroir.mainCrops.slice(0, 5).map((crop, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      <Leaf className="h-3 w-3 mr-1" />
                      {crop}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Link href={`/terroirs/${selectedTerroir.id}`} className="flex-1">
                <Button variant="default" size="sm" className="w-full">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Voir le terroir
                </Button>
              </Link>
              <Link href={`/plants?origin=${encodeURIComponent(selectedTerroir.name)}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Leaf className="h-3 w-3 mr-1" />
                  Plantes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
