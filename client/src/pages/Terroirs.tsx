// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { TerroirsMap } from "@/components/TerroirsMap";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Mountain, 
  Thermometer, 
  Droplets, 
  Search,
  Plus,
  Globe,
  TreeDeciduous,
  Award,
  ChevronRight,
  ArrowRight,
  Leaf,
  Map,
  BarChart3,
  PieChart,
  TrendingUp,
  Filter,
  X,
  Layers,
  Info,
  Sparkles,
  Database
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mapping des types de climat vers des icônes
const climateIcons: Record<string, React.ReactNode> = {
  tropical: <Thermometer className="h-4 w-4 text-orange-500" />,
  subtropical: <Thermometer className="h-4 w-4 text-yellow-500" />,
  mediterranean: <Thermometer className="h-4 w-4 text-amber-500" />,
  oceanic: <Droplets className="h-4 w-4 text-blue-500" />,
  continental: <Mountain className="h-4 w-4 text-gray-500" />,
  arid: <Thermometer className="h-4 w-4 text-red-500" />,
  semi_arid: <Thermometer className="h-4 w-4 text-orange-400" />,
  alpine: <Mountain className="h-4 w-4 text-blue-300" />,
  equatorial: <TreeDeciduous className="h-4 w-4 text-green-500" />,
};

// Mapping des qualités vers des couleurs
const qualityColors: Record<string, string> = {
  exceptional: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  excellent: "bg-green-500/10 text-green-600 border-green-500/30",
  good: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  standard: "bg-gray-500/10 text-gray-600 border-gray-500/30",
  variable: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  unknown: "bg-gray-500/10 text-gray-500 border-gray-500/30",
};

// Couleurs pour les graphiques par climat
const climateChartColors: Record<string, string> = {
  tropical: "#f97316",
  subtropical: "#eab308",
  mediterranean: "#f59e0b",
  oceanic: "#3b82f6",
  continental: "#6b7280",
  arid: "#ef4444",
  semi_arid: "#fb923c",
  alpine: "#93c5fd",
  equatorial: "#22c55e",
  other: "#8b5cf6",
};

// Composant de statistiques détaillées
function TerroirStatistics({ terroirs, plants, plantTerroirs }: { 
  terroirs: any[]; 
  plants: any[];
  plantTerroirs: any[];
}) {
  // Statistiques par climat
  const climateStats = useMemo(() => {
    const stats: Record<string, number> = {};
    terroirs?.forEach(t => {
      const climate = t.climateType || 'unknown';
      stats[climate] = (stats[climate] || 0) + 1;
    });
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .map(([climate, count]) => ({
        climate,
        count,
        percentage: Math.round((count / terroirs?.length) * 100)
      }));
  }, [terroirs]);

  // Statistiques par pays
  const countryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    terroirs?.forEach(t => {
      const country = t.country || 'Non défini';
      stats[country] = (stats[country] || 0) + 1;
    });
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, count]) => ({
        country,
        count,
        percentage: Math.round((count / terroirs?.length) * 100)
      }));
  }, [terroirs]);

  // Statistiques par qualité
  const qualityStats = useMemo(() => {
    const stats: Record<string, number> = {};
    terroirs?.forEach(t => {
      const quality = t.qualityRating || 'unknown';
      stats[quality] = (stats[quality] || 0) + 1;
    });
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .map(([quality, count]) => ({
        quality,
        count,
        percentage: Math.round((count / terroirs?.length) * 100)
      }));
  }, [terroirs]);

  // Terroirs avec le plus de plantes
  const terroirsWithMostPlants = useMemo(() => {
    const plantCounts: Record<number, { terroir: any; count: number }> = {};
    
    plantTerroirs?.forEach((pt: any) => {
      if (!plantCounts[pt.terroirId]) {
        const terroir = terroirs?.find(t => t.id === pt.terroirId);
        if (terroir) {
          plantCounts[pt.terroirId] = { terroir, count: 0 };
        }
      }
      if (plantCounts[pt.terroirId]) {
        plantCounts[pt.terroirId].count++;
      }
    });
    
    return Object.values(plantCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [terroirs, plantTerroirs]);

  // Terroirs avec coordonnées GPS
  const terroirsWithCoords = terroirs?.filter(t => t.latitude && t.longitude);
  const coordsCoverage = Math.round((terroirsWithCoords.length / terroirs?.length) * 100);

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{terroirs?.length}</p>
                <p className="text-sm text-muted-foreground">Terroirs totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <MapPin className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{countryStats.length}</p>
                <p className="text-sm text-muted-foreground">Pays représentés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Award className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {terroirs?.filter(t => t.qualityRating === 'exceptional' || t.qualityRating === 'excellent').length}
                </p>
                <p className="text-sm text-muted-foreground">Qualité excellente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Map className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{coordsCoverage}%</p>
                <p className="text-sm text-muted-foreground">Géolocalisés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques détaillés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Répartition par climat */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              Répartition par climat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {climateStats.map(({ climate, count, percentage }) => (
                <div key={climate} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 capitalize">
                      {climateIcons[climate] || <Thermometer className="h-4 w-4" />}
                      {climate.replace(/_/g, ' ')}
                    </span>
                    <span className="text-muted-foreground">{count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: climateChartColors[climate] || '#8b5cf6' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top pays */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Top 10 pays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {countryStats.map(({ country, count, percentage }, idx) => (
                <div key={country} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        {idx + 1}
                      </span>
                      {country}
                    </span>
                    <span className="text-muted-foreground">{count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Répartition par qualité */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Répartition par qualité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {qualityStats.map(({ quality, count, percentage }) => (
                <div key={quality} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <Badge className={qualityColors[quality] || qualityColors.unknown}>
                      {quality}
                    </Badge>
                    <span className="text-muted-foreground">{count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="h-full bg-amber-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Terroirs avec le plus de plantes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-500" />
              Terroirs les plus riches en plantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {terroirsWithMostPlants.length > 0 ? (
              <div className="space-y-3">
                {terroirsWithMostPlants.map(({ terroir, count }, idx) => (
                  <Link key={terroir.id} href={`/terroirs/${terroir.id}`}>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-xs font-medium text-green-600">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">{terroir.name}</p>
                          <p className="text-xs text-muted-foreground">{terroir.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                          <Leaf className="h-3 w-3 mr-1" />
                          {count} plantes
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Leaf className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucune liaison plante-terroir trouvée</p>
                <Link href="/plant-terroir-linking">
                  <Button variant="link" size="sm" className="mt-2">
                    Créer des liaisons
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Composant de carte de terroir avec plantes associées
function TerroirCardWithPlants({ terroir, plantTerroirs, plants }: {
  terroir: any;
  plantTerroirs: any[];
  plants: any[];
}) {
  // Trouver les plantes associées à ce terroir
  const associatedPlants = useMemo(() => {
    const plantIds = plantTerroirs
      .filter((pt: any) => pt.terroirId === terroir.id)
      .map((pt: any) => pt.plantId);
    return plants?.filter(p => plantIds.includes(p.id)).slice(0, 5);
  }, [terroir.id, plantTerroirs, plants]);

  return (
    <Link href={`/terroirs/${terroir.id}`}>
      <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                <MapPin className="h-4 w-4 text-primary" />
                {terroir.name}
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <CardDescription>
                {terroir.region && `${terroir.region}, `}{terroir.country}
              </CardDescription>
            </div>
            {terroir.qualityRating && terroir.qualityRating !== "unknown" && (
              <Badge className={qualityColors[terroir.qualityRating]}>
                {terroir.qualityRating}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {terroir.climateType && (
              <Badge variant="outline" className="flex items-center gap-1">
                {climateIcons[terroir.climateType] || <Thermometer className="h-3 w-3" />}
                {terroir.climateType.replace(/_/g, " ")}
              </Badge>
            )}
            {terroir.soilType && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Mountain className="h-3 w-3" />
                {terroir.soilType}
              </Badge>
            )}
            {terroir.altitude && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Mountain className="h-3 w-3" />
                {terroir.altitude}
              </Badge>
            )}
          </div>
          
          {terroir.reputation && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {terroir.reputation}
            </p>
          )}
          
          {/* Plantes associées */}
          {associatedPlants.length > 0 && (
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Leaf className="h-3 w-3" />
                Plantes associées ({associatedPlants.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {associatedPlants.map(plant => (
                  <Badge key={plant.id} variant="secondary" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400">
                    {plant.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {terroir.mainCrops && (
            <div className="flex flex-wrap gap-1">
              {(typeof terroir.mainCrops === 'string' 
                ? safeJsonParse(terroir.mainCrops, []) 
                : terroir.mainCrops
              ).slice(0, 3).map((crop: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {crop}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="pt-2 flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="h-3 w-3 mr-1" />
            Voir les détails
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Terroirs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedClimate, setSelectedClimate] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("grid");
  
  const { data: terroirs, isLoading } = trpc.terroirs?.getAll.useQuery();
  const { data: plants = [] } = trpc.plants?.list.useQuery();
  const { data: plantTerroirs = [] } = trpc.plantTerroirs?.getAll.useQuery();
  
  // Extraire les pays uniques
  const countries = terroirs 
    ? Array.from(new Set(terroirs?.map((t: any) => t.country).filter(Boolean))).sort()
    : [];
  
  // Extraire les climats uniques
  const climates = terroirs
    ? Array.from(new Set(terroirs?.map((t: any) => t.climateType).filter(Boolean))).sort()
    : [];
  
  // Filtrer les terroirs
  const filteredTerroirs = terroirs?.filter((terroir: any) => {
    const matchesSearch = searchQuery === "" || 
      terroir.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      terroir.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      terroir.country?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === "all" || terroir.country === selectedCountry;
    const matchesClimate = selectedClimate === "all" || terroir.climateType === selectedClimate;
    return matchesSearch && matchesCountry && matchesClimate;
  }) || [];
  
  // Grouper par pays
  const terroirsByCountry = filteredTerroirs.reduce((acc: Record<string, any[]>, terroir: any) => {
    const country = terroir.country || "Non défini";
    if (!acc[country]) acc[country] = [];
    acc[country].push(terroir);
    return acc;
  }, {});

  // Nombre de filtres actifs
  const activeFiltersCount = (selectedCountry !== "all" ? 1 : 0) + (selectedClimate !== "all" ? 1 : 0) + (searchQuery ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCountry("all");
    setSelectedClimate("all");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/3 via-transparent to-amber-500/3" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <Badge variant="outline" className="mb-4 px-3 py-1 text-sm border-primary/20 bg-primary/5">
                <Globe className="w-4 h-4 mr-2" />
                Exploration Géographique
              </Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Terroirs{" "}
                <span className="bg-gradient-to-r from-primary via-green-500 to-amber-500 bg-clip-text text-transparent">
                  du Monde
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl">
                Explorez les zones de production et terroirs pour les matières premières aromatiques. 
                Découvrez les plantes associées à chaque région.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container py-8 max-w-7xl">
          {/* Actions rapides */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Link href="/plants">
              <Button variant="outline" className="gap-2">
                <Leaf className="h-4 w-4" />
                Voir les plantes
              </Button>
            </Link>
            <Link href="/carte-terroirs">
              <Button variant="outline" className="gap-2">
                <Map className="h-4 w-4" />
                Carte interactive
              </Button>
            </Link>
            <Link href="/plant-terroir-linking">
              <Button variant="outline" className="gap-2">
                <Layers className="h-4 w-4" />
                Liaisons plantes-terroirs
              </Button>
            </Link>
          </div>
          
          {/* Filtres */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un terroir, pays, région..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les pays</SelectItem>
                    {countries.map((country: string) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedClimate} onValueChange={setSelectedClimate}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Climat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les climats</SelectItem>
                    {climates.map((climate: string) => (
                      <SelectItem key={climate} value={climate} className="capitalize">
                        {climate.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                    <X className="h-4 w-4" />
                    Réinitialiser ({activeFiltersCount})
                  </Button>
                )}
              </div>
              
              {/* Résumé des filtres */}
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4" />
                <span>
                  <strong className="text-foreground">{filteredTerroirs.length}</strong> terroir(s) trouvé(s)
                  {activeFiltersCount > 0 && ` sur ${terroirs?.length || 0}`}
                </span>
              </div>
            </CardContent>
          </Card>
          
          {/* Contenu */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTerroirs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun terroir trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  {activeFiltersCount > 0
                    ? "Aucun terroir ne correspond à vos critères de recherche."
                    : "Commencez par ajouter des terroirs à la base de données."}
                </p>
                {activeFiltersCount > 0 && (
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Réinitialiser les filtres
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="grid" className="gap-1.5">
                  <Layers className="h-4 w-4" />
                  <span className="hidden sm:inline">Grille</span>
                </TabsTrigger>
                <TabsTrigger value="country" className="gap-1.5">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Par pays</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="gap-1.5">
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">Carte</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="gap-1.5">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Stats</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="grid">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {filteredTerroirs.map((terroir: any, idx: number) => (
                    <motion.div
                      key={terroir.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <TerroirCardWithPlants 
                        terroir={terroir} 
                        plantTerroirs={plantTerroirs}
                        plants={plants}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
              
              <TabsContent value="country">
                <div className="space-y-8">
                  {Object.entries(terroirsByCountry)
                    .sort((a, b) => b[1].length - a[1].length)
                    .map(([country, countryTerroirs]) => (
                    <motion.div 
                      key={country}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                        <Globe className="h-5 w-5 text-primary" />
                        {country}
                        <Badge variant="secondary">{countryTerroirs.length}</Badge>
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {countryTerroirs.map((terroir: any) => (
                          <TerroirCardWithPlants 
                            key={terroir.id}
                            terroir={terroir} 
                            plantTerroirs={plantTerroirs}
                            plants={plants}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="map">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="h-5 w-5 text-primary" />
                      Carte interactive des terroirs
                    </CardTitle>
                    <CardDescription>
                      Explorez les terroirs sur la carte. Cliquez sur un marqueur pour voir les détails et les plantes associées.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TerroirsMap 
                      terroirs={filteredTerroirs.map((t: any) => ({
                        id: t.id,
                        terroirId: t.terroirId,
                        name: t.name,
                        country: t.country,
                        region: t.region,
                        latitude: t.latitude,
                        longitude: t.longitude,
                        climateType: t.climateType,
                        soilType: t.soilType,
                        altitude: t.altitude,
                        qualityRating: t.qualityRating,
                        reputation: t.reputation,
                        mainCrops: safeJsonParse(t.mainCrops, []),
                      }))}
                      className="rounded-lg"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="stats">
                <TerroirStatistics 
                  terroirs={terroirs || []} 
                  plants={plants}
                  plantTerroirs={plantTerroirs}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
