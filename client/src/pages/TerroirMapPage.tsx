/**
 * Page de la carte interactive des terroirs PERFUMUM
 * Visualisation géographique des terroirs et de leurs plantes associées
 * Utilise Leaflet/OpenStreetMap pour une meilleure fiabilité
 */

import { useState, Suspense, lazy } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { MapPin, Leaf, Globe, TrendingUp, Map, List, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TerroirMapLeaflet } from "@/components/TerroirMapLeaflet";
import { Link } from "wouter";

// Couleurs par climat pour les badges
const CLIMATE_COLORS: Record<string, string> = {
  tropical: "bg-green-500/20 text-green-700 border-green-500/30",
  subtropical: "bg-lime-500/20 text-lime-700 border-lime-500/30",
  mediterranean: "bg-amber-500/20 text-amber-700 border-amber-500/30",
  continental: "bg-blue-500/20 text-blue-700 border-blue-500/30",
  arid: "bg-red-500/20 text-red-700 border-red-500/30",
  semi_arid: "bg-orange-500/20 text-orange-700 border-orange-500/30",
  equatorial: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
  alpine: "bg-indigo-500/20 text-indigo-700 border-indigo-500/30",
  oceanic: "bg-cyan-500/20 text-cyan-700 border-cyan-500/30",
};

export default function TerroirMapPage() {
  const [activeTab, setActiveTab] = useState("carte");
  
  // Statistiques des terroirs
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = trpc.plantTerroirs.getNetworkStats.useQuery();
  const { data: terroirs, isLoading: terroirsLoading, refetch: refetchTerroirs } = trpc.terroirs.getAll.useQuery();

  // Compter les terroirs par climat
  const climateStats = terroirs?.reduce((acc, t) => {
    const climate = t.climateType || "non défini";
    acc[climate] = (acc[climate] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Compter les terroirs par pays
  const countryStats = terroirs?.reduce((acc, t) => {
    const country = t.country || "non défini";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const topCountries = Object.entries(countryStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Terroirs avec coordonnées
  const terroirsWithCoords = terroirs?.filter(t => t.latitude && t.longitude) || [];

  const handleRefresh = () => {
    refetchStats();
    refetchTerroirs();
  };

  return (
    <div className="container py-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            Carte des Terroirs
          </h1>
          <p className="text-muted-foreground">
            Explorez les terroirs de production olfactive à travers le monde et découvrez les plantes qui y sont cultivées.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Link href="/graphe-terroir-plante-molecule">
            <Button variant="outline" size="sm">
              Voir le graphe
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              Terroirs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading || terroirsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{terroirs?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {terroirsWithCoords.length} géolocalisés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-500" />
              Plantes liées
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.plantsWithTerroirs || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">plantes avec terroir</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              Relations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalRelations || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">liaisons plante-terroir</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-500" />
              Pays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(countryStats).length}</div>
            <p className="text-xs text-muted-foreground">pays représentés</p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets Carte / Liste */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="carte" className="gap-2">
            <Map className="h-4 w-4" />
            Carte
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <List className="h-4 w-4" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="carte" className="mt-4">
          {/* Carte interactive */}
          <Card>
            <CardHeader>
              <CardTitle>Carte Interactive</CardTitle>
              <CardDescription>
                Cliquez sur un marqueur pour voir les détails du terroir et ses plantes associées.
                Utilisez les filtres de climat pour affiner l'affichage.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <TerroirMapLeaflet className="rounded-b-lg" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          {/* Répartition par climat et pays */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Par climat */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Répartition par climat</CardTitle>
                <CardDescription>
                  Distribution des terroirs selon leur type climatique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(climateStats)
                    .sort((a, b) => b[1] - a[1])
                    .map(([climate, count]) => {
                      const colorClass = CLIMATE_COLORS[climate.toLowerCase().replace(/[- ]/g, "_")] || "bg-gray-500/20 text-gray-700 border-gray-500/30";
                      const percentage = terroirs ? Math.round((count / terroirs.length) * 100) : 0;
                      
                      return (
                        <div key={climate} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={colorClass}>
                              {climate}
                            </Badge>
                            <span className="text-sm font-medium">{count} terroirs ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Top pays */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top pays producteurs</CardTitle>
                <CardDescription>
                  Pays avec le plus grand nombre de terroirs référencés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCountries.map(([country, count], index) => {
                    const percentage = terroirs ? Math.round((count / terroirs.length) * 100) : 0;
                    
                    return (
                      <div key={country} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground w-5">{index + 1}.</span>
                            <span className="font-medium">{country}</span>
                          </div>
                          <Badge variant="secondary">{count} ({percentage}%)</Badge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 ml-7">
                          <div 
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Couverture géographique */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Couverture géographique</CardTitle>
                <CardDescription>
                  État de la géolocalisation des terroirs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-500/10">
                    <div className="text-2xl font-bold text-green-600">{terroirsWithCoords.length}</div>
                    <p className="text-sm text-muted-foreground">Géolocalisés</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-amber-500/10">
                    <div className="text-2xl font-bold text-amber-600">{(terroirs?.length || 0) - terroirsWithCoords.length}</div>
                    <p className="text-sm text-muted-foreground">Sans coordonnées</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-500/10">
                    <div className="text-2xl font-bold text-blue-600">{Object.keys(countryStats).length}</div>
                    <p className="text-sm text-muted-foreground">Pays</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-500/10">
                    <div className="text-2xl font-bold text-purple-600">{Object.keys(climateStats).length}</div>
                    <p className="text-sm text-muted-foreground">Types de climat</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
