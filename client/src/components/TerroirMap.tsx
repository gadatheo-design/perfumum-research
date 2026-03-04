// @ts-nocheck
/**
 * Carte interactive des terroirs PERFUMUM avec clustering
 * Affiche les terroirs géographiquement avec regroupement des marqueurs dans les zones denses
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { MapView } from "./Map";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Leaf, Thermometer, X, Filter, Layers, ZoomIn } from "lucide-react";
import { MarkerClusterer, SuperClusterAlgorithm } from "@googlemaps/markerclusterer";

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

// Icône personnalisée pour les marqueurs individuels
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

// Renderer personnalisé pour les clusters
function createClusterRenderer() {
  return {
    render: ({ count, position }: { count: number; position: google.maps.LatLng }) => {
      // Taille du cluster basée sur le nombre de marqueurs
      const size = Math.min(50 + Math.log2(count) * 10, 80);
      
      // Couleur du cluster basée sur la densité
      let bgColor = "#8b5cf6"; // Violet par défaut
      if (count >= 10) bgColor = "#ef4444"; // Rouge pour haute densité
      else if (count >= 5) bgColor = "#f59e0b"; // Orange pour densité moyenne
      else if (count >= 3) bgColor = "#3b82f6"; // Bleu pour faible densité
      
      const div = document.createElement("div");
      div.innerHTML = `
        <div style="
          background: linear-gradient(135deg, ${bgColor}, ${bgColor}dd);
          border: 4px solid white;
          border-radius: 50%;
          width: ${size}px;
          height: ${size}px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
          cursor: pointer;
          transition: all 0.3s ease;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
          <span style="color: white; font-weight: bold; font-size: ${size > 60 ? '18px' : '16px'}; line-height: 1;">
            ${count}
          </span>
          <span style="color: rgba(255,255,255,0.8); font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px;">
            terroirs
          </span>
        </div>
      `;
      
      return new google.maps.marker.AdvancedMarkerElement({
        position,
        content: div,
      });
    },
  };
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

// Info-bulle pour les clusters
function ClusterInfoTooltip({ 
  terroirs, 
  position, 
  onClose,
  onZoomIn 
}: { 
  terroirs: Terroir[];
  position: { x: number; y: number };
  onClose: () => void;
  onZoomIn: () => void;
}) {
  return (
    <Card 
      className="absolute z-20 shadow-xl w-72"
      style={{ 
        left: Math.min(position.x, window.innerWidth - 300),
        top: Math.min(position.y, window.innerHeight - 200)
      }}
    >
      <CardHeader className="py-2 px-3 relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-1 right-1 h-5 w-5"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {terroirs.length} terroirs groupés
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3 space-y-2">
        <div className="max-h-32 overflow-y-auto space-y-1">
          {terroirs.slice(0, 5).map(t => (
            <div key={t.id} className="flex items-center gap-2 text-xs">
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: CLIMATE_COLORS[t.climateType || "default"] }}
              />
              <span className="truncate">{t.name}</span>
              <span className="text-muted-foreground">({t.country})</span>
            </div>
          ))}
          {terroirs.length > 5 && (
            <p className="text-xs text-muted-foreground italic">
              +{terroirs.length - 5} autres...
            </p>
          )}
        </div>
        <Button 
          size="sm" 
          className="w-full h-7 text-xs"
          onClick={onZoomIn}
        >
          <ZoomIn className="h-3 w-3 mr-1" />
          Zoomer sur cette zone
        </Button>
      </CardContent>
    </Card>
  );
}

// Composant principal
export function TerroirMap({ className }: { className?: string }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const [selectedTerroirId, setSelectedTerroirId] = useState<number | null>(null);
  const [climateFilter, setClimateFilter] = useState<string | null>(null);
  const [clusteringEnabled, setClusteringEnabled] = useState(true);

  // Récupérer tous les terroirs
  const { data: terroirs, isLoading: terroirsLoading } = trpc.terroirs.getAll.useQuery();
  
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
  const getPlantCount = useCallback((_terroirId: number): number => {
    return 5;
  }, []);

  // Initialiser la carte avec les marqueurs
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // Centre initial sur l'Europe/Afrique
    map.setCenter({ lat: 20, lng: 10 });
    map.setZoom(2);
  }, []);

  // Mettre à jour les marqueurs et le clustering quand les terroirs changent
  useEffect(() => {
    if (!mapRef.current || !filteredTerroirs.length) return;

    // Nettoyer l'ancien clusterer
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current.setMap(null);
      clustererRef.current = null;
    }

    // Supprimer les anciens marqueurs
    markersRef.current.forEach(marker => {
      marker.map = null;
    });
    markersRef.current = [];

    // Créer les nouveaux marqueurs
    const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
    
    filteredTerroirs.forEach(terroir => {
      if (!terroir.latitude || !terroir.longitude) return;

      const lat = parseFloat(terroir.latitude);
      const lng = parseFloat(terroir.longitude);
      
      if (isNaN(lat) || isNaN(lng)) return;

      const plantCount = getPlantCount(terroir.id);
      
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat, lng },
        title: terroir.name,
        content: createMarkerContent(terroir, plantCount),
      });

      // Événement de clic sur le marqueur individuel
      marker.addListener("click", () => {
        setSelectedTerroirId(terroir.id);
        
        // Centrer la carte sur le terroir
        mapRef.current?.panTo({ lat, lng });
        mapRef.current?.setZoom(8);
      });

      newMarkers.push(marker);
    });

    markersRef.current = newMarkers;

    // Créer le clusterer si activé
    if (clusteringEnabled && newMarkers.length > 0) {
      clustererRef.current = new MarkerClusterer({
        map: mapRef.current,
        markers: newMarkers,
        algorithm: new SuperClusterAlgorithm({
          radius: 80,
          maxZoom: 12,
        }),
        renderer: createClusterRenderer(),
        onClusterClick: (_, cluster, map) => {
          // Zoom sur le cluster au clic
          const bounds = cluster.bounds;
          if (bounds) {
            map.fitBounds(bounds);
          }
        },
      });
    } else {
      // Ajouter les marqueurs directement à la carte sans clustering
      newMarkers.forEach(marker => {
        marker.map = mapRef.current;
      });
    }

    // Ajuster la vue pour montrer tous les marqueurs
    if (newMarkers.length > 0 && !selectedTerroirId) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        if (marker.position) {
          bounds.extend(marker.position as google.maps.LatLng);
        }
      });
      mapRef.current?.fitBounds(bounds);
    }

    // Cleanup
    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current.setMap(null);
      }
    };
  }, [filteredTerroirs, getPlantCount, selectedTerroirId, clusteringEnabled]);

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

      {/* Statistiques et contrôles */}
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
          <div className="mt-2 pt-2 border-t">
            <Button
              variant={clusteringEnabled ? "default" : "outline"}
              size="sm"
              className="h-6 text-xs w-full"
              onClick={() => setClusteringEnabled(!clusteringEnabled)}
            >
              <Layers className="h-3 w-3 mr-1" />
              {clusteringEnabled ? "Clustering activé" : "Clustering désactivé"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TerroirMap;
