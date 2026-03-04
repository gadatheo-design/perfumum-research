// @ts-nocheck
/**
 * Carte interactive des terroirs PERFUMUM avec Leaflet/OpenStreetMap
 * Alternative à Google Maps pour une meilleure fiabilité
 */

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Leaf, Thermometer, Globe, X, Filter, Layers, RefreshCw } from "lucide-react";

// Types pour les terroirs
interface Terroir {
  id: number;
  name: string;
  country: string;
  region: string | null;
  latitude: string | null;
  longitude: string | null;
  climateType: string | null;
  description?: string | null;
}

interface PlantTerroir {
  plantId: number;
  plantName: string;
  latinName: string | null;
  category: string;
  localName: string | null;
}

// Couleurs par type de climat
const CLIMATE_COLORS: Record<string, string> = {
  tropical: "#22c55e",
  subtropical: "#84cc16",
  mediterranean: "#f59e0b",
  continental: "#3b82f6",
  arid: "#ef4444",
  semi_arid: "#f97316",
  equatorial: "#10b981",
  alpine: "#6366f1",
  oceanic: "#06b6d4",
  default: "#8b5cf6",
};

const CLIMATE_LABELS: Record<string, string> = {
  tropical: "Tropical",
  subtropical: "Subtropical",
  mediterranean: "Méditerranéen",
  continental: "Continental",
  arid: "Aride",
  semi_arid: "Semi-aride",
  equatorial: "Équatorial",
  alpine: "Alpin",
  oceanic: "Océanique",
};

// Panneau d'information du terroir
function TerroirInfoPanel({ 
  terroir, 
  plants, 
  isLoading,
  onClose 
}: { 
  terroir: Terroir | null;
  plants: PlantTerroir[];
  isLoading: boolean;
  onClose: () => void;
}) {
  if (!terroir) return null;

  const climateColor = CLIMATE_COLORS[terroir.climateType || "default"] || CLIMATE_COLORS.default;

  return (
    <Card className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] overflow-hidden z-[1000] shadow-xl bg-background/95 backdrop-blur">
      <CardHeader className="pb-2 relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-6 w-6"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex items-start gap-2">
          <div 
            className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
            style={{ backgroundColor: climateColor }}
          />
          <div>
            <CardTitle className="text-lg pr-6">{terroir.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {terroir.country}{terroir.region ? ` • ${terroir.region}` : ""}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 overflow-y-auto max-h-[400px]">
        {/* Informations du terroir */}
        <div className="flex flex-wrap gap-2">
          {terroir.climateType && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Thermometer className="h-3 w-3" />
              {CLIMATE_LABELS[terroir.climateType] || terroir.climateType}
            </Badge>
          )}
          <Badge variant="outline" className="flex items-center gap-1">
            <Leaf className="h-3 w-3" />
            {plants.length} plantes
          </Badge>
        </div>

        {terroir.description && (
          <p className="text-sm text-muted-foreground">{terroir.description}</p>
        )}

        {/* Liste des plantes */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-1">
            <Leaf className="h-4 w-4 text-green-600" />
            Plantes associées
          </h4>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : plants.length > 0 ? (
            <div className="space-y-1">
              {plants.map((plant) => (
                <div 
                  key={plant.plantId}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{plant.plantName}</p>
                    {plant.latinName && (
                      <p className="text-xs text-muted-foreground italic">{plant.latinName}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {plant.category}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">Aucune plante associée</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Légende des climats
function ClimateLegend({ onFilterChange, currentFilter }: { 
  onFilterChange: (climate: string | null) => void;
  currentFilter: string | null;
}) {
  const climates = Object.entries(CLIMATE_COLORS).filter(([key]) => key !== "default");

  return (
    <Card className="absolute bottom-4 left-4 z-[1000] shadow-lg bg-background/95 backdrop-blur">
      <CardHeader className="py-2 px-3">
        <CardTitle className="text-sm flex items-center gap-1">
          <Layers className="h-4 w-4" />
          Filtrer par climat
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3">
        <div className="flex flex-wrap gap-1 max-w-[300px]">
          <Button
            variant={currentFilter === null ? "default" : "ghost"}
            size="sm"
            className="h-6 text-xs"
            onClick={() => onFilterChange(null)}
          >
            Tous
          </Button>
          {climates.map(([climate, color]) => (
            <Button
              key={climate}
              variant={currentFilter === climate ? "default" : "ghost"}
              size="sm"
              className="h-6 text-xs flex items-center gap-1"
              onClick={() => onFilterChange(currentFilter === climate ? null : climate)}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              {CLIMATE_LABELS[climate] || climate}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant principal
export function TerroirMapLeaflet({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const [selectedTerroirId, setSelectedTerroirId] = useState<number | null>(null);
  const [climateFilter, setClimateFilter] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Récupérer tous les terroirs
  const { data: terroirs, isLoading: terroirsLoading, refetch } = trpc.terroirs.getAll.useQuery();
  
  // Récupérer les plantes du terroir sélectionné
  const { data: selectedTerroirPlants, isLoading: plantsLoading } = trpc.plantTerroirs.getByTerroir.useQuery(
    selectedTerroirId!,
    { enabled: !!selectedTerroirId }
  );

  // Terroir sélectionné
  const selectedTerroir = terroirs?.find((t: any) => t.id === selectedTerroirId) as Terroir | undefined ?? null;

  // Filtrer les terroirs par climat
  const filteredTerroirs = (terroirs?.filter((t: any) => {
    if (!climateFilter) return true;
    return t.climateType === climateFilter;
  }) || []) as Terroir[];

  // Initialiser la carte Leaflet
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20, 10],
      zoom: 2,
      zoomControl: true,
      attributionControl: true,
    });

    // Tuiles CartoDB (style plus élégant)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  // Mettre à jour les marqueurs quand les terroirs changent
  useEffect(() => {
    if (!mapRef.current || !isMapReady || !filteredTerroirs.length) return;

    const map = mapRef.current;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Créer les nouveaux marqueurs
    const bounds = L.latLngBounds([]);
    
    filteredTerroirs.forEach(terroir => {
      if (!terroir.latitude || !terroir.longitude) return;

      const lat = parseFloat(terroir.latitude);
      const lng = parseFloat(terroir.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return;

      const color = CLIMATE_COLORS[terroir.climateType || "default"] || CLIMATE_COLORS.default;
      
      const marker = L.circleMarker([lat, lng], {
        radius: 12,
        fillColor: color,
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85,
      }).addTo(map);

      // Tooltip au survol
      marker.bindTooltip(`<strong>${terroir.name}</strong><br/>${terroir.country}`, {
        direction: "top",
        offset: [0, -10],
      });

      // Clic pour sélectionner
      marker.on("click", () => {
        setSelectedTerroirId(terroir.id);
        map.setView([lat, lng], 6, { animate: true });
      });

      markersRef.current.push(marker);
      bounds.extend([lat, lng]);
    });

    // Ajuster la vue pour montrer tous les marqueurs
    if (markersRef.current.length > 0 && !selectedTerroirId) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [filteredTerroirs, isMapReady, selectedTerroirId]);

  // Transformer les données des plantes pour l'affichage
  const plantsForDisplay: PlantTerroir[] = selectedTerroirPlants?.map((p: any) => ({
    plantId: p.plantId || p.id,
    plantName: p.plantName || p.name,
    latinName: p.latinName || p.latin_name,
    category: p.category || "aromatique",
    localName: p.localName || p.local_name,
  })) || [];

  if (terroirsLoading) {
    return (
      <div className={`relative ${className}`}>
        <Skeleton className="w-full h-[600px]" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Carte */}
      <div 
        ref={containerRef}
        className="w-full h-[600px] rounded-lg overflow-hidden"
        style={{ zIndex: 1 }}
      />

      {/* Statistiques */}
      <Card className="absolute top-4 left-4 z-[1000] shadow-lg bg-background/95 backdrop-blur">
        <CardContent className="py-2 px-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{filteredTerroirs.length}</span>
              <span className="text-muted-foreground">terroirs</span>
            </div>
            {climateFilter && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                {CLIMATE_LABELS[climateFilter] || climateFilter}
              </Badge>
            )}
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => refetch()}>
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Panneau d'information */}
      <TerroirInfoPanel
        terroir={selectedTerroir}
        plants={plantsForDisplay}
        isLoading={plantsLoading}
        onClose={() => setSelectedTerroirId(null)}
      />

      {/* Légende des climats */}
      <ClimateLegend
        onFilterChange={setClimateFilter}
        currentFilter={climateFilter}
      />
    </div>
  );
}

export default TerroirMapLeaflet;
