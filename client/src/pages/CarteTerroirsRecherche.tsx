import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapView } from "@/components/Map";
import { Link } from "wouter";
import { 
  MapPin, 
  Globe, 
  Leaf, 
  FlaskConical,
  ChevronRight,
  X,
  Info,
  ExternalLink
} from "lucide-react";

// Définition des terroirs de recherche avec leurs coordonnées
const RESEARCH_TERROIRS = [
  {
    id: "colombia",
    name: "Colombie",
    description: "Origan colombien et Pericón des Andes",
    color: "#f59e0b", // Amber
    regions: [
      {
        id: "santander",
        name: "Santander",
        lat: 6.6437,
        lng: -73.6536,
        plants: ["Lippia origanoides"],
        description: "Canyon du Chicamocha - Zone semi-aride des Andes"
      },
      {
        id: "santa-marta",
        name: "Santa Marta",
        lat: 11.2408,
        lng: -74.1990,
        plants: ["Lippia origanoides"],
        description: "Sierra Nevada de Santa Marta"
      },
      {
        id: "sincelejo",
        name: "Sincelejo",
        lat: 9.3047,
        lng: -75.3978,
        plants: ["Lippia origanoides"],
        description: "Région des Caraïbes colombiennes"
      },
      {
        id: "andes-centrales",
        name: "Andes Centrales",
        lat: 4.5709,
        lng: -74.2973,
        plants: ["Tagetes lucida"],
        description: "Zone andine - Pericón (Estragon mexicain)"
      }
    ]
  },
  {
    id: "burkina-faso",
    name: "Burkina Faso",
    description: "Lippia africaine et Basilic africain",
    color: "#10b981", // Emerald
    regions: [
      {
        id: "ouagadougou",
        name: "Ouagadougou",
        lat: 12.3714,
        lng: -1.5197,
        plants: ["Lippia multiflora", "Ocimum canum"],
        description: "Capitale - Centre de recherche principal"
      },
      {
        id: "bobo-dioulasso",
        name: "Bobo-Dioulasso",
        lat: 11.1771,
        lng: -4.2979,
        plants: ["Lippia multiflora"],
        description: "Deuxième ville - Zone de savane arborée"
      }
    ]
  },
  {
    id: "san-andres",
    name: "San Andrés",
    description: "Archipel Seaflower - Leaf Economies",
    color: "#3b82f6", // Blue
    regions: [
      {
        id: "san-andres-island",
        name: "Île de San Andrés",
        lat: 12.5847,
        lng: -81.7006,
        plants: ["Échantillons Leaf Economies"],
        description: "Réserve de biosphère Seaflower - Recherche botanique"
      }
    ]
  }
];

// Couleurs par axe climatique
const CLIMATIC_AXIS_COLORS: Record<string, string> = {
  vent: "#3b82f6",
  bois: "#84cc16",
  disparition: "#f97316",
  vent_bois: "#8b5cf6",
  bois_disparition: "#f59e0b",
  vent_disparition: "#ec4899"
};

export default function CarteTerroirsRecherche() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [selectedTerroir, setSelectedTerroir] = useState<string | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>("carte");

  // Récupérer les plantes aromatiques de la base de données
  const { data: plants, isLoading: isLoadingPlants } = trpc.plants.list.useQuery();

  // Filtrer les plantes des terroirs de recherche
  const researchPlants = useMemo(() => {
    if (!plants) return [];
    return plants.filter(p => 
      ["Lippia origanoides", "Tagetes lucida", "Lippia multiflora", "Ocimum canum"].includes(p.latinName || "")
    );
  }, [plants]);

  // Récupérer les molécules liées à une plante
  const { data: plantMolecules } = trpc.plants.getMolecules.useQuery(
    selectedPlant?.id ?? 0,
    { enabled: !!selectedPlant }
  );

  // Callback quand la carte est prête
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // Centrer sur une vue globale incluant tous les terroirs
    map.setCenter({ lat: 10, lng: -40 });
    map.setZoom(3);

    // Créer les marqueurs pour chaque région
    RESEARCH_TERROIRS.forEach(terroir => {
      terroir.regions.forEach(region => {
        // Créer un élément personnalisé pour le marqueur
        const markerContent = document.createElement("div");
        markerContent.className = "marker-content";
        markerContent.innerHTML = `
          <div style="
            background-color: ${terroir.color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: region.lat, lng: region.lng },
          title: region.name,
          content: markerContent,
        });

        // Info window au clic
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 300px; font-family: system-ui, sans-serif;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${terroir.color};"></div>
                <h3 style="font-weight: bold; font-size: 16px; margin: 0;">${region.name}</h3>
              </div>
              <p style="color: #666; font-size: 13px; margin-bottom: 8px;">${terroir.name}</p>
              <p style="font-size: 12px; color: #888; margin-bottom: 12px;">${region.description}</p>
              <div style="border-top: 1px solid #eee; padding-top: 8px;">
                <p style="font-size: 12px; font-weight: 500; color: #333; margin-bottom: 4px;">Plantes étudiées:</p>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  ${region.plants.map(p => `
                    <span style="
                      background-color: ${terroir.color}20;
                      color: ${terroir.color};
                      padding: 2px 8px;
                      border-radius: 12px;
                      font-size: 11px;
                      font-weight: 500;
                    ">${p}</span>
                  `).join("")}
                </div>
              </div>
            </div>
          `,
        });

        marker.addListener("click", () => {
          setSelectedTerroir(terroir.id);
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      });
    });
  }, []);

  // Centrer sur un terroir
  const focusOnTerroir = (terroirId: string) => {
    setSelectedTerroir(terroirId);
    const terroir = RESEARCH_TERROIRS.find(t => t.id === terroirId);
    if (terroir && mapRef.current) {
      const bounds = new google.maps.LatLngBounds();
      terroir.regions.forEach(r => {
        bounds.extend({ lat: r.lat, lng: r.lng });
      });
      mapRef.current.fitBounds(bounds);
      
      // Ajuster le zoom si trop proche
      google.maps.event.addListenerOnce(mapRef.current, "idle", () => {
        const zoom = mapRef.current?.getZoom();
        if (zoom && zoom > 8) mapRef.current?.setZoom(8);
      });
    }
  };

  // Sélectionner une plante
  const selectPlant = (plant: any) => {
    setSelectedPlant(plant);
    setActiveTab("details");
  };

  // Statistiques
  const stats = useMemo(() => ({
    totalTerroirs: RESEARCH_TERROIRS.length,
    totalRegions: RESEARCH_TERROIRS.reduce((sum, t) => sum + t.regions.length, 0),
    totalPlants: researchPlants.length,
    countries: ["Colombie", "Burkina Faso", "San Andrés"]
  }), [researchPlants]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-8 md:py-12 bg-gradient-to-b from-emerald-50/50 to-background dark:from-emerald-950/20">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                <Globe className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">Carte des Terroirs de Recherche</h1>
                <p className="text-muted-foreground">
                  Visualisation géographique des origines des plantes aromatiques étudiées
                </p>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
              <Card className="bg-white/50 dark:bg-white/5">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600">{stats.totalTerroirs}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Terroirs</div>
                </CardContent>
              </Card>
              <Card className="bg-white/50 dark:bg-white/5">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-amber-600">{stats.totalRegions}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Régions</div>
                </CardContent>
              </Card>
              <Card className="bg-white/50 dark:bg-white/5">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">{stats.totalPlants}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Plantes</div>
                </CardContent>
              </Card>
              <Card className="bg-white/50 dark:bg-white/5">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-purple-600">{stats.countries.length}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Pays</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-8">
          <div className="container">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="carte">Carte</TabsTrigger>
                <TabsTrigger value="terroirs">Terroirs</TabsTrigger>
                <TabsTrigger value="details">Détails</TabsTrigger>
              </TabsList>

              {/* Onglet Carte */}
              <TabsContent value="carte" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Carte */}
                  <div className="lg:col-span-3">
                    <Card>
                      <CardContent className="p-0 overflow-hidden rounded-lg">
                        <MapView 
                          className="h-[400px] md:h-[600px] w-full"
                          initialCenter={{ lat: 10, lng: -40 }}
                          initialZoom={3}
                          onMapReady={handleMapReady}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Légende et navigation */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Légende
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {RESEARCH_TERROIRS.map(terroir => (
                          <button
                            key={terroir.id}
                            onClick={() => focusOnTerroir(terroir.id)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-muted ${
                              selectedTerroir === terroir.id ? "bg-muted" : ""
                            }`}
                          >
                            <div 
                              className="w-4 h-4 rounded-full shrink-0"
                              style={{ backgroundColor: terroir.color }}
                            />
                            <div className="text-left">
                              <div className="font-medium text-sm">{terroir.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {terroir.regions.length} région{terroir.regions.length > 1 ? "s" : ""}
                              </div>
                            </div>
                          </button>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Info className="h-5 w-5" />
                          À propos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Cette carte présente les terroirs de recherche du projet PERFUMUM, 
                          incluant les plantes aromatiques colombiennes, burkinabè et les 
                          échantillons de l'archipel Seaflower (San Andrés).
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Onglet Terroirs */}
              <TabsContent value="terroirs" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {RESEARCH_TERROIRS.map(terroir => (
                    <Card key={terroir.id} className="overflow-hidden">
                      <div 
                        className="h-2"
                        style={{ backgroundColor: terroir.color }}
                      />
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5" style={{ color: terroir.color }} />
                          {terroir.name}
                        </CardTitle>
                        <CardDescription>{terroir.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Régions ({terroir.regions.length})</h4>
                          {terroir.regions.map(region => (
                            <div 
                              key={region.id}
                              className="p-3 bg-muted/50 rounded-lg"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-medium text-sm">{region.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {region.description}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    focusOnTerroir(terroir.id);
                                    setActiveTab("carte");
                                  }}
                                >
                                  <MapPin className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {region.plants.map(plant => (
                                  <Badge 
                                    key={plant} 
                                    variant="secondary"
                                    className="text-xs"
                                    style={{ 
                                      backgroundColor: `${terroir.color}20`,
                                      color: terroir.color 
                                    }}
                                  >
                                    {plant}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => focusOnTerroir(terroir.id)}
                        >
                          Voir sur la carte
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Onglet Détails des plantes */}
              <TabsContent value="details" className="space-y-6">
                {isLoadingPlants ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <Skeleton className="h-6 w-48 mb-4" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {researchPlants.map(plant => (
                      <Card 
                        key={plant.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedPlant?.id === plant.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => selectPlant(plant)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                <Leaf className="h-5 w-5 text-emerald-600" />
                                {plant.name}
                              </CardTitle>
                              <CardDescription className="italic">
                                {plant.latinName}
                              </CardDescription>
                            </div>
                            {plant.climaticAxis && (
                              <Badge 
                                style={{ 
                                  backgroundColor: `${CLIMATIC_AXIS_COLORS[plant.climaticAxis] || "#888"}20`,
                                  color: CLIMATIC_AXIS_COLORS[plant.climaticAxis] || "#888"
                                }}
                              >
                                {plant.climaticAxis}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="text-sm font-medium mb-1">Origine</div>
                            <div className="text-sm text-muted-foreground">{plant.origin}</div>
                          </div>
                          
                          {plant.olfactiveSignature && (
                            <div>
                              <div className="text-sm font-medium mb-1">Signature olfactive</div>
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {plant.olfactiveSignature}
                              </div>
                            </div>
                          )}

                          {plant.chemotypes && (
                            <div>
                              <div className="text-sm font-medium mb-1">Chémotypes</div>
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {plant.chemotypes}
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Link href={`/plants/${plant.id}`}>
                              <Button variant="outline" size="sm">
                                Voir la fiche
                                <ExternalLink className="h-3 w-3 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Détails de la plante sélectionnée */}
                {selectedPlant && plantMolecules && (
                  <Card className="mt-6">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FlaskConical className="h-5 w-5 text-amber-600" />
                          Molécules de {selectedPlant.name}
                        </CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedPlant(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>
                        Profil moléculaire de l'huile essentielle
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {plantMolecules.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Aucune molécule liée à cette plante pour le moment.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {plantMolecules.map((pm: any) => (
                            <div 
                              key={pm.molecule.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  pm.isSignature ? "bg-amber-500" : "bg-gray-400"
                                }`} />
                                <div>
                                  <div className="font-medium">{pm.molecule.name}</div>
                                  {pm.molecule.family && (
                                    <div className="text-xs text-muted-foreground">
                                      {pm.molecule.family}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-sm">
                                  {pm.percentageMin && pm.percentageMax ? (
                                    `${pm.percentageMin}-${pm.percentageMax}%`
                                  ) : pm.percentageTypical ? (
                                    `~${pm.percentageTypical}%`
                                  ) : (
                                    "—"
                                  )}
                                </div>
                                {pm.role && (
                                  <Badge variant="outline" className="text-xs">
                                    {pm.role}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
