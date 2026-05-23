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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Search, 
  Plus, 
  Filter,
  Leaf,
  TreeDeciduous,
  FlaskConical,
  Beaker,
  Dna,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  MapPin,
  Globe,
  Grid3X3,
  List,
  X,
  ChevronRight
} from "lucide-react";

// Conservation Status Configuration
const conservationStatusConfig: Record<string, { 
  label: string; 
  color: string; 
  icon: React.ReactNode;
  description: string;
}> = {
  critical: { 
    label: "Critique", 
    color: "bg-red-500/20 text-red-400 border-red-500/50", 
    icon: <AlertTriangle className="w-3 h-3" />,
    description: "En danger critique d'extinction"
  },
  endangered: { 
    label: "En danger", 
    color: "bg-orange-500/20 text-orange-400 border-orange-500/50", 
    icon: <AlertCircle className="w-3 h-3" />,
    description: "Risque élevé d'extinction"
  },
  vulnerable: { 
    label: "Vulnérable", 
    color: "bg-amber-500/20 text-amber-400 border-amber-500/50", 
    icon: <ShieldAlert className="w-3 h-3" />,
    description: "Risque d'extinction à moyen terme"
  },
  near_threatened: { 
    label: "Quasi menacé", 
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50", 
    icon: <ShieldAlert className="w-3 h-3" />,
    description: "Proche du seuil de vulnérabilité"
  },
  stable: { 
    label: "Stable", 
    color: "bg-green-500/20 text-green-400 border-green-500/50", 
    icon: <ShieldCheck className="w-3 h-3" />,
    description: "Population stable, préoccupation mineure"
  },
  data_deficient: { 
    label: "Données insuffisantes", 
    color: "bg-gray-500/20 text-gray-400 border-gray-500/50", 
    icon: <HelpCircle className="w-3 h-3" />,
    description: "Informations insuffisantes pour évaluer"
  },
  unknown: { 
    label: "Inconnu", 
    color: "bg-slate-500/20 text-slate-400 border-slate-500/50", 
    icon: <HelpCircle className="w-3 h-3" />,
    description: "Statut non évalué"
  },
};

// Variety Type Configuration
const varietyTypeConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  landrace: { label: "Landrace", color: "bg-emerald-500/20 text-emerald-400", icon: <Leaf className="w-3 h-3" /> },
  cultivar: { label: "Cultivar", color: "bg-blue-500/20 text-blue-400", icon: <FlaskConical className="w-3 h-3" /> },
  chemotype: { label: "Chémotype", color: "bg-purple-500/20 text-purple-400", icon: <Beaker className="w-3 h-3" /> },
  hybrid: { label: "Hybride", color: "bg-pink-500/20 text-pink-400", icon: <Dna className="w-3 h-3" /> },
  clone: { label: "Clone", color: "bg-cyan-500/20 text-cyan-400", icon: <Dna className="w-3 h-3" /> },
  wild: { label: "Sauvage", color: "bg-lime-500/20 text-lime-400", icon: <TreeDeciduous className="w-3 h-3" /> },
  other: { label: "Autre", color: "bg-gray-500/20 text-gray-400", icon: <Leaf className="w-3 h-3" /> },
};

// Variety Card Component
function VarietyCard({ variety }: { variety: any }) {
  const typeConfig = varietyTypeConfig[variety.varietyType] || varietyTypeConfig.other;
  const statusConfig = conservationStatusConfig[variety.conservationStatus] || conservationStatusConfig.unknown;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {variety.name}
            </CardTitle>
            {variety.parentPlantName && (
              <CardDescription className="text-xs mt-1 flex items-center gap-1">
                <Leaf className="w-3 h-3" />
                {variety.parentPlantName}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={`${typeConfig.color} flex items-center gap-1`}>
            {typeConfig.icon}
            {typeConfig.label}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className={`${statusConfig.color} flex items-center gap-1 cursor-help`}>
                {statusConfig.icon}
                {statusConfig.label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{statusConfig.description}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {variety.origin && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Globe className="w-3 h-3" />
            {variety.origin}
          </div>
        )}

        {variety.chemicalProfile && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {variety.chemicalProfile}
          </p>
        )}

        {variety.dominantTerpenes && (
          <div className="flex flex-wrap gap-1">
            {variety.dominantTerpenes.split(',').slice(0, 3).map((terpene: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30">
                {terpene.trim()}
              </Badge>
            ))}
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Link href={`/varieties/${variety.id}`}>
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
function VarietiesGridSkeleton() {
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
 * VarietiesContent - The core content of the varieties list page
 */
export function VarietiesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: varieties, isLoading } = trpc.plantVarieties.list.useQuery();

  const filteredVarieties = useMemo(() => {
    if (!varieties) return [];
    return varieties.filter((variety: any) => {
      const matchesSearch = 
        variety.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (variety.parentPlantName && variety.parentPlantName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (variety.origin && variety.origin.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = selectedType === "all" || variety.varietyType === selectedType;
      const matchesStatus = selectedStatus === "all" || variety.conservationStatus === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [varieties, searchQuery, selectedType, selectedStatus]);

  const typeCounts = useMemo(() => {
    if (!varieties) return {};
    return varieties.reduce((acc: any, variety: any) => {
      const type = variety.varietyType || "other";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }, [varieties]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedStatus("all");
  };

  const hasActiveFilters = searchQuery || selectedType !== "all" || selectedStatus !== "all";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <VarietiesGridSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          <Dna className="w-3 h-3 mr-1" />
          {varieties?.length || 0} variétés
        </Badge>
        {Object.entries(typeCounts).slice(0, 5).map(([type, count]) => {
          const config = varietyTypeConfig[type] || varietyTypeConfig.other;
          return (
            <Badge 
              key={type} 
              variant="outline" 
              className={`cursor-pointer hover:bg-accent ${config.color}`}
              onClick={() => setSelectedType(selectedType === type ? "all" : type)}
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
                placeholder="Rechercher par nom, plante parente, origine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="landrace">Landrace</SelectItem>
                <SelectItem value="cultivar">Cultivar</SelectItem>
                <SelectItem value="chemotype">Chémotype</SelectItem>
                <SelectItem value="hybrid">Hybride</SelectItem>
                <SelectItem value="clone">Clone</SelectItem>
                <SelectItem value="wild">Sauvage</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <ShieldCheck className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
                <SelectItem value="endangered">En danger</SelectItem>
                <SelectItem value="vulnerable">Vulnérable</SelectItem>
                <SelectItem value="near_threatened">Quasi menacé</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="data_deficient">Données insuffisantes</SelectItem>
                <SelectItem value="unknown">Inconnu</SelectItem>
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
              {selectedType !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {varietyTypeConfig[selectedType]?.label || selectedType}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedType("all")} />
                </Badge>
              )}
              {selectedStatus !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {conservationStatusConfig[selectedStatus]?.label || selectedStatus}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedStatus("all")} />
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
          {filteredVarieties.length} résultat{filteredVarieties.length !== 1 ? "s" : ""}
        </p>
        <Link href="/varietes/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle variété
          </Button>
        </Link>
      </div>

      {/* Varieties Grid/List */}
      {filteredVarieties.length === 0 ? (
        <Card className="bg-card/50">
          <CardContent className="py-12 text-center">
            <Dna className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune variété trouvée</h3>
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
          {filteredVarieties.map((variety: any) => (
            <VarietyCard key={variety.id} variety={variety} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredVarieties.map((variety: any) => {
            const typeConfig = varietyTypeConfig[variety.varietyType] || varietyTypeConfig.other;
            const statusConfig = conservationStatusConfig[variety.conservationStatus] || conservationStatusConfig.unknown;
            return (
              <Card key={variety.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{variety.name}</h3>
                      {variety.parentPlantName && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Leaf className="w-3 h-3" />
                          {variety.parentPlantName}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={`${typeConfig.color} flex items-center gap-1 text-xs`}>
                        {typeConfig.icon}
                        {typeConfig.label}
                      </Badge>
                      <Badge variant="outline" className={`${statusConfig.color} flex items-center gap-1 text-xs`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </Badge>
                      {variety.origin && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {variety.origin}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link href={`/varieties/${variety.id}`}>
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

export default VarietiesContent;
