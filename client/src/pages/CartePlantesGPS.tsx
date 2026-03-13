// @ts-nocheck
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
import { Checkbox } from "@/components/ui/checkbox";
import { MapView } from "@/components/Map";
import { Link } from "wouter";
import { 
  MapPin, 
  Globe, 
  Leaf, 
  FlaskConical,
  Filter,
  X,
  Info,
  Trees,
  Cigarette,
  Cannabis,
  Droplets,
  Flower2,
  TreeDeciduous,
  Sprout,
  MoreHorizontal,
  Wind,
  Sparkles,
  Mountain
} from "lucide-react";

// Configuration des catégories avec couleurs et icônes
const PLANT_CATEGORIES = [
  { id: "aromatique", name: "Aromatique", color: "#10b981", icon: Leaf, description: "Plantes à huiles essentielles" },
  { id: "tabac", name: "Tabac", color: "#f59e0b", icon: Cigarette, description: "Variétés de tabac" },
  { id: "cannabis", name: "Cannabis", color: "#8b5cf6", icon: Cannabis, description: "Variétés de cannabis" },
  { id: "resine", name: "Résine", color: "#ef4444", icon: Droplets, description: "Plantes à résines" },
  { id: "bois", name: "Bois", color: "#78350f", icon: TreeDeciduous, description: "Bois aromatiques" },
  { id: "fleur", name: "Fleur", color: "#ec4899", icon: Flower2, description: "Fleurs parfumées" },
  { id: "racine", name: "Racine", color: "#6b7280", icon: Sprout, description: "Racines aromatiques" },
  { id: "autre", name: "Autre", color: "#94a3b8", icon: MoreHorizontal, description: "Autres catégories" },
] as const;

// Configuration des axes climatiques (San Andrés)
const CLIMATIC_AXES = [
  { id: "vent", name: "Vent", color: "#0ea5e9", icon: Wind, description: "Coupe aérienne, fraîcheur" },
  { id: "bois", name: "Bois", color: "#d97706", icon: TreeDeciduous, description: "Structure sèche, terreux" },
  { id: "disparition", name: "Disparition", color: "#8b5cf6", icon: Sparkles, description: "Effacement, abstraction" },
] as const;

type CategoryId = typeof PLANT_CATEGORIES[number]["id"];
type ClimaticAxisId = typeof CLIMATIC_AXES[number]["id"];

export default function CartePlantesGPS() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<CategoryId>>(
    () => new Set<CategoryId>(["aromatique", "tabac", "cannabis", "resine"])
  );
  const [selectedPlant, setSelectedPlant] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedClimaticAxes, setSelectedClimaticAxes] = useState<Set<ClimaticAxisId>>(new Set());
  const [showClimaticFilter, setShowClimaticFilter] = useState(false);
  const [moleculeFilter, setMoleculeFilter] = useState("");
  const [showMoleculeFilter, setShowMoleculeFilter] = useState(false);

  // Récupérer toutes les plantes avec GPS
  const { data: plantsWithGPS, isLoading } = trpc.plants.getWithGPS.useQuery();

  // Filtrer les plantes par catégories sélectionnées, axes climatiques et molécule
  const filteredPlants = useMemo(() => {
    if (!plantsWithGPS) return [];
    let filtered = plantsWithGPS.filter(p => selectedCategories.has(p.category as CategoryId));
    
    // Filtrer par axe climatique si des axes sont sélectionnés
    if (selectedClimaticAxes.size > 0) {
      filtered = filtered.filter(p => {
        const plantAxis = (p as any).climaticAxis;
        if (!plantAxis) return false;
        return selectedClimaticAxes.has(plantAxis as ClimaticAxisId) ||
               (plantAxis.includes('vent') && selectedClimaticAxes.has('vent')) ||
               (plantAxis.includes('bois') && selectedClimaticAxes.has('bois')) ||
               (plantAxis.includes('disparition') && selectedClimaticAxes.has('disparition'));
      });
    }

    // Filtrer par molécule dominante
    if (moleculeFilter.trim()) {
      const query = moleculeFilter.toLowerCase().trim();
      filtered = filtered.filter(p => {
        const mols = (p as any).dominantMolecules;
        if (!mols) return false;
        try {
          const arr: string[] = typeof mols === 'string' ? JSON.parse(mols) : mols;
          return arr.some(m => m.toLowerCase().includes(query));
        } catch {
          return String(mols).toLowerCase().includes(query);
        }
      });
    }
    
    return filtered;
  }, [plantsWithGPS, selectedCategories, selectedClimaticAxes, moleculeFilter]);

  // Statistiques par catégorie
  const categoryStats = useMemo(() => {
    if (!plantsWithGPS) return {};
    const stats: Record<string, number> = {};
    plantsWithGPS.forEach(p => {
      stats[p.category] = (stats[p.category] || 0) + 1;
    });
    return stats;
  }, [plantsWithGPS]);

  // Toggle une catégorie
  const toggleCategory = (categoryId: CategoryId) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Toggle un axe climatique
  const toggleClimaticAxis = (axisId: ClimaticAxisId) => {
    setSelectedClimaticAxes(prev => {
      const next = new Set(prev);
      if (next.has(axisId)) {
        next.delete(axisId);
      } else {
        next.add(axisId);
      }
      return next;
    });
  };

  // Effacer tous les filtres climatiques
  const clearClimaticFilters = () => {
    setSelectedClimaticAxes(new Set());
  };

  // Sélectionner/désélectionner toutes les catégories
  const selectAll = () => {
    setSelectedCategories(new Set(PLANT_CATEGORIES.map(c => c.id)));
  };

  const selectNone = () => {
    setSelectedCategories(new Set());
  };

  // Callback quand la carte est prête
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.setCenter({ lat: 10, lng: -40 });
    map.setZoom(3);
  }, []);

  // Mettre à jour les marqueurs quand les plantes filtrées changent
  useEffect(() => {
    if (!mapRef.current || !filteredPlants.length) return;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach(marker => {
      marker.map = null;
    });
    markersRef.current = [];

    // Créer les nouveaux marqueurs
    filteredPlants.forEach(plant => {
      if (!plant.latitude || !plant.longitude) return;

      const category = PLANT_CATEGORIES.find(c => c.id === plant.category);
      const color = category?.color || "#94a3b8";

      // Créer un élément personnalisé pour le marqueur
      const markerContent = document.createElement("div");
      markerContent.innerHTML = `
        <div style="
          background-color: ${color};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
          </svg>
        </div>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current!,
        position: { lat: parseFloat(plant.latitude), lng: parseFloat(plant.longitude) },
        title: plant.name,
        content: markerContent,
      });

      // Info window au clic
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 300px; font-family: system-ui, sans-serif;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${color};"></div>
              <h3 style="font-weight: bold; font-size: 16px; margin: 0;">${plant.name}</h3>
            </div>
            ${plant.latinName ? `<p style="color: #666; font-size: 13px; font-style: italic; margin-bottom: 4px;">${plant.latinName}</p>` : ''}
            ${plant.family ? `<p style="color: #888; font-size: 12px; margin-bottom: 8px;">Famille: ${plant.family}</p>` : ''}
            <div style="display: flex; gap: 4px; margin-bottom: 8px;">
              <span style="
                background-color: ${color}20;
                color: ${color};
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
              ">${category?.name || plant.category}</span>
            </div>
            ${plant.origin ? `<p style="font-size: 12px; color: #666;"><strong>Origine:</strong> ${plant.origin}</p>` : ''}
            ${plant.olfactiveSignature ? `<p style="font-size: 12px; color: #666; margin-top: 4px;"><strong>Signature:</strong> ${plant.olfactiveSignature.substring(0, 100)}${plant.olfactiveSignature.length > 100 ? '...' : ''}</p>` : ''}
          </div>
        `,
      });

      marker.addListener("click", () => {
        setSelectedPlant(plant);
        infoWindow.open(mapRef.current!, marker);
      });

      markersRef.current.push(marker);
    });

    // Ajuster la vue pour montrer tous les marqueurs
    if (filteredPlants.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      filteredPlants.forEach(plant => {
        if (plant.latitude && plant.longitude) {
          bounds.extend({ lat: parseFloat(plant.latitude), lng: parseFloat(plant.longitude) });
        }
      });
      mapRef.current.fitBounds(bounds);
      
      // Limiter le zoom max
      google.maps.event.addListenerOnce(mapRef.current, "idle", () => {
        const zoom = mapRef.current?.getZoom();
        if (zoom && zoom > 10) mapRef.current?.setZoom(10);
      });
    }
  }, [filteredPlants]);

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
                <h1 className="text-2xl md:text-4xl font-bold">Carte des Plantes Géolocalisées</h1>
                <p className="text-muted-foreground">
                  Visualisation géographique des plantes avec filtres par catégorie
                </p>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
              <Card className="bg-white/50 dark:bg-white/5">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600">
                    {plantsWithGPS?.length || 0}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">Plantes GPS</div>
                </CardContent>
              </Card>
              <Card className="bg-white/50 dark:bg-white/5">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-amber-600">
                    {filteredPlants.length}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">Affichées</div>
                </CardContent>
              </Card>
              <Card className="bg-white/50 dark:bg-white/5">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">
                    {selectedCategories.size}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">Catégories</div>
                </CardContent>
              </Card>
              <Card className="bg-white/50 dark:bg-white/5">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-purple-600">
                    {Object.keys(categoryStats).length}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">Types</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-8">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Panneau de filtres */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtres par catégorie
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  {showFilters && (
                    <CardContent className="space-y-4">
                      {/* Boutons tout/rien */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={selectAll} className="flex-1">
                          Tout
                        </Button>
                        <Button variant="outline" size="sm" onClick={selectNone} className="flex-1">
                          Rien
                        </Button>
                      </div>

                      {/* Liste des catégories */}
                      <div className="space-y-2">
                        {PLANT_CATEGORIES.map(category => {
                          const Icon = category.icon;
                          const count = categoryStats[category.id] || 0;
                          const isSelected = selectedCategories.has(category.id);
                          
                          return (
                            <button
                              key={category.id}
                              onClick={() => toggleCategory(category.id)}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                                isSelected 
                                  ? "bg-muted border-2" 
                                  : "bg-muted/30 border-2 border-transparent opacity-60"
                              }`}
                              style={{
                                borderColor: isSelected ? category.color : "transparent"
                              }}
                            >
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${category.color}20` }}
                              >
                                <Icon className="h-4 w-4" style={{ color: category.color }} />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="font-medium text-sm">{category.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {count} plante{count > 1 ? "s" : ""}
                                </div>
                              </div>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleCategory(category.id)}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Filtres par axe climatique */}
                <Card className="border-sky-200 dark:border-sky-800">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Mountain className="h-5 w-5 text-sky-600" />
                        Axe Climatique
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowClimaticFilter(!showClimaticFilter)}
                      >
                        {showClimaticFilter ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                      </Button>
                    </div>
                    <CardDescription className="text-xs">
                      Filtrer par signature climatique San Andrés
                    </CardDescription>
                  </CardHeader>
                  {showClimaticFilter && (
                    <CardContent className="space-y-3">
                      {selectedClimaticAxes.size > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={clearClimaticFilters}
                          className="w-full text-xs"
                        >
                          Effacer les filtres climatiques
                        </Button>
                      )}
                      <div className="space-y-2">
                        {CLIMATIC_AXES.map(axis => {
                          const Icon = axis.icon;
                          const isSelected = selectedClimaticAxes.has(axis.id);
                          
                          return (
                            <button
                              key={axis.id}
                              onClick={() => toggleClimaticAxis(axis.id)}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                                isSelected 
                                  ? "bg-muted border-2" 
                                  : "bg-muted/30 border-2 border-transparent opacity-60 hover:opacity-80"
                              }`}
                              style={{
                                borderColor: isSelected ? axis.color : "transparent"
                              }}
                            >
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${axis.color}20` }}
                              >
                                <Icon className="h-4 w-4" style={{ color: axis.color }} />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="font-medium text-sm">{axis.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {axis.description}
                                </div>
                              </div>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleClimaticAxis(axis.id)}
                              />
                            </button>
                          );
                        })}
                      </div>
                      {selectedClimaticAxes.size > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            {selectedClimaticAxes.size} axe{selectedClimaticAxes.size > 1 ? 's' : ''} sélectionné{selectedClimaticAxes.size > 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>

                {/* Filtre par molécule dominante */}
                <Card className="border-violet-200 dark:border-violet-800">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FlaskConical className="h-5 w-5 text-violet-600" />
                        Molécule
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMoleculeFilter(!showMoleculeFilter)}
                      >
                        {showMoleculeFilter ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                      </Button>
                    </div>
                    <CardDescription className="text-xs">
                      Filtrer par molécule dominante
                    </CardDescription>
                  </CardHeader>
                  {showMoleculeFilter && (
                    <CardContent className="space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Ex: Limonène, Myrcène, Linalool..."
                          value={moleculeFilter}
                          onChange={e => setMoleculeFilter(e.target.value)}
                          className="w-full border rounded px-3 py-2 text-sm bg-background pr-8"
                        />
                        {moleculeFilter && (
                          <button
                            onClick={() => setMoleculeFilter("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      {moleculeFilter && (
                        <p className="text-xs text-violet-600">
                          {filteredPlants.length} plante{filteredPlants.length !== 1 ? 's' : ''} contenant « {moleculeFilter} »
                        </p>
                      )}
                      {!moleculeFilter && (
                        <div className="space-y-1">
                          {["Limonène", "Myrcène", "Linalool", "Caryophyllène", "Pinene", "Terpinolene"].map(mol => (
                            <button
                              key={mol}
                              onClick={() => setMoleculeFilter(mol)}
                              className="text-xs px-2 py-1 rounded bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 mr-1 mb-1"
                            >
                              {mol}
                            </button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>

                {/* Légende */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Légende
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {PLANT_CATEGORIES.filter(c => selectedCategories.has(c.id)).map(category => (
                        <div key={category.id} className="flex items-center gap-2 text-sm">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                          <span className="text-muted-foreground ml-auto">
                            ({categoryStats[category.id] || 0})
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Plante sélectionnée */}
                {selectedPlant && (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Leaf className="h-5 w-5" />
                          Sélection
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPlant(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h3 className="font-semibold">{selectedPlant.name}</h3>
                        {selectedPlant.latinName && (
                          <p className="text-sm text-muted-foreground italic">{selectedPlant.latinName}</p>
                        )}
                      </div>
                      {selectedPlant.family && (
                        <p className="text-sm"><strong>Famille:</strong> {selectedPlant.family}</p>
                      )}
                      {selectedPlant.origin && (
                        <p className="text-sm"><strong>Origine:</strong> {selectedPlant.origin}</p>
                      )}
                      {selectedPlant.olfactiveSignature && (
                        <p className="text-sm"><strong>Signature:</strong> {selectedPlant.olfactiveSignature}</p>
                      )}
                      <Link href={`/plantes/${selectedPlant.id}`}>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          Voir la fiche complète
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Carte */}
              <div className="lg:col-span-3">
                <Card>
                  <CardContent className="p-0 overflow-hidden rounded-lg">
                    {isLoading ? (
                      <Skeleton className="h-[500px] md:h-[700px] w-full" />
                    ) : (
                      <MapView 
                        className="h-[500px] md:h-[700px] w-full"
                        initialCenter={{ lat: 10, lng: -40 }}
                        initialZoom={3}
                        onMapReady={handleMapReady}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Liste des plantes filtrées */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Plantes affichées ({filteredPlants.length})
                </CardTitle>
                <CardDescription>
                  Liste des plantes correspondant aux filtres sélectionnés
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredPlants.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucune plante ne correspond aux filtres sélectionnés.
                    <br />
                    <Button variant="link" onClick={selectAll}>Afficher toutes les catégories</Button>
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredPlants.map(plant => {
                      const category = PLANT_CATEGORIES.find(c => c.id === plant.category);
                      return (
                        <div
                          key={plant.id}
                          className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedPlant(plant)}
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `${category?.color || '#94a3b8'}20` }}
                            >
                              <MapPin className="h-4 w-4" style={{ color: category?.color || '#94a3b8' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{plant.name}</h4>
                              {plant.latinName && (
                                <p className="text-xs text-muted-foreground italic truncate">{plant.latinName}</p>
                              )}
                              <Badge 
                                variant="secondary" 
                                className="mt-1 text-xs"
                                style={{ 
                                  backgroundColor: `${category?.color || '#94a3b8'}20`,
                                  color: category?.color || '#94a3b8'
                                }}
                              >
                                {category?.name || plant.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
