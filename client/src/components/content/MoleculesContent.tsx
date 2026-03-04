// @ts-nocheck
import { useState, useMemo } from "react";
import { ViewToggle, useViewMode } from "@/components/ViewToggle";
import { MoleculeListItem } from "@/components/MoleculeListItem";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import { Loader2, Atom, X, Filter, Check, Beaker, Droplets, Zap, FlaskConical } from "lucide-react";
import { GridSkeleton, FilterBarSkeleton } from "@/components/skeletons";
import { SearchBar } from "@/components/filters/SearchBar";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { getGammeFromOlfactiveProfile } from "@/lib/gammeMapping";
import { FavoriteButton } from "@/components/FavoriteButton";
import { VoirAussi, suggestionsMolecules } from "@/components/VoirAussi";
import { ProfileAutocomplete } from "@/components/filters/ProfileAutocomplete";
import { ActiveFiltersChips } from "@/components/filters/ActiveFiltersChips";
import { FloatingCompareBar } from "@/components/FloatingCompareBar";
import { MiniRadarChart } from "@/components/MiniRadarChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * MoleculesContent - The core content of the molecules list page
 * 
 * This component contains all the functionality of the Molecules page
 * but without the Header/Footer wrapper, making it embeddable in
 * the consolidated MoleculesHub page.
 */
export function MoleculesContent() {
  const { data: molecules, isLoading } = trpc.molecules.list.useQuery();
  const { data: chemicalFamiliesData } = trpc.chemicalFamilies.listWithCount.useQuery();
  const trackEvent = trpc.analytics.trackEvent.useMutation();
  const [, setLocation] = useLocation();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("all");
  const [chemicalClassFilter, setChemicalClassFilter] = useState("all");
  const [chemicalFamilyFilter, setChemicalFamilyFilter] = useState("all");
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [concentrationRange, setConcentrationRange] = useState<[number, number]>([0.0001, 0.1]);
  const [showFilters, setShowFilters] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [selectedGamme, setSelectedGamme] = useState<GammeType | null>(null);
  
  // Radar filters
  const [radarIntensityRange, setRadarIntensityRange] = useState<[number, number]>([0, 100]);
  const [boilingPointRange, setBoilingPointRange] = useState<[number, number]>([0, 500]);
  const [molecularWeightRange, setMolecularWeightRange] = useState<[number, number]>([0, 500]);
  const [radarFreshnessRange, setRadarFreshnessRange] = useState<[number, number]>([0, 100]);
  const [radarWarmthRange, setRadarWarmthRange] = useState<[number, number]>([0, 100]);
  const [radarSweetnessRange, setRadarSweetnessRange] = useState<[number, number]>([0, 100]);
  const [radarSpicinessRange, setRadarSpicinessRange] = useState<[number, number]>([0, 100]);
  const [radarEarthinessRange, setRadarEarthinessRange] = useState<[number, number]>([0, 100]);
  
  // Comparison mode state
  const [selectedMolecules, setSelectedMolecules] = useState<number[]>([]);
  const MAX_COMPARISON = 4;
  
  // View mode (grid/list)
  const [viewMode, setViewMode] = useViewMode("molecules-view-mode", "grid");
  
  const toggleMoleculeSelection = (moleculeId: number) => {
    setSelectedMolecules(prev => {
      if (prev.includes(moleculeId)) {
        return prev.filter(id => id !== moleculeId);
      }
      if (prev.length >= MAX_COMPARISON) {
        return prev;
      }
      return [...prev, moleculeId];
    });
  };
  
  const clearSelection = () => setSelectedMolecules([]);

  // Extract unique families for filter
  const families = useMemo(() => {
    if (!molecules) return [];
    const uniqueFamilies = new Set(molecules.map(m => m.family).filter(Boolean));
    return Array.from(uniqueFamilies).sort().map(f => ({ value: f!, label: f! }));
  }, [molecules]);

  // Chemical class labels
  const chemicalClassLabels: Record<string, string> = {
    terpene: "Terpène",
    sesquiterpene: "Sesquiterpène",
    diterpene: "Diterpène",
    monoterpene: "Monoterpène",
    aldehyde: "Aldéhyde",
    ketone: "Cétone",
    alcohol: "Alcool",
    ester: "Ester",
    ether: "Éther",
    phenol: "Phénol",
    lactone: "Lactone",
    coumarin: "Coumarine",
    musk: "Musc",
    nitrile: "Nitrile",
    sulfur_compound: "Composé soufré",
    heterocyclic: "Hétérocyclique",
    aromatic: "Aromatique",
    aliphatic: "Aliphatique",
    other: "Autre",
  };

  // Extract unique chemical classes
  const chemicalClasses = useMemo(() => {
    if (!molecules) return [];
    const uniqueClasses = new Set(molecules.map(m => m.chemicalClass).filter(Boolean));
    return Array.from(uniqueClasses).sort().map(c => ({
      value: c!,
      label: chemicalClassLabels[c!] || c!,
    }));
  }, [molecules]);

  // Chemical families from DB
  const chemicalFamilies = useMemo(() => {
    if (!chemicalFamiliesData) return [];
    return chemicalFamiliesData.map(cf => ({
      value: cf.id.toString(),
      label: `${cf.name} (${cf.moleculeCount})`,
    }));
  }, [chemicalFamiliesData]);

  // Filter molecules
  const filteredMolecules = useMemo(() => {
    if (!molecules) return [];
    
    return molecules.filter(mol => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          mol.name.toLowerCase().includes(query) ||
          mol.family?.toLowerCase().includes(query) ||
          mol.olfactiveProfile?.toLowerCase().includes(query) ||
          mol.casNumber?.toLowerCase().includes(query) ||
          mol.iupacName?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Family filter
      if (familyFilter !== "all" && mol.family !== familyFilter) return false;
      
      // Chemical class filter
      if (chemicalClassFilter !== "all" && mol.chemicalClass !== chemicalClassFilter) return false;
      
      // Gamme filter
      if (selectedGamme) {
        const molGamme = getGammeFromOlfactiveProfile(mol.olfactiveProfile || "");
        if (molGamme !== selectedGamme) return false;
      }
      
      // Radar intensity filter
      const intensity = mol.radarIntensity ?? 50;
      if (intensity < radarIntensityRange[0] || intensity > radarIntensityRange[1]) return false;
      
      return true;
    });
  }, [molecules, searchQuery, familyFilter, chemicalClassFilter, selectedGamme, radarIntensityRange]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (familyFilter !== "all") count++;
    if (chemicalClassFilter !== "all") count++;
    if (chemicalFamilyFilter !== "all") count++;
    if (selectedGamme) count++;
    if (selectedProfiles.length > 0) count++;
    if (radarIntensityRange[0] > 0 || radarIntensityRange[1] < 100) count++;
    return count;
  }, [searchQuery, familyFilter, chemicalClassFilter, chemicalFamilyFilter, selectedGamme, selectedProfiles, radarIntensityRange]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFamilyFilter("all");
    setChemicalClassFilter("all");
    setChemicalFamilyFilter("all");
    setSelectedGamme(null);
    setSelectedProfiles([]);
    setRadarIntensityRange([0, 100]);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <FilterBarSkeleton />
        <GridSkeleton count={12} />
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
              placeholder="Rechercher une molécule..."
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FilterSelect
                  label="Famille"
                  value={familyFilter}
                  onChange={setFamilyFilter}
                  options={[{ value: "all", label: "Toutes" }, ...families]}
                />
                <FilterSelect
                  label="Classe chimique"
                  value={chemicalClassFilter}
                  onChange={setChemicalClassFilter}
                  options={[{ value: "all", label: "Toutes" }, ...chemicalClasses]}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Intensité radar</label>
                  <Slider
                    value={radarIntensityRange}
                    onValueChange={(v) => setRadarIntensityRange(v as [number, number])}
                    min={0}
                    max={100}
                    step={5}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{radarIntensityRange[0]}</span>
                    <span>{radarIntensityRange[1]}</span>
                  </div>
                </div>
              </div>
              
              {activeFilterCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
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
          {filteredMolecules.length} molécule{filteredMolecules.length !== 1 ? "s" : ""} trouvée{filteredMolecules.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Molecules Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMolecules.map((molecule) => (
            <Card
              key={molecule.id}
              className={`group hover:shadow-lg transition-all cursor-pointer ${
                selectedMolecules.includes(molecule.id) ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <Link href={`/molecule/${molecule.id}`}>
                    <CardTitle className="text-lg hover:text-primary transition-colors">
                      {molecule.name}
                    </CardTitle>
                  </Link>
                  <div className="flex items-center gap-1">
                    <FavoriteButton moleculeId={molecule.id} size="sm" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleMoleculeSelection(molecule.id);
                      }}
                    >
                      {selectedMolecules.includes(molecule.id) ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Atom className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {molecule.family && (
                    <Badge variant="outline" className="text-xs">
                      {molecule.family}
                    </Badge>
                  )}
                  {molecule.chemicalClass && (
                    <Badge variant="secondary" className="text-xs ml-1">
                      {chemicalClassLabels[molecule.chemicalClass] || molecule.chemicalClass}
                    </Badge>
                  )}
                  {molecule.olfactiveProfile && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {molecule.olfactiveProfile}
                    </p>
                  )}
                  {/* Mini Radar */}
                  <div className="h-24 mt-2">
                    <MiniRadarChart
                      data={{
                        intensity: molecule.radarIntensity ?? 50,
                        freshness: molecule.radarFreshness ?? 50,
                        warmth: molecule.radarWarmth ?? 50,
                        sweetness: molecule.radarSweetness ?? 50,
                        spiciness: molecule.radarSpiciness ?? 50,
                        earthiness: molecule.radarEarthiness ?? 50,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMolecules.map((molecule) => (
            <MoleculeListItem
              key={molecule.id}
              molecule={molecule}
              isSelected={selectedMolecules.includes(molecule.id)}
              onToggleSelect={() => toggleMoleculeSelection(molecule.id)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredMolecules.length === 0 && (
        <Card className="p-12 text-center">
          <Atom className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune molécule trouvée</h3>
          <p className="text-muted-foreground mb-4">
            Essayez de modifier vos critères de recherche
          </p>
          <Button variant="outline" onClick={resetFilters}>
            Réinitialiser les filtres
          </Button>
        </Card>
      )}

      {/* Floating Compare Bar */}
      {selectedMolecules.length > 0 && (
        <FloatingCompareBar
          selectedIds={selectedMolecules}
          entityType="molecules"
          onClear={clearSelection}
          maxItems={MAX_COMPARISON}
        />
      )}

      {/* Voir Aussi */}
      <VoirAussi suggestions={suggestionsMolecules} />
    </div>
  );
}

export default MoleculesContent;
