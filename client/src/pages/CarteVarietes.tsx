import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { MapView } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  MapPin,
  Leaf,
  Cannabis,
  Cigarette,
  Search,
  Filter,
  Globe,
  AlertTriangle,
  ChevronRight,
  X,
  Layers,
  List,
  Map as MapIcon
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";

// Coordonnées des pays/régions pour les variétés
const countryCoordinates: Record<string, { lat: number; lng: number; zoom: number }> = {
  // Asie du Sud
  "Inde": { lat: 20.5937, lng: 78.9629, zoom: 5 },
  "Kerala, Inde": { lat: 10.8505, lng: 76.2711, zoom: 7 },
  "Himachal Pradesh, Inde": { lat: 31.1048, lng: 77.1734, zoom: 7 },
  "Manipur, Inde": { lat: 24.6637, lng: 93.9063, zoom: 8 },
  "Nagaland, Inde": { lat: 26.1584, lng: 94.5624, zoom: 8 },
  "Meghalaya, Inde": { lat: 25.4670, lng: 91.3662, zoom: 8 },
  
  // Asie du Sud-Est
  "Thaïlande": { lat: 15.8700, lng: 100.9925, zoom: 6 },
  "Nord Thaïlande": { lat: 18.7883, lng: 98.9853, zoom: 7 },
  "Cambodge": { lat: 12.5657, lng: 104.9910, zoom: 6 },
  "Laos": { lat: 19.8563, lng: 102.4955, zoom: 6 },
  "Vietnam": { lat: 14.0583, lng: 108.2772, zoom: 6 },
  
  // Asie Centrale / Moyen-Orient
  "Afghanistan": { lat: 33.9391, lng: 67.7100, zoom: 6 },
  "Hindu Kush, Afghanistan": { lat: 35.0, lng: 71.0, zoom: 7 },
  "Nord Afghanistan": { lat: 36.5, lng: 68.0, zoom: 7 },
  "Sud Afghanistan": { lat: 31.5, lng: 65.5, zoom: 7 },
  "Pakistan": { lat: 30.3753, lng: 69.3451, zoom: 6 },
  "Pakistan (KPK)": { lat: 34.9526, lng: 72.3311, zoom: 7 },
  "Vallée de Swat, Pakistan": { lat: 35.2227, lng: 72.3528, zoom: 8 },
  "Ouzbékistan": { lat: 41.3775, lng: 64.5853, zoom: 6 },
  "Tadjikistan": { lat: 38.8610, lng: 71.2761, zoom: 6 },
  "Turkménistan": { lat: 38.9697, lng: 59.5563, zoom: 6 },
  
  // Afrique
  "Afrique du Sud": { lat: -30.5595, lng: 22.9375, zoom: 5 },
  "Eswatini": { lat: -26.5225, lng: 31.4659, zoom: 8 },
  "Malawi": { lat: -13.2543, lng: 34.3015, zoom: 6 },
  "Tanzanie": { lat: -6.3690, lng: 34.8888, zoom: 6 },
  "Éthiopie": { lat: 9.1450, lng: 40.4897, zoom: 5 },
  "RD Congo": { lat: -4.0383, lng: 21.7587, zoom: 5 },
  "Nigeria": { lat: 9.0820, lng: 8.6753, zoom: 5 },
  "Sénégal": { lat: 14.4974, lng: -14.4524, zoom: 6 },
  
  // Amérique Centrale et du Sud
  "Mexique": { lat: 23.6345, lng: -102.5528, zoom: 5 },
  "Guerrero, Mexique": { lat: 17.4392, lng: -99.5451, zoom: 7 },
  "Oaxaca, Mexique": { lat: 17.0732, lng: -96.7266, zoom: 7 },
  "Michoacán, Mexique": { lat: 19.5665, lng: -101.7068, zoom: 7 },
  "Colombie": { lat: 4.5709, lng: -74.2973, zoom: 5 },
  "Panama": { lat: 8.5380, lng: -80.7821, zoom: 7 },
  "Jamaïque": { lat: 18.1096, lng: -77.2975, zoom: 8 },
  "Brésil": { lat: -14.2350, lng: -51.9253, zoom: 4 },
  "Pérou": { lat: -9.1900, lng: -75.0152, zoom: 5 },
  "Venezuela": { lat: 6.4238, lng: -66.5897, zoom: 5 },
  
  // Amérique du Nord
  "USA": { lat: 37.0902, lng: -95.7129, zoom: 4 },
  "Hawaï, USA": { lat: 19.8968, lng: -155.5828, zoom: 7 },
  "Maui, Hawaï, USA": { lat: 20.7984, lng: -156.3319, zoom: 9 },
  "Big Island, Hawaï, USA": { lat: 19.5429, lng: -155.6659, zoom: 8 },
  "Virginie, USA": { lat: 37.4316, lng: -78.6569, zoom: 6 },
  "Kentucky, USA": { lat: 37.8393, lng: -84.2700, zoom: 6 },
  "Louisiane, USA": { lat: 30.9843, lng: -91.9623, zoom: 6 },
  "Maryland, USA": { lat: 39.0458, lng: -76.6413, zoom: 7 },
  "Connecticut, USA": { lat: 41.6032, lng: -73.0877, zoom: 7 },
  
  // Méditerranée / Europe
  "Grèce": { lat: 39.0742, lng: 21.8243, zoom: 6 },
  "Grèce (Thrace)": { lat: 41.1172, lng: 25.4082, zoom: 8 },
  "Turquie": { lat: 38.9637, lng: 35.2433, zoom: 5 },
  "Syrie": { lat: 34.8021, lng: 38.9968, zoom: 6 },
  "Chypre": { lat: 35.1264, lng: 33.4299, zoom: 8 },
  "Macédoine": { lat: 41.5124, lng: 21.7453, zoom: 7 },
  
  // Caraïbes
  "Cuba": { lat: 21.5218, lng: -77.7812, zoom: 6 },
  "Syrie/Chypre": { lat: 35.5, lng: 35.0, zoom: 6 },
  "Grèce/Turquie": { lat: 39.5, lng: 27.0, zoom: 6 },
  "Venezuela/Virginie": { lat: 20.0, lng: -70.0, zoom: 4 },
  "Cuba/Connecticut": { lat: 25.0, lng: -75.0, zoom: 5 },
};

// Configuration des couleurs par type de plante
const plantTypeColors: Record<string, { bg: string; border: string; text: string }> = {
  cannabis: { bg: "#22c55e", border: "#16a34a", text: "#fff" },
  tabac: { bg: "#f59e0b", border: "#d97706", text: "#fff" },
  default: { bg: "#6366f1", border: "#4f46e5", text: "#fff" },
};

// Configuration des couleurs par statut de conservation
const conservationColors: Record<string, string> = {
  critical: "#ef4444",
  endangered: "#f97316",
  vulnerable: "#eab308",
  near_threatened: "#facc15",
  stable: "#22c55e",
  data_deficient: "#6b7280",
  unknown: "#94a3b8",
};

interface VarietyMarker {
  id: number;
  name: string;
  plantName: string;
  plantCategory: string;
  countryOfOrigin: string;
  conservationStatus: string | null;
  varietyType: string;
  coordinates: { lat: number; lng: number };
}

export default function CarteVarietes() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  
  const [selectedPlantType, setSelectedPlantType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariety, setSelectedVariety] = useState<VarietyMarker | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [mapReady, setMapReady] = useState(false);

  // Fetch varieties data
  const { data: varietiesData, isLoading } = trpc.plantVarieties.getAll.useQuery();

  // Process varieties to add coordinates
  const varietyMarkers = useMemo<VarietyMarker[]>(() => {
    if (!varietiesData) return [];
    
    return varietiesData
      .filter((v: any) => v.countryOfOrigin)
      .map((v: any) => {
        const coords = countryCoordinates[v.countryOfOrigin] || 
                       countryCoordinates[v.countryOfOrigin?.split(",")[0]?.trim()] ||
                       null;
        
        if (!coords) return null;
        
        // Add small random offset to prevent markers from overlapping
        const offset = () => (Math.random() - 0.5) * 2;
        
        return {
          id: v.id,
          name: v.name,
          plantName: v.plant?.name || "Inconnu",
          plantCategory: v.plant?.category || "unknown",
          countryOfOrigin: v.countryOfOrigin,
          conservationStatus: v.conservationStatus,
          varietyType: v.varietyType,
          coordinates: {
            lat: coords.lat + offset(),
            lng: coords.lng + offset(),
          },
        };
      })
      .filter(Boolean) as VarietyMarker[];
  }, [varietiesData]);

  // Filter markers based on selection
  const filteredMarkers = useMemo(() => {
    return varietyMarkers.filter((marker) => {
      if (selectedPlantType !== "all" && marker.plantCategory !== selectedPlantType) {
        return false;
      }
      if (selectedStatus !== "all" && marker.conservationStatus !== selectedStatus) {
        return false;
      }
      if (searchQuery && !marker.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !marker.countryOfOrigin.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [varietyMarkers, selectedPlantType, selectedStatus, searchQuery]);

  // Create markers when map is ready and data changes
  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    // Create info window if not exists
    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow();
    }

    // Create new markers
    filteredMarkers.forEach((variety) => {
      const colors = plantTypeColors[variety.plantCategory] || plantTypeColors.default;
      const conservationColor = conservationColors[variety.conservationStatus || "unknown"];
      
      // Create custom marker element
      const markerElement = document.createElement("div");
      markerElement.className = "variety-marker";
      markerElement.innerHTML = `
        <div style="
          width: 32px;
          height: 32px;
          background: ${colors.bg};
          border: 3px solid ${conservationColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
          <span style="color: ${colors.text}; font-size: 14px;">
            ${variety.plantCategory === "cannabis" ? "🌿" : variety.plantCategory === "tabac" ? "🍂" : "🌱"}
          </span>
        </div>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: variety.coordinates,
        title: variety.name,
        content: markerElement,
      });

      marker.addListener("click", () => {
        setSelectedVariety(variety);
        
        const content = `
          <div style="padding: 12px; max-width: 280px; font-family: system-ui, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${variety.name}</h3>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 13px;">
              ${variety.plantName} • ${variety.varietyType}
            </p>
            <p style="margin: 0 0 8px 0; color: #888; font-size: 12px;">
              📍 ${variety.countryOfOrigin}
            </p>
            <div style="
              display: inline-block;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 11px;
              background: ${conservationColor}20;
              color: ${conservationColor};
              border: 1px solid ${conservationColor}40;
            ">
              ${variety.conservationStatus || "Inconnu"}
            </div>
          </div>
        `;
        
        infoWindowRef.current?.setContent(content);
        infoWindowRef.current?.open(mapRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [filteredMarkers, mapReady]);

  // Fly to location when variety is selected
  const flyToVariety = (variety: VarietyMarker) => {
    if (mapRef.current) {
      mapRef.current.panTo(variety.coordinates);
      mapRef.current.setZoom(8);
      setSelectedVariety(variety);
    }
  };

  // Stats
  const stats = useMemo(() => {
    const cannabisCount = filteredMarkers.filter(m => m.plantCategory === "cannabis").length;
    const tabacCount = filteredMarkers.filter(m => m.plantCategory === "tabac").length;
    const criticalCount = filteredMarkers.filter(m => 
      m.conservationStatus === "critical" || m.conservationStatus === "endangered"
    ).length;
    const countries = new Set(filteredMarkers.map(m => m.countryOfOrigin)).size;
    
    return { cannabisCount, tabacCount, criticalCount, countries };
  }, [filteredMarkers]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/varietes">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour aux variétés
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Globe className="w-8 h-8 text-primary" />
            Carte des Origines
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Visualisez la distribution géographique des landraces de cannabis et des variétés de tabac.
            Les couleurs des bordures indiquent le statut de conservation.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-emerald-500/10 border-emerald-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Cannabis className="w-8 h-8 text-emerald-500" />
              <div>
                <div className="text-2xl font-bold">{stats.cannabisCount}</div>
                <div className="text-xs text-muted-foreground">Cannabis</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Cigarette className="w-8 h-8 text-amber-500" />
              <div>
                <div className="text-2xl font-bold">{stats.tabacCount}</div>
                <div className="text-xs text-muted-foreground">Tabac</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{stats.criticalCount}</div>
                <div className="text-xs text-muted-foreground">En danger</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stats.countries}</div>
                <div className="text-xs text-muted-foreground">Pays/Régions</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une variété ou un pays..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                {searchQuery && (
                  <Button variant="ghost" size="icon" onClick={() => setSearchQuery("")}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <Select value={selectedPlantType} onValueChange={setSelectedPlantType}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Type de plante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les plantes</SelectItem>
                  <SelectItem value="cannabis">🌿 Cannabis</SelectItem>
                  <SelectItem value="tabac">🍂 Tabac</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Conservation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="critical">🔴 Critique</SelectItem>
                  <SelectItem value="endangered">🟠 En danger</SelectItem>
                  <SelectItem value="vulnerable">🟡 Vulnérable</SelectItem>
                  <SelectItem value="stable">🟢 Stable</SelectItem>
                  <SelectItem value="unknown">⚪ Inconnu</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === "map" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                >
                  <MapIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map or List */}
          <div className="lg:col-span-3">
            {viewMode === "map" ? (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {isLoading ? (
                    <Skeleton className="w-full h-[600px]" />
                  ) : (
                    <MapView
                      className="h-[600px]"
                      initialCenter={{ lat: 20, lng: 0 }}
                      initialZoom={2}
                      onMapReady={(map) => {
                        mapRef.current = map;
                        setMapReady(true);
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Liste des variétés ({filteredMarkers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {filteredMarkers.map((variety) => (
                      <div
                        key={variety.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => {
                          setViewMode("map");
                          setTimeout(() => flyToVariety(variety), 100);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            variety.plantCategory === "cannabis" ? "bg-emerald-500" : "bg-amber-500"
                          }`} />
                          <div>
                            <div className="font-medium">{variety.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              {variety.countryOfOrigin}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline"
                            style={{ 
                              borderColor: conservationColors[variety.conservationStatus || "unknown"],
                              color: conservationColors[variety.conservationStatus || "unknown"],
                            }}
                          >
                            {variety.conservationStatus || "Inconnu"}
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Legend */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Légende
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Type de plante</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full bg-emerald-500" />
                      <span>Cannabis</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full bg-amber-500" />
                      <span>Tabac</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Statut de conservation (bordure)</div>
                  <div className="space-y-1">
                    {Object.entries({
                      critical: "Critique",
                      endangered: "En danger",
                      vulnerable: "Vulnérable",
                      stable: "Stable",
                      unknown: "Inconnu",
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        <div 
                          className="w-4 h-4 rounded-full border-2"
                          style={{ borderColor: conservationColors[key] }}
                        />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Variety Info */}
            {selectedVariety && (
              <Card className="border-primary/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{selectedVariety.name}</CardTitle>
                  <CardDescription>{selectedVariety.plantName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedVariety.countryOfOrigin}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Leaf className="w-4 h-4 text-muted-foreground" />
                    <span className="capitalize">{selectedVariety.varietyType}</span>
                  </div>
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: conservationColors[selectedVariety.conservationStatus || "unknown"],
                      color: conservationColors[selectedVariety.conservationStatus || "unknown"],
                    }}
                  >
                    {selectedVariety.conservationStatus || "Statut inconnu"}
                  </Badge>
                  <Separator />
                  <Link href={`/varietes`}>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      Voir les détails
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setSelectedPlantType("cannabis");
                    setSelectedStatus("critical");
                  }}
                >
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Cannabis en danger
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setSelectedPlantType("all");
                    setSelectedStatus("all");
                    setSearchQuery("");
                  }}
                >
                  <Globe className="w-4 h-4" />
                  Réinitialiser les filtres
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
