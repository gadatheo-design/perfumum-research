/**
 * Page de la carte interactive des terroirs PERFUMUM
 * Visualisation géographique des terroirs et de leurs plantes associées
 */

import { TerroirMap } from "@/components/TerroirMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { MapPin, Leaf, Globe, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TerroirMapPage() {
  // Statistiques des terroirs
  const { data: stats, isLoading: statsLoading } = trpc.plantTerroirs.getNetworkStats.useQuery();
  const { data: terroirs } = trpc.terroirs.getAll.useQuery();

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
    .slice(0, 5);

  return (
    <div className="container py-6 space-y-6">
      {/* En-tête */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Globe className="h-8 w-8 text-primary" />
          Carte des Terroirs
        </h1>
        <p className="text-muted-foreground">
          Explorez les terroirs de production olfactive à travers le monde et découvrez les plantes qui y sont cultivées.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              Terroirs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{terroirs?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">zones géographiques</p>
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
          <TerroirMap className="rounded-b-lg" />
        </CardContent>
      </Card>

      {/* Répartition par climat et pays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Par climat */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition par climat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(climateStats)
                .sort((a, b) => b[1] - a[1])
                .map(([climate, count]) => (
                  <div key={climate} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{climate}</Badge>
                    </div>
                    <span className="text-sm font-medium">{count} terroirs</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Top pays */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top 5 pays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topCountries.map(([country, count], index) => (
                <div key={country} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-4">{index + 1}.</span>
                    <span className="font-medium">{country}</span>
                  </div>
                  <Badge>{count} terroirs</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
