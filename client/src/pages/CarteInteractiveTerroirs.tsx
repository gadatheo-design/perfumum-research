// @ts-nocheck
import { useState, useCallback, useMemo, useEffect } from "react";
import { trpc } from "@/lib/trpc";
// DashboardLayout removed — public page, no auth required
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MapView } from "@/components/Map";
import { Link } from "wouter";
import { 
  MapPin, 
  Search, 
  Globe, 
  Leaf, 
  Mountain, 
  Sun, 
  Thermometer,
  ExternalLink,
  ChevronRight,
  X,
  FlaskConical,
  Sprout,
  Filter,
  Map,
  List,
  Grid,
  TreeDeciduous,
  Flower2,
  Info,
  RefreshCw,
  Layers,
  Network,
  Droplets,
  Wind,
  BarChart3
} from "lucide-react";
import { TabErrorBoundary } from "@/components/TabErrorBoundary";

interface Terroir {
  id: number;
  terroirId: string;
  name: string;
  country: string;
  region: string | null;
  subRegion: string | null;
  latitude: string | null;
  longitude: string | null;
  altitude: string | null;
  climateType: string | null;
  avgTemperature: string | null;
  annualRainfall: string | null;
  humidity: string | null;
  soilType: string | null;
  soilPh: string | null;
  soilCharacteristics: string | null;
  mainCrops: any[] | null;
  productionHistory: string | null;
  annualProduction: string | null;
  certifications: any[] | null;
  qualityRating: string | null;
  reputation: string | null;
  notes: string | null;
  imageUrl: string | null;
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

// Couleurs par type de sol
const soilColors: Record<string, string> = {
  clay: "#b45309",
  volcanic: "#dc2626",
  limestone: "#d4d4d4",
  sandy: "#fbbf24",
  loamy: "#65a30d",
  chalky: "#e5e7eb",
  peaty: "#1f2937",
  silty: "#a3a3a3",
};

export default function CarteInteractiveTerroirs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedClimate, setSelectedClimate] = useState<string>("all");
  const [selectedSoil, setSelectedSoil] = useState<string>("all");
  const [selectedTerroir, setSelectedTerroir] = useState<Terroir | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [activeTab, setActiveTab] = useState<string>("carte");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showPlantCount, setShowPlantCount] = useState(true);
  const [showClimateZones, setShowClimateZones] = useState(false);

  // Récupérer tous les terroirs
  const { data: terroirs, isLoading: isLoadingTerroirs, refetch } = trpc.terroirs.getAll.useQuery();

  // Récupérer toutes les connexions plantes-terroirs
  const { data: plantTerroirs, isLoading: isLoadingConnections } = trpc.plantTerroirs.getAll.useQuery();

  // Récupérer les plantes du terroir sélectionné
  const { data: terroirPlants, isLoading: isLoadingPlants } = trpc.plantTerroirs.getByTerroir.useQuery(
    selectedTerroir?.id ?? 0,
    { enabled: !!selectedTerroir }
  );

  // Statistiques des connexions
  const { data: networkStats } = trpc.plantTerroirs.getNetworkStats.useQuery();

  // Extraire les pays, climats et sols uniques pour les filtres
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

  const soilTypes = useMemo(() => {
    if (!terroirs) return [];
    const uniqueSoils = Array.from(new Set(terroirs.map((t: Terroir) => t.soilType).filter(Boolean))).sort();
    return uniqueSoils as string[];
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
      const matchesSoil = selectedSoil === "all" || terroir.soilType === selectedSoil;
      
      return matchesSearch && matchesCountry && matchesClimate && matchesSoil;
    });
  }, [terroirs, searchQuery, selectedCountry, selectedClimate, selectedSoil]);

  // Terroirs avec coordonnées valides
  const terroirsWithCoords = useMemo(() => {
    return filteredTerroirs.filter((t: Terroir) => t.latitude && t.longitude);
  }, [filteredTerroirs]);

  // Statistiques des terroirs filtrés
  const filteredStats = useMemo(() => {
    const totalPlants = filteredTerroirs.reduce((acc: number, t: Terroir) => acc + (plantCountByTerroir[t.id] || 0), 0);
    const withCoords = terroirsWithCoords.length;
    const withoutCoords = filteredTerroirs.length - withCoords;
    
    // Répartition par climat
    const byClimate: Record<string, number> = {};
    filteredTerroirs.forEach((t: Terroir) => {
      const climate = t.climateType || 'other';
      byClimate[climate] = (byClimate[climate] || 0) + 1;
    });
    
    return {
      total: filteredTerroirs.length,
      totalPlants,
      withCoords,
      withoutCoords,
      byClimate,
    };
  }, [filteredTerroirs, terroirsWithCoords, plantCountByTerroir]);

  // Callback quand la carte est prête
  const handleMapReady = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
    map.setCenter({ lat: 25, lng: 10 });
    map.setZoom(2);
    
    // Créer une seule InfoWindow réutilisable
    const iw = new google.maps.InfoWindow();
    setInfoWindow(iw);
  }, []);

  // Mettre à jour les marqueurs quand les terroirs changent
  useEffect(() => {
    if (!mapInstance || !infoWindow) return;

    // Supprimer les anciens marqueurs
    markers.forEach(marker => marker.setMap(null));

    // Créer les nouveaux marqueurs
    const newMarkers = terroirsWithCoords.map((terroir: Terroir) => {
      const lat = parseFloat(terroir.latitude!);
      const lng = parseFloat(terroir.longitude!);
      
      if (isNaN(lat) || isNaN(lng)) return null;

      // Taille du marqueur basée sur le nombre de plantes
      const plantCount = plantCountByTerroir[terroir.id] || 0;
      const baseScale = showPlantCount ? Math.min(8 + plantCount * 2, 20) : 10;

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        title: `${terroir.name} (${plantCount} plantes)`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: baseScale,
          fillColor: getClimateColor(terroir.climateType),
          fillOpacity: 0.85,
          strokeColor: "#ffffff",
          strokeWeight: 2.5,
        },
        animation: google.maps.Animation.DROP,
      });

      // Contenu de l'InfoWindow
      const content = `
        <div style="padding: 16px; max-width: 320px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${getClimateColor(terroir.climateType)};"></div>
            <h3 style="font-weight: 700; font-size: 16px; margin: 0; color: #1f2937;">${terroir.name}</h3>
          </div>
          <p style="color: #6b7280; margin: 0 0 12px 0; font-size: 14px;">
            ${terroir.country}${terroir.region ? `, ${terroir.region}` : ''}
          </p>
          
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
            ${terroir.climateType ? `
              <span style="background: ${getClimateColor(terroir.climateType)}20; color: ${getClimateColor(terroir.climateType)}; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                🌡️ ${getClimateLabel(terroir.climateType)}
              </span>
            ` : ''}
            ${terroir.altitude ? `
              <span style="background: #f3f4f6; color: #4b5563; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                ⛰️ ${terroir.altitude}
              </span>
            ` : ''}
            ${terroir.soilType ? `
              <span style="background: #fef3c7; color: #92400e; padding: 3px 10px; border-radius: 12px; font-size: 12px;">
                🪨 ${terroir.soilType}
              </span>
            ` : ''}
          </div>
          
          ${terroir.avgTemperature || terroir.annualRainfall ? `
            <div style="display: flex; gap: 16px; margin-bottom: 12px; padding: 8px; background: #f9fafb; border-radius: 8px;">
              ${terroir.avgTemperature ? `
                <div style="font-size: 12px;">
                  <span style="color: #9ca3af;">Température</span>
                  <div style="font-weight: 600; color: #1f2937;">${terroir.avgTemperature}</div>
                </div>
              ` : ''}
              ${terroir.annualRainfall ? `
                <div style="font-size: 12px;">
                  <span style="color: #9ca3af;">Précipitations</span>
                  <div style="font-weight: 600; color: #1f2937;">${terroir.annualRainfall}</div>
                </div>
              ` : ''}
            </div>
          ` : ''}
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 12px;">
            <p style="font-size: 14px; font-weight: 600; color: #059669; display: flex; align-items: center; gap: 6px; margin: 0;">
              🌿 ${plantCount} plante${plantCount > 1 ? 's' : ''} cultivée${plantCount > 1 ? 's' : ''}
            </p>
          </div>
          
          ${terroir.reputation ? `
            <p style="font-size: 12px; color: #6b7280; margin: 10px 0 0 0; line-height: 1.5;">
              ${terroir.reputation.substring(0, 150)}${terroir.reputation.length > 150 ? '...' : ''}
            </p>
          ` : ''}
        </div>
      `;

      marker.addListener("click", () => {
        setSelectedTerroir(terroir);
        infoWindow.setContent(content);
        infoWindow.open(mapInstance, marker);
      });

      // Hover effect
      marker.addListener("mouseover", () => {
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: baseScale * 1.3,
          fillColor: getClimateColor(terroir.climateType),
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        });
      });

      marker.addListener("mouseout", () => {
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: baseScale,
          fillColor: getClimateColor(terroir.climateType),
          fillOpacity: 0.85,
          strokeColor: "#ffffff",
          strokeWeight: 2.5,
        });
      });

      return marker;
    }).filter(Boolean) as google.maps.Marker[];

    setMarkers(newMarkers);

    // Ajuster le zoom pour voir tous les marqueurs
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        const pos = marker.getPosition();
        if (pos) bounds.extend(pos);
      });
      mapInstance.fitBounds(bounds);
      
      const listener = google.maps.event.addListener(mapInstance, "idle", () => {
        const zoom = mapInstance.getZoom();
        if (zoom && zoom > 10) mapInstance.setZoom(10);
        google.maps.event.removeListener(listener);
      });
    }
  }, [mapInstance, infoWindow, terroirsWithCoords, plantCountByTerroir, showPlantCount]);

  // Centrer la carte sur un terroir
  const focusOnTerroir = (terroir: Terroir) => {
    setSelectedTerroir(terroir);
    if (mapInstance && terroir.latitude && terroir.longitude) {
      const lat = parseFloat(terroir.latitude);
      const lng = parseFloat(terroir.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapInstance.panTo({ lat, lng });
        mapInstance.setZoom(8);
        
        // Trouver et cliquer sur le marqueur correspondant
        const marker = markers.find(m => {
          const pos = m.getPosition();
          return pos && Math.abs(pos.lat() - lat) < 0.01 && Math.abs(pos.lng() - lng) < 0.01;
        });
        if (marker) {
          google.maps.event.trigger(marker, 'click');
        }
      }
    }
    setActiveTab("carte");
  };

  // Reset des filtres
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCountry("all");
    setSelectedClimate("all");
    setSelectedSoil("all");
    setSelectedTerroir(null);
  };

  if (isLoadingTerroirs) {
    return (
      <div className="container py-6">
        <div className="space-y-6">
          <Skeleton className="h-10 w-96" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20">
              <Globe className="h-8 w-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Carte des Terroirs</h1>
              <p className="text-muted-foreground">
                Explorez les zones de production et leurs plantes aromatiques
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Link href="/graphe-terroir-plante-molecule">
              <Button variant="outline" size="sm">
                <Network className="h-4 w-4 mr-2" />
                Voir le graphe
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">Terroirs</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{filteredStats.total}</p>
              <p className="text-xs text-muted-foreground">{filteredStats.withCoords} géolocalisés</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Plantes</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{filteredStats.totalPlants}</p>
              <p className="text-xs text-muted-foreground">dans ces terroirs</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Pays</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{countries.length}</p>
              <p className="text-xs text-muted-foreground">représentés</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-muted-foreground">Climats</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{climates.length}</p>
              <p className="text-xs text-muted-foreground">types différents</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Recherche */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un terroir, pays ou région..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {/* Filtre par pays */}
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-[160px]">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les pays</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Filtre par climat */}
              <Select value={selectedClimate} onValueChange={setSelectedClimate}>
                <SelectTrigger className="w-[160px]">
                  <Thermometer className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Climat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les climats</SelectItem>
                  {climates.map(climate => (
                    <SelectItem key={climate as string} value={climate as string}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getClimateColor(climate as string) }}
                        />
                        {getClimateLabel(climate as string)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Filtre par sol */}
              <Select value={selectedSoil} onValueChange={setSelectedSoil}>
                <SelectTrigger className="w-[160px]">
                  <Mountain className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les sols</SelectItem>
                  {soilTypes.map(soil => (
                    <SelectItem key={soil as string} value={soil as string}>{soil as string}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Options d'affichage */}
              <div className="flex items-center gap-4 ml-auto">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="show-plant-count" 
                    checked={showPlantCount}
                    onCheckedChange={setShowPlantCount}
                  />
                  <Label htmlFor="show-plant-count" className="text-sm">Taille par plantes</Label>
                </div>
                
                {(searchQuery || selectedCountry !== "all" || selectedClimate !== "all" || selectedSoil !== "all") && (
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Réinitialiser
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="carte" className="gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Carte</span>
            </TabsTrigger>
            <TabsTrigger value="liste" className="gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Liste</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Statistiques</span>
            </TabsTrigger>
          </TabsList>
          
          <TabErrorBoundary>
          <TabsContent value="carte" className="mt-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Carte */}
              <Card className="lg:col-span-3">
                <CardContent className="p-0 overflow-hidden rounded-lg">
                  <MapView 
                    onMapReady={handleMapReady}
                    className="h-[600px] w-full"
                  />
                </CardContent>
              </Card>
              
              {/* Panneau latéral */}
              <div className="space-y-4">
                {/* Légende */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Légende des climats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(climateLabels).map(([key, label]) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: climateColors[key] }}
                          />
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Terroir sélectionné */}
                {selectedTerroir && (
                  <Card className="border-primary/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-orange-500" />
                          {selectedTerroir.name}
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedTerroir(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>
                        {selectedTerroir.country}{selectedTerroir.region ? `, ${selectedTerroir.region}` : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {selectedTerroir.climateType && (
                          <Badge style={{ backgroundColor: `${getClimateColor(selectedTerroir.climateType)}20`, color: getClimateColor(selectedTerroir.climateType) }}>
                            {getClimateLabel(selectedTerroir.climateType)}
                          </Badge>
                        )}
                        {selectedTerroir.altitude && (
                          <Badge variant="outline">⛰️ {selectedTerroir.altitude}</Badge>
                        )}
                      </div>
                      
                      {selectedTerroir.avgTemperature && (
                        <div className="flex items-center gap-2 text-sm">
                          <Thermometer className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedTerroir.avgTemperature}</span>
                        </div>
                      )}
                      
                      {selectedTerroir.annualRainfall && (
                        <div className="flex items-center gap-2 text-sm">
                          <Droplets className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedTerroir.annualRainfall}</span>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium flex items-center gap-2 text-green-600">
                          <Leaf className="h-4 w-4" />
                          {plantCountByTerroir[selectedTerroir.id] || 0} plantes
                        </p>
                        {isLoadingPlants ? (
                          <Skeleton className="h-16 mt-2" />
                        ) : terroirPlants && terroirPlants.length > 0 ? (
                          <div className="mt-2 space-y-1">
                            {terroirPlants.slice(0, 5).map((pt: any) => (
                              <div key={pt.id} className="text-sm text-muted-foreground">
                                • {pt.localName || `Plante #${pt.plantId}`}
                              </div>
                            ))}
                            {terroirPlants.length > 5 && (
                              <p className="text-xs text-muted-foreground">
                                +{terroirPlants.length - 5} autres
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-1">
                            Aucune plante enregistrée
                          </p>
                        )}
                      </div>
                      
                      <Link href={`/terroirs/${selectedTerroir.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Voir la fiche
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          </TabErrorBoundary>
          
          <TabErrorBoundary>
          <TabsContent value="liste" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Liste des terroirs ({filteredTerroirs.length})</CardTitle>
                  <div className="flex gap-1">
                    <Button 
                      variant={viewMode === "grid" ? "secondary" : "ghost"} 
                      size="icon"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={viewMode === "list" ? "secondary" : "ghost"} 
                      size="icon"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {viewMode === "grid" ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredTerroirs.map((terroir: Terroir) => (
                        <Card 
                          key={terroir.id} 
                          className="cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => focusOnTerroir(terroir)}
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{terroir.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {terroir.country}{terroir.region ? `, ${terroir.region}` : ''}
                                </p>
                              </div>
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: getClimateColor(terroir.climateType) }}
                              />
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {terroir.climateType && (
                                <Badge variant="outline" className="text-xs">
                                  {getClimateLabel(terroir.climateType)}
                                </Badge>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                🌿 {plantCountByTerroir[terroir.id] || 0}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredTerroirs.map((terroir: Terroir) => (
                        <div 
                          key={terroir.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => focusOnTerroir(terroir)}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: getClimateColor(terroir.climateType) }}
                            />
                            <div>
                              <p className="font-medium">{terroir.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {terroir.country}{terroir.region ? `, ${terroir.region}` : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              🌿 {plantCountByTerroir[terroir.id] || 0}
                            </Badge>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          </TabErrorBoundary>
          
          <TabErrorBoundary>
          <TabsContent value="stats" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Répartition par climat */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    Répartition par climat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(filteredStats.byClimate)
                      .sort((a, b) => b[1] - a[1])
                      .map(([climate, count]) => (
                        <div key={climate}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: getClimateColor(climate) }}
                              />
                              <span className="text-sm">{getClimateLabel(climate)}</span>
                            </div>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${(count / filteredStats.total) * 100}%`,
                                backgroundColor: getClimateColor(climate)
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Répartition par pays */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Top 10 pays
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {countries
                      .map(country => ({
                        country,
                        count: filteredTerroirs.filter((t: Terroir) => t.country === country).length
                      }))
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 10)
                      .map(({ country, count }) => (
                        <div key={country} className="flex items-center justify-between">
                          <span className="text-sm">{country}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Statistiques globales */}
              {networkStats && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="h-5 w-5" />
                      Statistiques des connexions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="text-3xl font-bold text-primary">{networkStats.totalRelations}</p>
                        <p className="text-sm text-muted-foreground">Relations plante-terroir</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-green-600">{networkStats.plantsWithTerroirs}</p>
                        <p className="text-sm text-muted-foreground">Plantes avec terroirs</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-orange-600">{networkStats.terroirsWithPlants}</p>
                        <p className="text-sm text-muted-foreground">Terroirs avec plantes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          </TabErrorBoundary>
        </Tabs>
      </div>
    </div>
  );
}
