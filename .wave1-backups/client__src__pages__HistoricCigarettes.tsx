// @ts-nocheck
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Cigarette, MapPin, Factory, Calendar, Star, Sparkles } from "lucide-react";

interface HistoricCigarette {
  id: number;
  name: string;
  name_original: string | null;
  region: string | null;
  country: string;
  manufacturer: string | null;
  creation_year: number | null;
  status: string | null;
  format: string | null;
  has_filter: number | null;
  tobacco_composition: string | null;
  intensity: number | null;
  character_description: string | null;
  dominant_notes: string | null;
  perfumery_score: string | null;
  perfumery_applications: string | null;
  perfumery_approach: string | null;
  tier: number | null;
}

export default function HistoricCigarettes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");

  const { data: cigarettes, isLoading, error } = trpc.research.getHistoricCigarettes.useQuery();

  const countries = useMemo(() => {
    if (!cigarettes) return [];
    const uniqueCountries = [...new Set((cigarettes as HistoricCigarette[]).map(c => c.country))];
    return uniqueCountries.sort();
  }, [cigarettes]);

  const filteredCigarettes = useMemo(() => {
    if (!cigarettes) return [];
    return (cigarettes as HistoricCigarette[]).filter(cig => {
      const matchesSearch = searchTerm === "" || 
        cig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cig.name_original && cig.name_original.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cig.manufacturer && cig.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCountry = countryFilter === "all" || cig.country === countryFilter;
      const matchesTier = tierFilter === "all" || String(cig.tier) === tierFilter;
      
      return matchesSearch && matchesCountry && matchesTier;
    });
  }, [cigarettes, searchTerm, countryFilter, tierFilter]);

  const getTierBadge = (tier: number | null) => {
    if (!tier) return null;
    const colors: Record<number, string> = {
      1: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      2: "bg-slate-400/20 text-slate-300 border-slate-400/30",
      3: "bg-orange-600/20 text-orange-400 border-orange-600/30",
    };
    const labels: Record<number, string> = {
      1: "Premium",
      2: "Standard",
      3: "Économique",
    };
    return (
      <Badge variant="outline" className={colors[tier] || ""}>
        {labels[tier] || "Tier " + tier}
      </Badge>
    );
  };

  const getIntensityStars = (intensity: number | null) => {
    if (!intensity) return null;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={"h-3 w-3 " + (i < intensity ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")}
          />
        ))}
      </div>
    );
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      "Chine": "🇨🇳",
      "Iran": "🇮🇷",
      "Russie": "🇷🇺",
      "Ukraine": "🇺🇦",
      "URSS": "☭",
    };
    return flags[country] || "🌍";
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="border-destructive">
            <CardContent className="p-6">
              <p className="text-destructive">Erreur lors du chargement des données: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Cigarette className="h-8 w-8 text-amber-500" />
              Cigarettes Historiques
            </h1>
            <p className="text-muted-foreground mt-2">
              Archive olfactive des marques soviétiques, orientales et chinoises
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, fabricant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les pays</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>
                    {getCountryFlag(country)} {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les tiers</SelectItem>
                <SelectItem value="1">Premium</SelectItem>
                <SelectItem value="2">Standard</SelectItem>
                <SelectItem value="3">Économique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredCigarettes.length} cigarette{filteredCigarettes.length !== 1 ? "s" : ""} trouvée{filteredCigarettes.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCigarettes.map((cig) => (
                <Card key={cig.id} className="group hover:border-amber-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span>{getCountryFlag(cig.country)}</span>
                          {cig.name}
                        </CardTitle>
                        {cig.name_original && (
                          <CardDescription className="text-base mt-1">
                            {cig.name_original}
                          </CardDescription>
                        )}
                      </div>
                      {getTierBadge(cig.tier)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{cig.country}</span>
                      </div>
                      {cig.creation_year && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{cig.creation_year}</span>
                        </div>
                      )}
                      {cig.manufacturer && (
                        <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                          <Factory className="h-3.5 w-3.5" />
                          <span className="truncate">{cig.manufacturer}</span>
                        </div>
                      )}
                    </div>

                    {cig.intensity && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Intensité</span>
                        {getIntensityStars(cig.intensity)}
                      </div>
                    )}

                    {cig.dominant_notes && (
                      <div className="space-y-1">
                        <span className="text-sm font-medium">Notes dominantes</span>
                        <p className="text-sm text-muted-foreground">{cig.dominant_notes}</p>
                      </div>
                    )}

                    {cig.perfumery_score && (
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium">Score Parfumerie</span>
                        </div>
                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-400">
                          {cig.perfumery_score}/10
                        </Badge>
                      </div>
                    )}

                    {cig.perfumery_applications && (
                      <div className="space-y-1">
                        <span className="text-sm font-medium">Applications parfumerie</span>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {cig.perfumery_applications}
                        </p>
                      </div>
                    )}

                    {cig.status && (
                      <Badge 
                        variant="outline" 
                        className={cig.status.includes("Toujours") ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-red-500/10 text-red-400 border-red-500/30"}
                      >
                        {cig.status}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCigarettes.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Cigarette className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Aucune cigarette ne correspond à vos critères</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
