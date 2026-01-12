import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Sparkles, ChevronRight, Search, X, Filter } from "lucide-react";
import { SearchBar } from "@/components/filters/SearchBar";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { ViewToggle, useViewMode } from "@/components/ViewToggle";
import { GridSkeleton, FilterBarSkeleton } from "@/components/skeletons";

const TEXTURE_LABELS: Record<string, string> = {
  sec: "Sec",
  humide: "Humide",
  lactone: "Lactone",
  resine: "Résine",
  pierre: "Pierre",
  air: "Air",
};

/**
 * AccordsContent - The core content of the accords list page
 * 
 * This component contains all the functionality of the Accords page
 * but without the Header/Footer wrapper, making it embeddable in
 * the consolidated RecettesHub page.
 */
export function AccordsContent() {
  const { data: accords, isLoading } = trpc.accords.list.useQuery();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [textureFilter, setTextureFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [viewMode, setViewMode] = useViewMode("accords-view-mode", "grid");

  // Extract unique textures for filter
  const textures = useMemo(() => {
    if (!accords) return [];
    const uniqueTextures = new Set(accords.map(a => a.texture).filter(Boolean));
    return Array.from(uniqueTextures).map(t => ({ 
      value: t!, 
      label: TEXTURE_LABELS[t!] || t! 
    }));
  }, [accords]);

  // Filter accords
  const filteredAccords = useMemo(() => {
    if (!accords) return [];
    
    return accords.filter(accord => {
      const matchesSearch = 
        accord.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        accord.olfactiveProfile?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        accord.emotionalResonance?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTexture = 
        textureFilter === "all" || accord.texture === textureFilter;
      
      return matchesSearch && matchesTexture;
    });
  }, [accords, searchQuery, textureFilter]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (textureFilter !== "all") count++;
    return count;
  }, [searchQuery, textureFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setTextureFilter("all");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <FilterBarSkeleton />
        <GridSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="space-y-4">
        {/* Search and Toggle */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher un accord..."
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtres
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FilterSelect
                  label="Texture"
                  value={textureFilter}
                  onChange={setTextureFilter}
                  options={[{ value: "all", label: "Toutes" }, ...textures]}
                />
              </div>
              
              {activeFilterCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredAccords.length} accord{filteredAccords.length > 1 ? "s" : ""} trouvé{filteredAccords.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Results Grid */}
      {filteredAccords.length === 0 ? (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun accord trouvé</h3>
          <p className="text-muted-foreground mb-4">
            Essayez de modifier vos critères de recherche
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className={`grid gap-4 ${viewMode === "compact" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : viewMode === "list" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
          {filteredAccords.map((accord) => (
            <Link key={accord.id} href={`/recettes?search=${encodeURIComponent(accord.name)}`}>
              <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full">
                <CardHeader className={viewMode === "compact" ? "p-4" : ""}>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className={`group-hover:text-primary transition-colors flex items-center gap-2 ${viewMode === "compact" ? "text-base" : "text-xl"}`}>
                      {accord.name}
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardTitle>
                    {accord.texture && (
                      <Badge variant="outline" className="shrink-0">
                        {TEXTURE_LABELS[accord.texture] || accord.texture}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                {viewMode !== "compact" && (
                  <CardContent className="space-y-4">
                    {accord.olfactiveProfile && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Profil Olfactif</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {accord.olfactiveProfile}
                        </p>
                      </div>
                    )}
                    
                    {accord.emotionalResonance && viewMode !== "list" && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Résonance Émotionnelle</h4>
                        <p className="text-sm text-muted-foreground italic line-clamp-2">
                          {accord.emotionalResonance}
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-2 flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <Search className="h-3 w-3 mr-1" />
                      Voir les recettes avec cet accord
                    </div>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default AccordsContent;
