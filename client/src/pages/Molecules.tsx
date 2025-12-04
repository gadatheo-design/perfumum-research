import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import { Loader2, Atom, X, Filter, Check } from "lucide-react";
import { SearchBar } from "@/components/filters/SearchBar";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { getGammeFromOlfactiveProfile } from "@/lib/gammeMapping";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ProfileAutocomplete } from "@/components/filters/ProfileAutocomplete";
import { ActiveFiltersChips } from "@/components/filters/ActiveFiltersChips";
import { FloatingCompareBar } from "@/components/FloatingCompareBar";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Molecules() {
  const { data: molecules, isLoading } = trpc.molecules.list.useQuery();
  const [, setLocation] = useLocation();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("all");
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [concentrationRange, setConcentrationRange] = useState<[number, number]>([0.0001, 0.1]);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedGamme, setSelectedGamme] = useState<GammeType | null>(null);
  
  // Comparison mode state
  const [selectedMolecules, setSelectedMolecules] = useState<number[]>([]);
  const MAX_COMPARISON = 4;
  
  const toggleMoleculeSelection = (moleculeId: number) => {
    setSelectedMolecules(prev => {
      if (prev.includes(moleculeId)) {
        return prev.filter(id => id !== moleculeId);
      }
      if (prev.length >= MAX_COMPARISON) {
        return prev; // Don't add if already at max
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

  // Extract unique olfactive profiles
  const olfactiveProfiles = useMemo(() => {
    if (!molecules) return [];
    const profileSet = new Set<string>();
    molecules.forEach(m => {
      if (m.olfactiveProfile) {
        // Split by comma, semicolon, or newline
        m.olfactiveProfile.split(/[,;\n]/).forEach(p => {
          const trimmed = p.trim();
          if (trimmed) profileSet.add(trimmed);
        });
      }
    });
    return Array.from(profileSet).sort();
  }, [molecules]);

  // Parse concentration from string (e.g., "0.05%" -> 0.05)
  const parseConcentration = (concStr: string | null): number | null => {
    if (!concStr) return null;
    const match = concStr.match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : null;
  };

  // Filter molecules
  const filteredMolecules = useMemo(() => {
    if (!molecules) return [];
    
    return molecules.filter(molecule => {
      // Search filter
      const matchesSearch = 
        molecule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        molecule.olfactiveProfile?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        molecule.emotionalResonance?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Family filter
      const matchesFamily = 
        familyFilter === "all" || molecule.family === familyFilter;
      
      // Olfactive profile filter
      const matchesProfile = 
        selectedProfiles.length === 0 ||
        (molecule.olfactiveProfile && selectedProfiles.some(profile => 
          molecule.olfactiveProfile!.toLowerCase().includes(profile.toLowerCase())
        ));
      
      // Concentration filter
      const conc = parseConcentration(molecule.concentration);
      const matchesConcentration = 
        conc === null || 
        (conc >= concentrationRange[0] && conc <= concentrationRange[1]);
      
      // Gamme filter
      const matchesGamme = 
        !selectedGamme || getGammeFromOlfactiveProfile(molecule.olfactiveProfile) === selectedGamme;
      
      return matchesSearch && matchesFamily && matchesProfile && matchesConcentration && matchesGamme;
    });
  }, [molecules, searchQuery, familyFilter, selectedProfiles, concentrationRange]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFamilyFilter("all");
    setSelectedProfiles([]);
    setConcentrationRange([0.0001, 0.1]);
    setSelectedGamme(null);
  };

  // Toggle profile selection
  const toggleProfile = (profile: string) => {
    setSelectedProfiles(prev => 
      prev.includes(profile) 
        ? prev.filter(p => p !== profile)
        : [...prev, profile]
    );
  };

  // Check if any filter is active
  const hasActiveFilters = 
    searchQuery !== "" || 
    familyFilter !== "all" || 
    selectedProfiles.length > 0 || 
    concentrationRange[0] !== 0.0001 || 
    concentrationRange[1] !== 0.1 ||
    selectedGamme !== null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Atom className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Molécules
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Catalogue des molécules olfactives étudiées dans le cadre de la recherche PERFUMUM. Chaque molécule est documentée avec son profil olfactif, sa résonance émotionnelle et ses propriétés fonctionnelles.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border/40">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {/* Filter toggle */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
                </Button>
              </div>

              {/* Active Filters Chips */}
              <ActiveFiltersChips
                filters={[
                  ...(searchQuery ? [{
                    type: "search" as const,
                    label: "Recherche",
                    value: searchQuery,
                    onRemove: () => setSearchQuery("")
                  }] : []),
                  ...(familyFilter !== "all" ? [{
                    type: "family" as const,
                    label: "Famille",
                    value: familyFilter,
                    onRemove: () => setFamilyFilter("all")
                  }] : []),
                  ...selectedProfiles.map(profile => ({
                    type: "profile" as const,
                    label: "Profil",
                    value: profile,
                    onRemove: () => toggleProfile(profile)
                  })),
                  ...((concentrationRange[0] !== 0.0001 || concentrationRange[1] !== 0.1) ? [{
                    type: "concentration" as const,
                    label: "Concentration",
                    value: `${concentrationRange[0].toFixed(4)}% - ${concentrationRange[1].toFixed(4)}%`,
                    onRemove: () => setConcentrationRange([0.0001, 0.1])
                  }] : []),
                  ...(selectedGamme ? [{
                    type: "gamme" as const,
                    label: "Gamme",
                    value: selectedGamme,
                    onRemove: () => setSelectedGamme(null)
                  }] : [])
                ]}
                onResetAll={resetFilters}
              />

              {showFilters && (
                <div className="space-y-6 p-6 border border-border/40 rounded-lg bg-muted/20">
                  {/* Search & Family */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                     {/* Search Bar */}
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechercher une molécule..."
              />

              {/* Gamme Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-muted-foreground">Gammes :</span>
                <GammeBadge 
                  gamme="petrichor" 
                  size="sm" 
                  className={selectedGamme === 'petrichor' ? 'ring-2 ring-offset-2 ring-gamme-petrichor' : 'opacity-60 hover:opacity-100'}
                  onClick={() => setSelectedGamme(selectedGamme === 'petrichor' ? null : 'petrichor')}
                />
                <GammeBadge 
                  gamme="volcanique" 
                  size="sm" 
                  className={selectedGamme === 'volcanique' ? 'ring-2 ring-offset-2 ring-gamme-volcanique' : 'opacity-60 hover:opacity-100'}
                  onClick={() => setSelectedGamme(selectedGamme === 'volcanique' ? null : 'volcanique')}
                />
                <GammeBadge 
                  gamme="civilisations" 
                  size="sm" 
                  className={selectedGamme === 'civilisations' ? 'ring-2 ring-offset-2 ring-gamme-civilisations' : 'opacity-60 hover:opacity-100'}
                  onClick={() => setSelectedGamme(selectedGamme === 'civilisations' ? null : 'civilisations')}
                />
                <GammeBadge 
                  gamme="glaciaire" 
                  size="sm" 
                  className={selectedGamme === 'glaciaire' ? 'ring-2 ring-offset-2 ring-gamme-glaciaire' : 'opacity-60 hover:opacity-100'}
                  onClick={() => setSelectedGamme(selectedGamme === 'glaciaire' ? null : 'glaciaire')}
                />
                <GammeBadge 
                  gamme="biolab" 
                  size="sm" 
                  className={selectedGamme === 'biolab' ? 'ring-2 ring-offset-2 ring-gamme-biolab' : 'opacity-60 hover:opacity-100'}
                  onClick={() => setSelectedGamme(selectedGamme === 'biolab' ? null : 'biolab')}
                />
              </div>
                    </div>
                    <FilterSelect
                      value={familyFilter}
                      onChange={setFamilyFilter}
                      options={families}
                      placeholder="Famille chimique"
                    />
                  </div>

                  {/* Olfactive Profiles - Autocomplete */}
                  <ProfileAutocomplete
                    profiles={olfactiveProfiles}
                    selectedProfiles={selectedProfiles}
                    onToggleProfile={toggleProfile}
                    onClearAll={() => setSelectedProfiles([])}
                  />

                  {/* Concentration Range */}
                  <div>
                    <label className="text-sm font-semibold mb-3 block">
                      Concentration ({concentrationRange[0].toFixed(4)}% - {concentrationRange[1].toFixed(4)}%)
                    </label>
                    <div className="px-4">
                      <Slider
                        min={0.0001}
                        max={0.1}
                        step={0.0001}
                        value={concentrationRange}
                        onValueChange={(value) => setConcentrationRange(value as [number, number])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>0.0001%</span>
                        <span>0.1%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Results count */}
              <div className="mt-4 text-sm text-muted-foreground">
                {filteredMolecules.length} molécule{filteredMolecules.length > 1 ? "s" : ""} trouvée{filteredMolecules.length > 1 ? "s" : ""}
                {hasActiveFilters && ` sur ${molecules?.length || 0}`}
              </div>
            </div>
          </div>
        </section>

        {/* Molecules List */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredMolecules.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Aucune molécule trouvée</p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={resetFilters}>
                      Réinitialiser les filtres
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMolecules.map((molecule) => (
                    <Link key={molecule.id} href={`/molecule/${molecule.id}`}>
                      <Card className={`hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full ${
                        selectedMolecules.includes(molecule.id) ? 'ring-2 ring-primary' : ''
                      }`}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              {/* Selection checkbox */}
                              <div 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleMoleculeSelection(molecule.id);
                                }}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                                  selectedMolecules.includes(molecule.id)
                                    ? 'bg-primary border-primary'
                                    : 'border-muted-foreground/40 hover:border-primary'
                                }`}
                              >
                                {selectedMolecules.includes(molecule.id) && (
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                )}
                              </div>
                              <CardTitle className="text-xl hover:text-primary transition-colors">
                                {molecule.name}
                              </CardTitle>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <div onClick={(e) => e.preventDefault()}>
                                <FavoriteButton moleculeId={molecule.id} moleculeName={molecule.name} variant="icon" />
                              </div>
                              {getGammeFromOlfactiveProfile(molecule.olfactiveProfile) && (
                                <GammeBadge 
                                  gamme={getGammeFromOlfactiveProfile(molecule.olfactiveProfile)!} 
                                  size="sm" 
                                  showIcon={false}
                                />
                              )}
                              {molecule.family && (
                                <Badge variant="outline">
                                  {molecule.family}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {/* Always show chemical formula */}
                          <p className="text-sm font-mono text-muted-foreground">
                            {molecule.chemicalFormula || "Formule non disponible"}
                          </p>
                          {molecule.concentration && (
                            <p className="text-xs text-muted-foreground">
                              Concentration : {molecule.concentration}
                            </p>
                          )}
                        </CardHeader>
                      <CardContent className="space-y-4">
                        {molecule.olfactiveProfile && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Profil Olfactif</h4>
                            <p className="text-sm text-muted-foreground">
                              {molecule.olfactiveProfile}
                            </p>
                          </div>
                        )}
                        
                        {molecule.emotionalResonance && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Résonance Émotionnelle</h4>
                            <p className="text-sm text-muted-foreground italic">
                              {molecule.emotionalResonance}
                            </p>
                          </div>
                        )}
                        
                        {molecule.functionalEffect && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Effet Fonctionnel</h4>
                            <p className="text-sm text-muted-foreground">
                              {molecule.functionalEffect}
                            </p>
                          </div>
                        )}
                        
                        {molecule.sourceOrigin && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Origine</h4>
                            <p className="text-sm text-muted-foreground">
                              {molecule.sourceOrigin}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 PERFUMUM — Recherche Olfactive</p>
          </div>
        </div>
      </footer>

      {/* Floating Compare Bar */}
      <FloatingCompareBar
        selectedCount={selectedMolecules.length}
        maxCount={MAX_COMPARISON}
        onClear={clearSelection}
        onCompare={() => {
          const ids = selectedMolecules.join(',');
          setLocation(`/compare?ids=${ids}`);
        }}
      />
    </div>
  );
}
