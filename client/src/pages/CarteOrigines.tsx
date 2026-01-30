import { useState, useCallback, useMemo } from "react";
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
  Atom,
  Filter
} from "lucide-react";

interface Origin {
  id: number;
  name: string;
  country: string;
  region: string | null;
  terroir: string | null;
  latitude: string | null;
  longitude: string | null;
  altitude: number | null;
  climate: string | null;
  soilType: string | null;
  harvestPeriod: string | null;
  productionMethod: string | null;
  qualityIndicators: string | null;
  historicalContext: string | null;
  economicImportance: string | null;
  sustainabilityNotes: string | null;
  imageUrl: string | null;
  moleculeCount?: number;
}

interface MoleculeDetail {
  id: number;
  moleculeId: number;
  originId: number;
  isPrimaryOrigin: number | null;
  qualityRating: number | null;
  productionVolume: string | null;
  priceRange: string | null;
  specificCharacteristics: string | null;
  notes: string | null;
  molecule: {
    id: number;
    name: string;
    family: string | null;
    chemicalFormula: string | null;
    olfactiveProfile: string | null;
    casNumber: string | null;
    iupacName: string | null;
    chemicalClass: string | null;
  };
}

export default function CarteOrigines() {
  const [searchQuery, setSearchQuery] = useState("");
  const [moleculeSearch, setMoleculeSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedClimate, setSelectedClimate] = useState<string>("all");
  const [selectedOrigin, setSelectedOrigin] = useState<Origin | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [activeTab, setActiveTab] = useState<string>("terroirs");

  // Récupérer toutes les origines géographiques avec le nombre de molécules
  const { data: origins, isLoading } = trpc.geographicOrigins.listWithMoleculeCount.useQuery();

  // Récupérer les molécules de l'origine sélectionnée
  const { data: originMolecules, isLoading: isLoadingMolecules } = trpc.geographicOrigins.getMoleculesWithDetails.useQuery(
    selectedOrigin?.id ?? 0,
    { enabled: !!selectedOrigin }
  );

  // Recherche d'origines par molécule
  const { data: searchResults } = trpc.geographicOrigins.searchByMolecule.useQuery(
    moleculeSearch,
    { enabled: moleculeSearch.length >= 2 }
  );

  // Extraire les pays et climats uniques pour les filtres
  const countries = useMemo(() => {
    if (!origins) return [];
    const uniqueCountries = Array.from(new Set(origins.map(o => o.country))).filter(Boolean).sort();
    return uniqueCountries;
  }, [origins]);

  const climates = useMemo(() => {
    if (!origins) return [];
    const uniqueClimates = Array.from(new Set(origins.map(o => o.climate).filter(Boolean))).sort();
    return uniqueClimates as string[];
  }, [origins]);

  // Filtrer les origines
  const filteredOrigins = useMemo(() => {
    let baseOrigins = origins || [];
    
    // Si recherche par molécule active, utiliser les résultats de recherche
    if (moleculeSearch.length >= 2 && searchResults) {
      const searchIds = new Set(searchResults.map(r => r.id));
      baseOrigins = baseOrigins.filter(o => searchIds.has(o.id));
    }
    
    return baseOrigins.filter(origin => {
      const matchesSearch = searchQuery === "" || 
        origin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        origin.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (origin.region && origin.region.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCountry = selectedCountry === "all" || origin.country === selectedCountry;
      const matchesClimate = selectedClimate === "all" || origin.climate === selectedClimate;
      
      return matchesSearch && matchesCountry && matchesClimate;
    });
  }, [origins, searchQuery, selectedCountry, selectedClimate, moleculeSearch, searchResults]);

  // Origines avec coordonnées valides
  const originsWithCoords = useMemo(() => {
    return filteredOrigins.filter(o => o.latitude && o.longitude);
  }, [filteredOrigins]);

  // Callback quand la carte est prête
  const handleMapReady = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
    
    // Centrer sur l'Europe par défaut
    map.setCenter({ lat: 35, lng: 20 });
    map.setZoom(2);
  }, []);

  // Mettre à jour les marqueurs quand les origines changent
  useMemo(() => {
    if (!mapInstance) return;

    // Supprimer les anciens marqueurs
    markers.forEach(marker => marker.setMap(null));

    // Créer les nouveaux marqueurs
    const newMarkers = originsWithCoords.map(origin => {
      const lat = parseFloat(origin.latitude!);
      const lng = parseFloat(origin.longitude!);
      
      if (isNaN(lat) || isNaN(lng)) return null;

      // Taille du marqueur basée sur le nombre de molécules
      const moleculeCount = origin.moleculeCount || 0;
      const scale = Math.min(8 + moleculeCount * 0.5, 16);

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        title: `${origin.name} (${moleculeCount} molécules)`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: scale,
          fillColor: getClimateColor(origin.climate),
          fillOpacity: 0.9,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      // Info window au clic avec le nombre de molécules
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 280px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${origin.name}</h3>
            <p style="color: #666; margin-bottom: 4px;">${origin.country}${origin.region ? `, ${origin.region}` : ''}</p>
            ${origin.climate ? `<p style="font-size: 12px; color: #888;">Climat: ${origin.climate}</p>` : ''}
            ${origin.altitude ? `<p style="font-size: 12px; color: #888;">Altitude: ${origin.altitude}m</p>` : ''}
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
              <p style="font-size: 13px; font-weight: 500; color: #d97706;">
                <span style="display: inline-flex; align-items: center; gap: 4px;">
                  🧪 ${moleculeCount} molécule${moleculeCount > 1 ? 's' : ''} associée${moleculeCount > 1 ? 's' : ''}
                </span>
              </p>
            </div>
          </div>
        `,
      });

      marker.addListener("click", () => {
        setSelectedOrigin(origin);
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
      
      // Ne pas zoomer trop près s'il n'y a qu'un seul marqueur
      const listener = google.maps.event.addListener(mapInstance, "idle", () => {
        const zoom = mapInstance.getZoom();
        if (zoom && zoom > 10) mapInstance.setZoom(10);
        google.maps.event.removeListener(listener);
      });
    }
  }, [mapInstance, originsWithCoords]);

  // Centrer la carte sur une origine
  const focusOnOrigin = (origin: Origin) => {
    setSelectedOrigin(origin);
    if (mapInstance && origin.latitude && origin.longitude) {
      const lat = parseFloat(origin.latitude);
      const lng = parseFloat(origin.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapInstance.setCenter({ lat, lng });
        mapInstance.setZoom(8);
      }
    }
  };

  // Statistiques
  const stats = useMemo(() => {
    if (!origins) return { totalOrigins: 0, totalMolecules: 0, withMolecules: 0 };
    const totalMolecules = origins.reduce((sum, o) => sum + (o.moleculeCount || 0), 0);
    const withMolecules = origins.filter(o => (o.moleculeCount || 0) > 0).length;
    return { totalOrigins: origins.length, totalMolecules, withMolecules };
  }, [origins]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 bg-gradient-to-b from-amber-50/50 to-background dark:from-amber-950/20">
          <div className="container">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Globe className="h-7 w-7 text-amber-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Carte des Origines</h1>
                <p className="text-muted-foreground">
                  Terroirs de production et molécules associées à travers le monde
                </p>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="bg-white/50 dark:bg-white/5">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-amber-600">{stats.totalOrigins}</div>
                  <div className="text-sm text-muted-foreground">Terroirs</div>
                </CardContent>
              </Card>
              <Card className="bg-white/50 dark:bg-white/5">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.totalMolecules}</div>
                  <div className="text-sm text-muted-foreground">Liens molécules</div>
                </CardContent>
              </Card>
              <Card className="bg-white/50 dark:bg-white/5">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.withMolecules}</div>
                  <div className="text-sm text-muted-foreground">Terroirs documentés</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Filtres */}
        <section className="py-6 border-b bg-muted/30">
          <div className="container">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
              <TabsList>
                <TabsTrigger value="terroirs" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Par terroir
                </TabsTrigger>
                <TabsTrigger value="molecules" className="gap-2">
                  <Atom className="h-4 w-4" />
                  Par molécule
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row gap-4">
              {activeTab === "terroirs" ? (
                <>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un terroir, pays ou région..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Tous les pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les pays</SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedClimate} onValueChange={setSelectedClimate}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Tous les climats" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les climats</SelectItem>
                      {climates.map(climate => (
                        <SelectItem key={climate} value={climate}>{climate}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <div className="relative flex-1">
                  <FlaskConical className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une molécule (ex: limonène, linalol...)"
                    value={moleculeSearch}
                    onChange={(e) => setMoleculeSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}
              
              {(searchQuery || selectedCountry !== "all" || selectedClimate !== "all" || moleculeSearch) && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCountry("all");
                    setSelectedClimate("all");
                    setMoleculeSearch("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>{filteredOrigins.length} terroir{filteredOrigins.length > 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{originsWithCoords.length} avec coordonnées GPS</span>
              {moleculeSearch.length >= 2 && searchResults && (
                <>
                  <span>•</span>
                  <span className="text-amber-600">{searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} pour "{moleculeSearch}"</span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-8">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Carte */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-amber-600" />
                      Carte Interactive
                    </CardTitle>
                    <CardDescription>
                      Cliquez sur un marqueur pour voir les détails et les molécules associées
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[500px] w-full">
                      <MapView onMapReady={handleMapReady} />
                    </div>
                  </CardContent>
                </Card>

                {/* Légende des couleurs */}
                <Card className="mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Légende</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <LegendItem color="#22c55e" label="Méditerranéen" />
                      <LegendItem color="#3b82f6" label="Tempéré" />
                      <LegendItem color="#f59e0b" label="Tropical" />
                      <LegendItem color="#ef4444" label="Aride" />
                      <LegendItem color="#8b5cf6" label="Continental" />
                      <LegendItem color="#6b7280" label="Autre" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      La taille des marqueurs est proportionnelle au nombre de molécules associées.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Liste des terroirs / Détail */}
              <div>
                {selectedOrigin ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{selectedOrigin.name}</CardTitle>
                          <CardDescription>
                            {selectedOrigin.country}{selectedOrigin.region ? `, ${selectedOrigin.region}` : ''}
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedOrigin(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedOrigin.climate && (
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Climat: {selectedOrigin.climate}</span>
                        </div>
                      )}
                      {selectedOrigin.altitude && (
                        <div className="flex items-center gap-2">
                          <Mountain className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Altitude: {selectedOrigin.altitude}m</span>
                        </div>
                      )}
                      {selectedOrigin.soilType && (
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Sol: {selectedOrigin.soilType}</span>
                        </div>
                      )}
                      {selectedOrigin.harvestPeriod && (
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Récolte: {selectedOrigin.harvestPeriod}</span>
                        </div>
                      )}
                      
                      {/* Section Molécules */}
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <FlaskConical className="h-4 w-4 text-amber-600" />
                          Molécules associées ({selectedOrigin.moleculeCount || 0})
                        </h4>
                        
                        {isLoadingMolecules ? (
                          <div className="space-y-2">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        ) : originMolecules && originMolecules.length > 0 ? (
                          <ScrollArea className="h-[200px]">
                            <div className="space-y-2">
                              {originMolecules.map((mol: MoleculeDetail) => (
                                <Link key={mol.id} href={`/molecules/${mol.molecule.id}`}>
                                  <div className="p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-sm">{mol.molecule.name}</span>
                                      {mol.isPrimaryOrigin === 1 && (
                                        <Badge variant="secondary" className="text-xs">Principal</Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      {mol.molecule.family && (
                                        <Badge variant="outline" className="text-xs">{mol.molecule.family}</Badge>
                                      )}
                                      {mol.molecule.chemicalFormula && (
                                        <span className="text-xs text-muted-foreground font-mono">
                                          {mol.molecule.chemicalFormula}
                                        </span>
                                      )}
                                    </div>
                                    {mol.specificCharacteristics && (
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                        {mol.specificCharacteristics}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </ScrollArea>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Aucune molécule associée à ce terroir.
                          </p>
                        )}
                      </div>
                      
                      {selectedOrigin.terroir && (
                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-2">Description du terroir</h4>
                          <p className="text-sm text-muted-foreground">{selectedOrigin.terroir}</p>
                        </div>
                      )}
                      
                      {selectedOrigin.qualityIndicators && (
                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-2">Indicateurs de qualité</h4>
                          <p className="text-sm text-muted-foreground">{selectedOrigin.qualityIndicators}</p>
                        </div>
                      )}

                      <div className="pt-4">
                        <Link href={`/origines-geographiques`}>
                          <Button variant="outline" className="w-full">
                            Voir tous les terroirs
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Terroirs</CardTitle>
                      <CardDescription>
                        Sélectionnez un terroir pour voir ses détails et molécules
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[500px]">
                        {isLoading ? (
                          <div className="p-4 space-y-3">
                            {[...Array(5)].map((_, i) => (
                              <Skeleton key={i} className="h-16 w-full" />
                            ))}
                          </div>
                        ) : filteredOrigins.length === 0 ? (
                          <div className="p-8 text-center text-muted-foreground">
                            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-30" />
                            <p>Aucun terroir trouvé</p>
                            <p className="text-sm">Modifiez vos critères de recherche</p>
                          </div>
                        ) : (
                          <div className="divide-y">
                            {filteredOrigins.map(origin => (
                              <button
                                key={origin.id}
                                onClick={() => focusOnOrigin(origin)}
                                className="w-full p-4 text-left hover:bg-accent/50 transition-colors flex items-center justify-between group"
                              >
                                <div className="flex-1">
                                  <div className="font-medium">{origin.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {origin.country}{origin.region ? `, ${origin.region}` : ''}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    {origin.climate && (
                                      <Badge variant="outline" className="text-xs">
                                        {origin.climate}
                                      </Badge>
                                    )}
                                    {origin.latitude && origin.longitude && (
                                      <Badge variant="secondary" className="text-xs">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        GPS
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {(origin.moleculeCount || 0) > 0 && (
                                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                      <FlaskConical className="h-3 w-3 mr-1" />
                                      {origin.moleculeCount}
                                    </Badge>
                                  )}
                                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Statistiques */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Répartition géographique</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {countries.slice(0, 8).map(country => {
                const countryOrigins = origins?.filter(o => o.country === country) || [];
                const count = countryOrigins.length;
                const moleculeCount = countryOrigins.reduce((sum, o) => sum + (o.moleculeCount || 0), 0);
                return (
                  <Card key={country} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedCountry(country)}>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm text-muted-foreground">{country}</div>
                      {moleculeCount > 0 && (
                        <div className="text-xs text-amber-600 mt-1">
                          {moleculeCount} molécule{moleculeCount > 1 ? 's' : ''}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Composant pour la légende
function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
        style={{ backgroundColor: color }}
      />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

// Fonction pour obtenir la couleur selon le climat
function getClimateColor(climate: string | null): string {
  if (!climate) return "#6b7280"; // Gris par défaut
  
  const climateLower = climate.toLowerCase();
  
  if (climateLower.includes("méditerranéen") || climateLower.includes("mediterranean")) {
    return "#22c55e"; // Vert
  }
  if (climateLower.includes("tempéré") || climateLower.includes("temperate")) {
    return "#3b82f6"; // Bleu
  }
  if (climateLower.includes("tropical") || climateLower.includes("équatorial")) {
    return "#f59e0b"; // Orange
  }
  if (climateLower.includes("aride") || climateLower.includes("désertique") || climateLower.includes("semi-aride")) {
    return "#ef4444"; // Rouge
  }
  if (climateLower.includes("continental")) {
    return "#8b5cf6"; // Violet
  }
  
  return "#6b7280"; // Gris par défaut
}
