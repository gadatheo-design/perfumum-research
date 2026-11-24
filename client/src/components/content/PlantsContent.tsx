import { safeJsonParse } from "@/lib/utils";
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
  Leaf,
  TreeDeciduous,
  Flower2,
  Cigarette,
  Cannabis,
  Droplets,
  Mountain,
  MapPin,
  Beaker,
  Wind,
  Grid3X3,
  List,
  X
} from "lucide-react";

// Category Icon Component
function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, React.ReactNode> = {
    aromatique: <Leaf className="w-4 h-4" />,
    tabac: <Cigarette className="w-4 h-4" />,
    cannabis: <Cannabis className="w-4 h-4" />,
    resine: <Droplets className="w-4 h-4" />,
    bois: <TreeDeciduous className="w-4 h-4" />,
    fleur: <Flower2 className="w-4 h-4" />,
    racine: <Mountain className="w-4 h-4" />,
    autre: <Beaker className="w-4 h-4" />,
  };
  return icons[category] || icons.autre;
}

// Category Badge Component
function CategoryBadge({ category }: { category: string }) {
  const categoryConfig: Record<string, { label: string; color: string }> = {
    aromatique: { label: "Aromatique", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    tabac: { label: "Tabac", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    cannabis: { label: "Cannabis", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    resine: { label: "Résine", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    bois: { label: "Bois", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    fleur: { label: "Fleur", color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
    racine: { label: "Racine", color: "bg-stone-500/20 text-stone-400 border-stone-500/30" },
    autre: { label: "Autre", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  };

  const config = categoryConfig[category] || categoryConfig.autre;

  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
      <CategoryIcon category={category} />
      {config.label}
    </Badge>
  );
}

// Climatic Axis Badge Component
function ClimaticAxisBadge({ axis }: { axis: string | null }) {
  if (!axis) return null;
  
  const axisConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    vent: { icon: <Wind className="w-3 h-3" />, color: "bg-sky-500/20 text-sky-400", label: "Vent" },
    bois: { icon: <TreeDeciduous className="w-3 h-3" />, color: "bg-amber-500/20 text-amber-400", label: "Bois" },
    disparition: { icon: <Droplets className="w-3 h-3" />, color: "bg-violet-500/20 text-violet-400", label: "Disparition" },
    vent_bois: { icon: <Wind className="w-3 h-3" />, color: "bg-emerald-500/20 text-emerald-400", label: "Vent + Bois" },
    bois_disparition: { icon: <TreeDeciduous className="w-3 h-3" />, color: "bg-orange-500/20 text-orange-400", label: "Bois + Disparition" },
    vent_disparition: { icon: <Wind className="w-3 h-3" />, color: "bg-indigo-500/20 text-indigo-400", label: "Vent + Disparition" },
  };

  const config = axisConfig[axis] || axisConfig.vent;

  return (
    <Badge variant="secondary" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

// Plant Card Component
function PlantCard({ plant }: { plant: any }) {
  const botanicalStates = plant.botanicalStates ? 
    safeJsonParse(plant.botanicalStates, []) 
    : [];

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {plant.name}
            </CardTitle>
            {plant.latinName && (
              <CardDescription className="italic text-xs mt-1">
                {plant.latinName}
              </CardDescription>
            )}
          </div>
          {plant.imageUrl && (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
              <img 
                src={plant.imageUrl} 
                alt={plant.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <CategoryBadge category={plant.category} />
          <ClimaticAxisBadge axis={plant.climaticAxis} />
        </div>

        {plant.family && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Famille:</span> {plant.family}
          </div>
        )}

        {plant.origin && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {plant.origin}
          </div>
        )}

        {plant.olfactiveSignature && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {plant.olfactiveSignature}
          </p>
        )}

        {botanicalStates.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {botanicalStates.slice(0, 4).map((state: any, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                État {state.state}
              </Badge>
            ))}
            {botanicalStates.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{botanicalStates.length - 4}
              </Badge>
            )}
          </div>
        )}

        {plant.chemotypes && (
          <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2 line-clamp-1">
            Chémotypes: {plant.chemotypes}
          </p>
        )}

        <div className="pt-2 flex justify-end">
          <Link href={`/plants/${plant.id}`}>
            <Button variant="ghost" size="sm" className="text-xs">
              Voir la fiche →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading skeleton for plants grid
function PlantsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <Card key={i} className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="w-16 h-16 rounded-lg" />
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
 * PlantsContent - The core content of the plants list page
 */
export function PlantsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAxis, setSelectedAxis] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: plants, isLoading } = trpc.plants.list.useQuery();

  const filteredPlants = useMemo(() => {
    if (!plants) return [];
    return plants.filter((plant: any) => {
      const matchesSearch = 
        plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (plant.latinName && plant.latinName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (plant.family && plant.family.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (plant.origin && plant.origin.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || plant.category === selectedCategory;
      const matchesAxis = selectedAxis === "all" || plant.climaticAxis === selectedAxis;

      return matchesSearch && matchesCategory && matchesAxis;
    });
  }, [plants, searchQuery, selectedCategory, selectedAxis]);

  const categoryCounts = useMemo(() => {
    if (!plants) return {};
    return plants.reduce((acc: any, plant: any) => {
      const category = plant.category || "autre";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  }, [plants]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedAxis("all");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedAxis !== "all";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <PlantsGridSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          <Leaf className="w-3 h-3 mr-1" />
          {plants?.length || 0} plantes
        </Badge>
        {Object.entries(categoryCounts).slice(0, 5).map(([cat, count]) => (
          <Badge 
            key={cat} 
            variant="outline" 
            className="cursor-pointer hover:bg-accent"
            onClick={() => setSelectedCategory(selectedCategory === cat ? "all" : cat)}
          >
            <CategoryIcon category={cat} />
            <span className="ml-1">{count as number}</span>
          </Badge>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, famille, origine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                <SelectItem value="aromatique">Aromatique</SelectItem>
                <SelectItem value="tabac">Tabac</SelectItem>
                <SelectItem value="cannabis">Cannabis</SelectItem>
                <SelectItem value="resine">Résine</SelectItem>
                <SelectItem value="bois">Bois</SelectItem>
                <SelectItem value="fleur">Fleur</SelectItem>
                <SelectItem value="racine">Racine</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAxis} onValueChange={setSelectedAxis}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Wind className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Axe climatique" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les axes</SelectItem>
                <SelectItem value="vent">Vent</SelectItem>
                <SelectItem value="bois">Bois</SelectItem>
                <SelectItem value="disparition">Disparition</SelectItem>
                <SelectItem value="vent_bois">Vent + Bois</SelectItem>
                <SelectItem value="bois_disparition">Bois + Disparition</SelectItem>
                <SelectItem value="vent_disparition">Vent + Disparition</SelectItem>
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
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                </Badge>
              )}
              {selectedAxis !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {selectedAxis}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedAxis("all")} />
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
          {filteredPlants.length} résultat{filteredPlants.length !== 1 ? "s" : ""}
        </p>
        <Link href="/plants/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle plante
          </Button>
        </Link>
      </div>

      {/* Plants Grid/List */}
      {filteredPlants.length === 0 ? (
        <Card className="bg-card/50">
          <CardContent className="py-12 text-center">
            <Leaf className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune plante trouvée</h3>
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
          {filteredPlants.map((plant: any) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredPlants.map((plant: any) => (
            <Card key={plant.id} className="hover:bg-accent/50 transition-colors">
              <CardContent className="py-3 flex items-center gap-4">
                {plant.imageUrl && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img 
                      src={plant.imageUrl} 
                      alt={plant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{plant.name}</h3>
                    {plant.latinName && (
                      <span className="text-xs text-muted-foreground italic truncate">
                        {plant.latinName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <CategoryBadge category={plant.category} />
                    <ClimaticAxisBadge axis={plant.climaticAxis} />
                    {plant.origin && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {plant.origin}
                      </span>
                    )}
                  </div>
                </div>
                <Link href={`/plants/${plant.id}`}>
                  <Button variant="ghost" size="sm">
                    Voir →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlantsContent;
