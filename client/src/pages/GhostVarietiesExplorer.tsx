import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapView } from "@/components/Map";
import { 
  ChevronRight,
  Ghost,
  MapPin,
  Search,
  Filter,
  Leaf,
  AlertTriangle,
  Clock,
  Globe,
  List,
  Map as MapIcon,
  Info,
  Flower2,
  TreeDeciduous,
  Plus
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

// Coordonnées géographiques pour les localisations connues
const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  "Grasse, France": { lat: 43.6590, lng: 6.9230 },
  "Taif, Arabie Saoudite": { lat: 21.2703, lng: 40.4158 },
  "San Andrés Tuxtla, Mexique": { lat: 18.4491, lng: -95.2128 },
  "Hindu Kush, Afghanistan": { lat: 35.0000, lng: 71.0000 },
  "Plateau de Valensole, France": { lat: 43.8333, lng: 5.9833 },
  "Reggio de Calabre, Italie": { lat: 38.1157, lng: 15.6492 },
  "Garrigues provençales, France": { lat: 43.8000, lng: 4.3500 },
  "Dhofar, Oman": { lat: 17.0000, lng: 54.0000 },
};

// Couleurs par type de variété
const VARIETY_TYPE_COLORS: Record<string, string> = {
  rose: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  jasmine: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  tobacco: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  cannabis: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  lavender: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  citrus: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  aromatic_herb: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  resin_tree: "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

// Couleurs par statut de conservation
const CONSERVATION_STATUS_COLORS: Record<string, string> = {
  extinct: "bg-black text-white",
  extinct_wild: "bg-gray-800 text-white",
  critically_endangered: "bg-red-600 text-white",
  endangered: "bg-orange-600 text-white",
  vulnerable: "bg-yellow-600 text-white",
  near_threatened: "bg-blue-600 text-white",
  reconstructed: "bg-green-600 text-white",
  unknown: "bg-gray-400 text-white",
};

// Labels en français
const VARIETY_TYPE_LABELS: Record<string, string> = {
  rose: "Rose",
  jasmine: "Jasmin",
  tobacco: "Tabac",
  cannabis: "Cannabis",
  lavender: "Lavande",
  citrus: "Agrume",
  aromatic_herb: "Herbe aromatique",
  resin_tree: "Arbre à résine",
  other: "Autre",
};

const CONSERVATION_STATUS_LABELS: Record<string, string> = {
  extinct: "Éteint",
  extinct_wild: "Éteint à l'état sauvage",
  critically_endangered: "En danger critique",
  endangered: "En danger",
  vulnerable: "Vulnérable",
  near_threatened: "Quasi menacé",
  reconstructed: "Reconstitué",
  unknown: "Inconnu",
};

export default function GhostVarietiesExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedVariety, setSelectedVariety] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  // Fetch data
  const { data: varieties, isLoading } = trpc.ghostVarieties.list.useQuery();
  const { data: stats } = trpc.ghostVarieties.getStats.useQuery();

  // Filter varieties
  const filteredVarieties = useMemo(() => {
    if (!varieties) return [];
    return varieties.filter((v) => {
      const matchesSearch = searchQuery === "" || 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.scientificName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.lastDocumentedLocation?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || v.varietyType === selectedType;
      const matchesStatus = selectedStatus === "all" || v.conservationStatus === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [varieties, searchQuery, selectedType, selectedStatus]);

  // Get selected variety details
  const selectedVarietyData = useMemo(() => {
    if (!selectedVariety || !varieties) return null;
    return varieties.find(v => v.id === selectedVariety) || null;
  }, [selectedVariety, varieties]);

  // Initialize map markers
  const initializeMapMarkers = (map: google.maps.Map) => {
    mapRef.current = map;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.map = null);
    markersRef.current = [];

    if (!filteredVarieties) return;

    // Add markers for each variety with known location
    filteredVarieties.forEach((variety) => {
      const location = variety.lastDocumentedLocation;
      if (!location) return;

      const coords = LOCATION_COORDS[location];
      if (!coords) return;

      // Create custom marker content
      const markerContent = document.createElement("div");
      markerContent.className = "flex flex-col items-center";
      markerContent.innerHTML = `
        <div class="w-8 h-8 rounded-full ${CONSERVATION_STATUS_COLORS[variety.conservationStatus] || 'bg-gray-500'} flex items-center justify-center shadow-lg border-2 border-white">
          <span class="text-xs">🌿</span>
        </div>
        <div class="mt-1 px-2 py-1 bg-white dark:bg-slate-800 rounded shadow text-xs font-medium max-w-[150px] truncate">
          ${variety.name}
        </div>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: coords,
        title: variety.name,
        content: markerContent,
      });

      marker.addListener("click", () => {
        setSelectedVariety(variety.id);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (markersRef.current.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach(marker => {
        if (marker.position) {
          bounds.extend(marker.position as google.maps.LatLngLiteral);
        }
      });
      map.fitBounds(bounds, { padding: 50 });
    }
  };

  // Update markers when filtered varieties change
  useEffect(() => {
    if (mapRef.current && viewMode === "map") {
      initializeMapMarkers(mapRef.current);
    }
  }, [filteredVarieties, viewMode]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white py-12 px-4">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/axes-recherche" className="hover:text-white transition-colors">Axes de recherche</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Variétés fantômes</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
                <Ghost className="h-10 w-10" />
                Explorateur de variétés fantômes
              </h1>
              <p className="text-slate-300 text-lg max-w-2xl">
                Base de données des variétés botaniques disparues, menacées ou historiquement significatives 
                pour la parfumerie et l'étude olfactive.
              </p>
              <Button asChild className="mt-4 bg-white/10 hover:bg-white/20 border-white/30">
                <Link href="/ghost-variety/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une variété
                </Link>
              </Button>
            </div>
            {stats && (
              <div className="hidden md:flex gap-4">
                <Card className="bg-white/10 border-white/20 text-white">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <div className="text-sm text-slate-300">Variétés</div>
                  </CardContent>
                </Card>
                <Card className="bg-red-500/20 border-red-500/30 text-white">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold">
                      {stats.byConservationStatus.filter(s => 
                        ["extinct", "extinct_wild", "critically_endangered"].includes(s.status)
                      ).reduce((acc, s) => acc + s.count, 0)}
                    </div>
                    <div className="text-sm text-red-200">Critiques</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container max-w-6xl py-8 px-4">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, nom scientifique ou localisation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type de variété" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {Object.entries(VARIETY_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[220px]">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Statut de conservation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {Object.entries(CONSERVATION_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("map")}
                >
                  <MapIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2">
            {viewMode === "map" ? (
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Carte des régions d'origine
                  </CardTitle>
                  <CardDescription>
                    Cliquez sur un marqueur pour voir les détails de la variété
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <MapView
                    className="h-[500px] w-full"
                    initialCenter={{ lat: 35, lng: 20 }}
                    initialZoom={2}
                    onMapReady={initializeMapMarkers}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {isLoading ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="animate-pulse">Chargement des variétés...</div>
                    </CardContent>
                  </Card>
                ) : filteredVarieties.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      <Ghost className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune variété trouvée avec ces critères.</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredVarieties.map((variety) => (
                    <Card 
                      key={variety.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedVariety === variety.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedVariety(variety.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{variety.name}</h3>
                              <Badge className={CONSERVATION_STATUS_COLORS[variety.conservationStatus]}>
                                {CONSERVATION_STATUS_LABELS[variety.conservationStatus]}
                              </Badge>
                            </div>
                            {variety.scientificName && (
                              <p className="text-sm text-muted-foreground italic mb-2">
                                {variety.scientificName}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="outline" className={VARIETY_TYPE_COLORS[variety.varietyType]}>
                                {VARIETY_TYPE_LABELS[variety.varietyType]}
                              </Badge>
                              {variety.lastDocumentedLocation && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {variety.lastDocumentedLocation}
                                </Badge>
                              )}
                              {variety.lastDocumentedYear && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {variety.lastDocumentedYear}
                                </Badge>
                              )}
                            </div>
                            {variety.olfactiveProfile && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                <strong>Profil olfactif:</strong> {variety.olfactiveProfile}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-1">
            {selectedVarietyData ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={CONSERVATION_STATUS_COLORS[selectedVarietyData.conservationStatus]}>
                      {CONSERVATION_STATUS_LABELS[selectedVarietyData.conservationStatus]}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedVariety(null)}
                    >
                      ✕
                    </Button>
                  </div>
                  <CardTitle className="text-xl">{selectedVarietyData.name}</CardTitle>
                  {selectedVarietyData.scientificName && (
                    <CardDescription className="italic">
                      {selectedVarietyData.scientificName}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Classification */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Leaf className="h-4 w-4" />
                      Classification
                    </h4>
                    <div className="text-sm space-y-1">
                      <p><span className="text-muted-foreground">Famille:</span> {selectedVarietyData.plantFamily || "—"}</p>
                      <p><span className="text-muted-foreground">Genre:</span> {selectedVarietyData.genus || "—"}</p>
                      <p><span className="text-muted-foreground">Espèce:</span> {selectedVarietyData.species || "—"}</p>
                      {selectedVarietyData.cultivar && (
                        <p><span className="text-muted-foreground">Cultivar:</span> {selectedVarietyData.cultivar}</p>
                      )}
                    </div>
                  </div>

                  {/* Location & History */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Localisation & Histoire
                    </h4>
                    <div className="text-sm space-y-1">
                      <p><span className="text-muted-foreground">Dernière observation:</span> {selectedVarietyData.lastDocumentedLocation || "—"}</p>
                      <p><span className="text-muted-foreground">Année:</span> {selectedVarietyData.lastDocumentedYear || "—"}</p>
                      <p><span className="text-muted-foreground">Période de culture:</span> {selectedVarietyData.peakCultivationPeriod || "—"}</p>
                    </div>
                  </div>

                  {/* Olfactive Profile */}
                  {selectedVarietyData.olfactiveProfile && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Flower2 className="h-4 w-4" />
                        Profil olfactif
                      </h4>
                      <p className="text-sm">{selectedVarietyData.olfactiveProfile}</p>
                    </div>
                  )}

                  {/* Disappearance Causes */}
                  {selectedVarietyData.disappearanceCauses && (selectedVarietyData.disappearanceCauses as string[]).length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Causes de disparition
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {(selectedVarietyData.disappearanceCauses as string[]).map((cause, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {cause}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {selectedVarietyData.description && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Description
                      </h4>
                      <p className="text-sm text-muted-foreground">{selectedVarietyData.description}</p>
                    </div>
                  )}

                  {/* Historical Significance */}
                  {selectedVarietyData.historicalSignificance && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <TreeDeciduous className="h-4 w-4" />
                        Importance historique
                      </h4>
                      <p className="text-sm text-muted-foreground">{selectedVarietyData.historicalSignificance}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Ghost className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez une variété pour voir ses détails</p>
                </CardContent>
              </Card>
            )}

            {/* Statistics */}
            {stats && (
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="types" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="types" className="flex-1">Types</TabsTrigger>
                      <TabsTrigger value="status" className="flex-1">Statuts</TabsTrigger>
                    </TabsList>
                    <TabsContent value="types" className="mt-2">
                      <div className="space-y-2">
                        {stats.byVarietyType.map((item) => (
                          <div key={item.type} className="flex items-center justify-between text-sm">
                            <Badge variant="outline" className={VARIETY_TYPE_COLORS[item.type]}>
                              {VARIETY_TYPE_LABELS[item.type] || item.type}
                            </Badge>
                            <span className="font-medium">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="status" className="mt-2">
                      <div className="space-y-2">
                        {stats.byConservationStatus.map((item) => (
                          <div key={item.status} className="flex items-center justify-between text-sm">
                            <Badge className={CONSERVATION_STATUS_COLORS[item.status]}>
                              {CONSERVATION_STATUS_LABELS[item.status] || item.status}
                            </Badge>
                            <span className="font-medium">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/varietes-fantomes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Ghost className="h-5 w-5 text-slate-600" />
                <span>Concept des variétés fantômes</span>
                <ChevronRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/sustainability-dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span>Dashboard durabilité</span>
                <ChevronRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/axes-recherche">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Leaf className="h-5 w-5 text-emerald-600" />
                <span>Axes de recherche</span>
                <ChevronRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
