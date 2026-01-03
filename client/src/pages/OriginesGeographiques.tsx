import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Globe, MapPin, Search, Thermometer, Mountain, Leaf, Filter, ChevronRight } from "lucide-react";

export default function OriginesGeographiques() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");

  const { data: origins, isLoading } = trpc.geographicOrigins.list.useQuery();

  // Extraire les pays uniques pour le filtre
  const countries = origins 
    ? [...new Set(origins.map((o: any) => o.country))].sort()
    : [];

  // Filtrer les origines
  const filteredOrigins = origins?.filter((origin: any) => {
    const matchesSearch = 
      origin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      origin.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (origin.region && origin.region.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCountry = selectedCountry === "all" || origin.country === selectedCountry;
    
    return matchesSearch && matchesCountry;
  });

  // Grouper par pays
  const originsByCountry = filteredOrigins?.reduce((acc: Record<string, any[]>, origin: any) => {
    if (!acc[origin.country]) {
      acc[origin.country] = [];
    }
    acc[origin.country].push(origin);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-7xl">
        <Breadcrumbs customItems={[{ label: "Origines Géographiques" }]} />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Origines Géographiques</h1>
          </div>
          <p className="text-muted-foreground">
            Explorez les terroirs de production des matières premières parfumantes à travers le monde.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un terroir, une région, un pays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrer par pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les pays</SelectItem>
              {countries.map((country: string) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{origins?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Terroirs documentés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{countries.length}</div>
              <p className="text-sm text-muted-foreground">Pays représentés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {origins?.filter((o: any) => o.latitude && o.longitude).length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Géolocalisés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {origins?.filter((o: any) => o.historicalContext).length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Avec historique</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des origines par pays */}
        {originsByCountry && Object.keys(originsByCountry).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(originsByCountry).sort().map(([country, countryOrigins]: [string, any[]]) => (
              <div key={country}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {country}
                  <Badge variant="secondary" className="ml-2">{countryOrigins.length}</Badge>
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {countryOrigins.map((origin: any) => (
                    <Card key={origin.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                          {origin.name}
                          {origin.terroir && (
                            <Badge variant="outline" className="text-xs">
                              {origin.terroir}
                            </Badge>
                          )}
                        </CardTitle>
                        {origin.region && (
                          <CardDescription>{origin.region}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {/* Informations géographiques */}
                          <div className="flex flex-wrap gap-2 text-sm">
                            {origin.altitude && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Mountain className="h-3 w-3" />
                                {origin.altitude}m
                              </div>
                            )}
                            {origin.climate && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Thermometer className="h-3 w-3" />
                                {origin.climate}
                              </div>
                            )}
                          </div>

                          {/* Type de sol */}
                          {origin.soilType && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Sol: </span>
                              {origin.soilType}
                            </div>
                          )}

                          {/* Période de récolte */}
                          {origin.harvestPeriod && (
                            <div className="flex items-center gap-1 text-sm">
                              <Leaf className="h-3 w-3 text-green-500" />
                              <span className="text-muted-foreground">Récolte: </span>
                              {origin.harvestPeriod}
                            </div>
                          )}

                          {/* Contexte historique (extrait) */}
                          {origin.historicalContext && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {origin.historicalContext}
                            </p>
                          )}

                          {/* Lien vers le détail */}
                          <Link href={`/terroirs/${origin.id}`}>
                            <Button variant="ghost" size="sm" className="w-full mt-2">
                              Voir les détails
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Aucun terroir trouvé</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCountry !== "all" 
                ? "Essayez de modifier vos critères de recherche."
                : "Les terroirs de production seront ajoutés progressivement."}
            </p>
          </div>
        )}

        {/* Note informative */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold mb-2">À propos des terroirs</h3>
          <p className="text-sm text-muted-foreground">
            Les terroirs de production influencent considérablement la qualité et le profil olfactif des matières premières. 
            Le climat, le sol, l'altitude et les méthodes de culture traditionnelles contribuent à créer des caractéristiques 
            uniques pour chaque origine. Cette base de données documente les principaux terroirs utilisés en parfumerie 
            et leurs spécificités.
          </p>
        </div>
      </div>
    </div>
  );
}
