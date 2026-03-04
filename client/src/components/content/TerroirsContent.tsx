// @ts-nocheck
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Plus, 
  Filter,
  MapPin,
  Mountain,
  Thermometer,
  Droplets,
  TreeDeciduous,
  Globe,
  Award,
  Grid3X3,
  List,
  X,
  ChevronRight,
  Leaf
} from "lucide-react";

// Mapping des types de climat vers des icônes et couleurs
const climateConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  tropical: { icon: <Thermometer className="w-3 h-3" />, color: "bg-orange-500/20 text-orange-400", label: "Tropical" },
  subtropical: { icon: <Thermometer className="w-3 h-3" />, color: "bg-yellow-500/20 text-yellow-400", label: "Subtropical" },
  mediterranean: { icon: <Thermometer className="w-3 h-3" />, color: "bg-amber-500/20 text-amber-400", label: "Méditerranéen" },
  oceanic: { icon: <Droplets className="w-3 h-3" />, color: "bg-blue-500/20 text-blue-400", label: "Océanique" },
  continental: { icon: <Mountain className="w-3 h-3" />, color: "bg-gray-500/20 text-gray-400", label: "Continental" },
  arid: { icon: <Thermometer className="w-3 h-3" />, color: "bg-red-500/20 text-red-400", label: "Aride" },
  semi_arid: { icon: <Thermometer className="w-3 h-3" />, color: "bg-orange-400/20 text-orange-300", label: "Semi-aride" },
  alpine: { icon: <Mountain className="w-3 h-3" />, color: "bg-sky-500/20 text-sky-400", label: "Alpin" },
  equatorial: { icon: <TreeDeciduous className="w-3 h-3" />, color: "bg-green-500/20 text-green-400", label: "Équatorial" },
  temperate: { icon: <Droplets className="w-3 h-3" />, color: "bg-teal-500/20 text-teal-400", label: "Tempéré" },
  other: { icon: <Globe className="w-3 h-3" />, color: "bg-slate-500/20 text-slate-400", label: "Autre" },
};

// Mapping des qualités vers des couleurs
const qualityConfig: Record<string, { color: string; label: string }> = {
  exceptional: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Exceptionnel" },
  excellent: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Excellent" },
  good: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Bon" },
  standard: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30", label: "Standard" },
  variable: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Variable" },
  unknown: { color: "bg-slate-500/20 text-slate-400 border-slate-500/30", label: "Inconnu" },
};

// Terroir Card Component
function TerroirCard({ terroir, plantCount }: { terroir: any; plantCount: number }) {
  const climate = climateConfig[terroir.climate] || climateConfig.other;
  const quality = qualityConfig[terroir.quality] || qualityConfig.unknown;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              {terroir.name}
            </CardTitle>
            {terroir.region && (
              <CardDescription className="text-xs mt-1 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {terroir.region}
                {terroir.country && `, ${terroir.country}`}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={`${climate.color} flex items-center gap-1`}>
            {climate.icon}
            {climate.label}
          </Badge>
          {terroir.quality && (
            <Badge variant="outline" className={`${quality.color} flex items-center gap-1`}>
              <Award className="w-3 h-3" />
              {quality.label}
            </Badge>
          )}
        </div>

        {plantCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Leaf className="w-3 h-3 text-green-500" />
            {plantCount} plante{plantCount > 1 ? "s" : ""} associée{plantCount > 1 ? "s" : ""}
          </div>
        )}

        {terroir.altitude && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mountain className="w-3 h-3" />
            Altitude: {terroir.altitude}m
          </div>
        )}

        {terroir.soilType && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            Sol: {terroir.soilType}
          </p>
        )}

        {terroir.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 italic border-l-2 border-primary/30 pl-2">
            {terroir.description}
          </p>
        )}

        <div className="pt-2 flex justify-end">
          <Link href={`/terroirs/${terroir.id}`}>
            <Button variant="ghost" size="sm" className="text-xs">
              Voir la fiche <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading skeleton
function TerroirsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <Card key={i} className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * TerroirsContent - The core content of the terroirs list page
 */
export function TerroirsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClimate, setSelectedClimate] = useState<string>("all");
  const [selectedQuality, setSelectedQuality] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: terroirs, isLoading } = trpc.terroirs.list.useQuery();
  const { data: plantTerroirs } = trpc.plantTerroirs.list.useQuery();

  // Count plants per terroir
  const plantCountByTerroir = useMemo(() => {
    if (!plantTerroirs) return {};
    return plantTerroirs.reduce((acc: Record<number, number>, pt: any) => {
      acc[pt.terroirId] = (acc[pt.terroirId] || 0) + 1;
      return acc;
    }, {});
  }, [plantTerroirs]);

  const filteredTerroirs = useMemo(() => {
    if (!terroirs) return [];
    return terroirs.filter((terroir: any) => {
      const matchesSearch = 
        terroir.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (terroir.region && terroir.region.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (terroir.country && terroir.country.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesClimate = selectedClimate === "all" || terroir.climate === selectedClimate;
      const matchesQuality = selectedQuality === "all" || terroir.quality === selectedQuality;

      return matchesSearch && matchesClimate && matchesQuality;
    });
  }, [terroirs, searchQuery, selectedClimate, selectedQuality]);

  const climateCounts = useMemo(() => {
    if (!terroirs) return {};
    return terroirs.reduce((acc: any, terroir: any) => {
      const climate = terroir.climate || "other";
      acc[climate] = (acc[climate] || 0) + 1;
      return acc;
    }, {});
  }, [terroirs]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedClimate("all");
    setSelectedQuality("all");
  };

  const hasActiveFilters = searchQuery || selectedClimate !== "all" || selectedQuality !== "all";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <TerroirsGridSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          <MapPin className="w-3 h-3 mr-1" />
          {terroirs?.length || 0} terroirs
        </Badge>
        {Object.entries(climateCounts).slice(0, 5).map(([climate, count]) => {
          const config = climateConfig[climate] || climateConfig.other;
          return (
            <Badge 
              key={climate} 
              variant="outline" 
              className={`cursor-pointer hover:bg-accent ${config.color}`}
              onClick={() => setSelectedClimate(selectedClimate === climate ? "all" : climate)}
            >
              {config.icon}
              <span className="ml-1">{count as number}</span>
            </Badge>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, région, pays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedClimate} onValueChange={setSelectedClimate}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
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
                <SelectItem value="temperate">Tempéré</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedQuality} onValueChange={setSelectedQuality}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Award className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Qualité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes qualités</SelectItem>
                <SelectItem value="exceptional">Exceptionnel</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Bon</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="variable">Variable</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Filtres actifs:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                </Badge>
              )}
              {selectedClimate !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {climateConfig[selectedClimate]?.label || selectedClimate}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedClimate("all")} />
                </Badge>
              )}
              {selectedQuality !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {qualityConfig[selectedQuality]?.label || selectedQuality}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedQuality("all")} />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Effacer tout
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredTerroirs.length} résultat{filteredTerroirs.length !== 1 ? "s" : ""}
        </p>
        <Link href="/terroirs/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau terroir
          </Button>
        </Link>
      </div>

      {/* Terroirs Grid/List */}
      {filteredTerroirs.length === 0 ? (
        <Card className="bg-card/50">
          <CardContent className="py-12 text-center">
            <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun terroir trouvé</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Essayez de modifier vos critères de recherche
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerroirs.map((terroir: any) => (
            <TerroirCard 
              key={terroir.id} 
              terroir={terroir} 
              plantCount={plantCountByTerroir[terroir.id] || 0}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTerroirs.map((terroir: any) => {
            const climate = climateConfig[terroir.climate] || climateConfig.other;
            const quality = qualityConfig[terroir.quality] || qualityConfig.unknown;
            const plantCount = plantCountByTerroir[terroir.id] || 0;
            return (
              <Card key={terroir.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <h3 className="font-medium truncate">{terroir.name}</h3>
                      {terroir.region && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {terroir.region}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 ml-6">
                      <Badge variant="secondary" className={`${climate.color} flex items-center gap-1 text-xs`}>
                        {climate.icon}
                        {climate.label}
                      </Badge>
                      {terroir.quality && (
                        <Badge variant="outline" className={`${quality.color} flex items-center gap-1 text-xs`}>
                          <Award className="w-3 h-3" />
                          {quality.label}
                        </Badge>
                      )}
                      {plantCount > 0 && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Leaf className="w-3 h-3 text-green-500" />
                          {plantCount} plante{plantCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link href={`/terroirs/${terroir.id}`}>
                    <Button variant="ghost" size="sm">
                      Voir <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TerroirsContent;
