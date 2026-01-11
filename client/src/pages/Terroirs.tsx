import { useState } from "react";
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
  Map
} from "lucide-react";

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

export default function Terroirs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedClimate, setSelectedClimate] = useState<string>("all");
  
  const { data: terroirs, isLoading } = trpc.terroirs.getAll.useQuery();
  
  // Extraire les pays uniques
  const countries = terroirs 
    ? Array.from(new Set(terroirs.map((t: any) => t.country).filter(Boolean)))
    : [];
  
  // Filtrer les terroirs
  const filteredTerroirs = terroirs?.filter((terroir: any) => {
    const matchesSearch = searchQuery === "" || 
      terroir.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      terroir.region?.toLowerCase().includes(searchQuery.toLowerCase());
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        <div className="container py-8 max-w-7xl">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                <Globe className="h-8 w-8 text-primary" />
                Terroirs
              </h1>
              <p className="text-muted-foreground">
                Zones de production et terroirs pour les matières premières aromatiques
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/plants">
                <Button variant="outline">
                  <Leaf className="h-4 w-4 mr-2" />
                  Voir les plantes
                </Button>
              </Link>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un terroir
              </Button>
            </div>
          </div>
          
          {/* Statistiques cliquables */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link href="/terroirs">
              <Card className="hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold group-hover:text-primary transition-colors">{terroirs?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Terroirs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/carte-terroirs">
              <Card className="hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                      <MapPin className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold group-hover:text-green-600 transition-colors">{countries.length}</p>
                      <p className="text-sm text-muted-foreground">Pays</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Card className="hover:shadow-md transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Award className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {terroirs?.filter((t: any) => t.qualityRating === "exceptional" || t.qualityRating === "excellent").length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Excellents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Link href="/plants">
              <Card className="hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                      <TreeDeciduous className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold group-hover:text-blue-600 transition-colors">
                        {terroirs?.filter((t: any) => t.certifications && JSON.parse(JSON.stringify(t.certifications)).length > 0).length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Certifiés</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          {/* Filtres */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un terroir..."
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
                <SelectItem value="tropical">Tropical</SelectItem>
                <SelectItem value="subtropical">Subtropical</SelectItem>
                <SelectItem value="mediterranean">Méditerranéen</SelectItem>
                <SelectItem value="oceanic">Océanique</SelectItem>
                <SelectItem value="continental">Continental</SelectItem>
                <SelectItem value="arid">Aride</SelectItem>
                <SelectItem value="semi_arid">Semi-aride</SelectItem>
                <SelectItem value="alpine">Alpin</SelectItem>
                <SelectItem value="equatorial">Équatorial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Contenu */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 w-3/4 bg-muted rounded" />
                    <div className="h-4 w-1/2 bg-muted rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded" />
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
                  {searchQuery || selectedCountry !== "all" || selectedClimate !== "all"
                    ? "Aucun terroir ne correspond à vos critères de recherche."
                    : "Commencez par ajouter des terroirs pour documenter vos zones de production."}
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un terroir
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="grid" className="space-y-6">
              <TabsList>
                <TabsTrigger value="grid">Grille</TabsTrigger>
                <TabsTrigger value="country">Par pays</TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-1.5">
                  <Map className="h-4 w-4" />
                  Carte
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="grid">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTerroirs.map((terroir: any) => (
                    <Link key={terroir.id} href={`/plants?origin=${encodeURIComponent(terroir.name)}`}>
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
                          {terroir.mainCrops && (
                            <div className="flex flex-wrap gap-1">
                              {(typeof terroir.mainCrops === 'string' 
                                ? JSON.parse(terroir.mainCrops) 
                                : terroir.mainCrops
                              ).slice(0, 3).map((crop: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {crop}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="pt-2 flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <Leaf className="h-3 w-3 mr-1" />
                            Voir les plantes de ce terroir
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="country">
                <div className="space-y-8">
                  {Object.entries(terroirsByCountry).map(([country, countryTerroirs]) => (
                    <div key={country}>
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        {country}
                        <Badge variant="secondary">{countryTerroirs.length}</Badge>
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {countryTerroirs.map((terroir: any) => (
                          <Link key={terroir.id} href={`/plants?origin=${encodeURIComponent(terroir.name)}`}>
                            <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base group-hover:text-primary transition-colors flex items-center gap-1">
                                  {terroir.name}
                                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </CardTitle>
                                {terroir.region && (
                                  <CardDescription>{terroir.region}</CardDescription>
                                )}
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {terroir.climateType && (
                                    <Badge variant="outline" className="text-xs">
                                      {terroir.climateType.replace(/_/g, " ")}
                                    </Badge>
                                  )}
                                  {terroir.qualityRating && terroir.qualityRating !== "unknown" && (
                                    <Badge className={`text-xs ${qualityColors[terroir.qualityRating]}`}>
                                      {terroir.qualityRating}
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="map">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="h-5 w-5 text-primary" />
                      Carte des terroirs
                    </CardTitle>
                    <CardDescription>
                      Explorez les terroirs sur la carte interactive. Cliquez sur un marqueur pour voir les détails.
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
                        mainCrops: typeof t.mainCrops === 'string' ? JSON.parse(t.mainCrops) : t.mainCrops,
                      }))}
                      className="rounded-lg"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
