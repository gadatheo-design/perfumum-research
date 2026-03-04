// @ts-nocheck
import { useState, useCallback, useMemo, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Info
} from "lucide-react";

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

interface PlantTerroir {
  id: number;
  plantId: number;
  terroirId: number;
  localName: string | null;
  cultivationStart: number | null;
  annualProduction: string | null;
  qualityNotes: string | null;
  notes: string | null;
  plant?: {
    id: number;
    name: string;
    family: string | null;
  };
  terroir?: Terroir;
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

const getClimateColor = (climate: string | null): string => {
  if (!climate) return climateColors.other;
  const normalized = climate.toLowerCase().replace(/[- ]/g, "_");
  return climateColors[normalized] || climateColors.other;
};

const getClimateLabel = (climate: string | null): string => {
  if (!climate) return "Non défini";
  const labels: Record<string, string> = {
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
  return labels[climate] || climate;
};

export default function CarteTerroirsPlantes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedClimate, setSelectedClimate] = useState<string>("all");
  const [selectedTerroir, setSelectedTerroir] = useState<Terroir | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [activeTab, setActiveTab] = useState<string>("carte");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Récupérer tous les terroirs
  const { data: terroirs, isLoading: isLoadingTerroirs } = trpc.terroirs.getAll.useQuery();

  // Récupérer toutes les connexions plantes-terroirs
  const { data: plantTerroirs, isLoading: isLoadingConnections } = trpc.plantTerroirs.getAll.useQuery();

  // Récupérer les plantes du terroir sélectionné
  const { data: terroirPlants, isLoading: isLoadingPlants } = trpc.plantTerroirs.getByTerroir.useQuery(
    selectedTerroir?.id ?? 0,
    { enabled: !!selectedTerroir }
  );

  // Statistiques des connexions
  const { data: networkStats } = trpc.plantTerroirs.getNetworkStats.useQuery();

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

  // Callback quand la carte est prête
  const handleMapReady = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
    map.setCenter({ lat: 25, lng: 10 });
    map.setZoom(2);
  }, []);

  // Mettre à jour les marqueurs quand les terroirs changent
  useEffect(() => {
    if (!mapInstance) return;

    // Supprimer les anciens marqueurs
    markers.forEach(marker => marker.setMap(null));

    // Créer les nouveaux marqueurs
    const newMarkers = terroirsWithCoords.map((terroir: Terroir) => {
      const lat = parseFloat(terroir.latitude!);
      const lng = parseFloat(terroir.longitude!);
      
      if (isNaN(lat) || isNaN(lng)) return null;

      // Taille du marqueur basée sur le nombre de plantes
      const plantCount = plantCountByTerroir[terroir.id] || 0;
      const scale = Math.min(8 + plantCount * 1.5, 18);

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        title: `${terroir.name} (${plantCount} plantes)`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: scale,
          fillColor: getClimateColor(terroir.climateType),
          fillOpacity: 0.85,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      // Info window au clic
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 300px; font-family: system-ui, sans-serif;">
            <h3 style="font-weight: 600; font-size: 16px; margin-bottom: 4px; color: #1f2937;">${terroir.name}</h3>
            <p style="color: #6b7280; margin-bottom: 8px; font-size: 14px;">${terroir.country}${terroir.region ? `, ${terroir.region}` : ''}</p>
            
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;">
              ${terroir.climateType ? `<span style="background: ${getClimateColor(terroir.climateType)}20; color: ${getClimateColor(terroir.climateType)}; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${getClimateLabel(terroir.climateType)}</span>` : ''}
              ${terroir.altitude ? `<span style="background: #f3f4f6; color: #4b5563; padding: 2px 8px; border-radius: 12px; font-size: 12px;">⛰️ ${terroir.altitude}</span>` : ''}
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 10px; margin-top: 6px;">
              <p style="font-size: 14px; font-weight: 500; color: #059669; display: flex; align-items: center; gap: 6px;">
                🌿 ${plantCount} plante${plantCount > 1 ? 's' : ''} cultivée${plantCount > 1 ? 's' : ''}
              </p>
            </div>
            
            ${terroir.reputation ? `<p style="font-size: 12px; color: #6b7280; margin-top: 8px; line-height: 1.4;">${terroir.reputation.substring(0, 150)}${terroir.reputation.length > 150 ? '...' : ''}</p>` : ''}
          </div>
        `,
      });

      marker.addListener("click", () => {
        setSelectedTerroir(terroir);
        infoWindow.open(mapInstance, marker);
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
  }, [mapInstance, terroirsWithCoords, plantCountByTerroir]);

  // Centrer la carte sur un terroir
  const focusOnTerroir = (terroir: Terroir) => {
    setSelectedTerroir(terroir);
    if (mapInstance && terroir.latitude && terroir.longitude) {
      const lat = parseFloat(terroir.latitude);
      const lng = parseFloat(terroir.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapInstance.setCenter({ lat, lng });
        mapInstance.setZoom(8);
      }
    }
  };

  // Grouper les terroirs par pays
  const terroirsByCountry = useMemo(() => {
    return filteredTerroirs.reduce((acc: Record<string, Terroir[]>, terroir: Terroir) => {
      const country = terroir.country || "Non défini";
      if (!acc[country]) acc[country] = [];
      acc[country].push(terroir);
      return acc;
    }, {});
  }, [filteredTerroirs]);

  const isLoading = isLoadingTerroirs || isLoadingConnections;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-8 md:py-12 bg-gradient-to-b from-emerald-50/50 to-background dark:from-emerald-950/20">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Map className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Carte des Terroirs & Plantes</h1>
                  <p className="text-muted-foreground">
                    Connexions géographiques entre plantes aromatiques et terroirs de production
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link href="/terroirs">
                  <Button variant="outline" size="sm">
                    <List className="h-4 w-4 mr-2" />
                    Liste des terroirs
                  </Button>
                </Link>
                <Link href="/reseau-plantes-terroirs">
                  <Button variant="outline" size="sm">
                    <Globe className="h-4 w-4 mr-2" />
                    Graphe réseau
                  </Button>
                </Link>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
              <Card className="bg-white/50 dark:bg-white/5">
                <CardContent className="p-3 md:p-4 text-center">
                  <Globe className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-emerald-600" />
                  <p className="text-xl md:text-2xl font-bold">{terroirs?.length || 0}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Terroirs</p>
                </CardContent>
              </Card>
              <Card className="bg-white/50 dark:bg-white/5">
                <CardContent className="p-3 md:p-4 text-center">
                  <Sprout className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-xl md:text-2xl font-bold">{networkStats?.plantsWithTerroirs || 0}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Plantes liées</p>
                </CardContent>
              </Card>
              <Card className="bg-white/50 dark:bg-white/5">
                <CardContent className="p-3 md:p-4 text-center">
                  <TreeDeciduous className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-amber-600" />
                  <p className="text-xl md:text-2xl font-bold">{networkStats?.totalRelations || 0}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Connexions</p>
                </CardContent>
              </Card>
              <Card className="bg-white/50 dark:bg-white/5">
                <CardContent className="p-3 md:p-4 text-center">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-xl md:text-2xl font-bold">{countries.length}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Pays</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-6 md:py-8">
          <div className="container">
            {/* Filtres */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un terroir..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les pays</SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedClimate} onValueChange={setSelectedClimate}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Climat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les climats</SelectItem>
                      {climates.map(climate => (
                        <SelectItem key={climate} value={climate}>{getClimateLabel(climate)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Onglets */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="carte" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">Carte</span>
                </TabsTrigger>
                <TabsTrigger value="liste" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">Liste</span>
                </TabsTrigger>
                <TabsTrigger value="pays" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Par pays</span>
                </TabsTrigger>
              </TabsList>

              {/* Vue Carte */}
              <TabsContent value="carte">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Carte */}
                  <div className="lg:col-span-2">
                    <Card className="overflow-hidden">
                      <div className="h-[400px] md:h-[500px] lg:h-[600px]">
                        <MapView onMapReady={handleMapReady} />
                      </div>
                    </Card>
                    
                    {/* Légende */}
                    <Card className="mt-4">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Légende des climats
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(climateColors).map(([climate, color]) => (
                            <div key={climate} className="flex items-center gap-1.5">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-xs text-muted-foreground">
                                {getClimateLabel(climate)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Panel latéral - Terroir sélectionné ou liste */}
                  <div className="lg:col-span-1">
                    {selectedTerroir ? (
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{selectedTerroir.name}</CardTitle>
                              <CardDescription>
                                {selectedTerroir.country}
                                {selectedTerroir.region && `, ${selectedTerroir.region}`}
                              </CardDescription>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setSelectedTerroir(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Infos terroir */}
                          <div className="flex flex-wrap gap-2">
                            {selectedTerroir.climateType && (
                              <Badge 
                                variant="secondary"
                                style={{ 
                                  backgroundColor: `${getClimateColor(selectedTerroir.climateType)}20`,
                                  color: getClimateColor(selectedTerroir.climateType)
                                }}
                              >
                                <Sun className="h-3 w-3 mr-1" />
                                {getClimateLabel(selectedTerroir.climateType)}
                              </Badge>
                            )}
                            {selectedTerroir.altitude && (
                              <Badge variant="outline">
                                <Mountain className="h-3 w-3 mr-1" />
                                {selectedTerroir.altitude}
                              </Badge>
                            )}
                            {selectedTerroir.annualRainfall && (
                              <Badge variant="outline">
                                💧 {selectedTerroir.annualRainfall}
                              </Badge>
                            )}
                          </div>

                          {selectedTerroir.reputation && (
                            <p className="text-sm text-muted-foreground">
                              {selectedTerroir.reputation}
                            </p>
                          )}

                          {/* Plantes cultivées */}
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Sprout className="h-4 w-4 text-green-600" />
                              Plantes cultivées ({terroirPlants?.length || 0})
                            </h4>
                            {isLoadingPlants ? (
                              <div className="space-y-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                              </div>
                            ) : terroirPlants && terroirPlants.length > 0 ? (
                              <ScrollArea className="h-[200px]">
                                <div className="space-y-2">
                                  {terroirPlants.map((pt: any) => (
                                    <Link key={pt.id} href={`/plants/${pt.plantId}`}>
                                      <div className="p-2 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="font-medium text-sm">{pt.plantName || pt.plant?.name}</p>
                                            {pt.localName && (
                                              <p className="text-xs text-muted-foreground">
                                                Nom local: {pt.localName}
                                              </p>
                                            )}
                                          </div>
                                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        {pt.qualityNotes && (
                                          <p className="text-xs text-muted-foreground mt-1">
                                            {pt.qualityNotes}
                                          </p>
                                        )}
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </ScrollArea>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Aucune plante associée à ce terroir
                              </p>
                            )}
                          </div>

                          <Link href={`/terroirs/${selectedTerroir.id}`}>
                            <Button variant="outline" className="w-full">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Voir la fiche complète
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Terroirs ({filteredTerroirs.length})</CardTitle>
                          <CardDescription>
                            Cliquez sur un marqueur pour voir les détails
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[500px]">
                            <div className="space-y-2">
                              {filteredTerroirs.map((terroir: Terroir) => {
                                const plantCount = plantCountByTerroir[terroir.id] || 0;
                                return (
                                  <div 
                                    key={terroir.id}
                                    className="p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                                    onClick={() => focusOnTerroir(terroir)}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <p className="font-medium">{terroir.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {terroir.country}
                                          {terroir.region && `, ${terroir.region}`}
                                        </p>
                                      </div>
                                      <Badge variant="secondary" className="ml-2">
                                        <Sprout className="h-3 w-3 mr-1" />
                                        {plantCount}
                                      </Badge>
                                    </div>
                                    {terroir.climateType && (
                                      <Badge 
                                        variant="outline" 
                                        className="mt-2"
                                        style={{ 
                                          borderColor: getClimateColor(terroir.climateType),
                                          color: getClimateColor(terroir.climateType)
                                        }}
                                      >
                                        {getClimateLabel(terroir.climateType)}
                                      </Badge>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Vue Liste */}
              <TabsContent value="liste">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-48" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTerroirs.map((terroir: Terroir) => {
                      const plantCount = plantCountByTerroir[terroir.id] || 0;
                      return (
                        <Card 
                          key={terroir.id} 
                          className="hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            setSelectedTerroir(terroir);
                            setActiveTab("carte");
                            focusOnTerroir(terroir);
                          }}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{terroir.name}</CardTitle>
                                <CardDescription>
                                  {terroir.country}
                                  {terroir.region && `, ${terroir.region}`}
                                </CardDescription>
                              </div>
                              <Badge variant="secondary">
                                <Sprout className="h-3 w-3 mr-1" />
                                {plantCount}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {terroir.climateType && (
                                <Badge 
                                  variant="outline"
                                  style={{ 
                                    borderColor: getClimateColor(terroir.climateType),
                                    color: getClimateColor(terroir.climateType)
                                  }}
                                >
                                  <Sun className="h-3 w-3 mr-1" />
                                  {getClimateLabel(terroir.climateType)}
                                </Badge>
                              )}
                              {terroir.altitude && (
                                <Badge variant="outline">
                                  <Mountain className="h-3 w-3 mr-1" />
                                  {terroir.altitude}
                                </Badge>
                              )}
                            </div>
                            {terroir.reputation && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {terroir.reputation}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Vue par pays */}
              <TabsContent value="pays">
                <div className="space-y-8">
                  {Object.entries(terroirsByCountry)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([country, countryTerroirs]) => (
                    <div key={country}>
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-emerald-600" />
                        {country}
                        <Badge variant="secondary">{(countryTerroirs as Terroir[]).length} terroir{(countryTerroirs as Terroir[]).length > 1 ? 's' : ''}</Badge>
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(countryTerroirs as Terroir[]).map((terroir: Terroir) => {
                          const plantCount = plantCountByTerroir[terroir.id] || 0;
                          return (
                            <Card 
                              key={terroir.id}
                              className="hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => {
                                setSelectedTerroir(terroir);
                                setActiveTab("carte");
                                focusOnTerroir(terroir);
                              }}
                            >
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                  <CardTitle className="text-base">{terroir.name}</CardTitle>
                                  <Badge variant="secondary" className="ml-2">
                                    <Sprout className="h-3 w-3 mr-1" />
                                    {plantCount}
                                  </Badge>
                                </div>
                                {terroir.region && (
                                  <CardDescription>{terroir.region}</CardDescription>
                                )}
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-1.5">
                                  {terroir.climateType && (
                                    <Badge 
                                      variant="outline"
                                      className="text-xs"
                                      style={{ 
                                        borderColor: getClimateColor(terroir.climateType),
                                        color: getClimateColor(terroir.climateType)
                                      }}
                                    >
                                      {getClimateLabel(terroir.climateType)}
                                    </Badge>
                                  )}
                                  {terroir.altitude && (
                                    <Badge variant="outline" className="text-xs">
                                      {terroir.altitude}
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
