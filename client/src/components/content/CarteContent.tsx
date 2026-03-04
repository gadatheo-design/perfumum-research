// @ts-nocheck
import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapView } from "@/components/Map";
import { 
  MapPin, 
  Search, 
  Globe, 
  Leaf, 
  Mountain, 
  Thermometer,
  ChevronRight,
  X,
  Filter,
  TreeDeciduous,
  Droplets,
  ExternalLink
} from "lucide-react";

interface Terroir {
  id: number;
  terroirId: string;
  name: string;
  country: string;
  region: string | null;
  latitude: string | null;
  longitude: string | null;
  altitude: string | null;
  climateType: string | null;
  soilType: string | null;
}

// Couleurs par type de climat
const climateColors: Record<string, string> = {
  tropical: "#22c55e",
  subtropical: "#84cc16",
  mediterranean: "#f59e0b",
  oceanic: "#3b82f6",
  continental: "#8b5cf6",
  arid: "#ef4444",
  semi_arid: "#f97316",
  alpine: "#06b6d4",
  equatorial: "#10b981",
  other: "#6b7280",
};

const climateLabels: Record<string, string> = {
  tropical: "Tropical",
  subtropical: "Subtropical",
  mediterranean: "Méditerranéen",
  oceanic: "Océanique",
  continental: "Continental",
  arid: "Aride",
  semi_arid: "Semi-aride",
  alpine: "Alpin",
  equatorial: "Équatorial",
  other: "Autre",
};

const getClimateColor = (climate: string | null): string => {
  if (!climate) return climateColors.other;
  const normalized = climate.toLowerCase().replace(/[- ]/g, "_");
  return climateColors[normalized] || climateColors.other;
};

const getClimateLabel = (climate: string | null): string => {
  if (!climate) return "Non défini";
  const normalized = climate.toLowerCase().replace(/[- ]/g, "_");
  return climateLabels[normalized] || climate;
};

// Loading skeleton
function MapSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Skeleton className="h-[500px] rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-[500px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * CarteContent - Interactive map of terroirs for PlantsHub
 */
export function CarteContent() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedClimate, setSelectedClimate] = useState<string>("all");
  const [selectedTerroir, setSelectedTerroir] = useState<Terroir | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  // Récupérer tous les terroirs
  const { data: terroirs, isLoading: isLoadingTerroirs } = trpc.terroirs.getAll.useQuery();

  // Récupérer toutes les connexions plantes-terroirs
  const { data: plantTerroirs, isLoading: isLoadingConnections } = trpc.plantTerroirs.getAll.useQuery();

  // Récupérer les plantes du terroir sélectionné
  const { data: terroirPlants, isLoading: isLoadingPlants } = trpc.plantTerroirs.getByTerroir.useQuery(
    selectedTerroir?.id ?? 0,
    { enabled: !!selectedTerroir }
  );

  // Extraire les pays et climats uniques pour les filtres
  const countries = useMemo(() => {
    if (!terroirs) return [];
    const uniqueCountries = Array.from(new Set(terroirs.map((t: Terroir) => t.country))).filter(Boolean).sort();
    return uniqueCountries as string[];
  }, [terroirs]);

  const climates = useMemo(() => {
    if (!terroirs) return [];
    const uniqueClimates = Array.from(new Set(terroirs.map((t: Terroir) => t.climateType).filter(Boolean))).sort();
    return uniqueClimates as string[];
  }, [terroirs]);

  // Compter les plantes par terroir
  const plantCountByTerroir = useMemo((): Record<number, number> => {
    if (!plantTerroirs) return {};
    const counts: Record<number, number> = {};
    plantTerroirs.forEach((pt: any) => {
      counts[pt.terroirId] = (counts[pt.terroirId] || 0) + 1;
    });
    return counts;
  }, [plantTerroirs]);

  // Filtrer les terroirs
  const filteredTerroirs = useMemo(() => {
    if (!terroirs) return [];
    return terroirs.filter((terroir: Terroir) => {
      const matchesSearch = searchQuery === "" || 
        terroir.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        terroir.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (terroir.region && terroir.region.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCountry = selectedCountry === "all" || terroir.country === selectedCountry;
      const matchesClimate = selectedClimate === "all" || terroir.climateType === selectedClimate;
      
      return matchesSearch && matchesCountry && matchesClimate;
    });
  }, [terroirs, searchQuery, selectedCountry, selectedClimate]);

  // Terroirs avec coordonnées valides
  const terroirsWithCoords = useMemo(() => {
    return filteredTerroirs.filter((t: Terroir) => t.latitude && t.longitude);
  }, [filteredTerroirs]);

  // Initialiser la carte
  const handleMapReady = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
    const iw = new google.maps.InfoWindow();
    setInfoWindow(iw);
  }, []);

  // Mettre à jour les marqueurs
  useEffect(() => {
    if (!mapInstance || !terroirsWithCoords.length) return;

    // Supprimer les anciens marqueurs
    markers.forEach(marker => marker.setMap(null));

    // Créer les nouveaux marqueurs
    const newMarkers = terroirsWithCoords.map((terroir: Terroir) => {
      const lat = parseFloat(terroir.latitude!);
      const lng = parseFloat(terroir.longitude!);
      const plantCount = plantCountByTerroir[terroir.id] || 0;
      const color = getClimateColor(terroir.climateType);

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        title: terroir.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8 + Math.min(plantCount * 2, 12),
          fillColor: color,
          fillOpacity: 0.8,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      marker.addListener("click", () => {
        setSelectedTerroir(terroir);
        if (infoWindow) {
          infoWindow.setContent(`
            <div style="padding: 8px; min-width: 150px;">
              <h3 style="font-weight: 600; margin-bottom: 4px;">${terroir.name}</h3>
              <p style="color: #666; font-size: 12px; margin-bottom: 4px;">${terroir.country}${terroir.region ? `, ${terroir.region}` : ''}</p>
              <p style="font-size: 12px;"><strong>${plantCount}</strong> plante${plantCount > 1 ? 's' : ''}</p>
            </div>
          `);
          infoWindow.open(mapInstance, marker);
        }
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Ajuster la vue pour inclure tous les marqueurs
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        const pos = marker.getPosition();
        if (pos) bounds.extend(pos);
      });
      mapInstance.fitBounds(bounds, 50);
    }
  }, [mapInstance, terroirsWithCoords, plantCountByTerroir, infoWindow]);

  // Naviguer vers l'onglet terroirs avec le terroir sélectionné
  const handleViewTerroir = (terroirId: number) => {
    setLocation(`/terroirs/${terroirId}`);
  };

  // Naviguer vers l'onglet plantes avec filtre sur le terroir
  const handleViewPlant = (plantId: number) => {
    setLocation(`/plants/${plantId}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCountry("all");
    setSelectedClimate("all");
    setSelectedTerroir(null);
  };

  const hasActiveFilters = searchQuery || selectedCountry !== "all" || selectedClimate !== "all";

  if (isLoadingTerroirs || isLoadingConnections) {
    return <MapSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          <MapPin className="w-3 h-3 mr-1" />
          {terroirsWithCoords.length} terroirs géolocalisés
        </Badge>
        <Badge variant="outline">
          <Leaf className="w-3 h-3 mr-1 text-green-500" />
          {Object.values(plantCountByTerroir).reduce((a, b) => a + b, 0)} liaisons plantes-terroirs
        </Badge>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un terroir..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full md:w-[150px]">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les pays</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedClimate} onValueChange={setSelectedClimate}>
              <SelectTrigger className="w-full md:w-[150px]">
                <Thermometer className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Climat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les climats</SelectItem>
                {climates.map((climate) => (
                  <SelectItem key={climate} value={climate}>{getClimateLabel(climate)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" size="icon" onClick={clearFilters}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Map and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="h-[500px]">
              <MapView
                onMapReady={handleMapReady}
                defaultCenter={{ lat: 30, lng: 0 }}
                defaultZoom={2}
              />
            </div>
          </Card>
        </div>

        {/* Sidebar - Terroir Details or List */}
        <div>
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                {selectedTerroir ? (
                  <>
                    <MapPin className="w-4 h-4 text-primary" />
                    {selectedTerroir.name}
                  </>
                ) : (
                  <>
                    <Filter className="w-4 h-4" />
                    Terroirs ({filteredTerroirs.length})
                  </>
                )}
              </CardTitle>
              {selectedTerroir && (
                <CardDescription className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {selectedTerroir.country}
                  {selectedTerroir.region && `, ${selectedTerroir.region}`}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              {selectedTerroir ? (
                <div className="p-4 space-y-4">
                  {/* Terroir info */}
                  <div className="flex flex-wrap gap-2">
                    {selectedTerroir.climateType && (
                      <Badge 
                        variant="secondary" 
                        style={{ backgroundColor: `${getClimateColor(selectedTerroir.climateType)}20`, color: getClimateColor(selectedTerroir.climateType) }}
                      >
                        <Thermometer className="w-3 h-3 mr-1" />
                        {getClimateLabel(selectedTerroir.climateType)}
                      </Badge>
                    )}
                    {selectedTerroir.altitude && (
                      <Badge variant="outline">
                        <Mountain className="w-3 h-3 mr-1" />
                        {selectedTerroir.altitude}m
                      </Badge>
                    )}
                  </div>

                  {/* Plants in this terroir */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-500" />
                      Plantes associées ({plantCountByTerroir[selectedTerroir.id] || 0})
                    </h4>
                    {isLoadingPlants ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-8" />)}
                      </div>
                    ) : terroirPlants && terroirPlants.length > 0 ? (
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-1">
                          {terroirPlants.map((pt: any) => (
                            <Button
                              key={pt.id}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-left h-auto py-2"
                              onClick={() => handleViewPlant(pt.plantId)}
                            >
                              <TreeDeciduous className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
                              <span className="truncate">{pt.plantName || `Plante #${pt.plantId}`}</span>
                              <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0" />
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucune plante associée</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedTerroir(null)}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Fermer
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewTerroir(selectedTerroir.id)}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Voir fiche
                    </Button>
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <div className="p-2 space-y-1">
                    {filteredTerroirs.slice(0, 50).map((terroir: Terroir) => (
                      <Button
                        key={terroir.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => {
                          setSelectedTerroir(terroir);
                          if (mapInstance && terroir.latitude && terroir.longitude) {
                            mapInstance.panTo({
                              lat: parseFloat(terroir.latitude),
                              lng: parseFloat(terroir.longitude)
                            });
                            mapInstance.setZoom(8);
                          }
                        }}
                      >
                        <div 
                          className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                          style={{ backgroundColor: getClimateColor(terroir.climateType) }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{terroir.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {terroir.country}
                            {plantCountByTerroir[terroir.id] ? ` • ${plantCountByTerroir[terroir.id]} plantes` : ''}
                          </div>
                        </div>
                        <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0" />
                      </Button>
                    ))}
                    {filteredTerroirs.length > 50 && (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        +{filteredTerroirs.length - 50} autres terroirs
                      </p>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Legend */}
      <Card className="bg-card/50">
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-medium">Légende :</span>
            {Object.entries(climateLabels).slice(0, 6).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: climateColors[key] }}
                />
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CarteContent;
