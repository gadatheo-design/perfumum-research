/**
 * Carte interactive des terroirs PERFUMUM
 * Affiche les terroirs géographiquement avec leurs plantes associées
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { MapView } from "./Map";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Leaf, Thermometer, Globe, X, Filter, Layers } from "lucide-react";

// Types pour les terroirs (basé sur le schéma de la base de données)
interface Terroir {
  id: number;
  name: string;
  country: string;
  region: string | null;
  latitude: string | null;
  longitude: string | null;
  climateType: string | null;
  // Champs optionnels du schéma
  terroirId?: string;
  subRegion?: string | null;
  altitude?: string | null;
  climate?: string | null;
  soilType?: string | null;
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
  tropical: "#22c55e",      // Vert
  subtropical: "#84cc16",   // Vert lime
  mediterranean: "#f59e0b", // Orange
  continental: "#3b82f6",   // Bleu
  arid: "#ef4444",          // Rouge
  semi_arid: "#f97316",     // Orange foncé
  equatorial: "#10b981",    // Émeraude
  alpine: "#6366f1",        // Indigo
  oceanic: "#06b6d4",       // Cyan
  default: "#8b5cf6",       // Violet
};

// Icône personnalisée pour les marqueurs
function createMarkerContent(terroir: Terroir, plantCount: number): HTMLElement {
  const div = document.createElement("div");
  const color = CLIMATE_COLORS[terroir.climateType || "default"] || CLIMATE_COLORS.default;
  
  div.innerHTML = `
    <div style="
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      width: ${Math.min(40 + plantCount * 2, 60)}px;
      height: ${Math.min(40 + plantCount * 2, 60)}px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      cursor: pointer;
      transition: transform 0.2s;
    ">
      <span style="color: white; font-weight: bold; font-size: ${plantCount > 9 ? '12px' : '14px'};">
        ${plantCount}
      </span>
    </div>
  `;
  
  return div;
}

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
    <Card className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] overflow-hidden z-10 shadow-xl">
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
              {terroir.climateType}
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
    <Card className="absolute bottom-4 left-4 z-10 shadow-lg">
      <CardHeader className="py-2 px-3">
        <CardTitle className="text-sm flex items-center gap-1">
          <Layers className="h-4 w-4" />
          Climats
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3">
        <div className="flex flex-wrap gap-1">
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
              {climate}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant principal
export function TerroirMap({ className }: { className?: string }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [selectedTerroirId, setSelectedTerroirId] = useState<number | null>(null);
  const [climateFilter, setClimateFilter] = useState<string | null>(null);

  // Récupérer tous les terroirs
  const { data: terroirs, isLoading: terroirsLoading } = trpc.terroirs.getAll.useQuery();
  
  // Récupérer les statistiques des plantes par terroir
  const { data: plantTerroirStats } = trpc.plantTerroirs.getNetworkStats.useQuery();
  
  // Récupérer les plantes du terroir sélectionné
  const { data: selectedTerroirPlants, isLoading: plantsLoading } = trpc.plantTerroirs.getByTerroir.useQuery(
    selectedTerroirId!,
    { enabled: !!selectedTerroirId }
  );

  // Terroir sélectionné
  const selectedTerroir = terroirs?.find(t => t.id === selectedTerroirId) as Terroir | undefined ?? null;

  // Filtrer les terroirs par climat
  const filteredTerroirs = (terroirs?.filter(t => {
    if (!climateFilter) return true;
    return t.climateType === climateFilter;
  }) || []) as Terroir[];

  // Compter les plantes par terroir (simplifié)
  const getPlantCount = useCallback((terroirId: number): number => {
    // Pour l'instant, retourne une valeur par défaut
    // On pourrait améliorer avec une requête spécifique
    return 5;
  }, []);

  // Initialiser la carte avec les marqueurs
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // Centre initial sur l'Europe/Afrique
    map.setCenter({ lat: 20, lng: 10 });
    map.setZoom(2);
  }, []);

  // Mettre à jour les marqueurs quand les terroirs changent
  useEffect(() => {
    if (!mapRef.current || !filteredTerroirs.length) return;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach(marker => {
      marker.map = null;
    });
    markersRef.current = [];

    // Créer les nouveaux marqueurs
    filteredTerroirs.forEach(terroir => {
      if (!terroir.latitude || !terroir.longitude) return;

      const lat = parseFloat(terroir.latitude);
      const lng = parseFloat(terroir.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return;

      const plantCount = getPlantCount(terroir.id);
      
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current!,
        position: { lat, lng },
        title: terroir.name,
        content: createMarkerContent(terroir, plantCount),
      });

      // Événement de clic
      marker.addListener("click", () => {
        setSelectedTerroirId(terroir.id);
        
        // Centrer la carte sur le terroir
        mapRef.current?.panTo({ lat, lng });
        mapRef.current?.setZoom(6);
      });

      markersRef.current.push(marker);
    });

    // Ajuster la vue pour montrer tous les marqueurs
    if (markersRef.current.length > 0 && !selectedTerroirId) {
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach(marker => {
        if (marker.position) {
          bounds.extend(marker.position as google.maps.LatLng);
        }
      });
      mapRef.current?.fitBounds(bounds);
    }
  }, [filteredTerroirs, getPlantCount, selectedTerroirId]);

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
      <MapView
        className="w-full h-[600px] rounded-lg overflow-hidden"
        initialCenter={{ lat: 20, lng: 10 }}
        initialZoom={2}
        onMapReady={handleMapReady}
      />

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

      {/* Statistiques */}
      <Card className="absolute top-4 left-4 z-10 shadow-lg">
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
                {climateFilter}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TerroirMap;
